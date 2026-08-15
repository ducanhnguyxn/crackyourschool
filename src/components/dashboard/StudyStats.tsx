import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

const DAILY_GOAL_MINUTES = 4 * 60;
const WEEKLY_GOAL_HOURS = 20;
const POINTS_PER_CORRECT_ANSWER = 10;

const formatHoursMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const StudyStats = () => {
  const { user } = useAuth();
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsThisWeek, setPointsThisWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      const now = new Date();
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      const [sessionsResult, quizResult] = await Promise.all([
        supabase
          .from("study_sessions")
          .select("start_time, end_time")
          .eq("user_id", user.id)
          .gte("start_time", weekStart.toISOString())
          .lte("start_time", weekEnd.toISOString()),
        supabase
          .from("quiz_results")
          .select("score, completed_at")
          .eq("user_id", user.id),
      ]);

      if (sessionsResult.error) {
        console.error("Error fetching study sessions for stats:", sessionsResult.error);
      } else {
        let today = 0;
        let week = 0;
        for (const session of sessionsResult.data || []) {
          const start = new Date(session.start_time);
          const end = new Date(session.end_time);
          const minutes = (end.getTime() - start.getTime()) / 60000;
          week += minutes;
          if (start >= todayStart && start <= todayEnd) {
            today += minutes;
          }
        }
        setTodayMinutes(today);
        setWeekMinutes(week);
      }

      if (quizResult.error) {
        console.error("Error fetching quiz results for stats:", quizResult.error);
      } else {
        let total = 0;
        let thisWeek = 0;
        for (const result of quizResult.data || []) {
          const points = (result.score || 0) * POINTS_PER_CORRECT_ANSWER;
          total += points;
          const completedAt = result.completed_at ? new Date(result.completed_at) : null;
          if (completedAt && completedAt >= weekStart && completedAt <= weekEnd) {
            thisWeek += points;
          }
        }
        setTotalPoints(total);
        setPointsThisWeek(thisWeek);
      }

      setIsLoading(false);
    };

    fetchStats();
  }, [user]);

  const weekHours = weekMinutes / 60;
  const weeklyProgress = Math.min((weekHours / WEEKLY_GOAL_HOURS) * 100, 100);
  const dailyProgress = Math.min((todayMinutes / DAILY_GOAL_MINUTES) * 100, 100);

  const stats = [
    {
      icon: Clock,
      label: "Study Time Today",
      value: formatHoursMinutes(todayMinutes),
      target: `${DAILY_GOAL_MINUTES / 60}h goal`,
      progress: dailyProgress,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Weekly Goal",
      value: `${weekHours.toFixed(1)}/${WEEKLY_GOAL_HOURS} hours`,
      target: `${Math.round(weeklyProgress)}% complete`,
      progress: weeklyProgress,
      color: "text-purple-500",
    },
    {
      icon: Trophy,
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      target: `+${pointsThisWeek.toLocaleString()} this week`,
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
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-3" />
          Loading your stats...
        </div>
      ) : (
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
      )}

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <p className="text-sm font-semibold mb-1">🎯 Daily Challenge</p>
        <p className="text-xs text-muted-foreground">
          Complete 3 quizzes today to earn a bonus 100 points!
        </p>
      </div>
    </Card>
  );
};
