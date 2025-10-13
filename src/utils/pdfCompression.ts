import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// For Vite, using `?url` is the correct way to get asset URLs.
// This ensures the worker script is loaded correctly in the browser.
import workerSrc from 'pdfjs-dist/build/pdf.worker.js?url';

// Run this configuration only in the browser
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}

export interface CompressionSettings {
  level: 'low' | 'medium' | 'high' | 'maximum';
  removeMetadata: boolean;
  optimizeImages: boolean;
  flattenForms: boolean;
  removeUnusedObjects: boolean;
  imageQuality: number;
  downscaleImages: boolean;
  maxImageDimension: number;
}

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  optimizations: string[];
}

export class PDFCompressor {
  private settings: CompressionSettings;
  
  constructor(settings: CompressionSettings) {
    this.settings = settings;
  }

  async compressPDF(file: File): Promise<CompressionResult> {
    console.log('Starting PDF compression with new rasterization engine. Settings:', this.settings);
    
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = file.size;
    
    console.warn('Rasterization-based compression is active. Text and vector data will be converted to images to achieve high compression ratios.');
    
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
    const sourcePdf = await loadingTask.promise;
    
    const newPdfDoc = await PDFDocument.create();
    
    const optimizations: string[] = [];

    if (this.settings.removeMetadata) optimizations.push('Metadata removed');
    if (this.settings.flattenForms) optimizations.push('Forms flattened');
    if (this.settings.optimizeImages) optimizations.push(`Images re-compressed (Quality: ${this.settings.imageQuality}%)`);

    let downscaled = false;
    for (let i = 1; i <= sourcePdf.numPages; i++) {
        const page = await sourcePdf.getPage(i);
        
        const originalViewport = page.getViewport({ scale: 1 });
        let scale = 1.5; // Default DPI-like setting for good quality

        if (this.settings.downscaleImages) {
            const { maxImageDimension } = this.settings;
            if (originalViewport.width > maxImageDimension || originalViewport.height > maxImageDimension) {
                const widthScale = maxImageDimension / originalViewport.width;
                const heightScale = maxImageDimension / originalViewport.height;
                scale = Math.min(widthScale, heightScale);
                downscaled = true;
            }
        }
        
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { alpha: false }); // JPEG doesn't need alpha
        if (!context) throw new Error('Could not create canvas context');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Convert canvas to JPEG bytes
        const jpgDataUrl = canvas.toDataURL('image/jpeg', this.settings.imageQuality / 100);
        const jpgBytes = Uint8Array.from(atob(jpgDataUrl.split(',')[1]), c => c.charCodeAt(0));
        
        const jpgImage = await newPdfDoc.embedJpg(jpgBytes);
        
        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        });
    }

    if (downscaled) {
        optimizations.push(`Images downscaled to max ${this.settings.maxImageDimension}px`);
    }

    const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
    
    const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
    const compressedSize = blob.size;
    
    const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;
    
    console.log('Compression complete:', {
      originalSize,
      compressedSize,
      compressionRatio: compressionRatio.toFixed(1) + '%',
    });

    return {
      blob,
      originalSize,
      compressedSize,
      compressionRatio: Math.max(0, compressionRatio),
      optimizations,
    };
  }
}

// PDFAnalyzer class remains unchanged
export class PDFAnalyzer {
  static async analyzePDF(file: File): Promise<{
    pageCount: number;
    hasImages: boolean;
    hasForms: boolean;
    hasMetadata: boolean;
    estimatedCompression: number;
    fileSize: number;
    compressionPotential: string;
  }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pageCount = pdfDoc.getPageCount();
    const fileSize = file.size;
    
    // Check for forms
    let hasForms = false;
    try {
      const form = pdfDoc.getForm();
      hasForms = form.getFields().length > 0;
    } catch {
      hasForms = false;
    }
    
    // Check for metadata
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const hasMetadata = !!(title || author);
    
    // Enhanced compression estimation
    let estimatedCompression = 15; // Base compression from pdf-lib optimization
    
    if (hasForms) estimatedCompression += 20; // Forms can be flattened
    if (hasMetadata) estimatedCompression += 5; // Metadata removal
    if (pageCount > 10) estimatedCompression += 20; // More pages = more optimization potential
    if (fileSize > 10 * 1024 * 1024) estimatedCompression += 25; // Large files often have more waste
    
    // Estimate based on file size patterns
    if (fileSize > 50 * 1024 * 1024) estimatedCompression += 15; // Very large files
    
    const finalEstimate = Math.min(estimatedCompression, 90); // Cap at 90%
    
    let compressionPotential = 'Low';
    if (finalEstimate > 30) compressionPotential = 'Medium';
    if (finalEstimate > 50) compressionPotential = 'High';
    if (finalEstimate > 75) compressionPotential = 'Very High';
    
    return {
      pageCount,
      hasImages: true, // Assume images are present for safety
      hasForms,
      hasMetadata,
      estimatedCompression: finalEstimate,
      fileSize,
      compressionPotential
    };
  }
}
