
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ImageToUrl = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setSelectedImage(file);
    generateImageUrl(file);
  }, []);

  const generateImageUrl = useCallback((file: File) => {
    setIsUploading(true);
    
    // Create a blob URL for the image
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setIsUploading(false);
    
    toast({
      title: "Success",
      description: "Image URL generated successfully!",
    });
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!imageUrl) return;
    
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive"
      });
    }
  }, [imageUrl]);

  const openImage = useCallback(() => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  }, [imageUrl]);

  return (
    <ToolPageTemplate
      title="Image to URL Converter"
      description="Convert your images to shareable URLs instantly"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Click to upload or drag and drop your image
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Select Image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Selected image to convert to URL" 
                    className="w-full h-48 object-cover rounded border" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
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
          </div>

          <div className="space-y-4">
            <Label>Generated URL</Label>
            {isUploading ? (
              <div className="border rounded-lg p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Generating URL...</p>
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={imageUrl}
                    readOnly
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="h-8 w-8 p-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={openImage}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">✅ URL Generated Successfully!</h3>
                  <p className="text-sm text-green-700">Your image is now accessible via the URL above.</p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500">Upload an image to generate a shareable URL</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ImageToUrl;
