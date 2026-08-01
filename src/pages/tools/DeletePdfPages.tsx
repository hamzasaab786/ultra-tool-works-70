import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2, FileText } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { parsePageRanges, downloadBlob, baseName } from "@/utils/pdfPages";

const DeletePdfPages = () => {
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
    if (!pages.length) return toast.error("Enter pages to delete, e.g. 2, 5-7");
    if (pages.length >= pageCount) return toast.error("You cannot delete every page");

    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      // Remove from the end so earlier indices stay valid.
      [...pages].reverse().forEach((p) => doc.removePage(p - 1));
      const out = await doc.save();
      downloadBlob(out as unknown as ArrayBuffer, `${baseName(file.name)}_pages-removed.pdf`);
      toast.success(`Removed ${pages.length} page${pages.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Failed to delete pages");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Delete Pages from PDF"
      description="Remove unwanted pages from a PDF online. Pick single pages or ranges and download the cleaned file — everything runs in your browser."
      keywords="delete pages from pdf, remove pdf pages, pdf page remover online free"
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
                <Label htmlFor="ranges">Pages to delete</Label>
                <Input id="ranges" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1, 4-6, 9" className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Use commas for single pages and a dash for ranges (1–{pageCount}).</p>
              </div>
              <Button onClick={run} disabled={busy} className="w-full" size="lg">
                <Trash2 className="h-4 w-4 mr-2" />{busy ? "Removing..." : "Delete Pages & Download"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default DeletePdfPages;
