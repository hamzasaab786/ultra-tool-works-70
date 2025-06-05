
import React, { useState, useRef, useCallback } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, Palette, Sun, Contrast, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PhotoEditor = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editedImageUrl, setEditedImageUrl] = useState<string>('');
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setEditedImageUrl('');
    
    toast({
      title: "Image loaded",
      description: `${file.name} ready for editing`,
    });
  }, []);

  const applyFilters = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Convert to data URL
      const editedUrl = canvas.toDataURL('image/jpeg', 0.9);
      setEditedImageUrl(editedUrl);
      
      setIsProcessing(false);
      toast({
        title: "Success",
        description: "Filters applied successfully!",
      });
    };
    
    img.src = imageUrl;
  }, [imageUrl, brightness, contrast, saturation]);

  const downloadImage = useCallback(() => {
    if (!editedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = editedImageUrl;
    link.download = `edited_${selectedImage?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Edited image downloaded successfully!",
    });
  }, [editedImageUrl, selectedImage]);

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setEditedImageUrl('');
  };

  return (
    <ToolPageTemplate
      title="Photo Editor"
      description="Edit and enhance your photos with professional filters and adjustments"
      keywords="photo editor, image editing, photo enhancement, filters, brightness, contrast"
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Image
          </h3>
          
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Choose image to edit
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports JPG, PNG, WebP formats
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-5 w-5" /> 
                Select Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedImage.name}</p>
                    <p className="text-sm text-gray-600">Ready for editing</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                >
                  Change Image
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Original</h4>
                  <img src={imageUrl} alt="Original" className="w-full rounded-lg border" />
                </div>
                {editedImageUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Edited</h4>
                    <img src={editedImageUrl} alt="Edited" className="w-full rounded-lg border" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter Controls */}
        {selectedImage && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              Photo Adjustments
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Brightness: {brightness[0]}%
                </Label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  max={200}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast: {contrast[0]}%
                </Label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={200}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Saturation: {saturation[0]}%
                </Label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  max={200}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={applyFilters} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" /> 
                    Apply Filters
                  </>
                )}
              </Button>
              <Button 
                onClick={resetFilters} 
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Download Section */}
        {editedImageUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
              <Download className="h-5 w-5" />
              Download Edited Image
            </h3>
            
            <Button 
              onClick={downloadImage} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="mr-2 h-5 w-5" /> 
              Download Image
            </Button>
          </div>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolPageTemplate>
  );
};

export default PhotoEditor;
