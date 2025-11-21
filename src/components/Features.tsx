import { Card } from "@/components/ui/card";
import { BookOpen, Brain, FileText, Zap, Languages, FlaskConical } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Quiz Generator",
    description: "Instantly create engaging quizzes from your lecture notes and study materials.",
    color: "text-yellow-600",
  },
  {
    icon: Brain,
    title: "Smart Summaries",
    description: "Get concise, AI-powered summaries of complex topics in seconds.",
    color: "text-purple-600",
  },
  {
    icon: Languages,
    title: "AI Language Tutor",
    description: "Practice and improve your language skills with an intelligent AI tutor.",
    color: "text-green-600",
  },
  {
    icon: FlaskConical,
    title: "AI Exam Simulator",
    description: "Prepare for exams with realistic practice tests tailored to your needs.",
    color: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Interactive PDF Reader",
    description: "Read and annotate PDFs with AI-powered insights and explanations.",
    color: "text-orange-600",
  },
  {
    icon: BookOpen,
    title: "Smart Flashcards",
    description: "Create and study with intelligent flashcards that adapt to your learning.",
    color: "text-pink-600",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Turn Any Document Into Actionable Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stop manually creating study materials. STURIO's generative AI reads your lecture notes, 
            PDFs, and documents to instantly create engaging quizzes, concise summaries, 
            and effective flashcards, saving you hours of prep time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary/20 group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
