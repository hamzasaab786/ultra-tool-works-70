import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, AlertTriangle, CreditCard, ShieldAlert } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

// Standard published test BINs for payment processor sandboxes ONLY.
// These are publicly documented by Stripe/Adyen/etc. for development testing.
// They do NOT work on real payment systems.
const TEST_BINS: Record<string, { name: string; bin: string; length: number; cvvLen: number }[]> = {
  visa: [
    { name: "Visa (Stripe test)", bin: "4242424242424242", length: 16, cvvLen: 3 },
    { name: "Visa (success)", bin: "424242", length: 16, cvvLen: 3 },
    { name: "Visa Debit", bin: "400000", length: 16, cvvLen: 3 },
  ],
  mastercard: [
    { name: "Mastercard (Stripe test)", bin: "5555555555554444", length: 16, cvvLen: 3 },
    { name: "Mastercard 2-series", bin: "2223003122003222", length: 16, cvvLen: 3 },
  ],
  amex: [
    { name: "American Express (test)", bin: "378282246310005", length: 15, cvvLen: 4 },
  ],
  discover: [
    { name: "Discover (test)", bin: "6011111111111117", length: 16, cvvLen: 3 },
  ],
  decline: [
    { name: "Generic decline", bin: "4000000000000002", length: 16, cvvLen: 3 },
    { name: "Insufficient funds", bin: "4000000000009995", length: 16, cvvLen: 3 },
  ],
};

// Luhn algorithm — generates valid checksum for a card number.
// Used by every issuer & processor to reject typos before network routing.
function luhnComplete(partial: string, totalLength: number): string {
  while (partial.length < totalLength - 1) {
    partial += Math.floor(Math.random() * 10);
  }
  // compute checksum digit
  let sum = 0;
  const reversed = partial.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    let d = parseInt(reversed[i]);
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  return partial + check;
}

const formatNumber = (n: string) => n.replace(/(.{4})/g, "$1 ").trim();

const TestCardGenerator = () => {
  const [type, setType] = useState<keyof typeof TEST_BINS>("visa");
  const [variant, setVariant] = useState(0);
  const [count, setCount] = useState(5);
  const [cards, setCards] = useState<{ number: string; cvv: string; expiry: string; name: string }[]>([]);

  const generate = () => {
    const variants = TEST_BINS[type];
    const v = variants[variant] || variants[0];
    const out: typeof cards = [];
    for (let i = 0; i < count; i++) {
      const isFullPan = v.bin.length === v.length;
      const number = isFullPan ? v.bin : luhnComplete(v.bin, v.length);
      const cvv = String(Math.floor(Math.random() * Math.pow(10, v.cvvLen))).padStart(v.cvvLen, "0");
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);
      const expiry = `${month}/${year}`;
      const firstNames = ["Alex", "Jordan", "Sam", "Taylor", "Morgan", "Casey"];
      const lastNames = ["Smith", "Johnson", "Lee", "Brown", "Davis", "Garcia"];
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      out.push({ number, cvv, expiry, name });
    }
    setCards(out);
    toast.success(`Generated ${out.length} test cards`);
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <ToolPageTemplate title="Test Card Number Generator (Developer Only)" description="Generate Luhn-valid test card numbers for payment processor sandboxes. For developer testing in Stripe/PayPal/Braintree sandbox environments only." keywords="test credit card, Luhn algorithm, payment sandbox testing, Stripe test cards">
      <div className="space-y-6">
        <Card className="p-5 border-2 border-red-300 bg-red-50 dark:bg-red-950/20">
          <div className="flex gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-bold text-red-900 dark:text-red-200 mb-1">⚠️ DEVELOPER USE ONLY — Sandbox Testing</div>
              <ul className="space-y-1 text-red-900 dark:text-red-200 list-disc ml-5">
                <li>These card numbers <strong>only work in payment processor sandbox/test environments</strong> (Stripe test mode, PayPal sandbox, Braintree sandbox, etc.).</li>
                <li>They will <strong>NOT</strong> work on live payment systems, real merchants, or to bypass any verification.</li>
                <li>Using these (or any random number) to attempt real payments, free trials, or fraud is a <strong>crime</strong> (credit card fraud / wire fraud).</li>
                <li>These numbers are <strong>publicly published</strong> by Stripe and other processors specifically for development testing.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5" />Generator Settings</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label>Card Network</Label>
              <Select value={type} onValueChange={(v: any) => { setType(v); setVariant(0); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="discover">Discover</SelectItem>
                  <SelectItem value="decline">Decline scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Variant</Label>
              <Select value={String(variant)} onValueChange={v => setVariant(+v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEST_BINS[type].map((v, i) => <SelectItem key={i} value={String(i)}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>How many cards (1–20)</Label>
              <Input type="number" min={1} max={20} value={count} onChange={e => setCount(Math.min(20, Math.max(1, +e.target.value)))} />
            </div>
          </div>
          <Button onClick={generate} size="lg" className="w-full"><RefreshCw className="w-4 h-4 mr-2" />Generate Test Cards</Button>
        </Card>

        {cards.length > 0 && (
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 dark:bg-amber-950/20 rounded p-2 text-xs">
              <AlertTriangle className="w-4 h-4" /> Sandbox use only. These are not real cards.
            </div>
            <div className="space-y-3">
              {cards.map((c, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Test Card #{i + 1}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-white hover:bg-white/10" onClick={() => copy(c.number)}><Copy className="w-3 h-3 mr-1" />Number</Button>
                  </div>
                  <div className="font-mono text-xl tracking-wider mb-3">{formatNumber(c.number)}</div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div><div className="text-slate-400">NAME</div><div className="font-medium">{c.name}</div></div>
                    <div><div className="text-slate-400">EXPIRES</div><div className="font-mono">{c.expiry}</div></div>
                    <div><div className="text-slate-400">CVV</div><div className="font-mono">{c.cvv}</div></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10 h-7" onClick={() => copy(`${c.number}|${c.expiry}|${c.cvv}`)}>Copy All</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default TestCardGenerator;
