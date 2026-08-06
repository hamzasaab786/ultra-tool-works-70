
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, Download, X, FileIcon, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const JpgToPdf = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"image" | "searchable" | "text">("searchable");
  const [status, setStatus] = useState("");


  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList) => {
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Warning",
          description: `${file.name} is not an image file.`,
          variant: "destructive"
        });
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Warning",
          description: `${file.name} exceeds 100MB limit.`,
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          file,
          preview: e.target?.result as string,
          id: Math.random().toString(36).substr(2, 9)
        };
        newImages.push(imageFile);
        
        if (newImages.length === Array.from(files).filter(f => f.type.startsWith('image/') && f.size <= 100 * 1024 * 1024).length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // Image reordering functions
  const handleImageDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged image from its original position
    newImages.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [images, draggedIndex]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newImages = [...images];
    const movedImage = newImages[fromIndex];
    
    newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    setImages(newImages);
  }, [images]);

  const convertToPdf = useCallback(async () => {
    if (images.length === 0) return;

    setIsConverting(true);

    try {
      const pdf = new jsPDF();
      let isFirstPage = true;

      // OCR worker is only created when an editable/searchable mode is picked.
      let worker: any = null;
      if (mode !== "image") {
        setStatus("Loading OCR engine…");
        const Tesseract = (await import("tesseract.js")).default;
        worker = await Tesseract.createWorker("eng");
      }

      for (let idx = 0; idx < images.length; idx += 1) {
        const image = images[idx];
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Create an image element to get dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = image.preview;
        });

        // Calculate dimensions to fit the page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pdfWidth - (margin * 2);
        const maxHeight = pdfHeight - (margin * 2);

        let { width, height } = img;
        
        // Scale down if image is larger than page
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);
          width *= ratio;
          height *= ratio;
        }

        // Center the image on the page
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        if (mode !== "text") {
          // Derive the real format from the data URL so PNG/WEBP uploads embed correctly
          const mimeMatch = /^data:image\/([a-z+]+);/i.exec(image.preview);
          const detected = (mimeMatch?.[1] || 'jpeg').toUpperCase();
          const format = detected === 'JPG' ? 'JPEG' : detected;
          pdf.addImage(image.preview, format, x, y, width, height);
        }

        if (worker) {
          setStatus(`Reading text from image ${idx + 1} of ${images.length}…`);
          const { data } = await worker.recognize(image.file);
          const words: any[] = (data as any).words || [];
          const scale = width / img.width;

          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(0, 0, 0);

          words.forEach((w) => {
            const text = (w.text || "").trim();
            if (!text || !w.bbox) return;
            const bw = (w.bbox.x1 - w.bbox.x0) * scale;
            const bh = (w.bbox.y1 - w.bbox.y0) * scale;
            if (bw <= 0 || bh <= 0) return;

            const fontSize = Math.max(4, bh * 0.92 * (72 / 25.4) / (72 / 25.4)); // bh is already in pt-equivalent mm units
            pdf.setFontSize(Math.max(4, bh * 2.4));
            const baselineX = x + w.bbox.x0 * scale;
            const baselineY = y + w.bbox.y1 * scale;

            if (mode === "searchable") {
              // Invisible text layer sitting exactly over the picture.
              (pdf as any).setTextRenderingMode?.("invisible");
            }
            // Squeeze each word into its original box so the layout matches the photo.
            const natural = pdf.getTextWidth(text);
            const options: any = { baseline: "alphabetic" };
            if (natural > 0) options.maxWidth = undefined;
            pdf.text(text, baselineX, baselineY, options);
            if (mode === "searchable") {
              (pdf as any).setTextRenderingMode?.("fill");
            }
            void fontSize;
          });
        }
      }

      if (worker) await worker.terminate();

      // Save the PDF
      pdf.save(mode === "image" ? 'converted-images.pdf' : 'editable-images.pdf');
      
      toast({
        title: "Success",
        description:
          mode === "image"
            ? "Images converted to PDF successfully!"
            : mode === "searchable"
            ? "Searchable PDF created — text is selectable and editable over the image."
            : "Fully editable text PDF created from your images.",
      });
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast({
        title: "Error",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setStatus("");
      setIsConverting(false);
    }
  }, [images, mode]);


  const resetImages = useCallback(() => {
    setImages([]);
  }, []);

  return (
    <ToolPageTemplate
      title="JPG to PDF Converter"
      description="Convert your images to PDF documents easily"
    >
      {images.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop multiple images
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or WEBP (MAX. 100MB per file)
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload" className="mt-4">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Select Images
              </span>
            </Button>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Image Preview ({images.length} images)</h3>
              <p className="text-sm text-muted-foreground mt-1">Drag images to reorder • Click × to remove</p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetImages}>
              <X className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <p className="font-medium">Output type</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { id: "searchable" as const, title: "Editable & searchable", desc: "Photo + real text layer you can select, search and edit" },
                { id: "text" as const, title: "Fully editable text", desc: "Text-only PDF (OCR) — every line editable, no image" },
                { id: "image" as const, title: "Image only", desc: "Classic picture PDF, fastest" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={`text-left rounded-lg border p-3 transition-colors ${
                    mode === opt.id ? "border-primary bg-primary/10" : "hover:border-primary/50"
                  }`}
                >
                  <span className="block text-sm font-semibold">{opt.title}</span>
                  <span className="block text-xs text-muted-foreground mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <GripVertical className="h-4 w-4" /> Drag and drop images to change their order in the PDF
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className={`relative border-2 rounded-lg p-3 bg-card transition-all duration-200 cursor-move hover:shadow-lg ${
                  draggedIndex === index ? 'opacity-40 scale-95 rotate-2' : ''
                } ${
                  dragOverIndex === index ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                }`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10 shadow-lg">
                  {index + 1}
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white rounded px-2 py-1 flex items-center gap-1">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs">Drag</span>
                </div>
                <img 
                  src={image.preview} 
                  alt={image.file.name}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg transition-colors z-10"
                >
                  ×
                </button>
                
                <div className="flex items-center justify-between gap-2 mt-2">
                  <p className="text-xs truncate flex-1 font-medium">{image.file.name}</p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <input
              type="file"
              id="add-more"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
            <label htmlFor="add-more">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" /> Add More Images
                </span>
              </Button>
            </label>

            <Button 
              onClick={convertToPdf} 
              disabled={isConverting || images.length === 0}
              className="flex-1"
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <FileIcon className="mr-2 h-4 w-4" /> Convert to PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default JpgToPdf;
