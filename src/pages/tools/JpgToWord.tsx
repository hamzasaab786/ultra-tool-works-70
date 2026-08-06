import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileType, Download, Loader2, X } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

interface Pic {
  file: File;
  url: string;
}

const readImageSize = (url: string) =>
  new Promise<{ w: number; h: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 600, h: 800 });
    img.src = url;
  });

const JpgToWord = () => {
  const [pics, setPics] = useState<Pic[]>([]);
  const [mode, setMode] = useState<"text" | "both" | "image">("text");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    if (!next.length) return toast.error("Please choose image files");
    setPics((p) => [...p, ...next]);
  };

  const remove = (i: number) => {
    setPics((p) => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, idx) => idx !== i);
    });
  };

  const convert = async () => {
    if (!pics.length) return toast.error("Please add at least one image");
    setBusy(true);
    try {
      const { Document, Packer, Paragraph, TextRun, ImageRun, PageBreak, AlignmentType } = await import("docx");
      const CONTENT_DXA = 9360; // 6.5in usable width (Letter, 1in margins)
      const maxW = 600; // points-ish width inside 1" margins

      const children: any[] = [];
      let worker: any = null;
      if (mode !== "image") {
        setStatus("Loading OCR engine…");
        const Tesseract = (await import("tesseract.js")).default;
        worker = await Tesseract.createWorker("eng");
      }

      for (let i = 0; i < pics.length; i += 1) {
        setStatus(`Processing image ${i + 1} of ${pics.length}…`);
        const pic = pics[i];
        const { w, h } = await readImageSize(pic.url);
        const scale = Math.min(1, maxW / w);
        const data = new Uint8Array(await pic.file.arrayBuffer());
        const ext = (pic.file.type.split("/")[1] || "png").replace("jpeg", "jpg");

        if (mode !== "text") children.push(
          new Paragraph({
            children: [
              new ImageRun({
                type: (["png", "jpg", "gif", "bmp"].includes(ext) ? ext : "png") as any,
                data,
                transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
                altText: { title: pic.file.name, description: pic.file.name, name: pic.file.name },
              }),
            ],
          })
        );

        if (worker) {
          const { data: res } = await worker.recognize(pic.file);
          const lines: any[] = (res as any).lines || [];
          const dxaPerPx = CONTENT_DXA / (w || 1);

          if (lines.length) {
            if (mode === "both") {
              children.push(
                new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Extracted text:", bold: true })] })
              );
            }

            let prevBottom: number | null = null;
            lines.forEach((line) => {
              const words: any[] = line.words || [];
              const text = (line.text || "").replace(/\s+$/g, "");
              if (!text.trim() || !line.bbox) {
                prevBottom = line.bbox ? line.bbox.y1 : prevBottom;
                return;
              }

              const lineH = line.bbox.y1 - line.bbox.y0;
              // Font size in half-points, derived from the real glyph height in the picture.
              const halfPts = Math.min(96, Math.max(12, Math.round((lineH * dxaPerPx) / 10 * 0.82)));

              // Keep the original left indent and the vertical gap between lines.
              const indentLeft = Math.max(0, Math.round(line.bbox.x0 * dxaPerPx));
              const gapPx = prevBottom === null ? 0 : Math.max(0, line.bbox.y0 - prevBottom);
              const spacingBefore = Math.min(1200, Math.round(gapPx * dxaPerPx * 0.5));
              prevBottom = line.bbox.y1;

              // Centred / right-aligned lines keep their look instead of collapsing left.
              const leftGap = line.bbox.x0;
              const rightGap = Math.max(0, w - line.bbox.x1);
              const centred = leftGap > w * 0.12 && Math.abs(leftGap - rightGap) < w * 0.06;

              const bold = words.length > 0 && words.every((wd: any) => wd?.font_bold);
              const italics = words.length > 0 && words.every((wd: any) => wd?.font_italic);

              children.push(
                new Paragraph({
                  alignment: centred ? AlignmentType.CENTER : AlignmentType.LEFT,
                  indent: centred ? undefined : { left: indentLeft },
                  spacing: { before: spacingBefore, after: 0, line: Math.round(lineH * dxaPerPx * 1.0) || undefined },
                  children: [new TextRun({ text, size: halfPts, bold, italics })],
                })
              );
            });
          } else if (mode === "text") {
            children.push(new Paragraph({ children: [new TextRun({ text: "(No readable text found in this image)", italics: true })] }));
          }
        }

        if (i < pics.length - 1) children.push(new Paragraph({ children: [new PageBreak()] }));
      }


      if (worker) await worker.terminate();
      setStatus("Building document…");

      const doc = new Document({
        styles: { default: { document: { run: { font: "Arial", size: 24 } } } },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images-to-word.docx";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast.success("Word document downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to build the Word file");
    } finally {
      setStatus("");
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="JPG to Word"
      description="Convert JPG and PNG images into an editable Word (.docx) document, with optional OCR text extraction."
      keywords="jpg to word, image to docx, convert photo to word"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileType className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Add one or many images — each becomes a page in your Word file.</p>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          aria-label="Select images"
          onChange={(e) => addFiles(e.target.files)}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm space-y-1">
          <p className="font-semibold">Can't type in Word after opening?</p>
          <p className="text-muted-foreground">
            Word opens downloaded files in <strong>Protected View</strong> (read-only). Click the yellow
            <strong> “Enable Editing”</strong> bar at the top — then every line is fully editable.
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <p className="font-medium">Output type</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { id: "text" as const, title: "Fully editable text (recommended)", desc: "OCR text only — every word editable in Word" },
              { id: "both" as const, title: "Image + editable text", desc: "Picture plus the extracted editable text" },
              { id: "image" as const, title: "Image only (not editable)", desc: "Just places the picture — text can't be edited" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                className={`text-left rounded-lg border p-3 transition-colors ${
                  mode === opt.id ? "border-primary bg-primary/10" : "hover:border-primary/50"
                }`}
              >
                <span className="block text-sm font-semibold">{opt.title}</span>
                <span className="block text-xs text-muted-foreground mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {pics.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {pics.map((p, i) => (
              <div key={p.url} className="relative">
                <img src={p.url} alt={p.file.name} className="w-full h-28 object-cover rounded-lg border" />
                <button
                  type="button"
                  aria-label={`Remove ${p.file.name}`}
                  onClick={() => remove(i)}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={convert} disabled={busy || !pics.length} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {busy ? status || "Converting…" : "Convert to Word (.docx)"}
        </Button>
      </Card>
    </ToolPageTemplate>
  );
};

export default JpgToWord;
