import { useQuery } from '@tanstack/react-query';
import { DashboardStats, ActivityItem, ReminderItem, CategorySummary } from '@shared/schema';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ['/api/dashboard/activity'],
    refetchInterval: 30000,
  });
}

export function useUpcomingReminders() {
  return useQuery<ReminderItem[]>({
    queryKey: ['/api/dashboard/reminders'],
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useCategorySummary() {
  return useQuery<CategorySummary[]>({
    queryKey: ['/api/dashboard/categories'],
    refetchInterval: 30000,
  });
}

export function useNotificationCount() {
  return useQuery<{ count: number }>({
    queryKey: ['/api/notifications/count'],
    refetchInterval: 30000,
  });
}
