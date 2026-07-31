
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, RotateCcw, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

interface ConversionResult {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  bytes: number;
}

const FileSizeConverter = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>("MB");
  const [toUnit, setToUnit] = useState<string>("GB");
  const [result, setResult] = useState<ConversionResult | null>(null);
  
  const units = [
    { value: "B", label: "Bytes (B)", multiplier: 1 },
    { value: "KB", label: "Kilobytes (KB)", multiplier: 1024 },
    { value: "MB", label: "Megabytes (MB)", multiplier: 1024 * 1024 },
    { value: "GB", label: "Gigabytes (GB)", multiplier: 1024 * 1024 * 1024 },
    { value: "TB", label: "Terabytes (TB)", multiplier: 1024 * 1024 * 1024 * 1024 },
    { value: "PB", label: "Petabytes (PB)", multiplier: 1024 * 1024 * 1024 * 1024 * 1024 }
  ];
  
  const convertFileSize = () => {
    const value = parseFloat(inputValue);
    if (!value || value < 0) {
      return;
    }
    
    const fromMultiplier = units.find(u => u.value === fromUnit)?.multiplier || 1;
    const toMultiplier = units.find(u => u.value === toUnit)?.multiplier || 1;
    
    // Convert to bytes first, then to target unit
    const bytes = value * fromMultiplier;
    const convertedValue = bytes / toMultiplier;
    
    setResult({
      fromValue: value,
      fromUnit,
      toValue: convertedValue,
      toUnit,
      bytes
    });
  };
  
  const reset = () => {
    setInputValue("");
    setResult(null);
  };
  
  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (num < 0.001) return num.toExponential(3);
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, "");
    if (num < 1000) return num.toFixed(3).replace(/\.?0+$/, "");
    return new Intl.NumberFormat('en-US').format(Math.round(num * 1000) / 1000);
  };
  
  const formatBytes = (bytes: number): string => {
    return new Intl.NumberFormat('en-US').format(bytes);
  };
  
  // Common file size examples
  const examples = [
    { name: "Text file", size: "1 KB" },
    { name: "High-res photo", size: "5 MB" },
    { name: "Song (MP3)", size: "4 MB" },
    { name: "HD video (1 hour)", size: "4 GB" },
    { name: "4K movie", size: "50 GB" },
    { name: "Large game", size: "100 GB" }
  ];
  
  return (
    <>
      <SEO
        title="File Size Converter - Convert Bytes, KB, MB, GB, TB Online Free | Klipza"
        description="Convert between file size units easily. Convert bytes, kilobytes, megabytes, gigabytes, terabytes and more."
        keywords="file size converter, bytes converter, KB to MB, GB to TB, file size calculator"
        canonicalUrl="https://klipza.live/tools/file-size-converter"
      />
      
      <ToolPageTemplate
        title="File Size Converter"
        description="Convert between different file size units (Bytes, KB, MB, GB, TB, PB)"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                File Size Conversion
              </CardTitle>
              <CardDescription>
                Convert between bytes, kilobytes, megabytes, gigabytes, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="inputValue">Value</Label>
                  <Input
                    id="inputValue"
                    type="number"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>From Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>To Unit</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={convertFileSize} className="flex-1">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Convert
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Conversion Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-4">
                    {formatNumber(result.fromValue)} {result.fromUnit} = {formatNumber(result.toValue)} {result.toUnit}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Input</div>
                      <div className="text-xl font-semibold">
                        {formatNumber(result.fromValue)} {result.fromUnit}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Output</div>
                      <div className="text-xl font-semibold">
                        {formatNumber(result.toValue)} {result.toUnit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Exact value in bytes</div>
                    <div className="font-mono text-lg">{formatBytes(result.bytes)} bytes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common File Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{example.name}</span>
                      <span className="text-sm font-medium">{example.size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Unit Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>1 KB</span>
                    <span>1,024 bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 MB</span>
                    <span>1,024 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 GB</span>
                    <span>1,024 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 TB</span>
                    <span>1,024 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 PB</span>
                    <span>1,024 TB</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> This calculator uses binary (base 2) conversion where 1 KB = 1,024 bytes. 
                      Some systems use decimal (base 10) where 1 KB = 1,000 bytes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default FileSizeConverter;
