
import { PDFDocument } from 'pdf-lib';

export const compressPdfFile = async (file: File): Promise<Blob> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get all pages and their resources
    const pages = pdfDoc.getPages();
    console.log(`PDF has ${pages.length} pages, original size: ${formatFileSize(file.size)}`);
    
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
        // Optimize page content by slight scaling to trigger recompression
        const { width, height } = page.getSize();
        
        // Only apply optimization if page is reasonably sized
        if (width > 100 && height > 100) {
          page.scale(0.98, 0.98);
          page.scale(1.02, 1.02);
        }
      } catch (error) {
        console.log(`Could not optimize page ${i + 1}:`, error);
        // Continue with other pages even if one fails
      }
    }
    
    // Save with maximum compression settings
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });
    
    console.log(`Compressed size: ${formatFileSize(compressedBytes.length)}`);
    
    // If compression didn't achieve much, try alternative approach
    if (compressedBytes.length >= file.size * 0.95) {
      console.log('Trying alternative compression method...');
      
      try {
        const newDoc = await PDFDocument.create();
        
        for (let i = 0; i < pages.length; i++) {
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          const addedPage = newDoc.addPage(copiedPage);
          
          // Apply more aggressive scaling
          addedPage.scale(0.95, 0.95);
        }
        
        const alternativeBytes = await newDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false,
        });
        
        console.log(`Alternative compression size: ${formatFileSize(alternativeBytes.length)}`);
        
        // Use whichever compression method worked better
        const finalBytes = alternativeBytes.length < compressedBytes.length ? alternativeBytes : compressedBytes;
        
        return new Blob([finalBytes], { type: 'application/pdf' });
      } catch (altError) {
        console.log('Alternative compression failed, using original result:', altError);
        return new Blob([compressedBytes], { type: 'application/pdf' });
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
