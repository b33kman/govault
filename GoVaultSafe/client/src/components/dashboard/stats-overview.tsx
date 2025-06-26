import { DollarSign, AlertTriangle, Users, Shield, TrendingUp, Clock, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsOverview() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="vault-shadow-card">
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="vault-shadow-card">
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <p>Unable to load dashboard statistics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="vault-shadow-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 govault-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-white w-5 h-5" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-gray-600 text-sm">Total Balance</p>
              <p className="text-xl font-bold text-gray-900">{stats.documentsGrowth}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp size={16} className="mr-1" />
              <span>Updated 2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="vault-shadow-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 govault-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-white w-5 h-5" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-gray-600 text-sm">Active Reminders</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeReminders}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <Clock size={16} className="mr-1" />
              <span>{stats.upcomingDeadlines}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="vault-shadow-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-gray-600 text-sm">Insurance Policies</p>
              <p className="text-xl font-bold text-gray-900">{stats.familyMembers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-blue-600">
              <Eye size={16} className="mr-1" />
              <span>{stats.activeUsers}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="vault-shadow-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 govault-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="text-white w-5 h-5" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-gray-600 text-sm">Upcoming Renewals</p>
              <p className="text-xl font-bold text-gray-900">2</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-red-600">
              <CheckCircle size={16} className="mr-1" />
              <span>Attention needed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
