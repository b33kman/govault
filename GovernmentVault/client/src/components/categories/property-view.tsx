import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Car, Gem, Home, Plus, Edit, Eye, TrendingUp } from 'lucide-react';

interface Property {
  id: string;
  propertyType: string;
  description: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  insurancePolicyLinks: string[];
  loanInformation: string;
  category: 'real_estate' | 'vehicles' | 'valuables' | 'improvements';
  condition: string;
  lastAppraisal?: string;
}

export function PropertyView() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      propertyType: 'Primary Residence',
      description: '4-bedroom colonial home with 2-car garage',
      purchaseDate: '2018-06-15',
      purchasePrice: 450000,
      currentValue: 650000,
      location: '123 Oak Street, Springfield, CA 94401',
      insurancePolicyLinks: ['homeowners-policy-2024'],
      loanInformation: 'Wells Fargo Mortgage - $285,000 remaining',
      category: 'real_estate',
      condition: 'Excellent',
      lastAppraisal: '2024-01-15'
    },
    {
      id: '2',
      propertyType: '2022 Tesla Model Y',
      description: 'Long Range AWD, Pearl White, Premium Interior',
      purchaseDate: '2022-03-20',
      purchasePrice: 65000,
      currentValue: 48000,
      location: 'Primary Residence Garage',
      insurancePolicyLinks: ['auto-insurance-tesla'],
      loanInformation: 'Paid in full',
      category: 'vehicles',
      condition: 'Excellent',
      lastAppraisal: '2024-06-01'
    },
    {
      id: '3',
      propertyType: '2019 Honda CR-V',
      description: 'EX trim, Silver, 45,000 miles',
      purchaseDate: '2019-08-10',
      purchasePrice: 28000,
      currentValue: 22000,
      location: 'Primary Residence Driveway',
      insurancePolicyLinks: ['auto-insurance-honda'],
      loanInformation: 'Honda Financial - $8,500 remaining',
      category: 'vehicles',
      condition: 'Good'
    },
    {
      id: '4',
      propertyType: 'Grandmother\'s Diamond Ring',
      description: '2-carat solitaire diamond engagement ring, circa 1955',
      purchaseDate: '1955-06-01',
      purchasePrice: 1200,
      currentValue: 15000,
      location: 'Home Safe',
      insurancePolicyLinks: ['jewelry-rider'],
      loanInformation: 'N/A',
      category: 'valuables',
      condition: 'Excellent',
      lastAppraisal: '2023-12-01'
    },
    {
      id: '5',
      propertyType: 'Kitchen Renovation',
      description: 'Complete kitchen remodel with granite countertops and stainless appliances',
      purchaseDate: '2023-04-01',
      purchasePrice: 45000,
      currentValue: 45000,
      location: 'Primary Residence - Kitchen',
      insurancePolicyLinks: ['home-improvement-coverage'],
      loanInformation: 'Home equity line of credit',
      category: 'improvements',
      condition: 'New'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    propertyType: '',
    description: '',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    location: '',
    loanInformation: '',
    category: 'real_estate' as const,
    condition: 'Good'
  });

  const getPropertiesByCategory = (category: string) => {
    return properties.filter(p => p.category === category);
  };

  const getPropertyStats = () => {
    const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
    const totalCost = properties.reduce((sum, p) => sum + p.purchasePrice, 0);
    const appreciation = totalValue - totalCost;
    const appreciationPercent = totalCost > 0 ? ((appreciation / totalCost) * 100) : 0;
    
    return { totalValue, totalCost, appreciation, appreciationPercent, total: properties.length };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real_estate': return Home;
      case 'vehicles': return Car;
      case 'valuables': return Gem;
      case 'improvements': return Building;
      default: return Building;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddProperty = () => {
    const property: Property = {
      ...newProperty,
      id: Date.now().toString(),
      insurancePolicyLinks: [],
    };
    setProperties([...properties, property]);
    setNewProperty({
      propertyType: '',
      description: '',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      location: '',
      loanInformation: '',
      category: 'real_estate',
      condition: 'Good'
    });
    setShowAddForm(false);
  };

  const stats = getPropertyStats();

  const PropertyCard = ({ property }: { property: Property }) => {
    const IconComponent = getCategoryIcon(property.category);
    const appreciation = property.currentValue - property.purchasePrice;
    const appreciationPercent = property.purchasePrice > 0 ? ((appreciation / property.purchasePrice) * 100) : 0;
    
    return (
      <Card key={property.id} className="vault-shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{property.propertyType}</h4>
                  <p className="text-sm text-gray-600">{property.description}</p>
                </div>
                <Badge variant="secondary">{property.category.replace('_', ' ')}</Badge>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Current Value</p>
                  <p className="font-semibold text-green-600 text-lg">{formatCurrency(property.currentValue)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Purchase Price</p>
                  <p className="font-medium">{formatCurrency(property.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Appreciation</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-4 w-4 ${appreciation >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`font-medium ${appreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {appreciationPercent >= 0 ? '+' : ''}{appreciationPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Condition</p>
                  <Badge className={
                    property.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                    property.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                    property.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {property.condition}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Purchase Date</p>
                  <p className="font-medium">{property.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Location</p>
                  <p className="text-sm">{property.location}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Financing</p>
                  <p className="text-sm">{property.loanInformation}</p>
                </div>
                {property.lastAppraisal && (
                  <div>
                    <p className="text-gray-600 mb-1">Last Appraisal</p>
                    <p className="text-sm">{property.lastAppraisal}</p>
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
      {/* Property Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</div>
            <p className="text-sm text-gray-600">Total Property Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalCost)}</div>
            <p className="text-sm text-gray-600">Total Investment</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${stats.appreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.appreciation >= 0 ? '+' : ''}{formatCurrency(stats.appreciation)}
            </div>
            <p className="text-sm text-gray-600">Total Appreciation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Properties Tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Property */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Property Portfolio</h3>
        <Button onClick={() => setShowAddForm(true)} className="govault-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Input
                  id="propertyType"
                  value={newProperty.propertyType}
                  onChange={(e) => setNewProperty({...newProperty, propertyType: e.target.value})}
                  placeholder="e.g., Primary Residence, 2022 Tesla Model Y"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProperty.category} onValueChange={(value: any) => setNewProperty({...newProperty, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="valuables">Valuables</SelectItem>
                    <SelectItem value="improvements">Home Improvements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                  placeholder="Detailed description of the property"
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newProperty.purchaseDate}
                  onChange={(e) => setNewProperty({...newProperty, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={newProperty.purchasePrice}
                  onChange={(e) => setNewProperty({...newProperty, purchasePrice: parseFloat(e.target.value) || 0})}
                  placeholder="Original purchase price"
                />
              </div>
              <div>
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={newProperty.currentValue}
                  onChange={(e) => setNewProperty({...newProperty, currentValue: parseFloat(e.target.value) || 0})}
                  placeholder="Current estimated value"
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={newProperty.condition} onValueChange={(value) => setNewProperty({...newProperty, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                  placeholder="Physical location or address"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="loanInformation">Loan/Financing Information</Label>
                <Input
                  id="loanInformation"
                  value={newProperty.loanInformation}
                  onChange={(e) => setNewProperty({...newProperty, loanInformation: e.target.value})}
                  placeholder="Loan details or 'Paid in full'"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProperty} className="govault-primary">Save Property</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="real_estate">Real Estate</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="valuables">Valuables</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
        </TabsContent>

        {(['real_estate', 'vehicles', 'valuables', 'improvements'] as const).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {getPropertiesByCategory(category).map((property) => <PropertyCard key={property.id} property={property} />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}