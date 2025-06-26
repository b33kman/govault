import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Settings"
          subtitle="Manage your family vault preferences and security"
        />
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Vault Settings</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500">
              <p>Settings and configuration options are under development</p>
              <p className="text-sm mt-2">User management, security settings, and preferences will be available here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}