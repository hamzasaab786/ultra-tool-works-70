import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
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
  Info,
  Eye,
  BarChart3
} from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';
import DragDropUpload from '@/components/DragDropUpload';
import { PDFCompressor, PDFAnalyzer, CompressionResult, CompressionSettings } from '@/utils/pdfCompression';

interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  status: 'pending' | 'analyzing' | 'processing' | 'completed' | 'error';
  error?: string;
  file?: File;
  analysis?: {
    pageCount: number;
    hasImages: boolean;
    hasForms: boolean;
    hasMetadata: boolean;
    estimatedCompression: number;
  };
  result?: CompressionResult;
}

const PdfCompressor = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customCompressionStrength, setCustomCompressionStrength] = useState(50);
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

  const handleFilesSelected = useCallback(async (fileList: FileList) => {
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

    // Analyze files automatically
    for (const newFile of newFiles) {
      if (newFile.file) {
        analyzeFile(newFile.id, newFile.file);
      }
    }

    toast({
      title: "Files Added",
      description: `${pdfFiles.length} PDF file(s) ready for compression.`
    });
  }, [toast]);

  const analyzeFile = async (fileId: string, file: File) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'analyzing' as const } : f
    ));

    try {
      const analysis = await PDFAnalyzer.analyzePDF(file);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'pending' as const, analysis }
          : f
      ));
    } catch (error) {
      console.error('Analysis failed:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'error' as const,
              error: 'Analysis failed'
            }
          : f
      ));
    }
  };

  const getCurrentSettings = (): CompressionSettings => {
    const strength = customCompressionStrength;
    const quality = Math.max(5, 100 - strength); // Ensure quality is at least 5

    let level: 'low' | 'medium' | 'high' | 'maximum' = 'low';
    if (strength > 80) level = 'maximum';
    else if (strength > 50) level = 'high';
    else if (strength > 20) level = 'medium';
    
    return {
      level,
      removeMetadata: strength > 20,
      optimizeImages: true,
      flattenForms: strength > 50,
      removeUnusedObjects: true,
      imageQuality: quality,
      downscaleImages: strength > 20,
      maxImageDimension: strength > 80 ? 800 : (strength > 50 ? 1280 : 1920),
    };
  };

  const handleCompress = async () => {
    const filesToProcess = files.filter(f => f.status === 'pending' && f.file);
    
    if (filesToProcess.length === 0) {
      toast({
        title: "No Files to Process",
        description: "Please add PDF files or check if all files have been processed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const settings = getCurrentSettings();
      const compressor = new PDFCompressor(settings);
      const totalFiles = filesToProcess.length;
      let processedCount = 0;

      for (const processedFile of filesToProcess) {
        setFiles(prev => prev.map(f => 
          f.id === processedFile.id 
            ? { ...f, status: 'processing' as const }
            : f
        ));

        try {
          if (!processedFile.file) {
            throw new Error('File not found');
          }

          const result = await compressor.compressPDF(processedFile.file);
          
          setFiles(prev => prev.map(f => 
            f.id === processedFile.id 
              ? { 
                  ...f, 
                  status: 'completed' as const,
                  result
                }
              : f
          ));

        } catch (error) {
          console.error(`Error compressing ${processedFile.name}:`, error);
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
    if (!file.result?.blob) return;

    const url = URL.createObjectURL(file.result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result?.blob);
    
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
      case 'analyzing':
        return <Eye className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTotalSavings = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result);
    if (completedFiles.length === 0) return null;

    const totalOriginal = completedFiles.reduce((sum, f) => sum + f.originalSize, 0);
    const totalCompressed = completedFiles.reduce((sum, f) => sum + (f.result?.compressedSize || 0), 0);
    const totalSaved = totalOriginal - totalCompressed;
    const avgCompression = (totalSaved / totalOriginal) * 100;

    return {
      totalOriginal,
      totalCompressed,
      totalSaved,
      avgCompression
    };
  };

  const savings = getTotalSavings();

  return (
    <ToolPageTemplate
      title="Professional PDF Compressor"
      description="Advanced PDF compression with intelligent optimization. Reduce file sizes while maintaining quality with industry-leading algorithms."
      keywords="PDF compressor, reduce PDF size, compress PDF online, PDF optimization, professional PDF tools"
    >
      <div className="space-y-6">
        {/* Compression Statistics */}
        {savings && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatFileSize(savings.totalSaved)}
                  </div>
                  <div className="text-sm text-green-600">Space Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {savings.avgCompression.toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600">Avg Compression</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatFileSize(savings.totalOriginal)}
                  </div>
                  <div className="text-sm text-green-600">Original Size</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatFileSize(savings.totalCompressed)}
                  </div>
                  <div className="text-sm text-green-600">Compressed Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compression Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Compression Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="compression-strength">
                Compression Strength: {customCompressionStrength}%
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="compression-strength"
                  value={[customCompressionStrength]}
                  onValueChange={([value]) => setCustomCompressionStrength(value)}
                  min={0}
                  max={95}
                  step={1}
                  className="w-full"
                />
                <Badge variant="outline">{customCompressionStrength}%</Badge>
              </div>
              <p className="text-xs text-gray-500">
                Higher strength means smaller file size but lower quality.
              </p>
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
              maxFiles={20}
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
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(file.status)}
                        <div>
                          <span className="font-medium">{file.name}</span>
                          {file.analysis && (
                            <div className="text-sm text-gray-500">
                              {file.analysis.pageCount} pages • {formatFileSize(file.originalSize)}
                              {file.analysis.estimatedCompression > 0 && (
                                <> • Est. {file.analysis.estimatedCompression}% reduction</>
                              )}
                            </div>
                          )}
                        </div>
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

                    {/* Analysis Results */}
                    {file.analysis && (
                      <div className="flex gap-2 flex-wrap">
                        {file.analysis.hasForms && (
                          <Badge variant="secondary">Has Forms</Badge>
                        )}
                        {file.analysis.hasMetadata && (
                          <Badge variant="secondary">Has Metadata</Badge>
                        )}
                        {file.analysis.hasImages && (
                          <Badge variant="secondary">Has Images</Badge>
                        )}
                      </div>
                    )}

                    {/* Compression Results */}
                    {file.result && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-green-700">
                              {file.result.compressionRatio.toFixed(1)}%
                            </div>
                            <div className="text-green-600">Compressed</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-700">
                              {formatFileSize(file.result.originalSize - file.result.compressedSize)}
                            </div>
                            <div className="text-green-600">Space Saved</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-700">
                              {formatFileSize(file.result.compressedSize)}
                            </div>
                            <div className="text-green-600">New Size</div>
                          </div>
                          <div>
                            <div className="font-medium text-green-700">
                              {file.result.optimizations.length}
                            </div>
                            <div className="text-green-600">Optimizations</div>
                          </div>
                        </div>
                        {file.result.optimizations.length > 0 && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {file.result.optimizations.map((opt, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {opt}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {file.error && (
                      <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                        Error: {file.error}
                      </div>
                    )}

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
        <div className="flex justify-center gap-4">
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
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Professional PDF Compression
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Compression Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Intelligent compression algorithms</li>
                  <li>• Advanced image optimization</li>
                  <li>• Form flattening for size reduction</li>
                  <li>• Metadata removal and cleanup</li>
                  <li>• Unused object elimination</li>
                  <li>• Batch processing support</li>
                  <li>• Real-time compression analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Compression Control</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>Low (0-20%):</strong> Minimal compression, preserves quality</li>
                  <li>• <strong>Medium (20-50%):</strong> Balanced compression and quality</li>
                  <li>• <strong>High (50-80%):</strong> Strong compression, good for web</li>
                  <li>• <strong>Maximum (80-95%):</strong> Aggressive compression for storage</li>
                  <li>• <strong>Custom:</strong> Full control over compression strength</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfCompressor;
