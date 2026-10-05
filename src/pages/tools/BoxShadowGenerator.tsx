import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy, Plus, Trash2 } from "lucide-react";

interface Layer { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean }

const hexToRgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const toCss = (l: Layer) => `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`;

const PRESETS: Record<string, Layer[]> = {
  Soft: [{ x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false }, { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false }],
  Elevated: [{ x: 0, y: 20, blur: 25, spread: -5, color: "#000000", opacity: 0.15, inset: false }, { x: 0, y: 8, blur: 10, spread: -6, color: "#000000", opacity: 0.1, inset: false }],
  Neumorphic: [{ x: 8, y: 8, blur: 16, spread: 0, color: "#a3b1c6", opacity: 0.6, inset: false }, { x: -8, y: -8, blur: 16, spread: 0, color: "#ffffff", opacity: 0.9, inset: false }],
  Inset: [{ x: 0, y: 2, blur: 6, spread: 0, color: "#000000", opacity: 0.25, inset: true }],
  Glow: [{ x: 0, y: 0, blur: 24, spread: 4, color: "#3b82f6", opacity: 0.6, inset: false }],
};

const BoxShadowGenerator = () => {
  const [layers, setLayers] = useState<Layer[]>(PRESETS.Elevated);
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(16);
  const l = layers[active] ?? layers[0];
  const css = layers.map(toCss).join(",\n    ");
  const code = `box-shadow: ${css};`;

  const update = (patch: Partial<Layer>) => setLayers(layers.map((x, i) => (i === active ? { ...x, ...patch } : x)));
  const slider = (label: string, key: "x" | "y" | "blur" | "spread", min: number, max: number) => (
    <div>
      <Label className="flex justify-between"><span>{label}</span><span>{l[key]}px</span></Label>
      <Slider min={min} max={max} step={1} value={[l[key]]} onValueChange={([n]) => update({ [key]: n })} />
    </div>
  );

  return (
    <ToolPageTemplate title="CSS Box Shadow Generator" description="Design layered CSS box shadows visually — offsets, blur, spread, colour, opacity and inset — and copy production-ready code.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESETS).map((p) => <Button key={p} size="sm" variant="outline" onClick={() => { setLayers(PRESETS[p]); setActive(0); }}>{p}</Button>)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {layers.map((_, i) => <Button key={i} size="sm" variant={i === active ? "default" : "outline"} onClick={() => setActive(i)}>Layer {i + 1}</Button>)}
              <Button size="sm" variant="ghost" onClick={() => { setLayers([...layers, { ...l }]); setActive(layers.length); }}><Plus className="h-4 w-4" /></Button>
              {layers.length > 1 && <Button size="sm" variant="ghost" aria-label="Delete layer" onClick={() => { setLayers(layers.filter((_, i) => i !== active)); setActive(0); }}><Trash2 className="h-4 w-4" /></Button>}
            </div>
            {slider("Horizontal offset", "x", -100, 100)}
            {slider("Vertical offset", "y", -100, 100)}
            {slider("Blur", "blur", 0, 150)}
            {slider("Spread", "spread", -50, 50)}
            <div>
              <Label className="flex justify-between"><span>Opacity</span><span>{Math.round(l.opacity * 100)}%</span></Label>
              <Slider min={0} max={100} value={[Math.round(l.opacity * 100)]} onValueChange={([n]) => update({ opacity: n / 100 })} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">Colour <input type="color" value={l.color} onChange={(e) => update({ color: e.target.value })} /></label>
              <div className="flex items-center gap-2"><Switch id="inset" checked={l.inset} onCheckedChange={(c) => update({ inset: c })} /><Label htmlFor="inset">Inset</Label></div>
            </div>
            <div>
              <Label className="flex justify-between"><span>Box corner radius (preview)</span><span>{radius}px</span></Label>
              <Slider min={0} max={100} value={[radius]} onValueChange={([n]) => setRadius(n)} />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div className="flex h-80 items-center justify-center rounded-xl bg-muted">
            <div className="h-40 w-40 bg-card" style={{ boxShadow: layers.map(toCss).join(", "), borderRadius: radius }} />
          </div>
          <pre className="overflow-auto rounded-lg border bg-muted/50 p-4 text-sm"><code>{code}</code></pre>
          <div className="flex gap-2">
            <Button onClick={() => { navigator.clipboard.writeText(code); toast.success("CSS copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy CSS</Button>
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(`shadow-[${layers.map(toCss).join(",").replace(/\s+/g, "_")}]`); toast.success("Tailwind class copied"); }}>Copy Tailwind</Button>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default BoxShadowGenerator;
