
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, Download, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

interface ProcessedImage {
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  name: string;
}

const ImageCompressor = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [progress, setProgress] = useState(0);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const calculateSavings = (original: number, compressed: number) => {
    const difference = original - compressed;
    const percentage = Math.round((difference / original) * 100);
    return `${formatBytes(difference)} (${percentage}%)`;
  };
  
  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Selected file is not a valid image.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image exceeds 100MB limit.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    const originalUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setProgress(30);
      const img = new Image();
      
      img.onload = () => {
        setProgress(50);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast({
            title: "Error",
            description: "Could not initialize canvas context.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        setProgress(80);
        
        // Convert to JPEG with quality setting for proper compression
        canvas.toBlob((blob) => {
          if (blob) {
            setProgress(100);
            const compressedUrl = URL.createObjectURL(blob);
            
            // Generate proper filename with .jpg extension
            const originalName = file.name.split('.').slice(0, -1).join('.');
            const compressedName = originalName ? `${originalName}_compressed.jpg` : 'compressed_image.jpg';
            
            setProcessedImage({
              originalSize: file.size,
              compressedSize: blob.size,
              originalUrl,
              compressedUrl,
              name: compressedName
            });
            
            setTimeout(() => {
              setIsProcessing(false);
              toast({
                title: "Success",
                description: "Image compressed successfully!",
              });
            }, 500);
          }
        }, 'image/jpeg', quality / 100); // Use JPEG format for proper compression
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  }, [quality]);
  
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
  
  const downloadCompressedImage = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage.compressedUrl;
    link.download = processedImage.name;
    
    // Ensure the download happens properly
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Compressed image downloaded successfully!",
    });
  }, [processedImage]);
  
  const resetCompressedImage = useCallback(() => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage.originalUrl);
      URL.revokeObjectURL(processedImage.compressedUrl);
      setProcessedImage(null);
    }
  }, [processedImage]);
  
  return (
    <>
      <SEO
        title="Image Compressor - Reduce Image File Size Online Free | ToolifyConvert"
        description="Compress images online for free. Reduce image file size while maintaining quality. Support for JPG, PNG, WebP formats."
        keywords="image compressor, reduce image size, compress image online, image optimization"
        canonicalUrl="https://toolifyconvert.com/tools/image-compressor"
      />
      
      <ToolPageTemplate
        title="Image Compressor"
        description="Reduce image file size with minimal quality loss"
      >
        {!processedImage ? (
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
              <h3 className="text-lg font-medium">Image Compression Results</h3>
              <Button variant="ghost" size="sm" onClick={resetCompressedImage}>
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Original Image</h4>
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={processedImage.originalUrl} 
                    alt="Original" 
                    className="absolute w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm">Size: {formatBytes(processedImage.originalSize)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Compressed Image (JPG)</h4>
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={processedImage.compressedUrl} 
                    alt="Compressed" 
                    className="absolute w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm">Size: {formatBytes(processedImage.compressedSize)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-md">
              <h4 className="font-medium mb-2">Compression Results</h4>
              <p>Original size: {formatBytes(processedImage.originalSize)}</p>
              <p>Compressed size: {formatBytes(processedImage.compressedSize)}</p>
              <p>Size reduction: {calculateSavings(processedImage.originalSize, processedImage.compressedSize)}</p>
            </div>
            
            <Button className="w-full" onClick={downloadCompressedImage}>
              <Download className="mr-2 h-4 w-4" /> Download Compressed JPG
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing image...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {!isProcessing && !processedImage && (
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="quality" className="mb-2 block">
                Compression Quality: {quality}%
              </Label>
              <Input
                id="quality"
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Lower quality, smaller file</span>
                <span>Higher quality, larger file</span>
              </div>
            </div>
          </div>
        )}
      </ToolPageTemplate>
    </>
  );
};

export default ImageCompressor;
