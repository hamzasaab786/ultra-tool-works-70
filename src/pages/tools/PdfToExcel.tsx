import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileSpreadsheet, Download, Upload, Loader2, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as XLSX from "xlsx";
import { loadPdfDocument } from "@/utils/pdfClient";

const PdfToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setDone(false);
        toast.success("PDF file selected!");
      } else {
        toast.error("Please select a PDF file");
      }
    }
  };

  const convertToExcel = async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(10);
    try {
      const pdf = await loadPdfDocument(file);
      setProgress(25);

      const workbook = XLSX.utils.book_new();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group text items by Y position to form rows
        const lines: { y: number; items: { x: number; text: string }[] }[] = [];
        
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          const x = Math.round(item.transform[4]);
          const text = item.str?.trim();
          if (!text) return;

          let line = lines.find(l => Math.abs(l.y - y) < 5);
          if (!line) {
            line = { y, items: [] };
            lines.push(line);
          }
          line.items.push({ x, text });
        });

        // Sort lines by Y (top to bottom) and items by X (left to right)
        lines.sort((a, b) => b.y - a.y);
        lines.forEach(line => line.items.sort((a, b) => a.x - b.x));

        // Convert to 2D array
        const rows = lines.map(line => line.items.map(item => item.text));

        // Normalize column count
        const maxCols = Math.max(...rows.map(r => r.length), 1);
        const normalizedRows = rows.map(row => {
          while (row.length < maxCols) row.push("");
          return row;
        });

        if (normalizedRows.length > 0) {
          const ws = XLSX.utils.aoa_to_sheet(normalizedRows);
          XLSX.utils.book_append_sheet(workbook, ws, `Page ${i}`);
        }

        setProgress(25 + (i / pdf.numPages) * 65);
      }

      setProgress(95);

      // Download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", ".xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setDone(true);
      toast.success(`Converted ${pdf.numPages} pages to Excel!`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PDF to Excel");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <ToolPageTemplate
      title="PDF to Excel Converter"
      description="Convert PDF documents to editable Excel spreadsheets (.xlsx) with preserved data structure and tables."
      keywords="pdf to excel, pdf to xlsx, pdf converter, spreadsheet converter, table extraction"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-green-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50">
                <FileSpreadsheet className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Convert PDF to Excel</h2>
              <p className="text-muted-foreground">
                Extract data from PDF and convert to editable Excel spreadsheet
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="w-full p-6 border-2 border-dashed border-green-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all duration-300"
                  disabled={isConverting}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Click or drag PDF file here"}
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/30 border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
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
                    <span className="text-muted-foreground">Extracting data...</span>
                    <span className="font-medium text-green-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToExcel}
                disabled={!file || isConverting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
                    Convert to Excel
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {done && (
          <Card className="p-6 border-green-100/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your PDF data has been extracted and downloaded as Excel.
            </p>
          </Card>
        )}

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Extracts text data and preserves layout</li>
            <li>✓ Each PDF page becomes a separate sheet</li>
            <li>✓ Maintains data structure and positioning</li>
            <li>✓ 100% browser-based - files never leave your device</li>
            <li>✓ Completely free, no sign-up required</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfToExcel;
