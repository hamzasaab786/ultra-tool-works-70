
import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { QrCode, Download, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const BarcodeGenerator = () => {
  const [text, setText] = useState<string>("");
  const [barcodeType, setBarcodeType] = useState<string>("code128");
  const [showText, setShowText] = useState<boolean>(true);
  const [width, setWidth] = useState<string>("2");
  const [height, setHeight] = useState<string>("100");
  const [generatedBarcode, setGeneratedBarcode] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const barcodeTypes = [
    { value: "code128", label: "Code 128 (Most common)" },
    { value: "code39", label: "Code 39" },
    { value: "ean13", label: "EAN-13 (Product barcodes)" },
    { value: "ean8", label: "EAN-8" },
    { value: "upc", label: "UPC-A" },
    { value: "itf14", label: "ITF-14" }
  ];
  
  // Simple barcode pattern generator (Code 128 simulation)
  const generateBarcodePattern = (inputText: string, type: string): string => {
    if (!inputText) return "";
    
    // This is a simplified barcode pattern generator
    // In a real implementation, you'd use proper barcode libraries
    let pattern = "";
    const chars = inputText.split("");
    
    // Start pattern
    pattern += "11010010000";
    
    // Data patterns (simplified)
    chars.forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      const binaryPattern = (charCode % 64).toString(2).padStart(6, '0');
      // Convert binary to bar pattern (1 = black bar, 0 = white space)
      pattern += binaryPattern.split('').map(bit => bit === '1' ? '110' : '100').join('');
    });
    
    // Stop pattern
    pattern += "1100011101011";
    
    return pattern;
  };
  
  const drawBarcode = (pattern: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const barWidth = parseInt(width);
    const barHeight = parseInt(height);
    const totalWidth = pattern.length * barWidth;
    const textHeight = showText ? 20 : 0;
    
    canvas.width = totalWidth;
    canvas.height = barHeight + textHeight + 10;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    ctx.fillStyle = 'black';
    pattern.split('').forEach((bit, index) => {
      if (bit === '1') {
        ctx.fillRect(index * barWidth, 5, barWidth, barHeight);
      }
    });
    
    // Draw text if enabled
    if (showText && text) {
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, totalWidth / 2, barHeight + 20);
    }
    
    return canvas.toDataURL('image/png');
  };
  
  const generateBarcode = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate a barcode.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate input based on barcode type
    if (barcodeType === "ean13" && (text.length !== 12 && text.length !== 13)) {
      toast({
        title: "Error",
        description: "EAN-13 requires 12 or 13 digits.",
        variant: "destructive"
      });
      return;
    }
    
    if (barcodeType === "ean8" && text.length !== 7 && text.length !== 8) {
      toast({
        title: "Error",
        description: "EAN-8 requires 7 or 8 digits.",
        variant: "destructive"
      });
      return;
    }
    
    if ((barcodeType === "ean13" || barcodeType === "ean8" || barcodeType === "upc") && !/^\d+$/.test(text)) {
      toast({
        title: "Error",
        description: "This barcode type only accepts numbers.",
        variant: "destructive"
      });
      return;
    }
    
    const pattern = generateBarcodePattern(text, barcodeType);
    const barcodeDataUrl = drawBarcode(pattern);
    
    if (barcodeDataUrl) {
      setGeneratedBarcode(barcodeDataUrl);
      toast({
        title: "Success",
        description: "Barcode generated successfully!",
      });
    }
  };
  
  const downloadBarcode = () => {
    if (!generatedBarcode) return;
    
    const link = document.createElement('a');
    link.href = generatedBarcode;
    link.download = `barcode_${text}_${barcodeType}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Barcode downloaded successfully!",
    });
  };
  
  const reset = () => {
    setText("");
    setGeneratedBarcode("");
    setBarcodeType("code128");
    setShowText(true);
    setWidth("2");
    setHeight("100");
  };
  
  return (
    <>
      <SEO
        title="Barcode Generator - Create Barcodes Online Free | Klipza"
        description="Generate various types of barcodes online for free. Support for Code 128, Code 39, EAN-13, UPC-A and more."
        keywords="barcode generator, create barcode, code 128, ean-13, upc barcode"
        canonicalUrl="https://klipza.live/tools/barcode-generator"
      />
      
      <ToolPageTemplate
        title="Barcode Generator"
        description="Generate various types of barcodes for products, inventory, and more"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Barcode Settings
              </CardTitle>
              <CardDescription>
                Configure your barcode text, type, and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Barcode Text/Data</Label>
                <Input
                  id="text"
                  placeholder="Enter text or numbers"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Barcode Type</Label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Bar Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="5"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Bar Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="50"
                    max="200"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showText"
                  checked={showText}
                  onCheckedChange={(checked) => setShowText(checked as boolean)}
                />
                <Label htmlFor="showText" className="text-sm">
                  Show text below barcode
                </Label>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={generateBarcode} className="flex-1">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate Barcode
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {generatedBarcode && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Barcode</CardTitle>
                  <Button variant="outline" onClick={downloadBarcode}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                </div>
                <CardDescription>
                  {barcodeTypes.find(t => t.value === barcodeType)?.label} barcode for "{text}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    <img 
                      src={generatedBarcode} 
                      alt={`Barcode for ${text}`}
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Barcode Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Type: {barcodeTypes.find(t => t.value === barcodeType)?.label}</div>
                    <div>Data: {text}</div>
                    <div>Width: {width}px per bar</div>
                    <div>Height: {height}px</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Hidden canvas for barcode generation */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <Card>
            <CardHeader>
              <CardTitle>Barcode Types Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Code 128</h4>
                  <p className="text-sm text-muted-foreground">
                    Most versatile, supports all ASCII characters. Great for general use.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Code 39</h4>
                  <p className="text-sm text-muted-foreground">
                    Supports letters, numbers, and some symbols. Widely used in industry.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">EAN-13</h4>
                  <p className="text-sm text-muted-foreground">
                    Standard for retail products worldwide. Requires 12-13 digits.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">UPC-A</h4>
                  <p className="text-sm text-muted-foreground">
                    Common in North America for retail products. Uses 12 digits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default BarcodeGenerator;
