import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Copy, Dices } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const secureInt = (min: number, max: number) => {
  const range = max - min + 1;
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / range) * range;
  let v = 0;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return min + (v % range);
};

const RandomNumberGenerator = () => {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const lo = Math.ceil(Number(min));
    const hi = Math.floor(Number(max));
    const n = Math.max(1, Math.min(1000, Math.floor(Number(count)) || 1));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) {
      toast({ title: "Invalid range", description: "Maximum must be greater than or equal to minimum.", variant: "destructive" });
      return;
    }
    if (unique && hi - lo + 1 < n) {
      toast({ title: "Range too small", description: "Not enough unique numbers in that range.", variant: "destructive" });
      return;
    }
    const out: number[] = [];
    const seen = new Set<number>();
    while (out.length < n) {
      const v = secureInt(lo, hi);
      if (unique) {
        if (seen.has(v)) continue;
        seen.add(v);
      }
      out.push(v);
    }
    setResults(sorted ? [...out].sort((a, b) => a - b) : out);
  };

  const copy = () => {
    navigator.clipboard.writeText(results.join(", "));
    toast({ title: "Copied", description: "Numbers copied to clipboard." });
  };

  return (
    <>
      <ToolPageTemplate title="Random Number Generator" description="Generate truly random numbers in any range, instantly">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Dices className="h-5 w-5" /> Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Minimum</Label><Input type="number" value={min} onChange={(e) => setMin(e.target.value)} /></div>
                <div className="space-y-2"><Label>Maximum</Label><Input type="number" value={max} onChange={(e) => setMax(e.target.value)} /></div>
                <div className="space-y-2"><Label>How many (max 1000)</Label><Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(e.target.value)} /></div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2"><Switch checked={unique} onCheckedChange={setUnique} id="uniq" /><Label htmlFor="uniq">No repeats</Label></div>
                <div className="flex items-center gap-2"><Switch checked={sorted} onCheckedChange={setSorted} id="sort" /><Label htmlFor="sort">Sort ascending</Label></div>
              </div>
              <Button onClick={generate} className="w-full"><Dices className="mr-2 h-4 w-4" /> Generate</Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Result</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {results.length === 1 ? (
                  <div className="text-center text-6xl font-bold">{results[0]}</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {results.map((r, i) => <Badge key={`${r}-${i}`} variant="secondary" className="text-base px-3 py-1">{r}</Badge>)}
                  </div>
                )}
                <Button variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" /> Copy all</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default RandomNumberGenerator;
