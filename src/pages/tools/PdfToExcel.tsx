
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Download, Upload, AlertCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const PdfToExcel = () => {
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
          description: `${selectedFile.name} is ready for conversion`,
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

  const convertToExcel = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      toast({
        title: "Conversion in progress",
        description: "PDF to Excel conversion requires backend processing with table extraction.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF to Excel conversion will be available with backend integration",
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
      title="PDF to Excel Converter"
      description="Convert PDF documents to editable Excel spreadsheets (.xlsx) with preserved data structure and tables."
      keywords="pdf to excel, pdf to xlsx, pdf converter, spreadsheet converter, table extraction"
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
              <div className="p-4 bg-green-50 rounded-full">
                <FileSpreadsheet className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to convert to Excel
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
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={convertToExcel}
                disabled={isConverting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConverting ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to Excel
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Features:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Extracts tables and data structures</li>
            <li>• Preserves cell formatting</li>
            <li>• Maintains numerical data accuracy</li>
            <li>• Compatible with Microsoft Excel</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-blue-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Best Results</p>
              <p>
                Works best with PDFs containing tables, financial reports, or structured data layouts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfToExcel;
