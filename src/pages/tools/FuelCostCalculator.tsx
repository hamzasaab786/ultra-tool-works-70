import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel } from "lucide-react";

const FuelCostCalculator = () => {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("15");
  const [price, setPrice] = useState("280");
  const [people, setPeople] = useState("1");
  const [roundTrip, setRoundTrip] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance) * (roundTrip ? 2 : 1);
    const e = parseFloat(efficiency);
    const p = parseFloat(price);
    const n = Math.max(1, parseInt(people) || 1);
    if (!d || !e || !p) return null;
    const litres = d / e;
    const cost = litres * p;
    return { d, litres, cost, perPerson: cost / n, perKm: cost / d };
  }, [distance, efficiency, price, people, roundTrip]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate
      title="Fuel Cost Calculator"
      description="Work out the fuel needed and the exact trip cost for any journey — then split it between passengers."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Fuel className="h-5 w-5" /> Trip details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="d">Distance (km)</Label>
              <Input id="d" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e">Fuel efficiency (km per litre)</Label>
              <Input id="e" type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p">Fuel price (per litre)</Label>
              <Input id="p" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="n">Split between (people)</Label>
              <Input id="n" type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
            </div>
            <Button variant={roundTrip ? "default" : "outline"} className="w-full" onClick={() => setRoundTrip((v) => !v)}>
              {roundTrip ? "Round trip: ON" : "Round trip: OFF"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trip cost</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                <Row label="Total distance" value={`${fmt(result.d)} km`} />
                <Row label="Fuel required" value={`${fmt(result.litres)} litres`} />
                <Row label="Total fuel cost" value={fmt(result.cost)} strong />
                <Row label="Cost per person" value={fmt(result.perPerson)} />
                <Row label="Cost per km" value={fmt(result.perKm)} />
              </>
            ) : (
              <p className="text-muted-foreground">Enter distance, efficiency and fuel price.</p>
            )}
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

export default FuelCostCalculator;
