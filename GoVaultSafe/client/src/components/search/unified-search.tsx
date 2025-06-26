import { useState } from 'react';
import { Search, FileText, Database, Filter, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  type: 'document' | 'data' | 'person';
  category: string;
  lastModified: string;
  source: 'drive' | 'sheets';
  snippet: string;
  relevance: number;
}

export function UnifiedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    source: 'all'
  });

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Search across Google Drive and Sheets via API
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${filters.type}&category=${filters.category}`);
      if (response.ok) {
        const searchResults = await response.json();
        setResults(searchResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const getResultIcon = (type: string, source: string) => {
    if (type === 'document') return <FileText className="text-blue-600" size={20} />;
    if (type === 'data') return <Database className="text-green-600" size={20} />;
    if (type === 'person') return <Users className="text-purple-600" size={20} />;
    return <FileText className="text-gray-600" size={20} />;
  };

  const getSourceBadge = (source: string) => {
    return source === 'drive' ? 
      <Badge variant="outline" className="text-xs">Google Drive</Badge> :
      <Badge variant="outline" className="text-xs">Sheets Data</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <Card className="vault-shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <Search className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Unified Search</h2>
              <p className="text-sm text-gray-600">Search across all documents and data</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search documents, data, contacts, or any family information..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            
            {/* Search Filters */}
            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={isSearching} className="govault-primary text-white">
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="document">Documents</option>
                  <option value="data">Data</option>
                  <option value="person">Contacts</option>
                </select>
                
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All Categories</option>
                  <option value="financial">Financial</option>
                  <option value="insurance">Insurance</option>
                  <option value="legal">Legal</option>
                  <option value="medical">Medical</option>
                  <option value="personal">Personal ID</option>
                  <option value="property">Property</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="vault-shadow-card">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({results.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.type, result.source)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-medium text-gray-900 truncate">{result.title}</h4>
                        {getSourceBadge(result.source)}
                        <Badge variant="secondary" className="text-xs">{result.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.snippet}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {result.lastModified}
                        </span>
                        <span>Relevance: {result.relevance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {query && results.length === 0 && !isSearching && (
        <Card className="vault-shadow-card">
          <CardContent className="text-center py-8">
            <Search className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}