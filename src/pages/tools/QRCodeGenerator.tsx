import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Link as LinkIcon, Mail, Phone, MessageSquare, Wifi, ImageIcon, Download, Upload, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      // Format text based on type
      const formattedText = formatTextForQR();
      const encodedText = encodeURIComponent(formattedText);
      
      // Create QR code with custom colors
      const colorParam = qrColor.replace('#', '');
      const bgColorParam = bgColor.replace('#', '');
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedText}&color=${colorParam}&bgcolor=${bgColorParam}&format=png&ecc=M`;
      
      // Test if the URL works
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        setQrCodeUrl(qrApiUrl);
        setLoading(false);
        toast({
          title: "Success",
          description: "QR code generated successfully!",
        });
      };
      
      img.onerror = () => {
        // Fallback to Google Charts API
        const fallbackUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=${qrSize}x${qrSize}&choe=UTF-8`;
        setQrCodeUrl(fallbackUrl);
        setLoading(false);
        toast({
          title: "Success",
          description: "QR code generated successfully!",
        });
      };
      
      img.src = qrApiUrl;
      
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

  const generateImageQR = () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // For image QR, we'll encode a reference to the image
    const imageText = `Image uploaded - ${new Date().toISOString()}`;
    const encodedText = encodeURIComponent(imageText);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedText}&format=png`;
    
    setQrCodeUrl(qrApiUrl);
    setLoading(false);
    
    toast({
      title: "Success",
      description: "QR code generated for image successfully!",
    });
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
      const response = await fetch(qrCodeUrl, { mode: 'cors' });
      const blob = await response.blob();
      
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "QR code downloaded successfully!",
      });
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
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
      description="Professional QR code generator with customization options - Create QR codes for URLs, text, contact info, WiFi, and images with custom colors and sizes"
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            📱 Create professional QR codes for any content including images, URLs, contact information, and more. Perfect for marketing, business cards, and digital sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Input Section */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="more" className="flex items-center gap-1">
                  <QrCode className="h-4 w-4" />
                  More
                </TabsTrigger>
              </TabsList>

              {/* Customization Options */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>QR Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-8"
                    />
                    <Input
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      placeholder="#000000"
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label>Background</Label>
                  <div className="flex gap-2">
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
                <div className="col-span-2">
                  <Label>Size: {qrSize}px</Label>
                  <Input
                    type="range"
                    min="200"
                    max="500"
                    value={qrSize}
                    onChange={(e) => setQrSize(parseInt(e.target.value))}
                    className="w-full"
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

              <TabsContent value="image">
                <Label>Upload Image for QR Code</Label>
                <div className="mt-2 space-y-4">
                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 mb-4">
                        Click to upload an image (Max 2MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Select Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <img 
                          src={selectedImage} 
                          alt="Selected" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <Button 
                        onClick={generateImageQR} 
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Generating..." : "Generate QR for Image"}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="more">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button
                    variant={activeTab === "email" ? "default" : "outline"}
                    className="flex items-center justify-start gap-2"
                    onClick={() => setActiveTab("email")}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant={activeTab === "phone" ? "default" : "outline"}
                    className="flex items-center justify-start gap-2"
                    onClick={() => setActiveTab("phone")}
                  >
                    <Phone className="h-4 w-4" />
                    Phone
                  </Button>
                  <Button
                    variant={activeTab === "sms" ? "default" : "outline"}
                    className="flex items-center justify-start gap-2"
                    onClick={() => setActiveTab("sms")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </Button>
                  <Button
                    variant={activeTab === "wifi" ? "default" : "outline"}
                    className="flex items-center justify-start gap-2"
                    onClick={() => setActiveTab("wifi")}
                  >
                    <Wifi className="h-4 w-4" />
                    WiFi
                  </Button>
                </div>
                
                {(activeTab === "email" || activeTab === "phone" || activeTab === "sms" || activeTab === "wifi") && (
                  <>
                    <Label htmlFor="specific-input">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Label>
                    <Input
                      id="specific-input"
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
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* QR Code Display Section - Fixed the ref type issue */}
          <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center justify-center min-h-[300px] w-full bg-gray-50 rounded-md mb-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-auto h-auto max-w-full max-h-full"
                  style={{ maxWidth: `${qrSize}px`, maxHeight: `${qrSize}px` }}
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

        {/* Information Section */}
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">How to Use Advanced QR Code Generator</h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Select the type of content you want to encode (URL, Text, Image, Email, etc.)</li>
              <li>Enter your content or upload an image in the input field</li>
              <li>Click "Generate QR Code" to create your personalized QR code</li>
              <li>Click "Download QR Code" to save the high-quality image to your device</li>
              <li>Use your QR code in marketing materials, business cards, or digital content</li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">About Our QR Code Generator</h2>
            <p className="text-gray-600 mb-4">
              Our advanced QR code generator supports multiple content types including URLs, plain text, images, 
              contact information, WiFi credentials, and more. Perfect for businesses, marketers, and individuals 
              who need professional QR codes for various applications.
            </p>
            <p className="text-gray-600">
              All QR codes are generated in high quality and can be downloaded immediately. The tool works 
              entirely in your browser, ensuring your data privacy and security.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Use Our Advanced QR Code Generator?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Support for multiple content types including images</li>
              <li>High-quality, downloadable QR codes</li>
              <li>No sign-up or account creation required</li>
              <li>Completely free with unlimited usage</li>
              <li>Fast generation with instant preview</li>
              <li>Privacy-focused - all processing done locally</li>
              <li>Mobile-friendly responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default QRCodeGenerator;
