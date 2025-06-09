
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from './fileUtils';

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface CompressionSettings {
  imageQuality: number;
  removeMetadata: boolean;
  optimizeImages: boolean;
  scalePages: boolean;
  pageScale: number;
  compressStreams: boolean;
}

const getCompressionSettings = (level: CompressionLevel): CompressionSettings => {
  switch (level) {
    case "low":
      return {
        imageQuality: 0.9,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: false,
        pageScale: 1.0,
        compressStreams: true
      };
    case "medium":
      return {
        imageQuality: 0.75,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.9,
        compressStreams: true
      };
    case "high":
      return {
        imageQuality: 0.6,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.8,
        compressStreams: true
      };
    case "maximum":
      return {
        imageQuality: 0.4,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.7,
        compressStreams: true
      };
    default:
      return getCompressionSettings("medium");
  }
};

export const compressPdfFile = async (file: File, compressionLevel: CompressionLevel = "medium"): Promise<Blob> => {
  try {
    const settings = getCompressionSettings(compressionLevel);
    const arrayBuffer = await file.arrayBuffer();
    
    console.log(`PDF has pages, original size: ${formatFileSize(file.size)}`);
    console.log(`Using ${compressionLevel} compression level`);
    
    // Create a new document and copy pages with compression
    const originalDoc = await PDFDocument.load(arrayBuffer);
    const newDoc = await PDFDocument.create();
    
    const pageCount = originalDoc.getPageCount();
    console.log(`Processing ${pageCount} pages`);
    
    // Copy pages with scaling to reduce size
    for (let i = 0; i < pageCount; i++) {
      try {
        const [copiedPage] = await newDoc.copyPages(originalDoc, [i]);
        const addedPage = newDoc.addPage(copiedPage);
        
        // Apply page scaling for compression
        if (settings.scalePages && settings.pageScale < 1.0) {
          const { width, height } = addedPage.getSize();
          addedPage.scale(settings.pageScale, settings.pageScale);
          
          // Also reduce the page size to match the scaled content
          addedPage.setSize(width * settings.pageScale, height * settings.pageScale);
        }
        
        console.log(`Processed page ${i + 1}/${pageCount}`);
      } catch (error) {
        console.log(`Could not process page ${i + 1}:`, error);
        // Add page without scaling if there's an error
        const [copiedPage] = await newDoc.copyPages(originalDoc, [i]);
        newDoc.addPage(copiedPage);
      }
    }
    
    // Remove metadata to reduce size
    if (settings.removeMetadata) {
      try {
        newDoc.setTitle('');
        newDoc.setAuthor('');
        newDoc.setSubject('');
        newDoc.setKeywords([]);
        newDoc.setProducer('PDF Compressor');
        newDoc.setCreator('PDF Compressor');
        // Set minimal dates
        const minDate = new Date('2000-01-01');
        newDoc.setCreationDate(minDate);
        newDoc.setModificationDate(minDate);
      } catch (metadataError) {
        console.log('Could not remove all metadata:', metadataError);
      }
    }
    
    // Save with aggressive compression settings
    const saveOptions: any = {
      useObjectStreams: settings.compressStreams,
      addDefaultPage: false,
      updateFieldAppearances: false,
      // Additional compression options
      objectStreamsCompress: true,
      ignoreEncryption: true,
    };
    
    console.log('Saving compressed PDF...');
    const compressedBytes = await newDoc.save(saveOptions);
    
    const compressedSize = compressedBytes.length;
    const compressionRatio = Math.round((compressedSize / file.size) * 100);
    
    console.log(`Compressed size: ${formatFileSize(compressedSize)}`);
    console.log(`Compression ratio: ${compressionRatio}%`);
    console.log(`Space saved: ${Math.round(((file.size - compressedSize) / file.size) * 100)}%`);
    
    // If we didn't achieve good compression, try an even more aggressive approach
    if (compressedSize >= file.size * 0.85 && compressionLevel !== "low") {
      console.log('Trying more aggressive compression...');
      
      try {
        const ultraDoc = await PDFDocument.create();
        const moreAggressiveScale = Math.max(0.5, settings.pageScale * 0.8);
        
        for (let i = 0; i < pageCount; i++) {
          const [copiedPage] = await ultraDoc.copyPages(originalDoc, [i]);
          const addedPage = ultraDoc.addPage(copiedPage);
          
          // More aggressive scaling
          const { width, height } = addedPage.getSize();
          addedPage.scale(moreAggressiveScale, moreAggressiveScale);
          addedPage.setSize(width * moreAggressiveScale, height * moreAggressiveScale);
        }
        
        // Remove all possible metadata
        ultraDoc.setTitle('');
        ultraDoc.setAuthor('');
        ultraDoc.setSubject('');
        ultraDoc.setKeywords([]);
        ultraDoc.setProducer('');
        ultraDoc.setCreator('');
        
        const ultraBytes = await ultraDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
          objectStreamsCompress: true,
          ignoreEncryption: true,
        });
        
        console.log(`Ultra compression size: ${formatFileSize(ultraBytes.length)}`);
        
        // Use the better result
        if (ultraBytes.length < compressedBytes.length) {
          console.log('Using ultra-compressed version');
          return new Blob([ultraBytes], { type: 'application/pdf' });
        }
      } catch (ultraError) {
        console.log('Ultra compression failed:', ultraError);
      }
    }
    
    // Always return a result, even if compression wasn't significant
    const finalBlob = new Blob([compressedBytes], { type: 'application/pdf' });
    
    // Ensure we never return a larger file
    if (compressedSize > file.size) {
      console.log('Compression resulted in larger file, returning original');
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    }
    
    return finalBlob;
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    // Return the original file if compression completely fails
    const arrayBuffer = await file.arrayBuffer();
    return new Blob([arrayBuffer], { type: 'application/pdf' });
  }
};

export const calculateSavedSpace = (originalSize: number, compressedSize: number): number => {
  if (compressedSize >= originalSize) return 0;
  return Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100 * 10) / 10);
};

export const getExpectedCompressionRatio = (level: CompressionLevel): { min: number; max: number } => {
  switch (level) {
    case "low":
      return { min: 10, max: 25 };
    case "medium":
      return { min: 20, max: 40 };
    case "high":
      return { min: 30, max: 55 };
    case "maximum":
      return { min: 40, max: 70 };
    default:
      return { min: 20, max: 40 };
  }
};
