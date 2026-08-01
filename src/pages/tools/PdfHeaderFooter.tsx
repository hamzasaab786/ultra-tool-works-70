import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Heading } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

const PdfHeaderFooter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [fontSize, setFontSize] = useState(10);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file) return;
    if (!header.trim() && !footer.trim()) return toast.error("Enter header or footer text");
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const fill = (t: string) =>
          t.replace(/\{page\}/gi, String(i + 1)).replace(/\{total\}/gi, String(total)).replace(/\{date\}/gi, new Date().toLocaleDateString());

        const draw = (raw: string, y: number) => {
          const value = fill(raw);
          if (!value) return;
          const w = font.widthOfTextAtSize(value, fontSize);
          const x = align === "left" ? 40 : align === "right" ? width - 40 - w : (width - w) / 2;
          page.drawText(value, { x, y, size: fontSize, font, color: rgb(0.25, 0.25, 0.3) });
        };

        if (header.trim()) draw(header, height - 30);
        if (footer.trim()) draw(footer, 22);
      });

      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_header-footer.pdf`);
      toast.success(`Applied to ${total} page${total > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Could not add header/footer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Add Header & Footer to PDF"
      description="Stamp a custom header and footer on every PDF page with automatic page numbers, totals and dates. Free, instant and processed in your browser."
      keywords="add header footer to pdf, pdf header text online, stamp footer on pdf pages, pdf header footer tool free"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <Heading className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="header">Header text</Label>
              <Input id="header" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Company Confidential" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="footer">Footer text</Label>
              <Input id="footer" value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Page {page} of {total}" className="mt-2" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Placeholders: <code>{"{page}"}</code>, <code>{"{total}"}</code>, <code>{"{date}"}</code>
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Alignment</Label>
              <Select value={align} onValueChange={(v) => setAlign(v as typeof align)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text size: {fontSize}pt</Label>
              <Slider className="mt-4" value={[fontSize]} min={7} max={18} step={1} onValueChange={(v) => setFontSize(v[0])} />
            </div>
          </div>

          <Button onClick={run} disabled={!file || busy} className="w-full" size="lg">
            <Heading className="h-4 w-4 mr-2" />{busy ? "Applying..." : "Add & Download"}
          </Button>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfHeaderFooter;
