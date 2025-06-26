import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, AlertTriangle, Plus, Edit, Eye, Upload } from 'lucide-react';

interface FamilyID {
  id: string;
  idType: string;
  idNumber: string;
  expirationDate: string;
  issuingAuthority: string;
  familyMember: string;
  renewalRequirements: string;
  documentLink?: string;
  status: 'valid' | 'expiring' | 'expired';
}

export function FamilyIDsView() {
  const [familyIds, setFamilyIds] = useState<FamilyID[]>([
    {
      id: '1',
      idType: 'Driver\'s License',
      idNumber: 'DL123456789',
      expirationDate: '2025-03-15',
      issuingAuthority: 'DMV California',
      familyMember: 'John Johnson',
      renewalRequirements: 'Vision test required',
      status: 'expiring'
    },
    {
      id: '2',
      idType: 'Passport',
      idNumber: 'US123456789',
      expirationDate: '2027-06-20',
      issuingAuthority: 'US State Department',
      familyMember: 'Jane Johnson',
      renewalRequirements: 'Renewal application 6 months prior',
      status: 'valid'
    },
    {
      id: '3',
      idType: 'Social Security Card',
      idNumber: '***-**-1234',
      expirationDate: 'No expiration',
      issuingAuthority: 'Social Security Administration',
      familyMember: 'John Johnson',
      renewalRequirements: 'N/A',
      status: 'valid'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState({
    idType: '',
    idNumber: '',
    expirationDate: '',
    issuingAuthority: '',
    familyMember: '',
    renewalRequirements: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpirationStatus = (expirationDate: string) => {
    if (expirationDate === 'No expiration') return 'valid';
    
    const expDate = new Date(expirationDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    if (expDate < today) return 'expired';
    if (expDate < threeMonthsFromNow) return 'expiring';
    return 'valid';
  };

  const handleAddId = () => {
    const status = getExpirationStatus(newId.expirationDate);
    const id: FamilyID = {
      ...newId,
      id: Date.now().toString(),
      status
    };
    setFamilyIds([...familyIds, id]);
    setNewId({
      idType: '',
      idNumber: '',
      expirationDate: '',
      issuingAuthority: '',
      familyMember: '',
      renewalRequirements: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{familyIds.filter(id => id.status === 'valid').length}</div>
            <p className="text-sm text-gray-600">Valid IDs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{familyIds.filter(id => id.status === 'expiring').length}</div>
            <p className="text-sm text-gray-600">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{familyIds.filter(id => id.status === 'expired').length}</div>
            <p className="text-sm text-gray-600">Expired</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{familyIds.length}</div>
            <p className="text-sm text-gray-600">Total IDs</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New ID Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Family ID Documents</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add New ID
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Family ID</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idType">ID Type</Label>
                <Input
                  id="idType"
                  value={newId.idType}
                  onChange={(e) => setNewId({...newId, idType: e.target.value})}
                  placeholder="e.g., Driver's License, Passport"
                />
              </div>
              <div>
                <Label htmlFor="familyMember">Family Member</Label>
                <Input
                  id="familyMember"
                  value={newId.familyMember}
                  onChange={(e) => setNewId({...newId, familyMember: e.target.value})}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  value={newId.idNumber}
                  onChange={(e) => setNewId({...newId, idNumber: e.target.value})}
                  placeholder="ID number (will be partially masked)"
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={newId.expirationDate}
                  onChange={(e) => setNewId({...newId, expirationDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  value={newId.issuingAuthority}
                  onChange={(e) => setNewId({...newId, issuingAuthority: e.target.value})}
                  placeholder="e.g., DMV California"
                />
              </div>
              <div>
                <Label htmlFor="renewalRequirements">Renewal Requirements</Label>
                <Input
                  id="renewalRequirements"
                  value={newId.renewalRequirements}
                  onChange={(e) => setNewId({...newId, renewalRequirements: e.target.value})}
                  placeholder="e.g., Vision test required"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddId} className="govault-primary">Save ID</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ID List */}
      <div className="grid gap-4">
        {familyIds.map((id) => (
          <Card key={id.id} className="vault-shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-lg">{id.idType}</h4>
                    <p className="text-sm text-gray-600">{id.familyMember}</p>
                    <p className="text-sm font-mono mt-1">{id.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issuing Authority</p>
                    <p className="font-medium">{id.issuingAuthority}</p>
                    <p className="text-sm text-gray-600 mt-2">Expiration</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{id.expirationDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Renewal Requirements</p>
                    <p className="text-sm">{id.renewalRequirements}</p>
                    <Badge className={`mt-2 ${getStatusColor(id.status)}`}>
                      {id.status === 'expiring' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {id.status.charAt(0).toUpperCase() + id.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}