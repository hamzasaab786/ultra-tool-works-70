
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Link as LinkIcon, Mail, Phone, MessageSquare, Wifi } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const generateQR = () => {
    if (!text.trim()) {
      toast.error("Please enter some content for your QR code");
      return;
    }
    
    setLoading(true);
    
    // Encode the text for URL use
    const encodedText = encodeURIComponent(text);
    
    // Use Google's Chart API to generate QR code
    const qrApiUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=300x300&choe=UTF-8`;
    setQrCodeUrl(qrApiUrl);
    setLoading(false);
    
    if (qrApiUrl) {
      toast.success("QR code generated successfully!");
    }
  };
  
  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast.error("Generate a QR code first");
      return;
    }
    
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR code downloaded successfully!");
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setText("");
    setQrCodeUrl("");
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
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Input Section */}
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="more" className="flex items-center gap-1">
                  <QrCode className="h-4 w-4" />
                  More
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <Label htmlFor="url-input">Enter Website URL</Label>
                <Input
                  id="url-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="mb-4"
                />
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
                  </>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4 mt-2">
              <Button 
                onClick={generateQR} 
                className="w-full"
                disabled={loading || !text.trim()}
              >
                Generate QR Code
              </Button>
            </div>
          </div>
          
          {/* QR Code Display Section */}
          <div className="bg-card p-6 rounded-lg border shadow-sm flex flex-col items-center justify-center">
            <div 
              ref={canvasRef} 
              className="flex items-center justify-center min-h-[250px] w-full bg-gray-50 rounded-md mb-4"
            >
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-auto h-auto max-w-full max-h-full" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <QrCode size={80} />
                  <p className="mt-4">Your QR code will appear here</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={downloadQRCode} 
              variant="outline" 
              className="w-full"
              disabled={!qrCodeUrl}
            >
              Download QR Code
            </Button>
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">How to Use QR Code Generator</h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Select the type of content you want to encode (URL, Text, Email, etc.)</li>
              <li>Enter your content in the input field</li>
              <li>Click "Generate QR Code" to create your QR code</li>
              <li>Click "Download QR Code" to save it to your device</li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">About QR Code Generator</h2>
            <p className="text-gray-600">
              A QR code (Quick Response code) is a type of matrix barcode that can be scanned using a smartphone camera to 
              quickly access websites, send emails, make phone calls, and more. Our free QR code generator lets you create 
              QR codes for various purposes without any sign-up or fees. The generated QR codes are high-quality and can 
              be downloaded and used immediately.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Use Our QR Code Generator?</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Completely free to use with no limits</li>
              <li>No sign-up or account creation required</li>
              <li>Create QR codes for various purposes (URLs, text, contact information)</li>
              <li>High-quality downloadable QR codes</li>
              <li>Simple and user-friendly interface</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QRCodeGenerator;
