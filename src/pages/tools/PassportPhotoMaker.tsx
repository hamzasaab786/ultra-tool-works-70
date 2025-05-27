
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PassportPhotoMaker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState("passport");
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
        
        // Set canvas to exact pixel dimensions for high quality
        canvas.width = size.pixels.width;
        canvas.height = size.pixels.height;
        
        if (ctx) {
          // Set white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculate image positioning for better face centering
          const aspectRatio = size.pixels.width / size.pixels.height;
          const imgAspectRatio = img.width / img.height;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          // Smart cropping for passport photos - focus on center-top area where face usually is
          if (imgAspectRatio > aspectRatio) {
            // Image is wider - crop sides, focus on center
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspectRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
          } else {
            // Image is taller - crop top/bottom, focus slightly on upper portion
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspectRatio;
            drawX = 0;
            // Position slightly higher to focus on face area
            drawY = (canvas.height - drawHeight) * 0.3; // 30% from top instead of center
          }
          
          // Apply some image enhancement
          ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          
          // Reset filter
          ctx.filter = 'none';
          
          setProcessedImage(canvas.toDataURL('image/jpeg', 0.95)); // High quality JPEG
        }
      };
      
      img.src = selectedImage;
      
      toast({
        title: "Success",
        description: "Professional passport photo created successfully!",
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
  }, [selectedImage, photoSize]);

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
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Photo Guidelines:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a clear, recent photo with good lighting</li>
            <li>• Face should be clearly visible and centered</li>
            <li>• Neutral expression with both eyes open</li>
            <li>• Plain background recommended</li>
            <li>• No hats, sunglasses, or heavy shadows</li>
          </ul>
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
                  <Camera className="mr-2 h-4 w-4" /> Create Professional Photo
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
