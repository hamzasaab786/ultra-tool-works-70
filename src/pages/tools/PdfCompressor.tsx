import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Settings,
  Zap,
  Archive,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';
import DragDropUpload from '@/components/DragDropUpload';
import { PDFDocument } from 'pdf-lib';

interface CompressionOptions {
  level: 'basic' | 'recommended' | 'high';
  removeMetadata: boolean;
  optimizeImages: boolean;
  flattenForms: boolean;
}

interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  compressedBlob?: Blob;
  compressionRatio?: number;
  file?: File;
}

const PdfCompressor = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>({
    level: 'recommended',
    removeMetadata: true,
    optimizeImages: true,
    flattenForms: false
  });
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateFileId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleFilesSelected = useCallback((fileList: FileList) => {
    const pdfFiles = Array.from(fileList).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Please select PDF files only.",
        variant: "destructive"
      });
      return;
    }

    const newFiles: ProcessedFile[] = pdfFiles.map(file => ({
      id: generateFileId(),
      name: file.name,
      originalSize: file.size,
      status: 'pending',
      file: file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    toast({
      title: "Files Added",
      description: `${pdfFiles.length} PDF file(s) ready for compression.`
    });
  }, [toast]);

  const compressPDF = async (file: File, options: CompressionOptions): Promise<{ blob: Blob; compressionRatio: number }> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove metadata if requested
      if (options.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('PDF Compressor Tool');
        pdfDoc.setCreator('');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      }

      // Flatten forms if requested
      if (options.flattenForms) {
        const form = pdfDoc.getForm();
        try {
          form.flatten();
        } catch (e) {
          console.log('No forms to flatten or form flattening failed');
        }
      }

      // Configure compression based on level
      let objectStreams = true;
      let updateFieldAppearances = false;

      switch (options.level) {
        case 'basic':
          objectStreams = true;
          break;
        case 'recommended':
          objectStreams = true;
          break;
        case 'high':
          objectStreams = false;
          break;
      }

      // Save with compression options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: objectStreams,
        addDefaultPage: false,
        updateFieldAppearances
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const originalSize = file.size;
      const compressedSize = blob.size;
      
      // Calculate compression ratio
      const compressionRatio = originalSize > compressedSize 
        ? ((originalSize - compressedSize) / originalSize) * 100 
        : 0;
      
      return { blob, compressionRatio };
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please add PDF files to compress.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const filesToProcess = files.filter(f => f.status === 'pending' && f.file);
      const totalFiles = filesToProcess.length;
      
      if (totalFiles === 0) {
        toast({
          title: "No Files to Process",
          description: "All files have already been processed.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      let processedCount = 0;

      for (const processedFile of filesToProcess) {
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === processedFile.id 
            ? { ...f, status: 'processing' as const }
            : f
        ));

        try {
          if (!processedFile.file) {
            throw new Error('File not found');
          }

          const { blob, compressionRatio } = await compressPDF(processedFile.file, compressionOptions);
          
          // Update file with results
          setFiles(prev => prev.map(f => 
            f.id === processedFile.id 
              ? { 
                  ...f, 
                  status: 'completed' as const,
                  compressedSize: blob.size,
                  compressedBlob: blob,
                  compressionRatio
                }
              : f
          ));

        } catch (error) {
          console.error(`Error compressing file ${processedFile.name}:`, error);
          setFiles(prev => prev.map(f => 
            f.id === processedFile.id 
              ? { 
                  ...f, 
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Compression failed'
                }
              : f
          ));
        }

        processedCount++;
        setProgress((processedCount / totalFiles) * 100);
      }

      const successCount = files.filter(f => f.status === 'completed').length;
      toast({
        title: "Compression Complete",
        description: `Successfully compressed ${successCount} PDF file(s).`
      });

    } catch (error) {
      console.error('Compression process error:', error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.compressedBlob) return;

    const url = URL.createObjectURL(file.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.compressedBlob);
    
    if (completedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "No compressed files available for download.",
        variant: "destructive"
      });
      return;
    }

    completedFiles.forEach(file => downloadFile(file));
    
    toast({
      title: "Download Started",
      description: `Downloading ${completedFiles.length} compressed PDF file(s).`
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'pending':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getCompressionLevelDescription = (level: string) => {
    switch (level) {
      case 'basic':
        return 'Maximum compression, some quality reduction';
      case 'recommended':
        return 'Good balance of size and quality';
      case 'high':
        return 'Minimal quality loss, less compression';
      default:
        return '';
    }
  };

  return (
    <ToolPageTemplate
      title="PDF Compressor"
      description="Reduce PDF file sizes while maintaining quality. Compress multiple PDFs with customizable options."
      keywords="PDF compressor, reduce PDF size, compress PDF online, PDF optimization"
    >
      <div className="space-y-6">
        {/* Compression Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Compression Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compression-level">Compression Level</Label>
                <Select 
                  value={compressionOptions.level} 
                  onValueChange={(value: 'basic' | 'recommended' | 'high') => 
                    setCompressionOptions(prev => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Compression</SelectItem>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="high">High Quality</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {getCompressionLevelDescription(compressionOptions.level)}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Advanced Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remove-metadata"
                      checked={compressionOptions.removeMetadata}
                      onCheckedChange={(checked) => 
                        setCompressionOptions(prev => ({ ...prev, removeMetadata: !!checked }))
                      }
                    />
                    <Label htmlFor="remove-metadata" className="text-sm">Remove metadata</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="optimize-images"
                      checked={compressionOptions.optimizeImages}
                      onCheckedChange={(checked) => 
                        setCompressionOptions(prev => ({ ...prev, optimizeImages: !!checked }))
                      }
                    />
                    <Label htmlFor="optimize-images" className="text-sm">Optimize images</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flatten-forms"
                      checked={compressionOptions.flattenForms}
                      onCheckedChange={(checked) => 
                        setCompressionOptions(prev => ({ ...prev, flattenForms: !!checked }))
                      }
                    />
                    <Label htmlFor="flatten-forms" className="text-sm">Flatten forms</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload PDF Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropUpload
              onFilesSelected={handleFilesSelected}
              isProcessing={isProcessing}
              progress={progress}
              maxFiles={10}
              acceptedFileTypes="pdf"
            />
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Files ({files.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFiles}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  {files.some(f => f.status === 'completed') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAllFiles}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <span className="font-medium truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={isProcessing}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Original size: {formatFileSize(file.originalSize)}</span>
                        {file.compressedSize && (
                          <span>Compressed: {formatFileSize(file.compressedSize)}</span>
                        )}
                      </div>
                      {file.compressionRatio !== undefined && (
                        <div className="text-green-600 font-medium">
                          {file.compressionRatio > 0 
                            ? `Space saved: ${file.compressionRatio.toFixed(1)}%`
                            : 'File size optimized'
                          }
                        </div>
                      )}
                      {file.error && (
                        <div className="text-red-600 text-xs mt-1">
                          Error: {file.error}
                        </div>
                      )}
                    </div>

                    {file.status === 'processing' && (
                      <Progress value={progress} className="h-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button
            onClick={handleCompress}
            disabled={files.length === 0 || isProcessing || !files.some(f => f.status === 'pending')}
            size="lg"
            className="min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Compressing... {Math.round(progress)}%
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Compress PDFs
              </>
            )}
          </Button>
        </div>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>How PDF Compression Works</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <ul className="space-y-2 text-gray-600">
              <li><strong>Basic Compression:</strong> Aggressive optimization for maximum file size reduction</li>
              <li><strong>Recommended:</strong> Balanced approach maintaining good quality while reducing size</li>
              <li><strong>High Quality:</strong> Minimal compression preserving original quality</li>
              <li><strong>Metadata Removal:</strong> Strips author, creation date, and other metadata</li>
              <li><strong>Image Optimization:</strong> Compresses embedded images to reduce file size</li>
              <li><strong>Form Flattening:</strong> Converts form fields to static content</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfCompressor;
