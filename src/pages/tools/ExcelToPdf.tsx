import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileSpreadsheet, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ExcelToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls") || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        toast.success("Excel file selected successfully!");
      } else {
        toast.error("Please select a valid Excel file (.xlsx, .xls, or .csv)");
      }
    }
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }

    setIsConverting(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // cellStyles + formatted values keep the original number/date/currency display
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellStyles: true,
        cellDates: true,
        cellNF: true,
      });
      setProgress(50);

      const title = file.name.replace(/\.(xlsx?|csv)$/i, "");
      let pdf: jsPDF | null = null;
      let pageIndex = 0;

      workbook.SheetNames.forEach((sheetName, index) => {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet || !worksheet["!ref"]) return;

        const range = XLSX.utils.decode_range(worksheet["!ref"] as string);
        const rowInfo: any[] = (worksheet["!rows"] as any[]) || [];
        const colInfo: any[] = (worksheet["!cols"] as any[]) || [];
        const merges: any[] = (worksheet["!merges"] as any[]) || [];

        // visible columns / rows only — hidden ones are not printed by Excel either
        const colIdx: number[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
          if (!colInfo[c]?.hidden) colIdx.push(c);
        }
        const rowIdx: number[] = [];
        for (let r = range.s.r; r <= range.e.r; r++) {
          if (rowInfo[r]?.hidden) continue;
          const hasData = colIdx.some((c) => {
            const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
            return cell && String(cell.w ?? cell.v ?? "").trim() !== "";
          });
          if (hasData) rowIdx.push(r);
        }
        if (!rowIdx.length || !colIdx.length) return;

        const maxCols = colIdx.length;
        const orientation = maxCols > 5 ? "landscape" : "portrait";

        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
        } else {
          pdf.addPage("a4", orientation);
        }
        pageIndex++;

        // Column widths taken from the sheet's own column widths when available
        const pageWidth = pdf.internal.pageSize.getWidth() - 20;
        const rawWidths = colIdx.map((c) => {
          const w = colInfo[c]?.wch ?? colInfo[c]?.width;
          return typeof w === "number" && w > 0 ? w : 12;
        });
        const totalW = rawWidths.reduce((a, b) => a + b, 0);
        const columnStyles: Record<number, any> = {};
        rawWidths.forEach((w, i) => {
          columnStyles[i] = { cellWidth: (w / totalW) * pageWidth };
        });

        pdf.setFontSize(13);
        pdf.setTextColor(30, 41, 59);
        pdf.text(`${title}${workbook.SheetNames.length > 1 ? " — " + sheetName : ""}`, 10, 12);
        pdf.setTextColor(0, 0, 0);

        // map merged ranges onto the visible grid
        const spanAt = new Map<string, { colSpan: number; rowSpan: number }>();
        const covered = new Set<string>();
        for (const m of merges) {
          const rs = rowIdx.filter((r) => r >= m.s.r && r <= m.e.r);
          const cs = colIdx.filter((c) => c >= m.s.c && c <= m.e.c);
          if (rs.length < 1 || cs.length < 1) continue;
          spanAt.set(`${rs[0]}:${cs[0]}`, { colSpan: cs.length, rowSpan: rs.length });
          for (const r of rs) for (const c of cs) {
            if (!(r === rs[0] && c === cs[0])) covered.add(`${r}:${c}`);
          }
        }

        const rows = rowIdx.map((r) =>
          colIdx
            .filter((c) => !covered.has(`${r}:${c}`))
            .map((c) => {
              const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
              // cell.w is the displayed (formatted) text exactly as shown in Excel
              const content = cell ? String(cell.w ?? cell.v ?? "") : "";
              const span = spanAt.get(`${r}:${c}`);
              const styles: any = {};
              const align = cell?.s?.alignment?.horizontal;
              if (align === "center" || align === "right" || align === "left") styles.halign = align;
              if (cell?.s?.font?.bold) styles.fontStyle = "bold";
              return {
                content,
                colSpan: span?.colSpan ?? 1,
                rowSpan: span?.rowSpan ?? 1,
                styles,
                raw: content,
              };
            })
        );

        // Keep the first row as a header only when it is purely textual labels
        const firstRow = rows[0]?.map((c) => c.content) || [];
        const looksLikeHeader =
          firstRow.filter(Boolean).length > 1 &&
          firstRow.every((c) => c === "" || Number.isNaN(Number(c.replace(/[,\s]/g, ""))));

        autoTable(pdf, {
          head: looksLikeHeader ? [rows[0]] : undefined,
          body: looksLikeHeader ? rows.slice(1) : rows,
          startY: 17,
          margin: { left: 10, right: 10 },
          tableWidth: pageWidth,
          columnStyles,
          styles: {
            fontSize: 8,
            cellPadding: 1.6,
            overflow: "linebreak",
            valign: "middle",
            lineColor: [203, 213, 225],
            lineWidth: 0.1,
          },
          headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          didParseCell: (data: any) => {
            const raw = String(data.cell.raw?.content ?? data.cell.raw ?? "");
            // right-align numeric / currency / percentage cells like Excel does
            if (
              !data.cell.raw?.styles?.halign &&
              raw &&
              /^[-(]?[$€£¥₹]?\s?[\d,]+(\.\d+)?\)?%?$/.test(raw.trim()) &&
              data.section === "body"
            ) {
              data.cell.styles.halign = "right";
            }
          },
        });

        setProgress(50 + ((index + 1) / workbook.SheetNames.length) * 40);
      });


      if (!pdf || pageIndex === 0) {
        toast.error("This spreadsheet has no data to convert");
        return;
      }

      pdf.save(file.name.replace(/\.(xlsx?|csv)$/i, "") + ".pdf");

      setProgress(100);
      toast.success("Converted — number, date and currency formats preserved!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert Excel file to PDF. Make sure the file is valid.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <ToolPageTemplate
      title="Excel to PDF Converter"
      description="Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format with preserved data and tables."
      keywords="excel to pdf, xlsx to pdf, xls to pdf, spreadsheet converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-green-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50 animate-scale-in">
                <FileSpreadsheet className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Convert Excel to PDF</h2>
              <p className="text-muted-foreground">
                Upload your Excel spreadsheet and convert it to PDF with preserved data
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="excel-file"
                  className="block text-sm font-semibold mb-3"
                >
                  Select Excel File
                </label>
                <div className="relative">
                  <input
                    id="excel-file"
                    type="file"
                    accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={handleFileChange}
                    className="w-full p-6 border-2 border-dashed border-green-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all duration-300"
                    disabled={isConverting}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-muted-foreground">
                        Click or drag Excel file here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/30 border-green-100 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    {!isConverting && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </Card>
              )}

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Converting...</span>
                    <span className="font-medium text-green-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToPdf}
                disabled={!file || isConverting}
                className="w-full btn-modern bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Convert to PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 glassmorphism border-emerald-100/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">✨</span>
            Features
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Real Data Extraction:</strong> Extracts all data from Excel sheets and tables
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Multi-Sheet Support:</strong> Converts all sheets in the workbook
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Table Formatting:</strong> Preserves table structure and data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">100% Browser-Based:</strong> Your files never leave your device
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Completely Free:</strong> No sign-up or payment required
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExcelToPdf;
