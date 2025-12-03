import { Card } from "@/components/ui/card";
import { FileText, Brain, BookOpen, Sparkles, Lightbulb, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      icon: Brain,
      label: "AI Quiz",
      description: "Generate practice questions",
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      icon: FileText,
      label: "PDF Summarizer",
      description: "Analyze your documents",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: Sparkles,
      label: "AI Tutor",
      description: "Get instant help",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      icon: BookOpen,
      label: "Flashcards",
      description: "Create new deck",
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
    },
    {
      icon: Lightbulb,
      label: "Mind Map",
      description: "Visualize concepts",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: Calendar,
      label: "Schedule",
      description: "Plan your study time",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const isLinked = action.label === "AI Tutor" || action.label === "Mind Map" || action.label === "PDF Summarizer" || action.label === "AI Quiz" || action.label === "Flashcards";
          const linkPath = 
            action.label === "AI Tutor" ? "/ai-tutor" : 
            action.label === "Mind Map" ? "/mind-map" : 
            action.label === "PDF Summarizer" ? "/pdf-summarizer" :
            action.label === "AI Quiz" ? "/quiz" :
            action.label === "Flashcards" ? "/flashcards" :
            "#";
          
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
                className="flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-lg group"
              >
                {buttonContent}
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              className="flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-lg group"
            >
              {buttonContent}
            </button>
          );
        })}
      </div>
    </div>
  );
};
