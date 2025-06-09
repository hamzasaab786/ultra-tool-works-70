
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
  const [processingMessage, setProcessingMessage] = useState<string>("Processing PDF...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = useCallback((file: File) => {
    const validation = validatePdfFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
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
      title: "File Ready",
      description: `${file.name} (${formatFileSize(file.size)}) loaded successfully`,
    });
  }, []);

  const compressPdf = useCallback(async () => {
    if (!selectedPdf) return;

    setIsProcessing(true);
    setProcessingMessage("Analyzing PDF structure...");
    
    try {
      // Simulate processing steps for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingMessage("Optimizing content...");
      
      const compressedBlob = await compressPdfFile(selectedPdf);
      
      setProcessingMessage("Finalizing compression...");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCompressedPdf(compressedBlob);
      setCompressedSize(compressedBlob.size);
      
      const savedSpace = ((selectedPdf.size - compressedBlob.size) / selectedPdf.size) * 100;
      
      toast({
        title: "Success!",
        description: `PDF compressed successfully! ${savedSpace > 0 ? `Saved ${savedSpace.toFixed(1)}% space` : 'File optimized'}`,
      });
    } catch (error) {
      console.error('Error compressing PDF:', error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "Failed to compress PDF. Please try with a different file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingMessage("Processing PDF...");
    }
  }, [selectedPdf]);

  const downloadCompressed = useCallback(() => {
    if (!compressedPdf || !selectedPdf) return;
    
    try {
      const url = URL.createObjectURL(compressedPdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${selectedPdf.name}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your compressed PDF is being downloaded",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the compressed file. Please try again.",
        variant: "destructive"
      });
    }
  }, [compressedPdf, selectedPdf]);

  const resetTool = useCallback(() => {
    setSelectedPdf(null);
    setCompressedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setIsProcessing(false);
    setProcessingMessage("Processing PDF...");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

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

          {isProcessing && (
            <PdfProcessingState message={processingMessage} />
          )}

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
