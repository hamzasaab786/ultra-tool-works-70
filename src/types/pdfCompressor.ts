
export interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  status: 'pending' | 'analyzing' | 'processing' | 'completed' | 'error';
  error?: string;
  file?: File;
  analysis?: {
    pageCount: number;
    hasImages: boolean;
    hasForms: boolean;
    hasMetadata: boolean;
    estimatedCompression: number;
  };
  result?: {
    blob: Blob;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    optimizations: string[];
  };
}

export interface CompressionSummary {
  totalOriginal: number;
  totalCompressed: number;
  totalSaved: number;
  avgCompression: number;
}
