import { useRoute } from 'wouter';
import { PageHeader } from '@/components/layout/page-header';
import { FamilyIDsView } from '@/components/categories/family-ids-view';
import { FinanceView } from '@/components/categories/finance-view';
import { PasswordsView } from '@/components/categories/passwords-view';
import { InsuranceView } from '@/components/categories/insurance-view';
import { PropertyView } from '@/components/categories/property-view';
import { ContactsView } from '@/components/categories/contacts-view';
import { TaxesView } from '@/components/categories/taxes-view';
import { LegalView } from '@/components/categories/legal-view';
import { BusinessView } from '@/components/categories/business-view';
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
    // Navigate to documents page with category pre-selected
    window.location.href = `/documents?category=${categoryName}`;
  };

  const renderCategoryView = () => {
    switch (categoryName) {
      case 'family-ids':
        return <FamilyIDsView />;
      case 'finance':
        return <FinanceView />;
      case 'passwords':
        return <PasswordsView />;
      case 'insurance':
        return <InsuranceView />;
      case 'property':
        return <PropertyView />;
      case 'contacts':
        return <ContactsView />;
      case 'taxes':
        return <TaxesView />;
      case 'legal':
        return <LegalView />;
      case 'business':
        return <BusinessView />;
        return (
          <Card className="vault-shadow-card">
            <CardHeader className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{formattedName} Management</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>Category page for {formattedName} is under development</p>
                <p className="text-sm mt-2">Comprehensive management interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="vault-shadow-card">
            <CardHeader className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Category Not Found</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <p>The requested category does not exist</p>
                <p className="text-sm mt-2">Please select a valid category from the navigation</p>
              </div>
            </CardContent>
          </Card>
        );
    }
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
        {renderCategoryView()}
      </main>
    </div>
  );
}
