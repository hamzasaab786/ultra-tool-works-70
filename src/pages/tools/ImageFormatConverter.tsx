
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, X, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

interface ConvertedImage {
  originalSize: number;
  convertedSize: number;
  originalUrl: string;
  convertedUrl: string;
  originalFormat: string;
  targetFormat: string;
  name: string;
}

const supportedFormats = [
  { value: "jpeg", label: "JPG/JPEG", mimeType: "image/jpeg", extension: "jpg" },
  { value: "png", label: "PNG", mimeType: "image/png", extension: "png" },
  { value: "webp", label: "WebP", mimeType: "image/webp", extension: "webp" },
  { value: "bmp", label: "BMP", mimeType: "image/bmp", extension: "bmp" },
  { value: "gif", label: "GIF", mimeType: "image/gif", extension: "gif" },
  { value: "tiff", label: "TIFF", mimeType: "image/tiff", extension: "tiff" },
  { value: "ico", label: "ICO", mimeType: "image/x-icon", extension: "ico" },
  { value: "avif", label: "AVIF", mimeType: "image/avif", extension: "avif" },
  { value: "svg", label: "SVG", mimeType: "image/svg+xml", extension: "svg" },
];

const ImageFormatConverter = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("jpeg");
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(90);
  const [icoSize, setIcoSize] = useState(64);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getImageFormat = (file: File): string => {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG';
    if (type.includes('png')) return 'PNG';
    if (type.includes('webp')) return 'WebP';
    if (type.includes('bmp')) return 'BMP';
    if (type.includes('gif')) return 'GIF';
    if (type.includes('tiff')) return 'TIFF';
    if (type.includes('icon') || type.includes('ico')) return 'ICO';
    if (type.includes('avif')) return 'AVIF';
    if (type.includes('svg')) return 'SVG';
    if (type.includes('heic') || type.includes('heif')) return 'HEIC';
    const ext = file.name.split('.').pop()?.toUpperCase() || 'Unknown';
    return ext;
  };

  const createIcoBlob = (canvas: HTMLCanvasElement, size: number): Blob => {
    // Resize to ICO size
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = size;
    icoCanvas.height = size;
    const ctx = icoCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // ICO file format
    const headerSize = 6;
    const dirEntrySize = 16;
    const bmpHeaderSize = 40;
    const pixelDataSize = size * size * 4;
    const maskSize = Math.ceil(size / 32) * 4 * size;
    const dataSize = bmpHeaderSize + pixelDataSize + maskSize;
    const fileSize = headerSize + dirEntrySize + dataSize;

    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // ICONDIR header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type: 1 = ICO
    view.setUint16(4, 1, true); // Count: 1 image

    // ICONDIRENTRY
    view.setUint8(6, size >= 256 ? 0 : size); // Width
    view.setUint8(7, size >= 256 ? 0 : size); // Height
    view.setUint8(8, 0); // Color palette
    view.setUint8(9, 0); // Reserved
    view.setUint16(10, 1, true); // Color planes
    view.setUint16(12, 32, true); // Bits per pixel
    view.setUint32(14, dataSize, true); // Data size
    view.setUint32(18, headerSize + dirEntrySize, true); // Data offset

    // BMP Info Header
    const offset = headerSize + dirEntrySize;
    view.setUint32(offset, bmpHeaderSize, true); // Header size
    view.setInt32(offset + 4, size, true); // Width
    view.setInt32(offset + 8, size * 2, true); // Height (doubled for ICO)
    view.setUint16(offset + 12, 1, true); // Planes
    view.setUint16(offset + 14, 32, true); // Bits per pixel
    view.setUint32(offset + 16, 0, true); // Compression
    view.setUint32(offset + 20, pixelDataSize + maskSize, true);

    // Pixel data (bottom-up, BGRA)
    const pixelOffset = offset + bmpHeaderSize;
    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const srcIdx = (y * size + x) * 4;
        const dstIdx = pixelOffset + ((size - 1 - y) * size + x) * 4;
        view.setUint8(dstIdx, pixels[srcIdx + 2]); // B
        view.setUint8(dstIdx + 1, pixels[srcIdx + 1]); // G
        view.setUint8(dstIdx + 2, pixels[srcIdx]); // R
        view.setUint8(dstIdx + 3, pixels[srcIdx + 3]); // A
      }
    }

    return new Blob([buffer], { type: 'image/x-icon' });
  };

  const convertToSvg = (canvas: HTMLCanvasElement): Blob => {
    const dataUrl = canvas.toDataURL('image/png');
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataUrl}"/>
</svg>`;
    return new Blob([svgContent], { type: 'image/svg+xml' });
  };

  const convertImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && !file.name.match(/\.(heic|heif|tiff|tif|ico|avif)$/i)) {
      toast({ title: "Error", description: "Selected file is not a valid image.", variant: "destructive" });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "Error", description: "Image exceeds 100MB limit.", variant: "destructive" });
      return;
    }

    const originalFormat = getImageFormat(file);
    const targetFormatData = supportedFormats.find(f => f.value === targetFormat);

    if (!targetFormatData) {
      toast({ title: "Error", description: "Invalid target format selected.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const originalUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      setProgress(30);
      const img = new Image();

      img.onload = () => {
        setProgress(50);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast({ title: "Error", description: "Could not initialize canvas context.", variant: "destructive" });
          setIsProcessing(false);
          return;
        }

        // White background for formats without transparency
        if (['jpeg', 'bmp', 'ico', 'tiff'].includes(targetFormat)) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        setProgress(80);

        let blob: Blob | null = null;

        const finalize = (resultBlob: Blob) => {
          setProgress(100);
          const convertedUrl = URL.createObjectURL(resultBlob);
          const originalName = file.name.split('.').slice(0, -1).join('.') || 'converted_image';
          const convertedName = `${originalName}.${targetFormatData.extension}`;

          setConvertedImage({
            originalSize: file.size,
            convertedSize: resultBlob.size,
            originalUrl,
            convertedUrl,
            originalFormat,
            targetFormat: targetFormatData.label,
            name: convertedName
          });

          setTimeout(() => {
            setIsProcessing(false);
            toast({ title: "Success", description: `Image converted to ${targetFormatData.label} successfully!` });
          }, 300);
        };

        // Handle special formats
        if (targetFormat === 'ico') {
          blob = createIcoBlob(canvas, icoSize);
          finalize(blob);
          return;
        }

        if (targetFormat === 'svg') {
          blob = convertToSvg(canvas);
          finalize(blob);
          return;
        }

        // Standard canvas-supported formats
        const qualityVal = quality / 100;
        const useQuality = ['jpeg', 'webp', 'avif'].includes(targetFormat);

        canvas.toBlob((resultBlob) => {
          if (resultBlob) {
            finalize(resultBlob);
          } else {
            // Fallback: try PNG then convert
            canvas.toBlob((pngBlob) => {
              if (pngBlob) {
                finalize(pngBlob);
                toast({ title: "Note", description: `Your browser may not fully support ${targetFormatData.label}. Exported as PNG fallback.` });
              } else {
                toast({ title: "Error", description: "Conversion failed. Try a different format.", variant: "destructive" });
                setIsProcessing(false);
              }
            }, 'image/png');
          }
        }, targetFormatData.mimeType, useQuality ? qualityVal : undefined);
      };

      img.onerror = () => {
        toast({ title: "Error", description: "Failed to load image. File may be corrupted or unsupported.", variant: "destructive" });
        setIsProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  }, [targetFormat, quality, icoSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      convertImage(e.dataTransfer.files[0]);
    }
  }, [convertImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      convertImage(e.target.files[0]);
    }
  }, [convertImage]);

  const downloadConvertedImage = useCallback(() => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.href = convertedImage.convertedUrl;
    link.download = convertedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Converted image downloaded!" });
  }, [convertedImage]);

  const resetConverter = useCallback(() => {
    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.originalUrl);
      URL.revokeObjectURL(convertedImage.convertedUrl);
      setConvertedImage(null);
    }
  }, [convertedImage]);

  const showQualitySlider = ['jpeg', 'webp', 'avif'].includes(targetFormat);
  const showIcoSize = targetFormat === 'ico';

  return (
    <>
      <SEO
        title="Image Format Converter - Convert PNG, JPG, WebP, TIFF, ICO, AVIF, SVG, GIF, BMP Online Free"
        description="Convert images between all formats online for free. JPG, PNG, WebP, BMP, GIF, TIFF, ICO, AVIF, SVG conversions with quality control."
        keywords="image format converter, convert png to jpg, jpg to png, webp converter, tiff converter, ico converter, avif converter, svg converter"
        canonicalUrl="https://toolifyconvert.com/tools/image-format-converter"
      />

      <ToolPageTemplate
        title="Image Format Converter"
        description="Convert images between all formats — JPG, PNG, WebP, BMP, GIF, TIFF, ICO, AVIF, SVG"
      >
        {!convertedImage ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format-select">Target Format</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target format" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showQualitySlider && (
                <div className="space-y-2">
                  <Label>Quality: {quality}%</Label>
                  <Slider
                    value={[quality]}
                    onValueChange={(v) => setQuality(v[0])}
                    min={10}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              {showIcoSize && (
                <div className="space-y-2">
                  <Label>ICO Size</Label>
                  <Select value={String(icoSize)} onValueChange={(v) => setIcoSize(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[16, 32, 48, 64, 128, 256].map(s => (
                        <SelectItem key={s} value={String(s)}>{s}x{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 bg-muted/30 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP, BMP, GIF, TIFF, ICO, AVIF, SVG (MAX 100MB)
              </p>
              <input
                type="file"
                id="file-upload-converter"
                className="hidden"
                accept="image/*,.ico,.tiff,.tif,.avif,.svg,.heic,.heif"
                onChange={handleFileSelect}
              />
              <Label htmlFor="file-upload-converter" className="mt-4">
                <Button asChild>
                  <span><Upload className="mr-2 h-4 w-4" /> Select Image</span>
                </Button>
              </Label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Conversion Results</h3>
              <Button variant="ghost" size="sm" onClick={resetConverter}>
                <RefreshCw className="mr-2 h-4 w-4" /> Convert Another
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-2 text-sm">Original ({convertedImage.originalFormat})</h4>
                <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                  <img src={convertedImage.originalUrl} alt="Original" className="absolute w-full h-full object-contain" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Size: {formatBytes(convertedImage.originalSize)}</p>
              </div>

              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-2 text-sm">Converted ({convertedImage.targetFormat})</h4>
                <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                  <img src={convertedImage.convertedUrl} alt="Converted" className="absolute w-full h-full object-contain" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Size: {formatBytes(convertedImage.convertedSize)}</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg text-sm space-y-1">
              <p><strong>Format:</strong> {convertedImage.originalFormat} → {convertedImage.targetFormat}</p>
              <p><strong>Original:</strong> {formatBytes(convertedImage.originalSize)}</p>
              <p><strong>Converted:</strong> {formatBytes(convertedImage.convertedSize)}</p>
              <p><strong>Savings:</strong> {convertedImage.convertedSize < convertedImage.originalSize
                ? `${((1 - convertedImage.convertedSize / convertedImage.originalSize) * 100).toFixed(1)}% smaller`
                : `${((convertedImage.convertedSize / convertedImage.originalSize - 1) * 100).toFixed(1)}% larger`}</p>
            </div>

            <Button className="w-full" onClick={downloadConvertedImage}>
              <Download className="mr-2 h-4 w-4" /> Download {convertedImage.targetFormat}
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Converting image...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </ToolPageTemplate>
    </>
  );
};

export default ImageFormatConverter;
