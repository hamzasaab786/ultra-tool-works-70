
import React from 'react';
import ToolPageTemplate from './ToolPageTemplate';

const LoremIpsum = () => {
  return (
    <ToolPageTemplate
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for your projects"
      keywords="lorem ipsum, placeholder text, dummy text"
    >
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Lorem Ipsum Generator</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </ToolPageTemplate>
  );
};

export default LoremIpsum;
