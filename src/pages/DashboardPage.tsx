import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { StudyStreak } from "@/components/dashboard/StudyStreak";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      refreshProfile();
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is now active. Enjoy unlimited access!",
      });
    }
  }, [searchParams, refreshProfile, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-sm md:text-base text-muted-foreground">Here's your study overview for today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <StudyStreak />
            <QuickActions />
            <RecentActivity />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <StudyStats />
            <UpcomingTasks />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
