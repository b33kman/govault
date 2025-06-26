import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategorySummary } from '@/hooks/use-dashboard-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Umbrella, Gavel, IdCard, Building, Key, FileText, Briefcase, Users } from 'lucide-react';

const categoryIcons = {
  'family ids': IdCard,
  'finance': DollarSign,
  'property': Building,
  'passwords': Key,
  'insurance': Umbrella,
  'taxes': FileText,
  'legal': Gavel,
  'business': Briefcase,
  'contacts': Users,
};

const categoryIconBgs = {
  'family ids': 'bg-indigo-100',
  'finance': 'bg-green-100',
  'property': 'bg-orange-100',
  'passwords': 'bg-yellow-100',
  'insurance': 'bg-blue-100',
  'taxes': 'bg-red-100',
  'legal': 'bg-purple-100',
  'business': 'bg-gray-100',
  'contacts': 'bg-pink-100',
};

const categoryIconColors = {
  'family ids': 'text-indigo-600',
  'finance': 'text-green-600',
  'property': 'text-orange-600',
  'passwords': 'text-yellow-600',
  'insurance': 'text-blue-600',
  'taxes': 'text-red-600',
  'legal': 'text-purple-600',
  'business': 'text-gray-600',
  'contacts': 'text-pink-600',
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
            const categoryKey = category.name.toLowerCase() as keyof typeof categoryIcons;
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
                  <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`${iconColor} w-6 h-6`} />
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
