
import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Video, Play, Film, XCircle } from "lucide-react";

const VideoToGif = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(7);
  const [frameRate, setFrameRate] = useState(10);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [width, setWidth] = useState(320);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle video file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please upload a valid video file (MP4, WebM, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 50MB",
        variant: "destructive"
      });
      return;
    }
    
    // Reset previous conversion
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      setGifUrl(null);
      setGifBlob(null);
    }
    
    setVideoFile(file);
    
    // Create video source URL
    const objectUrl = URL.createObjectURL(file);
    setVideoSrc(objectUrl);
    
    // Reset time settings
    setStartTime(0);
    setDuration(5);
  };
  
  // Update duration when video metadata is loaded
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      // Default to full video duration, capped at 10 seconds
      setDuration(Math.min(videoDuration, 10));
    }
  };
  
  const handleStartTimeChange = (value: number[]) => {
    const newStartTime = value[0];
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      
      // Ensure start time + duration doesn't exceed video length
      if (newStartTime + duration > videoDuration) {
        setDuration(Math.max(1, videoDuration - newStartTime));
      }
      
      setStartTime(newStartTime);
      
      // Update video current time to show the selected position
      videoRef.current.currentTime = newStartTime;
    }
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      
      // Ensure start time + duration doesn't exceed video length
      if (startTime + newDuration > videoDuration) {
        setDuration(Math.max(1, videoDuration - startTime));
      } else {
        setDuration(newDuration);
      }
    }
  };
  
  // Simple GIF conversion using HTML Canvas and videos frames
  // In a real app, you'd use a proper library like ffmpeg.wasm
  const convertToGif = async () => {
    if (!videoRef.current || !videoFile) return;
    
    setIsConverting(true);
    toast({
      title: "Starting conversion",
      description: "Converting your video to GIF... Please wait",
    });
    
    try {
      const video = videoRef.current;
      video.currentTime = startTime;
      
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast({
          title: "Error",
          description: "Your browser doesn't support canvas operations",
          variant: "destructive"
        });
        setIsConverting(false);
        return;
      }
      
      // Set canvas size based on input
      canvas.width = width;
      canvas.height = Math.round(width * (video.videoHeight / video.videoWidth));
      
      // For a simple implementation, capture frames at set intervals
      const frames: ImageData[] = [];
      const endTime = startTime + duration;
      let currentTime = startTime;
      const interval = 1000 / frameRate;
      
      // Function to capture frames
      const captureFrame = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
      
      // Capture frames by advancing video time
      const captureFrames = () => {
        return new Promise<void>((resolve) => {
          const processFrame = () => {
            if (currentTime <= endTime) {
              video.currentTime = currentTime;
              currentTime += interval / 1000;
              
              // Wait for video to update to the new time
              video.onseeked = () => {
                captureFrame();
                requestAnimationFrame(processFrame);
              };
            } else {
              resolve();
            }
          };
          
          processFrame();
        });
      };
      
      // Wait for the initial seek to complete
      await new Promise<void>(resolve => {
        video.onseeked = () => resolve();
      });
      
      // Capture all frames
      await captureFrames();
      
      // In a real app, you'd use a proper GIF encoder library
      // For this demo, we'll create a mock GIF by drawing the frames to a canvas
      // and converting to PNG (not a real GIF, just for demo purposes)
      const mockGifCanvas = document.createElement('canvas');
      mockGifCanvas.width = canvas.width;
      mockGifCanvas.height = canvas.height;
      const mockCtx = mockGifCanvas.getContext('2d');
      
      if (!mockCtx) {
        throw new Error("Canvas context not available");
      }
      
      // Draw the last frame to create a static image
      mockCtx.putImageData(frames[frames.length - 1], 0, 0);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        mockGifCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to create image blob"));
          },
          'image/png',
          quality / 10
        );
      });
      
      setGifBlob(blob);
      
      // Create URL for preview
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      
      toast({
        title: "Conversion complete",
        description: "Your video has been converted! Click Download to save.",
      });
    } catch (error) {
      console.error("Error converting video:", error);
      toast({
        title: "Conversion failed",
        description: "Failed to convert video to GIF. Please try a different video or settings.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleDownload = () => {
    if (!gifBlob || !videoFile) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = gifUrl as string;
    
    // Set filename based on original video name
    const originalName = videoFile.name.split('.').slice(0, -1).join('.');
    link.download = `${originalName}.gif`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const clearVideo = () => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
    }
    
    setVideoFile(null);
    setVideoSrc(null);
    setGifBlob(null);
    setGifUrl(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <ToolPageTemplate
      title="Video to GIF Converter"
      description="Convert videos to high-quality animated GIFs with customizable settings"
      keywords="video to gif, mp4 to gif, animated gif, video converter, gif maker, animation creator"
    >
      <div className="space-y-6">
        {/* Upload section */}
        {!videoFile && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Upload a Video to Convert</h2>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              Support for MP4, WebM videos up to 50MB. For best results, use short videos under 10 seconds.
            </p>
            
            <div className="flex gap-4 mt-2">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Select Video
              </Button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="video/*"
            />
          </div>
        )}
        
        {/* Video preview and settings */}
        {videoSrc && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Video Preview</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearVideo}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              </div>
              
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full h-auto"
                  onLoadedMetadata={handleVideoMetadata}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                {videoFile && (
                  <p>File: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">GIF Settings</h2>
              
              <div>
                <Label htmlFor="startTime" className="mb-2 block">
                  Start Time: {startTime.toFixed(2)}s
                </Label>
                <Slider
                  id="startTime"
                  min={0}
                  max={videoRef.current ? Math.max(0, videoRef.current.duration - 1) : 100}
                  step={0.1}
                  value={[startTime]}
                  onValueChange={handleStartTimeChange}
                />
              </div>
              
              <div>
                <Label htmlFor="duration" className="mb-2 block">
                  Duration: {duration.toFixed(2)}s
                </Label>
                <Slider
                  id="duration"
                  min={1}
                  max={10}
                  step={0.1}
                  value={[duration]}
                  onValueChange={handleDurationChange}
                />
              </div>
              
              <div>
                <Label htmlFor="frameRate" className="mb-2 block">
                  Frame Rate: {frameRate} FPS
                </Label>
                <Slider
                  id="frameRate"
                  min={1}
                  max={30}
                  step={1}
                  value={[frameRate]}
                  onValueChange={(value) => setFrameRate(value[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher FPS creates smoother GIFs but larger file sizes
                </p>
              </div>
              
              <div>
                <Label htmlFor="quality" className="mb-2 block">
                  Quality: {quality}/10
                </Label>
                <Slider
                  id="quality"
                  min={1}
                  max={10}
                  step={1}
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                />
              </div>
              
              <div>
                <Label htmlFor="width" className="mb-2 block">
                  Width: {width}px
                </Label>
                <Slider
                  id="width"
                  min={100}
                  max={800}
                  step={10}
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Smaller width = smaller file size
                </p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={convertToGif}
                disabled={isConverting || !videoFile}
              >
                {isConverting ? 'Converting...' : 'Convert to GIF'}
                {!isConverting && <Film className="ml-2 h-4 w-4" />}
              </Button>
              
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                Note: This is a browser-based conversion that creates a static image in this demo. 
                For a full GIF conversion, a dedicated library would be used.
              </p>
            </div>
          </div>
        )}
        
        {/* Result section */}
        {gifUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">GIF Preview</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-gray-100 rounded-lg p-2 flex-1">
                <img 
                  src={gifUrl} 
                  alt="Converted GIF" 
                  className="mx-auto max-w-full h-auto rounded"
                />
              </div>
              
              <div className="flex flex-col gap-4">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download GIF
                </Button>
                
                {gifBlob && (
                  <p className="text-sm text-gray-500">
                    File size: {(gifBlob.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default VideoToGif;
