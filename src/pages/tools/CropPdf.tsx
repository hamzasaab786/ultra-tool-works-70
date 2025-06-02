
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Crop, Download, Upload, Scissors } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const CropPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropSettings, setCropSettings] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for cropping`,
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

  const cropPdf = async () => {
    if (!file) return;

    setIsCropping(true);
    try {
      toast({
        title: "Cropping PDF",
        description: "PDF cropping requires backend processing with page manipulation.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF cropping will be available with backend integration",
      });
    } catch (error) {
      console.error('Cropping error:', error);
      toast({
        title: "Cropping failed",
        description: "There was an error cropping your PDF",
        variant: "destructive",
      });
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Crop PDF"
      description="Remove unwanted margins and areas from PDF pages by cropping to specific dimensions."
      keywords="crop pdf, trim pdf, remove margins, pdf page cropping, pdf editing"
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
              <div className="p-4 bg-teal-50 rounded-full">
                <Crop className="h-12 w-12 text-teal-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to crop"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to remove margins
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
                <Crop className="h-8 w-8 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Crop Settings (in points)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Margin
                  </label>
                  <Input
                    type="number"
                    value={cropSettings.top}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, top: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bottom Margin
                  </label>
                  <Input
                    type="number"
                    value={cropSettings.bottom}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, bottom: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Left Margin
                  </label>
                  <Input
                    type="number"
                    value={cropSettings.left}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, left: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Right Margin
                  </label>
                  <Input
                    type="number"
                    value={cropSettings.right}
                    onChange={(e) => setCropSettings(prev => ({ ...prev, right: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={cropPdf}
              disabled={isCropping}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              {isCropping ? (
                "Cropping PDF..."
              ) : (
                <>
                  <Scissors className="h-4 w-4 mr-2" />
                  Crop PDF
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-teal-50 p-4 rounded-lg">
          <h3 className="font-medium text-teal-900 mb-2">Cropping Features:</h3>
          <ul className="text-sm text-teal-800 space-y-1">
            <li>• Remove white margins and borders</li>
            <li>• Custom crop dimensions</li>
            <li>• Batch process multiple pages</li>
            <li>• Preserve document quality</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default CropPdf;
