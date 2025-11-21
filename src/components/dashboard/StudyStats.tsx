import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

export const StudyStats = () => {
  const stats = [
    {
      icon: Clock,
      label: "Study Time Today",
      value: "2h 45m",
      target: "4h goal",
      progress: 68,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Weekly Goal",
      value: "12/20 hours",
      target: "60% complete",
      progress: 60,
      color: "text-purple-500",
    },
    {
      icon: Trophy,
      label: "Total Points",
      value: "2,450",
      target: "+150 this week",
      progress: 100,
      color: "text-primary",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Your Stats
      </h2>
      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.target}</p>
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
            <Progress value={stat.progress} className="h-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <p className="text-sm font-semibold mb-1">🎯 Daily Challenge</p>
        <p className="text-xs text-muted-foreground">
          Complete 3 quizzes today to earn a bonus 100 points!
        </p>
      </div>
    </Card>
  );
};
