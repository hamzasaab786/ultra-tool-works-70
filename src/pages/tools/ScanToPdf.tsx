import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Upload, Trash2, Download, ScanLine } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob } from "@/utils/pdfPages";

const SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

const ScanToPdf = () => {
  const [shots, setShots] = useState<string[]>([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [enhance, setEnhance] = useState(true);
  const [size, setSize] = useState("a4");
  const [busy, setBusy] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const stop = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCameraOn(false);
  };

  useEffect(() => stop, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      stream.current = s;
      setCameraOn(true);
      // Wait for the element to mount before attaching.
      setTimeout(() => {
        if (video.current) {
          video.current.srcObject = s;
          video.current.play().catch(() => undefined);
        }
      }, 50);
    } catch {
      toast.error("Camera access denied. You can still upload photos instead.");
    }
  };

  const processCanvas = (canvas: HTMLCanvasElement) => {
    if (!enhance) return;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    // Document-scanner look: grayscale, then a contrast curve that whitens paper.
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const v = Math.max(0, Math.min(255, (lum - 128) * 1.6 + 150));
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  };

  const capture = () => {
    if (!video.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    canvas.getContext("2d")!.drawImage(video.current, 0, 0);
    processCanvas(canvas);
    setShots((prev) => [...prev, canvas.toDataURL("image/jpeg", 0.9)]);
    toast.success("Page captured");
  };

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      const url = URL.createObjectURL(f);
      // eslint-disable-next-line no-await-in-loop
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      processCanvas(canvas);
      setShots((prev) => [...prev, canvas.toDataURL("image/jpeg", 0.9)]);
      URL.revokeObjectURL(url);
    }
  };

  const buildPdf = async () => {
    if (!shots.length) return toast.error("Capture or add at least one page");
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const [pw, ph] = SIZES[size];

      for (const shot of shots) {
        const jpg = await doc.embedJpg(shot);
        const landscape = jpg.width > jpg.height;
        const [w, h] = landscape ? [ph, pw] : [pw, ph];
        const page = doc.addPage([w, h]);
        const scale = Math.min((w - 24) / jpg.width, (h - 24) / jpg.height);
        const iw = jpg.width * scale;
        const ih = jpg.height * scale;
        page.drawImage(jpg, { x: (w - iw) / 2, y: (h - ih) / 2, width: iw, height: ih });
      }

      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `scan-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success(`Scanned ${shots.length} page${shots.length > 1 ? "s" : ""} to PDF`);
    } catch (e) {
      toast.error((e as Error).message || "Could not build the PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Scan to PDF — Camera Document Scanner"
      description="Use your phone or webcam to scan documents straight into a multi-page PDF, with automatic paper-whitening enhancement. Nothing is uploaded anywhere."
      keywords="scan to pdf, document scanner online, camera to pdf, scan documents with phone to pdf free, photo to pdf scanner"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <div className="flex flex-wrap gap-3">
            {!cameraOn ? (
              <Button onClick={startCamera}><Camera className="h-4 w-4 mr-2" />Start camera</Button>
            ) : (
              <>
                <Button onClick={capture}><ScanLine className="h-4 w-4 mr-2" />Capture page</Button>
                <Button variant="outline" onClick={stop}>Stop camera</Button>
              </>
            )}
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />Add photos
                <input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </label>
            </Button>
          </div>

          {cameraOn && (
            <div className="rounded-lg overflow-hidden bg-black">
              <video ref={video} playsInline muted className="w-full max-h-[60vh] object-contain" />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Page size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">US Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-6">
              <div>
                <Label htmlFor="enhance">Scanner enhancement</Label>
                <p className="text-xs text-muted-foreground">Whitens paper and sharpens text contrast.</p>
              </div>
              <Switch id="enhance" checked={enhance} onCheckedChange={setEnhance} />
            </div>
          </div>
        </Card>

        {shots.length > 0 && (
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">{shots.length} scanned page{shots.length > 1 ? "s" : ""}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shots.map((s, i) => (
                <div key={i} className="relative border rounded-lg overflow-hidden">
                  <img src={s} alt={`Scanned page ${i + 1}`} className="w-full h-40 object-cover" />
                  <span className="absolute top-1 left-1 text-xs bg-background/90 rounded px-1.5">{i + 1}</span>
                  <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-7 w-7"
                    onClick={() => setShots((p) => p.filter((_, idx) => idx !== i))} aria-label={`Remove page ${i + 1}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={buildPdf} disabled={busy} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />{busy ? "Building PDF..." : "Save as PDF"}
            </Button>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default ScanToPdf;
