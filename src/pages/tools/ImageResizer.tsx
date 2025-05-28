
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Download, X } from "lucide-react";
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

  const resizeImage = useCallback(() => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const resizedDataUrl = canvas.toDataURL('image/png');
      setResizedImage(resizedDataUrl);
      
      toast({
        title: "Success",
        description: "Image resized successfully!",
      });
    };
    img.src = originalImage;
  }, [originalImage, newWidth, newHeight]);

  const downloadResizedImage = useCallback(() => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [resizedImage, fileName]);

  const resetImage = useCallback(() => {
    setOriginalImage(null);
    setResizedImage(null);
    setFileName("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setNewWidth(0);
    setNewHeight(0);
  }, []);

  return (
    <ToolPageTemplate
      title="Image Resizer"
      description="Change dimensions of your images easily while maintaining quality"
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
            <h3 className="text-lg font-medium">Resize Your Image</h3>
            <Button variant="ghost" size="sm" onClick={resetImage}>
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-md">
            <h4 className="font-medium mb-2">Original Dimensions</h4>
            <p>Width: {originalWidth}px, Height: {originalHeight}px</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width" className="mb-2 block">
                New Width (px)
              </Label>
              <Input
                id="width"
                type="number"
                value={newWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="height" className="mb-2 block">
                New Height (px)
              </Label>
              <Input
                id="height"
                type="number"
                value={newHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
          </div>

          <Button onClick={resizeImage} className="w-full">
            Resize Image
          </Button>

          {resizedImage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Original</h4>
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full h-auto max-h-48 object-contain border rounded"
                  />
                  <p className="mt-2 text-sm">{originalWidth} × {originalHeight}px</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Resized</h4>
                  <img 
                    src={resizedImage} 
                    alt="Resized" 
                    className="w-full h-auto max-h-48 object-contain border rounded"
                  />
                  <p className="mt-2 text-sm">{newWidth} × {newHeight}px</p>
                </div>
              </div>

              <Button className="w-full" onClick={downloadResizedImage}>
                <Download className="mr-2 h-4 w-4" /> Download Resized Image
              </Button>
            </div>
          )}
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageResizer;
