import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-full">
            What's your learning goal today?
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Your FREE AI Study Partner for{" "}
            <span className="italic">Success & Sanity</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet your new, completely free AI study partner, designed for academic success. 
            From an instant quiz generator and smart summaries to intelligent flashcards, 
            STURIO provides all the tools you need to excel in your study sessions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="font-semibold text-base px-8 py-6 rounded-full border-2 hover:bg-secondary">
              Explore Features
            </Button>
          </div>

          <div className="pt-12">
            <img 
              src={dashboardPreview} 
              alt="STURIO Dashboard Preview showing AI study tools and features" 
              className="w-full rounded-2xl shadow-card-hover border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
