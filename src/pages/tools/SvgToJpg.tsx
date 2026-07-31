
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileImage, Upload, Download, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const SvgToJpg = () => {
  const [selectedSvg, setSelectedSvg] = useState<string | null>(null);
  const [convertedJpg, setConvertedJpg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([90]);
  const [resolution, setResolution] = useState("1920x1080");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolutionPresets = {
    "1920x1080": { width: 1920, height: 1080, label: "Full HD (1920×1080)" },
    "1280x720": { width: 1280, height: 720, label: "HD (1280×720)" },
    "3840x2160": { width: 3840, height: 2160, label: "4K (3840×2160)" },
    "2560x1440": { width: 2560, height: 1440, label: "2K (2560×1440)" },
    "800x600": { width: 800, height: 600, label: "Standard (800×600)" },
    "custom": { width: customWidth, height: customHeight, label: "Custom" }
  };

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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const preset = resolutionPresets[resolution as keyof typeof resolutionPresets];
      canvas.width = preset.width;
      canvas.height = preset.height;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      
      const svgBlob = new Blob([selectedSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspectRatio > canvasAspectRatio) {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspectRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Convert to JPEG with configurable quality
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality[0] / 100);
        setConvertedJpg(jpegDataUrl);
        
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        
        toast({
          title: "Success",
          description: `SVG converted to JPG at ${quality[0]}% quality!`,
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
  }, [selectedSvg, quality, resolution, customWidth, customHeight]);

  const downloadJpg = useCallback(() => {
    if (!convertedJpg) return;
    
    const preset = resolutionPresets[resolution as keyof typeof resolutionPresets];
    const filename = `converted-svg-${preset.width}x${preset.height}-q${quality[0]}.jpg`;
    
    const link = document.createElement('a');
    link.href = convertedJpg;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: `High-quality JPG (${preset.width}×${preset.height}) downloaded!`,
    });
  }, [convertedJpg, resolution, quality]);

  return (
    <>
      <SEO
        title="SVG to JPG Converter - Convert Vector Graphics Online Free | Klipza"
        description="Convert SVG files to high-quality JPG images online. Configurable quality settings, multiple resolutions, and instant conversion. Free SVG to JPEG converter."
        keywords="SVG to JPG converter, vector to raster, SVG converter, image conversion, graphics converter, vector graphics, JPEG converter"
        canonicalUrl="https://klipza.live/tools/svg-to-jpg"
      />
      
      <ToolPageTemplate
        title="SVG to JPG Converter"
        description="Convert SVG vector graphics to high-quality JPG images with configurable settings"
      >
        <div className="space-y-8 perspective-1000">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl">
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload & Configure</h3>
                
                {!selectedSvg ? (
                  <div className="border-2 border-dashed border-blue-300/50 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 glassmorphism">
                    <FileImage className="h-20 w-20 text-blue-400 mx-auto mb-6 animate-bounce-gentle" />
                    <p className="text-lg text-gray-600 mb-6 font-medium">
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
                      className="btn-3d px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Upload className="mr-3 h-6 w-6" /> Select SVG File
                    </Button>
                  </div>
                ) : (
                  <div className="relative border rounded-2xl p-6 glassmorphism animate-scale-in bg-white/70">
                    <div className="bg-white/80 rounded-xl p-6 mb-6 shadow-inner">
                      <div 
                        className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl border border-gray-200"
                        dangerouslySetInnerHTML={{ __html: selectedSvg }}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full btn-3d border-2 hover:bg-blue-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-5 w-5" /> Change SVG File
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

                {/* Quality and Resolution Settings */}
                <div className="space-y-6 glassmorphism p-6 rounded-2xl bg-white/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Conversion Settings</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Quality: {quality[0]}%
                      </Label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-2">Higher quality = larger file size</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Resolution
                      </Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(resolutionPresets).map(([key, preset]) => (
                            <SelectItem key={key} value={key}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {resolution === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Width (px)
                          </Label>
                          <input
                            type="number"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            min="100"
                            max="7680"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Height (px)
                          </Label>
                          <input
                            type="number"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            min="100"
                            max="4320"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={convertToJpg} 
                  disabled={!selectedSvg || isProcessing}
                  className="w-full btn-3d py-4 text-lg animate-fade-in delay-500 bg-gradient-to-r from-green-500 to-teal-600"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                      Converting to JPG...
                    </>
                  ) : (
                    <>
                      <FileImage className="mr-3 h-6 w-6" /> Convert to JPG
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl">
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">JPG Result</h3>
              <div className="border rounded-2xl min-h-[400px] flex items-center justify-center glassmorphism bg-white/50">
                {convertedJpg ? (
                  <div className="p-6 text-center animate-scale-in">
                    <img 
                      src={convertedJpg} 
                      alt="Converted JPG" 
                      className="max-w-full max-h-[350px] object-contain mx-auto rounded-xl shadow-2xl border border-gray-200"
                    />
                    <div className="mt-6 space-y-2">
                      <p className="text-sm text-gray-600 font-semibold bg-green-50 px-4 py-2 rounded-full inline-block">
                        ✅ Converted • {resolutionPresets[resolution as keyof typeof resolutionPresets].width}×{resolutionPresets[resolution as keyof typeof resolutionPresets].height} • {quality[0]}% Quality
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center animate-fade-in">
                    <FileImage className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-float" />
                    <p className="text-gray-500 text-xl font-medium">Your converted JPG will appear here</p>
                    <p className="text-gray-400 text-sm mt-3">Configurable quality and resolution</p>
                  </div>
                )}
              </div>
              
              {convertedJpg && (
                <Button 
                  onClick={downloadJpg} 
                  className="w-full btn-3d py-4 text-lg animate-fade-in bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Download className="mr-3 h-6 w-6" /> Download JPG
                </Button>
              )}
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="glassmorphism p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 border border-white/50 animate-fade-in delay-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎨 Professional SVG to JPG Conversion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Configurable Quality</h3>
                <p className="text-sm text-gray-600">Adjust quality from 10% to 100%</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">📐</span>
                </div>
                <h3 className="font-semibold mb-2">Multiple Resolutions</h3>
                <p className="text-sm text-gray-600">HD, 4K, and custom dimensions</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Instant Processing</h3>
                <p className="text-sm text-gray-600">Convert in seconds</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Perfect Quality</h3>
                <p className="text-sm text-gray-600">Maintains aspect ratio</p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Why Convert SVG to JPG?</h3>
              <p className="text-gray-700 mb-4">
                SVG to JPG conversion is essential for web compatibility, social media sharing, and print applications. 
                Our advanced converter maintains image quality while providing configurable settings for resolution and 
                compression. Perfect for creating web-ready images, social media graphics, and print materials from vector designs.
              </p>
              
              <h3 className="text-lg font-semibold mb-4">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Quality Control:</strong> Adjustable compression from 10% to 100%</li>
                <li><strong>Resolution Options:</strong> HD, 4K, and custom dimensions up to 7680×4320</li>
                <li><strong>Aspect Ratio Preservation:</strong> Maintains original proportions</li>
                <li><strong>White Background:</strong> Clean, professional output</li>
                <li><strong>Instant Preview:</strong> See results before downloading</li>
                <li><strong>Browser-Based:</strong> No software installation required</li>
              </ul>
            </div>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default SvgToJpg;
