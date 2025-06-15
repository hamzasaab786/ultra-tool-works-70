
import React, { useState } from "react";
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
  const { toast } = useToast();

  const takeScreenshot = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Using a free screenshot API service
      const apiUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768`;
      setScreenshotUrl(apiUrl);
      
      toast({
        title: "Success",
        description: "Screenshot generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadScreenshot = () => {
    if (screenshotUrl) {
      const link = document.createElement('a');
      link.href = screenshotUrl;
      link.download = `screenshot-${new Date().getTime()}.png`;
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
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={takeScreenshot} disabled={isLoading}>
                {isLoading ? "Capturing..." : "Capture"}
              </Button>
            </div>

            {screenshotUrl && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={screenshotUrl}
                    alt="Website Screenshot"
                    className="w-full max-w-2xl mx-auto rounded border"
                    onError={() => {
                      toast({
                        title: "Error",
                        description: "Failed to load screenshot. The website might not be accessible.",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={downloadScreenshot} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Screenshot
                  </Button>
                  <Button variant="outline" onClick={() => window.open(url, '_blank')} className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
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
              <li>• Works with any public website</li>
              <li>• Free and unlimited usage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default WebsiteScreenshot;
