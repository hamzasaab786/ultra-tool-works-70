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
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  CalendarDays,
  Bitcoin,
  IndianRupee,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import QRCode from "qrcode";

type DotStyle = "square" | "rounded" | "dots" | "classy";
type EyeStyle = "square" | "rounded" | "circle";
type ErrorLevel = "L" | "M" | "Q" | "H";
type FrameStyle = "none" | "box" | "rounded" | "banner";

interface StylePreset {
  name: string;
  fg: string;
  bg: string;
  dot: DotStyle;
  eye: EyeStyle;
  gradient?: [string, string];
}

const STYLE_PRESETS: StylePreset[] = [
  { name: "Classic", fg: "#1f2a44", bg: "#ffffff", dot: "square", eye: "square" },
  { name: "Midnight", fg: "#0f172a", bg: "#ffffff", dot: "rounded", eye: "rounded" },
  { name: "Sunset", fg: "#f97316", bg: "#ffffff", dot: "dots", eye: "circle", gradient: ["#f97316", "#db2777"] },
  { name: "Ocean", fg: "#0ea5e9", bg: "#ffffff", dot: "classy", eye: "rounded", gradient: ["#0ea5e9", "#6366f1"] },
  { name: "Forest", fg: "#166534", bg: "#f0fdf4", dot: "rounded", eye: "circle" },
  { name: "Mono Dark", fg: "#ffffff", bg: "#111111", dot: "dots", eye: "circle" },
];

