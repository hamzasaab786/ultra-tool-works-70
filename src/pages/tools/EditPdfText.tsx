import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Download, Trash2, Bold, Italic, Type, Move, Copy } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { renderPdfPreviewPages } from "@/utils/pdfClient";

interface TextBox {
  id: string;
  page: number;
  x: number; // 0..1 relative to page width
  y: number; // 0..1 relative to page height (top of text)
  text: string;
  size: number; // px on preview
  color: string;
  bg: boolean;
  bold: boolean;
  italic: boolean;
  family: "Helvetica" | "Times" | "Courier";
}

const FAMILY_FONT = {
  Helvetica: { regular: StandardFonts.Helvetica, bold: StandardFonts.HelveticaBold, italic: StandardFonts.HelveticaOblique, boldItalic: StandardFonts.HelveticaBoldOblique, css: "Helvetica, Arial, sans-serif" },
  Times: { regular: StandardFonts.TimesRoman, bold: StandardFonts.TimesRomanBold, italic: StandardFonts.TimesRomanItalic, boldItalic: StandardFonts.TimesRomanBoldItalic, css: "'Times New Roman', Times, serif" },
  Courier: { regular: StandardFonts.Courier, bold: StandardFonts.CourierBold, italic: StandardFonts.CourierOblique, boldItalic: StandardFonts.CourierBoldOblique, css: "'Courier New', Courier, monospace" },
} as const;

