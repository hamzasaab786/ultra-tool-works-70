
import React from 'react';
import ToolPageTemplate from './ToolPageTemplate';

const BmiCalculator = () => {
  return (
    <ToolPageTemplate
      title="BMI Calculator"
      description="Calculate your Body Mass Index"
      keywords="bmi calculator, body mass index, health calculator"
    >
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">BMI Calculator</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </ToolPageTemplate>
  );
};

export default BmiCalculator;
