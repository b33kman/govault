import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, DollarSign, AlertTriangle, Plus, Edit, Eye, Download } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

interface TaxRecord {
  id: string;
  taxYear: number;
  filingStatus: string;
  preparerInfo: string;
  keyDeductions: string[];
  refundAmount: number;
  importantDates: string[];
  documentLinks: string[];
  status: 'filed' | 'pending' | 'extension' | 'overdue';
  federalReturn: boolean;
  stateReturn: boolean;
  estimatedPayments: number;
}

export function TaxesView() {
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([
    {
      id: '1',
      taxYear: 2023,
      filingStatus: 'Married Filing Jointly',
      preparerInfo: 'H&R Block - Janet Williams, CPA',
      keyDeductions: ['Mortgage Interest', 'State/Local Taxes', 'Charitable Contributions', 'Medical Expenses'],
      refundAmount: 3250,
      importantDates: ['Filed: 2024-03-15', 'Refund Received: 2024-04-02'],
      documentLinks: ['2023-federal-return.pdf', '2023-state-return.pdf', '2023-w2-forms.pdf'],
      status: 'filed',
      federalReturn: true,
      stateReturn: true,
      estimatedPayments: 0
    },
    {
      id: '2',
      taxYear: 2022,
      filingStatus: 'Married Filing Jointly',
      preparerInfo: 'Self-prepared using TurboTax',
      keyDeductions: ['Mortgage Interest', 'State/Local Taxes', 'Charitable Contributions'],
      refundAmount: 1850,
      importantDates: ['Filed: 2023-04-10', 'Refund Received: 2023-04-25'],
      documentLinks: ['2022-federal-return.pdf', '2022-state-return.pdf'],
      status: 'filed',
      federalReturn: true,
      stateReturn: true,
      estimatedPayments: 0
    },
    {
      id: '3',
      taxYear: 2024,
      filingStatus: 'Married Filing Jointly',
      preparerInfo: 'TBD - Need to select preparer',
      keyDeductions: ['Mortgage Interest', 'State/Local Taxes', 'Business Expenses'],
      refundAmount: 0,
      importantDates: ['Due Date: 2025-04-15'],
      documentLinks: ['2024-w2-partial.pdf'],
      status: 'pending',
      federalReturn: false,
      stateReturn: false,
      estimatedPayments: 2400
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    taxYear: new Date().getFullYear() - 1,
    filingStatus: 'Single',
    preparerInfo: '',
    keyDeductions: '',
    refundAmount: 0,
    importantDates: '',
    federalReturn: false,
    stateReturn: false,
    estimatedPayments: 0
  });

  const getTaxStats = () => {
    const totalRefunds = taxRecords.filter(r => r.status === 'filed').reduce((sum, r) => sum + r.refundAmount, 0);
    const pendingReturns = taxRecords.filter(r => r.status === 'pending' || r.status === 'extension').length;
    const filedReturns = taxRecords.filter(r => r.status === 'filed').length;
    const totalEstimated = taxRecords.reduce((sum, r) => sum + r.estimatedPayments, 0);
    
    return { totalRefunds, pendingReturns, filedReturns, totalEstimated, total: taxRecords.length };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'extension': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddRecord = () => {
    const record: TaxRecord = {
      ...newRecord,
      id: Date.now().toString(),
      keyDeductions: newRecord.keyDeductions.split(',').map(d => d.trim()).filter(d => d),
      importantDates: newRecord.importantDates.split(',').map(d => d.trim()).filter(d => d),
      documentLinks: [],
      status: 'pending'
    };
    setTaxRecords([...taxRecords, record]);
    setNewRecord({
      taxYear: new Date().getFullYear() - 1,
      filingStatus: 'Single',
      preparerInfo: '',
      keyDeductions: '',
      refundAmount: 0,
      importantDates: '',
      federalReturn: false,
      stateReturn: false,
      estimatedPayments: 0
    });
    setShowAddForm(false);
  };

  const stats = getTaxStats();

  const TaxRecordCard = ({ record }: { record: TaxRecord }) => (
    <Card key={record.id} className="vault-shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Tax Year {record.taxYear}</h4>
                <p className="text-sm text-gray-600">{record.filingStatus}</p>
              </div>
              <Badge className={getStatusColor(record.status)}>
                {record.status === 'overdue' && <AlertTriangle className="mr-1 h-3 w-3" />}
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Tax Preparer</p>
                <p className="font-medium">{record.preparerInfo}</p>
                
                <div className="mt-3 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Federal:</span>
                    <Badge className={record.federalReturn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {record.federalReturn ? 'Filed' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">State:</span>
                    <Badge className={record.stateReturn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {record.stateReturn ? 'Filed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 mb-1">Financial Summary</p>
                <div className="space-y-1">
                  {record.refundAmount !== 0 && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className={`font-semibold ${record.refundAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.refundAmount > 0 ? 'Refund: ' : 'Owed: '}
                        {formatCurrency(Math.abs(record.refundAmount))}
                      </span>
                    </div>
                  )}
                  {record.estimatedPayments > 0 && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        Estimated: {formatCurrency(record.estimatedPayments)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-600 text-xs mb-1">Key Deductions</p>
                  <div className="flex flex-wrap gap-1">
                    {record.keyDeductions.slice(0, 3).map((deduction, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {deduction}
                      </Badge>
                    ))}
                    {record.keyDeductions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{record.keyDeductions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 mb-1">Important Dates</p>
                <div className="space-y-1">
                  {record.importantDates.map((date, idx) => (
                    <p key={idx} className="text-sm">{date}</p>
                  ))}
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-600 text-xs mb-1">Documents ({record.documentLinks.length})</p>
                  <div className="flex space-x-2">
                    {record.documentLinks.slice(0, 2).map((doc, idx) => (
                      <Button key={idx} variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        {doc.split('-')[1] || 'Doc'}
                      </Button>
                    ))}
                    {record.documentLinks.length > 2 && (
                      <span className="text-xs text-gray-500">+{record.documentLinks.length - 2}</span>
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

  return (
    <div className="space-y-6">
      {/* Tax Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Refunds Received"
          value={formatCurrency(stats.totalRefunds)}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Returns Filed"
          value={stats.filedReturns}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending Returns"
          value={stats.pendingReturns}
          icon={AlertTriangle}
          color="yellow"
          showAlert={stats.pendingReturns > 0}
        />
        <StatCard
          title="Estimated Payments"
          value={formatCurrency(stats.totalEstimated)}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Add New Record */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tax Records Archive</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Tax Record
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Tax Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxYear">Tax Year</Label>
                <Input
                  id="taxYear"
                  type="number"
                  value={newRecord.taxYear}
                  onChange={(e) => setNewRecord({...newRecord, taxYear: parseInt(e.target.value) || 0})}
                  placeholder="2023"
                />
              </div>
              <div>
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select value={newRecord.filingStatus} onValueChange={(value) => setNewRecord({...newRecord, filingStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married Filing Jointly">Married Filing Jointly</SelectItem>
                    <SelectItem value="Married Filing Separately">Married Filing Separately</SelectItem>
                    <SelectItem value="Head of Household">Head of Household</SelectItem>
                    <SelectItem value="Qualifying Widow(er)">Qualifying Widow(er)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="preparerInfo">Tax Preparer Information</Label>
                <Input
                  id="preparerInfo"
                  value={newRecord.preparerInfo}
                  onChange={(e) => setNewRecord({...newRecord, preparerInfo: e.target.value})}
                  placeholder="e.g., H&R Block - Janet Williams, CPA or Self-prepared using TurboTax"
                />
              </div>
              <div>
                <Label htmlFor="refundAmount">Refund/Owed Amount</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  value={newRecord.refundAmount}
                  onChange={(e) => setNewRecord({...newRecord, refundAmount: parseFloat(e.target.value) || 0})}
                  placeholder="Positive for refund, negative for amount owed"
                />
              </div>
              <div>
                <Label htmlFor="estimatedPayments">Estimated Payments Made</Label>
                <Input
                  id="estimatedPayments"
                  type="number"
                  step="0.01"
                  value={newRecord.estimatedPayments}
                  onChange={(e) => setNewRecord({...newRecord, estimatedPayments: parseFloat(e.target.value) || 0})}
                  placeholder="Total quarterly payments"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="keyDeductions">Key Deductions (comma-separated)</Label>
                <Input
                  id="keyDeductions"
                  value={newRecord.keyDeductions}
                  onChange={(e) => setNewRecord({...newRecord, keyDeductions: e.target.value})}
                  placeholder="e.g., Mortgage Interest, Charitable Contributions, Medical Expenses"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="importantDates">Important Dates (comma-separated)</Label>
                <Input
                  id="importantDates"
                  value={newRecord.importantDates}
                  onChange={(e) => setNewRecord({...newRecord, importantDates: e.target.value})}
                  placeholder="e.g., Filed: 2024-03-15, Refund Received: 2024-04-02"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="federalReturn"
                    checked={newRecord.federalReturn}
                    onChange={(e) => setNewRecord({...newRecord, federalReturn: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="federalReturn">Federal Return Filed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="stateReturn"
                    checked={newRecord.stateReturn}
                    onChange={(e) => setNewRecord({...newRecord, stateReturn: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="stateReturn">State Return Filed</Label>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddRecord} className="govault-primary">Save Tax Record</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Records List */}
      <div className="space-y-4">
        {taxRecords
          .sort((a, b) => b.taxYear - a.taxYear)
          .map((record) => <TaxRecordCard key={record.id} record={record} />)}
      </div>
    </div>
  );
}