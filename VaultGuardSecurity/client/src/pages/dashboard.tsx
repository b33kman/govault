import { PageHeader } from '@/components/layout/page-header';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders';
import { QuickAccess } from '@/components/dashboard/quick-access';
import { CategoryOverview } from '@/components/dashboard/category-overview';
import { useAuth } from '@/contexts/auth-context';

export default function Dashboard() {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Dashboard"
          subtitle={`Welcome back, ${firstName}. Here's what's happening with your family vault.`}
        />
        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Sidebar Components */}
          <div className="space-y-6">
            <UpcomingReminders />
            <QuickAccess />
          </div>
        </div>

        {/* Category Quick Preview */}
        <div className="mt-8">
          <CategoryOverview />
        </div>
      </main>
    </div>
  );
}
