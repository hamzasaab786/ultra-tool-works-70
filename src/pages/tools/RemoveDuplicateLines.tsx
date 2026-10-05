import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy } from "lucide-react";

type Sort = "none" | "az" | "za" | "len" | "num";

const RemoveDuplicateLines = () => {
  const [text, setText] = useState("apple\nBanana\napple\n  cherry\nbanana\n\ncherry\n10\n2");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trim, setTrim] = useState(true);
  const [dropEmpty, setDropEmpty] = useState(true);
  const [sort, setSort] = useState<Sort>("none");

  const { lines, removed, total } = useMemo(() => {
    const src = text.split(/\r?\n/);
    const seen = new Set<string>();
    let out: string[] = [];
    for (const raw of src) {
      const line = trim ? raw.trim() : raw;
      if (dropEmpty && !line.trim()) continue;
      const key = ignoreCase ? line.toLowerCase() : line;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(line);
    }
    const coll = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    if (sort === "az") out = [...out].sort(coll.compare);
    if (sort === "za") out = [...out].sort((a, b) => coll.compare(b, a));
    if (sort === "len") out = [...out].sort((a, b) => a.length - b.length);
    if (sort === "num") out = [...out].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    const total = src.length;
    return { lines: out, removed: total - out.length, total };
  }, [text, ignoreCase, trim, dropEmpty, sort]);

  const result = lines.join("\n");

  return (
    <ToolPageTemplate title="Remove Duplicate Lines" description="Delete repeated lines from any list, keep the first occurrence, and optionally sort A–Z, by length or numerically.">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2"><Switch id="ic" checked={ignoreCase} onCheckedChange={setIgnoreCase} /><Label htmlFor="ic">Ignore case</Label></div>
            <div className="flex items-center gap-2"><Switch id="tr" checked={trim} onCheckedChange={setTrim} /><Label htmlFor="tr">Trim spaces</Label></div>
            <div className="flex items-center gap-2"><Switch id="em" checked={dropEmpty} onCheckedChange={setDropEmpty} /><Label htmlFor="em">Remove empty lines</Label></div>
            <label className="text-sm">Sort
              <select className="ml-2 rounded border bg-background px-2 py-1" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="none">Keep original order</option><option value="az">A → Z</option><option value="za">Z → A</option>
                <option value="len">By length</option><option value="num">Numeric</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div><Label htmlFor="in">Your list</Label><Textarea id="in" className="min-h-[300px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} /></div>
            <div><Label htmlFor="out">Unique lines</Label><Textarea id="out" readOnly className="min-h-[300px] font-mono text-sm" value={result} /></div>
          </div>
          <p className="text-sm text-muted-foreground">{total} lines in · {lines.length} unique out · {removed} removed</p>
          <Button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy result</Button>
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default RemoveDuplicateLines;
