
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface PdfUploadSectionProps {
  selectedPdf: File | null;
  originalSize: number;
  onFileSelect: (file: File) => void;
  onReset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const PdfUploadSection: React.FC<PdfUploadSectionProps> = ({
  selectedPdf,
  originalSize,
  onFileSelect,
  onReset,
  fileInputRef
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-600" />
        Upload PDF File
      </h3>
      
      {!selectedPdf ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Choose PDF file to compress
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Maximum file size: 100MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="mr-2 h-5 w-5" /> 
            Select PDF File
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-10 w-10 text-red-500" />
              <div>
                <p className="font-medium text-gray-800">{selectedPdf.name}</p>
                <p className="text-sm text-gray-600">
                  Original size: {formatFileSize(originalSize)}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onReset}
              size="sm"
            >
              Change File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploadSection;
