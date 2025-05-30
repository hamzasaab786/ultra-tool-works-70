
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BackgroundColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  gradientStart?: string;
  gradientEnd?: string;
  onGradientChange?: (start: string, end: string) => void;
  isGradient?: boolean;
  onGradientToggle?: (isGradient: boolean) => void;
}

const BackgroundColorPicker: React.FC<BackgroundColorPickerProps> = ({
  selectedColor,
  onColorChange,
  gradientStart = "#ffffff",
  gradientEnd = "#f0f0f0",
  onGradientChange,
  isGradient = false,
  onGradientToggle
}) => {
  const presetColors = [
    { name: "Transparent", value: "transparent", preview: "checkerboard" },
    { name: "White", value: "#ffffff", preview: "#ffffff" },
    { name: "Black", value: "#000000", preview: "#000000" },
    { name: "Light Gray", value: "#f5f5f5", preview: "#f5f5f5" },
    { name: "Blue", value: "#3b82f6", preview: "#3b82f6" },
    { name: "Green", value: "#10b981", preview: "#10b981" },
    { name: "Red", value: "#ef4444", preview: "#ef4444" },
    { name: "Purple", value: "#8b5cf6", preview: "#8b5cf6" }
  ];

  const gradientPresets = [
    { name: "Blue to Purple", start: "#3b82f6", end: "#8b5cf6" },
    { name: "Green to Blue", start: "#10b981", end: "#3b82f6" },
    { name: "Pink to Orange", start: "#ec4899", end: "#f97316" },
    { name: "Gray to White", start: "#6b7280", end: "#ffffff" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={!isGradient ? "default" : "outline"}
          size="sm"
          onClick={() => onGradientToggle?.(false)}
        >
          Solid Color
        </Button>
        <Button
          variant={isGradient ? "default" : "outline"}
          size="sm"
          onClick={() => onGradientToggle?.(true)}
        >
          Gradient
        </Button>
      </div>

      {!isGradient ? (
        <div className="space-y-3">
          <Label>Background Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className="h-12 p-1 flex flex-col items-center justify-center"
                onClick={() => onColorChange(color.value)}
              >
                <div 
                  className={`w-full h-6 rounded mb-1 border ${
                    color.preview === "checkerboard" 
                      ? "bg-checkerboard" 
                      : ""
                  }`}
                  style={{ 
                    backgroundColor: color.preview !== "checkerboard" ? color.preview : undefined,
                    backgroundImage: color.preview === "checkerboard" 
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                      : undefined,
                    backgroundSize: color.preview === "checkerboard" ? "8px 8px" : undefined,
                    backgroundPosition: color.preview === "checkerboard" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined
                  }}
                />
                <span className="text-xs">{color.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-16 h-10"
            />
            <Input
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Label>Gradient Background</Label>
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((gradient, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 p-1 flex flex-col items-center justify-center"
                onClick={() => onGradientChange?.(gradient.start, gradient.end)}
              >
                <div 
                  className="w-full h-6 rounded mb-1 border"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`
                  }}
                />
                <span className="text-xs">{gradient.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Label className="w-16">Start:</Label>
              <Input
                type="color"
                value={gradientStart}
                onChange={(e) => onGradientChange?.(e.target.value, gradientEnd)}
                className="w-16 h-8"
              />
              <Input
                value={gradientStart}
                onChange={(e) => onGradientChange?.(e.target.value, gradientEnd)}
                className="flex-1 h-8"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-16">End:</Label>
              <Input
                type="color"
                value={gradientEnd}
                onChange={(e) => onGradientChange?.(gradientStart, e.target.value)}
                className="w-16 h-8"
              />
              <Input
                value={gradientEnd}
                onChange={(e) => onGradientChange?.(gradientStart, e.target.value)}
                className="flex-1 h-8"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundColorPicker;
