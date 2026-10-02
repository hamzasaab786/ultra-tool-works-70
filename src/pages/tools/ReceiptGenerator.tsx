import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus, Trash2, Download, Receipt as ReceiptIcon, Printer, Copy, Upload, Image as ImageIcon, Settings, Eye, Store,
} from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { CURRENCIES, formatMoney, amountInWords } from "@/lib/invoice/currencies";

type PaperId = "58mm" | "80mm" | "a5" | "a4";

const PAPERS: Record<PaperId, { label: string; widthPx: number; pdf: [number, number] | "a4" | "a5"; font: number }> = {
  "58mm": { label: "Thermal 58 mm", widthPx: 220, pdf: [58, 200], font: 10 },
  "80mm": { label: "Thermal 80 mm", widthPx: 302, pdf: [80, 200], font: 11 },
  a5: { label: "A5 sheet", widthPx: 559, pdf: "a5", font: 13 },
  a4: { label: "A4 sheet", widthPx: 794, pdf: "a4", font: 14 },
};

interface Item { id: string; name: string; qty: number; price: number; discount: number; taxRate: number; }

interface ReceiptState {
  businessName: string; tagline: string; address: string; phone: string; email: string; taxId: string;
  logo?: string;
  receiptNo: string; date: string; time: string; cashier: string; counter: string;
  customerName: string; customerPhone: string; loyaltyPoints: number;
  paymentMethod: string; cardLast4: string; amountTendered: number;
  currency: string; taxLabel: string; taxRate: number; taxMode: "global" | "per-item"; taxInclusive: boolean;
  serviceChargeRate: number; tip: number; globalDiscount: number; discountType: "percentage" | "fixed";
  items: Item[];
  paper: PaperId; accentColor: string; showQr: boolean; qrValue: string; showBarcode: boolean;
  footerNote: string; returnPolicy: string; showWords: boolean; showTaxSummary: boolean;
}

const STORE_KEY = "klipza.receipt.store.v1";
const DRAFT_KEY = "klipza.receipt.draft.v1";

const newItem = (): Item => ({ id: crypto.randomUUID(), name: "", qty: 1, price: 0, discount: 0, taxRate: 0 });

const blank = (): ReceiptState => ({
  businessName: "My Store", tagline: "Quality you can trust", address: "123 Main Street, City",
  phone: "+1 555 0100", email: "", taxId: "",
  receiptNo: `R-${Date.now().toString().slice(-6)}`,
  date: new Date().toISOString().split("T")[0],
  time: new Date().toTimeString().slice(0, 5),
  cashier: "Staff", counter: "01",
  customerName: "", customerPhone: "", loyaltyPoints: 0,
  paymentMethod: "Cash", cardLast4: "", amountTendered: 0,
  currency: "USD", taxLabel: "Tax", taxRate: 0, taxMode: "global", taxInclusive: false,
  serviceChargeRate: 0, tip: 0, globalDiscount: 0, discountType: "percentage",
  items: [{ ...newItem(), name: "Item 1", qty: 1, price: 10 }],
  paper: "80mm", accentColor: "#111827", showQr: true, qrValue: "", showBarcode: true,
  footerNote: "THANK YOU! Please come again", returnPolicy: "Returns accepted within 7 days with this receipt.",
  showWords: false, showTaxSummary: true,
});

