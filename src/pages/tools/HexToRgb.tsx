
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Palette } from "lucide-react";
import SEO from "@/components/SEO";

const HexToRgb = () => {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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

  useEffect(() => {
    const rgbResult = hexToRgb(hex);
    if (rgbResult) {
      setRgb(rgbResult);
      const hslResult = rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b);
      setHsl(hslResult);
    }
  }, [hex]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${format} value copied successfully!`,
    });
  };

  const handleHexChange = (value: string) => {
    if (value.startsWith('#')) {
      setHex(value);
    } else {
      setHex('#' + value);
    }
  };

  return (
    <>
      <SEO
        title="Hex to RGB Color Converter - Convert HEX to RGB, HSL"
        description="Convert HEX color codes to RGB, HSL, and other color formats. Free online color converter with live preview and copy functionality."
        keywords="hex to rgb, color converter, hex color, rgb color, hsl color, color codes"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Hex to RGB Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert HEX color codes to RGB, HSL, and other color formats with live preview
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hex-input">HEX Color</Label>
                  <Input
                    id="hex-input"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Color Preview</Label>
                  <div 
                    className="w-full h-24 rounded-lg border shadow-inner"
                    style={{ backgroundColor: hex }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Color Values</CardTitle>
                <CardDescription>
                  Click any value to copy to clipboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">HEX</Label>
                      <p className="font-mono text-lg">{hex}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(hex, "HEX")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">RGB</Label>
                      <p className="font-mono text-lg">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">HSL</Label>
                      <p className="font-mono text-lg">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">CSS RGB</Label>
                      <p className="font-mono text-sm">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "CSS RGB")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Color Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Red Component</Label>
                  <p>{rgb.r} ({Math.round((rgb.r / 255) * 100)}%)</p>
                </div>
                <div>
                  <Label className="font-medium">Green Component</Label>
                  <p>{rgb.g} ({Math.round((rgb.g / 255) * 100)}%)</p>
                </div>
                <div>
                  <Label className="font-medium">Blue Component</Label>
                  <p>{rgb.b} ({Math.round((rgb.b / 255) * 100)}%)</p>
                </div>
                <div>
                  <Label className="font-medium">Hue</Label>
                  <p>{hsl.h}°</p>
                </div>
                <div>
                  <Label className="font-medium">Saturation</Label>
                  <p>{hsl.s}%</p>
                </div>
                <div>
                  <Label className="font-medium">Lightness</Label>
                  <p>{hsl.l}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HexToRgb;
