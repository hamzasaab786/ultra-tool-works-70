import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Download, ScanText, Copy } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const run = async () => {
    if (!file) return;
    setBusy(true); setText(""); setProgress(0);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let result = "";
      for (let p = 1; p <= pdf.numPages; p++) {
        setStatus(`Page ${p}/${pdf.numPages}: rendering...`);
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

        setStatus(`Page ${p}/${pdf.numPages}: OCR...`);
        const { data } = await Tesseract.recognize(canvas, lang, {
          logger: (m: any) => {
            if (m.status === "recognizing text") {
              const overall = ((p - 1) + m.progress) / pdf.numPages;
              setProgress(Math.round(overall * 100));
            }
          }
        });
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
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGS.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={run} disabled={!file || busy} className="w-full mt-3" size="lg">
                <ScanText className="w-4 h-4 mr-2" />{busy ? "Processing..." : "Run OCR"}
              </Button>
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
