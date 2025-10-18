import React, { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const AiImageAnalyzer = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState("description");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setAnalysis("");
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-image-analyzer', {
        body: { imageBase64: selectedImage, analysisType }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Analysis failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data.analysis);
      toast({
        title: "Analysis complete!",
        description: "Image has been analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="AI Image Analyzer"
      description="Analyze images and extract insights using AI vision technology"
      keywords="ai image analyzer, image description, image recognition, ai vision, image analysis tool"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Upload Image *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</p>
                </label>
              </div>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="w-full h-auto max-h-96 object-contain bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysisType">Analysis Type</Label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="description">General Description</SelectItem>
                      <SelectItem value="objects">Object Detection</SelectItem>
                      <SelectItem value="text">Text Extraction (OCR)</SelectItem>
                      <SelectItem value="colors">Color Analysis</SelectItem>
                      <SelectItem value="composition">Composition Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-2 block">Analysis Result</Label>
              <div className="prose max-w-none p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{analysis}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-green-900">🔍 AI Vision Technology</h3>
            <p className="text-sm text-green-800">
              Advanced AI analyzes your images to extract detailed information, detect objects, read text, and understand composition.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default AiImageAnalyzer;
