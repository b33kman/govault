import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Network, 
  ArrowRight, 
  ExternalLink, 
  AlertTriangle, 
  Info, 
  Eye,
  FileText,
  Home,
  DollarSign,
  Shield,
  Users,
  Building,
  Gavel,
  Key
} from 'lucide-react';

interface RelatedDocument {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  relationshipType: string;
  strength: number;
  description: string;
  lastModified: string;
  url?: string;
}

interface DocumentImpact {
  affectedDocuments: RelatedDocument[];
  suggestedActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

interface DocumentRelationshipsProps {
  documentId: string;
  category: string;
  title: string;
  onNavigate?: (url: string) => void;
}

const categoryIcons = {
  'Family IDs': Users,
  'Finance': DollarSign,
  'Property': Home,
  'Insurance': Shield,
  'Legal': Gavel,
  'Business': Building,
  'Contacts': Users,
  'Passwords': Key,
  'Taxes': FileText
};

const relationshipLabels = {
  insurance_covers: 'Insures',
  loan_secures: 'Secures',
  payment_source: 'Pays for',
  beneficiary_of: 'Beneficiary',
  services: 'Services',
  governs: 'Governs',
  professional_for: 'Professional for',
  owns: 'Owns',
  maintains: 'Maintains'
};

export function DocumentRelationships({ 
  documentId, 
  category, 
  title, 
  onNavigate 
}: DocumentRelationshipsProps) {
  const [relationships, setRelationships] = useState<RelatedDocument[]>([]);
  const [impact, setImpact] = useState<DocumentImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  useEffect(() => {
    fetchRelationships();
  }, [documentId, category]);

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${documentId}/relationships?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships || []);
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImpact = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/impact?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setImpact(data);
        setShowImpactAnalysis(true);
      }
    } catch (error) {
      console.error('Error analyzing impact:', error);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'bg-green-500';
    if (strength >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 0.8) return 'Strong';
    if (strength >= 0.6) return 'Medium';
    return 'Weak';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || FileText;
    return IconComponent;
  };

  if (loading) {
    return (
      <Card className="vault-shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Related Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Loading relationships...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Relationships Card */}
      <Card className="vault-shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-600" />
              <span>Related Documents</span>
              {relationships.length > 0 && (
                <Badge variant="secondary">{relationships.length}</Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={analyzeImpact}
                className="text-blue-600 hover:text-blue-700"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Analyze Impact
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {relationships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Network className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No relationships detected</p>
              <p className="text-sm">This document doesn't have any detected relationships with other documents yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relationships.map((related, index) => {
                const IconComponent = getCategoryIcon(related.category);
                const relationshipLabel = relationshipLabels[related.relationshipType as keyof typeof relationshipLabels] || related.relationshipType;
                
                return (
                  <div key={related.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Category Icon */}
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{related.title}</h4>
                            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-blue-600 font-medium">{relationshipLabel}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {related.category}
                            </Badge>
                            {related.subcategory && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                {related.subcategory}
                              </Badge>
                            )}
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 ${getStrengthColor(related.strength)} rounded-full`} />
                              <span className="text-xs text-gray-600">
                                {getStrengthLabel(related.strength)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{related.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Updated {new Date(related.lastModified).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              {related.url && onNavigate && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onNavigate(related.url!)}
                                  className="text-blue-600 hover:text-blue-700 h-6 px-2 text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-600 hover:text-gray-700 h-6 px-2 text-xs"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Analysis Card */}
      {showImpactAnalysis && impact && (
        <Card className="vault-shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Impact Analysis</span>
              <Badge className={`${getRiskColor(impact.riskLevel)}`}>
                {impact.riskLevel.toUpperCase()} RISK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Analysis Summary</h4>
                  <p className="text-sm text-blue-800">{impact.description}</p>
                </div>
              </div>
            </div>

            {impact.suggestedActions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
                <div className="space-y-2">
                  {impact.suggestedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowImpactAnalysis(false)}
              >
                Close Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship Map Visualization */}
      {relationships.length > 0 && (
        <Card className="vault-shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-purple-600" />
              <span>Relationship Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 min-h-48">
              <div className="flex items-center justify-center space-x-8">
                {/* Central Document */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 max-w-24 truncate">
                    {title}
                  </div>
                  <div className="text-xs text-gray-500">{category}</div>
                </div>

                {/* Connecting Lines and Related Documents */}
                <div className="grid grid-cols-1 gap-4">
                  {relationships.slice(0, 3).map((related, index) => {
                    const IconComponent = getCategoryIcon(related.category);
                    return (
                      <div key={related.id} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <div className="w-8 h-0.5 bg-gray-400" />
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-xs font-medium text-gray-900 max-w-20 truncate">
                            {related.title.split(' ').slice(0, 2).join(' ')}
                          </div>
                          <div className="text-xs text-gray-500">{related.category}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {relationships.length > 3 && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                        <span className="text-xs font-bold text-gray-600">+{relationships.length - 3}</span>
                      </div>
                      <div className="text-xs text-gray-500">more</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}