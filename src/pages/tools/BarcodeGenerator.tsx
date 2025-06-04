
import React from 'react';
import ToolPageTemplate from './ToolPageTemplate';

const BarcodeGenerator = () => {
  return (
    <ToolPageTemplate
      title="Barcode Generator"
      description="Generate barcodes for products and inventory"
      keywords="barcode generator, product barcode, inventory barcode"
    >
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Barcode Generator</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </ToolPageTemplate>
  );
};

export default BarcodeGenerator;
