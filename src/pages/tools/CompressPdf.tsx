
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import PdfUploadSection from "@/components/pdf/PdfUploadSection";
import PdfCompressionButton from "@/components/pdf/PdfCompressionButton";
import PdfProcessingState from "@/components/pdf/PdfProcessingState";
import PdfResultsSection from "@/components/pdf/PdfResultsSection";
import PdfInfoSection from "@/components/pdf/PdfInfoSection";
import { compressPdfFile } from "@/utils/pdfCompression";
import { validatePdfFile, formatFileSize } from "@/utils/fileUtils";

const CompressPdf = () => {
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [compressedPdf, setCompressedPdf] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = useCallback((file: File) => {
    const validation = validatePdfFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
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
      const compressedBlob = await compressPdfFile(selectedPdf);
      
      setCompressedPdf(compressedBlob);
      setCompressedSize(compressedBlob.size);
      
      const savedSpace = ((selectedPdf.size - compressedBlob.size) / selectedPdf.size) * 100;
      
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
          <PdfUploadSection
            selectedPdf={selectedPdf}
            originalSize={originalSize}
            onFileSelect={handlePdfUpload}
            onReset={resetTool}
            fileInputRef={fileInputRef}
          />

          {selectedPdf && !isProcessing && !compressedPdf && (
            <PdfCompressionButton
              onCompress={compressPdf}
              isProcessing={isProcessing}
            />
          )}

          {isProcessing && <PdfProcessingState />}

          {compressedPdf && selectedPdf && (
            <PdfResultsSection
              originalSize={originalSize}
              compressedSize={compressedSize}
              selectedPdf={selectedPdf}
              onDownload={downloadCompressed}
              onReset={resetTool}
            />
          )}

          <PdfInfoSection />
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default CompressPdf;
