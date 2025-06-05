
import React from "react";

const PdfProcessingState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Compressing PDF...</h3>
        <p className="text-gray-600">Please wait while we optimize your PDF file</p>
      </div>
    </div>
  );
};

export default PdfProcessingState;
