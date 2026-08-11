# Stripe Integration Setup Guide

This guide will help you set up Stripe subscriptions for the pricing page.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Supabase project with the migrations applied

## Step 1: Create Stripe Products and Prices

1. Go to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Products** → **Add Product**
3. Create two products:

   **Product 1: Pro Monthly**
   - Name: "Pro Monthly"
   - Pricing: $12/month (recurring)
   - Copy the **Price ID** (starts with `price_`)

   **Product 2: Pro Yearly**
   - Name: "Pro Yearly"
   - Pricing: $99/year (recurring)
   - Copy the **Price ID** (starts with `price_`)

## Step 2: Get Stripe API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_`)
3. Copy your **Secret key** (starts with `sk_`)

## Step 3: Set Up Environment Variables

### Frontend (.env or .env.local)

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Supabase Edge Functions

In your Supabase Dashboard, go to **Project Settings** → **Edge Functions** → **Secrets** and add:

```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://yourdomain.com (or http://localhost:5173 for local)
```

## Step 4: Set Up Stripe Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)

### Add Webhook Secret to Supabase

In Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**, add:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 5: Deploy Edge Functions

### Option A: Using npx (No Installation Required - Recommended for Windows)

```powershell
# Login to Supabase (use npx to run without installing)
npx supabase login

# Link your project
npx supabase link --project-ref your-project-ref

# Deploy functions
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
```

### Option B: Install Supabase CLI via Scoop (Windows)

```powershell
# First, install Scoop if you don't have it
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Then install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Now you can use supabase commands directly
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### Option C: Direct Download (Windows)

1. Go to https://github.com/supabase/cli/releases
2. Download the latest `supabase_windows_amd64.zip`
3. Extract and add to your PATH, or run directly from the extracted folder

## Step 6: Apply Database Migrations

Make sure you've applied both migrations:
1. `20250101000000_add_auth_and_user_data.sql`
2. `20250102000000_add_subscriptions.sql`

You can apply them via:
- Supabase Dashboard → SQL Editor
- Or using Supabase CLI: `supabase db push`

## Step 7: Test the Integration

1. **Test Mode**: Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

2. **Test Flow**:
   - Go to `/pricing`
   - Click "Start Learning Now" on Pro plan
   - Complete checkout with test card
   - Verify webhook updates user profile
   - Check that Pro badge appears in navbar

## Production Checklist

Before going live:

- [ ] Switch to Stripe Live mode
- [ ] Update `STRIPE_SECRET_KEY` to live key (`sk_live_...`)
- [ ] Update `VITE_STRIPE_PUBLISHABLE_KEY` to live key (`pk_live_...`)
- [ ] Create live products and update price IDs
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment method
- [ ] Set up monitoring for webhook failures

## Troubleshooting

### Webhook not working?
- Check webhook secret is correct
- Verify webhook endpoint URL is accessible
- Check Supabase function logs for errors
- Ensure webhook events are selected in Stripe

### Checkout not redirecting?
- Verify Stripe publishable key is set
- Check browser console for errors
- Ensure success/cancel URLs are correct

### User not marked as Pro?
- Check webhook is receiving events
- Verify `user_profiles` table exists
- Check function logs for errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly

