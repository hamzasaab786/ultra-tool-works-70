import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GOLD_NISAB_G = 87.48;
const SILVER_NISAB_G = 612.36;

const fields = [
  ["cash", "Cash in hand & bank accounts"],
  ["gold", "Value of gold you own"],
  ["silver", "Value of silver you own"],
  ["investments", "Shares, funds & savings schemes"],
  ["business", "Business stock / inventory"],
  ["receivable", "Money owed to you (likely to be repaid)"],
  ["other", "Other zakatable assets"],
] as const;

const ZakatCalculator = () => {
  const [v, setV] = useState<Record<string, string>>({ cash: "500000", gold: "", silver: "", investments: "", business: "", receivable: "", other: "" });
  const [liab, setLiab] = useState("0");
  const [goldPrice, setGoldPrice] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [basis, setBasis] = useState<"silver" | "gold">("silver");

  const r = useMemo(() => {
    const num = (s: string) => Math.max(parseFloat(s) || 0, 0);
    const assets = fields.reduce((s, [k]) => s + num(v[k]), 0);
    const net = Math.max(assets - num(liab), 0);
    const nisab = basis === "gold" ? num(goldPrice) * GOLD_NISAB_G : num(silverPrice) * SILVER_NISAB_G;
    const due = nisab > 0 && net >= nisab;
    return { assets, net, nisab, due, zakat: due ? net * 0.025 : 0 };
  }, [v, liab, goldPrice, silverPrice, basis]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate title="Zakat Calculator" description="Calculate your Zakat at 2.5% of net zakatable wealth, with a nisab check based on today's gold or silver price — any currency.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Your assets</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {fields.map(([k, l]) => (
              <div key={k}><Label htmlFor={k}>{l}</Label><Input id={k} type="number" min="0" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></div>
            ))}
            <div><Label htmlFor="liab">Debts & bills due now (subtract)</Label><Input id="liab" type="number" min="0" value={liab} onChange={(e) => setLiab(e.target.value)} /></div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Nisab threshold</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant={basis === "silver" ? "default" : "outline"} onClick={() => setBasis("silver")}>Silver ({SILVER_NISAB_G} g)</Button>
                <Button variant={basis === "gold" ? "default" : "outline"} onClick={() => setBasis("gold")}>Gold ({GOLD_NISAB_G} g)</Button>
              </div>
              {basis === "silver" ? (
                <div><Label htmlFor="sp">Silver price per gram (your currency)</Label><Input id="sp" type="number" min="0" placeholder="e.g. 300" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} /></div>
              ) : (
                <div><Label htmlFor="gp">Gold price per gram (your currency)</Label><Input id="gp" type="number" min="0" placeholder="e.g. 25000" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} /></div>
              )}
              <p className="text-xs text-muted-foreground">Enter today's local market price. Silver nisab is lower, so more people qualify — many scholars recommend it as the safer choice.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Total assets</span><span>{fmt(r.assets)}</span></div>
              <div className="flex justify-between"><span>Net zakatable wealth</span><span>{fmt(r.net)}</span></div>
              <div className="flex justify-between"><span>Nisab</span><span>{r.nisab ? fmt(r.nisab) : "Enter metal price"}</span></div>
              <div className="mt-3 rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-muted-foreground">Zakat payable (2.5%)</p>
                <p className="text-3xl font-bold">{fmt(r.zakat)}</p>
                <p className="mt-1 text-xs">{!r.nisab ? "Add the gold or silver price to check nisab." : r.due ? "Your wealth is above nisab — Zakat is due once a lunar year has passed." : "Your wealth is below nisab — Zakat is not obligatory."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">This calculator gives a general estimate. For personal situations (business assets, pensions, loans) please consult a qualified scholar.</p>
    </ToolPageTemplate>
  );
};

export default ZakatCalculator;
