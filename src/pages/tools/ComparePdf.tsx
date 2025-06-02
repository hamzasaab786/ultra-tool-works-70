
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Compare, Download, Upload, FileText } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const ComparePdf = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();

  const handleFile1Select = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile1(selectedFile);
        toast({
          title: "First PDF uploaded",
          description: `${selectedFile.name} ready for comparison`,
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

  const handleFile2Select = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile2(selectedFile);
        toast({
          title: "Second PDF uploaded",
          description: `${selectedFile.name} ready for comparison`,
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

  const comparePdfs = async () => {
    if (!file1 || !file2) {
      toast({
        title: "Missing files",
        description: "Please select both PDF files to compare",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);
    try {
      toast({
        title: "Comparing PDFs",
        description: "PDF comparison requires backend processing with content analysis.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF comparison will be available with backend integration",
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: "Comparison failed",
        description: "There was an error comparing your PDFs",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Compare PDF"
      description="Compare two PDF documents side-by-side to identify differences, changes, and variations in content."
      keywords="compare pdf, pdf diff, document comparison, pdf changes, version comparison"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile1Select}
              className="hidden"
              id="pdf1-upload"
            />
            <label htmlFor="pdf1-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-blue-50 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {file1 ? file1.name : "Original PDF"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Select first PDF
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile2Select}
              className="hidden"
              id="pdf2-upload"
            />
            <label htmlFor="pdf2-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-green-50 rounded-full">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {file2 ? file2.name : "Modified PDF"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Select second PDF
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </label>
          </div>
        </div>

        {(file1 || file2) && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {file1 && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Original:</span>
                  <span className="text-gray-600">{file1.name}</span>
                  <span className="text-gray-500">({(file1.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
              {file2 && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Modified:</span>
                  <span className="text-gray-600">{file2.name}</span>
                  <span className="text-gray-500">({(file2.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={comparePdfs}
          disabled={isComparing || !file1 || !file2}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isComparing ? (
            "Comparing PDFs..."
          ) : (
            <>
              <Compare className="h-4 w-4 mr-2" />
              Compare PDFs
            </>
          )}
        </Button>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-900 mb-2">Comparison Features:</h3>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Side-by-side visual comparison</li>
            <li>• Highlight text differences</li>
            <li>• Image and layout changes</li>
            <li>• Detailed difference report</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ComparePdf;
