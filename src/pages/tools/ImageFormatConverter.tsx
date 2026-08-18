import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, Download, X, RefreshCw, FileArchive, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import {
  FORMATS,
  ImageFormat,
  baseFileName,
  decodeImageFile,
  downloadAsZip,
  downloadBlob,
  encodeCanvas,
  formatBytes,
  getFormat,
  resizeCanvas,
} from "@/utils/imageEngine";

interface Job {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "working" | "done" | "error";
  message?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  outWidth?: number;
  outHeight?: number;
  outBlob?: Blob;
  outUrl?: string;
  outName?: string;
}

const ICO_SIZE_SETS: Record<string, number[]> = {
  all: [256, 128, 64, 48, 32, 16],
  favicon: [64, 48, 32, 16],
  "256": [256],
  "128": [128],
  "64": [64],
  "32": [32],
  "16": [16],
};

const ImageFormatConverter = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("jpeg");
  const [quality, setQuality] = useState(92);
  const [background, setBackground] = useState("#ffffff");
  const [icoPreset, setIcoPreset] = useState("all");
  const [limitSize, setLimitSize] = useState(false);
  const [maxEdge, setMaxEdge] = useState(2000);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const jobsRef = useRef<Job[]>([]);
  jobsRef.current = jobs;

  useEffect(() => () => {
    jobsRef.current.forEach((j) => {
      URL.revokeObjectURL(j.previewUrl);
      if (j.outUrl) URL.revokeObjectURL(j.outUrl);
    });
  }, []);

  const info = getFormat(targetFormat)!;
  const showQuality = info.lossy;
  const showBackground = !info.alpha;
  const showIco = targetFormat === "ico";

  const addFiles = useCallback((files: FileList | File[]) => {
    const accepted: Job[] = [];
    Array.from(files).forEach((file) => {
      const looksImage = file.type.startsWith("image/") || /\.(heic|heif|tiff?|ico|avif|svg|bmp|jfif)$/i.test(file.name);
      if (!looksImage) {
        toast({ title: "Skipped", description: `${file.name} is not an image file.`, variant: "destructive" });
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast({ title: "Skipped", description: `${file.name} is larger than 100MB.`, variant: "destructive" });
        return;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "pending",
      });
    });
    if (accepted.length) setJobs((prev) => [...prev, ...accepted]);
  }, []);

  const removeJob = (id: string) => {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === id);
      if (job) {
        URL.revokeObjectURL(job.previewUrl);
        if (job.outUrl) URL.revokeObjectURL(job.outUrl);
      }
      return prev.filter((j) => j.id !== id);
    });
  };

  const clearAll = () => {
    jobs.forEach((j) => {
      URL.revokeObjectURL(j.previewUrl);
      if (j.outUrl) URL.revokeObjectURL(j.outUrl);
    });
    setJobs([]);
    setProgress(0);
  };

  const convertAll = useCallback(async () => {
    if (!jobs.length || busy) return;
    setBusy(true);
    setProgress(0);
    const notes = new Set<string>();

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: "working", message: undefined } : j)));
      // Yield so the UI can paint between files.
      await new Promise((r) => setTimeout(r, 0));
      try {
        const decoded = await decodeImageFile(job.file);
        let canvas = decoded.canvas;
        if (limitSize && maxEdge > 0 && Math.max(canvas.width, canvas.height) > maxEdge) {
          const ratio = maxEdge / Math.max(canvas.width, canvas.height);
          canvas = resizeCanvas(canvas, {
            width: Math.round(canvas.width * ratio),
            height: Math.round(canvas.height * ratio),
            fit: "stretch",
          });
        }
        const result = await encodeCanvas(canvas, {
          format: targetFormat,
          quality,
          background,
          icoSizes: ICO_SIZE_SETS[icoPreset],
        });
        if (result.note) notes.add(result.note);
        const ext = getFormat(result.format)!.extension;
        const outUrl = URL.createObjectURL(result.blob);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "done",
                  sourceWidth: decoded.width,
                  sourceHeight: decoded.height,
                  outWidth: canvas.width,
                  outHeight: canvas.height,
                  outBlob: result.blob,
                  outUrl,
                  outName: `${baseFileName(job.file.name)}.${ext}`,
                  message: result.note,
                }
              : j,
          ),
        );
      } catch (error) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id ? { ...j, status: "error", message: (error as Error).message } : j,
          ),
        );
      }
      setProgress(Math.round(((i + 1) / jobs.length) * 100));
    }

    setBusy(false);
    notes.forEach((note) => toast({ title: "Heads up", description: note }));
    toast({ title: "Conversion finished", description: `${jobs.length} image${jobs.length > 1 ? "s" : ""} processed.` });
  }, [jobs, busy, targetFormat, quality, background, icoPreset, limitSize, maxEdge]);

  const doneJobs = useMemo(() => jobs.filter((j) => j.status === "done" && j.outBlob), [jobs]);

  const downloadAll = async () => {
    if (!doneJobs.length) return;
    if (doneJobs.length === 1) {
      downloadBlob(doneJobs[0].outBlob!, doneJobs[0].outName!);
      return;
    }
    await downloadAsZip(
      doneJobs.map((j) => ({ name: j.outName!, blob: j.outBlob! })),
      `converted-images-${getFormat(targetFormat)!.extension}.zip`,
    );
    toast({ title: "Downloaded", description: `${doneJobs.length} images saved as a ZIP archive.` });
  };

  const totalIn = jobs.reduce((s, j) => s + j.file.size, 0);
  const totalOut = doneJobs.reduce((s, j) => s + (j.outBlob?.size || 0), 0);

  return (
    <>
      <SEO
        title="Image Format Converter — PNG, JPG, WebP, AVIF, TIFF, BMP, GIF, ICO, SVG"
        description="Convert images between JPG, PNG, WebP, AVIF, BMP, GIF, TIFF, ICO and SVG in your browser. Batch conversion, quality control and true format encoding — no uploads."
        keywords="image format converter, png to jpg, jpg to webp, webp to png, avif converter, tiff converter, ico converter, batch image converter"
        canonicalUrl="https://klipza.live/tools/image-format-converter"
      />

      <ToolPageTemplate
        title="Image Format Converter"
        description="Batch-convert images to JPG, PNG, WebP, AVIF, BMP, GIF, TIFF, ICO or SVG with true format encoding and full quality control."
      >
        <div className="space-y-6">
          <Card className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Target format</Label>
                <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as ImageFormat)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showQuality && (
                <div className="space-y-2">
                  <Label>Quality: {quality}%</Label>
                  <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={1} className="pt-3" />
                </div>
              )}

              {showBackground && (
                <div className="space-y-2">
                  <Label>Transparency fill</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-14 p-1" />
                    <Input value={background} onChange={(e) => setBackground(e.target.value)} className="flex-1" />
                  </div>
                </div>
              )}

              {showIco && (
                <div className="space-y-2">
                  <Label>Icon sizes</Label>
                  <Select value={icoPreset} onValueChange={setIcoPreset}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sizes (16–256px)</SelectItem>
                      <SelectItem value="favicon">Favicon set (16–64px)</SelectItem>
                      <SelectItem value="256">256 × 256</SelectItem>
                      <SelectItem value="128">128 × 128</SelectItem>
                      <SelectItem value="64">64 × 64</SelectItem>
                      <SelectItem value="32">32 × 32</SelectItem>
                      <SelectItem value="16">16 × 16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Switch id="limit-size" checked={limitSize} onCheckedChange={setLimitSize} />
                <Label htmlFor="limit-size" className="cursor-pointer">Limit longest edge</Label>
              </div>
              {limitSize && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={16}
                    max={12000}
                    value={maxEdge}
                    onChange={(e) => setMaxEdge(Math.max(16, Number(e.target.value) || 0))}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                EXIF rotation is applied automatically, so photos never come out sideways.
              </p>
            </div>
          </Card>

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
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP, AVIF, BMP, GIF, TIFF, ICO, SVG · max 100MB each</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,.ico,.tiff,.tif,.avif,.svg,.heic,.heif"
              onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
            />
            <Button className="mt-4" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Select images
            </Button>
          </div>

          {jobs.length > 0 && (
            <Card className="space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">
                  {jobs.length} image{jobs.length > 1 ? "s" : ""} · {formatBytes(totalIn)}
                  {totalOut > 0 && <span className="text-muted-foreground"> → {formatBytes(totalOut)}</span>}
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearAll} disabled={busy}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Clear
                  </Button>
                  <Button onClick={convertAll} disabled={busy}>
                    {busy ? "Converting..." : `Convert to ${info.label}`}
                  </Button>
                </div>
              </div>

              {busy && <Progress value={progress} />}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div key={job.id} className="relative rounded-lg border p-3">
                    <button
                      type="button"
                      aria-label={`Remove ${job.file.name}`}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeJob(job.id)}
                      disabled={busy}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded bg-muted">
                      <img
                        src={job.outUrl && job.status === "done" && targetFormat !== "ico" ? job.outUrl : job.previewUrl}
                        alt={`Preview of ${job.file.name}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="truncate text-sm font-medium" title={job.file.name}>{job.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(job.file.size)}
                      {job.outBlob && ` → ${formatBytes(job.outBlob.size)}`}
                      {job.outWidth ? ` · ${job.outWidth}×${job.outHeight}` : ""}
                    </p>
                    {job.status === "error" && (
                      <p className="mt-2 flex items-start gap-1 text-xs text-destructive">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />{job.message}
                      </p>
                    )}
                    {job.status === "done" && (
                      <div className="mt-2 space-y-2">
                        {job.message && <p className="text-xs text-muted-foreground">{job.message}</p>}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => downloadBlob(job.outBlob!, job.outName!)}
                        >
                          <Download className="mr-2 h-3 w-3" /> {job.outName!.split(".").pop()!.toUpperCase()}
                        </Button>
                      </div>
                    )}
                    {job.status === "working" && <p className="mt-2 text-xs text-muted-foreground">Converting…</p>}
                  </div>
                ))}
              </div>

              {doneJobs.length > 0 && (
                <Button className="w-full" size="lg" onClick={downloadAll}>
                  {doneJobs.length > 1 ? <FileArchive className="mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}
                  {doneJobs.length > 1 ? `Download all ${doneJobs.length} as ZIP` : "Download converted image"}
                </Button>
              )}
            </Card>
          )}

          <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Real format encoding
            </p>
            <p className="mt-1">
              BMP, TIFF, GIF and ICO are written with proper binary encoders instead of a renamed PNG, so the files open
              correctly in Photoshop, Windows and every image viewer. If a browser cannot encode WebP or AVIF, you are told
              before the file is saved.
            </p>
          </div>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default ImageFormatConverter;
