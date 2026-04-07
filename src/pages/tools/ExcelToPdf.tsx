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

      // Read Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      setProgress(50);

      const content: any[] = [
        {
          text: file.name.replace(/\.(xlsx?|csv)$/i, ""),
          style: "header",
          margin: [0, 0, 0, 20],
        },
        {
          text: `Converted from Excel - ${new Date().toLocaleString()}`,
          style: "subheader",
          margin: [0, 0, 0, 20],
        }
      ];

      // Process each sheet
      workbook.SheetNames.forEach((sheetName, index) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length > 0) {
          // Add sheet title
          content.push({
            text: `Sheet: ${sheetName}`,
            style: "sheetTitle",
            margin: [0, index > 0 ? 20 : 0, 0, 10],
          });

          // Convert to table format
          const tableBody: any[][] = [];
          jsonData.forEach((row: any[]) => {
            const rowData = row.map(cell => ({
              text: cell !== null && cell !== undefined ? String(cell) : '',
              fontSize: 9,
            }));
            tableBody.push(rowData);
          });

          if (tableBody.length > 0) {
            content.push({
              table: {
                headerRows: 1,
                widths: Array(tableBody[0].length).fill('auto'),
                body: tableBody,
              },
              layout: {
                fillColor: (rowIndex: number) => (rowIndex === 0 ? '#4f46e5' : null),
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#e5e7eb',
                vLineColor: () => '#e5e7eb',
              },
              margin: [0, 0, 0, 10],
            });
          }
        }

        setProgress(50 + ((index + 1) / workbook.SheetNames.length) * 35);
      });

      // Create PDF document
      const docDefinition: any = {
        content,
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            color: '#4f46e5',
          },
          subheader: {
            fontSize: 10,
            italics: true,
            color: '#6b7280',
          },
          sheetTitle: {
            fontSize: 16,
            bold: true,
            color: '#1f2937',
          },
        },
        defaultStyle: {
          fontSize: 10,
        },
        pageOrientation: 'landscape',
        pageMargins: [20, 20, 20, 20],
      };

      setProgress(90);

      // Generate and download
      (pdfMake as any).createPdf(docDefinition).download(
        file.name.replace(/\.(xlsx?|csv)$/i, ".pdf")
      );

      setProgress(100);
      toast.success("Excel file converted to PDF successfully!");
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
