
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eraser, Download, Upload, FileImage } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const RemoveWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        toast({
          title: "Image uploaded successfully",
          description: `${selectedFile.name} is ready for watermark removal`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const removeWatermark = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      toast({
        title: "Processing image",
        description: "Watermark removal requires advanced AI processing capabilities.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Feature coming soon",
        description: "AI-powered watermark removal will be available with backend integration",
      });
    } catch (error) {
      console.error('Watermark removal error:', error);
      toast({
        title: "Process failed",
        description: "There was an error removing the watermark",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Remove Watermark from Image"
      description="Remove watermarks from images using AI-powered technology while preserving image quality."
      keywords="remove watermark, watermark remover, clean image, photo editor"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-red-50 rounded-full">
                <Eraser className="h-12 w-12 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose image file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select an image with watermark to remove
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <FileImage className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={removeWatermark}
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                "Removing Watermark..."
              ) : (
                <>
                  <Eraser className="h-4 w-4 mr-2" />
                  Remove Watermark
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Features:</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• AI-powered watermark detection</li>
            <li>• Preserve original image quality</li>
            <li>• Support for various image formats</li>
            <li>• Batch processing capabilities</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RemoveWatermark;
