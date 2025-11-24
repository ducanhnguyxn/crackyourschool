import { Card } from "@/components/ui/card";
import { FileText, Brain, BookOpen, Sparkles, Lightbulb, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      icon: Brain,
      label: "AI Quiz",
      description: "Generate practice questions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FileText,
      label: "PDF Summarizer",
      description: "Analyze your documents",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Sparkles,
      label: "AI Tutor",
      description: "Get instant help",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: BookOpen,
      label: "Flashcards",
      description: "Create new deck",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Lightbulb,
      label: "Mind Map",
      description: "Visualize concepts",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Calendar,
      label: "Schedule",
      description: "Plan your study time",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const isLinked = action.label === "AI Tutor" || action.label === "Mind Map" || action.label === "PDF Summarizer";
          const linkPath = action.label === "AI Tutor" ? "/ai-tutor" : action.label === "Mind Map" ? "/mind-map" : "/pdf-summarizer";
          
          const buttonContent = (
            <>
              <div className={`p-3 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </>
          );

          if (isLinked) {
            return (
              <Link
                key={action.label}
                to={linkPath}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-md group"
              >
                {buttonContent}
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-md group"
            >
              {buttonContent}
            </button>
          );
        })}
      </div>
    </Card>
  );
};
