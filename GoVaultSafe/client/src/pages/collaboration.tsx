import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CollaborationPage() {
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleAddDocument = () => {
    window.location.href = '/documents';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Collaboration"
          subtitle="Real-time collaboration and family member management"
          searchPlaceholder="Search documents and data..."
          onSearch={handleSearch}
          onAddDocument={handleAddDocument}
        />
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Family Collaboration</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">
              <p>Collaboration tools are under development</p>
              <p className="text-sm mt-2">Real-time editing, sharing, and family member access controls will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}