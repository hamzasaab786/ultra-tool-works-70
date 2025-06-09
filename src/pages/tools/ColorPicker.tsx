
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [copied, setCopied] = useState<string>("");
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
      toast({
        title: "Copied!",
        description: `${type} value copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy color value",
        variant: "destructive"
      });
    }
  }, [toast]);

  const rgb = hexToRgb(selectedColor);
  const hsl = hexToHsl(selectedColor);

  const colorFormats = [
    { label: "HEX", value: selectedColor.toUpperCase(), type: "HEX" },
    { label: "RGB", value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "", type: "RGB" },
    { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "", type: "HSL" }
  ];

  const presetColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#000000",
    "#374151", "#6b7280", "#9ca3af", "#d1d5db", "#f3f4f6", "#ffffff"
  ];

  return (
    <ToolPageTemplate
      title="Color Picker Tool"
      description="Professional color picker with HEX, RGB, and HSL values"
      keywords="color picker, hex color, rgb color, hsl color, color palette"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div 
                className="w-48 h-48 mx-auto rounded-lg border-4 border-gray-200 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              ></div>
              
              <div className="space-y-2">
                <Label>Pick a Color</Label>
                <div className="flex justify-center">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-16 h-16 rounded cursor-pointer border-2 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enter HEX Color</Label>
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="text-center"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Values</h3>
            {colorFormats.map((format) => (
              <div key={format.type} className="flex items-center space-x-2">
                <div className="w-16 text-sm font-medium">{format.label}:</div>
                <Input
                  value={format.value}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(format.value, format.type)}
                >
                  {copied === format.type ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preset Colors</h3>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className="w-12 h-12 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Visual color picker with preview</li>
            <li>• HEX, RGB, and HSL format support</li>
            <li>• Preset color palette</li>
            <li>• One-click copy to clipboard</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ColorPicker;
