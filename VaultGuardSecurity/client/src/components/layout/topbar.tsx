import { useState } from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationCount } from '@/hooks/use-dashboard-data';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { user } = useAuth();
  const { data: notifications } = useNotificationCount();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleQuickUpload = () => {
    // Open document upload dialog
    console.log('Quick upload clicked');
  };

  const handleNotifications = () => {
    // Open notifications panel
    console.log('Notifications clicked');
  };

  return (
    <header className="govault-primary text-white shadow-lg px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-blue-100">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search documents and data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-white/20 border-white/30 text-white placeholder-blue-200"
            />
            <Search className="absolute left-3 top-3 text-blue-200" size={16} />
          </form>
          
          {/* Quick Actions */}
          <Button 
            onClick={handleQuickUpload}
            className="bg-white/20 hover:bg-white/30 text-white flex items-center space-x-2 border-white/30"
          >
            <Plus size={16} />
            <span>Add Document</span>
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotifications}
            className="relative p-2 text-blue-100 hover:text-white"
          >
            <Bell size={20} />
            {notifications && notifications.count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.count > 9 ? '9+' : notifications.count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
