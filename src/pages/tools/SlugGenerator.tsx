import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const STOP = new Set(["a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "for", "with", "at", "by", "is", "are", "from"]);

export const slugify = (text: string, sep: string, lower: boolean, stop: boolean, max: number) => {
  let s = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss").replace(/æ/gi, "ae").replace(/ø/gi, "o").replace(/&/g, " and ");
  if (lower) s = s.toLowerCase();
  let words = s.replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (stop) words = words.filter((w, i) => i === 0 || !STOP.has(w.toLowerCase()));
  let out = words.join(sep);
  if (max > 0 && out.length > max) {
    out = out.slice(0, max);
    const cut = out.lastIndexOf(sep);
    if (cut > 0) out = out.slice(0, cut);
  }
  return out;
};

const SlugGenerator = () => {
  const [text, setText] = useState("10 Best Free PDF Tools for Students & Teachers in 2026!\nCafé Crème: Ünïcödé Títle Test");
  const [sep, setSep] = useState("-");
  const [lower, setLower] = useState(true);
  const [stop, setStop] = useState(false);
  const [max, setMax] = useState("60");

  const slugs = useMemo(
    () => text.split("\n").filter((l) => l.trim()).map((l) => slugify(l, sep, lower, stop, parseInt(max) || 0)),
    [text, sep, lower, stop, max],
  );

  return (
    <ToolPageTemplate title="URL Slug Generator" description="Turn any title into a clean, SEO-friendly URL slug — accents removed, stop words optional, bulk mode for many titles at once.">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="titles">Titles (one per line)</Label>
            <Textarea id="titles" className="min-h-[140px]" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Label>Separator</Label>
              {["-", "_", "."].map((s) => (
                <Button key={s} size="sm" variant={sep === s ? "default" : "outline"} onClick={() => setSep(s)}>{s}</Button>
              ))}
            </div>
            <div className="flex items-center gap-2"><Switch id="lower" checked={lower} onCheckedChange={setLower} /><Label htmlFor="lower">Lowercase</Label></div>
            <div className="flex items-center gap-2"><Switch id="stop" checked={stop} onCheckedChange={setStop} /><Label htmlFor="stop">Remove stop words</Label></div>
            <div className="flex items-center gap-2"><Label htmlFor="max">Max length</Label><Input id="max" type="number" className="w-24" value={max} onChange={(e) => setMax(e.target.value)} /></div>
          </div>
          <div className="space-y-2">
            {slugs.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border bg-muted/40 p-2">
                <code className="flex-1 break-all text-sm">{s || "—"}</code>
                <span className="text-xs text-muted-foreground">{s.length} chars</span>
                <Button size="icon" variant="ghost" aria-label="Copy slug" onClick={() => { navigator.clipboard.writeText(s); toast.success("Slug copied"); }}><Copy className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          {slugs.length > 1 && <Button onClick={() => { navigator.clipboard.writeText(slugs.join("\n")); toast.success("All slugs copied"); }}>Copy all</Button>}
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default SlugGenerator;
