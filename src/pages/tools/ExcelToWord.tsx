import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileText, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  AlignmentType,
  PageOrientation,
} from "docx";
import { downloadBlob } from "@/utils/officeConvert";

const CONTENT_WIDTH = 14400; // landscape US Letter with 1" margins (DXA)

const ExcelToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (/\.(xlsx|xls|csv)$/i.test(selected.name)) {
      setFile(selected);
      setDone(false);
      toast.success("Spreadsheet selected!");
    } else {
      toast.error("Please select a valid Excel file (.xlsx, .xls or .csv)");
    }
  };

  const convert = async () => {
    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }
    setIsConverting(true);
    setProgress(15);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
        cellStyles: true,
        cellDates: true,
        cellNF: true,
      });
      setProgress(40);

      const border = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
      const borders = { top: border, bottom: border, left: border, right: border };
      const children: (Paragraph | Table)[] = [];

      workbook.SheetNames.forEach((sheetName, sheetIdx) => {
        const sheet = workbook.Sheets[sheetName];
        // raw:false keeps the exact displayed value (dates, currency, percentages)
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          raw: false,
          defval: "",
          blankrows: false,
        }) as any[][];
        if (!rows.length) return;

        const maxCols = Math.max(...rows.map((r) => r.length));
        const cols: any[] = (sheet["!cols"] as any[]) || [];
        const rawWidths = Array.from({ length: maxCols }, (_, i) => {
          const w = cols[i]?.wch ?? cols[i]?.width;
          return typeof w === "number" && w > 0 ? w : 12;
        });
        const totalW = rawWidths.reduce((a, b) => a + b, 0);
        const columnWidths = rawWidths.map((w) => Math.round((w / totalW) * CONTENT_WIDTH));
        // fix rounding drift so widths sum exactly to the table width
        columnWidths[columnWidths.length - 1] +=
          CONTENT_WIDTH - columnWidths.reduce((a, b) => a + b, 0);

        if (workbook.SheetNames.length > 1 || sheetIdx === 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: sheetName, bold: true, size: 28 })],
              spacing: { before: sheetIdx === 0 ? 0 : 400, after: 200 },
              pageBreakBefore: sheetIdx > 0,
            })
          );
        }

        const firstRow = rows[0] || [];
        const hasHeader =
          firstRow.filter(Boolean).length > 1 &&
          firstRow.every((c) => !c || Number.isNaN(Number(String(c).replace(/[,\s]/g, ""))));

        const tableRows = rows.map((row, rIdx) => {
          const isHeader = hasHeader && rIdx === 0;
          return new TableRow({
            tableHeader: isHeader,
            children: Array.from({ length: maxCols }, (_, cIdx) => {
              const value = row[cIdx] == null ? "" : String(row[cIdx]);
              const numeric = /^[-(]?[$€£₹]?\s?[\d,]+(\.\d+)?\)?%?$/.test(value.trim()) && value.trim() !== "";
              return new TableCell({
                borders,
                width: { size: columnWidths[cIdx], type: WidthType.DXA },
                shading: isHeader
                  ? { fill: "E2E8F0", type: ShadingType.CLEAR, color: "auto" }
                  : undefined,
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [
                  new Paragraph({
                    alignment: numeric ? AlignmentType.RIGHT : AlignmentType.LEFT,
                    children: [new TextRun({ text: value, bold: isHeader, size: 20 })],
                  }),
                ],
              });
            }),
          });
        });

        children.push(
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths,
            rows: tableRows,
          })
        );

        setProgress(40 + ((sheetIdx + 1) / workbook.SheetNames.length) * 45);
      });

      if (!children.length) {
        toast.error("This spreadsheet has no data to convert");
        return;
      }

      const doc = new Document({
        styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children,
          },
        ],
      });

      setProgress(95);
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, file.name.replace(/\.(xlsx?|csv)$/i, "") + ".docx");

      setProgress(100);
      setDone(true);
      toast.success("Converted — real Word tables with original formatting!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert this spreadsheet. Make sure the file is valid.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <ToolPageTemplate
      title="Excel to Word Converter"
      description="Convert Excel spreadsheets (.xlsx, .xls, .csv) into editable Word documents with real tables, original column widths and number formats preserved."
      keywords="excel to word, xlsx to docx, spreadsheet to word, convert excel to word"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-blue-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Convert Excel to Word</h2>
              <p className="text-muted-foreground">
                Every sheet becomes a fully editable Word table — formatting stays exactly the same
              </p>
            </div>

            <div className="relative">
              <input
                id="excel-word-file"
                type="file"
                accept=".xls,.xlsx,.csv"
                aria-label="Select Excel file"
                onChange={handleFileChange}
                className="w-full p-6 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
                disabled={isConverting}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : "Click or drag Excel file here"}
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <Card className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  {!isConverting && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              </Card>
            )}

            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Converting...</span>
                  <span className="font-medium text-blue-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button
              onClick={convert}
              disabled={!file || isConverting}
              className="w-full btn-modern bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                  Convert to Word
                </>
              )}
            </Button>
          </div>
        </Card>

        {done && (
          <Card className="p-6 glassmorphism border-green-100/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your spreadsheet was downloaded as an editable Word document.
            </p>
          </Card>
        )}

        <Card className="p-6 glassmorphism">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Real, editable Word tables (not images)</li>
            <li>✓ Original column widths, dates, currency and percentages preserved</li>
            <li>✓ Each sheet on its own page with a heading</li>
            <li>✓ 100% browser-based — files never leave your device</li>
            <li>✓ Completely free, no sign-up required</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExcelToWord;
