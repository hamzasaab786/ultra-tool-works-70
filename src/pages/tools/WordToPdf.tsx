
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Upload, AlertCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const WordToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          selectedFile.type === 'application/msword') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for conversion`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a Word document (.docx or .doc)",
          variant: "destructive",
        });
      }
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsConverting(false);
  };

  const convertToPdf = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      toast({
        title: "Conversion in progress",
        description: "Word to PDF conversion requires backend processing. This is a demo implementation.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "Word to PDF conversion will be available with backend integration",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your document",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Word to PDF Converter"
      description="Convert Microsoft Word documents (.docx, .doc) to PDF format with professional quality and formatting preservation."
      keywords="word to pdf, docx to pdf, doc to pdf, document converter, microsoft word"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            onChange={handleFileSelect}
            className="hidden"
            id="word-upload"
          />
          <label htmlFor="word-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-indigo-50 rounded-full">
                <FileText className="h-12 w-12 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose Word document"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports .docx and .doc files
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={resetTool}
                  disabled={isConverting}
                >
                  Change File
                </Button>
                <Button
                  onClick={convertToPdf}
                  disabled={isConverting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isConverting ? (
                    "Converting..."
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Convert to PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Preserves original formatting and layout</li>
            <li>• Maintains fonts, images, and tables</li>
            <li>• High-quality PDF output</li>
            <li>• Secure processing - files not stored</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-green-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Privacy & Security</p>
              <p>
                All document processing happens securely. Your files are processed temporarily and automatically deleted after conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default WordToPdf;
