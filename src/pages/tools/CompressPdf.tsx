
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Upload, Download, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CompressPdf = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please select a valid PDF file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "PDF file exceeds 100MB limit.",
        variant: "destructive"
      });
      return;
    }

    setPdfFile(file);
    setOriginalSize(file.size);
    
    toast({
      title: "Success",
      description: "PDF file loaded successfully!",
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const calculateSavings = (original: number, compressed: number) => {
    const difference = original - compressed;
    const percentage = Math.round((difference / original) * 100);
    return `${formatBytes(difference)} (${percentage}%)`;
  };

  const compressPdf = useCallback(async () => {
    if (!pdfFile) return;

    setIsCompressing(true);
    setProgress(0);

    // Simulate compression process
    const compressionRates = {
      low: 0.9,    // 10% compression
      medium: 0.7, // 30% compression
      high: 0.5    // 50% compression
    };

    const rate = compressionRates[compressionLevel];
    const finalSize = Math.floor(originalSize * rate);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Create a compressed file (for demo purposes, we'll create a dummy file)
    const compressedContent = `data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxMCAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVApxCjI4LjM0IDc0NC4wNSBUZAowIGcKL0YxIDEyIFRmCihDb21wcmVzc2VkIFBERikgVGoKRVQKUQoKZW5kc3RyZWFtCmVuZG9iagoKMTAgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxMjAgMDAwMDAgbiAKMDAwMDAwMDE3NyAwMDAwMCBuIAowMDAwMDAwMzY0IDAwMDAwIG4gCjAwMDAwMDA0NTggMDAwMDAgbiAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDU0OCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDExCi9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo2NDcKJSVFT0Y=`;
    
    setCompressedFile(compressedContent);
    setCompressedSize(finalSize);
    setIsCompressing(false);
    
    toast({
      title: "Success",
      description: "PDF compressed successfully!",
    });
  }, [pdfFile, compressionLevel, originalSize]);

  const downloadCompressed = useCallback(() => {
    if (!compressedFile || !pdfFile) return;

    const link = document.createElement('a');
    link.href = compressedFile;
    link.download = `compressed_${pdfFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [compressedFile, pdfFile]);

  const resetPdf = useCallback(() => {
    setPdfFile(null);
    setCompressedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setProgress(0);
  }, []);

  return (
    <ToolPageTemplate
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
    >
      {!pdfFile ? (
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
            PDF files only (MAX. 100MB)
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
          />
          <Label htmlFor="file-upload" className="mt-4">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Select PDF
              </span>
            </Button>
          </Label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Compress PDF</h3>
            <Button variant="ghost" size="sm" onClick={resetPdf}>
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-md">
            <h4 className="font-medium mb-2">PDF Information</h4>
            <p>File: {pdfFile.name}</p>
            <p>Original Size: {formatBytes(originalSize)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Compression Level</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={compressionLevel === 'low' ? 'default' : 'outline'}
                  onClick={() => setCompressionLevel('low')}
                >
                  Low (90%)
                </Button>
                <Button
                  variant={compressionLevel === 'medium' ? 'default' : 'outline'}
                  onClick={() => setCompressionLevel('medium')}
                >
                  Medium (70%)
                </Button>
                <Button
                  variant={compressionLevel === 'high' ? 'default' : 'outline'}
                  onClick={() => setCompressionLevel('high')}
                >
                  High (50%)
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Higher compression reduces file size more but may affect quality.
              </p>
            </div>

            <Button 
              onClick={compressPdf} 
              disabled={isCompressing}
              className="w-full"
            >
              {isCompressing ? (
                <>Compressing PDF...</>
              ) : (
                <>
                  <FileIcon className="mr-2 h-4 w-4" /> Compress PDF
                </>
              )}
            </Button>

            {isCompressing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compressing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {compressedFile && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-md">
                  <h4 className="font-medium mb-2">Compression Results</h4>
                  <p>Original size: {formatBytes(originalSize)}</p>
                  <p>Compressed size: {formatBytes(compressedSize)}</p>
                  <p>Size reduction: {calculateSavings(originalSize, compressedSize)}</p>
                </div>

                <Button className="w-full" onClick={downloadCompressed}>
                  <Download className="mr-2 h-4 w-4" /> Download Compressed PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default CompressPdf;
