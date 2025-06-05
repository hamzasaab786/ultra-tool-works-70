
import { PDFDocument } from 'pdf-lib';

export const compressPdfFile = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Basic compression by removing unused objects and optimizing
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });
  
  return new Blob([compressedBytes], { 
    type: 'application/pdf' 
  });
};

export const calculateSavedSpace = (originalSize: number, compressedSize: number): number => {
  return Math.max(0, ((originalSize - compressedSize) / originalSize) * 100);
};
