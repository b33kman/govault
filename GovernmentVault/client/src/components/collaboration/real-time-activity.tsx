import { useState, useEffect } from 'react';
import { Users, MessageCircle, Edit, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CollaborationActivity {
  id: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  action: 'viewing' | 'editing' | 'commenting' | 'sharing';
  resource: string;
  resourceType: 'document' | 'data' | 'sheet';
  timestamp: Date;
  isActive: boolean;
}

interface OnlineUser {
  email: string;
  name: string;
  role: string;
  currentResource?: string;
  lastSeen: Date;
}

export function RealTimeActivity() {
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate real-time collaboration data from Google Workspace
    const mockActivities: CollaborationActivity[] = [
      {
        id: '1',
        user: { name: 'Jane Doe', email: 'jane@family.com', role: 'Spouse' },
        action: 'editing',
        resource: 'Insurance Policies Sheet',
        resourceType: 'sheet',
        timestamp: new Date(Date.now() - 30000),
        isActive: true
      },
      {
        id: '2',
        user: { name: 'John Doe', email: 'john@family.com', role: 'Owner' },
        action: 'viewing',
        resource: 'Tax Documents 2024',
        resourceType: 'document',
        timestamp: new Date(Date.now() - 120000),
        isActive: true
      },
      {
        id: '3',
        user: { name: 'Sarah Johnson', email: 'sarah@advisor.com', role: 'Financial Advisor' },
        action: 'commenting',
        resource: 'Investment Portfolio Summary',
        resourceType: 'sheet',
        timestamp: new Date(Date.now() - 300000),
        isActive: false
      }
    ];

    const mockOnlineUsers: OnlineUser[] = [
      {
        email: 'jane@family.com',
        name: 'Jane Doe',
        role: 'Spouse',
        currentResource: 'Insurance Policies Sheet',
        lastSeen: new Date()
      },
      {
        email: 'john@family.com',
        name: 'John Doe',
        role: 'Owner',
        currentResource: 'Tax Documents 2024',
        lastSeen: new Date(Date.now() - 60000)
      }
    ];

    setActivities(mockActivities);
    setOnlineUsers(mockOnlineUsers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivities(prev => prev.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp.getTime() + 1000)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'editing': return <Edit className="text-green-600" size={16} />;
      case 'viewing': return <Eye className="text-blue-600" size={16} />;
      case 'commenting': return <MessageCircle className="text-purple-600" size={16} />;
      case 'sharing': return <Users className="text-orange-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'editing': return 'bg-green-100 text-green-800';
      case 'viewing': return 'bg-blue-100 text-blue-800';
      case 'commenting': return 'bg-purple-100 text-purple-800';
      case 'sharing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="vault-shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-900">
              {isConnected ? 'Connected to Google Workspace' : 'Connection lost'}
            </span>
            <Badge variant="outline" className="text-xs">Real-time</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card className="vault-shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Online Now ({onlineUsers.length})</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.email} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                  </div>
                  {user.currentResource && (
                    <p className="text-xs text-gray-600 truncate">Working on: {user.currentResource}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">{getTimeAgo(user.lastSeen)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="vault-shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                      {getUserInitials(activity.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{activity.user.name}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getActivityColor(activity.action)}`}
                    >
                      {getActivityIcon(activity.action)}
                      <span className="ml-1 capitalize">{activity.action}</span>
                    </Badge>
                    {activity.isActive && (
                      <Badge variant="outline" className="text-xs text-green-600">Live</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{activity.resource}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">{activity.resourceType}</Badge>
                    <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Workspace Integration Info */}
      <Card className="vault-shadow-card">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-900">Google Workspace Integration</p>
            <p className="text-xs text-gray-600">
              Real-time collaboration powered by Google Sheets and Drive APIs
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>• Live document editing</span>
              <span>• Instant data sync</span>
              <span>• Native commenting</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}