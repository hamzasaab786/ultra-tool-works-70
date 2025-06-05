
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PdfCompressionButtonProps {
  onCompress: () => void;
  isProcessing: boolean;
}

const PdfCompressionButton: React.FC<PdfCompressionButtonProps> = ({
  onCompress,
  isProcessing
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <Button 
        onClick={onCompress} 
        className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
        disabled={isProcessing}
      >
        <FileText className="mr-2 h-5 w-5" /> 
        Compress PDF
      </Button>
    </div>
  );
};

export default PdfCompressionButton;
