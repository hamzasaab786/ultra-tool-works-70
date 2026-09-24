import React, { useRef, useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eraser, PenTool } from "lucide-react";

const FONTS = [
  { label: "Elegant Script", value: "'Brush Script MT', cursive" },
  { label: "Classic Serif", value: "Georgia, serif" },
  { label: "Modern Sans", value: "Helvetica, Arial, sans-serif" },
  { label: "Typewriter", value: "'Courier New', monospace" },
];

const SignatureGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#111827");
  const [size, setSize] = useState(3);

  const [text, setText] = useState("Your Name");
  const [font, setFont] = useState(FONTS[0].value);
  const [fontSize, setFontSize] = useState(64);
  const typedRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = 900;
    c.height = 300;
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => { drawing.current = false; };

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  };

  const download = (canvas: HTMLCanvasElement | null, name: string) => {
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = name;
    a.click();
  };

  const renderTyped = () => {
    const c = typedRef.current;
    if (!c) return null;
    c.width = 900;
    c.height = 300;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text || " ", c.width / 2, c.height / 2);
    return c;
  };

  useEffect(() => { renderTyped(); }, [text, font, fontSize, color]);

  return (
    <>
      <ToolPageTemplate title="Signature Generator" description="Draw or type your signature and download it as a transparent PNG">
        <Tabs defaultValue="draw" className="space-y-6">
          <TabsList>
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
          </TabsList>

          <TabsContent value="draw">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PenTool className="h-5 w-5" /> Draw your signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-background overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    onPointerDown={start}
                    onPointerMove={move}
                    onPointerUp={end}
                    onPointerLeave={end}
                    className="w-full touch-none cursor-crosshair"
                    style={{ aspectRatio: "3 / 1" }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ink color</Label>
                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stroke width: {size}px</Label>
                    <Input type="range" min={1} max={12} value={size} onChange={(e) => setSize(Number(e.target.value))} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => download(canvasRef.current, "signature.png")}>
                    <Download className="mr-2 h-4 w-4" /> Download PNG
                  </Button>
                  <Button variant="outline" onClick={clear}><Eraser className="mr-2 h-4 w-4" /> Clear</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="type">
            <Card>
              <CardHeader><CardTitle>Type your signature</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Your Name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={font} onChange={(e) => setFont(e.target.value)}>
                      {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Size: {fontSize}px</Label>
                    <Input type="range" min={24} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" />
                  </div>
                </div>
                <div className="rounded-lg border bg-background overflow-hidden">
                  <canvas ref={typedRef} className="w-full" style={{ aspectRatio: "3 / 1" }} />
                </div>
                <Button onClick={() => download(renderTyped(), "signature.png")}>
                  <Download className="mr-2 h-4 w-4" /> Download PNG
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ToolPageTemplate>
    </>
  );
};

export default SignatureGenerator;
