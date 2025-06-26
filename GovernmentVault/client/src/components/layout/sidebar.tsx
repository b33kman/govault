import { Link, useLocation } from 'wouter';
import { Shield, Home, DollarSign, Umbrella, Gavel, Heart, IdCard, Building, Search, BarChart, Settings, MoreVertical, Key, FileText, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCategorySummary } from '@/hooks/use-dashboard-data';

const categoryIcons = {
  'family ids': IdCard,
  'finance': DollarSign,
  'property': Building,
  'passwords': Key,
  'insurance': Umbrella,
  'taxes': FileText,
  'legal': Gavel,
  'business': Briefcase,
  'contacts': Users,
};

const categoryColors = {
  'family ids': 'text-indigo-500',
  'finance': 'text-green-500',
  'property': 'text-orange-500',
  'passwords': 'text-yellow-500',
  'insurance': 'text-blue-500',
  'taxes': 'text-red-500', 
  'legal': 'text-purple-500',
  'business': 'text-gray-600',
  'contacts': 'text-pink-500',
};

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: categories } = useCategorySummary();

  const isActive = (path: string) => {
    return location === path || location.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">GoVAULT</h1>
            <p className="text-xs text-gray-500">Family Information Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/">
          <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            isActive('/') ? 'vault-nav-active' : 'text-gray-700 hover:bg-gray-100'
          }`}>
            <Home size={16} />
            <span>Dashboard</span>
          </div>
        </Link>
        
        <div className="pt-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</p>
          
          {categories?.map((category) => {
            const normalizedName = category.name.toLowerCase();
            const IconComponent = categoryIcons[normalizedName as keyof typeof categoryIcons] || Building;
            const colorClass = categoryColors[normalizedName as keyof typeof categoryColors] || 'text-gray-500';
            
            return (
              <Link key={category.name} href={category.route}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive(category.route) ? 'vault-nav-active' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  <IconComponent size={16} className={colorClass} />
                  <span>{category.name}</span>
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.itemCount}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</p>
          
          <Link href="/search">
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              isActive('/search') ? 'vault-nav-active' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <Search size={16} />
              <span>Search</span>
            </div>
          </Link>
          
          <Link href="/reports">
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              isActive('/reports') ? 'vault-nav-active' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <BarChart size={16} />
              <span>Reports</span>
            </div>
          </Link>
          
          <Link href="/settings">
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              isActive('/settings') ? 'vault-nav-active' : 'text-gray-700 hover:bg-gray-100'
            }`}>
              <Settings size={16} />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
