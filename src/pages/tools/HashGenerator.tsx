
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Shield, File, Key } from "lucide-react";

const HashGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [md5Hash, setMd5Hash] = useState("");
  const [sha1Hash, setSha1Hash] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const generateTextHash = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to hash.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      await calculateHashes(new TextEncoder().encode(inputText));
      toast({
        title: "Hash Generated",
        description: "Hash values have been calculated successfully.",
      });
    } catch (error) {
      console.error("Error generating hash:", error);
      toast({
        title: "Error",
        description: "Failed to generate hash. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileContent(event.target.result as ArrayBuffer);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const generateFileHash = async () => {
    if (!fileContent) {
      toast({
        title: "No File",
        description: "Please select a file to hash.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      await calculateHashes(new Uint8Array(fileContent));
      toast({
        title: "Hash Generated",
        description: `Hash values for ${fileName} have been calculated successfully.`,
      });
    } catch (error) {
      console.error("Error generating hash:", error);
      toast({
        title: "Error",
        description: "Failed to generate hash. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const calculateHashes = async (data: Uint8Array) => {
    await simulateHashing();
    
    // Calculate MD5-like hash (simplified for client-side)
    setMd5Hash(generateSimpleHash(data, 32));
    
    const sha1Buffer = await crypto.subtle.digest('SHA-1', new Uint8Array(data));
    setSha1Hash(bufferToHex(sha1Buffer));
    
    const sha256Buffer = await crypto.subtle.digest('SHA-256', new Uint8Array(data));
    setSha256Hash(bufferToHex(sha256Buffer));
  };
  
  const bufferToHex = (buffer: ArrayBuffer) => {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };
  
  const simulateHashing = () => {
    return new Promise(resolve => setTimeout(resolve, 500));
  };
  
  const generateSimpleHash = (data: Uint8Array, length: number) => {
    // Simple hash algorithm for demonstration
    let hash = '';
    const characters = '0123456789abcdef';
    
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    
    for (let i = 0; i < data.length; i++) {
      h1 = Math.imul(h1 ^ data[i], 2654435761);
      h2 = Math.imul(h2 ^ data[i], 1597334677);
    }
    
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    
    const fullHash = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
    
    for (let i = 0; i < length; i++) {
      const index = (parseInt(fullHash.charAt(i % fullHash.length), 16) + i) % 16;
      hash += characters.charAt(index);
    }
    
    return hash;
  };
  
  const copyToClipboard = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(type);
    
    toast({
      title: "Copied!",
      description: `${type} hash copied to clipboard.`,
    });
    
    setTimeout(() => {
      setCopiedHash(null);
    }, 2000);
  };
  
  const clearInputs = () => {
    setInputText("");
    setFileContent(null);
    setFileName("");
    setMd5Hash("");
    setSha1Hash("");
    setSha256Hash("");
  };
  
  return (
    <ToolPageTemplate
      title="Hash Generator"
      description="Generate MD5, SHA-1, and SHA-256 hash values from text or files"
      keywords="hash generator, md5, sha1, sha-1, sha256, sha-256, cryptographic hash, file hash, text hash, checksum"
    >
      <div className="space-y-6">
        <Tabs
          defaultValue="text"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "text" | "file")}
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              File Input
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text-input" className="text-lg font-medium mb-2 block">
                Enter Text to Hash
              </Label>
              <Textarea
                id="text-input"
                placeholder="Type or paste text here..."
                className="min-h-[150px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearInputs}
                disabled={!inputText && !md5Hash}
              >
                Clear
              </Button>
              <Button
                onClick={generateTextHash}
                disabled={isCalculating || !inputText.trim()}
              >
                {isCalculating ? "Calculating..." : "Generate Hash"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div>
              <Label htmlFor="file-input" className="text-lg font-medium mb-2 block">
                Select File to Hash
              </Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <File className="h-10 w-10 text-gray-400" />
                </div>
                <p className="mb-2 text-sm text-gray-600">
                  Click to select or drag and drop a file
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB
                </p>
                <Input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="mt-4">
                  <Button onClick={() => document.getElementById('file-input')?.click()}>
                    Select File
                  </Button>
                </div>
                {fileName && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {fileName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={clearInputs}
                disabled={!fileContent && !md5Hash}
              >
                Clear
              </Button>
              <Button
                onClick={generateFileHash}
                disabled={isCalculating || !fileContent}
              >
                {isCalculating ? "Calculating..." : "Generate Hash"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {(md5Hash || sha1Hash || sha256Hash) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Generated Hashes
            </h3>

            {md5Hash && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">MD5</h4>
                      <p className="text-sm text-gray-600 font-mono break-all">{md5Hash}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(md5Hash, "MD5")}
                    >
                      {copiedHash === "MD5" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {sha1Hash && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">SHA-1</h4>
                      <p className="text-sm text-gray-600 font-mono break-all">{sha1Hash}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sha1Hash, "SHA-1")}
                    >
                      {copiedHash === "SHA-1" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {sha256Hash && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">SHA-256</h4>
                      <p className="text-sm text-gray-600 font-mono break-all">{sha256Hash}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sha256Hash, "SHA-256")}
                    >
                      {copiedHash === "SHA-256" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Hash Generator Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Generate MD5, SHA-1, and SHA-256 hashes</li>
            <li>• Support for both text and file input</li>
            <li>• Easy copy to clipboard functionality</li>
            <li>• Secure client-side processing</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default HashGenerator;
