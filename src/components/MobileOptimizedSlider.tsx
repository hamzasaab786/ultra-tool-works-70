
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const MobileOptimizedSlider: React.FC<MobileOptimizedSliderProps> = ({
  beforeImage,
  afterImage,
  className
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isMobile = useIsMobile();

  const handleStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    updatePosition(e.clientX);
  }, [updatePosition]);

  useEffect(() => {
    const handleGlobalMouseUp = () => handleEnd();
    const handleGlobalTouchEnd = () => handleEnd();

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [handleEnd]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-col-resize select-none",
        "bg-gray-100 min-h-[200px] md:min-h-[300px]",
        !isLoaded && "animate-pulse",
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Before Image */}
      <img 
        src={beforeImage} 
        alt="Original" 
        className="w-full h-full object-contain bg-white"
        draggable={false}
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* After Image with clip */}
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={afterImage} 
          alt="Background Removed" 
          className="w-full h-full object-contain bg-white"
          draggable={false}
        />
      </div>
      
      {/* Slider Line */}
      <div 
        className={cn(
          "absolute top-0 bottom-0 bg-white shadow-lg cursor-col-resize z-10",
          "transition-all duration-150",
          isMobile ? "w-1" : "w-0.5 hover:w-1"
        )}
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Slider Handle */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "bg-white rounded-full shadow-lg flex items-center justify-center",
          "transition-all duration-150",
          isMobile ? "w-10 h-10" : "w-8 h-8 hover:w-10 hover:h-10"
        )}>
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-4 bg-gray-400 rounded"></div>
            <div className="w-0.5 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className={cn(
        "absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs",
        isMobile ? "text-xs" : "text-sm"
      )}>
        Original
      </div>
      <div className={cn(
        "absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs",
        isMobile ? "text-xs" : "text-sm"
      )}>
        Processed
      </div>
      
      {/* Mobile Instructions */}
      {isMobile && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-xs">
          Tap or drag to compare
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedSlider;
