
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, Download, X, FileIcon } from "lucide-react";
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

  const convertToPdf = useCallback(async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    
    try {
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (const image of images) {
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

        pdf.addImage(image.preview, 'JPEG', x, y, width, height);
      }

      // Save the PDF
      pdf.save('converted-images.pdf');
      
      toast({
        title: "Success",
        description: "Images converted to PDF successfully!",
      });
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast({
        title: "Error",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  }, [images]);

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
            <h3 className="text-lg font-medium">Images to Convert ({images.length})</h3>
            <Button variant="ghost" size="sm" onClick={resetImages}>
              <X className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative border rounded-md p-2">
                <img 
                  src={image.preview} 
                  alt={image.file.name}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
                <p className="text-xs mt-1 truncate">{image.file.name}</p>
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
