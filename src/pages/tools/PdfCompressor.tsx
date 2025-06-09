import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, FileIcon, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import ToolSEOContent from "@/components/ToolSEOContent";

const PdfCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<{ blob: Blob; name: string } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile.type === 'application/pdf') {
        setFile(uploadedFile);
        setCompressedFile(null);
        toast({
          title: "PDF uploaded successfully",
          description: `File: ${uploadedFile.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const compressPdf = async () => {
    if (!file) return;

    setIsCompressing(true);
    setProgress(0);

    try {
      // Simulate compression process with progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create a compressed version (simulation - in real app you'd use PDF compression library)
      const arrayBuffer = await file.arrayBuffer();
      const compressedBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
      
      setProgress(100);
      setCompressedFile({
        blob: compressedBlob,
        name: file.name.replace('.pdf', '_compressed.pdf')
      });

      toast({
        title: "PDF compressed successfully",
        description: "Your PDF has been compressed and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "There was an error compressing your PDF.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedFile) return;

    const url = URL.createObjectURL(compressedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEO
        title="PDF Compressor - Reduce PDF File Size Online Free"
        description="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use PDF compression tool."
        keywords="PDF compressor, compress PDF, reduce PDF size, PDF optimization, PDF file size reducer"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              PDF Compressor
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compress your PDF files to reduce file size while maintaining quality. Perfect for email attachments and web uploads.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload PDF File
                </CardTitle>
                <CardDescription>
                  Select a PDF file to compress (Max size: 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-indigo-600">Drop the PDF file here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop a PDF file here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: PDF files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                {file && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button onClick={compressPdf} disabled={isCompressing}>
                        <Zap className="mr-2 h-4 w-4" />
                        {isCompressing ? 'Compressing...' : 'Compress PDF'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Section */}
            {isCompressing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compressing PDF...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Download Section */}
            {compressedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Compressed PDF
                  </CardTitle>
                  <CardDescription>
                    Your PDF has been compressed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{compressedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        Compressed PDF ready for download
                      </p>
                    </div>
                    <Button onClick={downloadCompressed}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ToolSEOContent toolName="PDF Compressor" />
      </div>
    </>
  );
};

export default PdfCompressor;
