
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Link, Scissors } from "lucide-react";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { toast } = useToast();

  const generateShortUrl = () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    setIsShortening(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate a mock short URL
      const shortCode = Math.random().toString(36).substring(2, 8);
      const shortened = `https://short.ly/${shortCode}`;
      setShortUrl(shortened);
      setIsShortening(false);
      
      toast({
        title: "Success",
        description: "URL shortened successfully!",
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrl(true);
    
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
    
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const resetUrls = () => {
    setOriginalUrl("");
    setShortUrl("");
    setCopiedUrl(false);
  };

  return (
    <ToolPageTemplate
      title="URL Shortener"
      description="Create short links from long URLs for easy sharing"
      keywords="url shortener, short link, link shortener, tiny url"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="original-url" className="text-lg font-medium">
              Enter URL to Shorten
            </Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="mt-2 h-12 text-base"
            />
          </div>

          <Button
            onClick={generateShortUrl}
            disabled={isShortening || !originalUrl.trim()}
            className="w-full h-12 text-base"
          >
            {isShortening ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Shortening...
              </>
            ) : (
              <>
                <Scissors className="mr-2 h-5 w-5" />
                Shorten URL
              </>
            )}
          </Button>
        </div>

        {shortUrl && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Link className="mr-2 h-5 w-5" />
                  Your Shortened URL
                </h3>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={shortUrl}
                    readOnly
                    className="flex-1 bg-white"
                  />
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copiedUrl ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Original:</strong> {originalUrl}</p>
                  <p><strong>Shortened:</strong> {shortUrl}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {shortUrl && (
          <Button variant="outline" onClick={resetUrls} className="w-full">
            Create Another Short URL
          </Button>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Instant URL shortening</li>
            <li>• Easy copy to clipboard</li>
            <li>• Clean, professional short links</li>
            <li>• Perfect for social media sharing</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default UrlShortener;
