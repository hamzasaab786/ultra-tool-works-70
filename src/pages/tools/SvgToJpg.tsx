
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileImage, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SvgToJpg = () => {
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [convertedJpg, setConvertedJpg] = useState<string | null>(null);
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
      // Create a canvas element with fixed high quality settings
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set fixed canvas dimensions for optimal quality
      const width = 1920;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
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
        
        // Convert to JPEG with high quality (90%)
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setConvertedJpg(jpegDataUrl);
        
        // Clean up
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        
        toast({
          title: "Success",
          description: "SVG converted to high-quality JPG!",
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
  }, [selectedSvg]);

  const downloadJpg = useCallback(() => {
    if (!convertedJpg) return;
    
    const link = document.createElement('a');
    link.href = convertedJpg;
    link.download = `converted-svg-hd-quality.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "High-quality JPG file downloaded successfully!",
    });
  }, [convertedJpg]);

  return (
    <ToolPageTemplate
      title="SVG to JPG Converter"
      description="Convert SVG vector graphics to high-quality JPG images with optimized settings"
    >
      <div className="space-y-8 perspective-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 card-3d bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="animate-fade-in">
              <Label className="text-lg font-semibold mb-4 block">Upload SVG File</Label>
              {!selectedSvg ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary transition-all duration-300 glassmorphism">
                  <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-6 animate-bounce-gentle" />
                  <p className="text-lg text-gray-600 mb-6">
                    Drop your SVG file here or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleSvgUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-3d px-8 py-3 text-lg"
                  >
                    <Upload className="mr-3 h-5 w-5" /> Select SVG File
                  </Button>
                </div>
              ) : (
                <div className="relative border rounded-xl p-6 glassmorphism animate-scale-in">
                  <div className="bg-white/50 rounded-lg p-6 mb-6">
                    <div 
                      className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg"
                      dangerouslySetInnerHTML={{ __html: selectedSvg }}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full btn-3d"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Change SVG File
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

            <div className="animate-fade-in delay-300">
              <div className="glassmorphism p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Conversion Settings</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Output Format:</span>
                    <span className="font-medium">JPG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="font-medium">1920 × 1080 (HD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="font-medium">90% (High)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Background:</span>
                    <span className="font-medium">White</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={convertToJpg} 
              disabled={!selectedSvg || isProcessing}
              className="w-full btn-3d py-4 text-lg animate-fade-in delay-500"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Converting to High-Quality JPG...
                </>
              ) : (
                <>
                  <FileImage className="mr-3 h-5 w-5" /> Convert to JPG
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6 card-3d bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <Label className="text-lg font-semibold">JPG Result</Label>
            <div className="border rounded-xl min-h-[400px] flex items-center justify-center glassmorphism">
              {convertedJpg ? (
                <div className="p-6 text-center animate-scale-in">
                  <img 
                    src={convertedJpg} 
                    alt="Converted JPG" 
                    className="max-w-full max-h-[350px] object-contain mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-600 mt-4 font-medium">
                    High-Quality JPG • 1920 × 1080 • 90% Quality
                  </p>
                </div>
              ) : (
                <div className="text-center animate-fade-in">
                  <FileImage className="h-20 w-20 text-gray-400 mx-auto mb-6 animate-float" />
                  <p className="text-gray-500 text-lg">Your converted JPG will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Optimized for quality and compatibility</p>
                </div>
              )}
            </div>
            
            {convertedJpg && (
              <Button 
                onClick={downloadJpg} 
                className="w-full btn-3d py-4 text-lg animate-fade-in"
              >
                <Download className="mr-3 h-5 w-5" /> Download HD JPG
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default SvgToJpg;
