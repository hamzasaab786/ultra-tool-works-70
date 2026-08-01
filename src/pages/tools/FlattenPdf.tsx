import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Layers, ShieldCheck } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, renderPdfPageToCanvas } from "@/utils/pdfClient";
import { downloadBlob, baseName } from "@/utils/pdfPages";

const FlattenPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"forms" | "raster">("forms");
  const [quality, setQuality] = useState("2");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const flattenForms = async () => {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
    const form = doc.getForm();
    const fields = form.getFields().length;
    form.flatten();
    const bytes = await doc.save();
    downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file!.name)}_flattened.pdf`);
    toast.success(fields ? `Flattened ${fields} form field${fields > 1 ? "s" : ""}` : "Saved a flattened copy (no form fields found)");
  };

  const flattenRaster = async () => {
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await loadPdfDocument(file!);
    const out = await PDFDocument.create();
    const scale = Number(quality);

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const { canvas } = await renderPdfPageToCanvas(page, scale);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const img = await out.embedJpg(dataUrl);
      const base = page.getViewport({ scale: 1 });
      const newPage = out.addPage([base.width, base.height]);
      newPage.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
      setProgress(Math.round((p / pdf.numPages) * 100));
    }

    const bytes = await out.save();
    downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file!.name)}_flattened.pdf`);
    toast.success("PDF flattened to non-editable pages");
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    try {
      if (mode === "forms") await flattenForms();
      else await flattenRaster();
    } catch (e) {
      toast.error((e as Error).message || "Flatten failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Flatten PDF"
      description="Lock form fields, annotations and layers into the page so your PDF looks identical everywhere and can no longer be edited or re-filled."
      keywords="flatten pdf, flatten pdf form fields, make pdf non editable, lock pdf annotations online"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Layers className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Flatten mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "forms" | "raster")}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="forms">Forms &amp; annotations (keeps text selectable)</SelectItem>
                  <SelectItem value="raster">Full flatten (pages become images)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode === "raster" && (
              <div>
                <Label>Output quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">Standard (108 DPI)</SelectItem>
                    <SelectItem value="2">High (144 DPI)</SelectItem>
                    <SelectItem value="3">Print (216 DPI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <ShieldCheck className="h-4 w-4 mr-2" />{busy ? "Flattening..." : "Flatten & Download"}
          </Button>

          {busy && mode === "raster" && <Progress value={progress} />}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default FlattenPdf;
