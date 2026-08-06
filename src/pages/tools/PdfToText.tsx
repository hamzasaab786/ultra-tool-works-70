import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Copy, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, mapConcurrent } from "@/utils/pdfClient";

interface Item {
  str: string;
  x: number;
  y: number;
}

/** Groups text items into visual lines so the output keeps the original layout. */
const itemsToText = (items: Item[]) => {
  if (!items.length) return "";
  const sorted = [...items].sort((a, b) => (Math.abs(a.y - b.y) > 2 ? b.y - a.y : a.x - b.x));
  const lines: Item[][] = [];
  let current: Item[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const item = sorted[i];
    if (Math.abs(item.y - current[current.length - 1].y) <= 2.5) current.push(item);
    else {
      lines.push(current);
      current = [item];
    }
  }
  lines.push(current);

  return lines
    .map((line) =>
      line
        .sort((a, b) => a.x - b.x)
        .reduce((acc, item, idx, arr) => {
          const prev = arr[idx - 1];
          const gap = prev ? item.x - prev.x : 0;
          const needsSpace = prev && gap > 1 && !/\s$/.test(acc) && !/^\s/.test(item.str);
          return acc + (needsSpace ? " " : "") + item.str;
        }, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .join("\n");
};

const PdfToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    if (!file) return toast.error("Please select a PDF file first");
    setBusy(true);
    try {
      const pdf = await loadPdfDocument(file);
      const pages = await mapConcurrent(
        Array.from({ length: pdf.numPages }, (_, i) => i + 1),
        async (n) => {
          const page = await pdf.getPage(n);
          const content = await page.getTextContent();
          const items: Item[] = (content.items as any[])
            .filter((i) => typeof i.str === "string" && i.str.length)
            .map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5] }));
          page.cleanup();
          return itemsToText(items);
        }
      );
      const output = pages
        .map((p, i) => `--- Page ${i + 1} ---\n${p}`)
        .join("\n\n")
        .trim();
      setText(output);
      if (!output.replace(/--- Page \d+ ---/g, "").trim())
        toast.warning("No selectable text found — this PDF looks scanned. Try the PDF OCR tool.");
      else toast.success(`Extracted text from ${pdf.numPages} page(s)`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read this PDF");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.pdf$/i, "") || "document") + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <ToolPageTemplate
      title="PDF to Text"
      description="Convert PDF documents to plain text (.txt) instantly in your browser with layout-aware line detection."
      keywords="pdf to text, convert pdf to txt, pdf text converter"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileText className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Fast, private, 100% client-side PDF → TXT conversion.</p>
        </div>

        <input
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Select PDF file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setText("");
            }
          }}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        {file && <p className="text-sm text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}

        <Button onClick={convert} disabled={!file || busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          {busy ? "Converting…" : "Convert to Text"}
        </Button>

        {text && (
          <div className="space-y-3">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} className="font-mono text-sm" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button className="flex-1" onClick={download}>
                <Download className="mr-2 h-4 w-4" /> Download .txt
              </Button>
            </div>
          </div>
        )}
      </Card>
    </ToolPageTemplate>
  );
};

export default PdfToText;
