import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarHeart } from "lucide-react";

const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

const OvulationCalculator = () => {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState("28");
  const [luteal, setLuteal] = useState("14");
  const [result, setResult] = useState<null | {
    ovulation: Date; windowStart: Date; windowEnd: Date; nextPeriod: Date; dueDate: Date; cycles: { ovulation: Date; period: Date }[];
  }>(null);

  const calculate = () => {
    if (!lmp) return;
    const start = new Date(`${lmp}T00:00:00`);
    const cl = Math.min(45, Math.max(20, Number(cycle) || 28));
    const lp = Math.min(18, Math.max(9, Number(luteal) || 14));
    const ovulation = addDays(start, cl - lp);
    const cycles = [1, 2, 3].map((i) => ({
      ovulation: addDays(start, cl * i + (cl - lp)),
      period: addDays(start, cl * (i + 1)),
    }));
    setResult({
      ovulation,
      windowStart: addDays(ovulation, -5),
      windowEnd: addDays(ovulation, 1),
      nextPeriod: addDays(start, cl),
      dueDate: addDays(ovulation, 266),
      cycles,
    });
  };

  return (
    <>
      <ToolPageTemplate title="Ovulation Calculator" description="Estimate your fertile window, ovulation day and next period">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CalendarHeart className="h-5 w-5" /> Your cycle</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>First day of last period</Label><Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} /></div>
                <div className="space-y-2"><Label>Cycle length (days)</Label><Input type="number" min={20} max={45} value={cycle} onChange={(e) => setCycle(e.target.value)} /></div>
                <div className="space-y-2"><Label>Luteal phase (days)</Label><Input type="number" min={9} max={18} value={luteal} onChange={(e) => setLuteal(e.target.value)} /></div>
              </div>
              <Button onClick={calculate} className="w-full" disabled={!lmp}>Calculate</Button>
            </CardContent>
          </Card>

          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Estimated ovulation</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Badge className="text-base px-3 py-1">{fmt(result.ovulation)}</Badge>
                    <p className="text-sm text-muted-foreground">Most fertile days: <strong>{fmt(result.windowStart)}</strong> to <strong>{fmt(result.windowEnd)}</strong></p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Next period & due date</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Next period starts:</span><span className="font-medium">{fmt(result.nextPeriod)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Due date if you conceive:</span><span className="font-medium">{fmt(result.dueDate)}</span></div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Next 3 cycles</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {result.cycles.map((c, i) => (
                    <div key={i} className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0">
                      <span className="text-muted-foreground">Cycle {i + 2}</span>
                      <span>Ovulation: <strong>{fmt(c.ovulation)}</strong></span>
                      <span>Period: <strong>{fmt(c.period)}</strong></span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">
                These dates are statistical estimates based on your cycle length and are not medical advice. Cycles vary naturally — consult a healthcare professional for family planning or fertility concerns.
              </p>
            </>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default OvulationCalculator;
