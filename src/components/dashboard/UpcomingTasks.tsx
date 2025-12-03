import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Trash2, X } from "lucide-react";

interface Task {
  id: number;
  title: string;
  date: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export const UpcomingTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      title: newTaskTitle,
      date: newTaskDate || "No date",
      priority: "medium",
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDate("");
    setShowAddForm(false);
  };

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
              onCheckedChange={() => toggleTask(task.id)}
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
            <button
              onClick={() => deleteTask(task.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="mt-4 p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Add New Task</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTaskTitle("");
                setNewTaskDate("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Input
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <Input
            placeholder="Date (e.g., Tomorrow, 3:00 PM)"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask} className="w-full">
            Add Task
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mt-4 p-3 rounded-lg border border-dashed border-primary/50 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          + Add New Task
        </button>
      )}
    </Card>
  );
};
