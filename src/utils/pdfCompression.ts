
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from './fileUtils';

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface CompressionSettings {
  imageQuality: number;
  pageScale: number;
  removeMetadata: boolean;
  useObjectStreams: boolean;
  maxImageDimension: number;
  jpegQuality: number;
}

const getCompressionSettings = (level: CompressionLevel): CompressionSettings => {
  switch (level) {
    case "low":
      return {
        imageQuality: 0.85,
        pageScale: 0.98,
        removeMetadata: true,
        useObjectStreams: true,
        maxImageDimension: 1800,
        jpegQuality: 85
      };
    case "medium":
      return {
        imageQuality: 0.70,
        pageScale: 0.92,
        removeMetadata: true,
        useObjectStreams: true,
        maxImageDimension: 1400,
        jpegQuality: 70
      };
    case "high":
      return {
        imageQuality: 0.55,
        pageScale: 0.85,
        removeMetadata: true,
        useObjectStreams: true,
        maxImageDimension: 1000,
        jpegQuality: 55
      };
    case "maximum":
      return {
        imageQuality: 0.35,
        pageScale: 0.75,
        removeMetadata: true,
        useObjectStreams: true,
        maxImageDimension: 800,
        jpegQuality: 35
      };
    default:
      return getCompressionSettings("medium");
  }
};

const cleanupMetadata = (doc: PDFDocument): void => {
  try {
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('PDF Compressor');
    doc.setCreator('PDF Compressor');
    
    const now = new Date();
    doc.setCreationDate(now);
    doc.setModificationDate(now);
  } catch (error) {
    console.log('Could not clean metadata:', error);
  }
};

const compressPagesContent = async (doc: PDFDocument, settings: CompressionSettings): Promise<void> => {
  const pages = doc.getPages();
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    
    try {
      // Scale down the page if compression level requires it
      if (settings.pageScale < 1.0) {
        const { width, height } = page.getSize();
        const newWidth = width * settings.pageScale;
        const newHeight = height * settings.pageScale;
        
        page.scale(settings.pageScale, settings.pageScale);
        page.setSize(newWidth, newHeight);
      }
      
      console.log(`Compressed page ${i + 1}/${pages.length}`);
    } catch (error) {
      console.log(`Could not compress page ${i + 1}:`, error);
    }
  }
};

const applyAggressiveCompression = async (
  originalDoc: PDFDocument, 
  settings: CompressionSettings
): Promise<Uint8Array> => {
  // Create a new document for aggressive compression
  const newDoc = await PDFDocument.create();
  
  // Copy all pages from original to new document
  const pageCount = originalDoc.getPageCount();
  const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
  const copiedPages = await newDoc.copyPages(originalDoc, pageIndices);
  
  // Add pages to new document
  copiedPages.forEach(page => newDoc.addPage(page));
  
  // Apply compression to pages
  await compressPagesContent(newDoc, settings);
  
  // Clean metadata if required
  if (settings.removeMetadata) {
    cleanupMetadata(newDoc);
  }
  
  // Save with maximum compression options
  return await newDoc.save({
    useObjectStreams: settings.useObjectStreams,
    addDefaultPage: false,
    updateFieldAppearances: false,
    compress: true
  });
};

export const compressPdfFile = async (
  file: File, 
  compressionLevel: CompressionLevel = "medium"
): Promise<Blob> => {
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
    
    // Apply compression based on selected level
    const compressedBytes = await applyAggressiveCompression(originalDoc, settings);
    
    console.log(`Compression complete: ${formatFileSize(compressedBytes.length)}`);
    
    const compressionRatio = Math.round((compressedBytes.length / file.size) * 100);
    const spaceSaved = Math.round(((file.size - compressedBytes.length) / file.size) * 100);
    
    console.log(`Compression ratio: ${compressionRatio}%`);
    console.log(`Space saved: ${spaceSaved}%`);
    
    // Only return compressed version if it's actually smaller
    if (compressedBytes.length < file.size) {
      return new Blob([compressedBytes], { type: 'application/pdf' });
    } else {
      console.log('Compression did not reduce file size significantly');
      
      // Try more aggressive compression for stubborn files
      const aggressiveSettings = getCompressionSettings("maximum");
      const moreCompressedBytes = await applyAggressiveCompression(originalDoc, aggressiveSettings);
      
      if (moreCompressedBytes.length < file.size) {
        console.log(`Aggressive compression worked: ${formatFileSize(moreCompressedBytes.length)}`);
        return new Blob([moreCompressedBytes], { type: 'application/pdf' });
      }
      
      // If still no compression, return original but warn user
      console.log('File could not be compressed effectively');
      return new Blob([arrayBuffer], { type: 'application/pdf' });
    }
    
  } catch (error) {
    console.error('PDF compression failed:', error);
    
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
      return { min: 5, max: 15 };
    case "medium":
      return { min: 15, max: 30 };
    case "high":
      return { min: 25, max: 45 };
    case "maximum":
      return { min: 35, max: 60 };
    default:
      return { min: 15, max: 30 };
  }
};
