import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, userId, email } = await req.json();

    if (!plan || !userId || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Price IDs - Replace with your actual Stripe Price IDs
    const priceIds = {
      monthly: Deno.env.get('STRIPE_PRICE_ID_MONTHLY') || 'price_monthly',
      yearly: Deno.env.get('STRIPE_PRICE_ID_YEARLY') || 'price_yearly',
    };

    const priceId = priceIds[plan as keyof typeof priceIds];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or get Stripe customer
    const { data: profile } = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/user_profiles?id=eq.${userId}`,
      {
        headers: {
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
        },
      }
    ).then(res => res.json());

    let customerId = profile?.[0]?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;

      // Update user profile with customer ID
      await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/user_profiles?id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripe_customer_id: customerId,
          }),
        }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/dashboard?success=true`,
      cancel_url: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/pricing?canceled=true`,
      metadata: {
        userId,
        plan,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

