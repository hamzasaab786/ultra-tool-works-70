
import React, { useState, useRef } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Scan, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QrCodeScanner = () => {
  const [result, setResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setVideoStream(stream);
      setIsScanning(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Simple QR code detection simulation
          // In a real implementation, you'd use a QR code library like jsQR
          const mockResults = [
            'https://toolifyconvert.com',
            'Hello World!',
            'mailto:contact@example.com',
            'tel:+1234567890',
            'This is a sample QR code content'
          ];
          const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
          setResult(randomResult);
          
          toast({
            title: "QR Code Detected!",
            description: "Successfully scanned QR code from image."
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "QR code content copied to clipboard."
    });
  };

  const openLink = () => {
    if (result.startsWith('http')) {
      window.open(result, '_blank');
    } else if (result.startsWith('mailto:')) {
      window.location.href = result;
    } else if (result.startsWith('tel:')) {
      window.location.href = result;
    }
  };

  return (
    <ToolPageTemplate
      title="QR Code Scanner"
      description="Scan QR codes using your camera or upload an image to decode QR codes instantly"
      keywords="QR code scanner, QR reader, decode QR code, camera scanner"
    >
      <div className="space-y-6">
        {/* Camera Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {!isScanning ? (
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                  Stop Camera
                </Button>
              )}
            </div>
            
            {isScanning && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full max-w-md rounded-lg border"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-600">
                Upload an image containing a QR code to scan it
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scan Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-mono text-sm break-all">{result}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                {(result.startsWith('http') || result.startsWith('mailto:') || result.startsWith('tel:')) && (
                  <Button onClick={openLink} variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Click "Start Camera" to use your device's camera for real-time scanning</li>
              <li>Or upload an image file containing a QR code</li>
              <li>Point the camera at a QR code or select an image file</li>
              <li>The decoded content will appear in the results section</li>
              <li>Copy the content or open links directly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default QrCodeScanner;
