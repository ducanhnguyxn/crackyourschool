import { Navigation } from "@/components/Navigation";
import { StudyStreak } from "@/components/dashboard/StudyStreak";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-muted-foreground">Here's your study overview for today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <StudyStreak />
            <QuickActions />
            <RecentActivity />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <StudyStats />
            <UpcomingTasks />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
