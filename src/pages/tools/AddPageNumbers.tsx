
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Hash, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const AddPageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState("1");
  const [format, setFormat] = useState("number");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for page numbering`,
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

  const addPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      toast({
        title: "Adding page numbers",
        description: "Page numbering requires backend PDF processing capabilities.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "Page numbering will be available with backend integration",
      });
    } catch (error) {
      console.error('Page numbering error:', error);
      toast({
        title: "Process failed",
        description: "There was an error adding page numbers",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Add Page Numbers to PDF"
      description="Add professional page numbers to your PDF documents with customizable positioning and formatting options."
      keywords="add page numbers, pdf pagination, number pages, pdf page numbers"
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
                <Hash className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to add page numbers
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
                <Hash className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Number
                </label>
                <Input
                  type="number"
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">1, 2, 3...</SelectItem>
                    <SelectItem value="roman">i, ii, iii...</SelectItem>
                    <SelectItem value="roman-upper">I, II, III...</SelectItem>
                    <SelectItem value="page-of-total">Page 1 of 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={addPageNumbers}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                "Adding Page Numbers..."
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
                  Add Page Numbers
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Customizable position and format</li>
            <li>• Multiple numbering styles</li>
            <li>• Start from any number</li>
            <li>• Professional appearance</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AddPageNumbers;
