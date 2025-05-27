
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ArrowUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Base64Tool = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("encode");

  const encodeToBase64 = useCallback(() => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      toast({
        title: "Success",
        description: "Text encoded to Base64",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode text",
        variant: "destructive"
      });
    }
  }, [inputText]);

  const decodeFromBase64 = useCallback(() => {
    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      toast({
        title: "Success",
        description: "Base64 decoded to text",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Base64 string",
        variant: "destructive"
      });
    }
  }, [inputText]);

  const copyToClipboard = useCallback(async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  }, [outputText]);

  const clearAll = useCallback(() => {
    setInputText("");
    setOutputText("");
  }, []);

  return (
    <ToolPageTemplate
      title="Base64 Encoder & Decoder"
      description="Convert text to Base64 and decode Base64 to text instantly"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plaintext">Plain Text</Label>
                  <Textarea
                    id="plaintext"
                    placeholder="Enter text to encode..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Characters: {inputText.length}
                  </p>
                </div>
                <Button onClick={encodeToBase64} disabled={!inputText} className="w-full">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Encode to Base64
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="base64output">Base64 Output</Label>
                  <Textarea
                    id="base64output"
                    value={outputText}
                    readOnly
                    className="min-h-[200px] bg-gray-50"
                    placeholder="Encoded text will appear here..."
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Characters: {outputText.length}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={copyToClipboard} 
                    disabled={!outputText}
                    variant="outline"
                    className="flex-1"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="base64input">Base64 Input</Label>
                  <Textarea
                    id="base64input"
                    placeholder="Enter Base64 to decode..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Characters: {inputText.length}
                  </p>
                </div>
                <Button onClick={decodeFromBase64} disabled={!inputText} className="w-full">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Decode from Base64
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="plaintextoutput">Plain Text Output</Label>
                  <Textarea
                    id="plaintextoutput"
                    value={outputText}
                    readOnly
                    className="min-h-[200px] bg-gray-50"
                    placeholder="Decoded text will appear here..."
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Characters: {outputText.length}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={copyToClipboard} 
                    disabled={!outputText}
                    variant="outline"
                    className="flex-1"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolPageTemplate>
  );
};

export default Base64Tool;
