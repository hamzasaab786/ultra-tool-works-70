import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Download, Loader2, Upload, CheckCircle, Copy } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { loadPdfDocument, mapConcurrent } from "@/utils/pdfClient";

const PdfToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");

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
    setProgress(10);

    try {
      const pdf = await loadPdfDocument(file);
      setProgress(30);
      
      let fullText = "";
      const paragraphs: Paragraph[] = [];
      
      // Extract text from all pages (in parallel)
      const pageTexts = await mapConcurrent(
        Array.from({ length: pdf.numPages }, (_, i) => i + 1),
        async (i) => {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item: any) => item.str).join(" ");
          page.cleanup();
          return text;
        }
      );

      pageTexts.forEach((pageText, idx) => {
        fullText += `${pageText}\n\n`;
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `Page ${idx + 1}`, bold: true, size: 28 })],
            spacing: { before: 400, after: 200 },
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: pageText, size: 24 })],
            spacing: { after: 400 },
          })
        );
      });
      setProgress(80);

      setExtractedText(fullText);
      setProgress(85);

      // Create Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Converted from PDF",
                    bold: true,
                    size: 32,
                    color: "4F46E5",
                  }),
                ],
                spacing: { after: 400 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Original file: ${file.name}`,
                    size: 20,
                    italics: true,
                  }),
                ],
                spacing: { after: 600 },
              }),
              ...paragraphs,
            ],
          },
        ],
      });

      setProgress(95);

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", ".docx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      toast.success(`PDF converted to Word successfully! Extracted ${pdf.numPages} pages.`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PDF to Word. Make sure the file is a valid PDF.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  const copyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast.success("Text copied to clipboard!");
    }
  };

  return (
    <ToolPageTemplate
      title="PDF to Word Converter"
      description="Convert PDF documents to editable Word format (.docx) instantly. Free and secure online conversion tool."
      keywords="pdf to word, pdf to doc, pdf to docx converter, pdf converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-indigo-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 animate-scale-in">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Convert PDF to Word</h2>
              <p className="text-muted-foreground">
                Upload your PDF and convert it to an editable Word document
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pdf-file"
                  className="block text-sm font-semibold mb-3"
                >
                  Select PDF File
                </label>
                <div className="relative">
                  <input
                    id="pdf-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="w-full p-6 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
                    disabled={isConverting}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-muted-foreground">
                        Click or drag PDF file here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-100 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <FileText className="h-5 w-5 text-blue-600" />
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
                    <span className="font-medium text-blue-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToWord}
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
          </div>
        </Card>

        {extractedText && (
          <Card className="p-6 glassmorphism border-green-100/50 animate-scale-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
                </div>
                <Button
                  onClick={copyText}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Text
                </Button>
              </div>
              <Textarea
                value={extractedText.substring(0, 500) + "..."}
                readOnly
                className="min-h-[200px] text-sm font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Preview of extracted text (first 500 characters). Full content downloaded as Word file.
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 glassmorphism border-purple-100/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">✨</span>
            Features
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Real Conversion:</strong> Extracts actual text and creates proper .docx files
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Page Preservation:</strong> Maintains page structure from original PDF
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
                <strong className="text-foreground">No File Limits:</strong> Convert PDFs of any size
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

export default PdfToWord;
