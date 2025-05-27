
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [copied, setCopied] = useState<string>("");

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

  const hexToCmyk = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
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
  }, []);

  const rgb = hexToRgb(selectedColor);
  const hsl = hexToHsl(selectedColor);
  const cmyk = hexToCmyk(selectedColor);

  const colorFormats = [
    { label: "HEX", value: selectedColor.toUpperCase(), type: "HEX" },
    { label: "RGB", value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "", type: "RGB" },
    { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "", type: "HSL" },
    { label: "CMYK", value: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : "", type: "CMYK" }
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
      description="Professional color picker with HEX, RGB, HSL, and CMYK values - Pick colors visually and get instant color codes for web design, graphic design, and digital art projects."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            🎨 Pick any color and instantly get HEX, RGB, HSL, and CMYK values. Perfect for web designers, graphic designers, and digital artists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Picker Section */}
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
                    className="w-16 h-16 rounded border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Preset Colors</Label>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Color Values Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Color Values</Label>
            {colorFormats.map((format) => (
              <div key={format.type} className="space-y-2">
                <Label>{format.label}</Label>
                <div className="flex space-x-2">
                  <Input
                    value={format.value}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(format.value, format.type)}
                    className="px-3"
                  >
                    {copied === format.type ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Label className="text-base font-semibold mb-3 block">Individual RGB Values</Label>
              {rgb && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Red</Label>
                    <Input value={rgb.r} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-sm">Green</Label>
                    <Input value={rgb.g} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-sm">Blue</Label>
                    <Input value={rgb.b} readOnly className="bg-gray-50" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Label className="text-base font-semibold mb-3 block">Individual HSL Values</Label>
              {hsl && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Hue</Label>
                    <Input value={`${hsl.h}°`} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-sm">Saturation</Label>
                    <Input value={`${hsl.s}%`} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-sm">Lightness</Label>
                    <Input value={`${hsl.l}%`} readOnly className="bg-gray-50" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ColorPicker;
