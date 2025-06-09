
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, CheckCircle } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";
import { calculateSavedSpace } from "@/utils/pdfCompression";

interface PdfResultsSectionProps {
  originalSize: number;
  compressedSize: number;
  selectedPdf: File;
  onDownload: () => void;
  onReset: () => void;
}

const PdfResultsSection: React.FC<PdfResultsSectionProps> = ({
  originalSize,
  compressedSize,
  selectedPdf,
  onDownload,
  onReset
}) => {
  const savedSpace = calculateSavedSpace(originalSize, compressedSize);
  const compressionRatio = ((originalSize - compressedSize) / originalSize * 100);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle className="h-6 w-6" />
          <h3 className="text-xl font-semibold">Compression Complete!</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Original Size</p>
            <p className="text-xl font-bold text-blue-600">{formatFileSize(originalSize)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Compressed Size</p>
            <p className="text-xl font-bold text-green-600">{formatFileSize(compressedSize)}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Space Saved</p>
            <p className="text-xl font-bold text-purple-600">{savedSpace}%</p>
          </div>
        </div>
        
        {compressionRatio > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              You saved <span className="font-semibold text-green-600">{formatFileSize(originalSize - compressedSize)}</span> of storage space!
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onDownload} 
            className="flex-1 bg-green-600 hover:bg-green-700 h-12"
          >
            <Download className="mr-2 h-5 w-5" /> 
            Download Compressed PDF
          </Button>
          
          <Button 
            onClick={onReset} 
            variant="outline"
            className="sm:w-auto px-6 h-12"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Compress Another
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Compressed file: compressed_{selectedPdf.name}</p>
          <p>Quality preserved with optimized file size</p>
        </div>
      </div>
    </div>
  );
};

export default PdfResultsSection;
