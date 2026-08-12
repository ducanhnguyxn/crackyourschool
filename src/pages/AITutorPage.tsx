import { ChatInterface } from "@/components/ai-tutor/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AITutorPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-4">
        <div className="container mx-auto px-4 mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Back to dashboard">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">AI Tutor</h1>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default AITutorPage;
