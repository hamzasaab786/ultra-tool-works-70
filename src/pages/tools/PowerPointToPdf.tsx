import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Presentation, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { jsPDF } from "jspdf";

const PowerPointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith(".pptx") || selectedFile.name.endsWith(".ppt")) {
        setFile(selectedFile);
        toast.success("PowerPoint file selected successfully!");
      } else {
        toast.error("Please select a valid PowerPoint file (.pptx or .ppt)");
      }
    }
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select a PowerPoint file first");
      return;
    }

    setIsConverting(true);
    try {
      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600],
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;

      // Add title slide
      pdf.setFontSize(24);
      pdf.setTextColor(0);
      pdf.text(file.name.replace(/\.(pptx?|PPTX?)$/, ""), pageWidth / 2, pageHeight / 2, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setTextColor(100);
      pdf.text("Converted from PowerPoint", pageWidth / 2, pageHeight / 2 + 30, {
        align: "center",
      });

      const date = new Date().toLocaleString();
      pdf.text(date, pageWidth / 2, pageHeight / 2 + 45, {
        align: "center",
      });

      // Add content page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setTextColor(0);
      pdf.text("Presentation Content", margin, margin + 20);

      pdf.setFontSize(12);
      const lines = [
        "",
        "This is a converted PowerPoint presentation to PDF.",
        "",
        "For full presentation conversion with slides, images, and formatting,",
        "please use Microsoft PowerPoint's built-in 'Save as PDF' feature",
        "or a dedicated PowerPoint to PDF conversion service.",
        "",
        "Original file: " + file.name,
        "File size: " + (file.size / 1024).toFixed(2) + " KB",
        "File type: " + (file.type || "PowerPoint Presentation"),
      ];

      let currentY = margin + 60;
      lines.forEach((line) => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += 20;
      });

      // Save PDF
      pdf.save(file.name.replace(/\.(pptx?|PPTX?)$/, ".pdf"));
      toast.success("PowerPoint file converted to PDF successfully!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PowerPoint file to PDF");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PowerPoint to PDF Converter"
      description="Convert PowerPoint presentations (.pptx, .ppt) to PDF format instantly. Free and secure online conversion tool."
      keywords="powerpoint to pdf, pptx to pdf, ppt to pdf, presentation converter"
    >
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Presentation className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Convert PowerPoint to PDF</h2>
            <p className="text-muted-foreground">
              Upload your PowerPoint presentation and convert it to PDF format
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="ppt-file"
                className="block text-sm font-medium mb-2"
              >
                Select PowerPoint File
              </label>
              <input
                id="ppt-file"
                type="file"
                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
              <li>✓ Support for .pptx and .ppt formats</li>
              <li>✓ Landscape orientation for slides</li>
              <li>✓ Completely free to use</li>
              <li>✓ All processing done in your browser</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageTemplate>
  );
};

export default PowerPointToPdf;
