import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Maximize2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

const SIZES: Record<string, { label: string; dims: [number, number] }> = {
  a4: { label: "A4 (210 × 297 mm)", dims: [595.28, 841.89] },
  a3: { label: "A3 (297 × 420 mm)", dims: [841.89, 1190.55] },
  a5: { label: "A5 (148 × 210 mm)", dims: [419.53, 595.28] },
  letter: { label: "US Letter (8.5 × 11 in)", dims: [612, 792] },
  legal: { label: "Legal (8.5 × 14 in)", dims: [612, 1008] },
  tabloid: { label: "Tabloid (11 × 17 in)", dims: [792, 1224] },
};

const PdfPageResizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState("a4");
  const [orientation, setOrientation] = useState<"auto" | "portrait" | "landscape">("auto");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const pages = await out.embedPages(src.getPages());

      pages.forEach((embedded) => {
        let [tw, th] = SIZES[size].dims;
        const landscape = orientation === "landscape" || (orientation === "auto" && embedded.width > embedded.height);
        if (landscape) [tw, th] = [th, tw];

        // Scale to fit while preserving the original aspect ratio, then centre.
        const scale = Math.min(tw / embedded.width, th / embedded.height);
        const w = embedded.width * scale;
        const h = embedded.height * scale;
        const page = out.addPage([tw, th]);
        page.drawPage(embedded, { x: (tw - w) / 2, y: (th - h) / 2, xScale: scale, yScale: scale });
      });

      const bytes = await out.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_${size}.pdf`);
      toast.success(`Resized ${pages.length} page${pages.length > 1 ? "s" : ""} to ${size.toUpperCase()}`);
    } catch (e) {
      toast.error((e as Error).message || "Resize failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Resize PDF Page Size"
      description="Change a PDF to A4, A3, A5, Letter, Legal or Tabloid. Content is scaled and centred without stretching, so pages print perfectly every time."
      keywords="resize pdf page size, change pdf to a4, pdf letter to a4 converter, scale pdf pages online free"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Maximize2 className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Target page size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SIZES).map(([key, v]) => (
                    <SelectItem key={key} value={key}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Orientation</Label>
              <Select value={orientation} onValueChange={(v) => setOrientation(v as typeof orientation)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Keep original</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Maximize2 className="h-4 w-4 mr-2" />{busy ? "Resizing..." : "Resize & Download"}
          </Button>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfPageResizer;
