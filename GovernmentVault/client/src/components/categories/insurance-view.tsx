import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Umbrella, Car, Home, Heart, Shield, AlertTriangle, Plus, Edit, Eye, Calendar } from 'lucide-react';

interface InsurancePolicy {
  id: string;
  policyType: string;
  insuranceCompany: string;
  policyNumber: string;
  coverageAmount: number;
  deductible: number;
  premium: number;
  renewalDate: string;
  agentContact: string;
  beneficiaries: string[];
  category: 'auto' | 'home' | 'life' | 'health' | 'umbrella' | 'other';
  status: 'active' | 'expiring' | 'expired';
  claimsHistory: number;
}

export function InsuranceView() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    {
      id: '1',
      policyType: 'Auto Insurance - Full Coverage',
      insuranceCompany: 'State Farm',
      policyNumber: 'SF-AUTO-789456',
      coverageAmount: 300000,
      deductible: 500,
      premium: 1200,
      renewalDate: '2025-06-15',
      agentContact: 'Sarah Miller - (555) 123-4567',
      beneficiaries: [],
      category: 'auto',
      status: 'active',
      claimsHistory: 1
    },
    {
      id: '2',
      policyType: 'Homeowners Insurance',
      insuranceCompany: 'Allstate',
      policyNumber: 'AS-HOME-123789',
      coverageAmount: 750000,
      deductible: 2500,
      premium: 2400,
      renewalDate: '2025-03-20',
      agentContact: 'Michael Chen - (555) 987-6543',
      beneficiaries: [],
      category: 'home',
      status: 'expiring',
      claimsHistory: 0
    },
    {
      id: '3',
      policyType: 'Term Life Insurance',
      insuranceCompany: 'Northwestern Mutual',
      policyNumber: 'NM-LIFE-456123',
      coverageAmount: 1000000,
      deductible: 0,
      premium: 800,
      renewalDate: '2026-12-01',
      agentContact: 'Jennifer Davis - (555) 456-7890',
      beneficiaries: ['Jane Johnson', 'Alex Johnson', 'Sam Johnson'],
      category: 'life',
      status: 'active',
      claimsHistory: 0
    },
    {
      id: '4',
      policyType: 'Health Insurance - PPO Plan',
      insuranceCompany: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS-HLT-789012',
      coverageAmount: 50000,
      deductible: 3000,
      premium: 6000,
      renewalDate: '2025-01-01',
      agentContact: 'Customer Service - (800) 555-BCBS',
      beneficiaries: ['Spouse', 'Children'],
      category: 'health',
      status: 'expiring',
      claimsHistory: 3
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policyType: '',
    insuranceCompany: '',
    policyNumber: '',
    coverageAmount: 0,
    deductible: 0,
    premium: 0,
    renewalDate: '',
    agentContact: '',
    beneficiaries: '',
    category: 'other' as const
  });

  const getPoliciesByCategory = (category: string) => {
    return policies.filter(p => p.category === category);
  };

  const getInsuranceStats = () => {
    const totalCoverage = policies.reduce((sum, p) => sum + p.coverageAmount, 0);
    const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0);
    const expiring = policies.filter(p => p.status === 'expiring').length;
    const totalClaims = policies.reduce((sum, p) => sum + p.claimsHistory, 0);
    
    return { totalCoverage, totalPremiums, expiring, totalClaims, total: policies.length };
  };

  const getRenewalStatus = (renewalDate: string): 'active' | 'expiring' | 'expired' => {
    const renewal = new Date(renewalDate);
    const today = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(today.getMonth() + 2);

    if (renewal < today) return 'expired';
    if (renewal < twoMonthsFromNow) return 'expiring';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auto': return Car;
      case 'home': return Home;
      case 'life': return Heart;
      case 'health': return Shield;
      case 'umbrella': return Umbrella;
      default: return Shield;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddPolicy = () => {
    const policy: InsurancePolicy = {
      ...newPolicy,
      id: Date.now().toString(),
      beneficiaries: newPolicy.beneficiaries.split(',').map(b => b.trim()).filter(b => b),
      status: getRenewalStatus(newPolicy.renewalDate),
      claimsHistory: 0
    };
    setPolicies([...policies, policy]);
    setNewPolicy({
      policyType: '',
      insuranceCompany: '',
      policyNumber: '',
      coverageAmount: 0,
      deductible: 0,
      premium: 0,
      renewalDate: '',
      agentContact: '',
      beneficiaries: '',
      category: 'other'
    });
    setShowAddForm(false);
  };

  const stats = getInsuranceStats();

  const PolicyCard = ({ policy }: { policy: InsurancePolicy }) => {
    const IconComponent = getCategoryIcon(policy.category);
    
    return (
      <Card key={policy.id} className="vault-shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{policy.policyType}</h4>
                  <p className="text-sm text-gray-600">{policy.insuranceCompany}</p>
                </div>
                <Badge className={getStatusColor(policy.status)}>
                  {policy.status === 'expiring' && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Policy Number</p>
                  <p className="font-mono text-sm">{policy.policyNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Coverage Amount</p>
                  <p className="font-semibold text-green-600">{formatCurrency(policy.coverageAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Annual Premium</p>
                  <p className="font-medium">{formatCurrency(policy.premium)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Deductible</p>
                  <p className="font-medium">{formatCurrency(policy.deductible)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Renewal Date</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{policy.renewalDate}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Agent Contact</p>
                  <p className="text-sm">{policy.agentContact}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Claims History</p>
                  <p className="font-medium">{policy.claimsHistory} claims</p>
                </div>
                {policy.beneficiaries.length > 0 && (
                  <div>
                    <p className="text-gray-600 mb-1">Beneficiaries</p>
                    <p className="text-sm">{policy.beneficiaries.join(', ')}</p>
                  </div>
                )}
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
      {/* Insurance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCoverage)}</div>
            <p className="text-sm text-gray-600">Total Coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalPremiums)}</div>
            <p className="text-sm text-gray-600">Annual Premiums</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.expiring}</div>
            <p className="text-sm text-gray-600">Expiring Soon</p>
            {stats.expiring > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Active Policies</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Policy */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Insurance Policies</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Insurance Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policyType">Policy Type</Label>
                <Input
                  id="policyType"
                  value={newPolicy.policyType}
                  onChange={(e) => setNewPolicy({...newPolicy, policyType: e.target.value})}
                  placeholder="e.g., Auto Insurance - Full Coverage"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPolicy.category} onValueChange={(value: any) => setNewPolicy({...newPolicy, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="umbrella">Umbrella</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insuranceCompany">Insurance Company</Label>
                <Input
                  id="insuranceCompany"
                  value={newPolicy.insuranceCompany}
                  onChange={(e) => setNewPolicy({...newPolicy, insuranceCompany: e.target.value})}
                  placeholder="e.g., State Farm, Allstate"
                />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={newPolicy.policyNumber}
                  onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})}
                  placeholder="Policy number"
                />
              </div>
              <div>
                <Label htmlFor="coverageAmount">Coverage Amount</Label>
                <Input
                  id="coverageAmount"
                  type="number"
                  value={newPolicy.coverageAmount}
                  onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: parseFloat(e.target.value) || 0})}
                  placeholder="Coverage amount in dollars"
                />
              </div>
              <div>
                <Label htmlFor="premium">Annual Premium</Label>
                <Input
                  id="premium"
                  type="number"
                  value={newPolicy.premium}
                  onChange={(e) => setNewPolicy({...newPolicy, premium: parseFloat(e.target.value) || 0})}
                  placeholder="Annual premium in dollars"
                />
              </div>
              <div>
                <Label htmlFor="deductible">Deductible</Label>
                <Input
                  id="deductible"
                  type="number"
                  value={newPolicy.deductible}
                  onChange={(e) => setNewPolicy({...newPolicy, deductible: parseFloat(e.target.value) || 0})}
                  placeholder="Deductible amount"
                />
              </div>
              <div>
                <Label htmlFor="renewalDate">Renewal Date</Label>
                <Input
                  id="renewalDate"
                  type="date"
                  value={newPolicy.renewalDate}
                  onChange={(e) => setNewPolicy({...newPolicy, renewalDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="agentContact">Agent Contact</Label>
                <Input
                  id="agentContact"
                  value={newPolicy.agentContact}
                  onChange={(e) => setNewPolicy({...newPolicy, agentContact: e.target.value})}
                  placeholder="Agent name and contact information"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="beneficiaries">Beneficiaries (comma-separated)</Label>
                <Input
                  id="beneficiaries"
                  value={newPolicy.beneficiaries}
                  onChange={(e) => setNewPolicy({...newPolicy, beneficiaries: e.target.value})}
                  placeholder="e.g., Jane Doe, John Doe Jr."
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddPolicy} className="govault-primary">Save Policy</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policy Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="life">Life</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="umbrella">Umbrella</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {policies.map((policy) => <PolicyCard key={policy.id} policy={policy} />)}
        </TabsContent>

        {(['auto', 'home', 'life', 'health', 'umbrella', 'other'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getPoliciesByCategory(category).map((policy) => <PolicyCard key={policy.id} policy={policy} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}