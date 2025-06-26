import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUpcomingReminders } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingReminders() {
  const { data: reminders, isLoading } = useUpcomingReminders();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h3>
        </CardHeader>
        <CardContent className="p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4 last:mb-0">
              <Skeleton className="w-2 h-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!reminders || reminders.length === 0) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No upcoming reminders</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vault-shadow-card">
      <CardHeader className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h3>
      </CardHeader>
      <CardContent className="p-6">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center space-x-4 mb-4 last:mb-0">
            <div className={`w-2 h-2 ${getPriorityColor(reminder.priority)} rounded-full flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{reminder.title}</p>
              <p className="text-xs text-gray-500">{reminder.date}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs font-medium">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
