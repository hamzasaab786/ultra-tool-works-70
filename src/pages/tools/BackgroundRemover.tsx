
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Upload, Download, Zap, Settings, Batch, Smartphone, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { removeBackground, loadImage, processBatch } from "@/utils/backgroundRemoval";
import MobileOptimizedSlider from "@/components/MobileOptimizedSlider";
import DragDropUpload from "@/components/DragDropUpload";
import BackgroundColorPicker from "@/components/BackgroundColorPicker";
import SEO from "@/components/SEO";
import { useIsMobile } from "@/hooks/use-mobile";

const BackgroundRemover = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [gradientStart, setGradientStart] = useState("#ffffff");
  const [gradientEnd, setGradientEnd] = useState("#f0f0f0");
  const [isGradient, setIsGradient] = useState(false);
  const [modelQuality, setModelQuality] = useState<'fast' | 'balanced' | 'accurate'>('balanced');
  const [batchMode, setBatchMode] = useState(false);
  const [batchResults, setBatchResults] = useState<{name: string, url: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      setBatchResults([]);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleBatchFiles = useCallback(async (files: FileList) => {
    if (files.length === 0) {
      setBatchResults([]);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setBatchResults([]);

    try {
      const results: {name: string, url: string}[] = [];
      
      await processBatch(
        files,
        (batchProgress) => setProgress(batchProgress),
        (fileName, resultBlob) => {
          const url = URL.createObjectURL(resultBlob);
          results.push({ name: fileName, url });
          setBatchResults([...results]);
        },
        backgroundColor,
        gradientStart,
        gradientEnd,
        isGradient,
        modelQuality
      );

      toast({
        title: "Batch Processing Complete",
        description: `Successfully processed ${results.length} image(s)`,
      });
    } catch (error) {
      console.error('Batch processing error:', error);
      toast({
        title: "Error",
        description: "Failed to process some images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [backgroundColor, gradientStart, gradientEnd, isGradient, modelQuality, toast]);

  const removeBackgroundHandler = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      const imageElement = await loadImage(blob);
      
      const resultBlob = await removeBackground(
        imageElement, 
        (progressValue) => setProgress(progressValue),
        backgroundColor,
        gradientStart,
        gradientEnd,
        isGradient,
        modelQuality
      );
      
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      
      toast({
        title: "Success",
        description: "Background removed with professional quality!",
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
  }, [selectedImage, backgroundColor, gradientStart, gradientEnd, isGradient, modelQuality, toast]);

  const downloadImage = useCallback((url: string, filename: string = 'background-removed.png') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Image downloaded successfully!",
    });
  }, [toast]);

  const downloadAllBatch = useCallback(() => {
    batchResults.forEach((result, index) => {
      setTimeout(() => {
        downloadImage(result.url, `background-removed-${index + 1}.png`);
      }, index * 100);
    });
  }, [batchResults, downloadImage]);

  const handleGradientChange = useCallback((start: string, end: string) => {
    setGradientStart(start);
    setGradientEnd(end);
  }, []);

  return (
    <>
      <SEO
        title="AI Background Remover - Professional Quality | ToolifyConvert"
        description="Remove backgrounds from images with professional AI technology. Fast, accurate, mobile-optimized. WebGPU accelerated processing."
        keywords="background remover, AI background removal, professional photo editing, mobile background remover, batch processing, WebGPU"
        canonicalUrl="https://toolifyconvert.com/tools/background-remover"
      />
      
      <ToolPageTemplate
        title="Professional AI Background Remover"
        description="Remove backgrounds with professional quality using advanced AI models and WebGPU acceleration"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={batchMode ? "batch" : "single"} onValueChange={(value) => setBatchMode(value === "batch")} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {isMobile ? "Single" : "Single Image"}
                </TabsTrigger>
                <TabsTrigger value="batch" className="flex items-center gap-2">
                  <Batch className="h-4 w-4" />
                  {isMobile ? "Batch" : "Batch Process"}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              <span>{isMobile ? "Mobile Optimized" : "Desktop Enhanced"}</span>
            </div>
          </div>

          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {/* Upload Section */}
            <div className={`space-y-4 ${isMobile ? '' : 'lg:col-span-2'}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="h-5 w-5" />
                    {batchMode ? "Upload Images" : "Upload Image"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {batchMode ? (
                    <DragDropUpload
                      onFilesSelected={handleBatchFiles}
                      isProcessing={isProcessing}
                      progress={progress}
                      maxFiles={isMobile ? 5 : 10}
                    />
                  ) : (
                    <>
                      {!selectedImage ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300">
                          <ImageIcon className={`mx-auto mb-4 text-gray-400 ${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`} />
                          <p className={`text-gray-600 mb-4 ${isMobile ? 'text-sm' : 'font-medium'}`}>
                            {isMobile ? "Tap to select image" : "Drop your image here or click to browse"}
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                            <Upload className="mr-2 h-4 w-4" /> Select Image
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={selectedImage} 
                            alt="Selected" 
                            className={`w-full object-cover rounded-xl ${isMobile ? 'h-48' : 'h-64'}`}
                          />
                          <Button 
                            variant="outline" 
                            className="absolute top-2 right-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Change
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

                      {!batchMode && (
                        <Button 
                          onClick={removeBackgroundHandler} 
                          disabled={!selectedImage || isProcessing}
                          className="w-full mt-4"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4" /> Remove Background
                            </>
                          )}
                        </Button>
                      )}

                      {isProcessing && (
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between text-sm">
                            <span>Processing...</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Settings & Results */}
            <div className="space-y-4">
              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quality</label>
                    <Select value={modelQuality} onValueChange={(value: any) => setModelQuality(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Fast (2-3s)</SelectItem>
                        <SelectItem value="balanced">Balanced (5-8s)</SelectItem>
                        <SelectItem value="accurate">High Quality (10-15s)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <BackgroundColorPicker
                    selectedColor={backgroundColor}
                    onColorChange={setBackgroundColor}
                    gradientStart={gradientStart}
                    gradientEnd={gradientEnd}
                    onGradientChange={handleGradientChange}
                    isGradient={isGradient}
                    onGradientToggle={setIsGradient}
                  />
                </CardContent>
              </Card>

              {/* Results */}
              {!batchMode && processedImage && selectedImage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Result</span>
                      <Button onClick={() => downloadImage(processedImage)} size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MobileOptimizedSlider
                      beforeImage={selectedImage}
                      afterImage={processedImage}
                      className={isMobile ? "h-48" : "h-64"}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Batch Results */}
              {batchMode && batchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Results ({batchResults.length})</span>
                      <Button onClick={downloadAllBatch} size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {batchResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm truncate flex-1">{result.name}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadImage(result.url, result.name)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">AI</div>
                  <div className="text-sm text-gray-600">Powered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">WebGPU</div>
                  <div className="text-sm text-gray-600">Accelerated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">Mobile</div>
                  <div className="text-sm text-gray-600">Optimized</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">Batch</div>
                  <div className="text-sm text-gray-600">Processing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default BackgroundRemover;
