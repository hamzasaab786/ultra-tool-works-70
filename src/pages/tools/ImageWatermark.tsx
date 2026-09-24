import React, { useEffect, useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Droplets } from "lucide-react";

type Position = "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "tile";

const ImageWatermark = () => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("© Klipza");
  const [opacity, setOpacity] = useState(45);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-right");
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
    if (!text) return;

    const scale = c.width / 800;
    const fs = Math.max(10, fontSize * scale);
    ctx.font = `bold ${fs}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;
    ctx.textBaseline = "middle";

    const pad = fs * 0.6;
    const w = ctx.measureText(text).width;

    const put = (x: number, y: number, align: CanvasTextAlign) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.textAlign = align;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    if (position === "tile") {
      const stepX = w + fs * 3;
      const stepY = fs * 4;
      for (let y = stepY / 2; y < c.height + stepY; y += stepY) {
        for (let x = stepX / 2; x < c.width + stepX; x += stepX) put(x, y, "center");
      }
    } else if (position === "center") put(c.width / 2, c.height / 2, "center");
    else if (position === "bottom-right") put(c.width - pad, c.height - pad, "right");
    else if (position === "bottom-left") put(pad, c.height - pad, "left");
    else if (position === "top-right") put(c.width - pad, pad + fs / 2, "right");
    else put(pad, pad + fs / 2, "left");

    ctx.globalAlpha = 1;
  }, [img, text, opacity, fontSize, color, rotation, position]);

  const download = () => {
    const c = canvasRef.current;
    if (!c || !img) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "watermarked.png";
    a.click();
  };

  return (
    <>
      <ToolPageTemplate title="Image Watermark" description="Protect your photos with a custom text watermark in seconds">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5" /> Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Watermark text</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={position} onChange={(e) => setPosition(e.target.value as Position)}>
                    <option value="bottom-right">Bottom right</option>
                    <option value="bottom-left">Bottom left</option>
                    <option value="top-right">Top right</option>
                    <option value="top-left">Top left</option>
                    <option value="center">Center</option>
                    <option value="tile">Tiled (full cover)</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Opacity: {opacity}%</Label><Input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Font size: {fontSize}</Label><Input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Rotation: {rotation}°</Label><Input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Colour</Label><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" /></div>
              </div>
            </CardContent>
          </Card>

          {img && (
            <Card>
              <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <canvas ref={canvasRef} className="w-full rounded-lg border" />
                <Button onClick={download}><Download className="mr-2 h-4 w-4" /> Download watermarked image</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default ImageWatermark;
