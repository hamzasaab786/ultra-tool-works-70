import React, { useState, useCallback, useRef, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Camera, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SizeKey = "passport" | "visa" | "id" | "license" | "us_passport" | "india_passport";

const photoSizes: Record<SizeKey, { width: number; height: number; name: string; pixels: { width: number; height: number } }> = {
  passport: { width: 35, height: 45, name: "Passport (35x45mm)", pixels: { width: 413, height: 531 } },
  visa: { width: 51, height: 51, name: "Visa (51x51mm)", pixels: { width: 600, height: 600 } },
  id: { width: 25, height: 32, name: "ID Card (25x32mm)", pixels: { width: 295, height: 378 } },
  license: { width: 24, height: 32, name: "License (24x32mm)", pixels: { width: 283, height: 378 } },
  us_passport: { width: 50.8, height: 50.8, name: "US Passport (2x2 inches)", pixels: { width: 600, height: 600 } },
  india_passport: { width: 35, height: 45, name: "India Passport (35x45mm)", pixels: { width: 413, height: 531 } },
};

const backgrounds = {
  white: { label: "White", color: "#ffffff" },
  offwhite: { label: "Off White", color: "#f5f5f5" },
  lightblue: { label: "Light Blue", color: "#dbeafe" },
  grey: { label: "Light Grey", color: "#e5e7eb" },
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });

