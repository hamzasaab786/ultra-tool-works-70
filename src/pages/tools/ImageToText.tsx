import React, { useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, ScanText, Copy, Download } from "lucide-react";
import { createWorker } from "tesseract.js";

const LANGS = [
  { code: "eng", name: "English" }, { code: "spa", name: "Spanish" }, { code: "fra", name: "French" },
  { code: "deu", name: "German" }, { code: "ara", name: "Arabic" }, { code: "urd", name: "Urdu" },
  { code: "hin", name: "Hindi" }, { code: "chi_sim", name: "Chinese Simplified" }, { code: "jpn", name: "Japanese" },
  { code: "rus", name: "Russian" }, { code: "por", name: "Portuguese" }, { code: "ita", name: "Italian" },
];

const ImageToText = () => {
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WebP…)");
      return;
    }
    setFile(f);
    setText("");
    setPreview(URL.createObjectURL(f));
  };

  const extract = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    let worker: any;
    try {
      worker = await createWorker(lang, 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      setText(data.text.trim());
      toast.success("Text extracted");
    } catch (e) {
      console.error(e);
      toast.error("Could not read text from this image");
    } finally {
      if (worker) await worker.terminate();
      setBusy(false);
      setProgress(100);
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolPageTemplate
      title="Image to Text Converter (OCR)"
      description="Extract editable, copyable text from photos, screenshots and scanned documents in 12+ languages. Everything runs in your browser — no upload required."
      keywords="image to text, photo to text converter, ocr online free, screenshot to text"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Upload an image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onSelect(e.dataTransfer.files?.[0]); }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50"
            >
              {preview ? (
                <img src={preview} alt="Image selected for text extraction" className="max-h-64 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click or drop a JPG, PNG or WebP image here</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onSelect(e.target.files?.[0])}
            />

            <div>
              <Label>Language of the text</Label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={extract} disabled={!file || busy} className="w-full">
              <ScanText className="mr-2 h-4 w-4" />
              {busy ? `Reading… ${progress}%` : "Extract text"}
            </Button>
            {busy && <Progress value={progress} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={16}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="The recognised text will appear here — you can edit it before copying."
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!text}
                onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}
              >
                <Copy className="mr-1 h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" disabled={!text} onClick={download}>
                <Download className="mr-1 h-4 w-4" /> Download .txt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ImageToText;
