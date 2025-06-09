
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from './fileUtils';

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface CompressionSettings {
  imageQuality: number;
  scaleFactors: {
    first: number;
    second: number;
  };
  aggressiveScale: number;
  useObjectStreams: boolean;
}

const getCompressionSettings = (level: CompressionLevel): CompressionSettings => {
  switch (level) {
    case "low":
      return {
        imageQuality: 0.9,
        scaleFactors: { first: 0.99, second: 1.01 },
        aggressiveScale: 0.98,
        useObjectStreams: true
      };
    case "medium":
      return {
        imageQuality: 0.8,
        scaleFactors: { first: 0.98, second: 1.02 },
        aggressiveScale: 0.95,
        useObjectStreams: true
      };
    case "high":
      return {
        imageQuality: 0.7,
        scaleFactors: { first: 0.96, second: 1.04 },
        aggressiveScale: 0.92,
        useObjectStreams: true
      };
    case "maximum":
      return {
        imageQuality: 0.5,
        scaleFactors: { first: 0.94, second: 1.06 },
        aggressiveScale: 0.88,
        useObjectStreams: true
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
    
    // Get all pages and their resources
    const pages = pdfDoc.getPages();
    console.log(`PDF has ${pages.length} pages, original size: ${formatFileSize(file.size)}`);
    console.log(`Using ${compressionLevel} compression level`);
    
    // Remove metadata to reduce size
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('ToolifyConvert');
    pdfDoc.setCreator('ToolifyConvert');
    
    // Process each page for compression
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      try {
        // Apply compression based on level
        const { width, height } = page.getSize();
        
        // Only apply optimization if page is reasonably sized
        if (width > 100 && height > 100) {
          page.scale(settings.scaleFactors.first, settings.scaleFactors.first);
          page.scale(settings.scaleFactors.second, settings.scaleFactors.second);
        }
      } catch (error) {
        console.log(`Could not optimize page ${i + 1}:`, error);
        // Continue with other pages even if one fails
      }
    }
    
    // Save with compression settings based on level
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: settings.useObjectStreams,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });
    
    console.log(`Compressed size: ${formatFileSize(compressedBytes.length)}`);
    
    // Apply more aggressive compression for higher levels if needed
    if (compressionLevel === "high" || compressionLevel === "maximum") {
      const compressionRatio = compressedBytes.length / file.size;
      
      if (compressionRatio > 0.7) {
        console.log('Applying more aggressive compression...');
        
        try {
          const newDoc = await PDFDocument.create();
          
          for (let i = 0; i < pages.length; i++) {
            const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
            const addedPage = newDoc.addPage(copiedPage);
            
            // Apply more aggressive scaling based on compression level
            addedPage.scale(settings.aggressiveScale, settings.aggressiveScale);
          }
          
          const alternativeBytes = await newDoc.save({
            useObjectStreams: settings.useObjectStreams,
            addDefaultPage: false,
            updateFieldAppearances: false,
          });
          
          console.log(`Aggressive compression size: ${formatFileSize(alternativeBytes.length)}`);
          
          // Use whichever compression method worked better
          const finalBytes = alternativeBytes.length < compressedBytes.length ? alternativeBytes : compressedBytes;
          
          return new Blob([finalBytes], { type: 'application/pdf' });
        } catch (altError) {
          console.log('Aggressive compression failed, using standard result:', altError);
          return new Blob([compressedBytes], { type: 'application/pdf' });
        }
      }
    }
    
    return new Blob([compressedBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    throw new Error('Failed to compress PDF. The file may be corrupted or use unsupported features.');
  }
};

export const calculateSavedSpace = (originalSize: number, compressedSize: number): number => {
  return Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100 * 10) / 10);
};

export const getExpectedCompressionRatio = (level: CompressionLevel): { min: number; max: number } => {
  switch (level) {
    case "low":
      return { min: 5, max: 15 };
    case "medium":
      return { min: 15, max: 35 };
    case "high":
      return { min: 30, max: 55 };
    case "maximum":
      return { min: 45, max: 75 };
    default:
      return { min: 15, max: 35 };
  }
};
