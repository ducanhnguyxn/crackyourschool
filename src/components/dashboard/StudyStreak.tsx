import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

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
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            4 Day Streak!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keep it up! You're doing great 🎉
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        {streakDays.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                day.active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {day.active ? "✓" : ""}
            </div>
            <span className="text-xs text-muted-foreground">{day.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
