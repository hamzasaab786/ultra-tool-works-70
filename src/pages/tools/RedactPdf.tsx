
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EyeOff, Download, Upload, AlertTriangle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const RedactPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isRedacting, setIsRedacting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for redaction`,
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

  const redactPdf = async () => {
    if (!file) return;

    setIsRedacting(true);
    try {
      toast({
        title: "Redaction in progress",
        description: "PDF redaction requires backend processing with content analysis.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF redaction will be available with backend integration",
      });
    } catch (error) {
      console.error('Redaction error:', error);
      toast({
        title: "Redaction failed",
        description: "There was an error redacting your PDF",
        variant: "destructive",
      });
    } finally {
      setIsRedacting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Redact PDF"
      description="Permanently remove sensitive information from PDF documents with secure black-out redaction."
      keywords="redact pdf, remove sensitive data, pdf privacy, document censoring, information removal"
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
              <div className="p-4 bg-gray-50 rounded-full">
                <EyeOff className="h-12 w-12 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to redact"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF containing sensitive information
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
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <EyeOff className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={redactPdf}
                disabled={isRedacting}
                className="bg-gray-600 hover:bg-gray-700"
              >
                {isRedacting ? (
                  "Redacting..."
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Redact PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-red-600">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Important Security Notice</p>
              <p>
                Redaction permanently removes information. This action cannot be undone. Always verify redacted areas before sharing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Redaction Features:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Permanent information removal</li>
            <li>• Search and redact text patterns</li>
            <li>• Manual selection tools</li>
            <li>• Metadata cleaning</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RedactPdf;
