
import React from "react";
import { AlertCircle } from "lucide-react";

const PdfInfoSection: React.FC = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">How it works</h4>
          <p className="text-sm text-gray-600 mb-3">
            Our PDF compressor uses advanced optimization techniques to reduce file size while preserving document quality and structure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h5 className="font-medium mb-1">✓ Features:</h5>
              <ul className="space-y-1">
                <li>• Advanced compression algorithms</li>
                <li>• Document optimization</li>
                <li>• Preserves document structure</li>
                <li>• Fast processing</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">✓ Benefits:</h5>
              <ul className="space-y-1">
                <li>• Reduced file size</li>
                <li>• Faster sharing</li>
                <li>• Storage savings</li>
                <li>• 100% free to use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfInfoSection;
