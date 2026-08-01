import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, Dices } from "lucide-react";

const secureInt = (max: number) => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
};

const RandomPicker = () => {
  const [list, setList] = useState("Alice\nBob\nCharlie\nDiana");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(true);
  const [winners, setWinners] = useState<string[]>([]);

  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [numbers, setNumbers] = useState<number[]>([]);

  const pick = () => {
    const items = list.split("\n").map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    const n = Math.max(1, Math.min(parseInt(count, 10) || 1, unique ? items.length : 100));
    const pool = [...items];
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const idx = secureInt(pool.length);
      out.push(pool[idx]);
      if (unique) pool.splice(idx, 1);
      if (pool.length === 0) break;
    }
    setWinners(out);
  };

  const roll = () => {
    const lo = parseInt(min, 10) || 0;
    const hi = parseInt(max, 10) || 0;
    if (hi < lo) return;
    const n = Math.max(1, Math.min(parseInt(count, 10) || 1, 50));
    setNumbers(Array.from({ length: n }, () => lo + secureInt(hi - lo + 1)));
  };

  const shuffle = () => {
    const items = list.split("\n").map((s) => s.trim()).filter(Boolean);
    for (let i = items.length - 1; i > 0; i--) {
      const j = secureInt(i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    setList(items.join("\n"));
  };

  return (
    <ToolPageTemplate
      title="Random Name Picker & Number Generator"
      description="Pick random winners from a list, shuffle names into a fair order or generate random numbers in any range — using cryptographically secure randomness."
      keywords="random name picker, giveaway winner picker, random number generator, list randomizer"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" /> Random name picker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="names">One name or entry per line</Label>
              <Textarea id="names" rows={8} value={list} onChange={(e) => setList(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="count">How many to pick</Label>
                <Input id="count" type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <input
                  id="unique"
                  type="checkbox"
                  checked={unique}
                  onChange={(e) => setUnique(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <Label htmlFor="unique" className="mb-1">No duplicate winners</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={pick}><Shuffle className="mr-1 h-4 w-4" /> Pick winner</Button>
              <Button variant="outline" onClick={shuffle}>Shuffle list</Button>
            </div>
            {winners.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Selected</p>
                <ul className="mt-1 space-y-1">
                  {winners.map((w, i) => (
                    <li key={`${w}-${i}`} className="text-xl font-bold text-primary">{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dices className="h-5 w-5" /> Random numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="min">Minimum</Label>
                <Input id="min" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="max">Maximum</Label>
                <Input id="max" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
            </div>
            <Button onClick={roll}><Dices className="mr-1 h-4 w-4" /> Generate</Button>
            {numbers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {numbers.map((n, i) => (
                  <span key={i} className="rounded-lg border border-border bg-muted/40 px-4 py-2 text-lg font-bold text-primary">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Numbers come from the browser&rsquo;s cryptographic random generator, so every draw is unbiased and unpredictable.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default RandomPicker;
