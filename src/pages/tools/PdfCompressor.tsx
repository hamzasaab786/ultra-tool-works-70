import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ToolPageTemplate from "./ToolPageTemplate";
import PdfUploadSection from "@/components/pdf/PdfUploadSection";
import PdfCompressionButton from "@/components/pdf/PdfCompressionButton";
import PdfProcessingState from "@/components/pdf/PdfProcessingState";
import PdfResultsSection from "@/components/pdf/PdfResultsSection";
import PdfCompressionOptions, { CompressionLevel } from "@/components/pdf/PdfCompressionOptions";
import { validatePdfFile } from "@/utils/fileUtils";
import { compressPdfFile, getExpectedCompressionRatio } from "@/utils/pdfCompression";

const PdfCompressor = () => {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    const validation = validatePdfFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setSelectedPdf(file);
    setOriginalSize(file.size);
    setCompressedBlob(null);
    setCompressedSize(0);
    setProgress(0);
    
    toast({
      title: "PDF uploaded successfully",
      description: `${file.name} is ready for compression`,
    });
  };

  const handleCompress = async () => {
    if (!selectedPdf) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Perform actual compression with selected level
      const compressed = await compressPdfFile(selectedPdf, compressionLevel);
      
      setProgress(100);
      setCompressedBlob(compressed);
      setCompressedSize(compressed.size);
      
      const savingsPercent = Math.round(((originalSize - compressed.size) / originalSize) * 100);
      
      toast({
        title: "Compression complete!",
        description: `PDF compressed successfully using ${compressionLevel} compression. Size reduced by ${savingsPercent}%`,
      });
      
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression failed",
        description: error instanceof Error ? error.message : "Failed to compress PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !selectedPdf) return;
    
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${selectedPdf.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your compressed PDF is downloading",
    });
  };

  const handleReset = () => {
    setSelectedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedBlob(null);
    setProgress(0);
    setCompressionLevel("medium");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const expectedRatio = getExpectedCompressionRatio(compressionLevel);

  return (
    <ToolPageTemplate
      title="PDF Compressor"
      description="Compress PDF files to reduce their size while maintaining quality. Choose from multiple compression levels to balance file size and quality."
      keywords="PDF compressor, compress PDF, reduce PDF size, PDF optimization, PDF file size reducer"
    >
      <div className="space-y-6">
        <PdfUploadSection
          selectedPdf={selectedPdf}
          originalSize={originalSize}
          onFileSelect={handleFileSelect}
          onReset={handleReset}
          fileInputRef={fileInputRef}
        />

        {selectedPdf && !compressedBlob && !isProcessing && (
          <>
            <PdfCompressionOptions
              compressionLevel={compressionLevel}
              onCompressionLevelChange={setCompressionLevel}
            />
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-1">Expected Results</h4>
              <p className="text-sm text-amber-800">
                With {compressionLevel} compression, expect {expectedRatio.min}% - {expectedRatio.max}% file size reduction.
              </p>
            </div>

            <PdfCompressionButton
              onCompress={handleCompress}
              isProcessing={isProcessing}
            />
          </>
        )}

        {isProcessing && (
          <PdfProcessingState
            message={`Compressing PDF with ${compressionLevel} compression...`}
            progress={progress}
          />
        )}

        {compressedBlob && selectedPdf && (
          <PdfResultsSection
            originalSize={originalSize}
            compressedSize={compressedSize}
            selectedPdf={selectedPdf}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How PDF Compression Works</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Compression Features:</h4>
              <ul className="space-y-1">
                <li>• Remove unnecessary metadata</li>
                <li>• Optimize image quality</li>
                <li>• Compress embedded fonts</li>
                <li>• Remove duplicate resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benefits:</h4>
              <ul className="space-y-1">
                <li>• Faster file transfers</li>
                <li>• Reduced storage space</li>
                <li>• Email-friendly file sizes</li>
                <li>• Maintained visual quality</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-900">Privacy & Security</h4>
              <p className="text-sm text-green-800 mt-1">
                All compression is done locally in your browser. Your files never leave your device, ensuring complete privacy and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfCompressor;
