import { Card } from "@/components/ui/card";
import { Brain, FileText, Sparkles, BookOpen, Lightbulb, Calendar, Flame, Check, TrendingUp, Clock, Target, Trophy } from "lucide-react";

export const Dashboard = () => {
  const streakDays = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: false },
    { day: "Sat", active: false },
    { day: "Sun", active: false },
  ];

  const quickActions = [
    { icon: Brain, label: "AI Quiz", description: "Generate practice questions", color: "text-violet-600", bgColor: "bg-violet-100" },
    { icon: FileText, label: "PDF Summarizer", description: "Analyze your documents", color: "text-amber-600", bgColor: "bg-amber-100" },
    { icon: Sparkles, label: "AI Tutor", description: "Get instant help", color: "text-pink-600", bgColor: "bg-pink-100" },
    { icon: BookOpen, label: "Flashcards", description: "Create new deck", color: "text-sky-600", bgColor: "bg-sky-100" },
    { icon: Lightbulb, label: "Mind Map", description: "Visualize concepts", color: "text-emerald-600", bgColor: "bg-emerald-100" },
    { icon: Calendar, label: "Schedule", description: "Plan your study time", color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const stats = [
    { icon: Clock, label: "Study Time Today", value: "2h 45m", target: "4h goal", progress: 68 },
    { icon: Target, label: "Weekly Goal", value: "12/20 hours", target: "60% complete", progress: 60 },
    { icon: Trophy, label: "Total Points", value: "2,450", target: "+150 this week", progress: 100 },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-background">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-sm rounded-full mb-4">
            INTERACTIVE DASHBOARD
          </div>
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Your Personalized Study Command Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Track your progress, access AI tools, and stay motivated with our beautiful dashboard.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-amber-200/50 dark:border-amber-800/30 bg-white dark:bg-card shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border">
              <h3 className="text-2xl md:text-3xl font-bold">Welcome back, Student! 👋</h3>
              <p className="text-muted-foreground">Here's your study overview for today</p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Streak Card */}
                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        4 Day Streak!
                      </h4>
                      <p className="text-sm text-muted-foreground">Keep it up! You're doing great 🎉</p>
                    </div>
                    <div className="flex gap-3 justify-between">
                      {streakDays.map((day) => (
                        <div key={day.day} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                            day.active
                              ? "bg-amber-400 text-white shadow-lg shadow-amber-400/30"
                              : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
                          }`}>
                            {day.active && <Check className="w-4 h-4 md:w-5 md:h-5" />}
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-lg font-bold mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quickActions.map((action) => (
                        <div key={action.label} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-amber-300 transition-all">
                          <div className={`p-3 rounded-full ${action.bgColor} dark:opacity-80`}>
                            <action.icon className={`w-5 h-5 ${action.color} dark:opacity-90`} />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-sm">{action.label}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      Your Stats
                    </h4>
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
                            <p className="text-base font-bold">{stat.value}</p>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${stat.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/30">
                      <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                        <span className="text-red-500">🎯</span> Daily Challenge
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Complete 3 quizzes today to earn a bonus 100 points!
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
