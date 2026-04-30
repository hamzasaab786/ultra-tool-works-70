import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Download, Receipt as ReceiptIcon } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Item { id: string; name: string; qty: number; price: number; }

const CURRENCIES = [
  { code: "USD", symbol: "$" }, { code: "EUR", symbol: "€" }, { code: "GBP", symbol: "£" },
  { code: "PKR", symbol: "₨" }, { code: "INR", symbol: "₹" }, { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" }, { code: "CAD", symbol: "C$" }, { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" }, { code: "CNY", symbol: "¥" },
];

const ReceiptGenerator = () => {
  const [businessName, setBusinessName] = useState("My Store");
  const [address, setAddress] = useState("123 Main Street, City");
  const [phone, setPhone] = useState("+1 555 0100");
  const [receiptNo, setReceiptNo] = useState(`R-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cashier, setCashier] = useState("Staff");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Item 1", qty: 1, price: 10 },
  ]);
  const previewRef = useRef<HTMLDivElement>(null);

  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: "", qty: 1, price: 0 }]);
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, key: keyof Item, val: any) =>
    setItems(items.map(i => i.id === id ? { ...i, [key]: val } : i));

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 3, backgroundColor: "#fff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: [80, 200] });
      const w = 80;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`receipt-${receiptNo}.pdf`);
      toast.success("Receipt downloaded");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <ToolPageTemplate title="Receipt Generator" description="Create professional thermal-style receipts and download as PDF" keywords="receipt generator, POS receipt, thermal receipt, PDF receipt">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><ReceiptIcon className="w-5 h-5" />Receipt Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Business Name</Label><Input value={businessName} onChange={e => setBusinessName(e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          </div>
          <div><Label>Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Receipt #</Label><Input value={receiptNo} onChange={e => setReceiptNo(e.target.value)} /></div>
            <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div><Label>Cashier</Label><Input value={cashier} onChange={e => setCashier(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Cash", "Card", "UPI", "Bank Transfer", "Wallet"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Tax %</Label><Input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} /></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Items</Label>
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-6" placeholder="Item" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(item.id, "qty", +e.target.value)} />
                  <Input className="col-span-3" type="number" placeholder="Price" value={item.price} onChange={e => updateItem(item.id, "price", +e.target.value)} />
                  <Button size="icon" variant="ghost" className="col-span-1" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={downloadPDF} className="w-full" size="lg"><Download className="w-4 h-4 mr-2" />Download PDF Receipt</Button>
        </Card>

        <Card className="p-4 bg-gray-100 flex items-start justify-center">
          <div ref={previewRef} className="bg-white p-5 w-[300px] font-mono text-xs shadow-lg" style={{ fontFamily: "monospace" }}>
            <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
              <div className="font-bold text-base uppercase tracking-wide">{businessName}</div>
              <div className="text-[10px] mt-1">{address}</div>
              <div className="text-[10px]">Tel: {phone}</div>
            </div>
            <div className="text-[10px] mb-2">
              <div className="flex justify-between"><span>Receipt #:</span><span>{receiptNo}</span></div>
              <div className="flex justify-between"><span>Date:</span><span>{date}</span></div>
              <div className="flex justify-between"><span>Cashier:</span><span>{cashier}</span></div>
            </div>
            <div className="border-t border-b border-dashed border-gray-400 py-2 my-2">
              <div className="flex justify-between font-bold text-[10px]">
                <span className="w-1/2">ITEM</span><span className="w-1/6 text-center">QTY</span><span className="w-1/6 text-right">PRICE</span><span className="w-1/6 text-right">AMT</span>
              </div>
            </div>
            <div className="space-y-1">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-[10px]">
                  <span className="w-1/2 truncate">{i.name || "—"}</span>
                  <span className="w-1/6 text-center">{i.qty}</span>
                  <span className="w-1/6 text-right">{i.price.toFixed(2)}</span>
                  <span className="w-1/6 text-right">{(i.qty * i.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-400 mt-3 pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between"><span>Subtotal:</span><span>{symbol}{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax ({taxRate}%):</span><span>{symbol}{tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-sm border-t border-dashed border-gray-400 pt-1 mt-1">
                <span>TOTAL:</span><span>{symbol}{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-center mt-3 pt-3 border-t border-dashed border-gray-400 text-[10px]">
              <div>Payment: {paymentMethod}</div>
              <div className="mt-2 font-bold">THANK YOU!</div>
              <div className="mt-1 text-[9px]">Please come again</div>
            </div>
          </div>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ReceiptGenerator;
