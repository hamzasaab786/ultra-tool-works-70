import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Contrast } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, renderPdfPageToCanvas } from "@/utils/pdfClient";
import { downloadBlob, baseName } from "@/utils/pdfPages";

type Mode = "grayscale" | "bw" | "invert";

const GrayscalePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("grayscale");
  const [threshold, setThreshold] = useState(160);
  const [dpiScale, setDpiScale] = useState("2");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await loadPdfDocument(file);
      const out = await PDFDocument.create();

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const { canvas } = await renderPdfPageToCanvas(page, Number(dpiScale));
        const ctx = canvas.getContext("2d")!;
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = img.data;

        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          let v: number;
          if (mode === "grayscale") v = lum;
          else if (mode === "bw") v = lum >= threshold ? 255 : 0;
          else v = 255 - lum;
          d[i] = d[i + 1] = d[i + 2] = v;
        }
        ctx.putImageData(img, 0, 0);

        const jpg = await out.embedJpg(canvas.toDataURL("image/jpeg", 0.9));
        const base = page.getViewport({ scale: 1 });
        const newPage = out.addPage([base.width, base.height]);
        newPage.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
        setProgress(Math.round((p / pdf.numPages) * 100));
      }

      const bytes = await out.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_${mode}.pdf`);
      toast.success("Converted PDF downloaded");
    } catch (e) {
      toast.error((e as Error).message || "Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Grayscale & Black-and-White PDF Converter"
      description="Convert a colour PDF to grayscale, pure black and white, or inverted dark mode. Saves colour ink and makes scans crisper — all in your browser."
      keywords="grayscale pdf converter, convert pdf to black and white, remove colour from pdf, invert pdf colours, pdf dark mode converter"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Contrast className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Conversion mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="grayscale">Grayscale (shades of grey)</SelectItem>
                  <SelectItem value="bw">Pure black &amp; white</SelectItem>
                  <SelectItem value="invert">Inverted (dark mode)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Output quality</Label>
              <Select value={dpiScale} onValueChange={setDpiScale}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5">Standard (108 DPI)</SelectItem>
                  <SelectItem value="2">High (144 DPI)</SelectItem>
                  <SelectItem value="3">Print (216 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {mode === "bw" && (
            <div>
              <Label>Black &amp; white threshold: {threshold}</Label>
              <Slider className="mt-4" value={[threshold]} min={60} max={220} step={5} onValueChange={(v) => setThreshold(v[0])} />
              <p className="text-xs text-muted-foreground mt-1">Lower keeps more detail dark; higher makes the page cleaner.</p>
            </div>
          )}

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Contrast className="h-4 w-4 mr-2" />{busy ? "Converting..." : "Convert & Download"}
          </Button>

          {busy && <Progress value={progress} />}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default GrayscalePdf;
