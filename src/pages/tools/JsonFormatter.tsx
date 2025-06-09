
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, FileCode, CheckCircle, XCircle } from "lucide-react";
import SEO from "@/components/SEO";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      
      toast({
        title: "JSON formatted successfully",
        description: "Your JSON has been formatted and validated.",
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive",
      });
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      
      toast({
        title: "JSON minified successfully",
        description: "Your JSON has been minified and validated.",
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive",
      });
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      setError("");
      
      toast({
        title: "Valid JSON",
        description: "Your JSON syntax is correct!",
      });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The formatted JSON has been copied to your clipboard.",
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const loadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001"
      },
      "isActive": true
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <>
      <SEO
        title="JSON Formatter - Format, Validate & Minify JSON Online"
        description="Format, validate, and minify JSON data online for free. Pretty print JSON with proper indentation and check for syntax errors."
        keywords="JSON formatter, JSON validator, JSON minifier, format JSON, validate JSON, pretty print JSON"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              JSON Formatter & Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Format, validate, and minify JSON data with syntax highlighting and error detection
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  JSON Input
                  {isValid !== null && (
                    <span className="ml-auto">
                      {isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Paste your JSON data here to format and validate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='{"name": "John", "age": 30}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                
                {error && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">Error:</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={formatJson} disabled={!input.trim()}>
                    Format
                  </Button>
                  <Button variant="outline" onClick={minifyJson} disabled={!input.trim()}>
                    Minify
                  </Button>
                  <Button variant="outline" onClick={validateJson} disabled={!input.trim()}>
                    Validate
                  </Button>
                  <Button variant="outline" onClick={loadSample}>
                    Sample
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Formatted JSON
                  {output && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Your formatted and validated JSON output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="min-h-[300px] font-mono text-sm bg-gray-50"
                />
                
                {output && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Lines: {output.split('\n').length}</p>
                    <p>Characters: {output.length}</p>
                    <p>Size: {new Blob([output]).size} bytes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>JSON Tools Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">🔧 Format</h4>
                  <p className="text-sm text-gray-600">
                    Pretty print JSON with proper indentation and line breaks
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">✅ Validate</h4>
                  <p className="text-sm text-gray-600">
                    Check JSON syntax and identify errors with detailed messages
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">📦 Minify</h4>
                  <p className="text-sm text-gray-600">
                    Remove unnecessary whitespace to reduce file size
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default JsonFormatter;