const ReceiptGenerator = () => {
  const [r, setR] = useState<ReceiptState>(() => {
    try {
      const d = localStorage.getItem(DRAFT_KEY);
      if (d) return { ...blank(), ...JSON.parse(d) };
    } catch { /* ignore */ }
    return blank();
  });
  const [qr, setQr] = useState<string>();
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ReceiptState>(k: K, v: ReceiptState[K]) => setR((p) => ({ ...p, [k]: v }));

  const totals = useMemo(() => {
    const gross = r.items.reduce((s, i) => s + i.qty * i.price, 0);
    const lineDisc = r.items.reduce((s, i) => s + i.qty * i.price * ((i.discount || 0) / 100), 0);
    const net = gross - lineDisc;
    const globalDisc = r.discountType === "percentage" ? net * ((r.globalDiscount || 0) / 100) : (r.globalDiscount || 0);
    const taxable = Math.max(0, net - globalDisc);
    const factor = net > 0 ? taxable / net : 0;
    let tax = r.taxMode === "global"
      ? taxable * ((r.taxRate || 0) / 100)
      : r.items.reduce((s, i) => s + i.qty * i.price * (1 - (i.discount || 0) / 100) * factor * ((i.taxRate || 0) / 100), 0);
    const service = taxable * ((r.serviceChargeRate || 0) / 100);
    let total: number;
    if (r.taxInclusive) {
      const rate = (r.taxRate || 0) / 100;
      tax = r.taxMode === "global" ? taxable - taxable / (1 + rate) : tax;
      total = taxable + service + (r.tip || 0);
    } else {
      total = taxable + tax + service + (r.tip || 0);
    }
    const change = Math.max(0, (r.amountTendered || 0) - total);
    return { gross, lineDisc, globalDisc, taxable, tax, service, total, change };
  }, [r]);

  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(r)); } catch { /* quota */ } }, 500);
    return () => clearTimeout(t);
  }, [r]);

  useEffect(() => {
    const payload = r.qrValue || `Receipt ${r.receiptNo}\n${r.businessName}\n${r.date} ${r.time}\nTotal: ${formatMoney(totals.total, r.currency)}`;
    if (!r.showQr) { setQr(undefined); return; }
    let dead = false;
    QRCode.toDataURL(payload, { margin: 1, width: 240 }).then((u) => !dead && setQr(u)).catch(() => setQr(undefined));
    return () => { dead = true; };
  }, [r.showQr, r.qrValue, r.receiptNo, r.businessName, r.date, r.time, r.currency, totals.total]);

  const money = (v: number) => formatMoney(v, r.currency);
  const paper = PAPERS[r.paper];
  const thermal = r.paper === "58mm" || r.paper === "80mm";

  const addItem = () => setR((p) => ({ ...p, items: [...p.items, newItem()] }));
  const dupItem = (id: string) => setR((p) => {
    const i = p.items.findIndex((x) => x.id === id);
    const items = [...p.items];
    items.splice(i + 1, 0, { ...p.items[i], id: crypto.randomUUID() });
    return { ...p, items };
  });
  const updateItem = (id: string, k: keyof Item, v: string | number) =>
    setR((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, [k]: v } : i)) }));
  const removeItem = (id: string) => setR((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const saveStore = () => {
    const s = { businessName: r.businessName, tagline: r.tagline, address: r.address, phone: r.phone, email: r.email, taxId: r.taxId, logo: r.logo, currency: r.currency, taxLabel: r.taxLabel, taxRate: r.taxRate, footerNote: r.footerNote, returnPolicy: r.returnPolicy, accentColor: r.accentColor, paper: r.paper };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); toast.success("Store details saved for next time"); }
    catch { toast.error("Could not save store details"); }
  };

  const newReceipt = () => {
    let store = {};
    try { store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch { /* ignore */ }
    setR({ ...blank(), ...store, receiptNo: `R-${Date.now().toString().slice(-6)}` } as ReceiptState);
    toast.success("New receipt started");
  };

  const render = async () => {
    if (!previewRef.current) throw new Error("Preview missing");
    return html2canvas(previewRef.current, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false });
  };

  const downloadPDF = async () => {
    setBusy(true);
    const id = toast.loading("Building receipt PDF…");
    try {
      const canvas = await render();
      let pdf: jsPDF;
      let w: number;
      if (paper.pdf === "a4" || paper.pdf === "a5") {
        pdf = new jsPDF({ unit: "mm", format: paper.pdf, compress: true });
        w = paper.pdf === "a4" ? 210 : 148;
      } else {
        w = paper.pdf[0];
        const h = Math.max(paper.pdf[1], (canvas.height * w) / canvas.width);
        pdf = new jsPDF({ unit: "mm", format: [w, h], compress: true });
      }
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h, undefined, "FAST");
      pdf.save(`receipt-${r.receiptNo}.pdf`);
      toast.success("Receipt PDF downloaded", { id });
    } catch { toast.error("Could not create the PDF", { id }); }
    finally { setBusy(false); }
  };

  const downloadPNG = async () => {
    setBusy(true);
    try {
      const canvas = await render();
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `receipt-${r.receiptNo}.png`;
      a.click();
      toast.success("Receipt image downloaded");
    } catch { toast.error("Could not export the image"); }
    finally { setBusy(false); }
  };

  const printReceipt = () => {
    if (!previewRef.current) return;
    const w = window.open("", "_blank", "width=420,height=900");
    if (!w) return toast.error("Allow pop-ups to print");
    w.document.write(`<html><head><title>${r.receiptNo}</title><style>body{margin:0;display:flex;justify-content:center}</style></head><body>${previewRef.current.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 350);
  };

  const dash = thermal ? "1px dashed #9ca3af" : "1px solid #e5e7eb";
  const fs = paper.font;

  const Line = ({ l, v, bold }: { l: string; v: string; bold?: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: bold ? 700 : 400, fontSize: fs - 1, padding: "2px 0" }}>
      <span>{l}</span><span>{v}</span>
    </div>
  );

  return (
    <ToolPageTemplate
      title="Receipt Generator"
      description="Make thermal (58/80 mm) or A4/A5 receipts with your logo, tax, discounts, tip, change due and a QR code — download as PDF, PNG or print instantly."
      keywords="receipt generator, POS receipt maker, thermal receipt, cash receipt template, pdf receipt"
    >
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={newReceipt}><ReceiptIcon className="mr-2 h-4 w-4" />New</Button>
            <Button size="sm" variant="outline" onClick={saveStore}><Store className="mr-2 h-4 w-4" />Remember store</Button>
            <Separator orientation="vertical" className="h-6" />
            <Button size="sm" disabled={busy} onClick={downloadPDF}><Download className="mr-2 h-4 w-4" />PDF</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={downloadPNG}><ImageIcon className="mr-2 h-4 w-4" />PNG</Button>
            <Button size="sm" variant="outline" onClick={printReceipt}><Printer className="mr-2 h-4 w-4" />Print</Button>
            <div className="ml-auto text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{money(totals.total)}</span></div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details"><Store className="mr-1 h-4 w-4" />Store</TabsTrigger>
              <TabsTrigger value="items"><Plus className="mr-1 h-4 w-4" />Items</TabsTrigger>
              <TabsTrigger value="design"><Settings className="mr-1 h-4 w-4" />Options</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card className="p-5 space-y-3">
                <h3 className="font-semibold">Store details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Business name</Label><Input value={r.businessName} onChange={(e) => set("businessName", e.target.value)} /></div>
                  <div><Label>Tagline</Label><Input value={r.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
                </div>
                <div><Label>Address</Label><Input value={r.address} onChange={(e) => set("address", e.target.value)} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Phone</Label><Input value={r.phone} onChange={(e) => set("phone", e.target.value)} /></div>
                  <div><Label>Email</Label><Input value={r.email} onChange={(e) => set("email", e.target.value)} /></div>
                  <div><Label>Tax ID</Label><Input value={r.taxId} onChange={(e) => set("taxId", e.target.value)} /></div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => logoRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Logo</Button>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { const fr = new FileReader(); fr.onloadend = () => { set("logo", fr.result as string); toast.success("Logo added"); }; fr.readAsDataURL(f); }
                    e.target.value = "";
                  }} />
                  {r.logo && (<><img src={r.logo} alt="Store logo preview" className="h-8 rounded border bg-white p-1" /><Button variant="ghost" size="sm" onClick={() => set("logo", undefined)}>Remove</Button></>)}
                </div>
              </Card>

              <Card className="p-5 space-y-3">
                <h3 className="font-semibold">Transaction</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Receipt #</Label><Input value={r.receiptNo} onChange={(e) => set("receiptNo", e.target.value)} /></div>
                  <div><Label>Date</Label><Input type="date" value={r.date} onChange={(e) => set("date", e.target.value)} /></div>
                  <div><Label>Time</Label><Input type="time" value={r.time} onChange={(e) => set("time", e.target.value)} /></div>
                  <div><Label>Cashier</Label><Input value={r.cashier} onChange={(e) => set("cashier", e.target.value)} /></div>
                  <div><Label>Counter</Label><Input value={r.counter} onChange={(e) => set("counter", e.target.value)} /></div>
                  <div>
                    <Label>Payment</Label>
                    <Select value={r.paymentMethod} onValueChange={(v) => set("paymentMethod", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Cash", "Card", "UPI", "Bank Transfer", "Wallet", "Cheque", "Split"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Card last 4</Label><Input maxLength={4} value={r.cardLast4} onChange={(e) => set("cardLast4", e.target.value.replace(/\D/g, ""))} /></div>
                  <div><Label>Cash tendered</Label><Input type="number" min={0} step="0.01" value={r.amountTendered} onChange={(e) => set("amountTendered", +e.target.value)} /></div>
                  <div><Label>Tip</Label><Input type="number" min={0} step="0.01" value={r.tip} onChange={(e) => set("tip", +e.target.value)} /></div>
                  <div><Label>Customer</Label><Input value={r.customerName} onChange={(e) => set("customerName", e.target.value)} /></div>
                  <div><Label>Customer phone</Label><Input value={r.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} /></div>
                  <div><Label>Loyalty points</Label><Input type="number" min={0} value={r.loyaltyPoints} onChange={(e) => set("loyaltyPoints", +e.target.value)} /></div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="mt-4">
              <Card className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Items ({r.items.length})</h3>
                  <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" />Add</Button>
                </div>
                <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {r.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 items-end gap-2 rounded-lg border p-2">
                      <div className="col-span-5"><Label className="text-xs">Item</Label><Input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} /></div>
                      <div className="col-span-2"><Label className="text-xs">Qty</Label><Input type="number" min={0} value={item.qty} onChange={(e) => updateItem(item.id, "qty", +e.target.value)} /></div>
                      <div className="col-span-2"><Label className="text-xs">Price</Label><Input type="number" min={0} step="0.01" value={item.price} onChange={(e) => updateItem(item.id, "price", +e.target.value)} /></div>
                      <div className="col-span-1"><Label className="text-xs">%Off</Label><Input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateItem(item.id, "discount", +e.target.value)} /></div>
                      <div className="col-span-1">
                        <Label className="text-xs">Tax</Label>
                        <Input type="number" min={0} value={item.taxRate} disabled={r.taxMode === "global"} onChange={(e) => updateItem(item.id, "taxRate", +e.target.value)} />
                      </div>
                      <div className="col-span-1 flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => dupItem(item.id)}><Copy className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Discount on total</Label>
                    <div className="flex gap-2">
                      <Select value={r.discountType} onValueChange={(v) => set("discountType", v as ReceiptState["discountType"])}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="percentage">%</SelectItem><SelectItem value="fixed">Amt</SelectItem></SelectContent>
                      </Select>
                      <Input type="number" min={0} value={r.globalDiscount} onChange={(e) => set("globalDiscount", +e.target.value)} />
                    </div>
                  </div>
                  <div><Label>Service charge %</Label><Input type="number" min={0} value={r.serviceChargeRate} onChange={(e) => set("serviceChargeRate", +e.target.value)} /></div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="mt-4 space-y-4">
              <Card className="p-5 space-y-3">
                <h3 className="font-semibold">Paper, currency & tax</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Paper size</Label>
                    <Select value={r.paper} onValueChange={(v) => set("paper", v as PaperId)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{(Object.keys(PAPERS) as PaperId[]).map((k) => <SelectItem key={k} value={k}>{PAPERS[k].label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select value={r.currency} onValueChange={(v) => set("currency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-72">{CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tax label</Label><Input value={r.taxLabel} onChange={(e) => set("taxLabel", e.target.value)} /></div>
                  <div>
                    <Label>Tax mode</Label>
                    <Select value={r.taxMode} onValueChange={(v) => set("taxMode", v as ReceiptState["taxMode"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="global">Single rate</SelectItem><SelectItem value="per-item">Per item</SelectItem></SelectContent>
                    </Select>
                  </div>
                  {r.taxMode === "global" && <div><Label>Tax rate %</Label><Input type="number" min={0} value={r.taxRate} onChange={(e) => set("taxRate", +e.target.value)} /></div>}
                  <div>
                    <Label>Accent colour</Label>
                    <Input type="color" className="h-10 p-1" value={r.accentColor} onChange={(e) => set("accentColor", e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {([
                    ["taxInclusive", "Prices include tax"],
                    ["showQr", "Show QR code"],
                    ["showBarcode", "Show barcode strip"],
                    ["showTaxSummary", "Show tax summary"],
                    ["showWords", "Total in words"],
                  ] as [keyof ReceiptState, string][]).map(([key, label]) => (
                    <div key={String(key)} className="flex items-center justify-between rounded-lg border p-3">
                      <Label className="cursor-pointer">{label}</Label>
                      <Switch checked={Boolean(r[key])} onCheckedChange={(v) => set(key, v as never)} />
                    </div>
                  ))}
                </div>
                {r.showQr && <div><Label>QR content (leave blank for receipt summary)</Label><Input value={r.qrValue} onChange={(e) => set("qrValue", e.target.value)} placeholder="https://pay.me/store" /></div>}
                <div><Label>Footer message</Label><Input value={r.footerNote} onChange={(e) => set("footerNote", e.target.value)} /></div>
                <div><Label>Return policy</Label><Textarea rows={2} value={r.returnPolicy} onChange={(e) => set("returnPolicy", e.target.value)} /></div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* PREVIEW */}
          <Card className="flex items-start justify-center overflow-auto bg-muted/40 p-4">
            <div
              ref={previewRef}
              style={{
                width: paper.widthPx, background: "#ffffff", color: "#111827", padding: thermal ? 16 : 32,
                fontFamily: thermal ? "'Courier New', monospace" : "Helvetica, Arial, sans-serif",
                fontSize: fs, boxShadow: "0 4px 24px rgba(0,0,0,.12)",
              }}
            >
              <div style={{ textAlign: "center", borderBottom: dash, paddingBottom: 10, marginBottom: 10 }}>
                {r.logo && <img src={r.logo} alt="Store logo" style={{ maxHeight: 48, margin: "0 auto 6px", display: "block" }} />}
                <div style={{ fontWeight: 800, fontSize: fs + 4, textTransform: "uppercase", letterSpacing: 1, color: r.accentColor }}>{r.businessName}</div>
                {r.tagline && <div style={{ fontSize: fs - 2, color: "#6b7280" }}>{r.tagline}</div>}
                <div style={{ fontSize: fs - 2, marginTop: 4 }}>{r.address}</div>
                <div style={{ fontSize: fs - 2 }}>{[r.phone && `Tel: ${r.phone}`, r.email].filter(Boolean).join(" · ")}</div>
                {r.taxId && <div style={{ fontSize: fs - 2 }}>Tax ID: {r.taxId}</div>}
              </div>

              <div style={{ fontSize: fs - 2, marginBottom: 8 }}>
                <Line l="Receipt #" v={r.receiptNo} />
                <Line l="Date" v={`${r.date} ${r.time}`} />
                <Line l="Cashier" v={`${r.cashier} · Counter ${r.counter}`} />
                {r.customerName && <Line l="Customer" v={r.customerName} />}
                {r.customerPhone && <Line l="Phone" v={r.customerPhone} />}
              </div>

              <div style={{ borderTop: dash, borderBottom: dash, padding: "6px 0", marginBottom: 6, display: "flex", fontWeight: 700, fontSize: fs - 2 }}>
                <span style={{ flex: 2 }}>ITEM</span>
                <span style={{ flex: 0.6, textAlign: "center" }}>QTY</span>
                <span style={{ flex: 1, textAlign: "right" }}>PRICE</span>
                <span style={{ flex: 1, textAlign: "right" }}>AMT</span>
              </div>

              {r.items.map((i) => {
                const amt = i.qty * i.price * (1 - (i.discount || 0) / 100);
                return (
                  <div key={i.id} style={{ fontSize: fs - 2, padding: "2px 0" }}>
                    <div style={{ display: "flex" }}>
                      <span style={{ flex: 2, overflowWrap: "anywhere" }}>{i.name || "—"}</span>
                      <span style={{ flex: 0.6, textAlign: "center" }}>{i.qty}</span>
                      <span style={{ flex: 1, textAlign: "right" }}>{i.price.toFixed(2)}</span>
                      <span style={{ flex: 1, textAlign: "right" }}>{amt.toFixed(2)}</span>
                    </div>
                    {i.discount > 0 && <div style={{ fontSize: fs - 3, color: "#6b7280" }}>  discount {i.discount}%</div>}
                  </div>
                );
              })}

              <div style={{ borderTop: dash, marginTop: 8, paddingTop: 6 }}>
                <Line l="Subtotal" v={money(totals.gross)} />
                {totals.lineDisc > 0 && <Line l="Item discounts" v={`- ${money(totals.lineDisc)}`} />}
                {totals.globalDisc > 0 && <Line l="Discount" v={`- ${money(totals.globalDisc)}`} />}
                {r.showTaxSummary && <Line l={`${r.taxLabel}${r.taxMode === "global" ? ` ${r.taxRate}%` : ""}${r.taxInclusive ? " (incl.)" : ""}`} v={money(totals.tax)} />}
                {totals.service > 0 && <Line l={`Service ${r.serviceChargeRate}%`} v={money(totals.service)} />}
                {r.tip > 0 && <Line l="Tip" v={money(r.tip)} />}
                <div style={{ borderTop: dash, marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: fs + 2, color: r.accentColor }}>
                  <span>TOTAL</span><span>{money(totals.total)}</span>
                </div>
                <Line l={`Paid (${r.paymentMethod}${r.cardLast4 ? ` ****${r.cardLast4}` : ""})`} v={money(r.amountTendered || totals.total)} />
                {totals.change > 0 && <Line l="Change" v={money(totals.change)} bold />}
                {r.loyaltyPoints > 0 && <Line l="Loyalty points earned" v={String(r.loyaltyPoints)} />}
              </div>

              {r.showWords && (
                <div style={{ fontSize: fs - 3, marginTop: 8, textAlign: "center", color: "#374151" }}>
                  {amountInWords(totals.total, r.currency)}
                </div>
              )}

              <div style={{ textAlign: "center", borderTop: dash, marginTop: 10, paddingTop: 10 }}>
                {qr && <img src={qr} alt="Receipt QR code" style={{ width: 86, height: 86, margin: "0 auto 6px", display: "block" }} />}
                {r.showBarcode && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 1, height: 34, alignItems: "flex-end", marginBottom: 4 }}>
                    {Array.from(r.receiptNo.padEnd(14, "0")).map((ch, i) => (
                      <span key={`${ch}-${i}`} style={{ width: (ch.charCodeAt(0) % 3) + 1, height: 34, background: "#111827", display: "inline-block" }} />
                    ))}
                  </div>
                )}
                <div style={{ fontSize: fs - 3, letterSpacing: 1 }}>{r.receiptNo}</div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>{r.footerNote}</div>
                {r.returnPolicy && <div style={{ fontSize: fs - 3, color: "#6b7280", marginTop: 4 }}>{r.returnPolicy}</div>}
              </div>
            </div>
          </Card>
        </div>

        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" /> Everything stays in your browser — no receipt data is uploaded anywhere.
        </p>
      </div>
    </ToolPageTemplate>
  );
};

export default ReceiptGenerator;
