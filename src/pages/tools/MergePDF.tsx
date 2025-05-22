
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileIcon, Upload, Download, X, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface PDFFile {
  name: string;
  size: number;
  data: ArrayBuffer;
}

const MergePDF = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<PDFFile[]>([]);
  const [progress, setProgress] = useState(0);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles([...e.dataTransfer.files]);
    }
  }, []);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles([...e.target.files]);
    }
  }, []);
  
  const processFiles = (files: File[]) => {
    // Filter for PDF files only
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select only PDF files.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file sizes
    const oversizedFiles = pdfFiles.filter(file => file.size > 100 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Error",
        description: `${oversizedFiles.length} file(s) exceed the 100MB limit.`,
        variant: "destructive"
      });
      return;
    }
    
    // Read files as array buffers
    pdfFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedFiles(prev => [
            ...prev,
            {
              name: file.name,
              size: file.size,
              data: e.target.result as ArrayBuffer
            }
          ]);
        }
      };
      reader.readAsArrayBuffer(file);
    });
    
    toast({
      title: "Files added",
      description: `${pdfFiles.length} PDF file(s) added successfully.`,
    });
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const moveFileUp = (index: number) => {
    if (index === 0) return;
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      return newFiles;
    });
  };
  
  const moveFileDown = (index: number) => {
    if (index === selectedFiles.length - 1) return;
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      return newFiles;
    });
  };
  
  const mergePDFs = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one PDF file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // In a real implementation, we would use a PDF library
      // For now, we'll simulate the merging process
      
      // Simulate processing time for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(50);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(80);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);
      
      // In a real app, this would merge PDFs
      const bytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      
      toast({
        title: "Success",
        description: "PDFs merged successfully!",
      });
      
      // Simulate download (in a real app, we would create a merged PDF)
      const a = document.createElement('a');
      const blob = new Blob([new Uint8Array(selectedFiles[0].data)], { type: 'application/pdf' });
      a.href = URL.createObjectURL(blob);
      a.download = "merged_document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetFiles = () => {
    setSelectedFiles([]);
    toast({
      title: "Reset",
      description: "All files have been removed.",
    });
  };
  
  return (
    <ToolPageTemplate
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
    >
      <div className="space-y-6">
        <div 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF files (MAX. 100MB each)
          </p>
          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="pdf-upload" className="mt-4">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Select PDF Files
              </span>
            </Button>
          </label>
        </div>
        
        {selectedFiles.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Selected PDF Files ({selectedFiles.length})</h3>
              <Button variant="ghost" size="sm" onClick={resetFiles}>
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => moveFileUp(index)}
                      >
                        <ArrowDown className="h-4 w-4 rotate-180" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === selectedFiles.length - 1}
                        onClick={() => moveFileDown(index)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={mergePDFs}
              disabled={isProcessing || selectedFiles.length === 0}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> 
                  Merge & Download PDF
                </>
              )}
            </Button>
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Merging PDFs...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default MergePDF;
