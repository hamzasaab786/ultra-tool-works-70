
import React from 'react';
import ToolPageTemplate from './ToolPageTemplate';

const UuidGenerator = () => {
  return (
    <ToolPageTemplate
      title="UUID Generator"
      description="Generate unique identifiers (UUIDs)"
      keywords="uuid generator, unique id, identifier generator"
    >
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">UUID Generator</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </ToolPageTemplate>
  );
};

export default UuidGenerator;
