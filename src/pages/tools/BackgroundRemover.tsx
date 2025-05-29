
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, Upload, Download, Scissors, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import SEO from "@/components/SEO";

const BackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
  }, [toast]);

  const removeBackgroundHandler = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      const imageElement = await loadImage(blob);
      
      const resultBlob = await removeBackground(imageElement, (progressValue) => {
        setProgress(progressValue);
      });
      
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      
      toast({
        title: "Success",
        description: "Background removed successfully with AI!",
      });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [selectedImage, toast]);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Image downloaded successfully!",
    });
  }, [processedImage, toast]);

  return (
    <>
      <SEO
        title="AI Background Remover - Remove Image Backgrounds Online Free | ToolifyConvert"
        description="Remove backgrounds from images instantly with AI technology. Free online background remover tool with advanced AI processing. No signup required."
        keywords="background remover, AI background removal, remove image background, transparent background, image editing, photo editor, cutout tool"
        canonicalUrl="https://toolifyconvert.com/tools/background-remover"
      />
      
      <ToolPageTemplate
        title="AI Background Remover"
        description="Remove backgrounds from images instantly with advanced AI technology - no signup required"
      >
        <div className="space-y-8 perspective-1000">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl">
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload Image</h3>
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-blue-300/50 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 glassmorphism">
                    <div className="animate-float">
                      <ImageIcon className="h-20 w-20 text-blue-400 mx-auto mb-6" />
                    </div>
                    <p className="text-lg text-gray-600 mb-6 font-medium">
                      Drop your image here or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-3d px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Upload className="mr-3 h-6 w-6" /> Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="relative border rounded-2xl p-6 glassmorphism animate-scale-in bg-white/70">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-64 object-cover rounded-xl shadow-lg border border-gray-200"
                    />
                    <Button 
                      variant="outline" 
                      className="absolute top-8 right-8 btn-3d bg-white/90"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-5 w-5" /> Change Image
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

              <Button 
                onClick={removeBackgroundHandler} 
                disabled={!selectedImage || isProcessing}
                className="w-full btn-3d py-4 text-lg animate-fade-in delay-500 bg-gradient-to-r from-green-500 to-teal-600"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full mr-3"></div>
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="mr-3 h-6 w-6" /> Remove Background with AI
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between text-sm font-medium">
                    <span>AI Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                  <p className="text-xs text-gray-600 text-center">
                    {progress < 30 ? 'Loading AI model...' : 
                     progress < 70 ? 'Analyzing image...' : 
                     progress < 95 ? 'Removing background...' : 'Finalizing...'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6 card-3d bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-xl">
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">AI Result</h3>
              <div className="border rounded-2xl min-h-[400px] flex items-center justify-center glassmorphism bg-white/50">
                {processedImage ? (
                  <div className="p-6 text-center animate-scale-in">
                    <img 
                      src={processedImage} 
                      alt="Background removed" 
                      className="max-w-full max-h-[350px] object-contain mx-auto rounded-xl shadow-2xl"
                      style={{ backgroundColor: 'transparent' }}
                    />
                    <p className="text-sm text-gray-600 mt-6 font-semibold bg-green-50 px-4 py-2 rounded-full inline-block">
                      ✅ Background Removed • AI Processed • Transparent PNG
                    </p>
                  </div>
                ) : (
                  <div className="text-center animate-fade-in">
                    <ImageIcon className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-float" />
                    <p className="text-gray-500 text-xl font-medium">Your AI-processed image will appear here</p>
                    <p className="text-gray-400 text-sm mt-3">Advanced AI background removal</p>
                  </div>
                )}
              </div>
              
              {processedImage && (
                <Button 
                  onClick={downloadImage} 
                  className="w-full btn-3d py-4 text-lg animate-fade-in bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Download className="mr-3 h-6 w-6" /> Download Transparent PNG
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Info Section */}
          <div className="glassmorphism p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 border border-white/50 animate-fade-in delay-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 Advanced AI Background Removal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-gray-600">Advanced machine learning algorithms</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">100% Private</h3>
                <p className="text-sm text-gray-600">Processing happens in your browser</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">WebGPU Accelerated</h3>
                <p className="text-sm text-gray-600">Hardware acceleration when available</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Precise Results</h3>
                <p className="text-sm text-gray-600">High-quality edge detection</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Professional AI Background Removal</h3>
              <p className="text-gray-700 mb-4">
                Our advanced AI background remover uses state-of-the-art machine learning models to automatically detect and remove 
                backgrounds from your images. The tool works entirely in your browser, ensuring complete privacy and security for 
                your photos. Perfect for creating product photos, profile pictures, and professional presentations.
              </p>
              
              <h3 className="text-lg font-semibold mb-4">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>AI-Powered Precision:</strong> Advanced segmentation models for accurate results</li>
                <li><strong>Instant Processing:</strong> Fast background removal in seconds</li>
                <li><strong>Privacy First:</strong> All processing happens locally in your browser</li>
                <li><strong>High Quality Output:</strong> Transparent PNG with smooth edges</li>
                <li><strong>WebGPU Acceleration:</strong> Hardware acceleration for faster processing</li>
                <li><strong>No Signup Required:</strong> Free to use without registration</li>
              </ul>
            </div>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default BackgroundRemover;
