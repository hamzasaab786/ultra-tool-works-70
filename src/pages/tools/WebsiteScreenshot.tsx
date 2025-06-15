
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolPageTemplate from "./ToolPageTemplate";

const WebsiteScreenshot = () => {
  const [url, setUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem("screenshotMachineApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("screenshotMachineApiKey", newApiKey);
  };

  const takeScreenshot = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Screenshot Machine API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setScreenshotUrl("");

    const apiUrl = `https://api.screenshotmachine.com/?key=${apiKey}&url=${encodeURIComponent(
      url
    )}&dimension=1024x768`;

    const img = new Image();
    img.onload = () => {
      setScreenshotUrl(apiUrl);
      toast({
        title: "Success",
        description: "Screenshot generated successfully!",
      });
      setIsLoading(false);
    };
    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to capture screenshot. Please check the URL and your API key.",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    img.src = apiUrl;
  };

  const downloadScreenshot = () => {
    if (screenshotUrl) {
      const link = document.createElement('a');
      link.href = screenshotUrl;
      link.download = `screenshot-${new Date().getTime()}.png`;
      // This will open the image in a new tab for the user to save, as direct download is often blocked by browsers for cross-origin resources.
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <ToolPageTemplate
      title="Website Screenshot Capture"
      description="Capture high-quality screenshots of any website instantly"
      keywords="website screenshot, webpage capture, screen capture, site preview"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Capture Website Screenshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                Screenshot Machine API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={handleApiKeyChange}
              />
              <p className="text-xs text-gray-500">
                Get your free API key from{" "}
                <a href="https://screenshotmachine.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  screenshotmachine.com
                </a>. Your key is saved in your browser's local storage.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={takeScreenshot} disabled={isLoading || !apiKey}>
                {isLoading ? "Capturing..." : "Capture"}
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <p>Loading screenshot...</p>
              </div>
            )}

            {screenshotUrl && !isLoading && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={screenshotUrl}
                    alt="Website Screenshot"
                    className="w-full max-w-2xl mx-auto rounded border"
                  />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={downloadScreenshot} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Screenshot
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Capture full-page screenshots of any website</li>
              <li>• High-quality PNG format output</li>
              <li>• Instant preview and download</li>
              <li>• Requires a free API key from screenshotmachine.com</li>
              <li>• Your API key is stored securely in your browser</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default WebsiteScreenshot;
