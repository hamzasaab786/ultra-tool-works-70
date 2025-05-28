
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileImage, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SvgToJpg = () => {
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [convertedJpg, setConvertedJpg] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(90);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSvgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
      toast({
        title: "Error",
        description: "Please select a valid SVG file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedSvg(event.target?.result as string);
      setConvertedJpg(null);
    };
    reader.readAsText(file);
  }, []);

  const convertToJpg = useCallback(async () => {
    if (!selectedSvg) return;

    setIsProcessing(true);
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Fill background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create an image from SVG
      const img = new Image();
      
      // Create blob URL from SVG string
      const svgBlob = new Blob([selectedSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Calculate scaling to fit the canvas while maintaining aspect ratio
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspectRatio > canvasAspectRatio) {
          // Image is wider than canvas ratio
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          // Image is taller than canvas ratio
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspectRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }

        // Draw the SVG on canvas
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Convert to JPEG with specified quality
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        setConvertedJpg(jpegDataUrl);
        
        // Clean up
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        
        toast({
          title: "Success",
          description: "SVG converted to JPG successfully!",
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to load SVG. Please check if the file is valid.",
          variant: "destructive"
        });
      };

      img.src = url;
      
    } catch (error) {
      console.error('Error converting SVG:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to convert SVG. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedSvg, quality, width, height, backgroundColor]);

  const downloadJpg = useCallback(() => {
    if (!convertedJpg) return;
    
    const link = document.createElement('a');
    link.href = convertedJpg;
    link.download = `converted-${width}x${height}-q${quality}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "JPG file downloaded successfully!",
    });
  }, [convertedJpg, width, height, quality]);

  const presetSizes = [
    { name: "HD (1280x720)", width: 1280, height: 720 },
    { name: "Full HD (1920x1080)", width: 1920, height: 1080 },
    { name: "4K (3840x2160)", width: 3840, height: 2160 },
    { name: "Square (1000x1000)", width: 1000, height: 1000 },
    { name: "Custom", width: 0, height: 0 }
  ];

  const handlePresetChange = (preset: string) => {
    const selected = presetSizes.find(p => p.name === preset);
    if (selected && selected.width > 0) {
      setWidth(selected.width);
      setHeight(selected.height);
    }
  };

  return (
    <ToolPageTemplate
      title="SVG to JPG Converter"
      description="Convert SVG vector graphics to high-quality JPG images with custom dimensions and quality settings"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload SVG File</Label>
              {!selectedSvg ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Click to upload your SVG file
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleSvgUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Select SVG File
                  </Button>
                </div>
              ) : (
                <div className="relative border rounded-lg p-4">
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <div 
                      className="w-full h-32 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: selectedSvg }}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change SVG File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleSvgUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Preset Sizes</Label>
                <Select onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetSizes.map(preset => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2">
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 800)}
                  min="1"
                  max="10000"
                />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 600)}
                  min="1"
                  max="10000"
                />
              </div>
              <div>
                <Label>Quality (%)</Label>
                <Input
                  type="number"
                  value={quality}
                  onChange={(e) => setQuality(Math.min(100, Math.max(1, parseInt(e.target.value) || 90)))}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <Button 
              onClick={convertToJpg} 
              disabled={!selectedSvg || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <FileImage className="mr-2 h-4 w-4" /> Convert to JPG
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>JPG Result</Label>
            <div className="border rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50">
              {convertedJpg ? (
                <div className="p-4 text-center">
                  <img 
                    src={convertedJpg} 
                    alt="Converted JPG" 
                    className="max-w-full max-h-[350px] object-contain mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {width} × {height} px, Quality: {quality}%
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Converted JPG will appear here</p>
                </div>
              )}
            </div>
            
            {convertedJpg && (
              <Button onClick={downloadJpg} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download JPG
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default SvgToJpg;
