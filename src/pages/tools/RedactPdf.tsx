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
      const { pdfjsLib } = await import("@/utils/pdfClient");
      const { PDFDocument, rgb } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await pdfjsLib.getDocument({ data: bytes }).promise;
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const outPages = doc.getPages();
      let hits = 0;

      for (let p = 1; p <= src.numPages; p++) {
        const page = await src.getPage(p);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        const outPage = outPages[p - 1];
        const { height: ph } = outPage.getSize();

        for (const item of content.items as any[]) {
          const str: string = item.str || "";
          const lower = str.toLowerCase();
          const match = patterns.some(pat => lower.includes(pat.toLowerCase()));
          if (!match) continue;
          const tx = item.transform;
          const x = tx[4];
          const y = tx[5];
          const w = item.width;
          const h = item.height || Math.abs(tx[3]) || 10;
          // pdfjs viewport y is top-down; pdf-lib y is bottom-up. Item y is already PDF-space (bottom-up).
          outPage.drawRectangle({
            x, y: y - 1, width: w, height: h + 2,
            color: rgb(0, 0, 0),
          });
          hits++;
        }
        void viewport;
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
