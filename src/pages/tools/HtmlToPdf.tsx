import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Code, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const HtmlToPdf = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const convertToPdf = async () => {
    if (!htmlContent.trim()) {
      toast.error("Please enter HTML content");
      return;
    }

    setIsConverting(true);
    try {
      // Create a temporary container for the HTML
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "800px";
      container.style.padding = "20px";
      container.style.backgroundColor = "white";
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("html-to-pdf.pdf");

      toast.success("HTML converted to PDF successfully!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert HTML to PDF");
    } finally {
      setIsConverting(false);
    }
  };

  const loadSampleHtml = () => {
    const sample = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Sample HTML Document</h1>
  <p>This is a sample HTML content that will be converted to PDF.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</body>
</html>`;
    setHtmlContent(sample);
    toast.success("Sample HTML loaded");
  };

  return (
    <ToolPageTemplate
      title="HTML to PDF Converter"
      description="Convert HTML code to PDF documents online. Free HTML to PDF conversion tool with styling support."
      keywords="html to pdf, convert html, html converter, html pdf generator"
    >
      <div className="space-y-6">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Code className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Convert HTML to PDF</h2>
              <p className="text-muted-foreground">
                Paste your HTML code and convert it to a PDF document
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">
                  HTML Content
                </label>
                <Button
                  onClick={loadSampleHtml}
                  variant="outline"
                  size="sm"
                >
                  Load Sample
                </Button>
              </div>

              <Textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Paste your HTML code here..."
                className="min-h-[400px] font-mono text-sm"
              />

              <Button
                onClick={convertToPdf}
                disabled={!htmlContent.trim() || isConverting}
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
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Support for HTML and inline CSS</li>
            <li>✓ Preserve styling and formatting</li>
            <li>✓ No file size limits</li>
            <li>✓ Completely free to use</li>
            <li>✓ All processing done in your browser</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default HtmlToPdf;
