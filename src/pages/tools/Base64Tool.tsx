
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Upload, Download, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Base64Tool = () => {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [fileName, setFileName] = useState("");

  const encodeText = useCallback(() => {
    if (!textInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to encode",
        variant: "destructive"
      });
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setEncodedResult(encoded);
      toast({
        title: "Success",
        description: "Text encoded to Base64 successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode text",
        variant: "destructive"
      });
    }
  }, [textInput]);

  const decodeBase64 = useCallback(() => {
    if (!base64Input.trim()) {
      toast({
        title: "Error",
        description: "Please enter Base64 text to decode",
        variant: "destructive"
      });
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setDecodedResult(decoded);
      toast({
        title: "Success",
        description: "Base64 decoded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Base64 input",
        variant: "destructive"
      });
    }
  }, [base64Input]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1]; // Remove data URL prefix
      setFileBase64(result); // Keep full data URL for preview
      setFileName(file.name);
      
      toast({
        title: "Success",
        description: "File converted to Base64!",
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  }, []);

  const downloadAsFile = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const clearAll = useCallback(() => {
    setTextInput("");
    setBase64Input("");
    setEncodedResult("");
    setDecodedResult("");
    setFileBase64("");
    setFileName("");
  }, []);

  return (
    <ToolPageTemplate
      title="Base64 Encoder & Decoder"
      description="Free online Base64 encoder and decoder tool - Convert text to Base64 and decode Base64 to text. Also convert files to Base64 encoding for web development, data transmission, and API integration."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            🔐 Encode text and files to Base64 or decode Base64 back to original format. Essential tool for developers, data transmission, and web development projects.
          </p>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text Encoder
            </TabsTrigger>
            <TabsTrigger value="decode" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text Decoder
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File to Base64
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text-input">Text to Encode</Label>
              <Textarea
                id="text-input"
                placeholder="Enter your text here to convert to Base64..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={encodeText} disabled={!textInput.trim()}>
                Encode to Base64
              </Button>
              <Button variant="outline" onClick={() => setTextInput("")}>
                Clear
              </Button>
            </div>

            {encodedResult && (
              <div>
                <Label>Base64 Result</Label>
                <div className="relative mt-2">
                  <Textarea
                    value={encodedResult}
                    readOnly
                    rows={6}
                    className="bg-muted pr-24"
                  />
                  <div className="absolute top-2 right-2 space-y-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(encodedResult)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadAsFile(encodedResult, 'encoded.txt')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <div>
              <Label htmlFor="base64-input">Base64 to Decode</Label>
              <Textarea
                id="base64-input"
                placeholder="Enter Base64 encoded text here to decode..."
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={decodeBase64} disabled={!base64Input.trim()}>
                Decode Base64
              </Button>
              <Button variant="outline" onClick={() => setBase64Input("")}>
                Clear
              </Button>
            </div>

            {decodedResult && (
              <div>
                <Label>Decoded Result</Label>
                <div className="relative mt-2">
                  <Textarea
                    value={decodedResult}
                    readOnly
                    rows={6}
                    className="bg-muted pr-24"
                  />
                  <div className="absolute top-2 right-2 space-y-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(decodedResult)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadAsFile(decodedResult, 'decoded.txt')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div>
              <Label>Upload File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">
                  Click to upload or drag and drop a file (Max 5MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </div>
            </div>

            {fileBase64 && (
              <div className="space-y-4">
                <div>
                  <Label>File Information</Label>
                  <div className="bg-muted p-4 rounded-lg mt-2">
                    <p className="text-sm"><strong>Filename:</strong> {fileName}</p>
                    <p className="text-sm"><strong>Base64 Size:</strong> {fileBase64.length} characters</p>
                  </div>
                </div>

                {fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) && (
                  <div>
                    <Label>Preview</Label>
                    <img 
                      src={fileBase64} 
                      alt="Preview" 
                      className="max-w-xs max-h-48 object-contain border rounded mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>Base64 Output</Label>
                  <div className="relative mt-2">
                    <Textarea
                      value={fileBase64}
                      readOnly
                      rows={8}
                      className="bg-muted pr-24 text-xs"
                    />
                    <div className="absolute top-2 right-2 space-y-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(fileBase64)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadAsFile(fileBase64, `${fileName}.base64.txt`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Button variant="outline" onClick={clearAll}>
            Clear All Data
          </Button>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default Base64Tool;
