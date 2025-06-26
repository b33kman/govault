import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, DollarSign, AlertTriangle, Calendar, FileText, Shield, Users } from 'lucide-react';

export default function ReportsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1year');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>({});

  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleAddDocument = () => {
    window.location.href = '/documents';
  };

  // Financial Overview Data
  const financialData = [
    { name: 'Checking', value: 15750, color: '#3B82F6' },
    { name: 'Savings', value: 45000, color: '#10B981' },
    { name: '401k', value: 125000, color: '#8B5CF6' },
    { name: 'Investments', value: 75000, color: '#F59E0B' },
    { name: 'Debts', value: -287150, color: '#EF4444' }
  ];

  const netWorthTrend = [
    { month: 'Jan', netWorth: -25000, assets: 235000, debts: 260000 },
    { month: 'Feb', netWorth: -18000, assets: 245000, debts: 263000 },
    { month: 'Mar', netWorth: -12000, assets: 255000, debts: 267000 },
    { month: 'Apr', netWorth: -5000, assets: 265000, debts: 270000 },
    { month: 'May', netWorth: 2000, assets: 275000, debts: 273000 },
    { month: 'Jun', netWorth: 8000, assets: 285000, debts: 277000 },
    { month: 'Jul', netWorth: 15000, assets: 295000, debts: 280000 },
    { month: 'Aug', netWorth: 22000, assets: 305000, debts: 283000 },
    { month: 'Sep', netWorth: 28000, assets: 312000, debts: 284000 },
    { month: 'Oct', netWorth: 35000, assets: 320000, debts: 285000 },
    { month: 'Nov', netWorth: 42000, assets: 328000, debts: 286000 },
    { month: 'Dec', netWorth: 48000, assets: 335000, debts: 287000 }
  ];

  // Document Activity Data
  const documentActivity = [
    { category: 'Family IDs', total: 9, updated: 3, expiring: 1 },
    { category: 'Finance', total: 12, updated: 8, expiring: 0 },
    { category: 'Property', total: 4, updated: 2, expiring: 0 },
    { category: 'Passwords', total: 23, updated: 15, expiring: 5 },
    { category: 'Insurance', total: 8, updated: 6, expiring: 2 },
    { category: 'Taxes', total: 5, updated: 1, expiring: 1 },
    { category: 'Legal', total: 6, updated: 2, expiring: 1 },
    { category: 'Business', total: 3, updated: 1, expiring: 1 },
    { category: 'Contacts', total: 18, updated: 4, expiring: 0 }
  ];

  // Security Metrics
  const securityMetrics = {
    passwordStrength: { strong: 18, medium: 3, weak: 2 },
    twoFactorEnabled: 15,
    documentsSecured: 47,
    lastSecurityReview: '2024-12-15'
  };

  // Category Completion Data
  const categoryCompletion = [
    { category: 'Family IDs', completion: 90 },
    { category: 'Finance', completion: 95 },
    { category: 'Property', completion: 85 },
    { category: 'Passwords', completion: 78 },
    { category: 'Insurance', completion: 92 },
    { category: 'Taxes', completion: 88 },
    { category: 'Legal', completion: 75 },
    { category: 'Business', completion: 70 },
    { category: 'Contacts', completion: 82 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: value >= 1000000 ? 'compact' : 'standard'
    }).format(value);
  };

  const exportReport = (reportType: string) => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'financial':
        csvContent = [
          ['Category', 'Value'],
          ...financialData.map(item => [item.name, item.value])
        ].map(row => row.join(',')).join('\n');
        filename = 'financial-summary';
        break;
      case 'documents':
        csvContent = [
          ['Category', 'Total Documents', 'Recently Updated', 'Expiring'],
          ...documentActivity.map(item => [item.category, item.total, item.updated, item.expiring])
        ].map(row => row.join(',')).join('\n');
        filename = 'document-activity';
        break;
      case 'security':
        csvContent = [
          ['Metric', 'Value'],
          ['Strong Passwords', securityMetrics.passwordStrength.strong],
          ['Medium Passwords', securityMetrics.passwordStrength.medium],
          ['Weak Passwords', securityMetrics.passwordStrength.weak],
          ['Two-Factor Enabled', securityMetrics.twoFactorEnabled],
          ['Documents Secured', securityMetrics.documentsSecured]
        ].map(row => row.join(',')).join('\n');
        filename = 'security-report';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `govault-${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Load report data from API endpoints
  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const [financialRes, documentsRes, securityRes, complianceRes] = await Promise.all([
        fetch('/api/reports/financial'),
        fetch('/api/reports/documents'), 
        fetch('/api/reports/security'),
        fetch('/api/reports/compliance')
      ]);

      const [financial, documents, security, compliance] = await Promise.all([
        financialRes.json(),
        documentsRes.json(),
        securityRes.json(),
        complianceRes.json()
      ]);

      setReportData({ financial, documents, security, compliance });
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [selectedTimeframe, selectedCategory]);

  // Use API data when available, fallback to mock data
  const getFinancialData = () => reportData.financial || {
    netWorth: 48000,
    totalAssets: 260750,
    accounts: financialData,
    netWorthTrend
  };

  const getDocumentData = () => reportData.documents || {
    documentActivity,
    totalDocuments: 88
  };

  const getSecurityData = () => reportData.security || securityMetrics;

  const getComplianceData = () => reportData.compliance || {
    expiringItems: [
      { type: 'Driver\'s License', name: 'John Johnson', expiry: '2025-03-15', category: 'Family IDs' },
      { type: 'Home Insurance', name: 'Allstate Policy', expiry: '2025-03-20', category: 'Insurance' }
    ],
    deadlineStats: { next30Days: 3, next90Days: 8, thisYear: 15 }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <PageHeader 
            title="Reports & Analytics"
            subtitle="Loading comprehensive reports from your family vault data..."
          />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Reports & Analytics"
          subtitle="Generate insights and comprehensive reports from your family vault data"
          searchPlaceholder="Search documents and data..."
          onSearch={handleSearch}
          onAddDocument={handleAddDocument}
        />

        {/* Report Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category Focus</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="financial">Financial Only</SelectItem>
                    <SelectItem value="security">Security Focus</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">$48K</p>
                      <p className="text-sm text-gray-600">Net Worth</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +$73K this year
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">88</p>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-xs text-blue-600">Across 9 categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">98%</p>
                      <p className="text-sm text-gray-600">Security Score</p>
                      <p className="text-xs text-purple-600">Excellent rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">11</p>
                      <p className="text-sm text-gray-600">Action Items</p>
                      <p className="text-xs text-yellow-600">Need attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Completion Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Category Completion Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryCompletion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                    <Bar dataKey="completion" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Financial Analytics</h3>
              <Button onClick={() => exportReport('financial')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Financial Report
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={financialData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {financialData.filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Net Worth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Net Worth Trend (2024)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={netWorthTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Area type="monotone" dataKey="netWorth" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(260750)}</p>
                    <p className="text-sm text-gray-600">Total Assets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(287150)}</p>
                    <p className="text-sm text-gray-600">Total Debts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(60750)}</p>
                    <p className="text-sm text-gray-600">Liquid Assets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(200000)}</p>
                    <p className="text-sm text-gray-600">Investments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Analytics</h3>
              <Button onClick={() => exportReport('documents')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Document Report
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Document Activity by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={documentActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" name="Total Documents" />
                    <Bar dataKey="updated" fill="#10B981" name="Recently Updated" />
                    <Bar dataKey="expiring" fill="#EF4444" name="Expiring Soon" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Document Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentActivity.map((category) => (
                <Card key={category.category}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{category.category}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total:</span>
                        <Badge variant="secondary">{category.total}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Updated:</span>
                        <Badge className="bg-green-100 text-green-800">{category.updated}</Badge>
                      </div>
                      {category.expiring > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Expiring:</span>
                          <Badge className="bg-red-100 text-red-800">{category.expiring}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Security Analysis</h3>
              <Button onClick={() => exportReport('security')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Security Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Password Security Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Strong', value: securityMetrics.passwordStrength.strong, color: '#10B981' },
                          { name: 'Medium', value: securityMetrics.passwordStrength.medium, color: '#F59E0B' },
                          { name: 'Weak', value: securityMetrics.passwordStrength.weak, color: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'Strong', value: securityMetrics.passwordStrength.strong, color: '#10B981' },
                          { name: 'Medium', value: securityMetrics.passwordStrength.medium, color: '#F59E0B' },
                          { name: 'Weak', value: securityMetrics.passwordStrength.weak, color: '#EF4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Security Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        {securityMetrics.twoFactorEnabled}/23 accounts
                      </Badge>
                      <p className="text-xs text-gray-500">65% coverage</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documents Secured</span>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">
                        {securityMetrics.documentsSecured} documents
                      </Badge>
                      <p className="text-xs text-gray-500">100% secured</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Security Review</span>
                    <div className="text-right">
                      <p className="font-medium">{securityMetrics.lastSecurityReview}</p>
                      <p className="text-xs text-gray-500">11 days ago</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Security Score</span>
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">98%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Enable Two-Factor Authentication</p>
                      <p className="text-sm text-yellow-700">8 accounts still need 2FA setup for optimal security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Update Weak Passwords</p>
                      <p className="text-sm text-red-700">2 passwords need strengthening to improve security score</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Schedule Security Review</p>
                      <p className="text-sm text-blue-700">Next comprehensive security review due in 3 months</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <h3 className="text-lg font-semibold">Compliance & Legal Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expiration Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Expiration Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Driver's License</p>
                        <p className="text-sm text-gray-600">John Johnson</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Expires Mar 2025</Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Home Insurance</p>
                        <p className="text-sm text-gray-600">Allstate Policy</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Renews Mar 2025</Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Will Review</p>
                        <p className="text-sm text-gray-600">Estate Planning</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Due Jan 2025</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Document Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Legal Document Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estate Planning</span>
                      <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Power of Attorney</span>
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Healthcare Directives</span>
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Business Compliance</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Review Needed</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tax Records</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Compliance Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="font-semibold text-red-800">Next 30 Days</p>
                      <p className="text-2xl font-bold text-red-600">3</p>
                      <p className="text-sm text-red-700">items expiring</p>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-semibold text-yellow-800">Next 90 Days</p>
                      <p className="text-2xl font-bold text-yellow-600">8</p>
                      <p className="text-sm text-yellow-700">items expiring</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-green-800">This Year</p>
                      <p className="text-2xl font-bold text-green-600">15</p>
                      <p className="text-sm text-green-700">total renewals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}