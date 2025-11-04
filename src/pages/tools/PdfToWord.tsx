import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as pdfjsLib from "pdfjs-dist";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF file selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const convertToWord = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
      }

      // Create a simple Word-compatible HTML document
      const wordContent = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Converted PDF</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; }
            p { margin: 0 0 10pt; }
          </style>
        </head>
        <body>
          <div style='width: 210mm; padding: 25mm;'>
            <h1>Converted from: ${file.name}</h1>
            <p style='color: #666;'>Conversion Date: ${new Date().toLocaleString()}</p>
            <hr/>
            <pre style='white-space: pre-wrap; font-family: Arial, sans-serif;'>${fullText}</pre>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([wordContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", ".doc");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF converted to Word successfully!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PDF to Word");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PDF to Word Converter"
      description="Convert PDF documents to editable Word format (.doc) instantly. Free and secure online conversion tool."
      keywords="pdf to word, pdf to doc, pdf to docx converter, pdf converter"
    >
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Convert PDF to Word</h2>
            <p className="text-muted-foreground">
              Upload your PDF and convert it to an editable Word document
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="pdf-file"
                className="block text-sm font-medium mb-2"
              >
                Select PDF File
              </label>
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,application/pdf"
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
              onClick={convertToWord}
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
                  Convert to Word
                </>
              )}
            </Button>
          </div>

          <div className="pt-6 border-t space-y-3">
            <h3 className="font-semibold">Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Fast and secure conversion</li>
              <li>✓ Extract text from PDF pages</li>
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

export default PdfToWord;
