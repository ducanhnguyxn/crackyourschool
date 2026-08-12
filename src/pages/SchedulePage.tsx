import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, BookOpen, Brain, FileText, Sparkles, Lightbulb, Trash2 } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface StudySession {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: "quiz" | "flashcards" | "pdf" | "ai-tutor" | "mind-map" | "general";
  color: string;
}

const typeConfig = {
  quiz: { icon: Brain, color: "bg-purple-500", label: "Quiz Practice" },
  flashcards: { icon: BookOpen, color: "bg-blue-500", label: "Flashcards" },
  pdf: { icon: FileText, color: "bg-primary", label: "PDF Study" },
  "ai-tutor": { icon: Sparkles, color: "bg-pink-500", label: "AI Tutor" },
  "mind-map": { icon: Lightbulb, color: "bg-green-500", label: "Mind Map" },
  general: { icon: Clock, color: "bg-orange-500", label: "General Study" },
};

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: "1",
      title: "Biology Chapter 5 Review",
      date: new Date(),
      time: "09:00",
      duration: "1 hour",
      type: "pdf",
      color: "bg-primary",
    },
    {
      id: "2",
      title: "Math Quiz Practice",
      date: new Date(),
      time: "14:00",
      duration: "45 min",
      type: "quiz",
      color: "bg-purple-500",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    time: "09:00",
    duration: "1 hour",
    type: "general" as StudySession["type"],
  });

  const selectedDateSessions = sessions.filter(
    (session) => selectedDate && isSameDay(session.date, selectedDate)
  );

  const datesWithSessions = sessions.map((s) => s.date);

  const handleAddSession = () => {
    if (!selectedDate || !newSession.title) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const session: StudySession = {
      id: Date.now().toString(),
      title: newSession.title,
      date: selectedDate,
      time: newSession.time,
      duration: newSession.duration,
      type: newSession.type,
      color: typeConfig[newSession.type].color,
    };

    setSessions([...sessions, session]);
    setNewSession({ title: "", time: "09:00", duration: "1 hour", type: "general" });
    setIsDialogOpen(false);
    toast({
      title: "Session added",
      description: `"${session.title}" scheduled for ${format(selectedDate, "PPP")}`,
    });
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast({
      title: "Session removed",
      description: "Study session has been deleted",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Study Schedule</h1>
          <p className="text-sm md:text-base text-muted-foreground">Plan and organize your study sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Calendar */}
          <Card className="p-4 md:p-6 lg:col-span-1">
            <h2 className="text-lg md:text-xl font-bold mb-4">Calendar</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasSession: datesWithSessions,
              }}
              modifiersStyles={{
                hasSession: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textDecorationColor: "hsl(var(--primary))",
                },
              }}
            />
          </Card>

          {/* Sessions for selected date */}
          <Card className="p-4 md:p-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {selectedDateSessions.length} session(s) scheduled
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Study Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Session Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Biology Chapter Review"
                        value={newSession.title}
                        onChange={(e) =>
                          setNewSession({ ...newSession, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newSession.time}
                          onChange={(e) =>
                            setNewSession({ ...newSession, time: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Select
                          value={newSession.duration}
                          onValueChange={(value) =>
                            setNewSession({ ...newSession, duration: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15 min">15 min</SelectItem>
                            <SelectItem value="30 min">30 min</SelectItem>
                            <SelectItem value="45 min">45 min</SelectItem>
                            <SelectItem value="1 hour">1 hour</SelectItem>
                            <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                            <SelectItem value="2 hours">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="type">Study Type</Label>
                      <Select
                        value={newSession.type}
                        onValueChange={(value: StudySession["type"]) =>
                          setNewSession({ ...newSession, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddSession} className="w-full">
                      Add to Schedule
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedDateSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No study sessions scheduled for this day</p>
                <p className="text-sm">Click "Add Session" to get started</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {selectedDateSessions
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((session) => {
                    const config = typeConfig[session.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={session.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className={`p-2 md:p-3 rounded-full ${config.color}/10 shrink-0`}>
                          <Icon className={`w-4 h-4 md:w-5 md:h-5 ${config.color.replace("bg-", "text-")}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base break-words">{session.title}</h3>
                          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                            <span>{session.time}</span>
                            <span>•</span>
                            <span>{session.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Badge variant="secondary" className="text-xs">{config.label}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSession(session.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
