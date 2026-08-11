import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardPreview from "@/assets/dashboard-preview.png";

export const Hero = () => {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
          <Badge className="bg-accent text-accent-foreground px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-full">
            What's your learning goal today?
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2">
            CRACK Your STUDY. CRUSH Your EXAMS.{" "}
            <span className="italic">Let AI Keep You Ahead of EVERYONE.</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Meet your new, completely free AI study partner, designed for academic success. 
            From an instant quiz generator and smart summaries to intelligent flashcards, 
            CrackYourSchool provides all the tools you need to excel in your study sessions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4 px-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm md:text-base px-6 md:px-8 py-5 md:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
              <Link to="/dashboard">
                Start Learning Now
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="font-semibold text-sm md:text-base px-6 md:px-8 py-5 md:py-6 rounded-full border-2 hover:bg-secondary w-full sm:w-auto">
              <Link to="#features">
                Explore Features
              </Link>
            </Button>
          </div>

          <div className="pt-8 md:pt-12 px-2">
            <img 
              src={dashboardPreview} 
              alt="CrackYourSchool Dashboard Preview showing AI study tools and features"
              className="w-full rounded-xl md:rounded-2xl shadow-card-hover border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
