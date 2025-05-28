
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Download, Scissors } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

const BackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeBackgroundHandler = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      const imageElement = await loadImage(blob);
      const resultBlob = await removeBackground(imageElement);
      
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      
      toast({
        title: "Success",
        description: "Background removed successfully!",
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage]);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Image downloaded successfully!",
    });
  }, [processedImage]);

  return (
    <ToolPageTemplate
      title="AI Background Remover"
      description="Remove backgrounds from images instantly with AI technology"
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload a clear image with good contrast between subject and background</li>
            <li>• Works best with portraits and objects with distinct edges</li>
            <li>• Supports JPG, PNG and other common image formats</li>
            <li>• Download the result as a PNG with transparent background</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Click to upload or drag and drop your image
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Select Image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img src={selectedImage} alt="Selected" className="w-full h-64 object-cover rounded" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={removeBackgroundHandler} 
              disabled={!selectedImage || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" /> Remove Background
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Result</Label>
            <div className="border rounded-lg min-h-[300px] flex items-center justify-center bg-gray-50">
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Background removed" 
                  className="w-full h-64 object-contain"
                />
              ) : (
                <p className="text-gray-500">Processed image will appear here</p>
              )}
            </div>
            
            {processedImage && (
              <Button onClick={downloadImage} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default BackgroundRemover;
