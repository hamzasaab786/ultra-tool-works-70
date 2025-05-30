
import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { QrCode, Link as LinkIcon, Mail, Phone, MessageSquare, Wifi, ImageIcon, Download, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import GradientColorPicker from "@/components/GradientColorPicker";
import QRCode from 'qrcode';

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState([300]);
  const [isGradient, setIsGradient] = useState(false);
  const [gradientStart, setGradientStart] = useState("#3b82f6");
  const [gradientEnd, setGradientEnd] = useState("#8b5cf6");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const generateQR = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your QR code",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formattedText = formatTextForQR();
      const size = qrSize[0];
      
      if (isGradient) {
        // Generate QR with gradient using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = size;
        canvas.height = size;
        
        // Generate QR code data
        const qrData = await QRCode.toCanvas(canvas, formattedText, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: bgColor
          }
        });
        
        // Get image data to manipulate pixels
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);
        
        // Apply gradient to dark pixels
        for (let i = 0; i < data.length; i += 4) {
          // If pixel is dark (QR code foreground)
          if (data[i] < 128) {
            const x = (i / 4) % size;
            const y = Math.floor(i / 4 / size);
            
            // Calculate gradient color at this position
            const ratio = (x + y) / (size * 2);
            const startColor = hexToRgb(gradientStart);
            const endColor = hexToRgb(gradientEnd);
            
            if (startColor && endColor) {
              data[i] = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);     // R
              data[i + 1] = Math.round(startColor.g + (endColor.g - startColor.g) * ratio); // G
              data[i + 2] = Math.round(startColor.b + (endColor.b - startColor.b) * ratio); // B
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const qrUrl = canvas.toDataURL('image/png');
        setQrCodeUrl(qrUrl);
      } else {
        // Generate simple QR code
        const qrUrl = await QRCode.toDataURL(formattedText, {
          width: size,
          margin: 2,
          color: {
            dark: qrColor,
            light: bgColor
          }
        });
        setQrCodeUrl(qrUrl);
      }
      
      setLoading(false);
      toast({
        title: "Success",
        description: "QR code generated successfully!",
      });
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const generateImageQR = () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    // For image QR, we'll encode a reference to the image
    const imageText = `Image uploaded - ${new Date().toISOString()}`;
    setText(imageText);
    generateQR();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 2MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const downloadQRCode = async () => {
    if (!qrCodeUrl) {
      toast({
        title: "Error", 
        description: "Generate a QR code first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "QR code download started!",
      });
    } catch (error) {
      console.error('Download error:', error);
      window.open(qrCodeUrl, '_blank');
      toast({
        title: "Download Started",
        description: "QR code opened in new tab for download",
      });
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setText("");
    setQrCodeUrl("");
    setSelectedImage(null);
  };
  
  const getPlaceholderText = () => {
    switch (activeTab) {
      case "url":
        return "https://example.com";
      case "text":
        return "Enter your text here";
      case "email":
        return "example@email.com";
      case "phone":
        return "+1234567890";
      case "sms":
        return "+1234567890";
      case "wifi":
        return "Network Name";
      default:
        return "";
    }
  };
  
  const formatTextForQR = () => {
    switch (activeTab) {
      case "url":
        return text.startsWith("http") ? text : `https://${text}`;
      case "email":
        return `mailto:${text}`;
      case "phone":
        return `tel:${text}`;
      case "sms":
        return `sms:${text}`;
      case "wifi":
        return `WIFI:S:${text};;`;
      default:
        return text;
    }
  };
  
  return (
    <ToolPageTemplate
      title="Advanced QR Code Generator"
      description="Professional QR code generator with customization options - Create QR codes for URLs, text, contact info, WiFi, and images with custom colors and gradients"
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            📱 Create professional QR codes for any content including images, URLs, contact information, and more. Perfect for marketing, business cards, and digital sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex items-center gap-1">
                  <Wifi className="h-4 w-4" />
                  WiFi
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <GradientColorPicker
                  startColor={gradientStart}
                  endColor={gradientEnd}
                  onStartColorChange={setGradientStart}
                  onEndColorChange={setGradientEnd}
                  isGradient={isGradient}
                  onGradientToggle={setIsGradient}
                  solidColor={qrColor}
                  onSolidColorChange={setQrColor}
                />
                
                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-8"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#ffffff"
                      className="text-xs"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Size: {qrSize[0]}px</Label>
                  <Slider
                    value={qrSize}
                    onValueChange={setQrSize}
                    max={500}
                    min={200}
                    step={10}
                    className="w-full mt-2"
                  />
                </div>
              </div>
              
              <TabsContent value="url">
                <Label htmlFor="url-input">Enter Website URL</Label>
                <Input
                  id="url-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </Button>
              </TabsContent>
              
              <TabsContent value="text">
                <Label htmlFor="text-input">Enter Text</Label>
                <Input
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </Button>
              </TabsContent>

              <TabsContent value="email">
                <Label htmlFor="email-input">Enter Email Address</Label>
                <Input
                  id="email-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate Email QR Code"}
                </Button>
              </TabsContent>

              <TabsContent value="phone">
                <Label htmlFor="phone-input">Enter Phone Number</Label>
                <Input
                  id="phone-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate Phone QR Code"}
                </Button>
              </TabsContent>

              <TabsContent value="sms">
                <Label htmlFor="sms-input">Enter Phone Number for SMS</Label>
                <Input
                  id="sms-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate SMS QR Code"}
                </Button>
              </TabsContent>

              <TabsContent value="wifi">
                <Label htmlFor="wifi-input">Enter WiFi Network Name</Label>
                <Input
                  id="wifi-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
                <Button 
                  onClick={generateQR} 
                  className="w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate WiFi QR Code"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center justify-center min-h-[300px] w-full bg-gray-50 rounded-md mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-auto h-auto max-w-full max-h-full"
                  style={{ maxWidth: `${qrSize[0]}px`, maxHeight: `${qrSize[0]}px` }}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <QrCode size={80} />
                  <p className="mt-4 text-center">Your QR code will appear here</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={downloadQRCode} 
              variant="outline" 
              className="w-full"
              disabled={!qrCodeUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>

        
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">How to Use Advanced QR Code Generator</h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Select the type of content you want to encode (URL, Text, Email, Phone, SMS, WiFi)</li>
              <li>Enter your content in the input field</li>
              <li>Customize colors and gradients in the settings panel</li>
              <li>Click "Generate QR Code" to create your personalized QR code</li>
              <li>Click "Download QR Code" to save the high-quality image to your device</li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">About Our QR Code Generator</h2>
            <p className="text-gray-600 mb-4">
              Our advanced QR code generator supports multiple content types including URLs, plain text, 
              contact information, WiFi credentials, and more. Features include gradient colors, custom sizing,
              and professional quality output perfect for businesses and personal use.
            </p>
            <p className="text-gray-600">
              All QR codes are generated in high quality and can be downloaded immediately. The tool works 
              entirely in your browser, ensuring your data privacy and security.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Use Our Advanced QR Code Generator?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Support for multiple content types with dedicated options</li>
              <li>Beautiful gradient colors and customization options</li>
              <li>High-quality, downloadable QR codes</li>
              <li>No sign-up or account creation required</li>
              <li>Completely free with unlimited usage</li>
              <li>Fast generation with instant preview</li>
              <li>Privacy-focused - all processing done locally</li>
              <li>Mobile-friendly responsive design</li>
            </ul>
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </ToolPageTemplate>
  );
};

export default QRCodeGenerator;
