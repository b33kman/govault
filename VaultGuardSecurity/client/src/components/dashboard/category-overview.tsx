import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategorySummary } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Umbrella, Gavel, Heart, IdCard, Building } from 'lucide-react';

const categoryIcons = {
  financial: DollarSign,
  insurance: Umbrella,
  legal: Gavel,
  medical: Heart,
  personal_id: IdCard,
  property: Building,
};

const categoryIconBgs = {
  financial: 'bg-green-100',
  insurance: 'bg-blue-100',
  legal: 'bg-purple-100',
  medical: 'bg-red-100',
  personal_id: 'bg-indigo-100',
  property: 'bg-orange-100',
};

const categoryIconColors = {
  financial: 'text-green-600',
  insurance: 'text-blue-600',
  legal: 'text-purple-600',
  medical: 'text-red-600',
  personal_id: 'text-indigo-600',
  property: 'text-orange-600',
};

export function CategoryOverview() {
  const { data: categories, isLoading } = useCategorySummary();

  if (isLoading) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Category Overview</h3>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">All</Button>
              <Button variant="ghost" size="sm">Recent</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Category Overview</h3>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">All</Button>
              <Button variant="ghost" size="sm">Recent</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No categories available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const navigateToCategory = (route: string) => {
    window.location.href = route;
  };

  return (
    <Card className="vault-shadow-card">
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Category Overview</h3>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="ghost" size="sm">Recent</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryKey = category.name.toLowerCase().replace(' ', '_') as keyof typeof categoryIcons;
            const IconComponent = categoryIcons[categoryKey] || Building;
            const iconBg = categoryIconBgs[categoryKey] || 'bg-gray-100';
            const iconColor = categoryIconColors[categoryKey] || 'text-gray-600';

            return (
              <div
                key={category.name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToCategory(category.route)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={iconColor} size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">{category.itemCount} items</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents</span>
                    <span className="font-medium">{category.documentCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-500">{category.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
