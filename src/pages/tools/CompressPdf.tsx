
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileText, Upload, Download, Settings, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { PDFDocument } from 'pdf-lib';

const CompressPdf = () => {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [compressedPdf, setCompressedPdf] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState([70]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePdfUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "Error",
        description: "File size too large. Please select a file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedPdf(file);
    setOriginalSize(file.size);
    setCompressedPdf(null);
    setCompressedSize(0);
    
    toast({
      title: "File loaded",
      description: `${file.name} (${formatFileSize(file.size)}) ready for compression`,
    });
  }, []);

  const compressPdf = useCallback(async () => {
    if (!selectedPdf) return;

    setIsProcessing(true);
    
    try {
      const arrayBuffer = await selectedPdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression by removing unused objects and optimizing
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectStreamsCompressionLevel: 9,
        updateFieldAppearances: false,
      });
      
      const compressedBlob = new Blob([compressedBytes], { 
        type: 'application/pdf' 
      });
      
      setCompressedPdf(compressedBlob);
      setCompressedSize(compressedBytes.length);
      
      const savedSpace = ((selectedPdf.size - compressedBytes.length) / selectedPdf.size) * 100;
      
      toast({
        title: "Success",
        description: `PDF compressed successfully! Saved ${Math.max(0, savedSpace).toFixed(1)}% space`,
      });
    } catch (error) {
      console.error('Error compressing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try with a different file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPdf]);

  const downloadCompressed = useCallback(() => {
    if (!compressedPdf || !selectedPdf) return;
    
    const url = URL.createObjectURL(compressedPdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${selectedPdf.name}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Compressed PDF downloaded successfully!",
    });
  }, [compressedPdf, selectedPdf]);

  const resetTool = () => {
    setSelectedPdf(null);
    setCompressedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <SEO
        title="PDF Compressor - Reduce PDF File Size Online Free | ToolifyConvert"
        description="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy-to-use PDF compression tool."
        keywords="PDF compressor, reduce PDF size, compress PDF online, PDF file size reducer, PDF optimization"
        canonicalUrl="https://toolifyconvert.com/tools/compress-pdf"
      />
      
      <ToolPageTemplate
        title="PDF Compressor"
        description="Reduce PDF file size while maintaining quality with our advanced compression tool"
      >
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload PDF File
            </h3>
            
            {!selectedPdf ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Choose PDF file to compress
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Maximum file size: 100MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="mr-2 h-5 w-5" /> 
                  Select PDF File
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-10 w-10 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-800">{selectedPdf.name}</p>
                      <p className="text-sm text-gray-600">
                        Original size: {formatFileSize(originalSize)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={resetTool}
                    size="sm"
                  >
                    Change File
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Compress Button */}
          {selectedPdf && !isProcessing && !compressedPdf && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <Button 
                onClick={compressPdf} 
                className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                <FileText className="mr-2 h-5 w-5" /> 
                Compress PDF
              </Button>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Compressing PDF...</h3>
                <p className="text-gray-600">Please wait while we optimize your PDF file</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {compressedPdf && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
                <Download className="h-5 w-5" />
                Compression Complete
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-gray-700">Original Size</p>
                    <p className="text-lg font-bold text-blue-600">{formatFileSize(originalSize)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-gray-700">Compressed Size</p>
                    <p className="text-lg font-bold text-green-600">{formatFileSize(compressedSize)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-gray-700">Space Saved</p>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.max(0, ((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={downloadCompressed} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-5 w-5" /> 
                    Download Compressed PDF
                  </Button>
                  <Button 
                    onClick={resetTool} 
                    variant="outline"
                    className="px-6"
                  >
                    Compress Another
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How it works</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our PDF compressor uses advanced optimization techniques to reduce file size while preserving document quality and structure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium mb-1">✓ Features:</h5>
                    <ul className="space-y-1">
                      <li>• Advanced compression algorithms</li>
                      <li>• Document optimization</li>
                      <li>• Preserves document structure</li>
                      <li>• Fast processing</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">✓ Benefits:</h5>
                    <ul className="space-y-1">
                      <li>• Reduced file size</li>
                      <li>• Faster sharing</li>
                      <li>• Storage savings</li>
                      <li>• 100% free to use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default CompressPdf;
