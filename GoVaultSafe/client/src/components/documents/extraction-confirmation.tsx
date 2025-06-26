import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Edit3, Save, X } from 'lucide-react';

interface ExtractedData {
  category: string;
  subcategory?: string;
  fields: Record<string, any>;
  confidence: number;
  summary: string;
  suggestedFileName?: string;
}

interface DocumentAnalysis {
  documentType: string;
  category: string;
  extractedData: ExtractedData;
  requiresConfirmation: boolean;
}

interface ExtractionConfirmationProps {
  analysis: DocumentAnalysis;
  fileName: string;
  onConfirm: (correctedData: Record<string, any>) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function ExtractionConfirmation({ 
  analysis, 
  fileName, 
  onConfirm, 
  onCancel, 
  isProcessing = false 
}: ExtractionConfirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, any>>(analysis.extractedData.fields);
  const [editedSummary, setEditedSummary] = useState(analysis.extractedData.summary);
  const [editedSubcategory, setEditedSubcategory] = useState(analysis.extractedData.subcategory || '');

  const confidenceColor = analysis.extractedData.confidence >= 0.9 
    ? 'bg-green-100 text-green-800' 
    : analysis.extractedData.confidence >= 0.7 
    ? 'bg-yellow-100 text-yellow-800' 
    : 'bg-red-100 text-red-800';

  const handleFieldChange = (fieldName: string, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleConfirm = () => {
    const corrections = {
      ...editedFields,
      summary: editedSummary,
      subcategory: editedSubcategory
    };
    onConfirm(corrections);
  };

  const renderFieldInput = (fieldName: string, value: any) => {
    const fieldType = getFieldType(fieldName, value);
    
    switch (fieldType) {
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={!isEditing}
          />
        );
    }
  };

  const getFieldType = (fieldName: string, value: any): string => {
    const lowerField = fieldName.toLowerCase();
    if (lowerField.includes('date') || lowerField.includes('expir') || lowerField.includes('renewal')) {
      return 'date';
    }
    if (lowerField.includes('amount') || lowerField.includes('balance') || lowerField.includes('premium') || lowerField.includes('price')) {
      return 'number';
    }
    if (lowerField.includes('notes') || lowerField.includes('terms') || lowerField.includes('description')) {
      return 'textarea';
    }
    return 'text';
  };

  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="vault-shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={24} />
                Document Analysis Complete
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Review the extracted information and make corrections if needed
              </p>
            </div>
            <Badge className={confidenceColor}>
              {Math.round(analysis.extractedData.confidence * 100)}% confidence
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Info */}
        <Card className="vault-shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Original File</Label>
              <p className="text-sm text-gray-900 mt-1">{fileName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Document Type</Label>
              <p className="text-sm text-gray-900 mt-1">{analysis.documentType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Category</Label>
              <Badge variant="outline" className="mt-1">
                {analysis.category}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
              {isEditing ? (
                <Input
                  value={editedSubcategory}
                  onChange={(e) => setEditedSubcategory(e.target.value)}
                  placeholder="Enter subcategory"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{editedSubcategory || 'Not specified'}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Suggested Filename</Label>
              <p className="text-sm text-gray-900 mt-1">{analysis.extractedData.suggestedFileName || fileName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Fields */}
        <Card className="vault-shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Extracted Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 size={16} />
                {isEditing ? 'Stop Editing' : 'Edit Fields'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Document Summary</Label>
              {isEditing ? (
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {editedSummary}
                </p>
              )}
            </div>

            <Separator />

            {/* Extracted Fields */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Extracted Data Fields</h4>
              
              {Object.keys(editedFields).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(editedFields).map(([fieldName, value]) => (
                    <div key={fieldName}>
                      <Label className="text-sm font-medium text-gray-700">
                        {formatFieldName(fieldName)}
                      </Label>
                      <div className="mt-1">
                        {renderFieldInput(fieldName, value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle size={32} className="mx-auto mb-2" />
                  <p>No structured fields were extracted from this document.</p>
                  <p className="text-sm">The document will be uploaded but no data will be added to sheets.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="vault-shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={16} />
              <span>Please review the extracted information above and make any necessary corrections</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel Upload
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} />
                {isProcessing ? 'Processing...' : 'Confirm & Upload'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}