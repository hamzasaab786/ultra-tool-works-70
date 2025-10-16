
import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eraser, Download, Upload, FileImage, Sparkles } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { supabase } from "@/integrations/supabase/client";

const RemoveWatermark = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cleanImage, setCleanImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setCleanImage(null);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const optimizeImage = useCallback(async (dataUrl: string) => {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = (e) => reject(e);
        i.src = dataUrl;
      });
      const maxDim = 1500;
      const { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      if (scale === 1) return dataUrl;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return dataUrl;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch {
      return dataUrl;
    }
  }, []);

  const removeWatermark = useCallback(async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      toast({
        title: "Processing",
        description: "AI is removing watermark... This may take a moment.",
      });

      const optimizedImage = await optimizeImage(selectedImage);

      const { data, error } = await supabase.functions.invoke('remove-watermark', {
        body: {
          imageBase64: optimizedImage
        }
      });

      if (error) {
        throw error;
      }

      if (data?.cleanImage) {
        setCleanImage(data.cleanImage);
        toast({
          title: "Success",
          description: "Watermark removed successfully!",
        });
      } else {
        throw new Error('No clean image received from AI');
      }

    } catch (error) {
      console.error('Error removing watermark:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove watermark. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, optimizeImage, toast]);

  const downloadImage = useCallback(() => {
    if (!cleanImage) return;
    
    const link = document.createElement('a');
    link.href = cleanImage;
    link.download = `clean_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Clean image downloaded successfully!",
    });
  }, [cleanImage, fileName, toast]);

  return (
    <ToolPageTemplate
      title="Remove Watermark from Image"
      description="Remove watermarks from images using AI-powered technology while preserving image quality."
      keywords="remove watermark, watermark remover, clean image, photo editor"
    >
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">AI-Powered Watermark Removal</h3>
          </div>
          <p className="text-sm text-red-700">
            Upload your image and our AI will automatically detect and remove watermarks, text overlays, and logos while preserving image quality!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                  <Eraser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Upload an image with watermark
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
                  <img src={selectedImage} alt="Selected" className="w-full h-64 object-contain rounded bg-muted" />
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
              onClick={removeWatermark} 
              disabled={!selectedImage || isProcessing}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Remove Watermark
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Clean Result</label>
            <div className="border rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50">
              {cleanImage ? (
                <div className="p-4">
                  <img 
                    src={cleanImage} 
                    alt="Clean image" 
                    className="max-w-full max-h-full object-contain border shadow-lg"
                    style={{ 
                      maxHeight: '350px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Eraser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Clean image will appear here</p>
                </div>
              )}
            </div>
            
            {cleanImage && (
              <Button onClick={downloadImage} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Clean Image
              </Button>
            )}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Features:</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• AI-powered watermark detection</li>
            <li>• Preserve original image quality</li>
            <li>• Support for various image formats</li>
            <li>• Fast processing with Gemini AI</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RemoveWatermark;
