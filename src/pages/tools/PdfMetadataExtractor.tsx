
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Info } from "lucide-react";
import SEO from "@/components/SEO";

const PdfMetadataExtractor = () => {
  const [metadata, setMetadata] = useState<any>(null);
  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      const basicInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      };
      
      setMetadata(basicInfo);
      
      toast({
        title: "PDF uploaded",
        description: "Basic metadata extracted. Advanced PDF metadata extraction coming soon.",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <>
      <SEO
        title="PDF Metadata Extractor - Extract PDF Properties Online Free"
        description="Extract metadata and properties from PDF files online. View document information, creation date, author, and more."
        keywords="PDF metadata, PDF properties, document info, PDF extractor, file metadata"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              PDF Metadata Extractor
            </h1>
            <p className="text-lg text-gray-600">
              Extract metadata and properties from PDF documents
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5" />
                  Upload PDF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600">Drop the PDF here...</p>
                  ) : (
                    <p className="text-gray-600">
                      Drag & drop a PDF file here, or click to select
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {metadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    PDF Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>File Name:</span>
                      <span className="font-mono">{metadata.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{(metadata.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Type:</span>
                      <span>{metadata.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Modified:</span>
                      <span>{metadata.lastModified}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Advanced PDF metadata extraction coming soon...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfMetadataExtractor;
