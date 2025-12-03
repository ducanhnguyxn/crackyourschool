import { Card } from "@/components/ui/card";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

export const StudyStats = () => {
  const stats = [
    {
      icon: Clock,
      label: "Study Time Today",
      value: "2h 45m",
      target: "4h goal",
      progress: 68,
      progressColor: "bg-amber-400",
    },
    {
      icon: Target,
      label: "Weekly Goal",
      value: "12/20 hours",
      target: "60% complete",
      progress: 60,
      progressColor: "bg-amber-400",
    },
    {
      icon: Trophy,
      label: "Total Points",
      value: "2,450",
      target: "+150 this week",
      progress: 100,
      progressColor: "bg-amber-400",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-amber-500" />
        Your Stats
      </h2>
      <div className="space-y-5">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.target}</p>
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.progressColor} rounded-full transition-all`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/30">
        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
          <span className="text-red-500">🎯</span> Daily Challenge
        </p>
        <p className="text-xs text-muted-foreground">
          Complete 3 quizzes today to earn a bonus 100 points!
        </p>
      </div>
    </Card>
  );
};
