import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const RANGES: [number, number][] = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];
const NAMES = ["minute", "hour", "day of month", "month", "day of week"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PRESETS: [string, string][] = [
  ["Every minute", "* * * * *"], ["Every 5 minutes", "*/5 * * * *"], ["Every 15 minutes", "*/15 * * * *"],
  ["Hourly", "0 * * * *"], ["Daily at midnight", "0 0 * * *"], ["Daily at 9:00", "0 9 * * *"],
  ["Weekdays at 9:00", "0 9 * * 1-5"], ["Every Sunday", "0 0 * * 0"], ["1st of month", "0 0 1 * *"], ["Yearly (Jan 1)", "0 0 1 1 *"],
];

function parseField(raw: string, idx: number): Set<number> {
  const [min, max] = RANGES[idx];
  let f = raw.toUpperCase();
  if (idx === 3) MONTHS.forEach((m, i) => (f = f.replace(new RegExp(m, "g"), String(i + 1))));
  if (idx === 4) DAYS.forEach((d, i) => (f = f.replace(new RegExp(d, "g"), String(i))));
  const out = new Set<number>();
  for (const part of f.split(",")) {
    const m = part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
    if (!m) throw new Error(`Invalid ${NAMES[idx]} value "${part}"`);
    let lo = min, hi = max;
    if (m[1] !== "*") {
      const [a, b] = m[1].split("-").map(Number);
      lo = a; hi = b ?? (m[2] ? max : a);
    }
    const step = m[2] ? Number(m[2]) : 1;
    if (idx === 4 && hi === 7) hi = 6, lo = lo === 7 ? 0 : lo;
    if (lo < min || hi > max || lo > hi || step < 1) throw new Error(`${NAMES[idx]} "${part}" is out of range ${min}-${max}`);
    for (let v = lo; v <= hi; v += step) out.add(v);
  }
  return out;
}

function nextRuns(fields: Set<number>[], raw: string[], count: number): Date[] {
  const res: Date[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const domStar = raw[2] === "*", dowStar = raw[4] === "*";
  for (let i = 0; i < 600000 && res.length < count; i++) {
    const domOk = fields[2].has(d.getDate()), dowOk = fields[4].has(d.getDay());
    const dayOk = domStar || dowStar ? domOk && dowOk : domOk || dowOk;
    if (fields[3].has(d.getMonth() + 1) && dayOk && fields[1].has(d.getHours()) && fields[0].has(d.getMinutes())) res.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1);
  }
  return res;
}

const list = (s: Set<number>, map?: (n: number) => string) => [...s].map((n) => (map ? map(n) : String(n))).join(", ");

function describe(raw: string[], f: Set<number>[]): string {
  const [mi, h, dom, mon, dow] = raw;
  let time: string;
  if (mi === "*" && h === "*") time = "Every minute";
  else if (mi.startsWith("*/") && h === "*") time = `Every ${mi.slice(2)} minutes`;
  else if (h === "*") time = `At minute ${list(f[0])} of every hour`;
  else if (f[0].size === 1 && f[1].size <= 6) time = "At " + [...f[1]].map((hh) => `${String(hh).padStart(2, "0")}:${String([...f[0]][0]).padStart(2, "0")}`).join(", ");
  else time = `At minute ${list(f[0])} past hour ${list(f[1])}`;
  const parts = [time];
  if (dom !== "*") parts.push(`on day ${list(f[2])} of the month`);
  if (dow !== "*") parts.push(`${dom !== "*" ? "or " : ""}on ${list(f[4], (n) => DAY_FULL[n])}`);
  if (mon !== "*") parts.push(`in ${list(f[3], (n) => MONTH_FULL[n - 1])}`);
  return parts.join(" ");
}

const CronExpressionGenerator = () => {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const raw = expr.trim().split(/\s+/);

  const result = useMemo(() => {
    try {
      if (raw.length !== 5) throw new Error("A standard cron expression has exactly 5 fields: minute hour day-of-month month day-of-week");
      const fields = raw.map((r, i) => parseField(r, i));
      return { text: describe(raw, fields), runs: nextRuns(fields, raw, 5), error: "" };
    } catch (e) {
      return { text: "", runs: [], error: (e as Error).message };
    }
  }, [expr]);

  const setField = (i: number, v: string) => {
    const parts = raw.length === 5 ? [...raw] : ["*", "*", "*", "*", "*"];
    parts[i] = v || "*";
    setExpr(parts.join(" "));
  };

  return (
    <ToolPageTemplate title="Cron Expression Generator" description="Build and explain cron schedules in plain English, then preview the next run times — for crontab, CI pipelines and serverless jobs.">
      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <Label htmlFor="cron">Cron expression</Label>
            <div className="flex gap-2">
              <Input id="cron" className="font-mono text-lg" value={expr} onChange={(e) => setExpr(e.target.value)} />
              <Button onClick={() => { navigator.clipboard.writeText(expr.trim()); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {NAMES.map((n, i) => (
              <div key={n}>
                <Label className="text-xs capitalize">{n}</Label>
                <Input className="font-mono" value={raw.length === 5 ? raw[i] : ""} onChange={(e) => setField(i, e.target.value.trim())} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(([l, v]) => <Button key={v} size="sm" variant="outline" onClick={() => setExpr(v)}>{l}</Button>)}
          </div>
          {result.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{result.error}</p>
          ) : (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
              <p className="text-lg font-semibold">“{result.text}”</p>
              <p className="text-sm font-medium">Next 5 runs (your local time):</p>
              <ul className="text-sm font-mono space-y-1">{result.runs.map((r) => <li key={r.toISOString()}>{r.toLocaleString()}</li>)}</ul>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Syntax: <code>*</code> any · <code>,</code> list · <code>-</code> range · <code>/</code> step · month JAN–DEC · weekday SUN–SAT (0 or 7 = Sunday).</p>
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default CronExpressionGenerator;
