import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby } from "lucide-react";

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const fmtDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const PregnancyDueDateCalculator = () => {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState("28");

  const result = useMemo(() => {
    if (!lmp) return null;
    const start = new Date(`${lmp}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    const adjust = (parseInt(cycle) || 28) - 28;
    const due = addDays(start, 280 + adjust);
    const conception = addDays(start, 14 + adjust);
    const today = new Date();
    const daysPregnant = Math.floor((today.getTime() - start.getTime()) / 86400000);
    const weeks = Math.floor(daysPregnant / 7);
    const days = daysPregnant % 7;
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86400000);
    return {
      due,
      conception,
      t1: addDays(start, 13 * 7),
      t2: addDays(start, 27 * 7),
      weeks,
      days,
      daysLeft,
      valid: daysPregnant >= 0 && daysPregnant <= 320,
    };
  }, [lmp, cycle]);

  return (
    <ToolPageTemplate
      title="Pregnancy Due Date Calculator"
      description="Estimate your baby's due date, current pregnancy week and trimester dates from your last menstrual period."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5" /> Your dates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lmp">First day of last period</Label>
              <Input id="lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle">Average cycle length (days)</Label>
              <Input id="cycle" type="number" min="20" max="45" value={cycle} onChange={(e) => setCycle(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              This is an estimate based on Naegele's rule. Only an ultrasound and your doctor can confirm your due date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your pregnancy timeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                <Row label="Estimated due date" value={fmtDate(result.due)} strong />
                {result.valid && (
                  <>
                    <Row label="You are currently" value={`${result.weeks} weeks ${result.days} days`} />
                    <Row label="Days remaining" value={`${Math.max(0, result.daysLeft)} days`} />
                  </>
                )}
                <Row label="Estimated conception" value={fmtDate(result.conception)} />
                <Row label="First trimester ends" value={fmtDate(result.t1)} />
                <Row label="Second trimester ends" value={fmtDate(result.t2)} />
              </>
            ) : (
              <p className="text-muted-foreground">Pick the first day of your last period to see your due date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between gap-4 border-b pb-2 ${strong ? "font-bold" : ""}`}>
    <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

export default PregnancyDueDateCalculator;
