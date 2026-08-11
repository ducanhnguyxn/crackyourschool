import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const PricingPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const features = {
    free: [
      "2 PDF uploads",
      "30 questions per month",
      "AI-powered summaries",
      "Flashcard generation",
      "Quiz generation",
      "Basic AI tutor access",
    ],
    pro: [
      "Unlimited PDF uploads",
      "Unlimited questions",
      "All AI features",
      "Priority support",
      "Advanced analytics",
      "Export capabilities",
      "Early access to new features",
    ],
  };

  const handleCheckout = async (plan: "monthly" | "yearly") => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(plan);

    try {
      // Create checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          plan,
          userId: user.id,
          email: user.email,
        },
      });

      if (error) throw error;

      if (data?.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to load");
        }

        // Redirect to Stripe Checkout
        const { error: redirectError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (redirectError) {
          throw redirectError;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <Badge className="bg-accent text-accent-foreground px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold px-4">
              Choose Your Plan
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2">
              <CardHeader className="text-center pb-6 md:pb-8 px-4 md:px-6 pt-6">
                <CardTitle className="text-2xl md:text-3xl mb-2">Free</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold">$0</div>
                  <CardDescription className="text-sm md:text-base">Forever</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 pb-6">
                <ul className="space-y-3 md:space-y-4">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs md:text-sm break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
                {user ? (
                  !profile?.is_pro ? (
                    <Button
                      variant="outline"
                      className="w-full font-semibold text-base px-8 py-6 rounded-full border-2"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full font-semibold text-base px-8 py-6 rounded-full border-2 hover:bg-secondary"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  )
                ) : (
                  <Button
                    variant="outline"
                    className="w-full font-semibold text-base px-8 py-6 rounded-full border-2 hover:bg-secondary"
                    onClick={() => navigate("/auth")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-primary shadow-lg">
              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 md:px-4 py-0.5 md:py-1 text-xs md:text-sm font-semibold">
                  <Zap className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 md:pb-8 pt-8 md:pt-6 px-4 md:px-6">
                <CardTitle className="text-2xl md:text-3xl mb-2">Pro</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold">$12</div>
                  <CardDescription className="text-sm md:text-base">per month</CardDescription>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">
                    or <span className="font-semibold text-foreground">$99/year</span> (save $45)
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 pb-6">
                <ul className="space-y-3 md:space-y-4">
                  {features.pro.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs md:text-sm break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3">
                  {profile?.is_pro ? (
                    <Button
                      variant="outline"
                      className="w-full font-semibold text-base px-8 py-6 rounded-full border-2"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                        onClick={() => handleCheckout("monthly")}
                        disabled={loading !== null}
                      >
                        {loading === "monthly" ? "Loading..." : "Start Learning Now"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full font-semibold text-base px-6 py-4 rounded-full border-2 hover:bg-secondary"
                        onClick={() => handleCheckout("yearly")}
                        disabled={loading !== null}
                      >
                        {loading === "yearly" ? "Loading..." : "Save with Yearly ($99/year)"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 md:mt-20 max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 md:space-y-6">
              <div className="border-b pb-3 md:pb-4">
                <h3 className="font-semibold mb-2 text-sm md:text-base">Can I cancel anytime?</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div className="border-b pb-3 md:pb-4">
                <h3 className="font-semibold mb-2 text-sm md:text-base">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  We accept all major credit cards, debit cards, and other payment methods through Stripe.
                </p>
              </div>
              <div className="border-b pb-3 md:pb-4">
                <h3 className="font-semibold mb-2 text-sm md:text-base">Is there a free trial?</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  The free plan is available forever with no credit card required. You can upgrade to Pro anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;

