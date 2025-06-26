import { PageHeader } from '@/components/layout/page-header';
import { DocumentUpload } from '@/components/documents/document-upload';

export default function DocumentsPage() {
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Document Management"
          subtitle="AI-powered document upload with automatic data extraction"
          searchPlaceholder="Search documents and data..."
          onSearch={handleSearch}
          showActions={false}
        />
        <DocumentUpload />
      </main>
    </div>
  );
}