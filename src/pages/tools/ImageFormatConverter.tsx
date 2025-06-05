
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

interface ConvertedImage {
  originalSize: number;
  convertedSize: number;
  originalUrl: string;
  convertedUrl: string;
  originalFormat: string;
  targetFormat: string;
  name: string;
}

const ImageFormatConverter = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("jpeg");
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null);
  const [progress, setProgress] = useState(0);
  
  const supportedFormats = [
    { value: "jpeg", label: "JPG/JPEG", mimeType: "image/jpeg", extension: "jpg" },
    { value: "png", label: "PNG", mimeType: "image/png", extension: "png" },
    { value: "webp", label: "WebP", mimeType: "image/webp", extension: "webp" },
    { value: "bmp", label: "BMP", mimeType: "image/bmp", extension: "bmp" },
  ];
  
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
  
  const getImageFormat = (file: File): string => {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG';
    if (type.includes('png')) return 'PNG';
    if (type.includes('webp')) return 'WebP';
    if (type.includes('bmp')) return 'BMP';
    if (type.includes('gif')) return 'GIF';
    return 'Unknown';
  };
  
  const convertImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Selected file is not a valid image.",
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
    
    const originalFormat = getImageFormat(file);
    const targetFormatData = supportedFormats.find(f => f.value === targetFormat);
    
    if (!targetFormatData) {
      toast({
        title: "Error",
        description: "Invalid target format selected.",
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
        
        // Handle transparency for formats that don't support it
        if (targetFormat === 'jpeg' || targetFormat === 'bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        setProgress(80);
        
        let quality = 0.9;
        if (targetFormat === 'jpeg') quality = 0.9;
        if (targetFormat === 'webp') quality = 0.8;
        
        canvas.toBlob((blob) => {
          if (blob) {
            setProgress(100);
            const convertedUrl = URL.createObjectURL(blob);
            
            const originalName = file.name.split('.').slice(0, -1).join('.');
            const convertedName = originalName ? 
              `${originalName}.${targetFormatData.extension}` : 
              `converted_image.${targetFormatData.extension}`;
            
            setConvertedImage({
              originalSize: file.size,
              convertedSize: blob.size,
              originalUrl,
              convertedUrl,
              originalFormat,
              targetFormat: targetFormatData.label,
              name: convertedName
            });
            
            setTimeout(() => {
              setIsProcessing(false);
              toast({
                title: "Success",
                description: `Image converted to ${targetFormatData.label} successfully!`,
              });
            }, 500);
          }
        }, targetFormatData.mimeType, quality);
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  }, [targetFormat, supportedFormats]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      convertImage(e.dataTransfer.files[0]);
    }
  }, [convertImage]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      convertImage(e.target.files[0]);
    }
  }, [convertImage]);
  
  const downloadConvertedImage = useCallback(() => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage.convertedUrl;
    link.download = convertedImage.name;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Converted image downloaded successfully!",
    });
  }, [convertedImage]);
  
  const resetConverter = useCallback(() => {
    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.originalUrl);
      URL.revokeObjectURL(convertedImage.convertedUrl);
      setConvertedImage(null);
    }
  }, [convertedImage]);
  
  return (
    <>
      <SEO
        title="Image Format Converter - Convert PNG, JPG, WebP Online Free | ToolifyConvert"
        description="Convert images between different formats online for free. Support for JPG, PNG, WebP, BMP conversions."
        keywords="image format converter, convert png to jpg, convert jpg to png, convert webp, image conversion"
        canonicalUrl="https://toolifyconvert.com/tools/image-format-converter"
      />
      
      <ToolPageTemplate
        title="Image Format Converter"
        description="Convert images between different formats (PNG, JPG, WebP, BMP)"
      >
        {!convertedImage ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="format-select">Target Format:</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target format" />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                PNG, JPG, WebP, BMP (MAX. 100MB)
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
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Conversion Results</h3>
              <Button variant="ghost" size="sm" onClick={resetConverter}>
                <X className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Original ({convertedImage.originalFormat})</h4>
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={convertedImage.originalUrl} 
                    alt="Original" 
                    className="absolute w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm">Size: {formatBytes(convertedImage.originalSize)}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Converted ({convertedImage.targetFormat})</h4>
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={convertedImage.convertedUrl} 
                    alt="Converted" 
                    className="absolute w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm">Size: {formatBytes(convertedImage.convertedSize)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-md">
              <h4 className="font-medium mb-2">Conversion Summary</h4>
              <p>Format: {convertedImage.originalFormat} → {convertedImage.targetFormat}</p>
              <p>Original size: {formatBytes(convertedImage.originalSize)}</p>
              <p>Converted size: {formatBytes(convertedImage.convertedSize)}</p>
            </div>
            
            <Button className="w-full" onClick={downloadConvertedImage}>
              <Download className="mr-2 h-4 w-4" /> Download {convertedImage.targetFormat}
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Converting image...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </ToolPageTemplate>
    </>
  );
};

export default ImageFormatConverter;
