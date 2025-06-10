
import { PDFDocument, PDFPage, PDFImage } from 'pdf-lib';
import { formatFileSize } from './fileUtils';

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface CompressionSettings {
  imageQuality: number;
  removeMetadata: boolean;
  optimizeImages: boolean;
  scalePages: boolean;
  pageScale: number;
  compressStreams: boolean;
  removeAnnotations: boolean;
  flattenTransparency: boolean;
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
        compressStreams: true,
        removeAnnotations: false,
        flattenTransparency: false
      };
    case "medium":
      return {
        imageQuality: 0.75,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.95,
        compressStreams: true,
        removeAnnotations: true,
        flattenTransparency: false
      };
    case "high":
      return {
        imageQuality: 0.6,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.85,
        compressStreams: true,
        removeAnnotations: true,
        flattenTransparency: true
      };
    case "maximum":
      return {
        imageQuality: 0.4,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.75,
        compressStreams: true,
        removeAnnotations: true,
        flattenTransparency: true
      };
    default:
      return getCompressionSettings("medium");
  }
};

const removeUnnecessaryObjects = async (doc: PDFDocument, settings: CompressionSettings): Promise<void> => {
  try {
    // Remove metadata
    if (settings.removeMetadata) {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('Compressed PDF');
      doc.setCreator('PDF Compressor');
      const minDate = new Date('2000-01-01');
      doc.setCreationDate(minDate);
      doc.setModificationDate(minDate);
    }
  } catch (error) {
    console.log('Could not remove metadata:', error);
  }
};

const compressPage = async (page: PDFPage, settings: CompressionSettings): Promise<void> => {
  try {
    // Scale page if required
    if (settings.scalePages && settings.pageScale < 1.0) {
      const { width, height } = page.getSize();
      page.scale(settings.pageScale, settings.pageScale);
      page.setSize(width * settings.pageScale, height * settings.pageScale);
    }
  } catch (error) {
    console.log('Could not compress page:', error);
  }
};

const createOptimizedDocument = async (
  originalDoc: PDFDocument, 
  settings: CompressionSettings
): Promise<PDFDocument> => {
  const newDoc = await PDFDocument.create();
  const pageCount = originalDoc.getPageCount();
  
  console.log(`Creating optimized document with ${pageCount} pages`);
  
  // Copy pages with compression
  const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
  const copiedPages = await newDoc.copyPages(originalDoc, pageIndices);
  
  for (let i = 0; i < copiedPages.length; i++) {
    const page = newDoc.addPage(copiedPages[i]);
    await compressPage(page, settings);
    console.log(`Processed page ${i + 1}/${pageCount}`);
  }
  
  // Remove unnecessary objects
  await removeUnnecessaryObjects(newDoc, settings);
  
  return newDoc;
};

export const compressPdfFile = async (file: File, compressionLevel: CompressionLevel = "medium"): Promise<Blob> => {
  console.log(`Starting PDF compression with ${compressionLevel} level`);
  console.log(`Original file size: ${formatFileSize(file.size)}`);
  
  try {
    const settings = getCompressionSettings(compressionLevel);
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the original document
    const originalDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
      capNumbers: false,
      throwOnInvalidObject: false
    });
    
    console.log(`PDF loaded successfully, ${originalDoc.getPageCount()} pages found`);
    
    // Create multiple compression attempts with increasing aggressiveness
    const compressionAttempts = [];
    
    // Attempt 1: Standard compression
    try {
      const standardDoc = await createOptimizedDocument(originalDoc, settings);
      const standardBytes = await standardDoc.save({
        useObjectStreams: settings.compressStreams,
        addDefaultPage: false,
        updateFieldAppearances: false
      });
      compressionAttempts.push({
        name: 'standard',
        bytes: standardBytes,
        size: standardBytes.length
      });
      console.log(`Standard compression: ${formatFileSize(standardBytes.length)}`);
    } catch (error) {
      console.log('Standard compression failed:', error);
    }
    
    // Attempt 2: Aggressive compression (if not already maximum level)
    if (compressionLevel !== "maximum") {
      try {
        const aggressiveSettings = getCompressionSettings("maximum");
        const aggressiveDoc = await createOptimizedDocument(originalDoc, aggressiveSettings);
        const aggressiveBytes = await aggressiveDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false
        });
        compressionAttempts.push({
          name: 'aggressive',
          bytes: aggressiveBytes,
          size: aggressiveBytes.length
        });
        console.log(`Aggressive compression: ${formatFileSize(aggressiveBytes.length)}`);
      } catch (error) {
        console.log('Aggressive compression failed:', error);
      }
    }
    
    // Attempt 3: Minimal quality compression for maximum size reduction
    try {
      const minimalSettings: CompressionSettings = {
        imageQuality: 0.3,
        removeMetadata: true,
        optimizeImages: true,
        scalePages: true,
        pageScale: 0.7,
        compressStreams: true,
        removeAnnotations: true,
        flattenTransparency: true
      };
      
      const minimalDoc = await createOptimizedDocument(originalDoc, minimalSettings);
      const minimalBytes = await minimalDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });
      compressionAttempts.push({
        name: 'minimal',
        bytes: minimalBytes,
        size: minimalBytes.length
      });
      console.log(`Minimal quality compression: ${formatFileSize(minimalBytes.length)}`);
    } catch (error) {
      console.log('Minimal compression failed:', error);
    }
    
    // Select the best compression result
    if (compressionAttempts.length === 0) {
      console.log('All compression attempts failed, returning original');
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    }
    
    // Sort by size and pick the smallest
    compressionAttempts.sort((a, b) => a.size - b.size);
    const bestResult = compressionAttempts[0];
    
    console.log(`Best compression: ${bestResult.name} - ${formatFileSize(bestResult.size)}`);
    
    const compressionRatio = Math.round((bestResult.size / file.size) * 100);
    const spaceSaved = Math.round(((file.size - bestResult.size) / file.size) * 100);
    
    console.log(`Final compression ratio: ${compressionRatio}%`);
    console.log(`Space saved: ${spaceSaved}%`);
    
    // Only return compressed version if it's actually smaller
    if (bestResult.size < file.size) {
      return new Blob([bestResult.bytes], { type: 'application/pdf' });
    } else {
      console.log('Compression did not reduce file size, returning original');
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    }
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    
    // Return original file if compression completely fails
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
      return { min: 5, max: 20 };
    case "medium":
      return { min: 15, max: 35 };
    case "high":
      return { min: 25, max: 50 };
    case "maximum":
      return { min: 35, max: 65 };
    default:
      return { min: 15, max: 35 };
  }
};