const PassportPhotoMaker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState<SizeKey>("passport");
  const [instructions, setInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [bgKey, setBgKey] = useState<keyof typeof backgrounds>("white");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select a valid image file", variant: "destructive" });
      return;
    }
    const dataUrl = await new Promise<string>((res) => {
      const reader = new FileReader();
      reader.onload = (ev) => res(ev.target?.result as string);
      reader.readAsDataURL(file);
    });
    sourceRef.current = await loadImage(dataUrl);
    setSelectedImage(dataUrl);
    setProcessedImage(null);
    setZoom(100);
    setOffsetX(0);
    setOffsetY(0);
  }, []);

  /**
   * 100% pixel-accurate local render: crops/scales the ORIGINAL pixels only.
   * No pixel of the face is regenerated, so identity is preserved exactly.
   */
  const renderLocal = useCallback(
    (img: HTMLImageElement) => {
      const size = photoSizes[photoSize];
      const canvas = document.createElement("canvas");
      canvas.width = size.pixels.width;
      canvas.height = size.pixels.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = backgrounds[bgKey].color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = (Math.max(canvas.width / img.width, canvas.height / img.height) * zoom) / 100;
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width - w) / 2 + (offsetX / 100) * canvas.width;
      const y = (canvas.height - h) / 2 + (offsetY / 100) * canvas.height;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, x, y, w, h);
      ctx.filter = "none";

      return canvas.toDataURL("image/jpeg", 0.95);
    },
    [photoSize, zoom, offsetX, offsetY, brightness, contrast, bgKey]
  );

  // Instant live preview for the accurate (non-AI) mode
  useEffect(() => {
    if (aiMode || !sourceRef.current) return;
    const id = requestAnimationFrame(() => {
      const out = renderLocal(sourceRef.current!);
      if (out) setProcessedImage(out);
    });
    return () => cancelAnimationFrame(id);
  }, [aiMode, renderLocal, selectedImage]);

  const optimizeImage = useCallback(async (img: HTMLImageElement) => {
    // 1024px keeps facial detail while staying fast to upload/process
    const maxDim = 1024;
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return selectedImage as string;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  }, [selectedImage]);

  const processPhoto = useCallback(async () => {
    if (!selectedImage || !sourceRef.current) {
      toast({ title: "Error", description: "Please upload an image first", variant: "destructive" });
      return;
    }

    if (!aiMode) {
      const out = renderLocal(sourceRef.current);
      if (out) setProcessedImage(out);
      toast({ title: "Ready", description: "Photo generated instantly with 100% original facial pixels." });
      return;
    }

    setIsProcessing(true);
    try {
      const size = photoSizes[photoSize];
      const optimizedImage = await optimizeImage(sourceRef.current);

      const { data, error } = await supabase.functions.invoke("edit-passport-photo", {
        body: {
          imageBase64: optimizedImage,
          instructions: instructions || `Replace background with ${backgrounds[bgKey].label.toLowerCase()}`,
          photoSize: size.name,
        },
      });

      if (error) throw error;
      if (!data?.editedImage) throw new Error("No edited image received from AI");

      // Re-crop the AI result locally to exact print dimensions
      const aiImg = await loadImage(data.editedImage);
      const out = renderLocal(aiImg);
      setProcessedImage(out || data.editedImage);
      toast({ title: "Success", description: "Background replaced and cropped to exact size." });
    } catch (error) {
      console.error("Error processing photo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, aiMode, renderLocal, photoSize, optimizeImage, instructions, bgKey]);

  const downloadPhoto = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    const size = photoSizes[photoSize];
    link.download = `passport-photo-${size.width}x${size.height}mm.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded", description: "Passport photo downloaded successfully!" });
  }, [processedImage, photoSize]);

  return (
    <ToolPageTemplate
      title="Professional Passport Photo Maker"
      description="Create high-quality passport photos with precise dimensions and 100% accurate facial detail"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-lg border bg-muted/40">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Identity-Safe Mode (default)</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your photo is cropped and resized directly from the original pixels in your browser — instant, offline and your
            face is never regenerated, so it stays 100% identical. Switch on AI mode only if you need the background replaced.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Upload Photo</Label>
              {!selectedImage ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">Upload a clear, high-quality photo of yourself</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Select Photo
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img src={selectedImage} alt="Selected upload" className="w-full h-64 object-contain rounded bg-muted" />
                  <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => fileInputRef.current?.click()}>
                    Change Photo
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              )}
            </div>

            <div>
              <Label>Photo Size & Standard</Label>
              <Select value={photoSize} onValueChange={(v) => setPhotoSize(v as SizeKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(photoSizes).map(([key, size]) => (
                    <SelectItem key={key} value={key}>
                      {size.name} - {size.pixels.width}x{size.pixels.height}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Background</Label>
              <Select value={bgKey} onValueChange={(v) => setBgKey(v as keyof typeof backgrounds)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(backgrounds).map(([key, b]) => (
                    <SelectItem key={key} value={key}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Zoom ({zoom}%)</Label>
                <Slider value={[zoom]} min={100} max={250} step={1} onValueChange={([v]) => setZoom(v)} />
              </div>
              <div>
                <Label className="text-xs">Vertical ({offsetY}%)</Label>
                <Slider value={[offsetY]} min={-40} max={40} step={1} onValueChange={([v]) => setOffsetY(v)} />
              </div>
              <div>
                <Label className="text-xs">Horizontal ({offsetX}%)</Label>
                <Slider value={[offsetX]} min={-40} max={40} step={1} onValueChange={([v]) => setOffsetX(v)} />
              </div>
              <div>
                <Label className="text-xs">Brightness ({brightness}%)</Label>
                <Slider value={[brightness]} min={70} max={130} step={1} onValueChange={([v]) => setBrightness(v)} />
              </div>
              <div>
                <Label className="text-xs">Contrast ({contrast}%)</Label>
                <Slider value={[contrast]} min={70} max={130} step={1} onValueChange={([v]) => setContrast(v)} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm">AI background replacement</Label>
                <p className="text-xs text-muted-foreground">Slower, and may slightly alter facial detail.</p>
              </div>
              <Switch checked={aiMode} onCheckedChange={setAiMode} />
            </div>

            {aiMode && (
              <div>
                <Label>Describe what you want</Label>
                <Textarea
                  placeholder="Example: pure white background, even studio lighting, remove shadows..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}

            <Button onClick={processPhoto} disabled={!selectedImage || isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : aiMode ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> Generate Instantly
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Professional Result</Label>
            <div className="border rounded-lg min-h-[400px] flex items-center justify-center bg-muted/40">
              {processedImage ? (
                <div className="p-4">
                  <img
                    src={processedImage}
                    alt="Generated passport photo preview"
                    className="max-w-full object-contain border shadow-lg bg-background"
                    style={{ maxHeight: "350px" }}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {photoSizes[photoSize].name} · {photoSizes[photoSize].pixels.width}x{photoSizes[photoSize].pixels.height}px
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Passport photo will appear here</p>
                </div>
              )}
            </div>

            {processedImage && (
              <Button onClick={downloadPhoto} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PassportPhotoMaker;
