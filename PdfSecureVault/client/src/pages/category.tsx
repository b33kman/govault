import { useRoute } from 'wouter';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Category() {
  const [, params] = useRoute('/category/:categoryName');
  const categoryName = params?.categoryName || 'Category';

  // Capitalize and format category name
  const formattedName = categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}&category=${categoryName}`;
  };

  const handleQuickUpload = () => {
    console.log('Quick upload clicked for category:', categoryName);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title={formattedName}
          subtitle={`Manage your ${formattedName.toLowerCase()} documents and information`}
          searchPlaceholder={`Search ${formattedName.toLowerCase()}...`}
          onSearch={handleSearch}
          onAddDocument={handleQuickUpload}
        />
        <Card className="vault-shadow-card">
          <CardHeader className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{formattedName} Management</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <p>Category page for {formattedName} is under development</p>
              <p className="text-sm mt-2">Document management and data view will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
