import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileImage, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import mammoth from "mammoth";
import html2canvas from "html2canvas";

const PAGE_W = 794; // A4 @96dpi
const PAGE_H = 1123;

const WordToJpg = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    if (!file) return toast.error("Please select a Word file first");
    setBusy(true);
    setPages([]);
    let container: HTMLDivElement | null = null;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: `${PAGE_W}px`,
        padding: "48px",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#111111",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "15px",
        lineHeight: "1.6",
      } as CSSStyleDeclaration);
      container.innerHTML = html || "<p></p>";
      document.body.appendChild(container);

      const full = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff", logging: false, useCORS: true });
      const sliceH = Math.round((PAGE_H / PAGE_W) * full.width);
      const count = Math.max(1, Math.ceil(full.height / sliceH));
      const urls: string[] = [];

      for (let i = 0; i < count; i += 1) {
        const c = document.createElement("canvas");
        c.width = full.width;
        c.height = Math.min(sliceH, full.height - i * sliceH);
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(full, 0, i * sliceH, c.width, c.height, 0, 0, c.width, c.height);
        urls.push(c.toDataURL("image/jpeg", 0.92));
        c.width = 0;
        c.height = 0;
      }

      setPages(urls);
      toast.success(`Converted to ${urls.length} JPG page(s)`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to convert this document. Only .docx is supported.");
    } finally {
      if (container) document.body.removeChild(container);
      setBusy(false);
    }
  };

  const base = () => file?.name.replace(/\.docx?$/i, "") || "document";

  const save = (url: string, i: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${base()}-page-${i + 1}.jpg`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    for (let i = 0; i < pages.length; i += 1) {
      save(pages[i], i);
      await new Promise((r) => setTimeout(r, 350));
    }
    toast.success("All pages downloaded");
  };

  return (
    <ToolPageTemplate
      title="Word to JPG"
      description="Convert Word (.docx) documents into high-quality JPG images, one image per page — free and private."
      keywords="word to jpg, docx to image, convert word to jpg"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileImage className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Turn any Word document into crisp A4-sized JPG pages.</p>
        </div>

        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-label="Select Word file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setPages([]);
            }
          }}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        {file && <p className="text-sm text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}

        <Button onClick={convert} disabled={!file || busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileImage className="mr-2 h-4 w-4" />}
          {busy ? "Converting…" : "Convert to JPG"}
        </Button>

        {pages.length > 0 && (
          <div className="space-y-4">
            <Button onClick={downloadAll} className="w-full bg-foreground text-background hover:bg-foreground/90">
              <Download className="mr-2 h-4 w-4" /> Download All Pages (JPG)
            </Button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((url, i) => (
                <button key={i} type="button" onClick={() => save(url, i)} className="group text-left">
                  <img src={url} alt={`Page ${i + 1} of the converted Word document`} loading="lazy" className="w-full rounded-lg border group-hover:border-primary transition-colors" />
                  <span className="block text-xs text-center mt-1 text-muted-foreground">Page {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </ToolPageTemplate>
  );
};

export default WordToJpg;
