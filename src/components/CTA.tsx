import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-primary-foreground font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>100% Free Forever</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Ready to Transform Your Study Experience?
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Join thousands of students who are already studying smarter with AI. 
              No credit card required, no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-primary hover:bg-white/90 font-semibold text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/dashboard">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="font-semibold text-base px-8 py-6 rounded-full border-2 border-white/30 text-primary-foreground hover:bg-white/10"
              >
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Setup in seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
