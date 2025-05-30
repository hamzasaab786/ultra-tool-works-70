
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

interface GradientColorPickerProps {
  startColor: string;
  endColor: string;
  onStartColorChange: (color: string) => void;
  onEndColorChange: (color: string) => void;
  isGradient: boolean;
  onGradientToggle: (isGradient: boolean) => void;
  solidColor: string;
  onSolidColorChange: (color: string) => void;
}

const GradientColorPicker: React.FC<GradientColorPickerProps> = ({
  startColor,
  endColor,
  onStartColorChange,
  onEndColorChange,
  isGradient,
  onGradientToggle,
  solidColor,
  onSolidColorChange
}) => {
  const gradientPresets = [
    { name: "Blue to Purple", start: "#3b82f6", end: "#8b5cf6" },
    { name: "Green to Blue", start: "#10b981", end: "#3b82f6" },
    { name: "Pink to Orange", start: "#ec4899", end: "#f97316" },
    { name: "Red to Yellow", start: "#ef4444", end: "#eab308" },
    { name: "Purple to Pink", start: "#a855f7", end: "#ec4899" },
    { name: "Teal to Green", start: "#14b8a6", end: "#22c55e" },
    { name: "Orange to Red", start: "#f97316", end: "#dc2626" },
    { name: "Indigo to Purple", start: "#6366f1", end: "#9333ea" }
  ];

  const solidPresets = [
    "#000000", "#ffffff", "#ef4444", "#f97316", 
    "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={!isGradient ? "default" : "outline"}
          size="sm"
          onClick={() => onGradientToggle(false)}
        >
          Solid Color
        </Button>
        <Button
          variant={isGradient ? "default" : "outline"}
          size="sm"
          onClick={() => onGradientToggle(true)}
        >
          <Palette className="mr-2 h-4 w-4" />
          Gradient
        </Button>
      </div>

      {!isGradient ? (
        <div className="space-y-3">
          <Label>QR Code Color</Label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {solidPresets.map((color) => (
              <Button
                key={color}
                variant="outline"
                className="h-10 p-1"
                onClick={() => onSolidColorChange(color)}
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">{color}</span>
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="color"
              value={solidColor}
              onChange={(e) => onSolidColorChange(e.target.value)}
              className="w-16 h-10"
            />
            <Input
              value={solidColor}
              onChange={(e) => onSolidColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Label>Gradient Colors</Label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {gradientPresets.map((gradient, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 p-1 flex flex-col items-center justify-center"
                onClick={() => {
                  onStartColorChange(gradient.start);
                  onEndColorChange(gradient.end);
                }}
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
                value={startColor}
                onChange={(e) => onStartColorChange(e.target.value)}
                className="w-16 h-8"
              />
              <Input
                value={startColor}
                onChange={(e) => onStartColorChange(e.target.value)}
                className="flex-1 h-8"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-16">End:</Label>
              <Input
                type="color"
                value={endColor}
                onChange={(e) => onEndColorChange(e.target.value)}
                className="w-16 h-8"
              />
              <Input
                value={endColor}
                onChange={(e) => onEndColorChange(e.target.value)}
                className="flex-1 h-8"
              />
            </div>
          </div>
          
          <div className="mt-3 p-3 border rounded-lg">
            <Label className="text-sm text-gray-600">Preview:</Label>
            <div 
              className="w-full h-8 rounded mt-1 border"
              style={{ 
                background: `linear-gradient(135deg, ${startColor}, ${endColor})`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientColorPicker;
