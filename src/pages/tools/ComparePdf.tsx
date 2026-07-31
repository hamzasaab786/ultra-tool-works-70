import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GitCompare, Download, Upload, FileText } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

type DiffLine = { type: "added" | "removed" | "same"; text: string; page: number };

type CompareResult = {
  file1Pages: number;
  file2Pages: number;
  identical: boolean;
  addedCount: number;
  removedCount: number;
  similarity: number;
  lines: DiffLine[];
};

const ComparePdf = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const { toast } = useToast();


  const handleFile1Select = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile1(selectedFile);
        toast({
          title: "First PDF uploaded",
          description: `${selectedFile.name} ready for comparison`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFile2Select = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile2(selectedFile);
        toast({
          title: "Second PDF uploaded",
          description: `${selectedFile.name} ready for comparison`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  // Extract the text of every page as trimmed, non-empty lines.
  const extractLines = async (file: File) => {
    const { loadPdfDocument } = await import("@/utils/pdfClient");
    const pdf = await loadPdfDocument(file);
    const pages: string[][] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const rows = new Map<number, string[]>();
      for (const item of content.items as any[]) {
        if (!item.str || !item.str.trim()) continue;
        const y = Math.round(item.transform[5]);
        const key = [...rows.keys()].find((k) => Math.abs(k - y) < 3) ?? y;
        if (!rows.has(key)) rows.set(key, []);
        rows.get(key)!.push(item.str);
      }
      const lines = [...rows.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([, parts]) => parts.join(" ").replace(/\s+/g, " ").trim())
        .filter(Boolean);
      pages.push(lines);
    }
    return { pages, numPages: pdf.numPages };
  };

  // Classic LCS diff over lines.
  const diffLines = (a: string[], b: string[]) => {
    const n = a.length;
    const m = b.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const out: { type: "added" | "removed" | "same"; text: string }[] = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        out.push({ type: "same", text: a[i] });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        out.push({ type: "removed", text: a[i++] });
      } else {
        out.push({ type: "added", text: b[j++] });
      }
    }
    while (i < n) out.push({ type: "removed", text: a[i++] });
    while (j < m) out.push({ type: "added", text: b[j++] });
    return out;
  };

  const comparePdfs = async () => {
    if (!file1 || !file2) {
      toast({
        title: "Missing files",
        description: "Please select both PDF files to compare",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);
    setResult(null);
    try {
      const [doc1, doc2] = await Promise.all([extractLines(file1), extractLines(file2)]);

      const maxPages = Math.max(doc1.numPages, doc2.numPages);
      const lines: DiffLine[] = [];
      let added = 0;
      let removed = 0;
      let same = 0;

      for (let p = 0; p < maxPages; p++) {
        const diff = diffLines(doc1.pages[p] || [], doc2.pages[p] || []);
        for (const d of diff) {
          if (d.type === "added") added++;
          else if (d.type === "removed") removed++;
          else same++;
          lines.push({ ...d, page: p + 1 });
        }
      }

      const total = added + removed + same;
      const similarity = total === 0 ? 100 : Math.round((same / total) * 100);

      setResult({
        file1Pages: doc1.numPages,
        file2Pages: doc2.numPages,
        identical: added === 0 && removed === 0 && doc1.numPages === doc2.numPages,
        addedCount: added,
        removedCount: removed,
        similarity,
        lines,
      });

      toast({
        title: "Comparison complete",
        description:
          added === 0 && removed === 0
            ? "No text differences found."
            : `${removed} removed, ${added} added line(s). ${similarity}% similar.`,
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: "Comparison failed",
        description: (error as Error).message || "There was an error comparing your PDFs",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const header = [
      `PDF Comparison Report`,
      `Original: ${file1?.name} (${result.file1Pages} pages)`,
      `Modified: ${file2?.name} (${result.file2Pages} pages)`,
      `Similarity: ${result.similarity}%`,
      `Removed lines: ${result.removedCount} | Added lines: ${result.addedCount}`,
      ``,
    ].join("\n");
    const body = result.lines
      .filter((l) => l.type !== "same")
      .map((l) => `p${l.page} ${l.type === "added" ? "+" : "-"} ${l.text}`)
      .join("\n");
    const blob = new Blob([header + (body || "No differences found.")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-comparison-report.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };


  return (
    <ToolPageTemplate
      title="Compare PDF"
      description="Compare two PDF documents side-by-side to identify differences, changes, and variations in content."
      keywords="compare pdf, pdf diff, document comparison, pdf changes, version comparison"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile1Select}
              className="hidden"
              id="pdf1-upload"
            />
            <label htmlFor="pdf1-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-blue-50 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {file1 ? file1.name : "Original PDF"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Select first PDF
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile2Select}
              className="hidden"
              id="pdf2-upload"
            />
            <label htmlFor="pdf2-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-green-50 rounded-full">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {file2 ? file2.name : "Modified PDF"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Select second PDF
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </label>
          </div>
        </div>

        {(file1 || file2) && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {file1 && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Original:</span>
                  <span className="text-gray-600">{file1.name}</span>
                  <span className="text-gray-500">({(file1.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
              {file2 && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Modified:</span>
                  <span className="text-gray-600">{file2.name}</span>
                  <span className="text-gray-500">({(file2.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={comparePdfs}
          disabled={isComparing || !file1 || !file2}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isComparing ? (
            "Comparing PDFs..."
          ) : (
            <>
              <GitCompare className="h-4 w-4 mr-2" />
              Compare PDFs
            </>
          )}
        </Button>


        {result && (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold">Comparison Result</h3>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground">Similarity</p>
                <p className="text-lg font-semibold">{result.similarity}%</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground">Pages</p>
                <p className="text-lg font-semibold">{result.file1Pages} → {result.file2Pages}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground">Removed lines</p>
                <p className="text-lg font-semibold text-destructive">{result.removedCount}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground">Added lines</p>
                <p className="text-lg font-semibold text-emerald-600">{result.addedCount}</p>
              </div>
            </div>

            {result.identical ? (
              <p className="text-sm text-muted-foreground">
                Both documents contain identical text content.
              </p>
            ) : (
              <div className="max-h-96 overflow-auto rounded-md border font-mono text-xs">
                {result.lines
                  .filter((l) => l.type !== "same")
                  .map((l, i) => (
                    <div
                      key={i}
                      className={
                        l.type === "added"
                          ? "px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "px-3 py-1 bg-destructive/10 text-destructive"
                      }
                    >
                      <span className="opacity-60 mr-2">p{l.page}</span>
                      {l.type === "added" ? "+" : "−"} {l.text}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2">Comparison Features:</h3>
          <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-1">
            <li>• Line-by-line text diff (LCS algorithm)</li>
            <li>• Page count and similarity score</li>
            <li>• Added / removed lines highlighted per page</li>
            <li>• Downloadable difference report — 100% in your browser</li>
          </ul>
        </div>

      </div>
    </ToolPageTemplate>
  );
};

export default ComparePdf;
