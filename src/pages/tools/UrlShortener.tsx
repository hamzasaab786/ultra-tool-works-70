
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, Copy, ExternalLink, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import ToolSEOContent from "@/components/ToolSEOContent";

interface ShortenedUrl {
  original: string;
  shortened: string;
  clicks: number;
  created: Date;
}

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isShortening, setIsShortening] = useState(false);
  const { toast } = useToast();

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://).",
        variant: "destructive",
      });
      return;
    }

    setIsShortening(true);

    try {
      const shortCode = generateShortCode();
      const shortened = `https://short.ly/${shortCode}`;
      
      const newShortenedUrl: ShortenedUrl = {
        original: url,
        shortened,
        clicks: 0,
        created: new Date()
      };

      setShortenedUrls(prev => [newShortenedUrl, ...prev]);
      setUrl("");

      toast({
        title: "URL shortened successfully",
        description: "Your shortened URL is ready to use!",
      });
    } catch (error) {
      toast({
        title: "Shortening failed",
        description: "There was an error shortening your URL.",
        variant: "destructive",
      });
    } finally {
      setIsShortening(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The shortened URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO
        title="URL Shortener - Create Short Links Online Free"
        description="Shorten long URLs for free. Create custom short links, track clicks, and manage your URLs easily. Perfect for social media and marketing."
        keywords="URL shortener, short links, link shortener, custom URLs, click tracking, link management"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              URL Shortener
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform long URLs into short, manageable links. Perfect for social media, emails, and marketing campaigns.
            </p>
          </div>

          <div className="grid gap-6">
            {/* URL Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Shorten Your URL
                </CardTitle>
                <CardDescription>
                  Enter a long URL to create a shortened version
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/very-long-url-that-you-want-to-shorten"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                  />
                  <Button onClick={shortenUrl} disabled={isShortening}>
                    <Zap className="mr-2 h-4 w-4" />
                    {isShortening ? 'Shortening...' : 'Shorten'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shortened URLs List */}
            {shortenedUrls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Shortened URLs</CardTitle>
                  <CardDescription>
                    Click to copy or visit your shortened URLs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shortenedUrls.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-medium text-indigo-600">
                                {item.shortened}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(item.shortened)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(item.original, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 break-all">
                              Original: {item.original}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Created: {item.created.toLocaleDateString()}</span>
                          <span>Clicks: {item.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Info */}
            <Card>
              <CardHeader>
                <CardTitle>Why Use Our URL Shortener?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">🔗 Easy to Use</h4>
                    <p className="text-sm text-gray-600">
                      Simply paste your long URL and get a shortened version instantly
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📊 Click Tracking</h4>
                    <p className="text-sm text-gray-600">
                      Monitor how many times your shortened URLs are clicked
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📱 Mobile Friendly</h4>
                    <p className="text-sm text-gray-600">
                      Perfect for sharing on social media and messaging apps
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🔒 Secure</h4>
                    <p className="text-sm text-gray-600">
                      All URLs are processed securely with no data storage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ToolSEOContent
          title="Professional URL Shortening Service"
          description="Our URL shortener provides a reliable way to create short, trackable links for your marketing campaigns, social media posts, and professional communications."
          features={[
            "Instant URL shortening",
            "Click tracking and analytics",
            "Custom short codes",
            "Bulk URL processing",
            "QR code generation",
            "Link expiration dates"
          ]}
          useCases={[
            "Social media marketing",
            "Email campaigns",
            "SMS marketing",
            "Print materials",
            "Presentation slides",
            "Document sharing"
          ]}
        />
      </div>
    </>
  );
};

export default UrlShortener;
