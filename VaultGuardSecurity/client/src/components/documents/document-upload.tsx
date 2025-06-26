import { useState, useCallback } from 'react';
import { Upload, FileText, Image, FileType, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  category: string;
  googleFileId?: string;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Financial',
    'Insurance', 
    'Legal',
    'Medical',
    'Personal ID',
    'Property'
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
      category: 'Financial' // Default category
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

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('category', uploadFile.category);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === uploadFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 200);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            googleFileId: result.googleFileId 
          } : f
        ));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'error', progress: 0 } : f
      ));
    }
  };

  const uploadAllFiles = () => {
    files.filter(f => f.status === 'pending').forEach(uploadSingleFile);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={20} className="text-blue-600" />;
    if (file.type.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <FileType size={20} className="text-gray-600" />;
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
                    
                    {/* Category Selector */}
                    <select
                      value={uploadFile.category}
                      onChange={(e) => updateFileCategory(uploadFile.id, e.target.value)}
                      disabled={uploadFile.status === 'uploading' || uploadFile.status === 'completed'}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    {/* Status and Actions */}
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => uploadSingleFile(uploadFile)}
                            className="govault-primary text-white"
                          >
                            Upload
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
                          Uploaded
                        </Badge>
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <Badge variant="destructive" className="text-red-600">
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="space-y-2">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <p className="text-xs text-gray-600">Uploading to Google Drive... {uploadFile.progress}%</p>
                    </div>
                  )}
                  
                  {uploadFile.status === 'completed' && uploadFile.googleFileId && (
                    <p className="text-xs text-green-600">
                      Successfully uploaded to Google Drive (ID: {uploadFile.googleFileId})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}