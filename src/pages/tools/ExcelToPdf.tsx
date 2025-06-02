
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const ExcelToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for conversion`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel spreadsheet (.xlsx or .xls)",
          variant: "destructive",
        });
      }
    }
  };

  const convertToPdf = async () => {
    if (!file) return;

    setIsConverting(true);
    try {
      toast({
        title: "Conversion in progress",
        description: "Excel to PDF conversion requires backend processing. This is a demo implementation.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "Excel to PDF conversion will be available with backend integration",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your spreadsheet",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Excel to PDF Converter"
      description="Convert Microsoft Excel spreadsheets (.xlsx, .xls) to PDF format with preserved formatting and data layout."
      keywords="excel to pdf, xlsx to pdf, xls to pdf, spreadsheet converter"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-50 rounded-full">
                <FileText className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose Excel spreadsheet"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports .xlsx and .xls files
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
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={convertToPdf}
                disabled={isConverting}
                className="bg-green-600 hover:bg-green-700"
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
        )}

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Features:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Preserves cell formatting and formulas</li>
            <li>• Maintains charts and graphs</li>
            <li>• Handles multiple worksheets</li>
            <li>• Professional PDF layout</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ExcelToPdf;
