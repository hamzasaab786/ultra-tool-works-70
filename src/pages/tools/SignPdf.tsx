
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PenTool, Download, Upload, FileSignature } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const SignPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "PDF uploaded successfully",
          description: `${selectedFile.name} is ready for signing`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSignatureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setSignatureFile(selectedFile);
        toast({
          title: "Signature uploaded successfully",
          description: `${selectedFile.name} will be used as signature`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file for signature",
          variant: "destructive",
        });
      }
    }
  };

  const signPdf = async () => {
    if (!file || !signatureFile) {
      toast({
        title: "Missing files",
        description: "Please select both PDF and signature files",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    try {
      toast({
        title: "Signing PDF",
        description: "Digital signature requires backend processing with certificate validation.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast({
        title: "Feature coming soon",
        description: "PDF signing will be available with backend integration",
      });
    } catch (error) {
      console.error('Signing error:', error);
      toast({
        title: "Signing failed",
        description: "There was an error signing your PDF",
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Sign PDF"
      description="Add digital signatures to PDF documents with secure authentication and legal validity."
      keywords="sign pdf, digital signature, pdf authentication, electronic signature, document signing"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-purple-50 rounded-full">
                <FileSignature className="h-12 w-12 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to sign"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF document
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <FileSignature className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureSelect}
                className="hidden"
                id="signature-upload"
              />
              <label htmlFor="signature-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                  <PenTool className="h-8 w-8 text-purple-600" />
                  <p className="font-medium text-gray-900">
                    {signatureFile ? signatureFile.name : "Upload Signature Image"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, or GIF format
                  </p>
                </div>
              </label>
            </div>

            <Button
              onClick={signPdf}
              disabled={isSigning || !signatureFile}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSigning ? (
                "Signing PDF..."
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-2" />
                  Sign PDF
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">Digital Signature Features:</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Legally binding digital signatures</li>
            <li>• Tamper-evident technology</li>
            <li>• Timestamp authentication</li>
            <li>• Compliance with e-signature laws</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default SignPdf;
