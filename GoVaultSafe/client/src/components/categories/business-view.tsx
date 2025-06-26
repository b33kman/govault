import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Calendar, AlertTriangle, Plus, Edit, Eye, Building2, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

interface BusinessEntity {
  id: string;
  businessName: string;
  businessType: string;
  formationDate: string;
  taxId: string;
  partnersMembers: string[];
  registeredAgent: string;
  annualRequirements: string[];
  insuranceInfo: string;
  documentLinks: string[];
  category: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship' | 'other';
  status: 'active' | 'dissolved' | 'inactive';
  nextDeadline?: string;
  state: string;
}

export function BusinessView() {
  const [businesses, setBusinesses] = useState<BusinessEntity[]>([
    {
      id: '1',
      businessName: 'Johnson Consulting LLC',
      businessType: 'Limited Liability Company',
      formationDate: '2020-03-15',
      taxId: '87-1234567',
      partnersMembers: ['John Johnson (Managing Member)', 'Jane Johnson (Member)'],
      registeredAgent: 'LegalZoom Registered Agent Service',
      annualRequirements: ['Annual Report - Due March 15', 'Tax Filing - Due March 15', 'Operating Agreement Review'],
      insuranceInfo: 'Professional Liability: $1M, General Liability: $2M',
      documentLinks: ['articles-of-organization.pdf', 'operating-agreement-2020.pdf', 'annual-report-2024.pdf'],
      category: 'llc',
      status: 'active',
      nextDeadline: '2025-03-15',
      state: 'California'
    },
    {
      id: '2',
      businessName: 'Creative Solutions Partnership',
      businessType: 'General Partnership',
      formationDate: '2019-08-01',
      taxId: '88-7654321',
      partnersMembers: ['John Johnson (50%)', 'Michael Chen (50%)'],
      registeredAgent: 'N/A',
      annualRequirements: ['Partnership Tax Return - Due March 15', 'Annual Review Meeting'],
      insuranceInfo: 'General Liability: $1M, Errors & Omissions: $500K',
      documentLinks: ['partnership-agreement-2019.pdf', 'tax-return-2023.pdf'],
      category: 'partnership',
      status: 'active',
      nextDeadline: '2025-03-15',
      state: 'California'
    },
    {
      id: '3',
      businessName: 'Johnson Freelance Services',
      businessType: 'Sole Proprietorship',
      formationDate: '2018-01-01',
      taxId: 'SSN-based',
      partnersMembers: ['John Johnson (Sole Proprietor)'],
      registeredAgent: 'N/A',
      annualRequirements: ['Schedule C Filing - Due April 15', 'Quarterly Tax Estimates'],
      insuranceInfo: 'Professional Liability: $500K',
      documentLinks: ['dba-filing-2018.pdf', 'business-license-2024.pdf'],
      category: 'sole_proprietorship',
      status: 'inactive',
      state: 'California'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    businessName: '',
    businessType: '',
    formationDate: '',
    taxId: '',
    partnersMembers: '',
    registeredAgent: '',
    annualRequirements: '',
    insuranceInfo: '',
    category: 'llc' as const,
    state: 'California',
    nextDeadline: ''
  });

  const getBusinessesByCategory = (category: string) => {
    return businesses.filter(b => b.category === category);
  };

  const getBusinessStats = () => {
    const active = businesses.filter(b => b.status === 'active').length;
    const upcomingDeadlines = businesses.filter(b => {
      if (!b.nextDeadline) return false;
      const deadline = new Date(b.nextDeadline);
      const twoMonthsFromNow = new Date();
      twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
      return deadline <= twoMonthsFromNow;
    }).length;
    const totalEntities = businesses.length;
    const totalRequirements = businesses.reduce((sum, b) => sum + b.annualRequirements.length, 0);
    
    return { active, upcomingDeadlines, totalEntities, totalRequirements };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'dissolved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corporation': return Building2;
      case 'llc': return Briefcase;
      case 'partnership': return Users;
      case 'sole_proprietorship': return Briefcase;
      default: return Briefcase;
    }
  };

  const handleAddBusiness = () => {
    const business: BusinessEntity = {
      ...newBusiness,
      id: Date.now().toString(),
      partnersMembers: newBusiness.partnersMembers.split(',').map(p => p.trim()).filter(p => p),
      annualRequirements: newBusiness.annualRequirements.split(',').map(r => r.trim()).filter(r => r),
      documentLinks: [],
      status: 'active'
    };
    setBusinesses([...businesses, business]);
    setNewBusiness({
      businessName: '',
      businessType: '',
      formationDate: '',
      taxId: '',
      partnersMembers: '',
      registeredAgent: '',
      annualRequirements: '',
      insuranceInfo: '',
      category: 'llc',
      state: 'California',
      nextDeadline: ''
    });
    setShowAddForm(false);
  };

  const stats = getBusinessStats();

  const BusinessCard = ({ business }: { business: BusinessEntity }) => {
    const IconComponent = getCategoryIcon(business.category);
    
    return (
      <Card key={business.id} className="vault-shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{business.businessName}</h4>
                  <p className="text-sm text-gray-600">{business.businessType}</p>
                  <p className="text-xs text-gray-500">{business.state}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="secondary">{business.category.replace('_', ' ')}</Badge>
                  <Badge className={getStatusColor(business.status)}>
                    {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Formation Details</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Formed: {business.formationDate}</span>
                    </div>
                    <p><span className="text-gray-600">Tax ID:</span> {business.taxId}</p>
                    {business.registeredAgent && business.registeredAgent !== 'N/A' && (
                      <p><span className="text-gray-600">Agent:</span> {business.registeredAgent}</p>
                    )}
                  </div>
                  
                  {business.nextDeadline && (
                    <div className="mt-3">
                      <p className="text-gray-600 mb-1">Next Deadline</p>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-yellow-700">{business.nextDeadline}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Owners/Partners</p>
                  <div className="space-y-1">
                    {business.partnersMembers.map((member, idx) => (
                      <p key={idx} className="text-sm">{member}</p>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1">Insurance Coverage</p>
                    <p className="text-sm">{business.insuranceInfo}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Annual Requirements</p>
                  <div className="space-y-1">
                    {business.annualRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1">Documents ({business.documentLinks.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {business.documentLinks.slice(0, 2).map((link, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {link.split('-')[0] || 'Doc'}
                        </Badge>
                      ))}
                      {business.documentLinks.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{business.documentLinks.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Entities"
          value={stats.active}
          icon={Building2}
          color="green"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={AlertTriangle}
          color="yellow"
          showAlert={stats.upcomingDeadlines > 0}
        />
        <StatCard
          title="Business Entities"
          value={stats.totalEntities}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Annual Requirements"
          value={stats.totalRequirements}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Add New Business */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Business Entities</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Business Entity
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Business Entity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={newBusiness.businessName}
                  onChange={(e) => setNewBusiness({...newBusiness, businessName: e.target.value})}
                  placeholder="e.g., Johnson Consulting LLC"
                />
              </div>
              <div>
                <Label htmlFor="category">Entity Type</Label>
                <Select value={newBusiness.category} onValueChange={(value: any) => setNewBusiness({...newBusiness, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="businessType">Business Type Description</Label>
                <Input
                  id="businessType"
                  value={newBusiness.businessType}
                  onChange={(e) => setNewBusiness({...newBusiness, businessType: e.target.value})}
                  placeholder="e.g., Limited Liability Company, S Corporation"
                />
              </div>
              <div>
                <Label htmlFor="state">State of Formation</Label>
                <Input
                  id="state"
                  value={newBusiness.state}
                  onChange={(e) => setNewBusiness({...newBusiness, state: e.target.value})}
                  placeholder="e.g., California, Delaware"
                />
              </div>
              <div>
                <Label htmlFor="formationDate">Formation Date</Label>
                <Input
                  id="formationDate"
                  type="date"
                  value={newBusiness.formationDate}
                  onChange={(e) => setNewBusiness({...newBusiness, formationDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  value={newBusiness.taxId}
                  onChange={(e) => setNewBusiness({...newBusiness, taxId: e.target.value})}
                  placeholder="e.g., 12-3456789"
                />
              </div>
              <div>
                <Label htmlFor="nextDeadline">Next Important Deadline</Label>
                <Input
                  id="nextDeadline"
                  type="date"
                  value={newBusiness.nextDeadline}
                  onChange={(e) => setNewBusiness({...newBusiness, nextDeadline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="registeredAgent">Registered Agent</Label>
                <Input
                  id="registeredAgent"
                  value={newBusiness.registeredAgent}
                  onChange={(e) => setNewBusiness({...newBusiness, registeredAgent: e.target.value})}
                  placeholder="Registered agent name and address"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="partnersMembers">Owners/Partners/Members (comma-separated)</Label>
                <Input
                  id="partnersMembers"
                  value={newBusiness.partnersMembers}
                  onChange={(e) => setNewBusiness({...newBusiness, partnersMembers: e.target.value})}
                  placeholder="e.g., John Smith (Managing Member), Jane Smith (Member)"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="annualRequirements">Annual Requirements (comma-separated)</Label>
                <Input
                  id="annualRequirements"
                  value={newBusiness.annualRequirements}
                  onChange={(e) => setNewBusiness({...newBusiness, annualRequirements: e.target.value})}
                  placeholder="e.g., Annual Report - Due March 15, Tax Filing - Due March 15"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="insuranceInfo">Insurance Information</Label>
                <Input
                  id="insuranceInfo"
                  value={newBusiness.insuranceInfo}
                  onChange={(e) => setNewBusiness({...newBusiness, insuranceInfo: e.target.value})}
                  placeholder="e.g., General Liability: $1M, Professional Liability: $2M"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddBusiness} className="govault-primary">Save Business Entity</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="llc">LLC</TabsTrigger>
          <TabsTrigger value="corporation">Corporation</TabsTrigger>
          <TabsTrigger value="partnership">Partnership</TabsTrigger>
          <TabsTrigger value="sole_proprietorship">Sole Prop</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {businesses.map((business) => <BusinessCard key={business.id} business={business} />)}
        </TabsContent>

        {(['llc', 'corporation', 'partnership', 'sole_proprietorship', 'other'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getBusinessesByCategory(category).map((business) => <BusinessCard key={business.id} business={business} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}