import { PageHeader } from '@/components/layout/page-header';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { CategoryOverview } from '@/components/dashboard/category-overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickAccess } from '@/components/dashboard/quick-access';
import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders';

export default function Dashboard() {
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleQuickUpload = () => {
    // Navigate to documents page for general upload
    window.location.href = '/documents';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Family Dashboard"
          subtitle="Your comprehensive family information management center"
          searchPlaceholder="Search across all categories..."
          onSearch={handleSearch}
          onAddDocument={handleQuickUpload}
        />
        
        <div className="max-w-7xl mx-auto space-y-6">
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
      </main>
    </div>
  );
}