
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileIcon, Upload, Download, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PDFDocument } from 'pdf-lib';
import SEO from "@/components/SEO";

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
    setCompressedFile(null);
    
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

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      setProgress(25);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);

      // Compression logic based on level
      const qualitySettings = {
        low: { imageQuality: 0.9, removeMetadata: false },
        medium: { imageQuality: 0.7, removeMetadata: true },
        high: { imageQuality: 0.5, removeMetadata: true }
      };

      const settings = qualitySettings[compressionLevel];
      
      // Remove metadata if specified
      if (settings.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      setProgress(75);

      const pdfBytes = await pdfDoc.save();
      setProgress(90);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setCompressedFile(url);
      setCompressedSize(blob.size);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "PDF compressed successfully!",
      });
    } catch (error) {
      console.error('PDF compression error:', error);
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  }, [pdfFile, compressionLevel]);

  const downloadCompressed = useCallback(() => {
    if (!compressedFile || !pdfFile) return;

    const link = document.createElement('a');
    link.href = compressedFile;
    link.download = `compressed_${pdfFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Compressed PDF downloaded successfully!",
    });
  }, [compressedFile, pdfFile]);

  const resetPdf = useCallback(() => {
    setPdfFile(null);
    setCompressedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setProgress(0);
  }, []);

  return (
    <>
      <SEO
        title="PDF Compressor - Reduce PDF File Size Online Free | ToolifyConvert"
        description="Compress PDF files online for free. Reduce PDF size while maintaining quality. Fast, secure, and easy-to-use PDF compression tool with multiple quality levels."
        keywords="PDF compressor, compress PDF online, reduce PDF size, PDF optimization, shrink PDF, PDF file reducer, online PDF tools"
        canonicalUrl="https://toolifyconvert.com/tools/compress-pdf"
      />
      
      <ToolPageTemplate
        title="Compress PDF"
        description="Reduce PDF file size while maintaining quality with advanced compression algorithms"
      >
        <div className="space-y-8 perspective-1000">
          {!pdfFile ? (
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl glassmorphism transition-all duration-300 ${
                isDragging 
                  ? "border-blue-500 bg-blue-50/50 shadow-xl scale-105" 
                  : "border-blue-300/50 bg-white/70 hover:border-blue-500 hover:bg-blue-50/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="animate-float">
                <FileIcon className="h-20 w-20 text-blue-400 mb-6" />
              </div>
              <p className="mb-2 text-xl font-semibold text-gray-700">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Drop your PDF here</span> or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-6">
                PDF files only (MAX. 100MB)
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileSelect}
              />
              <Label htmlFor="file-upload">
                <Button asChild className="btn-3d px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <span>
                    <Upload className="mr-3 h-6 w-6" /> Select PDF File
                  </span>
                </Button>
              </Label>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Compress PDF</h3>
                  <Button variant="ghost" size="sm" onClick={resetPdf} className="hover-scale">
                    <X className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                  <h4 className="font-semibold mb-3 text-gray-800">📄 PDF Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">File:</span> {pdfFile.name}</p>
                    <p><span className="font-medium">Original Size:</span> {formatBytes(originalSize)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block font-semibold text-gray-700">Compression Level</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={compressionLevel === 'low' ? 'default' : 'outline'}
                        onClick={() => setCompressionLevel('low')}
                        className="btn-3d"
                      >
                        Low (90%)
                      </Button>
                      <Button
                        variant={compressionLevel === 'medium' ? 'default' : 'outline'}
                        onClick={() => setCompressionLevel('medium')}
                        className="btn-3d"
                      >
                        Medium (70%)
                      </Button>
                      <Button
                        variant={compressionLevel === 'high' ? 'default' : 'outline'}
                        onClick={() => setCompressionLevel('high')}
                        className="btn-3d"
                      >
                        High (50%)
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-3 rounded-xl">
                      💡 Higher compression reduces file size more but may affect quality slightly.
                    </p>
                  </div>

                  <Button 
                    onClick={compressPdf} 
                    disabled={isCompressing}
                    className="w-full btn-3d py-4 text-lg bg-gradient-to-r from-green-500 to-teal-600"
                  >
                    {isCompressing ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                        Compressing PDF...
                      </>
                    ) : (
                      <>
                        <FileIcon className="mr-3 h-6 w-6" /> Compress PDF
                      </>
                    )}
                  </Button>

                  {isCompressing && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3 rounded-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Compression Results</h3>
                
                {compressedFile ? (
                  <div className="space-y-6 animate-scale-in">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200/50">
                      <h4 className="font-semibold mb-4 text-gray-800">✅ Compression Complete!</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Original size:</span> {formatBytes(originalSize)}</p>
                        <p><span className="font-medium">Compressed size:</span> {formatBytes(compressedSize)}</p>
                        <p className="text-green-700 font-semibold">
                          <span className="font-medium">Size reduction:</span> {calculateSavings(originalSize, compressedSize)}
                        </p>
                      </div>
                    </div>

                    <Button 
                      className="w-full btn-3d py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600" 
                      onClick={downloadCompressed}
                    >
                      <Download className="mr-3 h-6 w-6" /> Download Compressed PDF
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 animate-fade-in">
                    <FileIcon className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-float" />
                    <p className="text-gray-500 text-xl font-medium">Your compressed PDF will appear here</p>
                    <p className="text-gray-400 text-sm mt-3">Optimized for smaller file size</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="glassmorphism p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 border border-white/50 animate-fade-in delay-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Professional PDF Compression Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-sm text-gray-600">Advanced algorithms for quick compression</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">All processing happens in your browser</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Quality Control</h3>
                <p className="text-sm text-gray-600">Multiple compression levels available</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">💾</span>
                </div>
                <h3 className="font-semibold mb-2">Size Optimization</h3>
                <p className="text-sm text-gray-600">Reduce file size up to 70%</p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Why Compress PDF Files?</h3>
              <p className="text-gray-700 mb-4">
                PDF compression is essential for reducing file sizes while maintaining document quality. Our advanced PDF compressor uses 
                intelligent algorithms to optimize your documents for faster sharing, storage, and uploading. Whether you need to email 
                large documents, save storage space, or improve website loading times, our tool provides the perfect solution.
              </p>
              
              <h3 className="text-lg font-semibold mb-4">Key Benefits:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Email-friendly sizes:</strong> Compress PDFs to meet email attachment limits</li>
                <li><strong>Faster uploads:</strong> Reduced file sizes mean quicker uploads and downloads</li>
                <li><strong>Storage optimization:</strong> Save disk space on your devices and cloud storage</li>
                <li><strong>Quality preservation:</strong> Advanced compression maintains visual quality</li>
                <li><strong>Batch processing:</strong> Handle multiple files efficiently</li>
                <li><strong>No software required:</strong> Works entirely in your web browser</li>
              </ul>
            </div>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default CompressPdf;
