import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
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
    reader.onload = event => {
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

      // Fixed high-quality settings
      const width = 1920;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      const svgBlob = new Blob([selectedSvg], {
        type: 'image/svg+xml'
      });
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

        // Convert to JPEG with fixed 90% quality
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setConvertedJpg(jpegDataUrl);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        toast({
          title: "Success",
          description: "SVG converted to high-quality JPG!"
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
    link.download = `converted-svg-hq.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Downloaded",
      description: "High-quality JPG file downloaded successfully!"
    });
  }, [convertedJpg]);
  return <ToolPageTemplate title="SVG to JPG Converter" description="Convert SVG vector graphics to high-quality JPG images instantly">
      <div className="space-y-8 perspective-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload SVG File</h3>
              {!selectedSvg ? <div className="border-2 border-dashed border-blue-300/50 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 glassmorphism">
                  <FileImage className="h-20 w-20 text-blue-400 mx-auto mb-6 animate-bounce-gentle" />
                  <p className="text-lg text-gray-600 mb-6 font-medium">
                    Drop your SVG file here or click to browse
                  </p>
                  <input ref={fileInputRef} type="file" accept=".svg,image/svg+xml" onChange={handleSvgUpload} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} className="btn-3d px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Upload className="mr-3 h-6 w-6" /> Select SVG File
                  </Button>
                </div> : <div className="relative border rounded-2xl p-6 glassmorphism animate-scale-in bg-white/70">
                  <div className="bg-white/80 rounded-xl p-6 mb-6 shadow-inner">
                    <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl border border-gray-200" dangerouslySetInnerHTML={{
                  __html: selectedSvg
                }} />
                  </div>
                  <Button variant="outline" className="w-full btn-3d border-2 hover:bg-blue-50" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-5 w-5" /> Change SVG File
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".svg,image/svg+xml" onChange={handleSvgUpload} className="hidden" />
                </div>}
            </div>

            <Button onClick={convertToJpg} disabled={!selectedSvg || isProcessing} className="w-full btn-3d py-4 text-lg animate-fade-in delay-500 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 bg-zinc-950 hover:bg-zinc-800">
              {isProcessing ? <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                  Converting to High-Quality JPG...
                </> : <>
                  <FileImage className="mr-3 h-6 w-6" /> Convert to JPG
                </>}
            </Button>
          </div>

          <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">JPG Result</h3>
            <div className="border rounded-2xl min-h-[400px] flex items-center justify-center glassmorphism bg-white/50">
              {convertedJpg ? <div className="p-6 text-center animate-scale-in">
                  <img src={convertedJpg} alt="Converted JPG" className="max-w-full max-h-[350px] object-contain mx-auto rounded-xl shadow-2xl border border-gray-200" />
                  <p className="text-sm text-gray-600 mt-6 font-semibold bg-green-50 px-4 py-2 rounded-full inline-block">
                    ✅ High-Quality JPG • 1920 × 1080 • 90% Quality
                  </p>
                </div> : <div className="text-center animate-fade-in">
                  <FileImage className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-float" />
                  <p className="text-gray-500 text-xl font-medium">Your converted JPG will appear here</p>
                  <p className="text-gray-400 text-sm mt-3">Optimized for quality and compatibility</p>
                </div>}
            </div>
            
            {convertedJpg && <Button onClick={downloadJpg} className="w-full btn-3d py-4 text-lg animate-fade-in bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Download className="mr-3 h-6 w-6" /> Download HD JPG
              </Button>}
          </div>
        </div>

        {/* Conversion Info */}
        <div className="glassmorphism p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-white/50 animate-fade-in delay-700">
          <h4 className="text-lg font-bold mb-4 text-gray-800">🚀 Conversion Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Fixed HD Resolution</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">90% Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium">White Background</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium">Instant Processing</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>;
};
export default SvgToJpg;