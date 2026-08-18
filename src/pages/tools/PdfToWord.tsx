import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Download, Loader2, Upload, CheckCircle, Copy } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from "docx";
import { loadPdfDocument } from "@/utils/pdfClient";
import {
  extractPageLines,
  groupLinesIntoBlocks,
  detectRegions,
  downloadBlob,
  type PdfLine,
} from "@/utils/officeConvert";

const CONTENT_WIDTH = 9638; // A4 (11906 twips) minus 2cm margins on both sides

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function buildTable(rows: string[][]): Table {
  const cols = Math.max(...rows.map((r) => r.length), 1);
  const weights = Array.from({ length: cols }, (_, c) =>
    Math.max(4, ...rows.map((r) => (r[c] || "").length))
  );
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.max(700, Math.round((w / total) * CONTENT_WIDTH)));
  const sum = widths.reduce((a, b) => a + b, 0);
  widths[widths.length - 1] += CONTENT_WIDTH - sum;

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      (row, ri) =>
        new TableRow({
          tableHeader: ri === 0,
          children: Array.from({ length: cols }, (_, c) => {
            const value = row[c] ?? "";
            const numeric = /^[($€£¥₹]?-?[\d,]+(\.\d+)?\)?%?$/.test(value.trim()) && value.trim() !== "";
            return new TableCell({
              borders: cellBorders,
              width: { size: widths[c], type: WidthType.DXA },
              margins: { top: 60, bottom: 60, left: 110, right: 110 },
              shading:
                ri === 0 ? { fill: "EFEFEF", type: ShadingType.CLEAR, color: "auto" } : undefined,
              children: [
                new Paragraph({
                  alignment: numeric ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  spacing: { before: 0, after: 0 },
                  children: [new TextRun({ text: value, bold: ri === 0, size: 20 })],
                }),
              ],
            });
          }),
        })
    ),
  });
}


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
      setProgress(25);

      const children: (Paragraph | Table)[] = [];
      let fullText = "";

      const emitParagraphs = (lines: PdfLine[], viewport: any) => {
        const blocks = groupLinesIntoBlocks(lines);
        for (const block of blocks) {
          // guess alignment from horizontal placement
          const widths = block.lines.map((l) => {
            const last = l.parts[l.parts.length - 1];
            return last.x + last.w;
          });
          const left = Math.min(...block.lines.map((l) => l.x));
          const right = Math.max(...widths);
          const centerOffset = Math.abs((left + (viewport.width - right)) / 2 - left);
          const alignment =
            left > 60 && centerOffset < 20
              ? AlignmentType.CENTER
              : viewport.width - right < 60 && left > viewport.width * 0.45
              ? AlignmentType.RIGHT
              : AlignmentType.LEFT;

          type Tok = {
            text: string;
            bold: boolean;
            italics: boolean;
            size: number;
            font: string;
          };
          const toks: Tok[] = [];
          block.lines.forEach((line, li) => {
            if (li > 0 && toks.length) {
              const last = toks[toks.length - 1];
              // heal hyphenated word breaks across wrapped lines
              if (/[a-z]-$/.test(last.text) && /^[a-z]/.test(line.text)) {
                last.text = last.text.slice(0, -1);
              } else if (!/\s$/.test(last.text)) {
                last.text += " ";
              }
            }
            let prevEnd: number | null = null;
            for (const part of line.parts) {
              const needSpace = prevEnd !== null && part.x - prevEnd > part.size * 0.2;
              if (needSpace && toks.length && !/\s$/.test(toks[toks.length - 1].text)) {
                toks[toks.length - 1].text += " ";
              }
              const last = toks[toks.length - 1];
              const font = part.mono ? "Consolas" : part.serif ? "Times New Roman" : "Calibri";
              if (
                last &&
                last.bold === part.bold &&
                last.italics === part.italic &&
                last.font === font &&
                Math.abs(last.size - part.size) <= 0.6
              ) {
                last.text += part.text;
              } else {
                toks.push({
                  text: part.text,
                  bold: part.bold,
                  italics: part.italic,
                  size: part.size,
                  font,
                });
              }
              prevEnd = part.x + part.w;
            }
          });

          const runs = toks
            .filter((t) => t.text.length)
            .map(
              (t) =>
                new TextRun({
                  text: t.text,
                  bold: t.bold,
                  italics: t.italics,
                  font: t.font,
                  size: Math.max(12, Math.round(t.size * 2)),
                })
            );

          if (!runs.length) continue;

          const bulletMatch = /^([•▪◦‣·–-])\s+/.exec(block.lines[0].text);
          const indent =
            alignment === AlignmentType.LEFT && left > 80
              ? Math.round(((left - 56) / 72) * 1440)
              : 0;

          children.push(
            new Paragraph({
              children: runs,
              alignment,
              bullet: bulletMatch ? { level: 0 } : undefined,
              indent:
                !bulletMatch && indent > 0
                  ? { left: Math.min(indent, convertInchesToTwip(2)) }
                  : undefined,
              spacing: {
                before: Math.min(400, Math.round(block.spaceBefore * 12)),
                after: 120,
                line: 276,
              },
            })
          );
          fullText += block.lines.map((l) => l.text).join(" ") + "\n";
        }
      };

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const lines = await extractPageLines(page);

        if (i > 1) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }

        for (const region of detectRegions(lines)) {
          if (region.type === "table") {
            children.push(buildTable(region.rows));
            children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
            fullText += region.rows.map((r) => r.join("\t")).join("\n") + "\n";
          } else {
            emitParagraphs(region.lines, viewport);
          }
        }

        fullText += "\n";
        page.cleanup();
        setProgress(25 + Math.round((i / pdf.numPages) * 60));
      }


      setExtractedText(fullText);

      const doc = new Document({
        styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
        sections: [
          {
            properties: {
              page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } },
            },
            children: children.length ? children : [new Paragraph({ children: [new TextRun("")] })],
          },
        ],
      });

      setProgress(95);
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + ".docx");

      setProgress(100);
      toast.success(`Converted ${pdf.numPages} page(s) with original layout preserved!`);
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
