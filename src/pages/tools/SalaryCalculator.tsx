import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet } from "lucide-react";

type Period = "hour" | "day" | "week" | "month" | "year";

const SalaryCalculator = () => {
  const [amount, setAmount] = useState("50000");
  const [period, setPeriod] = useState<Period>("year");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [taxRate, setTaxRate] = useState("0");

  const res = useMemo(() => {
    const a = parseFloat(amount) || 0;
    const hpw = parseFloat(hoursPerWeek) || 40;
    const dpw = parseFloat(daysPerWeek) || 5;
    const wpy = parseFloat(weeksPerYear) || 52;

    let annual = 0;
    switch (period) {
      case "hour": annual = a * hpw * wpy; break;
      case "day": annual = a * dpw * wpy; break;
      case "week": annual = a * wpy; break;
      case "month": annual = a * 12; break;
      default: annual = a;
    }

    const tax = (annual * (parseFloat(taxRate) || 0)) / 100;
    const net = annual - tax;

    const build = (v: number) => ({
      year: v,
      month: v / 12,
      week: v / wpy,
      day: v / (wpy * dpw),
      hour: v / (wpy * hpw),
    });

    return { gross: build(annual), net: build(net), tax };
  }, [amount, period, hoursPerWeek, daysPerWeek, weeksPerYear, taxRate]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate
      title="Salary & Hourly Wage Calculator"
      description="Convert an hourly rate into monthly and yearly pay — or the other way round — including working hours, days off and an optional tax deduction."
      keywords="salary calculator, hourly to annual salary, wage converter, monthly take home pay calculator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Your pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <Label>Per</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="hpw">Hours / week</Label>
                <Input id="hpw" type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="dpw">Days / week</Label>
                <Input id="dpw" type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wpy">Weeks / year</Label>
                <Input id="wpy" type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="tax">Tax & deductions (%)</Label>
              <Input id="tax" type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2 font-medium">Period</th>
                  <th className="p-2 font-medium">Gross</th>
                  <th className="p-2 font-medium">Take home</th>
                </tr>
              </thead>
              <tbody>
                {(["year", "month", "week", "day", "hour"] as const).map((k) => (
                  <tr key={k} className="border-t border-border">
                    <td className="p-2 capitalize">{k}ly</td>
                    <td className="p-2">{fmt(res.gross[k])}</td>
                    <td className="p-2 font-semibold text-primary">{fmt(res.net[k])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">
              Annual deductions: {fmt(res.tax)}. Estimates only — local tax bands may differ.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default SalaryCalculator;
