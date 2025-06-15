
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import ToolPageTemplate from "./ToolPageTemplate";

const PdfPasswordProtector = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [protectedPdfUrl, setProtectedPdfUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setFile(file);
      setProtectedPdfUrl("");
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const protectPdf = async () => {
    if (!file || !password) {
      toast({
        title: "Missing information",
        description: "Please select a PDF file and enter a password",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password + "_owner",
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false
        }
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setProtectedPdfUrl(url);
      toast({
        title: "Success",
        description: "PDF has been password protected successfully!",
      });
    } catch (error) {
      console.error('Error protecting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to protect PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProtectedPdf = () => {
    if (protectedPdfUrl && file) {
      const link = document.createElement('a');
      link.href = protectedPdfUrl;
      link.download = `protected_${file.name}`;
      link.click();
    }
  };

  return (
    <ToolPageTemplate
      title="PDF Password Protector"
      description="Add password protection to your PDF files for enhanced security"
      keywords="PDF password, protect PDF, secure PDF, encrypt PDF, PDF security"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Protect PDF with Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {file ? (
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">PDF file selected</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">Drop your PDF file here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Choose a strong password to protect your PDF
              </p>
            </div>

            <Button 
              onClick={protectPdf} 
              disabled={!file || !password || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Protecting PDF..." : "Protect PDF"}
            </Button>

            {protectedPdfUrl && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">PDF Protected Successfully!</p>
                    <p className="text-sm text-green-600">Your PDF is now password protected</p>
                  </div>
                  <Button onClick={downloadProtectedPdf} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Strong encryption to protect your documents</li>
              <li>• Prevents unauthorized copying and editing</li>
              <li>• Your files are processed locally and never stored</li>
              <li>• High-resolution printing allowed for authorized users</li>
              <li>• Compatible with all PDF viewers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfPasswordProtector;
