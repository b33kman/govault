import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gavel, FileText, Calendar, AlertTriangle, Plus, Edit, Eye, Users } from 'lucide-react';

interface LegalDocument {
  id: string;
  documentType: string;
  partiesInvolved: string[];
  effectiveDate: string;
  expirationDate: string;
  attorneyInfo: string;
  keyTerms: string;
  witnessInfo: string[];
  documentLinks: string[];
  category: 'estate' | 'healthcare' | 'contracts' | 'correspondence' | 'other';
  status: 'active' | 'expiring' | 'expired' | 'draft';
  reviewDate?: string;
}

export function LegalView() {
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([
    {
      id: '1',
      documentType: 'Last Will and Testament',
      partiesInvolved: ['John Johnson', 'Jane Johnson'],
      effectiveDate: '2023-01-15',
      expirationDate: 'No expiration',
      attorneyInfo: 'Michael Rodriguez, Esq. - Rodriguez & Associates Law Firm',
      keyTerms: 'Primary beneficiaries: Jane Johnson, Alex Johnson, Sam Johnson. Executor: Jane Johnson. Guardian for minor children: Robert Johnson.',
      witnessInfo: ['Sarah Miller', 'David Chen'],
      documentLinks: ['will-2023-original.pdf', 'will-2023-notarized.pdf'],
      category: 'estate',
      status: 'active',
      reviewDate: '2025-01-15'
    },
    {
      id: '2',
      documentType: 'Durable Power of Attorney - Financial',
      partiesInvolved: ['John Johnson (Principal)', 'Jane Johnson (Agent)'],
      effectiveDate: '2023-01-15',
      expirationDate: 'No expiration',
      attorneyInfo: 'Michael Rodriguez, Esq. - Rodriguez & Associates Law Firm',
      keyTerms: 'Grants broad financial powers including banking, real estate, investments, and tax matters. Effective immediately and durable.',
      witnessInfo: ['Sarah Miller'],
      documentLinks: ['financial-poa-2023.pdf'],
      category: 'estate',
      status: 'active'
    },
    {
      id: '3',
      documentType: 'Healthcare Directive / Living Will',
      partiesInvolved: ['John Johnson'],
      effectiveDate: '2023-01-15',
      expirationDate: 'No expiration',
      attorneyInfo: 'Michael Rodriguez, Esq. - Rodriguez & Associates Law Firm',
      keyTerms: 'Healthcare proxy: Jane Johnson. DNR instructions included. Organ donation preferences specified.',
      witnessInfo: ['Dr. Lisa Williams', 'Sarah Miller'],
      documentLinks: ['healthcare-directive-2023.pdf'],
      category: 'healthcare',
      status: 'active',
      reviewDate: '2025-01-15'
    },
    {
      id: '4',
      documentType: 'Home Purchase Contract',
      partiesInvolved: ['John & Jane Johnson (Buyers)', 'Smith Family Trust (Sellers)'],
      effectiveDate: '2018-05-15',
      expirationDate: '2018-06-30',
      attorneyInfo: 'Real Estate Law Group - Thomas Anderson, Esq.',
      keyTerms: 'Purchase price: $450,000. Contingencies: Inspection, financing, appraisal. Closing date: June 15, 2018.',
      witnessInfo: ['Real Estate Agent: Maria Gonzalez'],
      documentLinks: ['home-purchase-contract-2018.pdf', 'inspection-report-2018.pdf'],
      category: 'contracts',
      status: 'expired'
    },
    {
      id: '5',
      documentType: 'Employment Contract Amendment',
      partiesInvolved: ['John Johnson', 'TechCorp Inc.'],
      effectiveDate: '2024-01-01',
      expirationDate: '2026-12-31',
      attorneyInfo: 'Employment Law Associates - Jennifer Park, Esq.',
      keyTerms: 'Salary increase to $125,000. Remote work authorization. Stock option grant: 1,000 shares vesting over 4 years.',
      witnessInfo: ['HR Director: Mark Thompson'],
      documentLinks: ['employment-amendment-2024.pdf'],
      category: 'contracts',
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    documentType: '',
    partiesInvolved: '',
    effectiveDate: '',
    expirationDate: '',
    attorneyInfo: '',
    keyTerms: '',
    witnessInfo: '',
    category: 'other' as const,
    reviewDate: ''
  });

  const getDocsByCategory = (category: string) => {
    return legalDocs.filter(d => d.category === category);
  };

  const getLegalStats = () => {
    const active = legalDocs.filter(d => d.status === 'active').length;
    const expiring = legalDocs.filter(d => d.status === 'expiring').length;
    const needReview = legalDocs.filter(d => {
      if (!d.reviewDate) return false;
      const reviewDate = new Date(d.reviewDate);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      return reviewDate <= sixMonthsFromNow;
    }).length;
    
    return { active, expiring, needReview, total: legalDocs.length };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'estate': return Gavel;
      case 'healthcare': return FileText;
      case 'contracts': return FileText;
      case 'correspondence': return FileText;
      default: return FileText;
    }
  };

  const handleAddDoc = () => {
    const doc: LegalDocument = {
      ...newDoc,
      id: Date.now().toString(),
      partiesInvolved: newDoc.partiesInvolved.split(',').map(p => p.trim()).filter(p => p),
      witnessInfo: newDoc.witnessInfo.split(',').map(w => w.trim()).filter(w => w),
      documentLinks: [],
      status: 'active'
    };
    setLegalDocs([...legalDocs, doc]);
    setNewDoc({
      documentType: '',
      partiesInvolved: '',
      effectiveDate: '',
      expirationDate: '',
      attorneyInfo: '',
      keyTerms: '',
      witnessInfo: '',
      category: 'other',
      reviewDate: ''
    });
    setShowAddForm(false);
  };

  const stats = getLegalStats();

  const LegalDocCard = ({ doc }: { doc: LegalDocument }) => {
    const IconComponent = getCategoryIcon(doc.category);
    
    return (
      <Card key={doc.id} className="vault-shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{doc.documentType}</h4>
                  <p className="text-sm text-gray-600">{doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}</p>
                </div>
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status === 'expiring' && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Parties Involved</p>
                  <div className="flex items-start space-x-1">
                    <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      {doc.partiesInvolved.map((party, idx) => (
                        <p key={idx} className="font-medium text-sm">{party}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1">Attorney</p>
                    <p className="font-medium text-sm">{doc.attorneyInfo}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Important Dates</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Effective: {doc.effectiveDate}</span>
                    </div>
                    {doc.expirationDate && doc.expirationDate !== 'No expiration' && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">Expires: {doc.expirationDate}</span>
                      </div>
                    )}
                    {doc.reviewDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Review: {doc.reviewDate}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1">Documents ({doc.documentLinks.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.documentLinks.slice(0, 2).map((link, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {link.split('-')[0] || 'Document'}
                        </Badge>
                      ))}
                      {doc.documentLinks.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.documentLinks.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600 mb-1">Key Terms Summary</p>
                <p className="text-sm bg-gray-50 p-3 rounded border">{doc.keyTerms}</p>
              </div>
              
              {doc.witnessInfo.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-600 mb-1">Witnesses</p>
                  <p className="text-sm">{doc.witnessInfo.join(', ')}</p>
                </div>
              )}
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
      {/* Legal Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-gray-600">Active Documents</p>
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
            <div className="text-2xl font-bold text-blue-600">{stats.needReview}</div>
            <p className="text-sm text-gray-600">Need Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Document */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Legal Documents</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Legal Document
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Legal Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Input
                  id="documentType"
                  value={newDoc.documentType}
                  onChange={(e) => setNewDoc({...newDoc, documentType: e.target.value})}
                  placeholder="e.g., Last Will and Testament, Power of Attorney"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newDoc.category} onValueChange={(value: any) => setNewDoc({...newDoc, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estate">Estate Planning</SelectItem>
                    <SelectItem value="healthcare">Healthcare Directives</SelectItem>
                    <SelectItem value="contracts">Contracts</SelectItem>
                    <SelectItem value="correspondence">Legal Correspondence</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={newDoc.effectiveDate}
                  onChange={(e) => setNewDoc({...newDoc, effectiveDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={newDoc.expirationDate}
                  onChange={(e) => setNewDoc({...newDoc, expirationDate: e.target.value})}
                  placeholder="Leave blank for no expiration"
                />
              </div>
              <div>
                <Label htmlFor="reviewDate">Review Date (Optional)</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={newDoc.reviewDate}
                  onChange={(e) => setNewDoc({...newDoc, reviewDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="partiesInvolved">Parties Involved (comma-separated)</Label>
                <Input
                  id="partiesInvolved"
                  value={newDoc.partiesInvolved}
                  onChange={(e) => setNewDoc({...newDoc, partiesInvolved: e.target.value})}
                  placeholder="e.g., John Smith, Jane Smith"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="attorneyInfo">Attorney Information</Label>
                <Input
                  id="attorneyInfo"
                  value={newDoc.attorneyInfo}
                  onChange={(e) => setNewDoc({...newDoc, attorneyInfo: e.target.value})}
                  placeholder="Attorney name, firm, and contact information"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="keyTerms">Key Terms Summary</Label>
                <textarea
                  id="keyTerms"
                  value={newDoc.keyTerms}
                  onChange={(e) => setNewDoc({...newDoc, keyTerms: e.target.value})}
                  placeholder="Brief summary of key terms and provisions"
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="witnessInfo">Witnesses (comma-separated)</Label>
                <Input
                  id="witnessInfo"
                  value={newDoc.witnessInfo}
                  onChange={(e) => setNewDoc({...newDoc, witnessInfo: e.target.value})}
                  placeholder="e.g., Sarah Miller, David Chen"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddDoc} className="govault-primary">Save Document</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Document Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="estate">Estate Planning</TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="correspondence">Correspondence</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {legalDocs.map((doc) => <LegalDocCard key={doc.id} doc={doc} />)}
        </TabsContent>

        {(['estate', 'healthcare', 'contracts', 'correspondence', 'other'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getDocsByCategory(category).map((doc) => <LegalDocCard key={doc.id} doc={doc} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}