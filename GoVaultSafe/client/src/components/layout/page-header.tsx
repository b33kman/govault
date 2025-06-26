import { useState } from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotificationCount } from '@/hooks/use-dashboard-data';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAddDocument?: () => void;
  showActions?: boolean;
}

export function PageHeader({ 
  title, 
  subtitle, 
  searchPlaceholder = "Search documents and data...",
  onSearch,
  onAddDocument,
  showActions = true
}: PageHeaderProps) {
  const { data: notifications } = useNotificationCount();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  const handleQuickUpload = () => {
    if (onAddDocument) {
      onAddDocument();
    } else {
      // Navigate to documents page for upload
      window.location.href = '/documents';
    }
  };

  const handleNotifications = () => {
    // Toggle notifications panel or navigate to notifications page
    window.location.href = '/notifications';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 border-gray-300"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            </form>
            
            {/* Add Document Button */}
            <Button 
              onClick={handleQuickUpload}
              className="govault-primary text-white flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Document</span>
            </Button>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotifications}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell size={20} />
              {notifications && notifications.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.count > 9 ? '9+' : notifications.count}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}