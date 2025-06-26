import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, CreditCard, Building2, Plus, Edit, Eye } from 'lucide-react';

interface FinanceAccount {
  id: string;
  accountType: string;
  institutionName: string;
  accountNumber: string;
  routingNumber?: string;
  currentBalance: number;
  interestRate: number;
  contactInfo: string;
  category: 'checking' | 'savings' | 'investment' | 'retirement' | 'loan' | 'credit';
}

export function FinanceView() {
  const [accounts, setAccounts] = useState<FinanceAccount[]>([
    {
      id: '1',
      accountType: 'Primary Checking',
      institutionName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      currentBalance: 15750.50,
      interestRate: 0.01,
      contactInfo: '1-800-CHASE-1',
      category: 'checking'
    },
    {
      id: '2',
      accountType: 'High Yield Savings',
      institutionName: 'Marcus by Goldman Sachs',
      accountNumber: '****5678',
      currentBalance: 45000.00,
      interestRate: 4.25,
      contactInfo: '1-855-730-SAVE',
      category: 'savings'
    },
    {
      id: '3',
      accountType: '401(k) Plan',
      institutionName: 'Fidelity',
      accountNumber: '****9012',
      currentBalance: 125000.00,
      interestRate: 7.8,
      contactInfo: '1-800-FIDELITY',
      category: 'retirement'
    },
    {
      id: '4',
      accountType: 'Mortgage',
      institutionName: 'Wells Fargo',
      accountNumber: '****3456',
      currentBalance: -285000.00,
      interestRate: 3.25,
      contactInfo: '1-800-TO-WELLS',
      category: 'loan'
    },
    {
      id: '5',
      accountType: 'Rewards Credit Card',
      institutionName: 'American Express',
      accountNumber: '****7890',
      currentBalance: -2150.75,
      interestRate: 18.99,
      contactInfo: '1-800-AMEX',
      category: 'credit'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountType: '',
    institutionName: '',
    accountNumber: '',
    routingNumber: '',
    currentBalance: 0,
    interestRate: 0,
    contactInfo: '',
    category: 'checking' as const
  });

  const getAccountsByCategory = (category: string) => {
    return accounts.filter(account => account.category === category);
  };

  const getTotalByCategory = (category: string) => {
    return getAccountsByCategory(category).reduce((sum, account) => sum + account.currentBalance, 0);
  };

  const getNetWorth = () => {
    return accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const handleAddAccount = () => {
    const account: FinanceAccount = {
      ...newAccount,
      id: Date.now().toString(),
    };
    setAccounts([...accounts, account]);
    setNewAccount({
      accountType: '',
      institutionName: '',
      accountNumber: '',
      routingNumber: '',
      currentBalance: 0,
      interestRate: 0,
      contactInfo: '',
      category: 'checking'
    });
    setShowAddForm(false);
  };

  const AccountCard = ({ account }: { account: FinanceAccount }) => (
    <Card key={account.id} className="vault-shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-lg">{account.accountType}</h4>
              <Badge variant="secondary">{account.category}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{account.institutionName}</p>
            <p className="text-sm font-mono text-gray-500 mb-3">Account: {account.accountNumber}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Balance</p>
                <p className={`font-semibold text-lg ${account.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {account.currentBalance >= 0 ? '' : '-'}{formatCurrency(account.currentBalance)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate</p>
                <p className="font-medium">{account.interestRate}% APY</p>
              </div>
              <div>
                <p className="text-gray-600">Contact</p>
                <p className="font-medium">{account.contactInfo}</p>
              </div>
              {account.routingNumber && (
                <div>
                  <p className="text-gray-600">Routing Number</p>
                  <p className="font-mono text-sm">{account.routingNumber}</p>
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

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(getNetWorth())}</div>
                <p className="text-sm text-gray-600">Net Worth</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalByCategory('checking') + getTotalByCategory('savings'))}</div>
                <p className="text-sm text-gray-600">Liquid Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalByCategory('investment') + getTotalByCategory('retirement'))}</div>
                <p className="text-sm text-gray-600">Investments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(Math.abs(getTotalByCategory('loan') + getTotalByCategory('credit')))}</div>
                <p className="text-sm text-gray-600">Total Debt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Account */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Accounts</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Financial Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Input
                  id="accountType"
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
                  placeholder="e.g., Primary Checking, High Yield Savings"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newAccount.category} onValueChange={(value: any) => setNewAccount({...newAccount, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={newAccount.institutionName}
                  onChange={(e) => setNewAccount({...newAccount, institutionName: e.target.value})}
                  placeholder="e.g., Chase Bank, Fidelity"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
                <Input
                  id="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  placeholder="****1234"
                />
              </div>
              <div>
                <Label htmlFor="currentBalance">Current Balance</Label>
                <Input
                  id="currentBalance"
                  type="number"
                  step="0.01"
                  value={newAccount.currentBalance}
                  onChange={(e) => setNewAccount({...newAccount, currentBalance: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={newAccount.interestRate}
                  onChange={(e) => setNewAccount({...newAccount, interestRate: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddAccount} className="govault-primary">Save Account</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="loan">Loans</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {accounts.map((account) => <AccountCard key={account.id} account={account} />)}
        </TabsContent>

        {(['checking', 'savings', 'investment', 'retirement', 'loan', 'credit'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getAccountsByCategory(category).map((account) => <AccountCard key={account.id} account={account} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}