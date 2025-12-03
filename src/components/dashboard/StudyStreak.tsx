import { Card } from "@/components/ui/card";
import { Flame, Check } from "lucide-react";

export const StudyStreak = () => {
  const streakDays = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: false },
    { day: "Sat", active: false },
    { day: "Sun", active: false },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flame className="w-6 h-6 text-amber-500" />
          4 Day Streak!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Keep it up! You're doing great 🎉
        </p>
      </div>

      <div className="flex gap-3 justify-between">
        {streakDays.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                day.active
                  ? "bg-amber-400 text-white shadow-lg shadow-amber-400/30"
                  : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
              }`}
            >
              {day.active && <Check className="w-5 h-5" />}
            </div>
            <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
