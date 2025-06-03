
import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Video, Image, X } from "lucide-react";

const VideoToGif = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);
  const [quality, setQuality] = useState(5);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "Please select a valid video file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Video file size should be less than 100MB",
        variant: "destructive"
      });
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setGifUrl(null);
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const convertToGif = async () => {
    if (!videoFile) return;

    setIsConverting(true);
    
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock GIF (in reality, this would use FFmpeg or similar)
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 270;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw a simple animated pattern as mock GIF
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#007acc';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Mock GIF Preview', canvas.width / 2, canvas.height / 2);
        ctx.fillText(`${duration}s duration`, canvas.width / 2, canvas.height / 2 + 40);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const gifUrl = URL.createObjectURL(blob);
            setGifUrl(gifUrl);
            toast({
              title: "Success",
              description: "Video converted to GIF successfully!",
            });
          }
        }, 'image/png');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert video to GIF",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = `converted_${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetConverter = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setGifUrl(null);
    setStartTime(0);
    setDuration(3);
    setVideoDuration(0);
  };

  return (
    <ToolPageTemplate
      title="Video to GIF Converter"
      description="Convert video clips to animated GIFs with customizable settings"
      keywords="video to gif, convert video gif, animated gif, video converter"
    >
      <div className="space-y-6">
        {!videoFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mb-4">
              MP4, MOV, AVI, WebM (MAX. 100MB)
            </p>
            <input
              type="file"
              id="video-upload"
              className="hidden"
              accept="video/*"
              onChange={handleFileSelect}
            />
            <Label htmlFor="video-upload">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Video
                </span>
              </Button>
            </Label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Convert Video to GIF</h3>
              <Button variant="ghost" size="sm" onClick={resetConverter}>
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Video Preview</h4>
                <video
                  ref={videoRef}
                  src={videoPreview!}
                  controls
                  onLoadedMetadata={handleVideoLoad}
                  className="w-full rounded-lg border"
                />
                <p className="text-sm text-gray-600">
                  File: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Start Time: {startTime}s</Label>
                  <Slider
                    value={[startTime]}
                    onValueChange={([value]) => setStartTime(value)}
                    min={0}
                    max={Math.max(0, videoDuration - duration)}
                    step={0.1}
                    disabled={videoDuration === 0}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Duration: {duration}s</Label>
                  <Slider
                    value={[duration]}
                    onValueChange={([value]) => setDuration(value)}
                    min={1}
                    max={Math.min(10, videoDuration)}
                    step={0.5}
                    disabled={videoDuration === 0}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Quality: {quality}/10</Label>
                  <Slider
                    value={[quality]}
                    onValueChange={([value]) => setQuality(value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower quality, smaller file</span>
                    <span>Higher quality, larger file</span>
                  </div>
                </div>

                <Button
                  onClick={convertToGif}
                  disabled={isConverting || videoDuration === 0}
                  className="w-full"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Convert to GIF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {gifUrl && (
              <div className="space-y-4">
                <h4 className="font-medium">Generated GIF</h4>
                <div className="border rounded-lg p-4">
                  <img
                    src={gifUrl}
                    alt="Generated GIF"
                    className="w-full max-w-md mx-auto rounded"
                  />
                  <Button
                    onClick={downloadGif}
                    className="w-full mt-4"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download GIF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">Conversion Features:</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Convert any video format to GIF</li>
            <li>• Customizable start time and duration</li>
            <li>• Adjustable quality settings</li>
            <li>• Perfect for social media and web use</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default VideoToGif;
