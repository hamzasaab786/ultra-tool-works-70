import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageIcon, Upload, Download, X, Maximize2, FileArchive, Link2, Link2Off } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import {
  FitMode,
  ImageFormat,
  baseFileName,
  decodeImageFile,
  downloadAsZip,
  downloadBlob,
  encodeCanvas,
  encodeToTargetSize,
  formatBytes,
  getFormat,
  resizeCanvas,
} from "@/utils/imageEngine";

interface Item {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  outBlob?: Blob;
  outUrl?: string;
  outName?: string;
  outWidth?: number;
  outHeight?: number;
  error?: string;
}

type Mode = "dimensions" | "percent" | "preset";

const PRESETS = [
  { label: "Instagram post (1080×1080)", w: 1080, h: 1080 },
  { label: "Instagram story (1080×1920)", w: 1080, h: 1920 },
  { label: "Facebook cover (1640×856)", w: 1640, h: 856 },
  { label: "YouTube thumbnail (1280×720)", w: 1280, h: 720 },
  { label: "Twitter/X header (1500×500)", w: 1500, h: 500 },
  { label: "LinkedIn banner (1584×396)", w: 1584, h: 396 },
  { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
  { label: "4K UHD (3840×2160)", w: 3840, h: 2160 },
  { label: "Passport 35×45mm @300dpi (413×531)", w: 413, h: 531 },
  { label: "Avatar (512×512)", w: 512, h: 512 },
];

const OUTPUT_FORMATS: ImageFormat[] = ["jpeg", "png", "webp", "avif"];

const ImageResizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>("dimensions");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [percent, setPercent] = useState(50);
  const [presetIndex, setPresetIndex] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [fit, setFit] = useState<FitMode>("contain");
  const [background, setBackground] = useState("#ffffff");
  const [transparentPad, setTransparentPad] = useState(true);
  const [outputFormat, setOutputFormat] = useState<"original" | ImageFormat>("original");
  const [quality, setQuality] = useState(92);
  const [useTargetSize, setUseTargetSize] = useState(false);
  const [targetKb, setTargetKb] = useState(300);
  const [noUpscale, setNoUpscale] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  useEffect(() => () => {
    itemsRef.current.forEach((i) => {
      URL.revokeObjectURL(i.previewUrl);
      if (i.outUrl) URL.revokeObjectURL(i.outUrl);
    });
  }, []);

  const first = items[0];

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const next: Item[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") && !/\.(heic|heif|tiff?|avif|svg|bmp|jfif)$/i.test(file.name)) {
        toast({ title: "Skipped", description: `${file.name} is not an image.`, variant: "destructive" });
        continue;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast({ title: "Skipped", description: `${file.name} exceeds 100MB.`, variant: "destructive" });
        continue;
      }
      try {
        const decoded = await decodeImageFile(file);
        next.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          width: decoded.width,
          height: decoded.height,
        });
      } catch (error) {
        toast({ title: "Could not read image", description: (error as Error).message, variant: "destructive" });
      }
    }
    if (!next.length) return;
    setItems((prev) => {
      const merged = [...prev, ...next];
      if (!prev.length) {
        setWidth(next[0].width);
        setHeight(next[0].height);
      }
      return merged;
    });
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outUrl) URL.revokeObjectURL(item.outUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => {
      URL.revokeObjectURL(i.previewUrl);
      if (i.outUrl) URL.revokeObjectURL(i.outUrl);
    });
    setItems([]);
    setProgress(0);
  };

  const aspect = first ? first.width / first.height : 1;

  const onWidthChange = (value: number) => {
    setWidth(value);
    if (lockAspect && first && value > 0) setHeight(Math.max(1, Math.round(value / aspect)));
  };
  const onHeightChange = (value: number) => {
    setHeight(value);
    if (lockAspect && first && value > 0) setWidth(Math.max(1, Math.round(value * aspect)));
  };

  const targetFor = (item: Item) => {
    if (mode === "percent") {
      return {
        w: Math.max(1, Math.round((item.width * percent) / 100)),
        h: Math.max(1, Math.round((item.height * percent) / 100)),
      };
    }
    if (mode === "preset") {
      const p = PRESETS[presetIndex];
      return { w: p.w, h: p.h };
    }
    return { w: Math.max(1, width), h: Math.max(1, height) };
  };

  const previewTarget = first ? targetFor(first) : { w: width, h: height };

  const run = useCallback(async () => {
    if (!items.length || busy) return;
    setBusy(true);
    setProgress(0);

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      await new Promise((r) => setTimeout(r, 0));
      try {
        const decoded = await decodeImageFile(item.file);
        let { w, h } = targetFor(item);
        if (noUpscale && mode !== "percent") {
          const ratio = Math.min(1, decoded.width / w, decoded.height / h);
          if (fit !== "contain" && ratio < 1) {
            w = Math.max(1, Math.round(w * ratio));
            h = Math.max(1, Math.round(h * ratio));
          }
        }
        const padBackground = transparentPad ? "transparent" : background;
        const canvas = resizeCanvas(decoded.canvas, {
          width: w,
          height: h,
          fit,
          background: padBackground,
          highQuality: true,
        });

        const format: ImageFormat =
          outputFormat === "original"
            ? (["image/png", "image/webp", "image/avif"].includes(item.file.type)
                ? (item.file.type.split("/")[1] as ImageFormat)
                : "jpeg")
            : outputFormat;

        const flattenColor = transparentPad ? "#ffffff" : background;
        const result = useTargetSize
          ? await encodeToTargetSize(canvas, format, targetKb * 1024, flattenColor)
          : await encodeCanvas(canvas, { format, quality, background: flattenColor });

        if (useTargetSize && result.blob.size > targetKb * 1024) {
          toast({
            title: "Target size not reachable",
            description: `${item.file.name} compressed to ${formatBytes(result.blob.size)} — reduce the dimensions for a smaller file.`,
          });
        }

        const ext = getFormat(result.format)!.extension;
        const outUrl = URL.createObjectURL(result.blob);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  outBlob: result.blob,
                  outUrl,
                  outWidth: canvas.width,
                  outHeight: canvas.height,
                  outName: `${baseFileName(item.file.name)}_${canvas.width}x${canvas.height}.${ext}`,
                  error: undefined,
                }
              : i,
          ),
        );
      } catch (error) {
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, error: (error as Error).message } : i)));
      }
      setProgress(Math.round(((index + 1) / items.length) * 100));
    }

    setBusy(false);
    toast({ title: "Done", description: `${items.length} image${items.length > 1 ? "s" : ""} resized.` });
  }, [items, busy, mode, width, height, percent, presetIndex, fit, background, transparentPad, outputFormat, quality, useTargetSize, targetKb, noUpscale]);

  const done = useMemo(() => items.filter((i) => i.outBlob), [items]);

  const downloadAll = async () => {
    if (!done.length) return;
    if (done.length === 1) {
      downloadBlob(done[0].outBlob!, done[0].outName!);
      return;
    }
    await downloadAsZip(done.map((i) => ({ name: i.outName!, blob: i.outBlob! })), "resized-images.zip");
    toast({ title: "Downloaded", description: `${done.length} images saved as a ZIP archive.` });
  };

  return (
    <>
      <SEO
        title="Image Resizer — Resize Photos by Pixels, Percentage or Preset"
        description="Resize images online with Lanczos-quality scaling. Batch resize, lock aspect ratio, crop-to-fill, target file size and export as JPG, PNG, WebP or AVIF. Fully private."
        keywords="image resizer, resize image online, bulk image resizer, resize photo in kb, change image dimensions, crop to size"
        canonicalUrl="https://klipza.live/tools/image-resizer"
      />

      <ToolPageTemplate
        title="Image Resizer"
        description="Resize one or many images with studio-grade Lanczos scaling — by exact pixels, percentage or social-media preset."
      >
        <div className="space-y-6">
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/30 hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
          >
            <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag &amp; drop — multiple files supported
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP, AVIF, GIF, BMP, SVG · max 100MB each</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,.avif,.svg,.tiff,.tif,.heic,.heif"
              className="hidden"
              onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
            />
            <Button className="mt-4" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Select images
            </Button>
          </div>

          {items.length > 0 && (
            <>
              <Card className="space-y-5 p-5">
                <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dimensions">Exact pixels</TabsTrigger>
                    <TabsTrigger value="percent">Percentage</TabsTrigger>
                    <TabsTrigger value="preset">Presets</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dimensions" className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                      <div className="space-y-2">
                        <Label htmlFor="w">Width (px)</Label>
                        <Input id="w" type="number" min={1} value={width} onChange={(e) => onWidthChange(Number(e.target.value) || 0)} />
                      </div>
                      <Button
                        type="button"
                        variant={lockAspect ? "default" : "outline"}
                        size="icon"
                        aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                        onClick={() => setLockAspect((v) => !v)}
                      >
                        {lockAspect ? <Link2 className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="h">Height (px)</Label>
                        <Input id="h" type="number" min={1} value={height} onChange={(e) => onHeightChange(Number(e.target.value) || 0)} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="percent" className="mt-4 space-y-3">
                    <Label>Scale: {percent}% {first && `→ ${Math.round((first.width * percent) / 100)}×${Math.round((first.height * percent) / 100)}`}</Label>
                    <Slider value={[percent]} onValueChange={(v) => setPercent(v[0])} min={1} max={400} step={1} />
                  </TabsContent>

                  <TabsContent value="preset" className="mt-4">
                    <Label>Preset size</Label>
                    <Select value={String(presetIndex)} onValueChange={(v) => setPresetIndex(Number(v))}>
                      <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PRESETS.map((p, i) => (
                          <SelectItem key={p.label} value={String(i)}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Fit mode</Label>
                    <Select value={fit} onValueChange={(v) => setFit(v as FitMode)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contain">Fit inside (no crop, pads)</SelectItem>
                        <SelectItem value="cover">Fill &amp; crop (no distortion)</SelectItem>
                        <SelectItem value="stretch">Stretch to exact size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Output format</Label>
                    <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as typeof outputFormat)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Keep original type</SelectItem>
                        {OUTPUT_FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>{getFormat(f)!.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality: {useTargetSize ? "auto" : `${quality}%`}</Label>
                    <Slider
                      value={[quality]}
                      onValueChange={(v) => setQuality(v[0])}
                      min={10}
                      max={100}
                      step={1}
                      disabled={useTargetSize}
                      className="pt-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Switch id="no-upscale" checked={noUpscale} onCheckedChange={setNoUpscale} />
                    <Label htmlFor="no-upscale" className="cursor-pointer">Never enlarge beyond original</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="target" checked={useTargetSize} onCheckedChange={setUseTargetSize} />
                    <Label htmlFor="target" className="cursor-pointer">Target file size</Label>
                    {useTargetSize && (
                      <div className="flex items-center gap-2">
                        <Input type="number" min={5} value={targetKb} onChange={(e) => setTargetKb(Math.max(5, Number(e.target.value) || 0))} className="w-24" />
                        <span className="text-sm text-muted-foreground">KB</span>
                      </div>
                    )}
                  </div>
                  {fit === "contain" && (
                    <>
                      <div className="flex items-center gap-3">
                        <Switch id="transparent" checked={transparentPad} onCheckedChange={setTransparentPad} />
                        <Label htmlFor="transparent" className="cursor-pointer">Transparent padding</Label>
                      </div>
                      {!transparentPad && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor="bg">Padding colour</Label>
                          <Input id="bg" type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-14 p-1" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {items.length} image{items.length > 1 ? "s" : ""} · target {previewTarget.w}×{previewTarget.h}px
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={clearAll} disabled={busy}>
                      <X className="mr-2 h-4 w-4" /> Clear
                    </Button>
                    <Button onClick={run} disabled={busy}>
                      <Maximize2 className="mr-2 h-4 w-4" /> {busy ? "Resizing..." : "Resize images"}
                    </Button>
                  </div>
                </div>

                {busy && <Progress value={progress} />}
              </Card>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="relative p-3">
                    <button
                      type="button"
                      aria-label={`Remove ${item.file.name}`}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeItem(item.id)}
                      disabled={busy}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded bg-muted">
                      <img
                        src={item.outUrl || item.previewUrl}
                        alt={`Preview of ${item.file.name}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="truncate text-sm font-medium" title={item.file.name}>{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.width}×{item.height} · {formatBytes(item.file.size)}
                      {item.outWidth && ` → ${item.outWidth}×${item.outHeight} · ${formatBytes(item.outBlob!.size)}`}
                    </p>
                    {item.error && <p className="mt-2 text-xs text-destructive">{item.error}</p>}
                    {item.outBlob && (
                      <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => downloadBlob(item.outBlob!, item.outName!)}>
                        <Download className="mr-2 h-3 w-3" /> Download
                      </Button>
                    )}
                  </Card>
                ))}
              </div>

              {done.length > 0 && (
                <Button className="w-full" size="lg" onClick={downloadAll}>
                  {done.length > 1 ? <FileArchive className="mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}
                  {done.length > 1 ? `Download all ${done.length} as ZIP` : "Download resized image"}
                </Button>
              )}
            </>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default ImageResizer;
