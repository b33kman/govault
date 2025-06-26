import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Calendar, FileText, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  type: 'data' | 'document';
  content: string;
  lastUpdated: string;
  status?: string;
  relevance: number;
  metadata: {
    [key: string]: any;
  };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Mock search data - in production this would come from Google Sheets/Drive API
  const mockSearchData: SearchResult[] = [
    {
      id: '1',
      title: 'Home Insurance Policy 2024',
      category: 'Insurance',
      type: 'document',
      content: 'State Farm homeowners insurance policy with $750,000 coverage, $2,500 deductible',
      lastUpdated: '2024-03-15',
      status: 'active',
      relevance: 95,
      metadata: {
        policyNumber: 'AS-HOME-123789',
        company: 'Allstate',
        premium: 2400,
        renewalDate: '2025-03-20'
      }
    },
    {
      id: '2',
      title: 'Chase Primary Checking Account',
      category: 'Finance',
      type: 'data',
      content: 'Primary checking account with Chase Bank, account ending in 1234',
      lastUpdated: '2024-12-20',
      status: 'active',
      relevance: 88,
      metadata: {
        accountNumber: '****1234',
        balance: 15750.50,
        institution: 'Chase Bank',
        type: 'Checking'
      }
    },
    {
      id: '3',
      title: 'John Johnson Driver\'s License',
      category: 'Family IDs',
      type: 'data',
      content: 'California driver\'s license, expires March 2025',
      lastUpdated: '2024-01-10',
      status: 'expiring',
      relevance: 82,
      metadata: {
        idNumber: 'DL123456789',
        expirationDate: '2025-03-15',
        issuingAuthority: 'DMV California'
      }
    },
    {
      id: '4',
      title: 'Last Will and Testament',
      category: 'Legal',
      type: 'document',
      content: 'Family will and testament with estate planning details, updated January 2023',
      lastUpdated: '2023-01-15',
      status: 'active',
      relevance: 78,
      metadata: {
        attorneyInfo: 'Michael Rodriguez, Esq.',
        effectiveDate: '2023-01-15',
        reviewDate: '2025-01-15'
      }
    },
    {
      id: '5',
      title: 'Netflix Account Password',
      category: 'Passwords',
      type: 'data',
      content: 'Netflix streaming service login credentials',
      lastUpdated: '2024-10-05',
      status: 'active',
      relevance: 65,
      metadata: {
        username: 'john.johnson@gmail.com',
        strength: 'strong',
        twoFactorEnabled: false
      }
    },
    {
      id: '6',
      title: 'Michael Rodriguez - Attorney',
      category: 'Contacts',
      type: 'data',
      content: 'Family attorney specializing in estate planning and family law',
      lastUpdated: '2024-06-01',
      status: 'active',
      relevance: 72,
      metadata: {
        company: 'Rodriguez & Associates Law Firm',
        phone: '(555) 234-5678',
        specialization: 'Estate Planning, Family Law'
      }
    }
  ];

  const categories = [
    'all', 'Family IDs', 'Finance', 'Property', 'Passwords', 
    'Insurance', 'Taxes', 'Legal', 'Business', 'Contacts'
  ];

  const performSearch = async () => {
    // Use API search for real implementation
    return performApiSearch();
  };

  const performMockSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredResults = mockSearchData;

    // Filter by search query
    if (searchQuery.trim()) {
      filteredResults = filteredResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(result.metadata).some(value => 
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.category === selectedCategory
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.type === selectedType
      );
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredResults = filteredResults.filter(result => 
        new Date(result.lastUpdated) >= filterDate
      );
    }

    // Sort results
    switch (sortBy) {
      case 'relevance':
        filteredResults.sort((a, b) => b.relevance - a.relevance);
        break;
      case 'date':
        filteredResults.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case 'category':
        filteredResults.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'title':
        filteredResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setResults(filteredResults);
    setTotalResults(filteredResults.length);
    setIsSearching(false);
  };

  // Perform search when filters change
  useEffect(() => {
    performSearch();
  }, [searchQuery, selectedCategory, selectedType, dateRange, sortBy]);

  const performApiSearch = async () => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams({
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(dateRange !== 'all' && { dateRange }),
        sortBy
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results || []);
        setTotalResults(data.totalResults || 0);
      } else {
        console.error('Search error:', data.error);
        setResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search request failed:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'finance': return DollarSign;
      case 'contacts': return Users;
      case 'legal': return FileText;
      case 'insurance': return AlertTriangle;
      default: return FileText;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['Title', 'Category', 'Type', 'Content', 'Last Updated', 'Status'],
      ...results.map(result => [
        result.title,
        result.category,
        result.type,
        result.content,
        result.lastUpdated,
        result.status || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `govault-search-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ResultCard = ({ result }: { result: SearchResult }) => {
    const IconComponent = getCategoryIcon(result.category);

    return (
      <Card className="vault-shadow-card hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{result.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{result.category}</Badge>
                    <Badge variant="outline">{result.type}</Badge>
                    {result.status && (
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{result.content}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {result.lastUpdated}</span>
                </div>
                <div>
                  <span>Relevance: {result.relevance}%</span>
                </div>
              </div>

              {Object.keys(result.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.metadata).slice(0, 3).map(([key, value]) => (
                      <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 ml-4">
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <PageHeader 
          title="Advanced Search"
          subtitle="Find documents and data across your family vault"
        />

        {/* Search Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="searchQuery">Search Query</Label>
                <div className="relative">
                  <Input
                    id="searchQuery"
                    placeholder="Search across all data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="data">Data Records</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Updated</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Search Results {totalResults > 0 && `(${totalResults} found)`}
              </CardTitle>
              {results.length > 0 && (
                <Button onClick={exportResults} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || dateRange !== 'all'
                    ? 'No results found for your search criteria'
                    : 'Enter a search query or adjust filters to find documents and data'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}