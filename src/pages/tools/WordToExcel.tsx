import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

const WordToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    if (!file) return toast.error("Please select a Word file first");
    setBusy(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      const doc = new DOMParser().parseFromString(html, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));

      const result: { name: string; rows: string[][] }[] = tables.map((t, i) => ({
        name: `Table ${i + 1}`,
        rows: Array.from(t.querySelectorAll("tr")).map((tr) =>
          Array.from(tr.querySelectorAll("th,td")).map((td) => (td.textContent || "").replace(/\s+/g, " ").trim())
        ),
      }));

      if (!result.length) {
        const paragraphs = Array.from(doc.querySelectorAll("p,h1,h2,h3,h4,li"))
          .map((el) => (el.textContent || "").trim())
          .filter(Boolean);
        if (!paragraphs.length) {
          toast.warning("No content found in this document");
          setSheets([]);
          return;
        }
        result.push({ name: "Content", rows: [["Content"], ...paragraphs.map((p) => [p])] });
        toast.info("No tables found — exported the document content instead");
      } else {
        toast.success(`Found ${result.length} table(s)`);
      }
      setSheets(result);
    } catch (e) {
      console.error(e);
      toast.error("Failed to read this document. Only .docx is supported.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const wb = XLSX.utils.book_new();
    sheets.forEach((s, i) => {
      const ws = XLSX.utils.aoa_to_sheet(s.rows);
      const widths = (s.rows[0] || []).map((_, c) => ({
        wch: Math.min(60, Math.max(12, ...s.rows.map((r) => (r[c] || "").length + 2))),
      }));
      ws["!cols"] = widths;
      XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 28) || `Sheet${i + 1}`);
    });
    XLSX.writeFile(wb, (file?.name.replace(/\.docx?$/i, "") || "document") + ".xlsx");
    toast.success("Excel file downloaded");
  };

  return (
    <ToolPageTemplate
      title="Word to Excel"
      description="Convert Word (.docx) tables into an Excel (.xlsx) spreadsheet — every table becomes its own sheet."
      keywords="word to excel, docx to xlsx, word table to spreadsheet"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileSpreadsheet className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Extracts every table from your document into clean Excel sheets.</p>
        </div>

        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-label="Select Word file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setSheets([]);
            }
          }}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        {file && <p className="text-sm text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}

        <Button onClick={convert} disabled={!file || busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
          {busy ? "Analyzing…" : "Convert to Excel"}
        </Button>

        {sheets.length > 0 && (
          <div className="space-y-4">
            {sheets.map((s) => (
              <div key={s.name} className="space-y-2">
                <p className="font-medium">{s.name} — {s.rows.length} rows</p>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <tbody>
                      {s.rows.slice(0, 8).map((r, i) => (
                        <tr key={i} className="border-b last:border-0">
                          {r.map((c, j) => (
                            <td key={j} className="px-3 py-2 whitespace-nowrap">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <Button onClick={download} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download .xlsx
            </Button>
          </div>
        )}
      </Card>
    </ToolPageTemplate>
  );
};

export default WordToExcel;
