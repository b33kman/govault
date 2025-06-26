import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SearchPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Search"
          subtitle="Find documents and data across your family vault"
        />
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Search</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">
              <p>Advanced search functionality is under development</p>
              <p className="text-sm mt-2">Unified search across Google Drive and Sheets will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}