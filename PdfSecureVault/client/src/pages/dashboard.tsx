import { StatsOverview } from '@/components/dashboard/stats-overview';
import { CategoryOverview } from '@/components/dashboard/category-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickAccess } from '@/components/dashboard/quick-access';
import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Overview - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CategoryOverview />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          <QuickAccess />
          <UpcomingReminders />
        </div>
      </div>

      {/* Recent Activity - Full width */}
      <RecentActivity />
    </div>
  );
}