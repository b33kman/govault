import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'orange' | 'gray';
  showAlert?: boolean;
}

const colorClasses = {
  green: {
    text: 'text-green-600',
    icon: 'text-green-600',
    bg: 'bg-green-100'
  },
  blue: {
    text: 'text-blue-600',
    icon: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  yellow: {
    text: 'text-yellow-600',
    icon: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  purple: {
    text: 'text-purple-600',
    icon: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  red: {
    text: 'text-red-600',
    icon: 'text-red-600',
    bg: 'bg-red-100'
  },
  orange: {
    text: 'text-orange-600',
    icon: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  gray: {
    text: 'text-gray-600',
    icon: 'text-gray-600',
    bg: 'bg-gray-100'
  }
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  showAlert = false 
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className="vault-shadow-card h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {Icon && (
                <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${colors.icon}`} />
                </div>
              )}
              <div className="min-w-0">
                <div className={`text-2xl font-bold ${colors.text} leading-tight`}>
                  {value}
                </div>
                <p className="text-sm text-gray-600 font-medium">{title}</p>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          {showAlert && Icon && (
            <Icon className={`h-4 w-4 ${colors.icon} flex-shrink-0`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}