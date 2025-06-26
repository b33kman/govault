import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Reports"
          subtitle="Generate insights and reports from your family data"
        />
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Family Vault Reports</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">
              <p>Reporting and analytics features are under development</p>
              <p className="text-sm mt-2">Financial summaries, document tracking, and insights will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}