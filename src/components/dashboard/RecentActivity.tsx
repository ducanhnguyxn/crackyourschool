import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Brain, BookOpen, CheckCircle2 } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      icon: Brain,
      title: "Completed Biology Quiz",
      description: "Scored 85% on Cell Structure",
      time: "2 hours ago",
      badge: "Quiz",
      badgeVariant: "default" as const,
    },
    {
      icon: FileText,
      title: "Studied Chapter 5",
      description: "Physics - Thermodynamics",
      time: "5 hours ago",
      badge: "Study",
      badgeVariant: "secondary" as const,
    },
    {
      icon: BookOpen,
      title: "Reviewed Flashcards",
      description: "Spanish Vocabulary - 50 cards",
      time: "Yesterday",
      badge: "Review",
      badgeVariant: "outline" as const,
    },
    {
      icon: CheckCircle2,
      title: "Completed Assignment",
      description: "Math Homework Chapter 3",
      time: "2 days ago",
      badge: "Task",
      badgeVariant: "secondary" as const,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
          >
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <activity.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{activity.title}</h3>
                <Badge variant={activity.badgeVariant} className="shrink-0">
                  {activity.badge}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
