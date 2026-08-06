import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Table2, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, mapConcurrent } from "@/utils/pdfClient";

const escapeCsv = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** Groups PDF text items into rows (by baseline) and columns (by x-gaps). */
const pageToRows = (items: { str: string; x: number; y: number; w: number }[]) => {
  const rows: typeof items[] = [];
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  sorted.forEach((item) => {
    const row = rows.find((r) => Math.abs(r[0].y - item.y) <= 3);
    if (row) row.push(item);
    else rows.push([item]);
  });

  return rows.map((row) => {
    const line = row.sort((a, b) => a.x - b.x);
    const cells: string[] = [];
    let current = "";
    line.forEach((item, i) => {
      const prev = line[i - 1];
      const gap = prev ? item.x - (prev.x + prev.w) : 0;
      if (prev && gap > Math.max(6, prev.w * 0.12)) {
        cells.push(current.trim());
        current = item.str;
      } else {
        current += (prev && gap > 1 ? " " : "") + item.str;
      }
    });
    cells.push(current.trim());
    return cells.filter((c, i, arr) => !(c === "" && arr.length === 1));
  });
};

const PdfToCsv = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csv, setCsv] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    if (!file) return toast.error("Please select a PDF file first");
    setBusy(true);
    try {
      const pdf = await loadPdfDocument(file);
      const perPage = await mapConcurrent(
        Array.from({ length: pdf.numPages }, (_, i) => i + 1),
        async (n) => {
          const page = await pdf.getPage(n);
          const content = await page.getTextContent();
          const items = (content.items as any[])
            .filter((i) => typeof i.str === "string" && i.str.trim())
            .map((i) => ({ str: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0 }));
          page.cleanup();
          return pageToRows(items);
        }
      );

      const rows = perPage.flat().filter((r) => r.some((c) => c.length));
      if (!rows.length) {
        toast.warning("No selectable text found — this PDF looks scanned. Try the PDF OCR tool first.");
        setCsv("");
        setRowCount(0);
        return;
      }
      setCsv(rows.map((r) => r.map(escapeCsv).join(",")).join("\n"));
      setRowCount(rows.length);
      toast.success(`Extracted ${rows.length} rows from ${pdf.numPages} page(s)`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read this PDF");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.pdf$/i, "") || "document") + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const preview = csv.split("\n").slice(0, 15).map((line) => line.split(","));

  return (
    <ToolPageTemplate
      title="PDF to CSV"
      description="Extract tables and rows from PDF files and download them as a clean CSV spreadsheet — fast and private."
      keywords="pdf to csv, extract table from pdf, pdf table converter"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <Table2 className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Column-aware extraction that keeps your table structure intact.</p>
        </div>

        <input
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Select PDF file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setCsv("");
            }
          }}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        {file && <p className="text-sm text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}

        <Button onClick={convert} disabled={!file || busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Table2 className="mr-2 h-4 w-4" />}
          {busy ? "Extracting…" : "Convert to CSV"}
        </Button>

        {csv && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{rowCount} rows ready — showing first 15.</p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      {r.map((c, j) => (
                        <td key={j} className="px-3 py-2 whitespace-nowrap">{c.replace(/^"|"$/g, "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={download} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download .csv
            </Button>
          </div>
        )}
      </Card>
    </ToolPageTemplate>
  );
};

export default PdfToCsv;
