
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageIcon, Upload, Download, Scissors, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

const BackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
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

  const removeBackgroundAI = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      // Convert data URL to blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      // Load image element
      const imageElement = await loadImage(blob);
      
      // Remove background using API or basic method
      const resultBlob = await removeBackground(imageElement, apiKey || undefined);
      
      // Convert blob to data URL for display
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      
      toast({
        title: "Success",
        description: apiKey ? "Background removed successfully using API!" : "Background removed using basic algorithm!",
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again with a different image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, apiKey]);

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
      description="Remove backgrounds from images instantly with AI technology or basic algorithms"
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• For best results, enter your Remove.bg API key below</li>
            <li>• Without API key, basic background removal algorithm will be used</li>
            <li>• Upload a clear image with good contrast between subject and background</li>
            <li>• Works best with portraits and objects with distinct edges</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Remove.bg API key for better results"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast({ title: "Copied", description: "API key copied to clipboard" });
                }}
                disabled={!apiKey}
              >
                <Key className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your free API key from <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Remove.bg</a>
            </p>
          </div>
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
              onClick={removeBackgroundAI} 
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
