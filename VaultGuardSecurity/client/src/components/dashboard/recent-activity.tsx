import { FileUp, Edit, Share, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRecentActivity } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity();

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'upload':
        return <FileUp className="text-blue-600" size={16} />;
      case 'edit':
        return <Edit className="text-green-600" size={16} />;
      case 'share':
        return <Share className="text-purple-600" size={16} />;
      default:
        return <FileUp className="text-gray-600" size={16} />;
    }
  };

  const getActivityBgColor = (action: string) => {
    switch (action) {
      case 'upload':
        return 'bg-blue-100';
      case 'edit':
        return 'bg-green-100';
      case 'share':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4 mb-6 last:mb-0">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="w-6 h-6" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="vault-shadow-card">
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 mb-6 last:mb-0">
            <div className={`w-10 h-10 ${getActivityBgColor(activity.action)} rounded-full flex items-center justify-center flex-shrink-0`}>
              {getActivityIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.action === 'upload' && activity.document && (
                  <>uploaded <span className="font-medium">{activity.document}</span></>
                )}
                {activity.action === 'edit' && activity.field && (
                  <>updated <span className="font-medium">{activity.field}</span></>
                )}
                {activity.action === 'share' && activity.document && activity.sharedWith && (
                  <>shared <span className="font-medium">{activity.document}</span> with <span className="font-medium">{activity.sharedWith}</span></>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
