import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FilePlus2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

const InsertPdfPages = () => {
  const [base, setBase] = useState<File | null>(null);
  const [insert, setInsert] = useState<File | null>(null);
  const [basePages, setBasePages] = useState(0);
  const [insertPages, setInsertPages] = useState(0);
  const [where, setWhere] = useState<"after" | "before" | "start" | "end">("after");
  const [at, setAt] = useState(1);
  const [busy, setBusy] = useState(false);

  const count = async (f: File) => {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    return doc.getPageCount();
  };

  const pick = async (f: File | null, which: "base" | "insert") => {
    if (!f) return;
    try {
      const n = await count(f);
      if (which === "base") { setBase(f); setBasePages(n); setAt(Math.min(at, n)); }
      else { setInsert(f); setInsertPages(n); }
    } catch {
      toast.error("Could not read this PDF");
    }
  };

  const run = async () => {
    if (!base || !insert) return toast.error("Upload both PDFs first");
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const target = await PDFDocument.load(await base.arrayBuffer(), { ignoreEncryption: true });
      const source = await PDFDocument.load(await insert.arrayBuffer(), { ignoreEncryption: true });
      const copied = await target.copyPages(source, source.getPageIndices());

      let index =
        where === "start" ? 0 :
        where === "end" ? target.getPageCount() :
        where === "before" ? at - 1 : at;
      index = Math.max(0, Math.min(index, target.getPageCount()));

      copied.forEach((p, i) => target.insertPage(index + i, p));
      const bytes = await target.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(base.name)}_with-inserted-pages.pdf`);
      toast.success(`Inserted ${copied.length} page${copied.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error((e as Error).message || "Insert failed");
    } finally {
      setBusy(false);
    }
  };

  const dropzone = (label: string, f: File | null, pages: number, onPick: (file: File | null) => void) => (
    <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 transition-colors">
      <FilePlus2 className="h-8 w-8 mx-auto text-primary" />
      <p className="mt-2 text-sm font-medium">{f ? f.name : label}</p>
      {pages > 0 && <p className="text-xs text-muted-foreground">{pages} pages</p>}
      <Button variant="outline" size="sm" className="mt-2" asChild>
        <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
      </Button>
      <input type="file" accept="application/pdf" hidden onChange={(e) => onPick(e.target.files?.[0] || null)} />
    </label>
  );

  return (
    <ToolPageTemplate
      title="Insert Pages into PDF"
      description="Add one PDF into another at any position — at the start, at the end, or before/after a chosen page. Page quality stays untouched and nothing is uploaded."
      keywords="insert pages into pdf, add pdf into another pdf, combine pdf at specific page, insert page in pdf online free"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Main PDF</Label>
              {dropzone("Upload the document to insert into", base, basePages, (f) => pick(f, "base"))}
            </div>
            <div>
              <Label className="mb-2 block">PDF to insert</Label>
              {dropzone("Upload the pages to add", insert, insertPages, (f) => pick(f, "insert"))}
            </div>
          </div>

          {base && insert && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Insert position</Label>
                <Select value={where} onValueChange={(v) => setWhere(v as typeof where)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">At the very beginning</SelectItem>
                    <SelectItem value="before">Before page…</SelectItem>
                    <SelectItem value="after">After page…</SelectItem>
                    <SelectItem value="end">At the very end</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(where === "before" || where === "after") && (
                <div>
                  <Label htmlFor="at">Page number (1–{basePages})</Label>
                  <Input id="at" type="number" min={1} max={basePages} value={at}
                    onChange={(e) => setAt(Math.min(basePages, Math.max(1, Number(e.target.value))))} className="mt-2" />
                </div>
              )}
            </div>
          )}

          <Button onClick={run} disabled={!base || !insert || busy} className="w-full" size="lg">
            <FilePlus2 className="h-4 w-4 mr-2" />{busy ? "Inserting..." : "Insert & Download"}
          </Button>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default InsertPdfPages;
