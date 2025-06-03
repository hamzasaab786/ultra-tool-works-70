import React, { useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, Link, ExternalLink, Clock } from "lucide-react";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState<{ original: string, shortened: string }[]>([]);
  const { toast } = useToast();
  
  // Load recent URLs from localStorage on component mount
  useEffect(() => {
    const savedUrls = localStorage.getItem("shortened-urls");
    if (savedUrls) {
      try {
        setRecentUrls(JSON.parse(savedUrls));
      } catch (e) {
        console.error("Failed to parse saved URLs:", e);
        // If parsing fails, reset the storage
        localStorage.removeItem("shortened-urls");
      }
    }
  }, []);
  
  // Save recent URLs to localStorage when they change
  useEffect(() => {
    if (recentUrls.length > 0) {
      localStorage.setItem("shortened-urls", JSON.stringify(recentUrls));
    }
  }, [recentUrls]);
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const generateShortUrl = () => {
    if (!longUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }
    
    // Add protocol if missing
    let urlToShorten = longUrl;
    if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
      urlToShorten = "https://" + urlToShorten;
    }
    
    if (!isValidUrl(urlToShorten)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // In a real application, this would make an API call to a URL shortening service
    // For this demo, we'll generate a mock shortened URL
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate a random 6-character string
        const randomChars = Math.random().toString(36).substring(2, 8);
        
        // Create a mock shortened URL
        const mockShortUrl = `https://short.ly/${randomChars}`;
        setShortUrl(mockShortUrl);
        
        // Add to recent URLs
        setRecentUrls(prev => {
          // Only keep the most recent 5 URLs
          const newUrls = [{ original: urlToShorten, shortened: mockShortUrl }, ...prev];
          return newUrls.slice(0, 5);
        });
        
        toast({
          title: "URL Shortened",
          description: "Your shortened URL is ready to copy!",
        });
      } catch (error) {
        console.error("Error shortening URL:", error);
        toast({
          title: "Error",
          description: "Failed to shorten URL. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };
  
  const copyToClipboard = (url: string = shortUrl) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const clearHistory = () => {
    setRecentUrls([]);
    localStorage.removeItem("shortened-urls");
    toast({
      title: "History Cleared",
      description: "Your URL shortening history has been cleared.",
    });
  };
  
  return (
    <ToolPageTemplate
      title="URL Shortener"
      description="Quickly create shortened URLs to make long links more manageable and shareable"
      keywords="url shortener, link shortener, shorten url, tiny url, short links, link management"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="long-url" className="text-base font-medium">
              Enter a long URL to shorten
            </Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="long-url"
                type="text"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={generateShortUrl}
                disabled={isGenerating || !longUrl}
              >
                {isGenerating ? "Shortening..." : "Shorten"}
              </Button>
            </div>
          </div>
          
          {shortUrl && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Your shortened URL</Label>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-2">
                    <Link className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={shortUrl}
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-1 font-medium text-blue-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard()}
                      className="flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex items-center">
                    <p>
                      Note: This is a demo URL shortener. In a real application, this would
                      connect to a backend service that stores and redirects URLs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {recentUrls.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Recent URLs</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-xs"
              >
                Clear History
              </Button>
            </div>
            <div className="space-y-2">
              {recentUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 border border-gray-200 rounded-md"
                >
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-medium text-blue-700 truncate">{url.shortened}</p>
                    <p className="text-xs text-gray-500 truncate">{url.original}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(url.shortened)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Benefits of URL Shortening</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-0.5">
                <Link className="h-4 w-4 text-indigo-700" />
              </div>
              <span className="text-gray-700">Make long URLs more manageable and easier to share</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-0.5">
                <ExternalLink className="h-4 w-4 text-indigo-700" />
              </div>
              <span className="text-gray-700">Ideal for social media posts with character limits</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-0.5">
                <Clock className="h-4 w-4 text-indigo-700" />
              </div>
              <span className="text-gray-700">Track click analytics and monitor link performance</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default UrlShortener;
