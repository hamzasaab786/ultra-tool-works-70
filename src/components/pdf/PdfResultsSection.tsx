
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
        <Download className="h-5 w-5" />
        Compression Complete
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-gray-700">Original Size</p>
            <p className="text-lg font-bold text-blue-600">{formatFileSize(originalSize)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-gray-700">Compressed Size</p>
            <p className="text-lg font-bold text-green-600">{formatFileSize(compressedSize)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-gray-700">Space Saved</p>
            <p className="text-lg font-bold text-purple-600">
              {savedSpace.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={onDownload} 
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-5 w-5" /> 
            Download Compressed PDF
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline"
            className="px-6"
          >
            Compress Another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfResultsSection;
