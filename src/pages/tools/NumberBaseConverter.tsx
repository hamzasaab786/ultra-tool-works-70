
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Calculator } from "lucide-react";
import SEO from "@/components/SEO";

const NumberBaseConverter = () => {
  const [decimal, setDecimal] = useState("255");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const { toast } = useToast();

  const convertFromDecimal = (num: number) => {
    setBinary(num.toString(2));
    setOctal(num.toString(8));
    setHexadecimal(num.toString(16).toUpperCase());
  };

  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0) {
      convertFromDecimal(num);
    } else {
      setBinary("");
      setOctal("");
      setHexadecimal("");
    }
  };

  const handleBinaryChange = (value: string) => {
    setBinary(value);
    const num = parseInt(value, 2);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setOctal(num.toString(8));
      setHexadecimal(num.toString(16).toUpperCase());
    }
  };

  const handleOctalChange = (value: string) => {
    setOctal(value);
    const num = parseInt(value, 8);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setBinary(num.toString(2));
      setHexadecimal(num.toString(16).toUpperCase());
    }
  };

  const handleHexChange = (value: string) => {
    setHexadecimal(value);
    const num = parseInt(value, 16);
    if (!isNaN(num)) {
      setDecimal(num.toString());
      setBinary(num.toString(2));
      setOctal(num.toString(8));
    }
  };

  useEffect(() => {
    convertFromDecimal(255);
  }, []);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${format} value copied successfully!`,
    });
  };

  return (
    <>
      <SEO
        title="Number Base Converter - Convert Binary, Decimal, Octal, Hex"
        description="Convert numbers between different bases: binary, decimal, octal, and hexadecimal. Free online number system converter."
        keywords="number base converter, binary converter, decimal converter, hexadecimal converter, octal converter"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Number Base Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert numbers between binary, decimal, octal, and hexadecimal number systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Decimal (Base 10)
                  </CardTitle>
                  <CardDescription>Standard number system (0-9)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={decimal}
                      onChange={(e) => handleDecimalChange(e.target.value)}
                      placeholder="255"
                      className="font-mono"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(decimal, "Decimal")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Binary (Base 2)</CardTitle>
                  <CardDescription>Only 0 and 1 digits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={binary}
                      onChange={(e) => handleBinaryChange(e.target.value)}
                      placeholder="11111111"
                      className="font-mono"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(binary, "Binary")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Octal (Base 8)</CardTitle>
                  <CardDescription>Digits 0-7</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={octal}
                      onChange={(e) => handleOctalChange(e.target.value)}
                      placeholder="377"
                      className="font-mono"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(octal, "Octal")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hexadecimal (Base 16)</CardTitle>
                  <CardDescription>Digits 0-9 and letters A-F</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={hexadecimal}
                      onChange={(e) => handleHexChange(e.target.value)}
                      placeholder="FF"
                      className="font-mono"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(hexadecimal, "Hexadecimal")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Number System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Common Use Cases</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Binary: Computer programming, digital circuits</li>
                    <li>• Decimal: Everyday mathematics, general use</li>
                    <li>• Octal: Unix file permissions, embedded systems</li>
                    <li>• Hexadecimal: Color codes, memory addresses, debugging</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Reference</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Dec 255 =</span>
                      <span>Bin 11111111</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dec 255 =</span>
                      <span>Oct 377</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dec 255 =</span>
                      <span>Hex FF</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NumberBaseConverter;
