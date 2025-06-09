
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock } from "lucide-react";
import SEO from "@/components/SEO";

const TextEncryption = () => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { toast } = useToast();

  const simpleEncrypt = (text: string, password: string) => {
    // Simple Caesar cipher for demo purposes
    let result = "";
    const shift = password.length;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      } else {
        result += char;
      }
    }
    return btoa(result); // Base64 encode
  };

  const simpleDecrypt = (text: string, password: string) => {
    try {
      const decoded = atob(text); // Base64 decode
      let result = "";
      const shift = password.length;
      for (let i = 0; i < decoded.length; i++) {
        const char = decoded[i];
        if (char.match(/[a-z]/i)) {
          const code = decoded.charCodeAt(i);
          if (code >= 65 && code <= 90) {
            result += String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
          }
        } else {
          result += char;
        }
      }
      return result;
    } catch {
      return "Error: Invalid encrypted text";
    }
  };

  const processText = () => {
    if (!text || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both text and password.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "encrypt") {
      setResult(simpleEncrypt(text, password));
      toast({
        title: "Text encrypted",
        description: "Your text has been encrypted successfully.",
      });
    } else {
      setResult(simpleDecrypt(text, password));
      toast({
        title: "Text decrypted",
        description: "Your text has been decrypted successfully.",
      });
    }
  };

  return (
    <>
      <SEO
        title="Text Encryption - Encrypt & Decrypt Text Online Free"
        description="Encrypt and decrypt text online with password protection. Simple and secure text encryption tool for protecting sensitive information."
        keywords="text encryption, encrypt text, decrypt text, password protection, secure text, text cipher"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Text Encryption
            </h1>
            <p className="text-lg text-gray-600">
              Encrypt and decrypt text with password protection
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={mode === "encrypt" ? "default" : "outline"}
                    onClick={() => setMode("encrypt")}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Encrypt
                  </Button>
                  <Button
                    variant={mode === "decrypt" ? "default" : "outline"}
                    onClick={() => setMode("decrypt")}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Decrypt
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>
                  Enter the text you want to {mode}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`Enter text to ${mode}...`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px]"
                />
                <Input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={processText}>
                  {mode === "encrypt" ? "Encrypt Text" : "Decrypt Text"}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[120px] bg-gray-50"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>⚠️ Security Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This is a simple encryption tool for demonstration purposes. 
                  For sensitive data, use proper encryption methods and secure key management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextEncryption;
