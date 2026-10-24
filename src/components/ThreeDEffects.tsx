
import React from 'react';

interface ThreeDEffectsProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  type?: 'card' | 'float' | 'tilt';
}

const ThreeDEffects: React.FC<ThreeDEffectsProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  type = 'card'
}) => {
  const getEffectClasses = () => {
    const baseClasses = 'motion-safe:transition-transform duration-200 ease-out';
    
    const intensityClasses = {
      low: 'hover:scale-[1.02] hover:-translate-y-1',
      medium: 'hover:scale-105 hover:-translate-y-2',
      high: 'hover:scale-110 hover:-translate-y-4'
    };

    const typeClasses = {
      card: '',
      float: 'floating-element animate-float',
      tilt: 'hover:rotate-x-2 hover:rotate-y-2'
    };

    const shadowClasses = {
      low: 'hover:shadow-lg',
      medium: 'hover:shadow-xl hover:shadow-blue-500/10',
      high: 'hover:shadow-2xl hover:shadow-purple-500/20'
    };

    return `${baseClasses} ${intensityClasses[intensity]} ${typeClasses[type]} ${shadowClasses[intensity]} ${className}`;
  };

  return (
    <div className={getEffectClasses()}>
      {children}
    </div>
  );
};

export default ThreeDEffects;
