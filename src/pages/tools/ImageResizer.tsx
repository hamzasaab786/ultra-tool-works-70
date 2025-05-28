
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Download, X, Maximize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);
        setOriginalImage(e.target?.result as string);
        setFileName(file.name);
        setResizedImage(null);
        
        toast({
          title: "Success",
          description: "Image loaded successfully!",
        });
      };
      img.src = e.target?.result as string;
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

  const handleWidthChange = useCallback((value: number) => {
    setNewWidth(value);
    if (maintainAspectRatio && originalWidth > 0) {
      const aspectRatio = originalHeight / originalWidth;
      setNewHeight(Math.round(value * aspectRatio));
    }
  }, [maintainAspectRatio, originalWidth, originalHeight]);

  const handleHeightChange = useCallback((value: number) => {
    setNewHeight(value);
    if (maintainAspectRatio && originalHeight > 0) {
      const aspectRatio = originalWidth / originalHeight;
      setNewWidth(Math.round(value * aspectRatio));
    }
  }, [maintainAspectRatio, originalWidth, originalHeight]);

  const resizeImage = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    
    try {
      // Use requestAnimationFrame for smooth processing
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedDataUrl = canvas.toDataURL('image/png', 0.95);
        setResizedImage(resizedDataUrl);
        setIsProcessing(false);
        
        toast({
          title: "Success",
          description: "Image resized successfully with high quality!",
        });
      };
      img.src = originalImage;
    } catch (error) {
      console.error('Error resizing image:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to resize image. Please try again.",
        variant: "destructive"
      });
    }
  }, [originalImage, newWidth, newHeight]);

  const downloadResizedImage = useCallback(() => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized_${newWidth}x${newHeight}_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Resized image downloaded successfully!",
    });
  }, [resizedImage, fileName, newWidth, newHeight]);

  const resetImage = useCallback(() => {
    setOriginalImage(null);
    setResizedImage(null);
    setFileName("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setNewWidth(0);
    setNewHeight(0);
    setIsProcessing(false);
  }, []);

  // Quick resize presets
  const quickResize = useCallback((width: number, height: number) => {
    setNewWidth(width);
    setNewHeight(height);
  }, []);

  return (
    <ToolPageTemplate
      title="Image Resizer"
      description="Change dimensions of your images easily while maintaining professional quality"
      keywords="image resizer, resize image online, image dimensions, photo resizer"
    >
      <div className="space-y-8 perspective-1000">
        {!originalImage ? (
          <div
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${
              isDragging 
                ? "border-blue-500 bg-blue-50/50 scale-105" 
                : "border-blue-300/50 bg-gradient-to-br from-blue-50/30 to-purple-50/30 hover:border-blue-500/70 hover:bg-blue-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <ImageIcon className="h-24 w-24 text-blue-400 mx-auto mb-6 animate-bounce-gentle" />
            <p className="mb-4 text-xl font-semibold text-gray-700">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mb-6">
              PNG, JPG, WebP or GIF (MAX. 100MB)
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <Label htmlFor="file-upload">
              <Button asChild className="btn-3d px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <span>
                  <Upload className="mr-3 h-6 w-6" /> Select Image
                </span>
              </Button>
            </Label>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resize Your Image
              </h3>
              <Button variant="ghost" size="sm" onClick={resetImage} className="btn-3d">
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="glassmorphism p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 animate-fade-in">
              <h4 className="font-bold mb-4 text-gray-800 flex items-center">
                <Maximize2 className="mr-2 h-5 w-5" />
                Original Dimensions
              </h4>
              <p className="text-lg font-medium text-gray-700">
                Width: <span className="text-blue-600">{originalWidth}px</span>, 
                Height: <span className="text-purple-600">{originalHeight}px</span>
              </p>
            </div>

            {/* Quick Resize Presets */}
            <div className="glassmorphism p-6 rounded-2xl animate-fade-in delay-200">
              <h4 className="font-bold mb-4 text-gray-800">⚡ Quick Resize Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" size="sm" onClick={() => quickResize(1920, 1080)} className="btn-3d">
                  1920×1080 (HD)
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickResize(1280, 720)} className="btn-3d">
                  1280×720
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickResize(800, 600)} className="btn-3d">
                  800×600
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickResize(500, 500)} className="btn-3d">
                  500×500
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-300">
              <div className="space-y-4">
                <Label htmlFor="width" className="text-lg font-semibold text-gray-800">
                  New Width (px)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={newWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="text-lg p-4 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="height" className="text-lg font-semibold text-gray-800">
                  New Height (px)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={newHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="text-lg p-4 border-2 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 animate-fade-in delay-400">
              <input
                type="checkbox"
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="w-5 h-5 rounded border-2"
              />
              <Label htmlFor="aspect-ratio" className="text-lg font-medium cursor-pointer">
                🔗 Maintain aspect ratio
              </Label>
            </div>

            <Button 
              onClick={resizeImage} 
              disabled={isProcessing || newWidth <= 0 || newHeight <= 0}
              className="w-full btn-3d py-4 text-lg animate-fade-in delay-500 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Maximize2 className="mr-3 h-6 w-6" /> Resize Image
                </>
              )}
            </Button>

            {resizedImage && (
              <div className="space-y-6 animate-scale-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glassmorphism p-6 rounded-2xl bg-white/80">
                    <h4 className="font-bold mb-4 text-gray-800">📷 Original</h4>
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-auto max-h-64 object-contain border rounded-xl shadow-lg"
                    />
                    <p className="mt-3 text-center font-medium text-gray-600">
                      {originalWidth} × {originalHeight}px
                    </p>
                  </div>
                  
                  <div className="glassmorphism p-6 rounded-2xl bg-white/80">
                    <h4 className="font-bold mb-4 text-gray-800">✨ Resized</h4>
                    <img 
                      src={resizedImage} 
                      alt="Resized" 
                      className="w-full h-auto max-h-64 object-contain border rounded-xl shadow-lg"
                    />
                    <p className="mt-3 text-center font-medium text-gray-600">
                      {newWidth} × {newHeight}px
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full btn-3d py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                  onClick={downloadResizedImage}
                >
                  <Download className="mr-3 h-6 w-6" /> Download Resized Image
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default ImageResizer;
