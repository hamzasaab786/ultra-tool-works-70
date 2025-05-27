
import React, { useState, useCallback, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Palette, Eye, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [customRgb, setCustomRgb] = useState({ r: 59, g: 130, b: 246 });
  const [customHsl, setCustomHsl] = useState({ h: 217, s: 91, l: 60 });

  // Predefined color palette
  const colorPalette = [
    "#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FFFF00", "#ADFF2F",
    "#00FF00", "#00FF7F", "#00FFFF", "#0080FF", "#0000FF", "#4000FF",
    "#8000FF", "#FF00FF", "#FF007F", "#FF0040", "#800000", "#FF6347",
    "#FFA500", "#BDB76B", "#808000", "#6B8E23", "#228B22", "#008B8B",
    "#4682B4", "#191970", "#4B0082", "#9400D3", "#8B008B", "#DC143C",
    "#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF", "#F5F5DC"
  ];

  // Convert hex to RGB
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  // Convert RGB to HSL
  const rgbToHsl = useCallback((r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  // Convert RGB to CMYK
  const rgbToCmyk = useCallback((r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

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
  }, []);

  // Convert HSL to RGB
  const hslToRgb = useCallback((h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }, []);

  // RGB to Hex
  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }, []);

  // Update all color values when color changes
  const updateColorValues = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({ hex, rgb, hsl, cmyk });
    setCustomRgb(rgb);
    setCustomHsl(hsl);

    // Add to recent colors
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== hex);
      return [hex, ...filtered].slice(0, 12);
    });
  }, [hexToRgb, rgbToHsl, rgbToCmyk]);

  // Handle color picker change
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    updateColorValues(color);
  }, [updateColorValues]);

  // Handle RGB input change
  const handleRgbChange = useCallback(() => {
    const hex = rgbToHex(customRgb.r, customRgb.g, customRgb.b);
    setSelectedColor(hex);
    updateColorValues(hex);
  }, [customRgb, rgbToHex, updateColorValues]);

  // Handle HSL input change
  const handleHslChange = useCallback(() => {
    const rgb = hslToRgb(customHsl.h, customHsl.s, customHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
    updateColorValues(hex);
  }, [customHsl, hslToRgb, rgbToHex, updateColorValues]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${format} color value copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  }, []);

  // Initialize with default color
  useEffect(() => {
    updateColorValues(selectedColor);
  }, []);

  return (
    <ToolPageTemplate
      title="Color Picker Tool"
      description="Professional color picker and converter - Get HEX, RGB, HSL, and CMYK color values instantly. Perfect for web design, graphic design, and development projects. Free online color palette generator."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            🎨 Professional color picker with instant conversion to HEX, RGB, HSL, and CMYK formats. Perfect for designers, developers, and creative professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Picker */}
          <div className="space-y-4">
            <div>
              <Label>Color Picker</Label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-20 h-20 rounded-lg border cursor-pointer"
                />
                <div 
                  className="flex-1 h-20 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>

            <div>
              <Label>HEX Color Input</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={selectedColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedColor(value);
                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                      updateColorValues(value);
                    }
                  }}
                  placeholder="#000000"
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(colorValues.hex, "HEX")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>RGB Values</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <Label className="text-xs">R</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={customRgb.r}
                    onChange={(e) => {
                      const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                      setCustomRgb(prev => ({ ...prev, r }));
                    }}
                    onBlur={handleRgbChange}
                  />
                </div>
                <div>
                  <Label className="text-xs">G</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={customRgb.g}
                    onChange={(e) => {
                      const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                      setCustomRgb(prev => ({ ...prev, g }));
                    }}
                    onBlur={handleRgbChange}
                  />
                </div>
                <div>
                  <Label className="text-xs">B</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={customRgb.b}
                    onChange={(e) => {
                      const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                      setCustomRgb(prev => ({ ...prev, b }));
                    }}
                    onBlur={handleRgbChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>HSL Values</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <Label className="text-xs">H</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={customHsl.h}
                    onChange={(e) => {
                      const h = Math.max(0, Math.min(360, parseInt(e.target.value) || 0));
                      setCustomHsl(prev => ({ ...prev, h }));
                    }}
                    onBlur={handleHslChange}
                  />
                </div>
                <div>
                  <Label className="text-xs">S</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={customHsl.s}
                    onChange={(e) => {
                      const s = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      setCustomHsl(prev => ({ ...prev, s }));
                    }}
                    onBlur={handleHslChange}
                  />
                </div>
                <div>
                  <Label className="text-xs">L</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={customHsl.l}
                    onChange={(e) => {
                      const l = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      setCustomHsl(prev => ({ ...prev, l }));
                    }}
                    onBlur={handleHslChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Values */}
          <div className="space-y-4">
            <div>
              <Label>Color Values</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">HEX</p>
                    <p className="text-sm font-mono text-muted-foreground">{colorValues.hex}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(colorValues.hex, "HEX")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">RGB</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`, "RGB")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">HSL</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`, "HSL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">CMYK</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      cmyk({colorValues.cmyk.c}%, {colorValues.cmyk.m}%, {colorValues.cmyk.y}%, {colorValues.cmyk.k}%)
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`, "CMYK")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Palette className="h-4 w-4" />
            Quick Color Palette
          </Label>
          <div className="grid grid-cols-12 gap-2">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Recent Colors */}
        {recentColors.length > 0 && (
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4" />
              Recent Colors
            </Label>
            <div className="flex gap-2 flex-wrap">
              {recentColors.map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default ColorPicker;