const EditPdfText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; w: number; h: number }[]>([]);
  const [boxes, setBoxes] = useState<TextBox[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const dragRef = useRef<{ id: string; offX: number; offY: number; rect: DOMRect } | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      setBoxes([]);
      try {
        const out = await renderPdfPreviewPages(file, 1.35);
        setPages(out);
      } catch (e: any) {
        toast.error(e?.message || "Unable to render PDF");
      }
    })();
  }, [file]);

  const addBox = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    if (dragRef.current) return;
    const img = e.currentTarget.querySelector("img") as HTMLImageElement | null;
    const rect = (img || e.currentTarget).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const id = Date.now().toString();
    setBoxes(b => [...b, { id, page: idx, x, y, text: "New text", size: 16, color: "#000000", bg: false, bold: false, italic: false, family: "Helvetica" }]);
    setSelected(id);
  };

  const update = (id: string, patch: Partial<TextBox>) => setBoxes(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b));
  const remove = (id: string) => { setBoxes(bs => bs.filter(b => b.id !== id)); if (selected === id) setSelected(null); };
  const duplicate = (id: string) => {
    const b = boxes.find(x => x.id === id); if (!b) return;
    const nid = Date.now().toString();
    setBoxes(bs => [...bs, { ...b, id: nid, x: Math.min(b.x + 0.02, 0.95), y: Math.min(b.y + 0.02, 0.95) }]);
    setSelected(nid);
  };

  const onDragStart = (e: React.MouseEvent, b: TextBox) => {
    e.stopPropagation();
    setSelected(b.id);
    const pageEl = (e.currentTarget as HTMLElement).closest("[data-page]") as HTMLElement | null;
    const img = pageEl?.querySelector("img") as HTMLImageElement | null;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    dragRef.current = { id: b.id, offX: e.clientX - (rect.left + b.x * rect.width), offY: e.clientY - (rect.top + b.y * rect.height), rect };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current; if (!d) return;
      const x = (e.clientX - d.offX - d.rect.left) / d.rect.width;
      const y = (e.clientY - d.offY - d.rect.top) / d.rect.height;
      update(d.id, { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };
    const onUp = () => { setTimeout(() => { dragRef.current = null; }, 0); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const onKeyNudge = (e: React.KeyboardEvent) => {
    if (!selected) return;
    const b = boxes.find(x => x.id === selected); if (!b) return;
    const step = e.shiftKey ? 0.01 : 0.002;
    if (e.key === "ArrowLeft") { update(b.id, { x: Math.max(0, b.x - step) }); e.preventDefault(); }
    if (e.key === "ArrowRight") { update(b.id, { x: Math.min(1, b.x + step) }); e.preventDefault(); }
    if (e.key === "ArrowUp") { update(b.id, { y: Math.max(0, b.y - step) }); e.preventDefault(); }
    if (e.key === "ArrowDown") { update(b.id, { y: Math.min(1, b.y + step) }); e.preventDefault(); }
    if (e.key === "Delete") { remove(b.id); }
  };

  const exportPdf = async () => {
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const allPages = pdfDoc.getPages();

      // Cache fonts
      const fontCache = new Map<string, any>();
      const getFont = async (fam: TextBox["family"], bold: boolean, italic: boolean) => {
        const key = `${fam}-${bold}-${italic}`;
        if (fontCache.has(key)) return fontCache.get(key);
        const f = FAMILY_FONT[fam];
        const name = bold && italic ? f.boldItalic : bold ? f.bold : italic ? f.italic : f.regular;
        const emb = await pdfDoc.embedFont(name);
        fontCache.set(key, emb);
        return emb;
      };

      for (const b of boxes) {
        const page = allPages[b.page];
        const { width: pw, height: ph } = page.getSize();
        const font = await getFont(b.family, b.bold, b.italic);
        const fontSize = b.size * (ph / pages[b.page].h);
        const lines = b.text.split("\n");
        const lineHeight = fontSize * 1.2;

        const r = parseInt(b.color.slice(1, 3), 16) / 255;
        const g = parseInt(b.color.slice(3, 5), 16) / 255;
        const bl = parseInt(b.color.slice(5, 7), 16) / 255;

        lines.forEach((ln, i) => {
          const x = b.x * pw;
          const yTop = ph - (b.y * ph) - fontSize - i * lineHeight;
          if (b.bg && ln.length) {
            const w = font.widthOfTextAtSize(ln, fontSize);
            page.drawRectangle({ x: x - 2, y: yTop - 2, width: w + 4, height: fontSize + 4, color: rgb(1, 1, 1) });
          }
          if (ln.length) page.drawText(ln, { x, y: yTop, size: fontSize, font, color: rgb(r, g, bl) });
        });
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `edited_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Edited PDF downloaded");
    } catch (e: any) { toast.error(e.message || "Export failed"); }
  };

  const sel = boxes.find(b => b.id === selected);

  return (
    <ToolPageTemplate title="Edit PDF Text" description="Add and position professional text overlays on PDFs. Bold, italic, font sizing, drag-to-place, multi-line, and arrow-key nudging." keywords="edit PDF, add text to PDF, PDF text editor">
      <div className="grid lg:grid-cols-3 gap-6" tabIndex={0} onKeyDown={onKeyNudge}>
        <Card className="p-5 space-y-4 lg:col-span-1">
          <div>
            <Label>Upload PDF</Label>
            <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40 mt-1">
              <Upload className="w-6 h-6 mx-auto" />
              <div className="text-xs mt-1 truncate">{file ? file.name : "Click to upload"}</div>
              <input type="file" accept="application/pdf" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="text-xs text-muted-foreground border-l-2 border-primary pl-3 py-1 bg-primary/5 rounded">
            Click on the page to drop text. Drag boxes to position. Arrow keys nudge (Shift = larger steps).
          </div>

          {sel ? (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm flex items-center gap-1"><Type className="w-4 h-4" />Text properties</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => duplicate(sel.id)} title="Duplicate"><Copy className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(sel.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              <textarea
                value={sel.text}
                onChange={e => update(sel.id, { text: e.target.value })}
                rows={3}
                className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Font family</Label>
                  <Select value={sel.family} onValueChange={(v: any) => update(sel.id, { family: v })}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helvetica">Helvetica (Sans)</SelectItem>
                      <SelectItem value="Times">Times (Serif)</SelectItem>
                      <SelectItem value="Courier">Courier (Mono)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Size ({sel.size}px)</Label>
                  <Input type="number" min={6} max={120} value={sel.size} onChange={e => update(sel.id, { size: +e.target.value || 12 })} className="h-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Color</Label>
                  <Input type="color" value={sel.color} onChange={e => update(sel.id, { color: e.target.value })} className="h-9 p-1" />
                </div>
                <div className="flex gap-1 items-end">
                  <Button type="button" size="sm" variant={sel.bold ? "default" : "outline"} onClick={() => update(sel.id, { bold: !sel.bold })} className="flex-1"><Bold className="w-4 h-4" /></Button>
                  <Button type="button" size="sm" variant={sel.italic ? "default" : "outline"} onClick={() => update(sel.id, { italic: !sel.italic })} className="flex-1"><Italic className="w-4 h-4" /></Button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={sel.bg} onChange={e => update(sel.id, { bg: e.target.checked })} />
                White background (cover existing text)
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><Label className="text-[10px] uppercase">X %</Label><Input type="number" step={0.1} value={(sel.x * 100).toFixed(1)} onChange={e => update(sel.id, { x: Math.max(0, Math.min(1, +e.target.value / 100)) })} className="h-8" /></div>
                <div><Label className="text-[10px] uppercase">Y %</Label><Input type="number" step={0.1} value={(sel.y * 100).toFixed(1)} onChange={e => update(sel.id, { y: Math.max(0, Math.min(1, +e.target.value / 100)) })} className="h-8" /></div>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1"><Move className="h-3.5 w-3.5" />Drag the box on the page to move.</div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-4">Select or add a text box to edit its properties.</div>
          )}

          <div className="text-xs"><span className="font-semibold">Total text boxes:</span> {boxes.length}</div>

          <Button onClick={exportPdf} disabled={!file || boxes.length === 0} size="lg" className="w-full">
            <Download className="w-4 h-4 mr-2" />Download Edited PDF
          </Button>
        </Card>

        <Card className="p-4 lg:col-span-2 max-h-[80vh] overflow-y-auto bg-muted/40 space-y-4">
          {pages.length === 0 && <div className="text-center text-muted-foreground py-12">Upload a PDF to begin editing</div>}
          {pages.map((p, idx) => (
            <div key={idx} className="flex justify-center" data-page={idx}>
              <div className="relative cursor-crosshair shadow-xl select-none" onClick={e => addBox(e, idx)}>
                <img src={p.url} alt={`Page ${idx + 1}`} draggable={false} className="block h-auto max-w-full" style={{ width: p.w, maxWidth: "100%" }} />
                {boxes.filter(b => b.page === idx).map(b => {
                  const fam = FAMILY_FONT[b.family].css;
                  return (
                    <div
                      key={b.id}
                      onMouseDown={ev => onDragStart(ev, b)}
                      onClick={ev => { ev.stopPropagation(); setSelected(b.id); }}
                      className={`absolute cursor-move ${selected === b.id ? "ring-2 ring-primary" : "ring-1 ring-primary/40 hover:ring-primary/70"}`}
                      style={{
                        left: `${b.x * 100}%`,
                        top: `${b.y * 100}%`,
                        fontSize: b.size,
                        color: b.color,
                        background: b.bg ? "#fff" : "transparent",
                        fontFamily: fam,
                        fontWeight: b.bold ? 700 : 400,
                        fontStyle: b.italic ? "italic" : "normal",
                        lineHeight: 1.2,
                        padding: "0 2px",
                        whiteSpace: "pre",
                      }}
                    >
                      {b.text}
                    </div>
                  );
                })}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">Page {idx + 1}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default EditPdfText;
