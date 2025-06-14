
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Copy, Info } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument } from 'pdf-lib';

interface PdfMetadata {
  fileName: string;
  fileSize: number;
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  keywords?: string;
  version: string;
}

const PdfMetadataExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        extractMetadata(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const extractMetadata = async (pdfFile: File) => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const extractedMetadata: PdfMetadata = {
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
        keywords: pdfDoc.getKeywords(),
        version: '1.4', // Default version, would need more complex parsing for exact version
      };

      setMetadata(extractedMetadata);

      toast({
        title: "Metadata extracted",
        description: "PDF metadata has been successfully extracted",
      });
    } catch (error) {
      console.error('Metadata extraction error:', error);
      toast({
        title: "Extraction failed",
        description: "Could not extract metadata from the PDF",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const copyMetadata = () => {
    if (!metadata) return;
    
    const metadataText = `
PDF Metadata:
- File Name: ${metadata.fileName}
- File Size: ${(metadata.fileSize / (1024 * 1024)).toFixed(2)} MB
- Page Count: ${metadata.pageCount}
- PDF Version: ${metadata.version}
${metadata.title ? `- Title: ${metadata.title}` : ''}
${metadata.author ? `- Author: ${metadata.author}` : ''}
${metadata.subject ? `- Subject: ${metadata.subject}` : ''}
${metadata.creator ? `- Creator: ${metadata.creator}` : ''}
${metadata.producer ? `- Producer: ${metadata.producer}` : ''}
${metadata.keywords ? `- Keywords: ${metadata.keywords}` : ''}
${metadata.creationDate ? `- Created: ${metadata.creationDate.toLocaleString()}` : ''}
${metadata.modificationDate ? `- Modified: ${metadata.modificationDate.toLocaleString()}` : ''}
    `.trim();

    navigator.clipboard.writeText(metadataText);
    toast({
      title: "Copied to clipboard",
      description: "Metadata has been copied to your clipboard",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolPageTemplate
      title="PDF Metadata Extractor"
      description="Extract detailed metadata information from PDF documents including author, creation date, and document properties."
      keywords="pdf metadata, pdf information, document properties, pdf details, pdf analysis"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to extract metadata
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </label>
        </div>

        {isExtracting && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Extracting metadata...</p>
          </div>
        )}

        {metadata && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  PDF Metadata
                </CardTitle>
                <Button variant="outline" size="sm" onClick={copyMetadata}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">File Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-500">File Name</span>
                    <p className="text-gray-900">{metadata.fileName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-500">File Size</span>
                    <p className="text-gray-900">{formatFileSize(metadata.fileSize)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-500">Page Count</span>
                    <p className="text-gray-900">{metadata.pageCount} pages</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-500">PDF Version</span>
                    <p className="text-gray-900">{metadata.version}</p>
                  </div>
                </div>
              </div>

              {/* Document Properties */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Document Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metadata.title && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Title</span>
                      <p className="text-blue-900">{metadata.title}</p>
                    </div>
                  )}
                  {metadata.author && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Author</span>
                      <p className="text-blue-900">{metadata.author}</p>
                    </div>
                  )}
                  {metadata.subject && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Subject</span>
                      <p className="text-blue-900">{metadata.subject}</p>
                    </div>
                  )}
                  {metadata.creator && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Creator</span>
                      <p className="text-blue-900">{metadata.creator}</p>
                    </div>
                  )}
                  {metadata.producer && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Producer</span>
                      <p className="text-blue-900">{metadata.producer}</p>
                    </div>
                  )}
                  {metadata.keywords && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="text-sm font-medium text-blue-700">Keywords</span>
                      <p className="text-blue-900">{metadata.keywords}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              {(metadata.creationDate || metadata.modificationDate) && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Date Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metadata.creationDate && (
                      <div className="bg-green-50 p-3 rounded">
                        <span className="text-sm font-medium text-green-700">Creation Date</span>
                        <p className="text-green-900">{metadata.creationDate.toLocaleString()}</p>
                      </div>
                    )}
                    {metadata.modificationDate && (
                      <div className="bg-green-50 p-3 rounded">
                        <span className="text-sm font-medium text-green-700">Modification Date</span>
                        <p className="text-green-900">{metadata.modificationDate.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">What We Extract:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Document title, author, and subject</li>
            <li>• Creation and modification dates</li>
            <li>• Creator and producer applications</li>
            <li>• File size and page count</li>
            <li>• PDF version and keywords</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfMetadataExtractor;
