import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plug, Trash2, Plus } from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  watts: string;
  hours: string;
  qty: string;
}

const newAppliance = (name = "", watts = "", hours = "", qty = "1"): Appliance => ({
  id: Math.random().toString(36).slice(2),
  name,
  watts,
  hours,
  qty,
});

const ElectricityBillCalculator = () => {
  const [rate, setRate] = useState("25");
  const [items, setItems] = useState<Appliance[]>([
    newAppliance("Air conditioner", "1500", "6"),
    newAppliance("Refrigerator", "150", "24"),
    newAppliance("LED lights", "12", "6", "8"),
  ]);

  const update = (id: string, patch: Partial<Appliance>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const totals = useMemo(() => {
    const r = parseFloat(rate) || 0;
    const rows = items.map((i) => {
      const kwhDay = ((parseFloat(i.watts) || 0) * (parseFloat(i.hours) || 0) * (parseInt(i.qty) || 1)) / 1000;
      return { id: i.id, kwhDay, costDay: kwhDay * r };
    });
    const kwhDay = rows.reduce((s, r2) => s + r2.kwhDay, 0);
    return { rows, kwhDay, kwhMonth: kwhDay * 30, costDay: kwhDay * r, costMonth: kwhDay * 30 * r, costYear: kwhDay * 365 * r };
  }, [items, rate]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate
      title="Electricity Bill Calculator"
      description="Estimate your monthly electricity bill by appliance — see exactly which device is burning the most units."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plug className="h-5 w-5" /> Appliances</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="rate">Unit rate (per kWh)</Label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>

            {items.map((i) => {
              const row = totals.rows.find((r) => r.id === i.id);
              return (
                <div key={i.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Appliance</Label>
                    <Input value={i.name} placeholder="e.g. Water pump" onChange={(e) => update(i.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Watts</Label>
                    <Input type="number" value={i.watts} onChange={(e) => update(i.id, { watts: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hours/day</Label>
                    <Input type="number" value={i.hours} onChange={(e) => update(i.id, { hours: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" min="1" value={i.qty} onChange={(e) => update(i.id, { qty: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{fmt((row?.kwhDay || 0) * 30)} kWh/mo</span>
                    <Button size="icon" variant="ghost" onClick={() => setItems((p) => p.filter((x) => x.id !== i.id))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            <Button variant="outline" onClick={() => setItems((p) => [...p, newAppliance()])}>
              <Plus className="mr-2 h-4 w-4" /> Add appliance
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Estimated bill</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Units per day" value={`${fmt(totals.kwhDay)} kWh`} />
            <Row label="Units per month" value={`${fmt(totals.kwhMonth)} kWh`} />
            <Row label="Cost per day" value={fmt(totals.costDay)} />
            <Row label="Monthly bill" value={fmt(totals.costMonth)} strong />
            <Row label="Yearly bill" value={fmt(totals.costYear)} />
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between border-b pb-2 ${strong ? "text-lg font-bold" : ""}`}>
    <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ElectricityBillCalculator;
