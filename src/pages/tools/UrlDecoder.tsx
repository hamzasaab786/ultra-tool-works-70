
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Globe } from "lucide-react";
import SEO from "@/components/SEO";

const UrlDecoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"decode" | "encode">("decode");
  const { toast } = useToast();

  const processUrl = () => {
    try {
      let result = "";
      if (mode === "decode") {
        result = decodeURIComponent(input);
      } else {
        result = encodeURIComponent(input);
      }
      setOutput(result);
      
      toast({
        title: `URL ${mode}d successfully`,
        description: `Your URL has been ${mode}d and is ready to use.`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your URL.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The processed URL has been copied to your clipboard.",
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
      <SEO
        title="URL Encoder Decoder - Encode & Decode URLs Online Free"
        description="Encode and decode URLs online for free. Convert special characters in URLs for safe transmission and proper formatting."
        keywords="URL encoder, URL decoder, encode URL, decode URL, URL encoding, percent encoding"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              URL Encoder / Decoder
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encode and decode URLs to handle special characters and ensure proper URL formatting
            </p>
          </div>

          <div className="space-y-6">
            {/* Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Processing Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={mode === "decode" ? "default" : "outline"}
                    onClick={() => setMode("decode")}
                  >
                    Decode URL
                  </Button>
                  <Button
                    variant={mode === "encode" ? "default" : "outline"}
                    onClick={() => setMode("encode")}
                  >
                    Encode URL
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {mode === "decode" 
                    ? "Convert encoded URLs (with %20, %3A, etc.) back to readable format"
                    : "Convert URLs with special characters to encoded format for safe transmission"
                  }
                </p>
              </CardContent>
            </Card>

            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input URL</CardTitle>
                <CardDescription>
                  {mode === "decode" 
                    ? "Paste your encoded URL here (e.g., https%3A//example.com/path%20with%20spaces)"
                    : "Paste your URL with special characters here"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={mode === "decode" 
                    ? "https%3A//example.com/search%3Fq%3Dhello%20world%26type%3Dimage"
                    : "https://example.com/search?q=hello world&type=image"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={processUrl} disabled={!input.trim()}>
                    {mode === "decode" ? "Decode URL" : "Encode URL"}
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            {output && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {mode === "decode" ? "Decoded URL" : "Encoded URL"}
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your {mode}d URL is ready to use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-[120px] font-mono text-sm bg-gray-50"
                  />
                </CardContent>
              </Card>
            )}

            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle>Understanding URL Encoding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Common Encoded Characters</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Space</span>
                        <code>%20</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Colon (:)</span>
                        <code>%3A</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Forward slash (/)</span>
                        <code>%2F</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Question mark (?)</span>
                        <code>%3F</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Ampersand (&)</span>
                        <code>%26</code>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">When to Use</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Preparing URLs for HTTP requests</li>
                      <li>• Handling form data submission</li>
                      <li>• Processing query parameters</li>
                      <li>• Fixing broken or malformed URLs</li>
                      <li>• Working with API endpoints</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UrlDecoder;
