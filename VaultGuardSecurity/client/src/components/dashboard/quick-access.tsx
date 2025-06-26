import { TrendingUp, Shield, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickAccess() {
  const quickAccessItems = [
    {
      title: 'Financial Summary',
      description: 'View all accounts',
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      action: () => console.log('Navigate to financial summary'),
    },
    {
      title: 'Insurance Overview',
      description: 'All policies',
      icon: Shield,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      action: () => console.log('Navigate to insurance overview'),
    },
    {
      title: 'Emergency Contacts',
      description: 'Critical numbers',
      icon: Phone,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      action: () => console.log('Navigate to emergency contacts'),
    },
  ];

  return (
    <Card className="vault-shadow-card">
      <CardHeader className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {quickAccessItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={item.action}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left justify-start h-auto"
            >
              <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                <item.icon className={item.iconColor} size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
