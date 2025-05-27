
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PassportPhotoMaker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState("passport");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoSizes = {
    passport: { width: 35, height: 45, name: "Passport (35x45mm)" },
    visa: { width: 51, height: 51, name: "Visa (51x51mm)" },
    id: { width: 25, height: 32, name: "ID Card (25x32mm)" },
    license: { width: 24, height: 32, name: "License (24x32mm)" }
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

  const processPhoto = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const size = photoSizes[photoSize as keyof typeof photoSizes];
        const aspectRatio = size.width / size.height;
        
        canvas.width = 300;
        canvas.height = 300 / aspectRatio;
        
        if (ctx) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const imgAspectRatio = img.width / img.height;
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspectRatio > aspectRatio) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspectRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspectRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          setProcessedImage(canvas.toDataURL());
        }
      };
      
      img.src = selectedImage;
      
      toast({
        title: "Success",
        description: "Passport photo created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, photoSize, backgroundColor]);

  const downloadPhoto = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `passport-photo-${photoSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, photoSize]);

  return (
    <ToolPageTemplate
      title="Passport Photo Maker"
      description="Create professional passport photos with custom sizes and backgrounds"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload Photo</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a clear photo of yourself
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Photo Size</Label>
                <Select value={photoSize} onValueChange={setPhotoSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(photoSizes).map(([key, size]) => (
                      <SelectItem key={key} value={key}>{size.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={processPhoto} 
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
                  <Camera className="mr-2 h-4 w-4" /> Create Passport Photo
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
                  alt="Passport photo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <p className="text-gray-500">Processed photo will appear here</p>
              )}
            </div>
            
            {processedImage && (
              <Button onClick={downloadPhoto} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PassportPhotoMaker;
