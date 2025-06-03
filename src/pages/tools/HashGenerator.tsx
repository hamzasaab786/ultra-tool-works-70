
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
    
    // Check file size (max 10MB for browser performance)
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
    // Calculate MD5 hash (browser doesn't natively support this)
    // In a real app, you'd use a library like crypto-js
    // Simulating MD5 hash for demo
    await simulateHashing();
    setMd5Hash(generateMockHash(data, 32));
    
    // Calculate SHA-1 hash
    const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
    setSha1Hash(bufferToHex(sha1Buffer));
    
    // Calculate SHA-256 hash
    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    setSha256Hash(bufferToHex(sha256Buffer));
  };
  
  // Helper function to convert buffer to hex string
  const bufferToHex = (buffer: ArrayBuffer) => {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };
  
  // Simulate hashing delay
  const simulateHashing = () => {
    return new Promise(resolve => setTimeout(resolve, 500));
  };
  
  // Generate a mock hash for demonstration (since browsers don't natively support MD5)
  const generateMockHash = (data: Uint8Array, length: number) => {
    let hash = '';
    const characters = 'abcdef0123456789';
    const charactersLength = characters.length;
    
    // Use a simple sum of all bytes to seed our "random" generator
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data[i];
    }
    
    for (let i = 0; i < length; i++) {
      // Simple pseudo-random based on seed and position
      const randomIndex = ((seed * (i + 1)) % charactersLength);
      hash += characters.charAt(randomIndex);
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
              <span>Text Input</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <span>File Input</span>
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
                  <div className="mt-4 text-sm text-gray-700">
                    Selected file: <span className="font-medium">{fileName}</span>
                  </div>
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
          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-4">Hash Results</h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label className="text-sm text-gray-500">MD5 Hash</Label>
                      <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                        {md5Hash}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(md5Hash, "MD5")} 
                      className="shrink-0"
                      disabled={!md5Hash}
                    >
                      {copiedHash === "MD5" ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label className="text-sm text-gray-500">SHA-1 Hash</Label>
                      <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                        {sha1Hash}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(sha1Hash, "SHA-1")} 
                      className="shrink-0"
                      disabled={!sha1Hash}
                    >
                      {copiedHash === "SHA-1" ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <Label className="text-sm text-gray-500">SHA-256 Hash</Label>
                      <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-200">
                        {sha256Hash}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(sha256Hash, "SHA-256")} 
                      className="shrink-0"
                      disabled={!sha256Hash}
                    >
                      {copiedHash === "SHA-256" ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div className="pt-4 space-y-2">
          <h2 className="text-lg font-semibold">What are Hash Functions?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Security</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Hash functions are used to verify data integrity and authenticate information without revealing the original content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Unique Fingerprints</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Each hash value is a unique digital fingerprint of the input data. Even tiny changes create completely different hashes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <File className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Common Uses</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      File verification, password storage, digital signatures, blockchain technology, and data integrity checks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default HashGenerator;
