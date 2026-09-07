
import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crop, Download, Upload, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import ToolPageTemplate from "./ToolPageTemplate";

const ImageCropTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [ratio, setRatio] = useState<string>("free");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const startCrop = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropData({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const updateCrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    setCropData(prev => {
      let width = currentX - prev.x;
      let height = currentY - prev.y;
      const ar = ratioValue(ratio);
      if (ar) {
        const sign = height < 0 ? -1 : 1;
        height = sign * (Math.abs(width) / ar);
      }
      return { ...prev, width, height };
    });
  };

  const endCrop = () => {
    setIsDragging(false);
  };

  const ratioValue = (r: string) => {
    if (r === "free") return null;
    const [a, b] = r.split(":").map(Number);
    return a / b;
  };

  const centerCrop = (r: string) => {
    const img = imageRef.current;
    if (!img) return;
    const W = img.clientWidth;
    const H = img.clientHeight;
    const ar = ratioValue(r);
    let w = W, h = H;
    if (ar) {
      if (W / H > ar) { h = H; w = H * ar; } else { w = W; h = W / ar; }
    }
    setCropData({ x: (W - w) / 2, y: (H - h) / 2, width: w, height: h });
  };

  const onImageLoad = () => centerCrop(ratio);

  const chooseRatio = (r: string) => {
    setRatio(r);
    centerCrop(r);
  };

  const applyCrop = () => {
    if (!image || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = Math.abs(cropData.width) * scaleX;
    canvas.height = Math.abs(cropData.height) * scaleY;

    ctx.drawImage(
      img,
      Math.min(cropData.x, cropData.x + cropData.width) * scaleX,
      Math.min(cropData.y, cropData.y + cropData.height) * scaleY,
      Math.abs(cropData.width) * scaleX,
      Math.abs(cropData.height) * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedDataUrl = canvas.toDataURL('image/png');
    setCroppedImage(croppedDataUrl);

    toast({
      title: "Success",
      description: "Image cropped successfully!",
    });
  };

  const downloadCroppedImage = () => {
    if (croppedImage && originalFile) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped_${originalFile.name.split('.')[0]}.png`;
      link.click();
    }
  };

  return (
    <ToolPageTemplate
      title="Image Crop Tool"
      description="Crop your images with precision and download in high quality"
      keywords="image crop, photo crop, resize image, image editing, crop tool"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Crop Your Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!image ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div>
                  <p className="text-lg font-medium mb-2">Drop your image here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, GIF, WebP</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Pick an aspect ratio, or click and drag on the image to select an area
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["free", "1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3"].map((r) => (
                      <Button
                        key={r}
                        type="button"
                        size="sm"
                        variant={ratio === r ? "default" : "outline"}
                        onClick={() => chooseRatio(r)}
                      >
                        {r === "free" ? "Free" : r}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div 
                  className="relative inline-block border rounded-lg overflow-hidden cursor-crosshair"
                  onMouseDown={startCrop}
                  onMouseMove={updateCrop}
                  onMouseUp={endCrop}
                  onMouseLeave={endCrop}
                >
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Original"
                    className="max-w-full max-h-96 block"
                    onLoad={onImageLoad}
                    draggable={false}
                  />
                  
                  {(cropData.width !== 0 || cropData.height !== 0) && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-30"
                      style={{
                        left: Math.min(cropData.x, cropData.x + cropData.width),
                        top: Math.min(cropData.y, cropData.y + cropData.height),
                        width: Math.abs(cropData.width),
                        height: Math.abs(cropData.height),
                      }}
                    />
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={applyCrop}
                    disabled={cropData.width === 0 && cropData.height === 0}
                  >
                    Apply Crop
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setImage(null);
                      setCroppedImage(null);
                      setCropData({ x: 0, y: 0, width: 0, height: 0 });
                    }}
                  >
                    Choose Different Image
                  </Button>
                </div>

                {croppedImage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-center space-y-4">
                      <p className="font-medium text-green-800">Cropped Image Preview</p>
                      <img 
                        src={croppedImage} 
                        alt="Cropped" 
                        className="max-w-full max-h-64 mx-auto border rounded"
                      />
                      <Button onClick={downloadCroppedImage} className="flex items-center gap-2 mx-auto">
                        <Download className="w-4 h-4" />
                        Download Cropped Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className="hidden" />

        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>Upload an image by clicking or dragging it to the upload area</li>
              <li>Click and drag on the image to select the area you want to crop</li>
              <li>Click "Apply Crop" to process your selection</li>
              <li>Preview the result and download your cropped image</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ImageCropTool;
