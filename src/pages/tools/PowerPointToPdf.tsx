
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Presentation, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const PowerPointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
          selectedFile.type === 'application/vnd.ms-powerpoint') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for conversion`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PowerPoint presentation (.pptx or .ppt)",
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
        description: "PowerPoint to PDF conversion requires backend processing. This is a demo implementation.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "PowerPoint to PDF conversion will be available with backend integration",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your presentation",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PowerPoint to PDF Converter"
      description="Convert Microsoft PowerPoint presentations (.pptx, .ppt) to PDF format while preserving slide layouts and animations."
      keywords="powerpoint to pdf, pptx to pdf, ppt to pdf, presentation converter"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
            onChange={handleFileSelect}
            className="hidden"
            id="powerpoint-upload"
          />
          <label htmlFor="powerpoint-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-orange-50 rounded-full">
                <Presentation className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PowerPoint presentation"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports .pptx and .ppt files
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
                <Presentation className="h-8 w-8 text-orange-600" />
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
                className="bg-orange-600 hover:bg-orange-700"
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

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-900 mb-2">Features:</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Preserves slide layouts and formatting</li>
            <li>• Maintains charts, images, and graphics</li>
            <li>• Each slide becomes a PDF page</li>
            <li>• High-resolution output quality</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PowerPointToPdf;
