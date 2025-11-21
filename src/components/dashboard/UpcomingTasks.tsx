import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, AlertCircle } from "lucide-react";

export const UpcomingTasks = () => {
  const tasks = [
    {
      id: 1,
      title: "Math Assignment Due",
      date: "Today, 11:59 PM",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Review History Notes",
      date: "Tomorrow, 3:00 PM",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Biology Quiz",
      date: "Friday, 10:00 AM",
      priority: "high",
      completed: false,
    },
    {
      id: 4,
      title: "Read Chapter 7",
      date: "Next Week",
      priority: "low",
      completed: true,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Upcoming Tasks
      </h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all ${
              task.completed ? "opacity-50" : ""
            }`}
          >
            <Checkbox
              checked={task.completed}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                </p>
                {task.priority === "high" && !task.completed && (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{task.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 p-3 rounded-lg border border-dashed border-primary/50 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
        + Add New Task
      </button>
    </Card>
  );
};
