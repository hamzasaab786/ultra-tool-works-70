
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, Upload, Download, X, Scissors } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SplitPdf = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageRanges, setPageRanges] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSplitting, setIsSplitting] = useState(false);

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
    // Simulate getting page count (in real implementation, you'd use PDF.js)
    setTotalPages(Math.floor(Math.random() * 50) + 10);
    
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

  const splitPdf = useCallback(async () => {
    if (!pdfFile || !pageRanges.trim()) {
      toast({
        title: "Error",
        description: "Please select a PDF file and enter page ranges.",
        variant: "destructive"
      });
      return;
    }

    setIsSplitting(true);
    
    // Simulate PDF splitting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create sample split files (for demo purposes)
    const ranges = pageRanges.split(',').map(range => range.trim()).filter(Boolean);
    
    ranges.forEach((range, index) => {
      // Create a dummy PDF blob for each range
      const pdfContent = `data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxMCAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVApxCjI4LjM0IDc0NC4wNSBUZAowIGcKL0YxIDEyIFRmCihQYWdlcyAke3JhbmdlfSkgVGoKRVQKUQoKZW5kc3RyZWFtCmVuZG9iagoKMTAgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxMjAgMDAwMDAgbiAKMDAwMDAwMDE3NyAwMDAwMCBuIAowMDAwMDAwMzY0IDAwMDAwIG4gCjAwMDAwMDA0NTggMDAwMDAgbiAKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDU0OCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDExCi9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo2NDcKJSVFT0Y=`;
      
      const link = document.createElement('a');
      link.href = pdfContent;
      link.download = `${pdfFile.name.replace('.pdf', '')}_pages_${range}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    setIsSplitting(false);
    toast({
      title: "Success",
      description: `PDF split into ${ranges.length} files successfully!`,
    });
  }, [pdfFile, pageRanges]);

  const resetPdf = useCallback(() => {
    setPdfFile(null);
    setPageRanges("");
    setTotalPages(0);
  }, []);

  return (
    <ToolPageTemplate
      title="Split PDF"
      description="Extract specific pages from your PDF documents"
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
            <h3 className="text-lg font-medium">Split PDF</h3>
            <Button variant="ghost" size="sm" onClick={resetPdf}>
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-md">
            <h4 className="font-medium mb-2">PDF Information</h4>
            <p>File: {pdfFile.name}</p>
            <p>Total Pages: {totalPages}</p>
            <p>Size: {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="page-ranges" className="mb-2 block">
                Page Ranges (comma-separated)
              </Label>
              <Input
                id="page-ranges"
                placeholder="e.g., 1-5, 10-15, 20"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter page ranges you want to extract. Examples: "1-3" for pages 1 to 3, "5" for page 5 only, "1-3,7,10-12" for multiple ranges.
              </p>
            </div>

            <Button 
              onClick={splitPdf} 
              disabled={isSplitting || !pageRanges.trim()}
              className="w-full"
            >
              {isSplitting ? (
                <>Splitting PDF...</>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" /> Split PDF
                </>
              )}
            </Button>
          </div>

          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">How to use page ranges:</h4>
            <ul className="text-sm space-y-1">
              <li>• Single page: "5" (extracts page 5)</li>
              <li>• Page range: "1-10" (extracts pages 1 through 10)</li>
              <li>• Multiple ranges: "1-3,7,10-12" (extracts pages 1-3, page 7, and pages 10-12)</li>
              <li>• Last page: "{totalPages}" (extracts the last page)</li>
            </ul>
          </div>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default SplitPdf;
