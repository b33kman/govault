import { useState, useCallback } from 'react';
import { Upload, FileText, Image, FileType, X, Check, Brain, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ExtractionConfirmation } from './extraction-confirmation';

interface DocumentAnalysis {
  documentType: string;
  category: string;
  extractedData: {
    category: string;
    subcategory?: string;
    fields: Record<string, any>;
    confidence: number;
    summary: string;
    suggestedFileName?: string;
  };
  requiresConfirmation: boolean;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'analyzing' | 'confirming' | 'uploading' | 'completed' | 'error';
  category: string;
  googleFileId?: string;
  analysis?: DocumentAnalysis;
  errorMessage?: string;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirmingFile, setConfirmingFile] = useState<UploadFile | null>(null);

  const categories = [
    'Family IDs',
    'Finance',
    'Property', 
    'Passwords',
    'Insurance',
    'Taxes',
    'Legal',
    'Business',
    'Contacts'
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending',
      category: 'Finance' // Default category
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, category } : f
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const analyzeDocument = async (uploadFile: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'analyzing', progress: 25 } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);

      const response = await fetch('/api/documents/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'confirming', 
            progress: 50,
            analysis: result.analysis,
            category: result.analysis.category
          } : f
        ));

        // Show confirmation dialog
        const updatedFile = files.find(f => f.id === uploadFile.id);
        if (updatedFile) {
          setConfirmingFile({
            ...updatedFile,
            analysis: result.analysis,
            category: result.analysis.category,
            status: 'confirming'
          });
        }
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          progress: 0,
          errorMessage: 'Failed to analyze document'
        } : f
      ));
    }
  };

  const uploadWithConfirmedData = async (uploadFile: UploadFile, correctedData: Record<string, any>) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 75 } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('category', uploadFile.category);
      if (uploadFile.analysis) {
        formData.append('extractedData', JSON.stringify(uploadFile.analysis.extractedData));
        formData.append('userCorrections', JSON.stringify(correctedData));
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            googleFileId: result.fileId 
          } : f
        ));
        setConfirmingFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          progress: 0,
          errorMessage: 'Failed to upload document'
        } : f
      ));
      setConfirmingFile(null);
    }
  };

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    // Start with AI analysis
    await analyzeDocument(uploadFile);
  };

  const uploadAllFiles = () => {
    files.filter(f => f.status === 'pending').forEach(uploadSingleFile);
  };

  const handleConfirmExtraction = (correctedData: Record<string, any>) => {
    if (confirmingFile) {
      uploadWithConfirmedData(confirmingFile, correctedData);
    }
  };

  const handleCancelConfirmation = () => {
    if (confirmingFile) {
      setFiles(prev => prev.filter(f => f.id !== confirmingFile.id));
      setConfirmingFile(null);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={20} className="text-blue-600" />;
    if (file.type.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <FileType size={20} className="text-gray-600" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'analyzing':
        return <Brain size={16} className="text-blue-600 animate-pulse" />;
      case 'confirming':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'uploading':
        return <Upload size={16} className="text-blue-600" />;
      case 'completed':
        return <Check size={16} className="text-green-600" />;
      case 'error':
        return <X size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return 'Ready to analyze';
      case 'analyzing':
        return 'Analyzing with AI...';
      case 'confirming':
        return 'Awaiting confirmation';
      case 'uploading':
        return 'Uploading to Drive...';
      case 'completed':
        return 'Upload complete';
      case 'error':
        return 'Error occurred';
      default:
        return 'Unknown status';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="vault-shadow-card mb-6">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Upload className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
              <p className="text-sm text-gray-600">Upload documents to Google Drive through the secure interface</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-600">
                Supports PDF, images, and document files up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="vault-shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Files to Upload ({files.length})</h3>
            <Button 
              onClick={uploadAllFiles}
              disabled={files.every(f => f.status !== 'pending')}
              className="govault-primary text-white"
            >
              Upload All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((uploadFile) => (
                <div key={uploadFile.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {getFileIcon(uploadFile.file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{uploadFile.file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(uploadFile.file.size)}</p>
                    </div>
                    
                    {/* Status and Category Display */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadFile.status)}
                      <Badge variant="outline" className="text-xs">
                        {uploadFile.category}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => uploadSingleFile(uploadFile)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <Brain size={14} className="mr-1" />
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                      
                      {uploadFile.status === 'completed' && (
                        <Badge variant="secondary" className="text-green-600">
                          <Check size={12} className="mr-1" />
                          Complete
                        </Badge>
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <Badge variant="destructive" className="text-red-600">
                          <AlertCircle size={12} className="mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{getStatusText(uploadFile.status)}</p>
                    {uploadFile.errorMessage && (
                      <p className="text-sm text-red-600 mt-1">{uploadFile.errorMessage}</p>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {(uploadFile.status === 'analyzing' || uploadFile.status === 'uploading') && (
                    <div className="mt-3">
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}
                  
                  {uploadFile.status === 'completed' && (
                    <div className="mt-3 flex items-center space-x-2 text-green-600">
                      <Check size={16} />
                      <span className="text-sm">Document processed and uploaded successfully</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Extraction Confirmation Dialog */}
      {confirmingFile && confirmingFile.analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ExtractionConfirmation
              analysis={confirmingFile.analysis}
              fileName={confirmingFile.file.name}
              onConfirm={handleConfirmExtraction}
              onCancel={handleCancelConfirmation}
              isProcessing={confirmingFile.status === 'uploading'}
            />
          </div>
        </div>
      )}
    </div>
  );
}