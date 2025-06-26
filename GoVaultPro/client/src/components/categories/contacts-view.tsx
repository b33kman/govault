import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Phone, Mail, MapPin, AlertTriangle, Plus, Edit, Eye } from 'lucide-react';

interface Contact {
  id: string;
  contactType: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  relationshipToFamily: string;
  emergencyContact: boolean;
  preferredContactMethod: 'phone' | 'email' | 'text';
  category: 'professional' | 'emergency' | 'services' | 'family' | 'other';
  notes?: string;
}

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      contactType: 'Attorney',
      name: 'Michael Rodriguez',
      company: 'Rodriguez & Associates Law Firm',
      phone: '(555) 234-5678',
      email: 'mrodriguez@rodlaw.com',
      address: '456 Legal Plaza, Springfield, CA 94401',
      specialization: 'Estate Planning, Family Law',
      relationshipToFamily: 'Family Attorney',
      emergencyContact: false,
      preferredContactMethod: 'email',
      category: 'professional'
    },
    {
      id: '2',
      contactType: 'Financial Advisor',
      name: 'Sarah Chen',
      company: 'Wealth Management Partners',
      phone: '(555) 345-6789',
      email: 'sarah.chen@wealthpartners.com',
      address: '789 Finance Street, Springfield, CA 94401',
      specialization: 'Retirement Planning, Investment Management',
      relationshipToFamily: 'Primary Financial Advisor',
      emergencyContact: false,
      preferredContactMethod: 'phone',
      category: 'professional'
    },
    {
      id: '3',
      contactType: 'Emergency Contact',
      name: 'Robert Johnson',
      company: 'N/A',
      phone: '(555) 987-6543',
      email: 'robert.johnson@email.com',
      address: '321 Family Lane, Nearby City, CA 94402',
      specialization: 'N/A',
      relationshipToFamily: 'Brother',
      emergencyContact: true,
      preferredContactMethod: 'phone',
      category: 'emergency'
    },
    {
      id: '4',
      contactType: 'Primary Care Physician',
      name: 'Dr. Lisa Williams',
      company: 'Springfield Medical Group',
      phone: '(555) 456-7890',
      email: 'lwilliams@springfieldmed.com',
      address: '123 Health Ave, Springfield, CA 94401',
      specialization: 'Internal Medicine',
      relationshipToFamily: 'Family Doctor',
      emergencyContact: true,
      preferredContactMethod: 'phone',
      category: 'professional'
    },
    {
      id: '5',
      contactType: 'Home Maintenance',
      name: 'Tom\'s Handyman Services',
      company: 'Tom\'s Handyman Services',
      phone: '(555) 678-9012',
      email: 'tom@handymanservices.com',
      address: 'Springfield, CA Service Area',
      specialization: 'General Repairs, Plumbing, Electrical',
      relationshipToFamily: 'Trusted Service Provider',
      emergencyContact: false,
      preferredContactMethod: 'phone',
      category: 'services'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    contactType: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    relationshipToFamily: '',
    emergencyContact: false,
    preferredContactMethod: 'phone' as const,
    category: 'other' as const,
    notes: ''
  });

  const getContactsByCategory = (category: string) => {
    return contacts.filter(c => c.category === category);
  };

  const getContactStats = () => {
    const professional = contacts.filter(c => c.category === 'professional').length;
    const emergency = contacts.filter(c => c.emergencyContact).length;
    const services = contacts.filter(c => c.category === 'services').length;
    const family = contacts.filter(c => c.category === 'family').length;
    
    return { professional, emergency, services, family, total: contacts.length };
  };

  const handleAddContact = () => {
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, contact]);
    setNewContact({
      contactType: '',
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      specialization: '',
      relationshipToFamily: '',
      emergencyContact: false,
      preferredContactMethod: 'phone',
      category: 'other',
      notes: ''
    });
    setShowAddForm(false);
  };

  const stats = getContactStats();

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card key={contact.id} className="vault-shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.contactType}</p>
                {contact.company && contact.company !== 'N/A' && (
                  <p className="text-sm text-gray-500">{contact.company}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary">{contact.category}</Badge>
                {contact.emergencyContact && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Emergency
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{contact.phone}</span>
                  {contact.preferredContactMethod === 'phone' && (
                    <Badge variant="outline" className="text-xs">Preferred</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{contact.email}</span>
                  {contact.preferredContactMethod === 'email' && (
                    <Badge variant="outline" className="text-xs">Preferred</Badge>
                  )}
                </div>
                {contact.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{contact.address}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {contact.specialization && contact.specialization !== 'N/A' && (
                  <div>
                    <p className="text-gray-600 text-xs uppercase tracking-wide">Specialization</p>
                    <p className="font-medium">{contact.specialization}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wide">Relationship</p>
                  <p className="font-medium">{contact.relationshipToFamily}</p>
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

  return (
    <div className="space-y-6">
      {/* Contacts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.professional}</div>
            <p className="text-sm text-gray-600">Professional Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.emergency}</div>
            <p className="text-sm text-gray-600">Emergency Contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.services}</div>
            <p className="text-sm text-gray-600">Service Providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Contact */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contact Directory</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="e.g., Dr. John Smith"
                />
              </div>
              <div>
                <Label htmlFor="contactType">Contact Type</Label>
                <Input
                  id="contactType"
                  value={newContact.contactType}
                  onChange={(e) => setNewContact({...newContact, contactType: e.target.value})}
                  placeholder="e.g., Attorney, Doctor, Plumber"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  placeholder="Company name or N/A"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newContact.category} onValueChange={(value: any) => setNewContact({...newContact, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional Services</SelectItem>
                    <SelectItem value="emergency">Emergency Contact</SelectItem>
                    <SelectItem value="services">Service Providers</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <Select value={newContact.preferredContactMethod} onValueChange={(value: any) => setNewContact({...newContact, preferredContactMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergencyContact"
                  checked={newContact.emergencyContact}
                  onChange={(e) => setNewContact({...newContact, emergencyContact: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newContact.address}
                  onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                  placeholder="Full address or service area"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newContact.specialization}
                  onChange={(e) => setNewContact({...newContact, specialization: e.target.value})}
                  placeholder="Area of expertise or services"
                />
              </div>
              <div>
                <Label htmlFor="relationshipToFamily">Relationship to Family</Label>
                <Input
                  id="relationshipToFamily"
                  value={newContact.relationshipToFamily}
                  onChange={(e) => setNewContact({...newContact, relationshipToFamily: e.target.value})}
                  placeholder="e.g., Family Attorney, Trusted Contractor"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddContact} className="govault-primary">Save Contact</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {contacts.map((contact) => <ContactCard key={contact.id} contact={contact} />)}
        </TabsContent>

        {(['professional', 'emergency', 'services', 'family', 'other'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getContactsByCategory(category).map((contact) => <ContactCard key={contact.id} contact={contact} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}