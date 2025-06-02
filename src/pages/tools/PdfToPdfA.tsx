
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Download, Upload, Shield } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const PdfToPdfA = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for PDF/A conversion`,
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

  const convertToPdfA = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      toast({
        title: "Conversion in progress",
        description: "Converting to PDF/A format for long-term archival compliance.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF/A conversion will be available with backend integration",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your PDF",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PDF to PDF/A Converter"
      description="Convert PDF documents to PDF/A format for long-term archival and compliance with international standards."
      keywords="pdf to pdf/a, archival pdf, iso standard, document preservation, compliance"
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
              <div className="p-4 bg-blue-50 rounded-full">
                <FileCheck className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to convert to PDF/A
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
                <FileCheck className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={convertToPdfA}
                disabled={isConverting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConverting ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to PDF/A
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">PDF/A Benefits:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ISO 19005 compliant format</li>
            <li>• Self-contained document (embedded fonts)</li>
            <li>• Long-term preservation guarantee</li>
            <li>• Legal and regulatory compliance</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Archival Standard</p>
              <p>
                PDF/A ensures your documents remain accessible and visually consistent for decades to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfToPdfA;
