
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from './fileUtils';

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface CompressionSettings {
  imageQuality: number;
  removeMetadata: boolean;
  optimizeImages: boolean;
  scalePages: boolean;
  pageScale: number;
}

const getCompressionSettings = (level: CompressionLevel): CompressionSettings => {
  switch (level) {
    case "low":
      return {
        imageQuality: 0.9,
        removeMetadata: true,
        optimizeImages: false,
        scalePages: false,
        pageScale: 1.0
      };
    case "medium":
      return {
        imageQuality: 0.8,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.95
      };
    case "high":
      return {
        imageQuality: 0.7,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.9
      };
    case "maximum":
      return {
        imageQuality: 0.5,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.85
      };
    default:
      return getCompressionSettings("medium");
  }
};

export const compressPdfFile = async (file: File, compressionLevel: CompressionLevel = "medium"): Promise<Blob> => {
  try {
    const settings = getCompressionSettings(compressionLevel);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    console.log(`PDF has ${pdfDoc.getPageCount()} pages, original size: ${formatFileSize(file.size)}`);
    console.log(`Using ${compressionLevel} compression level`);
    
    // Remove metadata if requested - but only set values that exist
    if (settings.removeMetadata) {
      try {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        // Only set dates if they don't cause errors
        const currentDate = new Date();
        pdfDoc.setCreationDate(currentDate);
        pdfDoc.setModificationDate(currentDate);
      } catch (metadataError) {
        console.log('Could not remove some metadata:', metadataError);
        // Continue anyway
      }
    }
    
    // Apply page scaling if requested
    if (settings.scalePages && settings.pageScale < 1.0) {
      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        try {
          const { width, height } = page.getSize();
          // Only scale if page is reasonably sized to avoid issues
          if (width > 100 && height > 100) {
            page.scale(settings.pageScale, settings.pageScale);
            console.log(`Scaled page ${index + 1} by factor ${settings.pageScale}`);
          }
        } catch (error) {
          console.log(`Could not scale page ${index + 1}:`, error);
          // Continue with other pages
        }
      });
    }
    
    // Save with optimized settings
    const saveOptions: any = {
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    };
    
    const compressedBytes = await pdfDoc.save(saveOptions);
    
    console.log(`Compressed size: ${formatFileSize(compressedBytes.length)}`);
    console.log(`Compression ratio: ${Math.round((compressedBytes.length / file.size) * 100)}%`);
    
    // If compression didn't reduce size significantly, try alternative approach
    if (compressedBytes.length >= file.size * 0.95) {
      console.log('Standard compression minimal, trying alternative method...');
      
      try {
        // Create a new document and copy pages with more aggressive settings
        const newDoc = await PDFDocument.create();
        const originalDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = originalDoc.getPageCount();
        
        // Copy pages one by one with scaling
        for (let i = 0; i < pageCount; i++) {
          const [copiedPage] = await newDoc.copyPages(originalDoc, [i]);
          const addedPage = newDoc.addPage(copiedPage);
          
          // Apply more aggressive scaling for higher compression
          const scaleFactor = compressionLevel === "maximum" ? 0.8 : 
                            compressionLevel === "high" ? 0.85 : 0.9;
          
          try {
            addedPage.scale(scaleFactor, scaleFactor);
          } catch (scaleError) {
            console.log(`Could not scale page ${i + 1} in alternative method:`, scaleError);
          }
        }
        
        const alternativeBytes = await newDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
        });
        
        console.log(`Alternative compression size: ${formatFileSize(alternativeBytes.length)}`);
        
        // Use the better result
        if (alternativeBytes.length < compressedBytes.length) {
          return new Blob([alternativeBytes], { type: 'application/pdf' });
        }
      } catch (altError) {
        console.log('Alternative compression failed:', altError);
      }
    }
    
    // Always return the compressed version, even if it's not much smaller
    return new Blob([compressedBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const calculateSavedSpace = (originalSize: number, compressedSize: number): number => {
  if (compressedSize >= originalSize) return 0;
  return Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100 * 10) / 10);
};

export const getExpectedCompressionRatio = (level: CompressionLevel): { min: number; max: number } => {
  switch (level) {
    case "low":
      return { min: 5, max: 15 };
    case "medium":
      return { min: 10, max: 30 };
    case "high":
      return { min: 20, max: 50 };
    case "maximum":
      return { min: 30, max: 70 };
    default:
      return { min: 10, max: 30 };
  }
};
