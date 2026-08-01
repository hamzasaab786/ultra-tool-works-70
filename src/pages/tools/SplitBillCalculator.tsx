import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Trash2 } from "lucide-react";

interface Person {
  id: string;
  name: string;
  paid: string;
}

const newPerson = (name = "", paid = ""): Person => ({ id: Math.random().toString(36).slice(2), name, paid });

const SplitBillCalculator = () => {
  const [people, setPeople] = useState<Person[]>([newPerson("Ali", "1200"), newPerson("Sara", "600"), newPerson("Bilal", "0")]);
  const [tip, setTip] = useState("0");

  const update = (id: string, patch: Partial<Person>) =>
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const data = useMemo(() => {
    const paid = people.map((p) => parseFloat(p.paid) || 0);
    const subtotal = paid.reduce((s, v) => s + v, 0);
    const tipPct = parseFloat(tip) || 0;
    const total = subtotal * (1 + tipPct / 100);
    const share = people.length ? total / people.length : 0;
    const balances = people.map((p, i) => ({
      name: p.name || `Person ${i + 1}`,
      paid: paid[i],
      balance: paid[i] - share,
    }));

    // settle up: who pays whom
    const debtors = balances.filter((b) => b.balance < -0.01).map((b) => ({ ...b }));
    const creditors = balances.filter((b) => b.balance > 0.01).map((b) => ({ ...b }));
    const transfers: { from: string; to: string; amount: number }[] = [];
    let di = 0;
    let ci = 0;
    while (di < debtors.length && ci < creditors.length) {
      const amount = Math.min(-debtors[di].balance, creditors[ci].balance);
      if (amount > 0.01) transfers.push({ from: debtors[di].name, to: creditors[ci].name, amount });
      debtors[di].balance += amount;
      creditors[ci].balance -= amount;
      if (Math.abs(debtors[di].balance) < 0.01) di++;
      if (Math.abs(creditors[ci].balance) < 0.01) ci++;
    }
    return { subtotal, total, share, balances, transfers };
  }, [people, tip]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate
      title="Split Bill Calculator"
      description="Split any shared bill fairly between friends, add a tip and see exactly who owes whom — with the fewest transfers."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Who paid what?</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {people.map((p, i) => (
              <div key={p.id} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input value={p.name} placeholder={`Person ${i + 1}`} onChange={(e) => update(p.id, { name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Paid</Label>
                  <Input type="number" value={p.paid} onChange={(e) => update(p.id, { paid: e.target.value })} />
                </div>
                <Button size="icon" variant="ghost" onClick={() => setPeople((prev) => prev.filter((x) => x.id !== p.id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setPeople((prev) => [...prev, newPerson()])}>
                <Plus className="mr-2 h-4 w-4" /> Add person
              </Button>
              <div className="space-y-1">
                <Label className="text-xs">Tip %</Label>
                <Input className="w-28" type="number" value={tip} onChange={(e) => setTip(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Row label="Subtotal" value={fmt(data.subtotal)} />
              <Row label="Total with tip" value={fmt(data.total)} strong />
              <Row label="Equal share each" value={fmt(data.share)} />
              {data.balances.map((b) => (
                <Row
                  key={b.name}
                  label={b.name}
                  value={`${b.balance >= 0 ? "gets back" : "owes"} ${fmt(Math.abs(b.balance))}`}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Settle up</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.transfers.length ? (
                data.transfers.map((t, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <span className="font-medium">{t.from}</span> pays{" "}
                    <span className="font-medium">{t.to}</span>{" "}
                    <span className="font-bold">{fmt(t.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Everyone is already settled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between gap-4 border-b pb-2 ${strong ? "text-lg font-bold" : ""}`}>
    <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

export default SplitBillCalculator;
