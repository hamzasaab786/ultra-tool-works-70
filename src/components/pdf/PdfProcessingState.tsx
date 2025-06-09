
import React from "react";
import { FileText } from "lucide-react";

interface PdfProcessingStateProps {
  message?: string;
  progress?: number;
}

const PdfProcessingState: React.FC<PdfProcessingStateProps> = ({ 
  message = "Processing PDF...", 
  progress 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto">
          </div>
          <FileText className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
          <p className="text-gray-600 text-sm">Please wait while we optimize your PDF file</p>
          
          {typeof progress === 'number' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Your file is processed locally in your browser</p>
          <p>✓ No data is sent to external servers</p>
        </div>
      </div>
    </div>
  );
};

export default PdfProcessingState;
