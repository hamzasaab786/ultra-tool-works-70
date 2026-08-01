import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Landmark } from "lucide-react";

const MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const toRoman = (num: number): string => {
  if (!Number.isFinite(num) || num <= 0 || num > 3999) return "";
  let n = Math.floor(num);
  let out = "";
  for (const [v, s] of MAP) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
};

const fromRoman = (roman: string): number | null => {
  const s = roman.toUpperCase().replace(/\s/g, "");
  if (!/^[MDCLXVI]+$/.test(s)) return null;
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]];
    const next = vals[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return toRoman(total) === s ? total : null;
};

const RomanNumeralConverter = () => {
  const [number, setNumber] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const romanFromNumber = useMemo(() => toRoman(parseInt(number, 10)), [number]);
  const numberFromRoman = useMemo(() => fromRoman(roman), [roman]);

  const romanDate = useMemo(() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return `${toRoman(d.getDate())} · ${toRoman(d.getMonth() + 1)} · ${toRoman(d.getFullYear())}`;
  }, [date]);

  const copy = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied");
  };

  return (
    <ToolPageTemplate
      title="Roman Numeral Converter"
      description="Convert numbers to Roman numerals and Roman numerals back to numbers, plus turn any date into Roman numerals for tattoos, certificates and designs."
      keywords="roman numeral converter, number to roman numerals, roman numerals date converter, roman numeral tattoo generator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" /> Number → Roman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="num">Number (1 – 3999)</Label>
              <Input id="num" type="number" min="1" max="3999" value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Roman numeral</p>
              <p className="break-all text-3xl font-bold tracking-widest text-primary">{romanFromNumber || "—"}</p>
            </div>
            <Button variant="outline" size="sm" disabled={!romanFromNumber} onClick={() => copy(romanFromNumber)}>
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>

            <div className="pt-4">
              <Label htmlFor="rdate">Date → Roman numerals</Label>
              <Input id="rdate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
                <p className="break-all text-2xl font-bold tracking-widest text-primary">{romanDate || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roman → Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="roman">Roman numeral</Label>
              <Input
                id="roman"
                value={roman}
                onChange={(e) => setRoman(e.target.value.toUpperCase())}
                placeholder="MMXXVI"
                className="tracking-widest"
              />
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Decimal value</p>
              <p className="text-3xl font-bold text-primary">
                {numberFromRoman !== null ? numberFromRoman.toLocaleString() : "Invalid numeral"}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">Quick reference</p>
              <p>I = 1 · V = 5 · X = 10 · L = 50 · C = 100 · D = 500 · M = 1000</p>
              <p className="mt-2">
                A smaller symbol before a larger one subtracts (IV = 4, IX = 9, XL = 40, CM = 900); otherwise values add up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default RomanNumeralConverter;
