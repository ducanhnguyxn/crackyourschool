import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="w-6 h-6 text-primary" />
              <span>crackyourschool</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <a href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="/#blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </a>
            <a href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </a>
          </div>

          <Link to="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
