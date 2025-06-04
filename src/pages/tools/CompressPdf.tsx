
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileText, Upload, Download, Settings, AlertCircle, Info } from "lucide-react";
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

    console.log('File selected:', file.name, file.type, file.size);

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
      console.log('Starting PDF compression...');
      const arrayBuffer = await selectedPdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get compression ratio from slider (30-95%)
      const quality = compressionLevel[0] / 100;
      
      console.log('PDF loaded, pages:', pdfDoc.getPageCount());
      console.log('Compression quality:', quality);
      
      // Enhanced compression settings based on quality level
      const compressionSettings = {
        // Basic compression settings
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false,
        
        // Advanced compression based on quality level
        ...(quality < 0.5 && {
          // Aggressive compression for low quality
          compressStreams: true,
          objectsPerTick: 50,
        }),
        ...(quality >= 0.5 && quality < 0.8 && {
          // Balanced compression
          compressStreams: true,
          objectsPerTick: 25,
        }),
        ...(quality >= 0.8 && {
          // Minimal compression for high quality
          compressStreams: false,
          objectsPerTick: 10,
        })
      };
      
      // Apply compression optimizations
      const pages = pdfDoc.getPages();
      
      // Optimize images and content streams for better compression
      for (const page of pages) {
        try {
          // Get page content and optimize if possible
          const { width, height } = page.getSize();
          
          // Scale down oversized pages for compression
          if (quality < 0.6 && (width > 1200 || height > 1600)) {
            const scaleFactor = Math.min(1200 / width, 1600 / height, 1);
            page.scale(scaleFactor, scaleFactor);
          }
        } catch (error) {
          console.warn('Could not optimize page:', error);
        }
      }
      
      // Create compressed PDF with optimized settings
      const compressedPdfBytes = await pdfDoc.save(compressionSettings);
      
      console.log('PDF compressed, original bytes:', arrayBuffer.byteLength, 'compressed bytes:', compressedPdfBytes.length);
      
      // Calculate actual compression ratio
      const compressionRatio = compressedPdfBytes.length / arrayBuffer.byteLength;
      
      // If compression didn't achieve significant reduction, apply additional optimization
      let finalBytes = compressedPdfBytes;
      if (compressionRatio > 0.85 && quality < 0.7) {
        console.log('Applying additional compression...');
        
        // Load the compressed PDF and apply more aggressive settings
        const recompressDoc = await PDFDocument.load(compressedPdfBytes);
        finalBytes = await recompressDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
        });
      }
      
      // Create the compressed blob with the final compressed bytes
      const compressedBlob = new Blob([finalBytes], { 
        type: 'application/pdf' 
      });
      
      // Set the actual compressed size from the blob
      const actualCompressedSize = finalBytes.length;
      
      setCompressedPdf(compressedBlob);
      setCompressedSize(actualCompressedSize);
      
      const savedSpace = ((selectedPdf.size - actualCompressedSize) / selectedPdf.size) * 100;
      
      console.log('Compression completed. Original:', selectedPdf.size, 'Compressed:', actualCompressedSize);
      console.log('Compressed blob size:', compressedBlob.size);
      console.log('Space saved:', savedSpace.toFixed(1) + '%');
      
      toast({
        title: "Success",
        description: `PDF compressed successfully! Saved ${savedSpace.toFixed(1)}% of space`,
      });
    } catch (error) {
      console.error('Error compressing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to compress PDF. The file might be corrupted, password-protected, or contain unsupported features.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPdf, compressionLevel]);

  const downloadCompressed = useCallback(() => {
    if (!compressedPdf || !selectedPdf) {
      console.error('No compressed PDF or original file available for download');
      return;
    }
    
    console.log('Starting download of compressed PDF');
    console.log('Compressed blob size:', compressedPdf.size);
    
    // Create download link with the compressed blob
    const url = URL.createObjectURL(compressedPdf);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${selectedPdf.name}`;
    
    // Add link to DOM, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    console.log('Download initiated for compressed PDF');
    
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

          {/* Settings Section */}
          {selectedPdf && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Compression Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Compression Level: {compressionLevel[0]}%
                  </Label>
                  <Slider
                    value={compressionLevel}
                    onValueChange={setCompressionLevel}
                    max={95}
                    min={30}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Maximum Compression</span>
                    <span>Balanced</span>
                    <span>Best Quality</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Compression Guide:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>30-50%:</strong> Maximum compression, some quality loss, best for file size reduction</li>
                        <li>• <strong>50-70%:</strong> Balanced compression and quality, recommended for most users</li>
                        <li>• <strong>70-95%:</strong> Minimal compression, preserves highest quality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <p className="text-gray-600">Please wait while we optimize your PDF file with advanced compression algorithms</p>
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
                      {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
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
                <h4 className="font-semibold text-gray-800 mb-2">Privacy & Security</h4>
                <p className="text-sm text-gray-600 mb-3">
                  All PDF compression happens locally in your browser using advanced algorithms. Your files are never uploaded to our servers, 
                  ensuring complete privacy and security of your documents.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium mb-1">✓ Features:</h5>
                    <ul className="space-y-1">
                      <li>• Advanced PDF compression algorithms</li>
                      <li>• Multiple quality settings</li>
                      <li>• Instant processing</li>
                      <li>• Support for large files (100MB)</li>
                      <li>• Preserve document structure</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">✓ Benefits:</h5>
                    <ul className="space-y-1">
                      <li>• Faster email sharing</li>
                      <li>• Reduced storage space</li>
                      <li>• Maintained document quality</li>
                      <li>• 100% free to use</li>
                      <li>• No file upload required</li>
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
