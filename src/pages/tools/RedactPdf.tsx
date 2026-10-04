import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EyeOff, Upload, AlertTriangle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const RedactPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [terms, setTerms] = useState("");
  const [isRedacting, setIsRedacting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
    else if (f) toast({ title: "Invalid file", description: "PDF only", variant: "destructive" });
  };

  const redactPdf = async () => {
    if (!file) return;
    const patterns = terms.split(",").map(t => t.trim()).filter(Boolean);
    if (patterns.length === 0) {
      toast({ title: "No search terms", description: "Enter comma-separated words/phrases to redact.", variant: "destructive" });
      return;
    }
    setIsRedacting(true);
    try {
      const { pdfjsLib, renderPdfPageToCanvas } = await import("@/utils/pdfClient");
      const { PDFDocument } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      // pdf.js transfers (detaches) its input buffer, so give it a copy.
      const src = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      let hits = 0;
      const mctx = document.createElement("canvas").getContext("2d")!;

      for (let p = 1; p <= src.numPages; p++) {
        const page = await src.getPage(p);
        const content = await page.getTextContent();
        const boxes: number[][] = [];
        for (const item of content.items as any[]) {
          const str = String(item.str || "");
          const lower = str.toLowerCase();
          if (!str.length) continue;
          const tx = item.transform;
          const h = item.height || Math.abs(tx[3]) || 10;
          // Measure glyph widths proportionally so boxes land on the exact word.
          const fam = (content.styles as any)?.[item.fontName]?.fontFamily || "sans-serif";
          mctx.font = `100px ${fam}`;
          const full = mctx.measureText(str).width || 1;
          const xAt = (k: number) => tx[4] + (mctx.measureText(str.slice(0, k)).width / full) * item.width;
          // Black out only the matched characters, not the whole text run.
          for (const pat of patterns) {
            const needle = pat.toLowerCase();
            let i = lower.indexOf(needle);
            while (i !== -1) {
              boxes.push([xAt(i) - h * 0.15, tx[5] - h * 0.25, xAt(i + needle.length) + h * 0.35, tx[5] + h * 1.05]);
              i = lower.indexOf(needle, i + needle.length);
            }
          }
        }
        if (!boxes.length) continue;
        hits += boxes.length;

        // Burn the black boxes into a rendered image of the page and swap the
        // page out, so the underlying text is truly gone (not just covered).
        const scale = 2;
        const { canvas } = await renderPdfPageToCanvas(page, scale);
        const vp = page.getViewport({ scale });
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#000";
        for (const bx of boxes) {
          const [x1, y1, x2, y2] = vp.convertToViewportRectangle(bx);
          ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
        }
        const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
        if (!png) throw new Error("Could not render page " + p);
        const img = await doc.embedPng(new Uint8Array(await png.arrayBuffer()));
        const base = page.getViewport({ scale: 1 });
        doc.removePage(p - 1);
        const np = doc.insertPage(p - 1, [base.width, base.height]);
        np.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
      }

      if (hits === 0) {
        toast({ title: "No matches", description: "None of the terms were found in the PDF text.", variant: "destructive" });
        setIsRedacting(false);
        return;
      }

      const out = await doc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + "_redacted.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: `Redacted ${hits} match${hits > 1 ? "es" : ""}`, description: "Downloaded redacted PDF." });
    } catch (error) {
      console.error(error);
      toast({ title: "Redaction failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsRedacting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Redact PDF"
      description="Permanently black out sensitive words or phrases across every page of a PDF."
      keywords="redact pdf, remove sensitive data, pdf privacy"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" id="pdf-upload" />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-full"><EyeOff className="h-10 w-10 text-gray-700" /></div>
            <p className="text-lg font-medium">{file ? file.name : "Choose PDF to redact"}</p>
            <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Select PDF</Button>
          </label>
        </div>

        {file && (
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <Label htmlFor="terms">Words / phrases to redact (comma-separated)</Label>
              <Input id="terms" value={terms} onChange={e => setTerms(e.target.value)}
                placeholder="e.g. John Smith, [email protected], 555-0100" className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Matching is case-insensitive. Only text-based PDFs (not scanned images) can be redacted here.</p>
            </div>
            <Button onClick={redactPdf} disabled={isRedacting} className="w-full">
              {isRedacting ? "Redacting..." : <><EyeOff className="h-4 w-4 mr-2" />Redact & Download</>}
            </Button>
          </div>
        )}

        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 text-sm text-red-700">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Important</p>
            <p>Redaction draws opaque black rectangles over matched text. Always open the output and verify before sharing.</p>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RedactPdf;
