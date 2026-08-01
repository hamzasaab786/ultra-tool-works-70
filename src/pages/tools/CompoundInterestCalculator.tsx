import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

const FREQUENCIES: { label: string; value: string; n: number }[] = [
  { label: "Yearly", value: "1", n: 1 },
  { label: "Half-yearly", value: "2", n: 2 },
  { label: "Quarterly", value: "4", n: 4 },
  { label: "Monthly", value: "12", n: 12 },
  { label: "Daily", value: "365", n: 365 },
];

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState("12");
  const [monthly, setMonthly] = useState("0");

  const data = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseInt(freq, 10) || 1;
    const pmt = parseFloat(monthly) || 0;

    const lump = P * Math.pow(1 + r / n, n * t);

    // monthly contributions compounded monthly
    const rm = r / 12;
    const months = t * 12;
    const contribFV = rm === 0 ? pmt * months : pmt * ((Math.pow(1 + rm, months) - 1) / rm);

    const total = lump + contribFV;
    const invested = P + pmt * months;

    const rows: { year: number; balance: number; invested: number }[] = [];
    for (let y = 1; y <= Math.min(Math.ceil(t), 30); y++) {
      const l = P * Math.pow(1 + r / n, n * y);
      const c = rm === 0 ? pmt * y * 12 : pmt * ((Math.pow(1 + rm, y * 12) - 1) / rm);
      rows.push({ year: y, balance: l + c, invested: P + pmt * y * 12 });
    }

    return { total, invested, interest: total - invested, rows };
  }, [principal, rate, years, freq, monthly]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <ToolPageTemplate
      title="Compound Interest Calculator"
      description="See how savings and investments grow over time with compound interest, monthly contributions and any compounding frequency — with a year-by-year breakdown."
      keywords="compound interest calculator, savings growth calculator, investment return calculator, sip future value"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Your plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="principal">Initial amount</Label>
              <Input id="principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="monthly">Monthly contribution</Label>
              <Input id="monthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="rate">Annual interest rate (%)</Label>
                <Input id="rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="years">Years</Label>
                <Input id="years" type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Compounding frequency</Label>
              <Select value={freq} onValueChange={setFreq}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Future value</p>
              <p className="text-4xl font-bold text-primary">{fmt(data.total)}</p>
              <p className="text-sm text-muted-foreground">
                Invested {fmt(data.invested)} · Interest earned {fmt(data.interest)}
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/60 text-left">
                  <tr>
                    <th className="p-2 font-medium">Year</th>
                    <th className="p-2 font-medium">Invested</th>
                    <th className="p-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => (
                    <tr key={r.year} className="border-t border-border">
                      <td className="p-2">{r.year}</td>
                      <td className="p-2 text-muted-foreground">{fmt(r.invested)}</td>
                      <td className="p-2 font-medium">{fmt(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default CompoundInterestCalculator;
