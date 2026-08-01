import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Upload, Download, Type, Bold, Italic, Loader2, Undo2, Search,
  RotateCcw, Check, Eye, EyeOff,
} from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import {
  extractPdfTextRuns, sanitizeForStandardFont, hexToRgb01,
  type PdfTextRun, type PdfPageData,
} from "@/utils/pdfTextEdit";

const FAMILY_FONT = {
  Helvetica: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold,
    italic: StandardFonts.HelveticaOblique,
    boldItalic: StandardFonts.HelveticaBoldOblique,
    css: "Helvetica, Arial, sans-serif",
  },
  Times: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
    italic: StandardFonts.TimesRomanItalic,
    boldItalic: StandardFonts.TimesRomanBoldItalic,
    css: "'Times New Roman', Times, serif",
  },
  Courier: {
    regular: StandardFonts.Courier,
    bold: StandardFonts.CourierBold,
    italic: StandardFonts.CourierOblique,
    boldItalic: StandardFonts.CourierBoldOblique,
    css: "'Courier New', Courier, monospace",
  },
} as const;

const EditPdfText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [runs, setRuns] = useState<PdfTextRun[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fitWidth, setFitWidth] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!file) {
      setPages([]);
      setRuns([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setSelectedId(null);
    extractPdfTextRuns(file)
      .then(({ pages: p, runs: r }) => {
        if (cancelled) return;
        setPages(p);
        setRuns(r);
        if (r.length === 0) {
          toast.warning("No selectable text found — this PDF is likely a scan. Use the PDF OCR tool first.");
        } else {
          toast.success(`${r.length} text blocks ready to edit`);
        }
      })
      .catch((e: any) => {
        if (!cancelled) toast.error(e?.message || "Unable to read this PDF");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [file]);

  const selected = useMemo(() => runs.find((r) => r.id === selectedId) || null, [runs, selectedId]);
  const changed = useMemo(() => runs.filter((r) => r.text !== r.original), [runs]);

  const update = (id: string, patch: Partial<PdfTextRun>) =>
    setRuns((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const revert = (id: string) => {
    const r = runs.find((x) => x.id === id);
    if (r) update(id, { text: r.original });
  };

  const revertAll = () => setRuns((rs) => rs.map((r) => ({ ...r, text: r.original })));

  const applyReplace = () => {
    if (!findText) return;
    let count = 0;
    setRuns((rs) =>
      rs.map((r) => {
        if (!r.text.includes(findText)) return r;
        count += 1;
        return { ...r, text: r.text.split(findText).join(replaceText) };
      })
    );
    setTimeout(() => {
      if (count) toast.success(`Replaced text in ${count} block${count > 1 ? "s" : ""}`);
      else toast.info("No matches found");
    }, 0);
  };

  const selectRun = (id: string) => {
    setSelectedId(id);
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  const exportPdf = async () => {
    if (!file) return;
    if (changed.length === 0) {
      toast.info("Edit some text first");
      return;
    }
    setExporting(true);
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const docPages = pdfDoc.getPages();

      const fontCache = new Map<string, any>();
      const getFont = async (fam: PdfTextRun["family"], bold: boolean, italic: boolean) => {
        const key = `${fam}-${bold}-${italic}`;
        if (fontCache.has(key)) return fontCache.get(key);
        const f = FAMILY_FONT[fam];
        const name = bold && italic ? f.boldItalic : bold ? f.bold : italic ? f.italic : f.regular;
        const embedded = await pdfDoc.embedFont(name);
        fontCache.set(key, embedded);
        return embedded;
      };

      let sanitized = false;

      for (const run of changed) {
        const page = docPages[run.page];
        if (!page) continue;
        const font = await getFont(run.family, run.bold, run.italic);
        const rad = (run.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // 1. Cover the original glyphs with the sampled page background so the
        //    old text disappears without touching anything around it.
        const pad = run.size * 0.06;
        const boxW = run.width + pad * 2;
        const boxH = run.size * 1.16;
        const descent = run.size * 0.24;
        const [br, bg, bb] = hexToRgb01(run.bg);
        page.drawRectangle({
          x: run.x - pad * cos + descent * sin,
          y: run.y - pad * sin - descent * cos,
          width: boxW,
          height: boxH,
          color: rgb(br, bg, bb),
          rotate: degrees(run.angle),
        });

        const clean = sanitizeForStandardFont(run.text);
        if (clean !== run.text) sanitized = true;
        if (!clean.trim()) continue;

        // 2. Re-draw the new text on the exact original baseline, shrinking it
        //    only if needed so neighbouring content never gets pushed around.
        let size = run.size;
        if (fitWidth) {
          const w = font.widthOfTextAtSize(clean, size);
          if (w > run.width && w > 0) size = Math.max(run.size * 0.5, (size * run.width) / w);
        }
        const [tr, tg, tb] = hexToRgb01(run.color);
        page.drawText(clean, {
          x: run.x,
          y: run.y,
          size,
          font,
          color: rgb(tr, tg, tb),
          rotate: degrees(run.angle),
        });
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Edited PDF downloaded");
      if (sanitized) toast.warning("Some special characters were simplified to fit the standard PDF fonts.");
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Edit PDF Text"
      description="Edit the real text inside an existing PDF. Click any line, change the words, and download a re-rendered PDF with the original layout, fonts, size and colors preserved."
      keywords="edit pdf text, pdf text editor, change text in pdf, modify pdf, replace text in pdf"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card className="p-5 space-y-4 lg:col-span-1 h-fit lg:sticky lg:top-4">
          <div>
            <Label>Upload PDF</Label>
            <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40 mt-1">
              <Upload className="w-6 h-6 mx-auto" />
              <div className="text-xs mt-1 truncate">{file ? file.name : "Click to upload"}</div>
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="text-xs text-muted-foreground border-l-2 border-primary pl-3 py-1 bg-primary/5 rounded">
            Click any highlighted line on the page to edit its actual text. Only the lines you change are
            re-rendered — everything else stays byte-for-byte identical.
          </div>

          {runs.length > 0 && (
            <>
              <div className="space-y-2 border rounded-lg p-3">
                <span className="text-sm font-semibold flex items-center gap-1">
                  <Search className="w-4 h-4" />Find &amp; replace
                </span>
                <Input value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find" className="h-9" />
                <Input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace with" className="h-9" />
                <Button size="sm" variant="secondary" className="w-full" onClick={applyReplace} disabled={!findText}>
                  Replace in document
                </Button>
              </div>

              {selected ? (
                <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm flex items-center gap-1">
                      <Type className="w-4 h-4" />Edit text
                    </span>
                    <Button size="icon" variant="ghost" title="Revert this line" onClick={() => revert(selected.id)}>
                      <Undo2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <textarea
                    ref={editorRef}
                    value={selected.text}
                    onChange={(e) => update(selected.id, { text: e.target.value })}
                    rows={3}
                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Original: <span className="italic">"{selected.original}"</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Font</Label>
                      <Select value={selected.family} onValueChange={(v: any) => update(selected.id, { family: v })}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Helvetica">Helvetica (Sans)</SelectItem>
                          <SelectItem value="Times">Times (Serif)</SelectItem>
                          <SelectItem value="Courier">Courier (Mono)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Size (pt)</Label>
                      <Input
                        type="number" min={4} max={200} step={0.5}
                        value={Number(selected.size.toFixed(1))}
                        onChange={(e) => update(selected.id, { size: +e.target.value || selected.size })}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Text color</Label>
                      <Input type="color" value={selected.color} onChange={(e) => update(selected.id, { color: e.target.value })} className="h-9 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Background</Label>
                      <Input type="color" value={selected.bg} onChange={(e) => update(selected.id, { bg: e.target.value })} className="h-9 p-1" />
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button type="button" size="sm" variant={selected.bold ? "default" : "outline"} onClick={() => update(selected.id, { bold: !selected.bold })} className="flex-1">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button type="button" size="sm" variant={selected.italic ? "default" : "outline"} onClick={() => update(selected.id, { italic: !selected.italic })} className="flex-1">
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-4">
                  Select a line on the page to edit it.
                </div>
              )}

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={fitWidth} onChange={(e) => setFitWidth(e.target.checked)} />
                Auto-shrink longer text to keep the layout intact
              </label>

              <div className="flex items-center justify-between text-xs">
                <span><span className="font-semibold">{changed.length}</span> of {runs.length} lines edited</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setShowBoxes((s) => !s)} title="Toggle highlights">
                    {showBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={revertAll} disabled={!changed.length} title="Revert all">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          <Button onClick={exportPdf} disabled={!file || exporting || changed.length === 0} size="lg" className="w-full">
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download Edited PDF
          </Button>
        </Card>

        {/* Pages */}
        <Card className="p-4 lg:col-span-2 max-h-[80vh] overflow-y-auto bg-muted/40 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Reading text layout…</p>
            </div>
          )}
          {!loading && pages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">Upload a PDF to begin editing</div>
          )}
          {pages.map((p, idx) => (
            <div key={idx} className="flex justify-center">
              <div
                className="relative shadow-xl select-none bg-white"
                style={{ width: "100%", maxWidth: p.width * 1.35, containerType: "inline-size", aspectRatio: `${p.width} / ${p.height}` }}
              >
                <img src={p.url} alt={`Page ${idx + 1}`} draggable={false} className="block w-full h-full" />
                {runs.filter((r) => r.page === idx).map((r) => {
                  const isChanged = r.text !== r.original;
                  const isSel = r.id === selectedId;
                  return (
                    <div
                      key={r.id}
                      onClick={() => selectRun(r.id)}
                      title={r.original}
                      className={`absolute cursor-text transition-colors ${
                        !showBoxes && !isSel && !isChanged
                          ? ""
                          : isSel
                          ? "ring-2 ring-primary bg-primary/10"
                          : isChanged
                          ? "ring-1 ring-emerald-500 bg-emerald-500/15"
                          : "hover:bg-primary/10 hover:ring-1 hover:ring-primary/50"
                      }`}
                      style={{
                        left: `${(r.x / p.width) * 100}cqw`,
                        top: `${((p.height - r.y - r.size * 0.8) / p.width) * 100}cqw`,
                        width: `${(Math.max(r.width, r.size * 0.5) / p.width) * 100}cqw`,
                        height: `${((r.size * 1.1) / p.width) * 100}cqw`,
                        transform: r.angle ? `rotate(${-r.angle}deg)` : undefined,
                        transformOrigin: "left bottom",
                      }}
                    >
                      {isChanged && (
                        <span
                          className="absolute inset-0 flex items-center overflow-hidden whitespace-pre"
                          style={{
                            background: r.bg,
                            color: r.color,
                            fontFamily: FAMILY_FONT[r.family].css,
                            fontWeight: r.bold ? 700 : 400,
                            fontStyle: r.italic ? "italic" : "normal",
                            fontSize: `${(r.size / p.width) * 100}cqw`,
                            lineHeight: 1,
                          }}
                        >
                          {r.text}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                  Page {idx + 1}
                </div>
              </div>
            </div>
          ))}
          {changed.length > 0 && (
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Green blocks show your live edits exactly as they will be rendered.
            </p>
          )}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default EditPdfText;
