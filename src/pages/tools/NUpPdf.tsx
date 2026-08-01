import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Grid2x2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

const LAYOUTS: Record<string, { cols: number; rows: number; label: string }> = {
  "2": { cols: 2, rows: 1, label: "2 pages per sheet" },
  "4": { cols: 2, rows: 2, label: "4 pages per sheet" },
  "6": { cols: 3, rows: 2, label: "6 pages per sheet" },
  "9": { cols: 3, rows: 3, label: "9 pages per sheet" },
};

const A4: [number, number] = [595.28, 841.89];

const NUpPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [layout, setLayout] = useState("2");
  const [landscape, setLandscape] = useState(true);
  const [borders, setBorders] = useState(true);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const embedded = await out.embedPages(src.getPages());

      const { cols, rows } = LAYOUTS[layout];
      const [pw, ph] = landscape ? [A4[1], A4[0]] : A4;
      const gap = 12;
      const cellW = (pw - gap * (cols + 1)) / cols;
      const cellH = (ph - gap * (rows + 1)) / rows;
      const perSheet = cols * rows;

      for (let i = 0; i < embedded.length; i += perSheet) {
        const sheet = out.addPage([pw, ph]);
        for (let s = 0; s < perSheet && i + s < embedded.length; s++) {
          const p = embedded[i + s];
          const col = s % cols;
          const row = Math.floor(s / cols);
          const cellX = gap + col * (cellW + gap);
          const cellY = ph - gap - (row + 1) * cellH - row * gap;
          const scale = Math.min(cellW / p.width, cellH / p.height);
          const w = p.width * scale;
          const h = p.height * scale;
          const x = cellX + (cellW - w) / 2;
          const y = cellY + (cellH - h) / 2;
          sheet.drawPage(p, { x, y, xScale: scale, yScale: scale });
          if (borders) {
            sheet.drawRectangle({ x, y, width: w, height: h, borderColor: rgb(0.8, 0.8, 0.85), borderWidth: 0.75 });
          }
        }
      }

      const bytes = await out.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_${layout}-up.pdf`);
      toast.success(`Created ${out.getPageCount()} sheet${out.getPageCount() > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Could not build the layout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Multiple PDF Pages Per Sheet (N-up)"
      description="Print 2, 4, 6 or 9 PDF pages on a single A4 sheet to save paper and ink. Pages are scaled and centred automatically — free and private."
      keywords="multiple pages per sheet pdf, n-up pdf, 4 pages on one pdf page, combine pdf pages onto one sheet"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Grid2x2 className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Layout</Label>
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LAYOUTS).map(([key, v]) => (
                    <SelectItem key={key} value={key}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="landscape">Landscape sheets</Label>
                <Switch id="landscape" checked={landscape} onCheckedChange={setLandscape} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="borders">Show cut borders</Label>
                <Switch id="borders" checked={borders} onCheckedChange={setBorders} />
              </div>
            </div>
          </div>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Grid2x2 className="h-4 w-4 mr-2" />{busy ? "Building..." : "Create N-up PDF"}
          </Button>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default NUpPdf;
