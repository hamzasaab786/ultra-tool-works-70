import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";

const toISO = (d: Date) => d.toISOString().split("T")[0];

const DateDifferenceCalculator = () => {
  const today = new Date();
  const [start, setStart] = useState(toISO(today));
  const [end, setEnd] = useState(toISO(new Date(today.getTime() + 30 * 86400000)));
  const [addDays, setAddDays] = useState("30");

  const diff = useMemo(() => {
    const a = new Date(start);
    const b = new Date(end);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const from = a <= b ? a : b;
    const to = a <= b ? b : a;

    const ms = to.getTime() - from.getTime();
    const totalDays = Math.round(ms / 86400000);

    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // business days
    let business = 0;
    const cursor = new Date(from);
    while (cursor < to) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) business += 1;
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      years, months, days, totalDays, business,
      weeks: Math.floor(totalDays / 7),
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60,
    };
  }, [start, end]);

  const futureDate = useMemo(() => {
    const base = new Date(start);
    const n = parseInt(addDays, 10);
    if (isNaN(base.getTime()) || isNaN(n)) return "";
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toDateString();
  }, [start, addDays]);

  return (
    <ToolPageTemplate
      title="Date Difference Calculator"
      description="Find the exact number of days, weeks, months and working days between two dates — or add days to any date to get the deadline instantly."
      keywords="date difference calculator, days between two dates, working days calculator, add days to date"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" /> Days between two dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="start-date">Start date</Label>
                <Input id="start-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end-date">End date</Label>
                <Input id="end-date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            {diff && (
              <>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Total difference</p>
                  <p className="text-3xl font-bold text-primary">{diff.totalDays.toLocaleString()} days</p>
                  <p className="text-sm text-muted-foreground">
                    {diff.years} years, {diff.months} months, {diff.days} days
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Weeks", diff.weeks.toLocaleString()],
                    ["Working days", diff.business.toLocaleString()],
                    ["Hours", diff.hours.toLocaleString()],
                    ["Minutes", diff.minutes.toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-border p-3">
                      <p className="text-muted-foreground">{k}</p>
                      <p className="font-semibold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add or subtract days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="add-days">Days to add (use a minus sign to subtract)</Label>
              <Input id="add-days" type="number" value={addDays} onChange={(e) => setAddDays(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90, 180, 365].map((n) => (
                <Button key={n} variant="outline" size="sm" onClick={() => setAddDays(String(n))}>
                  +{n}
                </Button>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Resulting date</p>
              <p className="text-2xl font-bold text-primary">{futureDate || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default DateDifferenceCalculator;
