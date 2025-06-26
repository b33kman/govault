import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Shield, AlertTriangle, Eye, EyeOff, Plus, Edit, Copy, RotateCcw } from 'lucide-react';

interface PasswordEntry {
  id: string;
  serviceName: string;
  username: string;
  password: string; // In real app, this would be encrypted
  url: string;
  category: 'email' | 'financial' | 'social' | 'work' | 'shopping' | 'utilities' | 'other';
  strength: 'weak' | 'medium' | 'strong';
  lastUpdated: string;
  twoFactorEnabled: boolean;
  securityQuestions?: string[];
  notes?: string;
}

export function PasswordsView() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: '1',
      serviceName: 'Gmail',
      username: 'john.johnson@gmail.com',
      password: 'Str0ngP@ssw0rd123!',
      url: 'https://gmail.com',
      category: 'email',
      strength: 'strong',
      lastUpdated: '2024-12-15',
      twoFactorEnabled: true
    },
    {
      id: '2',
      serviceName: 'Chase Banking',
      username: 'johnjohnson',
      password: 'MyBank2024!',
      url: 'https://chase.com',
      category: 'financial',
      strength: 'strong',
      lastUpdated: '2024-11-28',
      twoFactorEnabled: true
    },
    {
      id: '3',
      serviceName: 'Facebook',
      username: 'john.johnson@gmail.com',
      password: 'facebook123',
      url: 'https://facebook.com',
      category: 'social',
      strength: 'weak',
      lastUpdated: '2023-08-15',
      twoFactorEnabled: false
    },
    {
      id: '4',
      serviceName: 'Netflix',
      username: 'john.johnson@gmail.com',
      password: 'NetflixFamily2024#',
      url: 'https://netflix.com',
      category: 'other',
      strength: 'strong',
      lastUpdated: '2024-10-05',
      twoFactorEnabled: false
    }
  ]);

  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({
    serviceName: '',
    username: '',
    password: '',
    url: '',
    category: 'other' as const,
    twoFactorEnabled: false,
    notes: ''
  });

  const getPasswordsByCategory = (category: string) => {
    return passwords.filter(p => p.category === category);
  };

  const getSecurityStats = () => {
    const strong = passwords.filter(p => p.strength === 'strong').length;
    const medium = passwords.filter(p => p.strength === 'medium').length;
    const weak = passwords.filter(p => p.strength === 'weak').length;
    const twoFA = passwords.filter(p => p.twoFactorEnabled).length;
    
    return { strong, medium, weak, twoFA, total: passwords.length };
  };

  const analyzePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword({...newPassword, password});
  };

  const handleAddPassword = () => {
    const password: PasswordEntry = {
      ...newPassword,
      id: Date.now().toString(),
      strength: analyzePasswordStrength(newPassword.password),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPasswords([...passwords, password]);
    setNewPassword({
      serviceName: '',
      username: '',
      password: '',
      url: '',
      category: 'other',
      twoFactorEnabled: false,
      notes: ''
    });
    setShowAddForm(false);
  };

  const stats = getSecurityStats();

  const PasswordCard = ({ password }: { password: PasswordEntry }) => (
    <Card key={password.id} className="vault-shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{password.serviceName}</h4>
                <p className="text-sm text-gray-600">{password.username}</p>
              </div>
              <Badge className={getStrengthColor(password.strength)}>
                {password.strength}
              </Badge>
              {password.twoFactorEnabled && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="mr-1 h-3 w-3" />
                  2FA
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Password</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {showPasswords[password.id] ? password.password : '••••••••••••'}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => togglePasswordVisibility(password.id)}
                  >
                    {showPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(password.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Website</p>
                <a href={password.url} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  {password.url}
                </a>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Category</p>
                <Badge variant="secondary">{password.category}</Badge>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm">{password.lastUpdated}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Passwords</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.strong}</div>
            <p className="text-sm text-gray-600">Strong Passwords</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <p className="text-sm text-gray-600">Medium Strength</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.weak}</div>
            <p className="text-sm text-gray-600">Weak Passwords</p>
            {stats.weak > 0 && <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.twoFA}</div>
            <p className="text-sm text-gray-600">2FA Enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Password */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Password Vault</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Password
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={newPassword.serviceName}
                  onChange={(e) => setNewPassword({...newPassword, serviceName: e.target.value})}
                  placeholder="e.g., Gmail, Netflix, Chase"
                />
              </div>
              <div>
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                  placeholder="username or email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <Input
                    id="password"
                    type="password"
                    value={newPassword.password}
                    onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                    placeholder="Enter password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  value={newPassword.url}
                  onChange={(e) => setNewPassword({...newPassword, url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPassword.category} onValueChange={(value: any) => setNewPassword({...newPassword, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddPassword} className="govault-primary">Save Password</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {passwords.map((password) => <PasswordCard key={password.id} password={password} />)}
        </TabsContent>

        {(['email', 'financial', 'social', 'work', 'shopping', 'utilities', 'other'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getPasswordsByCategory(category).map((password) => <PasswordCard key={password.id} password={password} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}