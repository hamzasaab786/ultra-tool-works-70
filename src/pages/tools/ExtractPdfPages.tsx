import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Scissors, FileText } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { parsePageRanges, downloadBlob, baseName } from "@/utils/pdfPages";

const ExtractPdfPages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);

  const onSelect = async (f: File | null) => {
    setFile(f);
    setPageCount(0);
    if (!f) return;
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      toast.error("Could not read this PDF");
    }
  };

  const run = async () => {
    if (!file) return;
    const pages = parsePageRanges(ranges, pageCount);
    if (!pages.length) return toast.error("Enter pages to extract, e.g. 1-3, 7");

    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_extracted.pdf`);
      toast.success(`Extracted ${pages.length} page${pages.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Failed to extract pages");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Extract Pages from PDF"
      description="Pull selected pages out of a PDF into a brand new document. Choose single pages or ranges — fast, free and fully private in your browser."
      keywords="extract pages from pdf, pdf page extractor, save selected pdf pages, separate pdf pages online"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <FileText className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a PDF"}</p>
            {pageCount > 0 && <p className="text-sm text-muted-foreground">{pageCount} pages</p>}
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => onSelect(e.target.files?.[0] || null)} />
          </label>

          {pageCount > 0 && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="ranges">Pages to extract</Label>
                <Input id="ranges" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 7, 10-12" className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Pages keep their original order and quality (1–{pageCount}).</p>
              </div>
              <Button onClick={run} disabled={busy} className="w-full" size="lg">
                <Scissors className="h-4 w-4 mr-2" />{busy ? "Extracting..." : "Extract Pages & Download"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExtractPdfPages;