const hexLum = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return 0;
  const [r, g, b] = [1, 2, 3].map((i) => {
    const v = parseInt(m[i], 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a: string, b: string) => {
  const l1 = hexLum(a);
  const l2 = hexLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

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

  // WhatsApp / UPI / Location / Event / Crypto
  const [waPhone, setWaPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [upiNote, setUpiNote] = useState("");
  const [geoLat, setGeoLat] = useState("");
  const [geoLng, setGeoLng] = useState("");
  const [evTitle, setEvTitle] = useState("");
  const [evStart, setEvStart] = useState("");
  const [evEnd, setEvEnd] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [coin, setCoin] = useState("bitcoin");
  const [coinAddress, setCoinAddress] = useState("");
  const [coinAmount, setCoinAmount] = useState("");

  // Frame / call-to-action
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("none");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [frameColor, setFrameColor] = useState("#1f2a44");
  const [frameTextColor, setFrameTextColor] = useState("#ffffff");

  // Batch
  const [batchInput, setBatchInput] = useState("");
  const [batchBusy, setBatchBusy] = useState(false);

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
      case "whatsapp": {
        const digits = waPhone.replace(/[^\d]/g, "");
        return `https://wa.me/${digits}${waMsg ? `?text=${encodeURIComponent(waMsg)}` : ""}`;
      }
      case "upi": {
        const params = new URLSearchParams();
        params.set("pa", upiId.trim());
        if (upiName.trim()) params.set("pn", upiName.trim());
        if (upiAmount.trim()) params.set("am", upiAmount.trim());
        if (upiNote.trim()) params.set("tn", upiNote.trim());
        params.set("cu", "INR");
        return `upi://pay?${params.toString()}`;
      }
      case "geo":
        return `geo:${geoLat.trim()},${geoLng.trim()}`;
      case "event": {
        const stamp = (v: string) => v.replace(/[-:]/g, "").replace(/\.\d+/, "");
        return [
          "BEGIN:VEVENT",
          `SUMMARY:${evTitle}`,
          evLocation ? `LOCATION:${evLocation}` : "",
          evStart ? `DTSTART:${stamp(evStart)}00` : "",
          evEnd ? `DTEND:${stamp(evEnd)}00` : "",
          "END:VEVENT",
        ]
          .filter(Boolean)
          .join("\n");
      }
      case "crypto":
        return `${coin}:${coinAddress.trim()}${coinAmount.trim() ? `?amount=${coinAmount.trim()}` : ""}`;
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
      case "whatsapp":
        return waPhone.replace(/[^\d]/g, "").length >= 7;
      case "upi":
        return upiId.trim().length > 2;
      case "geo":
        return geoLat.trim().length > 0 && geoLng.trim().length > 0;
      case "event":
        return evTitle.trim().length > 0;
      case "crypto":
        return coinAddress.trim().length > 5;
      default:
        return text.trim().length > 0;
    }
  };

  const activeContrast = contrastRatio(useGradient ? gradStart : fgColor, transparentBg ? "#ffffff" : bgColor);
  const lowContrast = activeContrast < 3;

  const applyPreset = (p: StylePreset) => {
    setDotStyle(p.dot);
    setEyeStyle(p.eye);
    setBgColor(p.bg);
    setTransparentBg(false);
    if (p.gradient) {
      setUseGradient(true);
      setGradStart(p.gradient[0]);
      setGradEnd(p.gradient[1]);
    } else {
      setUseGradient(false);
      setFgColor(p.fg);
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

  // Wrap the finished QR in an optional call-to-action frame
  const applyFrame = (src: HTMLCanvasElement): string => {
    if (frameStyle === "none") return src.toDataURL("image/png");
    const pad = Math.round(src.width * 0.06);
    const barH = Math.round(src.width * 0.16);
    const w = src.width + pad * 2;
    const h = src.height + pad * 2 + barH;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const cx = c.getContext("2d")!;
    const radius = frameStyle === "rounded" ? Math.round(w * 0.07) : 0;

    if (frameStyle === "banner") {
      cx.fillStyle = transparentBg ? "#ffffff" : bgColor;
      cx.fillRect(0, 0, w, h);
      cx.fillStyle = frameColor;
      cx.fillRect(0, h - barH, w, barH);
    } else {
      cx.fillStyle = frameColor;
      roundRect(cx, 0, 0, w, h, radius);
      cx.fill();
      cx.fillStyle = transparentBg ? "#ffffff" : bgColor;
      roundRect(cx, pad, pad, src.width, src.height, radius ? Math.round(radius / 2) : 0);
      cx.fill();
    }

    cx.drawImage(src, pad, pad);
    cx.fillStyle = frameTextColor;
    cx.font = `bold ${Math.round(barH * 0.46)}px system-ui, sans-serif`;
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillText((frameText || "SCAN ME").slice(0, 28), w / 2, h - barH / 2 + (frameStyle === "banner" ? 0 : -pad / 4));
    return c.toDataURL("image/png");
  };

  const renderQR = async (data: string): Promise<string> => {
    {
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

      return applyFrame(canvas);
    }
  };

  const generateQR = async () => {
    if (!isInputValid()) {
      toast({ title: "Error", description: "Please fill in the required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      setQrCodeUrl(await renderQR(formatTextForQR()));
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

  // Bulk: one QR per line, downloaded as a ZIP
  const downloadBatch = async () => {
    const lines = batchInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 300);
    if (lines.length === 0) {
      toast({ title: "Nothing to generate", description: "Add one value per line first.", variant: "destructive" });
      return;
    }
    setBatchBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const [labelPart, valuePart] = raw.includes(",") ? [raw.split(",")[0], raw.slice(raw.indexOf(",") + 1)] : [String(i + 1), raw];
        const value = (valuePart || raw).trim();
        const dataUrl = await renderQR(value);
        const base64 = dataUrl.split(",")[1];
        const safe = labelPart.trim().replace(/[^a-z0-9_-]+/gi, "-").slice(0, 40) || String(i + 1);
        zip.file(`${String(i + 1).padStart(3, "0")}-${safe}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-batch-${lines.length}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Batch ready", description: `${lines.length} QR codes downloaded as ZIP.` });
    } catch (e) {
      console.error(e);
      toast({ title: "Batch failed", description: "Could not generate the ZIP file.", variant: "destructive" });
    } finally {
      setBatchBusy(false);
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
    waPhone, waMsg, upiId, upiName, upiAmount, upiNote,
    geoLat, geoLng, evTitle, evStart, evEnd, evLocation,
    coin, coinAddress, coinAmount,
    frameStyle, frameText, frameColor, frameTextColor,
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
                <TabsList className="grid grid-cols-6 lg:grid-cols-12 mb-4 h-auto">
                  <TabsTrigger value="url" title="Website URL"><LinkIcon className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="text" title="Plain text"><MessageSquare className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="email" title="Email"><Mail className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="phone" title="Phone call"><Phone className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="sms" title="SMS">SMS</TabsTrigger>
                  <TabsTrigger value="wifi" title="WiFi"><Wifi className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="vcard" title="Contact card"><User className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="whatsapp" title="WhatsApp chat">WA</TabsTrigger>
                  <TabsTrigger value="upi" title="UPI payment"><IndianRupee className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="geo" title="Map location"><MapPin className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="event" title="Calendar event"><CalendarDays className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="crypto" title="Crypto payment"><Bitcoin className="h-4 w-4" /></TabsTrigger>
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
                <TabsContent value="whatsapp" className="space-y-2">
                  <Label>WhatsApp Number (with country code)</Label>
                  <Input value={waPhone} onChange={(e) => setWaPhone(e.target.value)} placeholder="+92 300 1234567" />
                  <Label>Pre-filled Message</Label>
                  <Input value={waMsg} onChange={(e) => setWaMsg(e.target.value)} placeholder="Hi! I'd like to order…" />
                </TabsContent>
                <TabsContent value="upi" className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" />
                  <Label>Payee Name</Label>
                  <Input value={upiName} onChange={(e) => setUpiName(e.target.value)} placeholder="My Store" />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Amount (optional)</Label>
                      <Input value={upiAmount} onChange={(e) => setUpiAmount(e.target.value)} placeholder="499" />
                    </div>
                    <div>
                      <Label>Note</Label>
                      <Input value={upiNote} onChange={(e) => setUpiNote(e.target.value)} placeholder="Order #123" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="geo" className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Latitude</Label>
                      <Input value={geoLat} onChange={(e) => setGeoLat(e.target.value)} placeholder="31.5204" />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input value={geoLng} onChange={(e) => setGeoLng(e.target.value)} placeholder="74.3587" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigator.geolocation?.getCurrentPosition(
                        (p) => {
                          setGeoLat(p.coords.latitude.toFixed(6));
                          setGeoLng(p.coords.longitude.toFixed(6));
                        },
                        () => toast({ title: "Location unavailable", description: "Enter the coordinates manually.", variant: "destructive" })
                      )
                    }
                  >
                    <MapPin className="h-4 w-4 mr-2" /> Use my current location
                  </Button>
                </TabsContent>
                <TabsContent value="event" className="space-y-2">
                  <Label>Event Title</Label>
                  <Input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="Product launch" />
                  <Label>Location</Label>
                  <Input value={evLocation} onChange={(e) => setEvLocation(e.target.value)} placeholder="Hall 2, Expo Center" />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Starts</Label>
                      <Input type="datetime-local" value={evStart} onChange={(e) => setEvStart(e.target.value)} />
                    </div>
                    <div>
                      <Label>Ends</Label>
                      <Input type="datetime-local" value={evEnd} onChange={(e) => setEvEnd(e.target.value)} />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="crypto" className="space-y-2">
                  <Label>Network</Label>
                  <Select value={coin} onValueChange={setCoin}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="litecoin">Litecoin</SelectItem>
                      <SelectItem value="dogecoin">Dogecoin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Wallet Address</Label>
                  <Input value={coinAddress} onChange={(e) => setCoinAddress(e.target.value)} placeholder="Paste your wallet address" />
                  <Label>Amount (optional)</Label>
                  <Input value={coinAmount} onChange={(e) => setCoinAmount(e.target.value)} placeholder="0.005" />
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

              {/* Style presets */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs"><Sparkles className="h-3.5 w-3.5" /> Style presets</Label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                    >
                      <span
                        className="h-3 w-3 rounded-full border"
                        style={{ background: p.gradient ? `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` : p.fg }}
                      />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame / call-to-action */}
              <div className="space-y-3">
                <Label className="text-xs">Frame &amp; call-to-action</Label>
                <Select value={frameStyle} onValueChange={(v: FrameStyle) => setFrameStyle(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No frame</SelectItem>
                    <SelectItem value="box">Solid box</SelectItem>
                    <SelectItem value="rounded">Rounded card</SelectItem>
                    <SelectItem value="banner">Bottom banner</SelectItem>
                  </SelectContent>
                </Select>
                {frameStyle !== "none" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label className="text-xs">Frame text</Label>
                      <Input value={frameText} onChange={(e) => setFrameText(e.target.value)} placeholder="SCAN ME" />
                    </div>
                    <div>
                      <Label className="text-xs">Frame color</Label>
                      <Input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} className="h-9 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Text color</Label>
                      <Input type="color" value={frameTextColor} onChange={(e) => setFrameTextColor(e.target.value)} className="h-9 p-1" />
                    </div>
                  </div>
                )}
              </div>

              {lowContrast && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Low contrast ({activeContrast.toFixed(1)}:1). Many phone cameras will fail to scan this — darken the dots or lighten the
                    background.
                  </span>
                </div>
              )}
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
