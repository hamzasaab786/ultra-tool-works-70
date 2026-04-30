import React, { useState, useRef, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  QrCode,
  Link as LinkIcon,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  Download,
  Upload,
  User,
  X,
  Palette,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import QRCode from "qrcode";

type DotStyle = "square" | "rounded" | "dots" | "classy";
type EyeStyle = "square" | "rounded" | "circle";
type ErrorLevel = "L" | "M" | "Q" | "H";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // WiFi
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vOrg, setVOrg] = useState("");
  const [vUrl, setVUrl] = useState("");

  // SMS
  const [smsBody, setSmsBody] = useState("");

  // Customization
  const [fgColor, setFgColor] = useState("#1f2a44");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparentBg, setTransparentBg] = useState(false);
  const [useGradient, setUseGradient] = useState(false);
  const [gradStart, setGradStart] = useState("#6366f1");
  const [gradEnd, setGradEnd] = useState("#ec4899");
  const [gradType, setGradType] = useState<"linear" | "radial">("linear");

  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("square");
  const [eyeColor, setEyeColor] = useState("#1f2a44");
  const [customEyeColor, setCustomEyeColor] = useState(false);

  const [qrSize, setQrSize] = useState([512]);
  const [margin, setMargin] = useState([2]);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("H");

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState([22]); // % of qr
  const [logoBg, setLogoBg] = useState(true);
  const [logoRound, setLogoRound] = useState(true);
  const [logoPadding, setLogoPadding] = useState([6]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const formatTextForQR = () => {
    switch (activeTab) {
      case "url":
        return text.startsWith("http") ? text : `https://${text}`;
      case "text":
        return text;
      case "email":
        return `mailto:${text}`;
      case "phone":
        return `tel:${text}`;
      case "sms":
        return `SMSTO:${text}:${smsBody}`;
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};${
          wifiEncryption === "nopass" ? "" : `P:${wifiPassword};`
        }${wifiHidden ? "H:true;" : ""};`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nURL:${vUrl}\nEND:VCARD`;
      default:
        return text;
    }
  };

  const isInputValid = () => {
    switch (activeTab) {
      case "wifi":
        return wifiSsid.trim().length > 0;
      case "vcard":
        return vName.trim().length > 0;
      default:
        return text.trim().length > 0;
    }
  };

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 };
  };

  // Detect 7x7 finder/eye region (top-left, top-right, bottom-left)
  const isInEye = (mx: number, my: number, modules: number) => {
    const inBox = (sx: number, sy: number) =>
      mx >= sx && mx < sx + 7 && my >= sy && my < sy + 7;
    return inBox(0, 0) || inBox(modules - 7, 0) || inBox(0, modules - 7);
  };

  const isInEyeOuter = (mx: number, my: number, modules: number) => {
    // Outer ring of 7x7 eye
    const ring = (sx: number, sy: number) => {
      if (mx < sx || mx >= sx + 7 || my < sy || my >= sy + 7) return false;
      return mx === sx || mx === sx + 6 || my === sy || my === sy + 6;
    };
    return ring(0, 0) || ring(modules - 7, 0) || ring(0, modules - 7);
  };

  const isInEyeInner = (mx: number, my: number, modules: number) => {
    // Inner 3x3 pupil
    const pupil = (sx: number, sy: number) =>
      mx >= sx + 2 && mx < sx + 5 && my >= sy + 2 && my < sy + 5;
    return pupil(0, 0) || pupil(modules - 7, 0) || pupil(0, modules - 7);
  };

  const drawDot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    style: DotStyle
  ) => {
    switch (style) {
      case "dots":
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "rounded":
        roundRect(ctx, x, y, size, size, size * 0.3);
        ctx.fill();
        break;
      case "classy":
        roundRect(ctx, x, y, size, size, size * 0.5);
        ctx.fill();
        break;
      default:
        ctx.fillRect(x, y, size, size);
    }
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const drawEye = (
    ctx: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    cell: number,
    style: EyeStyle,
    color: string
  ) => {
    ctx.fillStyle = color;
    const size = 7 * cell;
    // Outer
    if (style === "circle") {
      ctx.beginPath();
      ctx.arc(sx + size / 2, sy + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rounded") {
      roundRect(ctx, sx, sy, size, size, cell * 1.8);
      ctx.fill();
    } else {
      ctx.fillRect(sx, sy, size, size);
    }
    // Cut out center
    ctx.fillStyle = transparentBg ? "rgba(0,0,0,0)" : bgColor;
    ctx.save();
    ctx.globalCompositeOperation = transparentBg ? "destination-out" : "source-over";
    const innerOffset = cell;
    const innerSize = 5 * cell;
    if (style === "circle") {
      ctx.beginPath();
      ctx.arc(sx + size / 2, sy + size / 2, innerSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rounded") {
      roundRect(ctx, sx + innerOffset, sy + innerOffset, innerSize, innerSize, cell * 1.2);
      ctx.fill();
    } else {
      ctx.fillRect(sx + innerOffset, sy + innerOffset, innerSize, innerSize);
    }
    ctx.restore();

    // Pupil
    ctx.fillStyle = color;
    const pupilOffset = 2 * cell;
    const pupilSize = 3 * cell;
    if (style === "circle") {
      ctx.beginPath();
      ctx.arc(sx + size / 2, sy + size / 2, pupilSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rounded") {
      roundRect(ctx, sx + pupilOffset, sy + pupilOffset, pupilSize, pupilSize, cell * 0.7);
      ctx.fill();
    } else {
      ctx.fillRect(sx + pupilOffset, sy + pupilOffset, pupilSize, pupilSize);
    }
  };

  const generateQR = async () => {
    if (!isInputValid()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const data = formatTextForQR();
      const qr = QRCode.create(data, { errorCorrectionLevel: errorLevel });
      const modules = qr.modules.size;
      const moduleData = qr.modules.data;

      const size = qrSize[0];
      const marginCells = margin[0];
      const totalCells = modules + marginCells * 2;
      const cell = Math.floor(size / totalCells);
      const canvasSize = cell * totalCells;

      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d")!;

      // Background
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }

      // Foreground style
      if (useGradient) {
        let grad: CanvasGradient;
        if (gradType === "radial") {
          grad = ctx.createRadialGradient(
            canvasSize / 2,
            canvasSize / 2,
            0,
            canvasSize / 2,
            canvasSize / 2,
            canvasSize / 2
          );
        } else {
          grad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
        }
        grad.addColorStop(0, gradStart);
        grad.addColorStop(1, gradEnd);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = fgColor;
      }

      // Draw modules (skip eye regions; we draw eyes separately)
      for (let y = 0; y < modules; y++) {
        for (let x = 0; x < modules; x++) {
          const isDark = moduleData[y * modules + x];
          if (!isDark) continue;
          if (isInEye(x, y, modules)) continue;
          const px = (x + marginCells) * cell;
          const py = (y + marginCells) * cell;
          drawDot(ctx, px, py, cell, dotStyle);
        }
      }

      // Draw eyes
      const eyeFill = customEyeColor ? eyeColor : useGradient ? gradStart : fgColor;
      const eyePositions = [
        [marginCells, marginCells],
        [marginCells + modules - 7, marginCells],
        [marginCells, marginCells + modules - 7],
      ];
      eyePositions.forEach(([ex, ey]) => {
        drawEye(ctx, ex * cell, ey * cell, cell, eyeStyle, eyeFill);
      });

      // Logo
      if (logo) {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const lSize = (canvasSize * logoSize[0]) / 100;
            const lx = (canvasSize - lSize) / 2;
            const ly = (canvasSize - lSize) / 2;
            const pad = logoPadding[0];

            if (logoBg) {
              ctx.fillStyle = transparentBg ? "#ffffff" : bgColor;
              if (logoRound) {
                ctx.beginPath();
                ctx.arc(canvasSize / 2, canvasSize / 2, lSize / 2 + pad, 0, Math.PI * 2);
                ctx.fill();
              } else {
                roundRect(ctx, lx - pad, ly - pad, lSize + pad * 2, lSize + pad * 2, 8);
                ctx.fill();
              }
            }

            ctx.save();
            if (logoRound) {
              ctx.beginPath();
              ctx.arc(canvasSize / 2, canvasSize / 2, lSize / 2, 0, Math.PI * 2);
              ctx.clip();
            }
            ctx.drawImage(img, lx, ly, lSize, lSize);
            ctx.restore();
            resolve();
          };
          img.onerror = () => reject(new Error("Failed to load logo"));
          img.src = logo;
        });
      }

      setQrCodeUrl(canvas.toDataURL("image/png"));
      toast({ title: "Success", description: "QR code generated!" });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Try shorter content or change settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-regenerate on changes (debounced)
  useEffect(() => {
    if (!isInputValid()) return;
    const t = setTimeout(() => generateQR(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text, activeTab, fgColor, bgColor, transparentBg, useGradient, gradStart, gradEnd, gradType,
    dotStyle, eyeStyle, eyeColor, customEyeColor, qrSize, margin, errorLevel,
    logo, logoSize, logoBg, logoRound, logoPadding,
    wifiSsid, wifiPassword, wifiEncryption, wifiHidden,
    vName, vPhone, vEmail, vOrg, vUrl, smsBody,
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Logo must be under 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const downloadQR = (format: "png" | "jpg" | "svg" = "png") => {
    if (!qrCodeUrl) {
      toast({ title: "Error", description: "Generate a QR code first", variant: "destructive" });
      return;
    }
    if (format === "svg") {
      // Convert PNG dataURL to SVG-wrapped image
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize[0]}" height="${qrSize[0]}">
<image href="${qrCodeUrl}" width="${qrSize[0]}" height="${qrSize[0]}"/>
</svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (format === "jpg") {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const cx = c.getContext("2d")!;
        cx.fillStyle = "#ffffff";
        cx.fillRect(0, 0, c.width, c.height);
        cx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        a.href = c.toDataURL("image/jpeg", 0.95);
        a.download = `qrcode-${Date.now()}.jpg`;
        a.click();
      };
      img.src = qrCodeUrl;
      return;
    }
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  };

  return (
    <ToolPageTemplate
      title="Advanced QR Code Generator with Logo"
      description="Create fully customizable QR codes with your logo, colors, gradients, custom dot & eye styles. Live preview and high-quality PNG/JPG/SVG export."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            🎨 Build pro-grade branded QR codes — add your logo, pick gradients, change dot &amp; eye shapes, and download in PNG/JPG/SVG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT - Content + Customization */}
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg border">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setText(""); }}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4 h-auto">
                  <TabsTrigger value="url"><LinkIcon className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="text"><MessageSquare className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="email"><Mail className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="phone"><Phone className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="wifi"><Wifi className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="vcard"><User className="h-4 w-4" /></TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                  <Label>Website URL</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
                </TabsContent>
                <TabsContent value="text">
                  <Label>Text</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text" />
                </TabsContent>
                <TabsContent value="email">
                  <Label>Email Address</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="name@example.com" />
                </TabsContent>
                <TabsContent value="phone">
                  <Label>Phone Number</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="+1234567890" />
                </TabsContent>
                <TabsContent value="sms" className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="+1234567890" />
                  <Label>Message</Label>
                  <Input value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="Hello!" />
                </TabsContent>
                <TabsContent value="wifi" className="space-y-2">
                  <Label>Network Name (SSID)</Label>
                  <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} />
                  <Label>Password</Label>
                  <Input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
                  <Label>Encryption</Label>
                  <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch checked={wifiHidden} onCheckedChange={setWifiHidden} id="hidden" />
                    <Label htmlFor="hidden">Hidden Network</Label>
                  </div>
                </TabsContent>
                <TabsContent value="vcard" className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={vName} onChange={(e) => setVName(e.target.value)} />
                  <Label>Organization</Label>
                  <Input value={vOrg} onChange={(e) => setVOrg(e.target.value)} />
                  <Label>Phone</Label>
                  <Input value={vPhone} onChange={(e) => setVPhone(e.target.value)} />
                  <Label>Email</Label>
                  <Input value={vEmail} onChange={(e) => setVEmail(e.target.value)} />
                  <Label>Website</Label>
                  <Input value={vUrl} onChange={(e) => setVUrl(e.target.value)} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Customization */}
            <div className="bg-card p-4 rounded-lg border space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4" /> Customization</h3>

              {/* Colors */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Use Gradient</Label>
                  <Switch checked={useGradient} onCheckedChange={setUseGradient} />
                </div>

                {!useGradient ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Foreground</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-9 p-1" />
                        <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Background</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={transparentBg} className="w-12 h-9 p-1" />
                        <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={transparentBg} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Gradient Start</Label>
                      <Input type="color" value={gradStart} onChange={(e) => setGradStart(e.target.value)} className="h-9 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Gradient End</Label>
                      <Input type="color" value={gradEnd} onChange={(e) => setGradEnd(e.target.value)} className="h-9 p-1" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Gradient Type</Label>
                      <Select value={gradType} onValueChange={(v: "linear" | "radial") => setGradType(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="radial">Radial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label>Transparent Background</Label>
                  <Switch checked={transparentBg} onCheckedChange={setTransparentBg} />
                </div>
              </div>

              {/* Styles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Dot Style</Label>
                  <Select value={dotStyle} onValueChange={(v: DotStyle) => setDotStyle(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Eye Style</Label>
                  <Select value={eyeStyle} onValueChange={(v: EyeStyle) => setEyeStyle(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Custom Eye Color</Label>
                  <Switch checked={customEyeColor} onCheckedChange={setCustomEyeColor} />
                </div>
                {customEyeColor && (
                  <div className="flex gap-2">
                    <Input type="color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className="w-12 h-9 p-1" />
                    <Input value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Size & error */}
              <div className="space-y-3">
                <div>
                  <Label>Size: {qrSize[0]}px</Label>
                  <Slider value={qrSize} onValueChange={setQrSize} min={256} max={1024} step={32} />
                </div>
                <div>
                  <Label>Margin: {margin[0]}</Label>
                  <Slider value={margin} onValueChange={setMargin} min={0} max={8} step={1} />
                </div>
                <div>
                  <Label className="text-xs">Error Correction (higher = more logo room)</Label>
                  <Select value={errorLevel} onValueChange={(v: ErrorLevel) => setErrorLevel(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (~7%)</SelectItem>
                      <SelectItem value="M">Medium (~15%)</SelectItem>
                      <SelectItem value="Q">Quartile (~25%)</SelectItem>
                      <SelectItem value="H">High (~30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-card p-4 rounded-lg border space-y-3">
              <h3 className="font-semibold">Logo / Brand</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> {logo ? "Change Logo" : "Upload Logo"}
                </Button>
                {logo && (
                  <Button variant="outline" size="icon" onClick={() => setLogo(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {logo && (
                <>
                  <div className="flex justify-center">
                    <img src={logo} alt="logo" className="h-16 w-16 object-contain border rounded" />
                  </div>
                  <div>
                    <Label>Logo Size: {logoSize[0]}%</Label>
                    <Slider value={logoSize} onValueChange={setLogoSize} min={10} max={35} step={1} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use error correction "High" for best scannability with large logos.
                    </p>
                  </div>
                  <div>
                    <Label>Logo Padding: {logoPadding[0]}px</Label>
                    <Slider value={logoPadding} onValueChange={setLogoPadding} min={0} max={20} step={1} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Logo Background</Label>
                    <Switch checked={logoBg} onCheckedChange={setLogoBg} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Round Logo</Label>
                    <Switch checked={logoRound} onCheckedChange={setLogoRound} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT - Preview */}
          <div className="bg-card p-4 rounded-lg border flex flex-col items-center lg:sticky lg:top-4 h-fit">
            <div
              className="flex items-center justify-center w-full rounded-md mb-4 p-4"
              style={{
                minHeight: 360,
                backgroundImage: transparentBg
                  ? "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)"
                  : undefined,
                backgroundSize: transparentBg ? "20px 20px" : undefined,
                backgroundPosition: transparentBg ? "0 0, 0 10px, 10px -10px, -10px 0px" : undefined,
                backgroundColor: transparentBg ? "#f9fafb" : "#f9fafb",
              }}
            >
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="max-w-full h-auto" style={{ maxHeight: 400 }} />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <QrCode size={80} />
                  <p className="mt-3">Live preview</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
              <Button onClick={() => downloadQR("png")} disabled={!qrCodeUrl}>
                <Download className="h-4 w-4 mr-1" /> PNG
              </Button>
              <Button onClick={() => downloadQR("jpg")} disabled={!qrCodeUrl} variant="outline">
                <Download className="h-4 w-4 mr-1" /> JPG
              </Button>
              <Button onClick={() => downloadQR("svg")} disabled={!qrCodeUrl} variant="outline">
                <Download className="h-4 w-4 mr-1" /> SVG
              </Button>
            </div>
            {loading && <p className="text-xs text-muted-foreground mt-2">Generating…</p>}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Branded QR codes — upload your logo with size, padding, and shape control</li>
              <li>Solid colors or linear/radial gradients for the dots</li>
              <li>4 dot styles (square, rounded, dots, classy) and 3 eye styles (square, rounded, circle)</li>
              <li>Independent eye color, transparent background support</li>
              <li>Adjustable size, margin (quiet zone) and error correction level</li>
              <li>Multiple content types: URL, Text, Email, Phone, SMS, WiFi, vCard</li>
              <li>Export as high-quality PNG, JPG, or SVG</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Tips for scannable branded QR codes</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Always use Error Correction "High" when adding a logo</li>
              <li>Keep logo size under 25–30% of the QR code area</li>
              <li>Maintain strong contrast between foreground and background</li>
              <li>Test your QR code with multiple phones before printing</li>
            </ol>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default QRCodeGenerator;
