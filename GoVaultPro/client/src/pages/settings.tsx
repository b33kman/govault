import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/auth-context';
import { Users, Shield, Bell, Database, Mail, Calendar, Key, Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: string;
  permissions: {
    familyIds: { view: boolean; edit: boolean };
    finance: { view: boolean; edit: boolean };
    property: { view: boolean; edit: boolean };
    passwords: { view: boolean; edit: boolean };
    insurance: { view: boolean; edit: boolean };
    taxes: { view: boolean; edit: boolean };
    legal: { view: boolean; edit: boolean };
    business: { view: boolean; edit: boolean };
    contacts: { view: boolean; edit: boolean };
  };
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'owner',
    status: 'active',
    lastActive: '2 hours ago',
    permissions: {
      familyIds: { view: true, edit: true },
      finance: { view: true, edit: true },
      property: { view: true, edit: true },
      passwords: { view: true, edit: true },
      insurance: { view: true, edit: true },
      taxes: { view: true, edit: true },
      legal: { view: true, edit: true },
      business: { view: true, edit: true },
      contacts: { view: true, edit: true },
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'spouse',
    status: 'active',
    lastActive: '1 day ago',
    permissions: {
      familyIds: { view: true, edit: true },
      finance: { view: true, edit: true },
      property: { view: true, edit: true },
      passwords: { view: true, edit: false },
      insurance: { view: true, edit: true },
      taxes: { view: true, edit: false },
      legal: { view: true, edit: false },
      business: { view: true, edit: false },
      contacts: { view: true, edit: true },
    }
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'mike@financialadvisor.com',
    role: 'advisor',
    status: 'active',
    lastActive: '3 days ago',
    permissions: {
      familyIds: { view: false, edit: false },
      finance: { view: true, edit: false },
      property: { view: false, edit: false },
      passwords: { view: false, edit: false },
      insurance: { view: true, edit: false },
      taxes: { view: true, edit: false },
      legal: { view: false, edit: false },
      business: { view: false, edit: false },
      contacts: { view: true, edit: false },
    }
  }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const handleAddDocument = () => {
    window.location.href = '/documents';
  };

  const roleColors = {
    owner: 'bg-purple-100 text-purple-800',
    spouse: 'bg-blue-100 text-blue-800',
    child: 'bg-green-100 text-green-800',
    dependent: 'bg-yellow-100 text-yellow-800',
    advisor: 'bg-orange-100 text-orange-800',
    attorney: 'bg-red-100 text-red-800',
    tax_preparer: 'bg-gray-100 text-gray-800',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Settings"
          subtitle="Manage your family vault preferences and security"
          searchPlaceholder="Search documents and data..."
          onSearch={handleSearch}
          onAddDocument={handleAddDocument}
        />
        
        <div className="max-w-6xl mx-auto space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users size={16} />
                User Management
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Database size={16} />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Key size={16} />
                System
              </TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="vault-shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Family Members & Professionals</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Manage access and permissions for your family vault</p>
                    </div>
                    <Button onClick={() => setIsInviteDialogOpen(true)} className="flex items-center gap-2">
                      <Plus size={16} />
                      Invite Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFamilyMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{member.name}</h4>
                              <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                                {member.role}
                              </Badge>
                              <Badge className={statusColors[member.status]}>
                                {member.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            <p className="text-xs text-gray-400">Last active: {member.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedMember(member)}>
                            <Edit size={14} />
                            Edit Permissions
                          </Button>
                          {member.role !== 'owner' && (
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Permission Details Modal */}
              {selectedMember && (
                <Card className="vault-shadow-card">
                  <CardHeader>
                    <CardTitle>Permissions for {selectedMember.name}</CardTitle>
                    <p className="text-sm text-gray-600">Configure category access and editing permissions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(selectedMember.permissions).map(([category, perms]) => (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">View</span>
                              <Switch checked={perms.view} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Edit</span>
                              <Switch checked={perms.edit} disabled={!perms.view} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setSelectedMember(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setSelectedMember(null)}>
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="vault-shadow-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <p className="text-sm text-gray-600">Configure security preferences and access controls</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Require 2FA for all family members</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Session Timeout</Label>
                        <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                      </div>
                      <Select defaultValue="4h">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="4h">4 hours</SelectItem>
                          <SelectItem value="8h">8 hours</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Password Strength Requirements</Label>
                        <p className="text-sm text-gray-600">Enforce strong passwords for stored credentials</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Document Encryption</Label>
                        <p className="text-sm text-gray-600">Encrypt sensitive documents in Google Drive</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="vault-shadow-card">
                <CardHeader>
                  <CardTitle>Audit & Monitoring</CardTitle>
                  <p className="text-sm text-gray-600">Track access and changes to your family vault</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Activity Logging</Label>
                      <p className="text-sm text-gray-600">Log all user activities and document access</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Emergency Access Alerts</Label>
                      <p className="text-sm text-gray-600">Notify when emergency access is used</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="vault-shadow-card">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <p className="text-sm text-gray-600">Configure alerts and reminders for your family vault</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Document Expiration Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified before IDs, insurance, etc. expire</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Select defaultValue="30d">
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">7 days</SelectItem>
                            <SelectItem value="30d">30 days</SelectItem>
                            <SelectItem value="60d">60 days</SelectItem>
                            <SelectItem value="90d">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Tax Deadline Reminders</Label>
                        <p className="text-sm text-gray-600">Annual tax filing and quarterly payment reminders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Insurance Renewal Notices</Label>
                        <p className="text-sm text-gray-600">Alerts for upcoming policy renewals</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Password Update Reminders</Label>
                        <p className="text-sm text-gray-600">Remind to update old passwords</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Select defaultValue="90d">
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30d">30 days</SelectItem>
                            <SelectItem value="60d">60 days</SelectItem>
                            <SelectItem value="90d">90 days</SelectItem>
                            <SelectItem value="180d">6 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Delivery Methods</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail size={16} className="text-blue-500" />
                        <div>
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Send alerts via email</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className="text-green-500" />
                        <div>
                          <Label className="text-base">Calendar Integration</Label>
                          <p className="text-sm text-gray-600">Add reminders to Google Calendar</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="vault-shadow-card">
                <CardHeader>
                  <CardTitle>Google Workspace Integration</CardTitle>
                  <p className="text-sm text-gray-600">Configure your Google services connection</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <Database size={16} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-base">Google Drive</Label>
                        <p className="text-sm text-gray-600">Document storage and file management</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <Database size={16} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-base">Google Sheets</Label>
                        <p className="text-sm text-gray-600">Structured data storage and management</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                        <Mail size={16} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-base">Gmail</Label>
                        <p className="text-sm text-gray-600">Email notifications and invitations</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                        <Calendar size={16} className="text-white" />
                      </div>
                      <div>
                        <Label className="text-base">Google Calendar</Label>
                        <p className="text-sm text-gray-600">Deadline reminders and scheduling</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card className="vault-shadow-card">
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Manage vault settings and data preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Family Vault Name</Label>
                      <Input defaultValue="Smith Family Vault" className="mt-1" />
                    </div>

                    <div>
                      <Label className="text-base">Time Zone</Label>
                      <Select defaultValue="PST">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                          <SelectItem value="CST">Central Time (CST)</SelectItem>
                          <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                          <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base">Data Retention Policy</Label>
                      <Select defaultValue="7y">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3y">3 years</SelectItem>
                          <SelectItem value="5y">5 years</SelectItem>
                          <SelectItem value="7y">7 years</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Backup & Export</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Automatic Backups</Label>
                        <p className="text-sm text-gray-600">Regular backups to Google Drive</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Select defaultValue="weekly">
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Export Capability</Label>
                        <p className="text-sm text-gray-600">Allow data export for family members</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="vault-shadow-card border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">Danger Zone</CardTitle>
                  <p className="text-sm text-red-600">Irreversible actions that affect your entire family vault</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                        Export All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Export All Family Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create a complete export of all your family vault data including documents and structured information. The export will be saved to your Google Drive.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Export Data</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Family Vault
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Family Vault</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your family vault, all documents, data, and revoke access for all family members and professionals.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Delete Vault
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Invite Member Dialog */}
        <AlertDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Invite Family Member or Professional</AlertDialogTitle>
              <AlertDialogDescription>
                Send an invitation to access your family vault with appropriate permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input id="inviteEmail" placeholder="Enter email address" />
              </div>
              <div>
                <Label htmlFor="inviteRole">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="child">Adult Child</SelectItem>
                    <SelectItem value="dependent">Dependent</SelectItem>
                    <SelectItem value="advisor">Financial Advisor</SelectItem>
                    <SelectItem value="attorney">Attorney</SelectItem>
                    <SelectItem value="tax_preparer">Tax Preparer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Send Invitation</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}