
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PhotoSettings {
  width: number;
  height: number;
  dpi: number;
  background: string;
}

const PassportPhotoMaker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('us-passport');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoSizes: Record<string, PhotoSettings> = {
    'us-passport': { width: 600, height: 600, dpi: 300, background: '#ffffff' },
    'uk-passport': { width: 450, height: 600, dpi: 300, background: '#f0f0f0' },
    'eu-passport': { width: 450, height: 600, dpi: 300, background: '#ffffff' },
    'india-passport': { width: 450, height: 600, dpi: 300, background: '#ffffff' },
    'visa-photo': { width: 600, height: 600, dpi: 300, background: '#ffffff' },
    'id-photo': { width: 400, height: 600, dpi: 300, background: '#ffffff' }
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

  const processPhoto = useCallback(() => {
    if (!selectedImage || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const settings = photoSizes[selectedSize];
    canvas.width = settings.width;
    canvas.height = settings.height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw image
    const img = new Image();
    img.onload = () => {
      ctx.save();
      
      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      
      // Calculate centered position
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width * 0.8;
      let drawHeight = drawWidth / aspectRatio;
      
      if (drawHeight > canvas.height * 0.8) {
        drawHeight = canvas.height * 0.8;
        drawWidth = drawHeight * aspectRatio;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
          setIsProcessing(false);
          toast({
            title: "Success",
            description: "Passport photo created successfully!",
          });
        }
      }, 'image/png');
    };
    img.src = selectedImage;
  }, [selectedImage, selectedSize, backgroundColor, scale, rotation]);

  const downloadPhoto = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `passport-photo-${selectedSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, selectedSize]);

  return (
    <ToolPageTemplate
      title="Passport Size Photo Maker"
      description="Create perfect passport size photos with custom dimensions and backgrounds - Professional photo editing tool for visa, passport, and ID photos. Free online passport photo maker with instant download."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            📸 Create professional passport photos that meet official requirements for various countries. Upload your photo and we'll resize it to the perfect dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload and Controls */}
          <div className="space-y-4">
            <div>
              <Label>Upload Photo</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Click to upload or drag and drop your photo
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
                  <img src={selectedImage} alt="Selected" className="w-full h-48 object-cover rounded" />
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
              <Label>Photo Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-passport">US Passport (2×2 inches)</SelectItem>
                  <SelectItem value="uk-passport">UK Passport (45×35mm)</SelectItem>
                  <SelectItem value="eu-passport">EU Passport (45×35mm)</SelectItem>
                  <SelectItem value="india-passport">India Passport (51×51mm)</SelectItem>
                  <SelectItem value="visa-photo">Visa Photo (2×2 inches)</SelectItem>
                  <SelectItem value="id-photo">ID Photo (35×45mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Background Color</Label>
              <div className="flex space-x-2 mt-2">
                <button
                  className="w-8 h-8 rounded border-2 border-gray-300 bg-white"
                  onClick={() => setBackgroundColor('#ffffff')}
                />
                <button
                  className="w-8 h-8 rounded border-2 border-gray-300 bg-blue-100"
                  onClick={() => setBackgroundColor('#e6f2ff')}
                />
                <button
                  className="w-8 h-8 rounded border-2 border-gray-300 bg-gray-100"
                  onClick={() => setBackgroundColor('#f5f5f5')}
                />
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-8 p-0 border-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scale: {scale.toFixed(1)}x</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setScale(Math.max(0.5, scale - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setScale(Math.min(3, scale + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Rotation: {rotation}°</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setRotation((rotation - 90) % 360)}>
                    <RotateCw className="h-4 w-4 transform rotate-180" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRotation((rotation + 90) % 360)}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={processPhoto} 
              disabled={!selectedImage || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Create Passport Photo'}
            </Button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-gray-50">
              {processedImage ? (
                <div className="text-center">
                  <img 
                    src={processedImage} 
                    alt="Processed passport photo" 
                    className="max-w-full max-h-80 mx-auto border rounded"
                  />
                  <Button 
                    onClick={downloadPhoto}
                    className="mt-4"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Photo
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Your passport photo will appear here</p>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PassportPhotoMaker;
