import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, Images, Download } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, pdfjsLib } from "@/utils/pdfClient";
import { downloadBlob, baseName } from "@/utils/pdfPages";

interface Extracted {
  url: string;
  page: number;
  w: number;
  h: number;
}

const ExtractPdfImages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<Extracted[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const imgToCanvas = (img: any): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = img.width;
    canvas.height = img.height;

    if (img.bitmap) {
      ctx.drawImage(img.bitmap, 0, 0);
      return canvas;
    }
    if (!img.data) return null;

    const out = ctx.createImageData(img.width, img.height);
    const src = img.data as Uint8ClampedArray;
    const pixels = img.width * img.height;
    const channels = src.length / pixels;
    for (let i = 0; i < pixels; i++) {
      if (channels >= 4) {
        out.data[i * 4] = src[i * 4];
        out.data[i * 4 + 1] = src[i * 4 + 1];
        out.data[i * 4 + 2] = src[i * 4 + 2];
        out.data[i * 4 + 3] = src[i * 4 + 3];
      } else if (channels >= 3) {
        out.data[i * 4] = src[i * 3];
        out.data[i * 4 + 1] = src[i * 3 + 1];
        out.data[i * 4 + 2] = src[i * 3 + 2];
        out.data[i * 4 + 3] = 255;
      } else {
        out.data[i * 4] = out.data[i * 4 + 1] = out.data[i * 4 + 2] = src[i];
        out.data[i * 4 + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
    return canvas;
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setImages([]);
    setProgress(0);
    try {
      const pdf = await loadPdfDocument(file);
      const found: Extracted[] = [];
      const seen = new Set<string>();

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        // Rendering first populates page.objs with decoded image data.
        await page.getOperatorList();
        const ops = await page.getOperatorList();
        for (let i = 0; i < ops.fnArray.length; i++) {
          const fn = ops.fnArray[i];
          if (fn !== pdfjsLib.OPS.paintImageXObject && fn !== (pdfjsLib.OPS as any).paintJpegXObject) continue;
          const name = ops.argsArray[i][0];
          if (typeof name !== "string" || seen.has(`${p}:${name}`)) continue;
          seen.add(`${p}:${name}`);
          try {
            const img: any = await new Promise((resolve, reject) => {
              const timer = setTimeout(() => reject(new Error("timeout")), 8000);
              page.objs.get(name, (value: any) => {
                clearTimeout(timer);
                resolve(value);
              });
            });
            if (!img || !img.width || !img.height) continue;
            const canvas = imgToCanvas(img);
            if (!canvas) continue;
            found.push({ url: canvas.toDataURL("image/png"), page: p, w: img.width, h: img.height });
          } catch {
            /* skip images pdf.js cannot decode */
          }
        }
        setProgress(Math.round((p / pdf.numPages) * 100));
      }

      setImages(found);
      if (!found.length) toast.error("No embedded images found. Try the PDF to JPG tool to save whole pages.");
      else toast.success(`Found ${found.length} image${found.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Extraction failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async (img: Extracted, index: number) => {
    const res = await fetch(img.url);
    downloadBlob(await res.blob(), `${baseName(file?.name || "pdf")}_p${img.page}_${index + 1}.png`, "image/png");
  };

  const saveAll = async () => {
    for (let i = 0; i < images.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await save(images[i], i);
    }
  };

  return (
    <ToolPageTemplate
      title="Extract Images from PDF"
      description="Pull every embedded photo and graphic out of a PDF and save them as PNG files. No upload — extraction runs entirely in your browser."
      keywords="extract images from pdf, pdf image extractor, save pictures from pdf, get photos out of pdf free"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Images className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => { setFile(e.target.files?.[0] || null); setImages([]); }} />
          </label>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Images className="h-4 w-4 mr-2" />{busy ? "Scanning pages..." : "Extract Images"}
          </Button>

          {busy && <Progress value={progress} />}
        </Card>

        {images.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{images.length} images found</h3>
              <Button size="sm" onClick={saveAll}><Download className="h-4 w-4 mr-1" />Download all</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={`${img.page}-${i}`} className="border rounded-lg p-2 space-y-2">
                  <img src={img.url} alt={`Image ${i + 1} extracted from page ${img.page}`} className="w-full h-28 object-contain bg-muted rounded" loading="lazy" />
                  <div className="text-xs text-muted-foreground">Page {img.page} · {img.w}×{img.h}</div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => save(img, i)}>
                    <Download className="h-3 w-3 mr-1" />PNG
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default ExtractPdfImages;
