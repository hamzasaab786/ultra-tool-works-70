import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Download, Plus, Trash2, Type } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextBox { id: string; page: number; x: number; y: number; text: string; size: number; color: string; bg: boolean; }

const EditPdfText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; w: number; h: number }[]>([]);
  const [boxes, setBoxes] = useState<TextBox[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      setBoxes([]);
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const out: { url: string; w: number; h: number }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        out.push({ url: canvas.toDataURL(), w: viewport.width, h: viewport.height });
      }
      setPages(out);
    })();
  }, [file]);

  const onPageClick = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now().toString();
    setBoxes([...boxes, { id, page: idx, x, y, text: "New text", size: 16, color: "#000000", bg: false }]);
    setSelected(id);
  };

  const update = (id: string, k: keyof TextBox, v: any) => setBoxes(boxes.map(b => b.id === id ? { ...b, [k]: v } : b));
  const remove = (id: string) => { setBoxes(boxes.filter(b => b.id !== id)); if (selected === id) setSelected(null); };

  const exportPdf = async () => {
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const allPages = pdfDoc.getPages();

      for (const b of boxes) {
        const page = allPages[b.page];
        const { width: pw, height: ph } = page.getSize();
        const scaleX = pw / pages[b.page].w;
        const scaleY = ph / pages[b.page].h;
        const fontSize = b.size * scaleY;
        const x = b.x * scaleX;
        const y = ph - (b.y * scaleY) - fontSize;

        const r = parseInt(b.color.slice(1, 3), 16) / 255;
        const g = parseInt(b.color.slice(3, 5), 16) / 255;
        const bl = parseInt(b.color.slice(5, 7), 16) / 255;

        if (b.bg) {
          const w = font.widthOfTextAtSize(b.text, fontSize);
          page.drawRectangle({ x: x - 2, y: y - 2, width: w + 4, height: fontSize + 4, color: rgb(1, 1, 1) });
        }
        page.drawText(b.text, { x, y, size: fontSize, font, color: rgb(r, g, bl) });
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `edited_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Edited PDF downloaded");
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  const sel = boxes.find(b => b.id === selected);

  return (
    <ToolPageTemplate title="Edit PDF Text" description="Add text overlays to PDFs. Click anywhere on a page to place editable text. Use white background mode to cover existing text." keywords="edit PDF, add text to PDF, PDF text editor">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-4 lg:col-span-1">
          <Label>Upload PDF</Label>
          <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40">
            <Upload className="w-6 h-6 mx-auto" />
            <div className="text-xs mt-1">{file ? file.name : "Click to upload"}</div>
            <input type="file" accept="application/pdf" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="text-xs text-muted-foreground border-l-2 border-blue-500 pl-3 py-1 bg-blue-50 dark:bg-blue-950/20 rounded">
            💡 Click anywhere on the PDF to add a text box. Toggle white background to cover existing text.
          </div>

          {sel && (
            <div className="space-y-3 border rounded p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Selected text</span>
                <Button size="icon" variant="ghost" onClick={() => remove(sel.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <Input value={sel.text} onChange={e => update(sel.id, "text", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Size</Label><Input type="number" value={sel.size} onChange={e => update(sel.id, "size", +e.target.value)} /></div>
                <div><Label className="text-xs">Color</Label><Input type="color" value={sel.color} onChange={e => update(sel.id, "color", e.target.value)} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={sel.bg} onChange={e => update(sel.id, "bg", e.target.checked)} />
                White background (cover existing text)
              </label>
            </div>
          )}

          <div className="text-xs">
            <span className="font-semibold">Text boxes:</span> {boxes.length}
          </div>

          <Button onClick={exportPdf} disabled={!file || boxes.length === 0} size="lg" className="w-full"><Download className="w-4 h-4 mr-2" />Download Edited PDF</Button>
        </Card>

        <Card className="p-4 lg:col-span-2 max-h-[80vh] overflow-y-auto bg-gray-200 space-y-4">
          {pages.length === 0 && <div className="text-center text-muted-foreground py-12">Upload a PDF to begin editing</div>}
          {pages.map((p, idx) => (
            <div key={idx} className="flex justify-center">
              <div className="relative cursor-text shadow-lg" onClick={e => onPageClick(e, idx)}>
                <img src={p.url} alt={`p${idx + 1}`} className="block" style={{ width: p.w, height: p.h }} />
                {boxes.filter(b => b.page === idx).map(b => (
                  <div key={b.id} onClick={ev => { ev.stopPropagation(); setSelected(b.id); }}
                    className={`absolute cursor-pointer ${selected === b.id ? "ring-2 ring-blue-500" : "ring-1 ring-blue-300"}`}
                    style={{ left: b.x, top: b.y, fontSize: b.size, color: b.color, background: b.bg ? "#fff" : "transparent", padding: "0 2px", whiteSpace: "nowrap" }}>
                    {b.text}
                  </div>
                ))}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Page {idx + 1}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default EditPdfText;
