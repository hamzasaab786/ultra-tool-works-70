import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

const DiscountCalculator = () => {
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const [tax, setTax] = useState("0");

  const result = useMemo(() => {
    const p = parseFloat(price) || 0;
    const d = Math.min(Math.max(parseFloat(discount) || 0, 0), 100);
    const t = Math.max(parseFloat(tax) || 0, 0);
    const saved = (p * d) / 100;
    const afterDiscount = p - saved;
    const taxAmount = (afterDiscount * t) / 100;
    return { p, d, saved, afterDiscount, taxAmount, final: afterDiscount + taxAmount };
  }, [price, discount, tax]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolPageTemplate
      title="Discount & Sales Tax Calculator"
      description="Work out the sale price, how much you save and the final amount after VAT, GST or sales tax — instantly, with any currency."
      keywords="discount calculator, percent off calculator, sale price calculator, gst vat sales tax calculator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" /> Enter the details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Original price</Label>
              <Input id="price" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              <div className="mt-2 flex flex-wrap gap-2">
                {[5, 10, 15, 20, 25, 30, 50, 70].map((d) => (
                  <Button key={d} variant="outline" size="sm" onClick={() => setDiscount(String(d))}>
                    {d}%
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="tax">Sales tax / VAT / GST (%)</Label>
              <Input id="tax" type="number" min="0" value={tax} onChange={(e) => setTax(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">You pay</p>
              <p className="text-4xl font-bold text-primary">{fmt(result.final)}</p>
              <p className="text-sm text-muted-foreground">You save {fmt(result.saved)} ({result.d}% off)</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Original price", fmt(result.p)],
                ["Discount amount", fmt(result.saved)],
                ["Price after discount", fmt(result.afterDiscount)],
                ["Tax added", fmt(result.taxAmount)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border p-3 text-sm">
                  <p className="text-muted-foreground">{k}</p>
                  <p className="font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default DiscountCalculator;
