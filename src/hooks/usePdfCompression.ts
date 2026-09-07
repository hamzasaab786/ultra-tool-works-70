
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PDFCompressor, PDFAnalyzer, CompressionSettings } from '@/utils/pdfCompression';
import { isPdfFile } from '@/utils/fileUtils';
import { ProcessedFile, CompressionSummary } from '@/types/pdfCompressor';


export const usePdfCompression = () => {
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

  const getCurrentSettings = (): CompressionSettings => {
    const strength = customCompressionStrength;
    const quality = Math.max(5, 100 - strength);

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

  const handleFilesSelected = useCallback(async (fileList: FileList) => {
    const pdfFiles = Array.from(fileList).filter(isPdfFile);
    
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

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const downloadFile = (file: ProcessedFile) => {
    if (!file.result?.blob) return;
    triggerDownload(file.result.blob, `compressed_${file.name}`);
  };

  const downloadAllFiles = async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result?.blob);
    
    if (completedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "No compressed files available for download.",
        variant: "destructive"
      });
      return;
    }

    for (let i = 0; i < completedFiles.length; i++) {
      downloadFile(completedFiles[i]);
      if (i < completedFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }


    
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

  const getTotalSavings = (): CompressionSummary | null => {
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

  return {
    files,
    isProcessing,
    progress,
    customCompressionStrength,
    setCustomCompressionStrength,
    handleFilesSelected,
    handleCompress,
    downloadFile,
    downloadAllFiles,
    removeFile,
    clearAllFiles,
    getTotalSavings,
    formatFileSize
  };
};
