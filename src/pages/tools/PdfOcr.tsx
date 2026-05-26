import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Download, ScanText, Copy, Zap } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { createWorker } from "tesseract.js";
import { loadPdfDocument, renderPdfPageToCanvas } from "@/utils/pdfClient";

const LANGS = [
  { code: "eng", name: "English" }, { code: "spa", name: "Spanish" }, { code: "fra", name: "French" },
  { code: "deu", name: "German" }, { code: "ara", name: "Arabic" }, { code: "urd", name: "Urdu" },
  { code: "hin", name: "Hindi" }, { code: "chi_sim", name: "Chinese Simplified" }, { code: "jpn", name: "Japanese" },
  { code: "rus", name: "Russian" }, { code: "por", name: "Portuguese" }, { code: "ita", name: "Italian" },
];

const PdfOcr = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const workerRef = useRef<any>(null);

  const getWorker = async () => {
    if (workerRef.current) return workerRef.current;
    const worker = await createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress((prev) => Math.max(prev, Math.round(m.progress * 100)));
        }
      },
    });
    workerRef.current = worker;
    return worker;
  };

  const run = async () => {
    if (!file) return;
    setBusy(true); setText(""); setProgress(0);
    try {
      const pdf = await loadPdfDocument(file);
      const worker = await getWorker();
      let result = "";
      for (let p = 1; p <= pdf.numPages; p++) {
        setStatus(`Page ${p}/${pdf.numPages}: rendering...`);
        const page = await pdf.getPage(p);
        const { canvas } = await renderPdfPageToCanvas(page, 2);

        setStatus(`Page ${p}/${pdf.numPages}: OCR...`);
        const { data } = await worker.recognize(canvas, undefined, undefined, `page-${p}`);
        setProgress(Math.round((p / pdf.numPages) * 100));
        result += `\n\n===== PAGE ${p} =====\n\n${data.text.trim()}`;
      }
      setText(result.trim());
      setProgress(100);
      setStatus("Done");
      toast.success("OCR complete");
    } catch (e: any) {
      toast.error(e.message || "OCR failed");
    } finally { setBusy(false); }
  };

  const onLanguageChange = async (value: string) => {
    setLang(value);
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${file?.name.replace(/\.pdf$/i, "")}_ocr.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageTemplate title="PDF OCR — Scanned PDF to Text" description="Extract text from scanned PDFs and image-based PDFs using AI-powered OCR. Supports 12+ languages." keywords="PDF OCR, scanned PDF to text, OCR online">
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Upload Scanned PDF</Label>
              <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/40 mt-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <div className="text-sm mt-2">{file ? file.name : "Click to upload PDF"}</div>
                <input type="file" accept="application/pdf" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div>
              <Label>OCR Language</Label>
              <Select value={lang} onValueChange={onLanguageChange}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGS.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={run} disabled={!file || busy} className="w-full mt-3" size="lg">
                <ScanText className="w-4 h-4 mr-2" />{busy ? "Processing..." : "Run OCR"}
              </Button>
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="mb-1 flex items-center gap-2 font-medium text-foreground"><Zap className="h-3.5 w-3.5" /> Faster flow</div>
                Native PDF pages render first, then OCR runs with a reused worker for better speed on multi-page files.
              </div>
            </div>
          </div>
          {busy && (
            <div className="space-y-2">
              <Progress value={progress} />
              <div className="text-xs text-muted-foreground text-center">{status} — {progress}%</div>
            </div>
          )}
        </Card>

        {text && (
          <Card className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Extracted Text</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}><Copy className="w-4 h-4 mr-1" />Copy</Button>
                <Button size="sm" onClick={download}><Download className="w-4 h-4 mr-1" />Download .txt</Button>
              </div>
            </div>
            <Textarea value={text} onChange={e => setText(e.target.value)} rows={20} className="font-mono text-sm" />
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default PdfOcr;
