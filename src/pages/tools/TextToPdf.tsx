import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileType, Download } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob } from "@/utils/pdfPages";

const SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
  a5: [419.53, 595.28],
};

const TextToPdf = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState("a4");
  const [family, setFamily] = useState("Helvetica");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(56);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!text.trim()) return toast.error("Type or paste some text first");
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const font = await doc.embedFont((StandardFonts as any)[family] || StandardFonts.Helvetica);
      const [pw, ph] = SIZES[size];
      const lineHeight = fontSize * 1.45;
      const maxWidth = pw - margin * 2;

      // Word-wrap every paragraph to the page width.
      const lines: string[] = [];
      for (const paragraph of text.replace(/\r/g, "").split("\n")) {
        if (!paragraph.trim()) { lines.push(""); continue; }
        let current = "";
        for (const word of paragraph.split(/\s+/)) {
          const candidate = current ? `${current} ${word}` : word;
          if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
            current = candidate;
          } else {
            if (current) lines.push(current);
            current = word;
          }
        }
        lines.push(current);
      }

      let page = doc.addPage([pw, ph]);
      let y = ph - margin;
      for (const line of lines) {
        if (y < margin) {
          page = doc.addPage([pw, ph]);
          y = ph - margin;
        }
        if (line) {
          page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.12) });
        }
        y -= lineHeight;
      }

      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, "text-document.pdf");
      toast.success(`Created a ${doc.getPageCount()}-page PDF`);
    } catch (e) {
      toast.error((e as Error).message || "Could not create the PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Text to PDF Converter"
      description="Turn plain text or notes into a clean, properly paginated PDF with your choice of page size, font and margins. Free and fully offline in your browser."
      keywords="text to pdf, txt to pdf converter, convert notes to pdf online free, plain text pdf generator"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="text">Your text</Label>
              <label className="text-xs text-primary cursor-pointer hover:underline">
                Import .txt
                <input
                  type="file"
                  accept=".txt,text/plain"
                  hidden
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setText(await f.text());
                  }}
                />
              </label>
            </div>
            <Textarea id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your content here..." className="mt-2 min-h-[280px]" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Page size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">US Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font</Label>
              <Select value={family} onValueChange={setFamily}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="TimesRoman">Times Roman</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font size: {fontSize}pt</Label>
              <Slider className="mt-4" value={[fontSize]} min={8} max={24} step={1} onValueChange={(v) => setFontSize(v[0])} />
            </div>
          </div>

          <div>
            <Label>Margin: {Math.round(margin)}pt</Label>
            <Slider className="mt-4" value={[margin]} min={24} max={100} step={4} onValueChange={(v) => setMargin(v[0])} />
          </div>

          <Button onClick={run} disabled={busy || !text.trim()} className="w-full" size="lg">
            {busy ? <>Creating...</> : <><Download className="h-4 w-4 mr-2" />Create PDF</>}
          </Button>
        </Card>

        <Card className="p-6 text-sm text-muted-foreground flex gap-3">
          <FileType className="h-5 w-5 text-primary shrink-0" />
          <p>Text stays selectable and searchable in the finished PDF, so it works for résumés, letters, code snippets and meeting notes alike.</p>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default TextToPdf;
