import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Hash } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

type Position = "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left";

const BatesNumbering = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("ABC");
  const [suffix, setSuffix] = useState("");
  const [start, setStart] = useState(1);
  const [digits, setDigits] = useState(6);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [fontSize, setFontSize] = useState(10);
  const [busy, setBusy] = useState(false);

  const sample = `${prefix}${String(start).padStart(digits, "0")}${suffix}`;

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const margin = 28;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const label = `${prefix}${String(start + i).padStart(digits, "0")}${suffix}`;
        const w = font.widthOfTextAtSize(label, fontSize);
        const x =
          position.endsWith("left") ? margin :
          position.endsWith("center") ? (width - w) / 2 :
          width - margin - w;
        const y = position.startsWith("top") ? height - margin : margin - fontSize / 2;
        page.drawText(label, { x, y: Math.max(8, y), size: fontSize, font, color: rgb(0.15, 0.15, 0.2) });
      });

      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_bates.pdf`);
      toast.success(`Stamped ${pages.length} page${pages.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Bates stamping failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Bates Numbering for PDF"
      description="Apply sequential Bates numbers with a custom prefix, suffix and digit count to every PDF page — the legal-standard way to index discovery documents."
      keywords="bates numbering pdf, bates stamp online free, legal pdf numbering, sequential pdf page stamping, add bates numbers to pdf"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Hash className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="prefix">Prefix</Label>
              <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input id="suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="optional" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="start">Start number</Label>
              <Input id="start" type="number" min={0} value={start} onChange={(e) => setStart(Math.max(0, Number(e.target.value)))} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="digits">Digits</Label>
              <Input id="digits" type="number" min={1} max={12} value={digits} onChange={(e) => setDigits(Math.min(12, Math.max(1, Number(e.target.value))))} className="mt-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Position</Label>
              <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom right</SelectItem>
                  <SelectItem value="bottom-center">Bottom center</SelectItem>
                  <SelectItem value="bottom-left">Bottom left</SelectItem>
                  <SelectItem value="top-right">Top right</SelectItem>
                  <SelectItem value="top-left">Top left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text size: {fontSize}pt</Label>
              <Slider className="mt-4" value={[fontSize]} min={7} max={18} step={1} onValueChange={(v) => setFontSize(v[0])} />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            First stamp preview: <span className="font-mono font-semibold">{sample}</span>
          </div>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Hash className="h-4 w-4 mr-2" />{busy ? "Stamping..." : "Apply Bates Numbers"}
          </Button>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default BatesNumbering;
