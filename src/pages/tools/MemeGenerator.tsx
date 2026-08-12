import React, { useEffect, useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";

const MemeGenerator = () => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [top, setTop] = useState("WHEN THE CODE WORKS");
  const [bottom, setBottom] = useState("AND YOU DON'T KNOW WHY");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [stroke, setStroke] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFile = (f?: File) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setImg(image); URL.revokeObjectURL(url); };
    image.src = url;
  };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !img) return;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const scale = c.width / 600;
    const fs = fontSize * scale;
    ctx.font = `bold ${fs}px Impact, 'Arial Black', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, fs / 12);
    ctx.lineJoin = "round";

    const draw = (text: string, y: number, baseline: CanvasTextBaseline) => {
      ctx.textBaseline = baseline;
      const words = text.toUpperCase().split(" ");
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        const t = line ? `${line} ${w}` : w;
        if (ctx.measureText(t).width > c.width * 0.94 && line) { lines.push(line); line = w; } else line = t;
      }
      if (line) lines.push(line);
      lines.forEach((l, i) => {
        const yy = baseline === "top" ? y + i * fs * 1.1 : y - (lines.length - 1 - i) * fs * 1.1;
        ctx.strokeText(l, c.width / 2, yy);
        ctx.fillText(l, c.width / 2, yy);
      });
    };

    if (top) draw(top, fs * 0.25, "top");
    if (bottom) draw(bottom, c.height - fs * 0.25, "bottom");
  }, [img, top, bottom, fontSize, color, stroke]);

  const download = () => {
    const c = canvasRef.current;
    if (!c || !img) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "meme.png";
    a.click();
  };

  return (
    <>
      <SEO
        title="Meme Generator - Make Memes Online Free with Your Own Image | Klipza"
        description="Upload any picture, add top and bottom text in classic meme style, and download your meme as a high-quality PNG. Free, fast and fully private."
        keywords="meme generator, make a meme, meme maker online, add text to image"
        canonicalUrl="https://klipza.live/tools/meme-generator"
      />
      <ToolPageTemplate title="Meme Generator" description="Upload an image, add classic meme captions and download instantly">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Image</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Top text</Label><Input value={top} onChange={(e) => setTop(e.target.value)} /></div>
                <div className="space-y-2"><Label>Bottom text</Label><Input value={bottom} onChange={(e) => setBottom(e.target.value)} /></div>
                <div className="space-y-2"><Label>Font size: {fontSize}</Label><Input type="range" min={20} max={90} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Text</Label><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" /></div>
                  <div className="space-y-2"><Label>Outline</Label><Input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-10 p-1" /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {img && (
            <Card>
              <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <canvas ref={canvasRef} className="w-full rounded-lg border" />
                <Button onClick={download}><Download className="mr-2 h-4 w-4" /> Download Meme</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default MemeGenerator;
