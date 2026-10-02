
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Download, X, RotateCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
  sepia: boolean;
  rotation: number;
}

const ImageEnhancer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<ImageSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: false,
    sepia: false,
    rotation: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image exceeds 100MB limit.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  }, [processImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  }, [processImage]);

  const applyFilters = useCallback(() => {
    if (!originalImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.save();
    
    // Apply rotation
    if (settings.rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((settings.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Apply filters
    let filter = '';
    filter += `brightness(${settings.brightness}%) `;
    filter += `contrast(${settings.contrast}%) `;
    filter += `saturate(${settings.saturation}%) `;
    filter += `blur(${settings.blur}px) `;
    if (settings.grayscale) filter += 'grayscale(100%) ';
    if (settings.sepia) filter += 'sepia(100%) ';

    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }, [originalImage, settings]);

  React.useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [originalImage, settings, applyFilters]);

  const downloadImage = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `enhanced_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }, [fileName]);

  const resetImage = useCallback(() => {
    setOriginalImage(null);
    setFileName("");
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: false,
      sepia: false,
      rotation: 0
    });
  }, []);

  return (
    <ToolPageTemplate
      title="Image Enhancer"
      description="Adjust brightness, contrast, saturation and apply filters to your images"
    >
      {!originalImage ? (
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or WEBP (MAX. 100MB)
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <Label htmlFor="file-upload" className="mt-4">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Select Image
              </span>
            </Button>
          </Label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Enhance Your Image</h3>
            <Button variant="ghost" size="sm" onClick={resetImage}>
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Original Image</h4>
              <div className="border rounded-md overflow-hidden">
                <img 
                  ref={imageRef}
                  src={originalImage} 
                  alt="Original image before enhancement" 
                  className="w-full h-auto max-h-64 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Enhanced Image</h4>
              <div className="border rounded-md overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-auto max-h-64 object-contain"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Brightness: {settings.brightness}%</Label>
                <Slider
                  value={[settings.brightness]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, brightness: value }))}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block">Contrast: {settings.contrast}%</Label>
                <Slider
                  value={[settings.contrast]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, contrast: value }))}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block">Saturation: {settings.saturation}%</Label>
                <Slider
                  value={[settings.saturation]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, saturation: value }))}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Blur: {settings.blur}px</Label>
                <Slider
                  value={[settings.blur]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, blur: value }))}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label className="block">Filters</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.grayscale ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, grayscale: !prev.grayscale }))}
                  >
                    Grayscale
                  </Button>
                  <Button
                    variant={settings.sepia ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, sepia: !prev.sepia }))}
                  >
                    Sepia
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Rotation: {settings.rotation}°</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[settings.rotation]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, rotation: value }))}
                    min={0}
                    max={360}
                    step={90}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={downloadImage}>
            <Download className="mr-2 h-4 w-4" /> Download Enhanced Image
          </Button>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageEnhancer;
