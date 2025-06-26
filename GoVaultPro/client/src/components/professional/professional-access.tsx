import { useState, useEffect } from 'react';
import { UserCheck, Clock, Shield, AlertTriangle, Calendar, Mail, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: string;
  expiresAt: string;
  isActive: boolean;
  lastAccess: string;
}

export function ProfessionalAccess() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch('/api/professional-access');
        if (response.ok) {
          const data = await response.json();
          setProfessionals(data);
        }
      } catch (error) {
        console.error('Failed to fetch professional access:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const getAccessLevelColor = (level: string) => {
    if (level.includes('readonly')) return 'bg-blue-100 text-blue-800';
    if (level.includes('full')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('CPA') || role.includes('Tax')) return <UserCheck className="text-green-600" size={20} />;
    if (role.includes('Attorney')) return <Shield className="text-purple-600" size={20} />;
    if (role.includes('Advisor')) return <TrendingUp className="text-blue-600" size={20} />;
    return <UserCheck className="text-gray-600" size={20} />;
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="vault-shadow-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="vault-shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Professional Access</h2>
                <p className="text-sm text-gray-600">Manage temporary access for advisors and professionals</p>
              </div>
            </div>
            <Button className="govault-primary text-white">
              Grant New Access
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Professional List */}
      <div className="space-y-4">
        {professionals.map((professional) => (
          <Card key={professional.id} className="vault-shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getRoleIcon(professional.role)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{professional.name}</h3>
                      <Badge 
                        variant={professional.isActive ? "default" : "secondary"}
                        className={professional.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {professional.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      {isExpiringSoon(professional.expiresAt) && (
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                          <AlertTriangle size={12} className="mr-1" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail size={14} className="mr-1" />
                        {professional.email}
                      </span>
                      <span>{professional.role}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className={getAccessLevelColor(professional.accessLevel)}>
                        {professional.accessLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Expires: {formatDate(professional.expiresAt)}
                      </span>
                      
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Last access: {formatDate(professional.lastAccess)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Modify Access
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Access Guidelines */}
      <Card className="vault-shadow-card">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Access Guidelines</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Tax Preparers</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Financial data read-only</li>
                <li>• Tax documents access</li>
                <li>• Seasonal expiration</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Attorneys</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Legal documents full access</li>
                <li>• Estate planning data</li>
                <li>• Extended access periods</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Financial Advisors</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Investment data access</li>
                <li>• Financial planning tools</li>
                <li>• Regular review meetings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}