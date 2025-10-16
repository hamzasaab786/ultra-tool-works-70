
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload, Download, Camera, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PassportPhotoMaker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState("passport");
  const [instructions, setInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoSizes = {
    passport: { width: 35, height: 45, name: "Passport (35x45mm)", pixels: { width: 413, height: 531 } },
    visa: { width: 51, height: 51, name: "Visa (51x51mm)", pixels: { width: 600, height: 600 } },
    id: { width: 25, height: 32, name: "ID Card (25x32mm)", pixels: { width: 295, height: 378 } },
    license: { width: 24, height: 32, name: "License (24x32mm)", pixels: { width: 283, height: 378 } },
    us_passport: { width: 50.8, height: 50.8, name: "US Passport (2x2 inches)", pixels: { width: 600, height: 600 } },
    india_passport: { width: 35, height: 45, name: "India Passport (35x45mm)", pixels: { width: 413, height: 531 } }
  };

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

  const processPhoto = useCallback(async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    if (!instructions.trim()) {
      toast({
        title: "Error",
        description: "Please describe what you want for your passport photo",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const size = photoSizes[photoSize as keyof typeof photoSizes];
      
      toast({
        title: "Processing",
        description: "AI is editing your photo... This may take a moment.",
      });

      const optimizedImage = await optimizeImage(selectedImage);

      const { data, error } = await supabase.functions.invoke('edit-passport-photo', {
        body: {
          imageBase64: optimizedImage,
          instructions: instructions,
          photoSize: size.name
        }
      });

      if (error) {
        throw error;
      }

      if (data?.editedImage) {
        setProcessedImage(data.editedImage);
        toast({
          title: "Success",
          description: "Your professional passport photo is ready!",
        });
      } else {
        throw new Error('No edited image received from AI');
      }

    } catch (error) {
      console.error('Error processing photo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, photoSize, instructions, optimizeImage]);

  const downloadPhoto = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    const size = photoSizes[photoSize as keyof typeof photoSizes];
    link.download = `passport-photo-${size.width}x${size.height}mm.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Professional passport photo downloaded successfully!",
    });
  }, [processedImage, photoSize]);

  return (
    <ToolPageTemplate
      title="Professional Passport Photo Maker"
      description="Create high-quality passport photos with precise dimensions and professional standards"
    >
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">AI-Powered Photo Editor</h3>
          </div>
          <p className="text-sm text-purple-700">
            Upload your photo and describe how you want it edited. Our AI will automatically create a professional passport photo with perfect lighting, background, and composition!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload Photo</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a clear, high-quality photo of yourself
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Select Photo
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
                    Change Photo
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

            <div>
              <Label>Photo Size & Standard</Label>
              <Select value={photoSize} onValueChange={setPhotoSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(photoSizes).map(([key, size]) => (
                    <SelectItem key={key} value={key}>
                      {size.name} - {size.pixels.width}x{size.pixels.height}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>What do you want? (Describe your requirements)</Label>
              <Textarea
                placeholder="Example: Make the background pure white, improve lighting, center my face, remove shadows, enhance colors, professional look for visa application..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Be specific! The AI will optimize your photo based on your description.
              </p>
            </div>

            <Button 
              onClick={processPhoto} 
              disabled={!selectedImage || !instructions.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  AI Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Create with AI
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Professional Result</Label>
            <div className="border rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50">
              {processedImage ? (
                <div className="p-4">
                  <img 
                    src={processedImage} 
                    alt="Professional passport photo" 
                    className="max-w-full max-h-full object-contain border shadow-lg"
                    style={{ 
                      maxHeight: '350px',
                      backgroundColor: 'white'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {photoSizes[photoSize as keyof typeof photoSizes].name}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Professional passport photo will appear here</p>
                </div>
              )}
            </div>
            
            {processedImage && (
              <Button onClick={downloadPhoto} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Professional Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PassportPhotoMaker;
