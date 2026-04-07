import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Presentation, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

const PowerPointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const name = selectedFile.name.toLowerCase();
      if (name.endsWith(".pptx") || name.endsWith(".ppt")) {
        setFile(selectedFile);
        toast.success("PowerPoint file selected!");
      } else {
        toast.error("Please select a valid PowerPoint file (.pptx)");
      }
    }
  };

  const extractTextFromXml = (xml: string): string[] => {
    const texts: string[] = [];
    // Extract text from <a:t> tags (PowerPoint text runs)
    const matches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
    if (matches) {
      matches.forEach(match => {
        const text = match.replace(/<[^>]+>/g, "").trim();
        if (text) texts.push(text);
      });
    }
    return texts;
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select a PowerPoint file first");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      toast.error("Only .pptx files are supported. Please save your .ppt as .pptx first.");
      return;
    }

    setIsConverting(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      setProgress(30);

      // Find all slide XML files
      const slideFiles: string[] = [];
      zip.forEach((path) => {
        if (path.match(/^ppt\/slides\/slide\d+\.xml$/)) {
          slideFiles.push(path);
        }
      });

      // Sort slides numerically
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || "0");
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || "0");
        return numA - numB;
      });

      if (slideFiles.length === 0) {
        toast.error("No slides found in the PowerPoint file");
        return;
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [254, 190.5], // Standard 10x7.5 inches slide
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < slideFiles.length; i++) {
        if (i > 0) pdf.addPage();

        const slideXml = await zip.file(slideFiles[i])?.async("string");
        if (!slideXml) continue;

        const texts = extractTextFromXml(slideXml);
        
        // Draw slide background
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
        
        // Draw slide border
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(2, 2, pageWidth - 4, pageHeight - 4);

        // Slide number
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Slide ${i + 1}`, pageWidth - 15, pageHeight - 5);

        if (texts.length > 0) {
          let yPos = 25;
          const margin = 20;
          const maxWidth = pageWidth - margin * 2;

          // First text is usually the title
          pdf.setFontSize(22);
          pdf.setTextColor(30, 30, 30);
          const titleLines = pdf.splitTextToSize(texts[0], maxWidth);
          pdf.text(titleLines, margin, yPos);
          yPos += titleLines.length * 10 + 10;

          // Rest is body text
          pdf.setFontSize(14);
          pdf.setTextColor(60, 60, 60);
          for (let t = 1; t < texts.length; t++) {
            if (yPos > pageHeight - 20) break;
            const bodyLines = pdf.splitTextToSize(`• ${texts[t]}`, maxWidth);
            pdf.text(bodyLines, margin, yPos);
            yPos += bodyLines.length * 7 + 4;
          }
        } else {
          pdf.setFontSize(14);
          pdf.setTextColor(150, 150, 150);
          pdf.text("(Empty slide)", pageWidth / 2, pageHeight / 2, { align: "center" });
        }

        setProgress(30 + ((i + 1) / slideFiles.length) * 60);
      }

      pdf.save(file.name.replace(/\.(pptx?|PPTX?)$/, ".pdf"));
      setProgress(100);
      toast.success(`Converted ${slideFiles.length} slides to PDF!`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PowerPoint to PDF");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <ToolPageTemplate
      title="PowerPoint to PDF Converter"
      description="Convert PowerPoint presentations (.pptx) to PDF format instantly. Free and secure online conversion tool."
      keywords="powerpoint to pdf, pptx to pdf, ppt to pdf, presentation converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-orange-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50/50">
                <Presentation className="h-16 w-16 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">Convert PowerPoint to PDF</h2>
              <p className="text-muted-foreground">
                Upload your .pptx presentation and convert it to PDF
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".pptx,.ppt"
                  onChange={handleFileChange}
                  className="w-full p-6 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all duration-300"
                  disabled={isConverting}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Click or drag PowerPoint file here"}
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-orange-50/50 to-red-50/30 border-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Presentation className="h-5 w-5 text-orange-600" />
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
                    <span className="text-muted-foreground">Converting slides...</span>
                    <span className="font-medium text-orange-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToPdf}
                disabled={!file || isConverting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Extracts real text content from each slide</li>
            <li>✓ Preserves slide order and structure</li>
            <li>✓ Landscape format matching presentations</li>
            <li>✓ 100% browser-based - files never leave your device</li>
            <li>✓ Completely free, no sign-up required</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PowerPointToPdf;
