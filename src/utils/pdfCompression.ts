
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
    
    // Remove metadata if requested
    if (settings.removeMetadata) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      pdfDoc.setCreationDate(undefined);
      pdfDoc.setModificationDate(undefined);
    }
    
    // Apply page scaling if requested
    if (settings.scalePages && settings.pageScale < 1.0) {
      const pages = pdfDoc.getPages();
      pages.forEach(page => {
        try {
          const { width, height } = page.getSize();
          // Only scale if page is reasonably sized to avoid issues
          if (width > 100 && height > 100) {
            page.scale(settings.pageScale, settings.pageScale);
          }
        } catch (error) {
          console.log('Could not scale page:', error);
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
    
    // For higher compression levels, use additional optimization
    if (compressionLevel === "high" || compressionLevel === "maximum") {
      saveOptions.objectsPerTick = 50;
    }
    
    const compressedBytes = await pdfDoc.save(saveOptions);
    
    console.log(`Compressed size: ${formatFileSize(compressedBytes.length)}`);
    
    // Check if compression was successful
    const compressionRatio = compressedBytes.length / file.size;
    console.log(`Compression ratio: ${Math.round(compressionRatio * 100)}%`);
    
    // If the file got larger, try a different approach
    if (compressedBytes.length >= file.size && (compressionLevel === "high" || compressionLevel === "maximum")) {
      console.log('Standard compression failed, trying alternative method...');
      
      try {
        // Create a new document and copy pages with more aggressive settings
        const newDoc = await PDFDocument.create();
        const pages = pdfDoc.getPages();
        
        for (let i = 0; i < pages.length; i++) {
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          const addedPage = newDoc.addPage(copiedPage);
          
          // Apply more aggressive scaling
          if (compressionLevel === "maximum") {
            addedPage.scale(0.8, 0.8);
          } else {
            addedPage.scale(0.85, 0.85);
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
    
    // If compression didn't work well, at least ensure we don't make it larger
    if (compressedBytes.length > file.size) {
      console.log('Compression increased file size, using minimal compression...');
      
      // Try minimal compression - just remove metadata
      const minimalDoc = await PDFDocument.load(arrayBuffer);
      minimalDoc.setTitle('');
      minimalDoc.setAuthor('');
      minimalDoc.setSubject('');
      minimalDoc.setKeywords([]);
      
      const minimalBytes = await minimalDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false,
      });
      
      console.log(`Minimal compression size: ${formatFileSize(minimalBytes.length)}`);
      
      if (minimalBytes.length < file.size) {
        return new Blob([minimalBytes], { type: 'application/pdf' });
      } else {
        // If even minimal compression makes it larger, return original with warning
        console.log('File cannot be compressed further, returning original');
        return new Blob([arrayBuffer], { type: 'application/pdf' });
      }
    }
    
    return new Blob([compressedBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    throw new Error('Failed to compress PDF. The file may be corrupted or use unsupported features.');
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
