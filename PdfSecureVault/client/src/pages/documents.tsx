import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DocumentsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Document Management"
          subtitle="Upload, organize, and manage family documents"
        />
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Document Library</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">
              <p>Document management interface is under development</p>
              <p className="text-sm mt-2">Google Drive integration and document organization will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}