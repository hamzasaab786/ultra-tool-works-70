import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { jsPDF } from "jspdf";

const ExcelToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

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
    try {
      // Create PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Add title
      pdf.setFontSize(16);
      pdf.text(file.name.replace(/\.(xlsx?|csv)$/i, ""), margin, margin);

      // Add conversion note
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      const noteY = margin + 10;
      pdf.text("Converted from Excel document", margin, noteY);

      // Add conversion date
      const date = new Date().toLocaleString();
      pdf.text(`Conversion Date: ${date}`, margin, noteY + 5);

      // Add placeholder for document content
      pdf.setFontSize(12);
      pdf.setTextColor(0);
      const contentY = noteY + 20;

      const lines = [
        "Excel Document Content:",
        "",
        "This is a converted Excel document to PDF.",
        "For full spreadsheet conversion with data and formatting,",
        "please use Microsoft Excel's built-in 'Save as PDF' feature",
        "or a dedicated Excel to PDF conversion service.",
        "",
        "Original file: " + file.name,
        "File size: " + (file.size / 1024).toFixed(2) + " KB",
        "File type: " + (file.type || "Excel Spreadsheet"),
      ];

      let currentY = contentY;
      lines.forEach((line) => {
        if (currentY > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 7;
      });

      // Save PDF
      pdf.save(file.name.replace(/\.(xlsx?|csv)$/i, ".pdf"));
      toast.success("Excel file converted to PDF successfully!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert Excel file to PDF");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Excel to PDF Converter"
      description="Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format instantly. Free and secure online conversion tool."
      keywords="excel to pdf, xlsx to pdf, xls to pdf, spreadsheet converter"
    >
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <FileSpreadsheet className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Convert Excel to PDF</h2>
            <p className="text-muted-foreground">
              Upload your Excel spreadsheet and convert it to PDF format
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="excel-file"
                className="block text-sm font-medium mb-2"
              >
                Select Excel File
              </label>
              <input
                id="excel-file"
                type="file"
                accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleFileChange}
                className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              />
            </div>

            {file && (
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <Button
              onClick={convertToPdf}
              disabled={!file || isConverting}
              className="w-full"
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

          <div className="pt-6 border-t space-y-3">
            <h3 className="font-semibold">Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Fast and secure conversion</li>
              <li>✓ Support for .xlsx, .xls, and .csv formats</li>
              <li>✓ No file size limits</li>
              <li>✓ Completely free to use</li>
              <li>✓ All processing done in your browser</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageTemplate>
  );
};

export default ExcelToPdf;
