import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FileText, Plus, Trash2, Download, Save, Sparkles, Eye, Settings, Palette, Copy, Printer,
  Upload, Users, Building2, ListOrdered, FileJson, FileSpreadsheet, Image as ImageIcon, RotateCcw,
} from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import { CURRENCIES, formatMoney } from "@/lib/invoice/currencies";
import {
  Invoice, InvoiceItem, DocumentType, InvoiceStatus, TemplateId, computeTotals,
} from "@/lib/invoice/types";

const STORAGE_KEY = "klipza.invoices.v2";
const DRAFT_KEY = "klipza.invoice.draft.v2";
const CLIENTS_KEY = "klipza.invoice.clients.v2";
const PROFILE_KEY = "klipza.invoice.business.v2";

interface SavedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

const PRESETS: { id: TemplateId; name: string; primary: string; accent: string; font: string }[] = [
  { id: "modern", name: "Modern", primary: "#1e40af", accent: "#0ea5e9", font: "Helvetica, Arial, sans-serif" },
  { id: "classic", name: "Classic", primary: "#1f2937", accent: "#b45309", font: "Georgia, serif" },
  { id: "minimal", name: "Minimal", primary: "#111827", accent: "#6b7280", font: "Helvetica, Arial, sans-serif" },
  { id: "corporate", name: "Corporate", primary: "#0f172a", accent: "#2563eb", font: "Helvetica, Arial, sans-serif" },
  { id: "creative", name: "Creative", primary: "#7c3aed", accent: "#ec4899", font: "Helvetica, Arial, sans-serif" },
];

const newItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  details: "",
  quantity: 1,
  unit: "pcs",
  rate: 0,
  discount: 0,
  taxRate: 0,
});

const blankInvoice = (): Invoice => ({
  id: crypto.randomUUID(),
  documentType: "invoice",
  status: "unpaid",
  invoiceNumber: `INV-${new Date().getFullYear()}-0001`,
  poNumber: "",
  projectName: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  companyAddress: "",
  companyWebsite: "",
  companyTaxId: "",
  companyRegNumber: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientAddress: "",
  clientTaxId: "",
  shipToSame: true,
  shippingAddress: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankRoutingNumber: "",
  bankSwiftCode: "",
  paymentLink: "",
  showPaymentQr: true,
  items: [newItem()],
  currency: "USD",
  taxLabel: "Tax",
  taxMode: "global",
  globalTaxRate: 0,
  taxInclusive: false,
  discountType: "percentage",
  discountValue: 0,
  shipping: 0,
  amountPaid: 0,
  roundTotal: false,
  paymentTerms: "Payment due within 30 days of the invoice date.",
  notes: "",
  termsAndConditions: "",
  footerNote: "Thank you for your business!",
  showAmountInWords: true,
  showSignature: true,
  signatureName: "",
  theme: {
    primaryColor: "#1e40af",
    accentColor: "#0ea5e9",
    fontFamily: "Helvetica, Arial, sans-serif",
    template: "modern",
    showLines: true,
    compact: false,
  },
  updatedAt: new Date().toISOString(),
});

const nextNumber = (current: string) =>
  current.replace(/(\d+)(?!.*\d)/, (m) => String(Number(m) + 1).padStart(m.length, "0"));

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) return { ...blankInvoice(), ...JSON.parse(draft) } as Invoice;
    } catch { /* ignore corrupt draft */ }
    return blankInvoice();
  });
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => computeTotals(invoice), [invoice]);

  const set = useCallback(<K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
  }, []);

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      setSavedInvoices(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
      setClients(JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]"));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(invoice)); } catch { /* quota */ }
    }, 600);
    return () => clearTimeout(t);
  }, [invoice]);

  /* ---------- payment QR ---------- */
  useEffect(() => {
    const payload =
      invoice.paymentLink ||
      (invoice.bankAccountNumber
        ? `Pay ${formatMoney(totals.balance, invoice.currency)} to ${invoice.bankAccountName || invoice.companyName}\nBank: ${invoice.bankName}\nAccount: ${invoice.bankAccountNumber}\nRef: ${invoice.invoiceNumber}`
        : "");
    if (!invoice.showPaymentQr || !payload) {
      setQrDataUrl(undefined);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(payload, { margin: 1, width: 320, errorCorrectionLevel: "M" })
      .then((url) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => setQrDataUrl(undefined));
    return () => { cancelled = true; };
  }, [invoice.showPaymentQr, invoice.paymentLink, invoice.bankAccountNumber, invoice.bankName,
      invoice.bankAccountName, invoice.companyName, invoice.invoiceNumber, invoice.currency, totals.balance]);

  /* ---------- items ---------- */
  const addItem = () => setInvoice((p) => ({ ...p, items: [...p.items, newItem()] }));
  const duplicateItem = (id: string) =>
    setInvoice((p) => {
      const i = p.items.findIndex((x) => x.id === id);
      if (i < 0) return p;
      const copy = { ...p.items[i], id: crypto.randomUUID() };
      const items = [...p.items];
      items.splice(i + 1, 0, copy);
      return { ...p, items };
    });
  const moveItem = (id: string, dir: -1 | 1) =>
    setInvoice((p) => {
      const i = p.items.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.items.length) return p;
      const items = [...p.items];
      [items[i], items[j]] = [items[j], items[i]];
      return { ...p, items };
    });
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) =>
    setInvoice((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)) }));
  const deleteItem = (id: string) =>
    setInvoice((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  /* ---------- saving ---------- */
  const persist = (list: Invoice[]) => {
    setSavedInvoices(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    catch { toast.error("Browser storage is full — export as JSON instead."); }
  };

  const saveInvoice = () => {
    const stamped = { ...invoice, updatedAt: new Date().toISOString() };
    const list = [...savedInvoices];
    const idx = list.findIndex((i) => i.id === stamped.id);
    if (idx >= 0) list[idx] = stamped; else list.unshift(stamped);
    persist(list);
    setInvoice(stamped);
    toast.success("Invoice saved on this device");
  };

  const saveBusinessProfile = () => {
    const profile = {
      companyName: invoice.companyName, companyEmail: invoice.companyEmail, companyPhone: invoice.companyPhone,
      companyAddress: invoice.companyAddress, companyWebsite: invoice.companyWebsite,
      companyTaxId: invoice.companyTaxId, companyRegNumber: invoice.companyRegNumber,
      companyLogo: invoice.companyLogo, bankName: invoice.bankName, bankAccountName: invoice.bankAccountName,
      bankAccountNumber: invoice.bankAccountNumber, bankRoutingNumber: invoice.bankRoutingNumber,
      bankSwiftCode: invoice.bankSwiftCode, signatureName: invoice.signatureName, signatureImage: invoice.signatureImage,
    };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      toast.success("Business details saved — they will be reused on new invoices");
    } catch { toast.error("Could not save business details (storage full)"); }
  };

  const saveClient = () => {
    if (!invoice.clientName.trim()) return toast.error("Add a client name first");
    const entry: SavedClient = {
      id: crypto.randomUUID(), name: invoice.clientName, email: invoice.clientEmail,
      phone: invoice.clientPhone, address: invoice.clientAddress, taxId: invoice.clientTaxId,
    };
    const list = [entry, ...clients.filter((c) => c.name !== entry.name)].slice(0, 50);
    setClients(list);
    try { localStorage.setItem(CLIENTS_KEY, JSON.stringify(list)); } catch { /* ignore */ }
    toast.success("Client added to your address book");
  };

  const applyClient = (id: string) => {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    setInvoice((p) => ({ ...p, clientName: c.name, clientEmail: c.email, clientPhone: c.phone, clientAddress: c.address, clientTaxId: c.taxId }));
    toast.success(`Loaded ${c.name}`);
  };

  const newInvoice = (keepBusiness = true) => {
    const fresh = blankInvoice();
    let profile: Partial<Invoice> = {};
    try { profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch { /* ignore */ }
    setInvoice({
      ...fresh,
      ...(keepBusiness ? profile : {}),
      invoiceNumber: nextNumber(invoice.invoiceNumber || fresh.invoiceNumber),
      currency: invoice.currency,
      taxLabel: invoice.taxLabel,
      globalTaxRate: invoice.globalTaxRate,
      theme: invoice.theme,
    });
    toast.success("New invoice started");
  };

  const duplicateInvoice = () => {
    setInvoice((p) => ({ ...p, id: crypto.randomUUID(), invoiceNumber: nextNumber(p.invoiceNumber), status: "unpaid", amountPaid: 0, invoiceDate: new Date().toISOString().split("T")[0] }));
    toast.success("Invoice duplicated — numbering advanced");
  };

  /* ---------- uploads ---------- */
  const readImage = (file: File, onDone: (dataUrl: string) => void) => {
    if (file.size > 3 * 1024 * 1024) return toast.error("Please use an image under 3 MB");
    const reader = new FileReader();
    reader.onloadend = () => onDone(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------- export ---------- */
  const renderCanvas = async () => {
    const el = document.getElementById("invoice-preview");
    if (!el) throw new Error("Preview not ready");
    return html2canvas(el, { scale: 2.5, useCORS: true, logging: false, backgroundColor: "#ffffff", windowWidth: el.scrollWidth });
  };

  const downloadPDF = async () => {
    setBusy(true);
    const id = toast.loading("Building your PDF…");
    try {
      const canvas = await renderCanvas();
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
      const pw = 210;
      const ph = 297;
      const imgH = (canvas.height * pw) / canvas.width;
      const img = canvas.toDataURL("image/jpeg", 0.95);
      let remaining = imgH;
      let position = 0;
      pdf.addImage(img, "JPEG", 0, 0, pw, imgH, undefined, "FAST");
      remaining -= ph;
      while (remaining > 1) {
        position -= ph;
        pdf.addPage();
        pdf.addImage(img, "JPEG", 0, position, pw, imgH, undefined, "FAST");
        remaining -= ph;
      }
      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
      toast.success("PDF downloaded", { id });
    } catch (e) {
      console.error(e);
      toast.error("Could not build the PDF", { id });
    } finally { setBusy(false); }
  };

  const downloadPNG = async () => {
    setBusy(true);
    try {
      const canvas = await renderCanvas();
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${invoice.invoiceNumber || "invoice"}.png`;
      a.click();
      toast.success("PNG image downloaded");
    } catch { toast.error("Could not export the image"); }
    finally { setBusy(false); }
  };

  const printInvoice = () => {
    const el = document.getElementById("invoice-preview");
    if (!el) return toast.error("Open the Preview tab first");
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return toast.error("Allow pop-ups to print");
    w.document.write(`<html><head><title>${invoice.invoiceNumber}</title><style>@page{size:A4;margin:0}body{margin:0}</style></head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${invoice.invoiceNumber || "invoice"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Invoice data exported");
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        setInvoice({ ...blankInvoice(), ...data, id: data.id || crypto.randomUUID() });
        toast.success("Invoice imported");
      } catch { toast.error("That file is not a valid invoice export"); }
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    const rows = [
      ["Description", "Details", "Qty", "Unit", "Rate", "Discount %", "Tax %", "Amount"],
      ...invoice.items.map((i) => [
        i.description, i.details || "", i.quantity, i.unit, i.rate, i.discount, i.taxRate,
        ((i.quantity * i.rate) * (1 - i.discount / 100)).toFixed(2),
      ]),
      [], ["Subtotal", "", "", "", "", "", "", totals.subtotal.toFixed(2)],
      ["Tax", "", "", "", "", "", "", totals.totalTax.toFixed(2)],
      ["Total", "", "", "", "", "", "", totals.total.toFixed(2)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${invoice.invoiceNumber || "invoice"}-items.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Line items exported to CSV");
  };

  /* ---------- AI ---------- */
  const generateWithAI = async (type: "description" | "terms") => {
    setIsGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-invoice-helper", {
        body: { type, context: type === "description" ? invoice.items : invoice.companyName },
      });
      if (error) throw error;
      if (type === "description") {
        const last = invoice.items[invoice.items.length - 1];
        if (!last) { toast.error("Add an item row first"); return; }
        updateItem(last.id, "description", data.result);
        toast.success("Description generated");
      } else {
        set("paymentTerms", data.result);
        toast.success("Payment terms generated");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not generate right now");
    } finally { setIsGeneratingAI(false); }
  };

  const applyPreset = (id: TemplateId) => {
    const p = PRESETS.find((x) => x.id === id)!;
    setInvoice((prev) => ({
      ...prev,
      theme: { ...prev.theme, template: p.id, primaryColor: p.primary, accentColor: p.accent, fontFamily: p.font },
    }));
  };

  const money = (v: number) => formatMoney(v, invoice.currency);

  return (
    <ToolPageTemplate
      title="Invoice Generator"
      description="Create professional invoices, quotes and receipts with 5 templates, 40 currencies, tax, discounts and instant PDF download — free and private."
      keywords="invoice generator, free invoice maker, online invoice, quotation generator, pdf invoice"
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => newInvoice()} variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" />New</Button>
            <Button onClick={duplicateInvoice} variant="outline" size="sm"><Copy className="mr-2 h-4 w-4" />Duplicate</Button>
            <Button onClick={saveInvoice} size="sm"><Save className="mr-2 h-4 w-4" />Save</Button>
            <Separator orientation="vertical" className="h-6" />
            <Button onClick={downloadPDF} disabled={busy} size="sm" variant="secondary"><Download className="mr-2 h-4 w-4" />PDF</Button>
            <Button onClick={downloadPNG} disabled={busy} size="sm" variant="outline"><ImageIcon className="mr-2 h-4 w-4" />PNG</Button>
            <Button onClick={printInvoice} size="sm" variant="outline"><Printer className="mr-2 h-4 w-4" />Print</Button>
            <Separator orientation="vertical" className="h-6" />
            <Button onClick={exportJSON} size="sm" variant="ghost"><FileJson className="mr-2 h-4 w-4" />Export data</Button>
            <Button onClick={() => jsonInputRef.current?.click()} size="sm" variant="ghost"><Upload className="mr-2 h-4 w-4" />Import</Button>
            <Button onClick={exportCSV} size="sm" variant="ghost"><FileSpreadsheet className="mr-2 h-4 w-4" />CSV</Button>
            <input ref={jsonInputRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) importJSON(f); e.target.value = ""; }} />
            <div className="ml-auto text-sm text-muted-foreground">
              Balance due: <span className="font-semibold text-foreground">{money(totals.balance)}</span>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="business"><Building2 className="mr-1 h-4 w-4" />Business</TabsTrigger>
            <TabsTrigger value="client"><Users className="mr-1 h-4 w-4" />Client</TabsTrigger>
            <TabsTrigger value="items"><ListOrdered className="mr-1 h-4 w-4" />Items</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-1 h-4 w-4" />Totals</TabsTrigger>
            <TabsTrigger value="design"><Palette className="mr-1 h-4 w-4" />Design</TabsTrigger>
            <TabsTrigger value="preview"><Eye className="mr-1 h-4 w-4" />Preview</TabsTrigger>
          </TabsList>

          {/* BUSINESS */}
          <TabsContent value="business" className="mt-6 space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your business</h3>
                <Button variant="outline" size="sm" onClick={saveBusinessProfile}><Save className="mr-2 h-4 w-4" />Remember details</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Company name</Label><Input value={invoice.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Acme Studio Ltd" /></div>
                <div><Label>Email</Label><Input value={invoice.companyEmail} onChange={(e) => set("companyEmail", e.target.value)} placeholder="billing@acme.com" /></div>
                <div><Label>Phone</Label><Input value={invoice.companyPhone} onChange={(e) => set("companyPhone", e.target.value)} /></div>
                <div><Label>Website</Label><Input value={invoice.companyWebsite} onChange={(e) => set("companyWebsite", e.target.value)} /></div>
                <div className="md:col-span-2"><Label>Address</Label><Textarea rows={2} value={invoice.companyAddress} onChange={(e) => set("companyAddress", e.target.value)} /></div>
                <div><Label>Tax / VAT ID</Label><Input value={invoice.companyTaxId} onChange={(e) => set("companyTaxId", e.target.value)} /></div>
                <div><Label>Registration number</Label><Input value={invoice.companyRegNumber} onChange={(e) => set("companyRegNumber", e.target.value)} /></div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload logo</Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) readImage(f, (d) => { set("companyLogo", d); toast.success("Logo added"); }); e.target.value = ""; }} />
                {invoice.companyLogo && (
                  <>
                    <img src={invoice.companyLogo} alt="Logo preview" className="h-10 w-auto rounded border bg-white p-1" />
                    <Button variant="ghost" size="sm" onClick={() => set("companyLogo", undefined)}><Trash2 className="mr-1 h-4 w-4" />Remove</Button>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Payment details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Account holder</Label><Input value={invoice.bankAccountName} onChange={(e) => set("bankAccountName", e.target.value)} /></div>
                <div><Label>Bank name</Label><Input value={invoice.bankName} onChange={(e) => set("bankName", e.target.value)} /></div>
                <div><Label>Account number / IBAN</Label><Input value={invoice.bankAccountNumber} onChange={(e) => set("bankAccountNumber", e.target.value)} /></div>
                <div><Label>Routing / Sort code</Label><Input value={invoice.bankRoutingNumber} onChange={(e) => set("bankRoutingNumber", e.target.value)} /></div>
                <div><Label>SWIFT / BIC</Label><Input value={invoice.bankSwiftCode} onChange={(e) => set("bankSwiftCode", e.target.value)} /></div>
                <div><Label>Online payment link</Label><Input value={invoice.paymentLink} onChange={(e) => set("paymentLink", e.target.value)} placeholder="https://pay.me/acme/inv-1001" /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="cursor-pointer">Show a scannable payment QR code</Label>
                  <p className="text-xs text-muted-foreground">Uses your payment link, or your bank details as a fallback.</p>
                </div>
                <Switch checked={invoice.showPaymentQr} onCheckedChange={(v) => set("showPaymentQr", v)} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => sigInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Upload signature</Button>
                <input ref={sigInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) readImage(f, (d) => { set("signatureImage", d); toast.success("Signature added"); }); e.target.value = ""; }} />
                {invoice.signatureImage && <img src={invoice.signatureImage} alt="Signature preview" className="h-10 rounded border bg-white p-1" />}
                <Input className="max-w-xs" placeholder="Name under signature" value={invoice.signatureName} onChange={(e) => set("signatureName", e.target.value)} />
              </div>
            </Card>
          </TabsContent>

          {/* CLIENT */}
          <TabsContent value="client" className="mt-6 space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Bill to</h3>
                <div className="flex gap-2">
                  {clients.length > 0 && (
                    <Select onValueChange={applyClient}>
                      <SelectTrigger className="w-56"><SelectValue placeholder="Load saved client" /></SelectTrigger>
                      <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  <Button variant="outline" size="sm" onClick={saveClient}><Save className="mr-2 h-4 w-4" />Save client</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Client name</Label><Input value={invoice.clientName} onChange={(e) => set("clientName", e.target.value)} /></div>
                <div><Label>Email</Label><Input value={invoice.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={invoice.clientPhone} onChange={(e) => set("clientPhone", e.target.value)} /></div>
                <div><Label>Tax / VAT ID</Label><Input value={invoice.clientTaxId} onChange={(e) => set("clientTaxId", e.target.value)} /></div>
                <div className="md:col-span-2"><Label>Billing address</Label><Textarea rows={2} value={invoice.clientAddress} onChange={(e) => set("clientAddress", e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label className="cursor-pointer">Shipping address is the same as billing</Label>
                <Switch checked={invoice.shipToSame} onCheckedChange={(v) => set("shipToSame", v)} />
              </div>
              {!invoice.shipToSame && (
                <div><Label>Shipping address</Label><Textarea rows={2} value={invoice.shippingAddress} onChange={(e) => set("shippingAddress", e.target.value)} /></div>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Document details</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Document type</Label>
                  <Select value={invoice.documentType} onValueChange={(v) => set("documentType", v as DocumentType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="quote">Quotation / Estimate</SelectItem>
                      <SelectItem value="proforma">Proforma invoice</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="credit-note">Credit note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status stamp</Label>
                  <Select value={invoice.status} onValueChange={(v) => set("status", v as InvoiceStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">No stamp</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partially paid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Number</Label><Input value={invoice.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} /></div>
                <div><Label>Issue date</Label><Input type="date" value={invoice.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} /></div>
                <div><Label>Due date</Label><Input type="date" value={invoice.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></div>
                <div><Label>PO number</Label><Input value={invoice.poNumber} onChange={(e) => set("poNumber", e.target.value)} /></div>
                <div className="md:col-span-3"><Label>Project / reference</Label><Input value={invoice.projectName} onChange={(e) => set("projectName", e.target.value)} /></div>
              </div>
            </Card>
          </TabsContent>

          {/* ITEMS */}
          <TabsContent value="items" className="mt-6">
            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Line items</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={isGeneratingAI} onClick={() => generateWithAI("description")}>
                    <Sparkles className="mr-2 h-4 w-4" />{isGeneratingAI ? "Generating…" : "Generate description"}
                  </Button>
                  <Button size="sm" onClick={addItem}><Plus className="mr-2 h-4 w-4" />Add item</Button>
                </div>
              </div>

              <div className="space-y-3">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="rounded-lg border p-3 space-y-2">
                    <div className="grid gap-2 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <Label className="text-xs">Description</Label>
                        <Input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Website design — homepage" />
                      </div>
                      <div className="md:col-span-1"><Label className="text-xs">Qty</Label><Input type="number" min={0} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", +e.target.value)} /></div>
                      <div className="md:col-span-1"><Label className="text-xs">Unit</Label><Input value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} /></div>
                      <div className="md:col-span-2"><Label className="text-xs">Rate</Label><Input type="number" min={0} step="0.01" value={item.rate} onChange={(e) => updateItem(item.id, "rate", +e.target.value)} /></div>
                      <div className="md:col-span-1"><Label className="text-xs">Disc %</Label><Input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateItem(item.id, "discount", +e.target.value)} /></div>
                      <div className="md:col-span-1"><Label className="text-xs">Tax %</Label><Input type="number" min={0} value={item.taxRate} onChange={(e) => updateItem(item.id, "taxRate", +e.target.value)} disabled={invoice.taxMode === "global"} /></div>
                      <div className="md:col-span-1 flex items-end justify-end text-sm font-semibold">
                        {money(item.quantity * item.rate * (1 - (item.discount || 0) / 100))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input className="flex-1 min-w-[200px]" placeholder="Optional extra details shown under the description"
                        value={item.details || ""} onChange={(e) => updateItem(item.id, "details", e.target.value)} />
                      <Button variant="ghost" size="sm" onClick={() => moveItem(item.id, -1)} disabled={idx === 0}>↑</Button>
                      <Button variant="ghost" size="sm" onClick={() => moveItem(item.id, 1)} disabled={idx === invoice.items.length - 1}>↓</Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateItem(item.id)}><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                {invoice.items.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No items yet — add your first line.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* TOTALS */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Currency, tax & totals</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Currency</Label>
                  <Select value={invoice.currency} onValueChange={(v) => set("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Tax label</Label><Input value={invoice.taxLabel} onChange={(e) => set("taxLabel", e.target.value)} placeholder="VAT / GST / Sales Tax" /></div>
                <div>
                  <Label>Tax mode</Label>
                  <Select value={invoice.taxMode} onValueChange={(v) => set("taxMode", v as Invoice["taxMode"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">One rate for the whole invoice</SelectItem>
                      <SelectItem value="per-item">Different rate per item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {invoice.taxMode === "global" && (
                  <div><Label>Tax rate %</Label><Input type="number" min={0} value={invoice.globalTaxRate} onChange={(e) => set("globalTaxRate", +e.target.value)} /></div>
                )}
                <div>
                  <Label>Invoice discount</Label>
                  <div className="flex gap-2">
                    <Select value={invoice.discountType} onValueChange={(v) => set("discountType", v as Invoice["discountType"])}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="percentage">%</SelectItem><SelectItem value="fixed">Amount</SelectItem></SelectContent>
                    </Select>
                    <Input type="number" min={0} value={invoice.discountValue} onChange={(e) => set("discountValue", +e.target.value)} />
                  </div>
                </div>
                <div><Label>Shipping / extra charge</Label><Input type="number" min={0} step="0.01" value={invoice.shipping} onChange={(e) => set("shipping", +e.target.value)} /></div>
                <div><Label>Amount already paid</Label><Input type="number" min={0} step="0.01" value={invoice.amountPaid} onChange={(e) => set("amountPaid", +e.target.value)} /></div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="cursor-pointer">Prices include tax</Label>
                  <Switch checked={invoice.taxInclusive} onCheckedChange={(v) => set("taxInclusive", v)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="cursor-pointer">Round total</Label>
                  <Switch checked={invoice.roundTotal} onCheckedChange={(v) => set("roundTotal", v)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="cursor-pointer">Amount in words</Label>
                  <Switch checked={invoice.showAmountInWords} onCheckedChange={(v) => set("showAmountInWords", v)} />
                </div>
              </div>

              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <div className="flex justify-between py-1"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
                {totals.lineDiscounts > 0 && <div className="flex justify-between py-1"><span>Item discounts</span><span>− {money(totals.lineDiscounts)}</span></div>}
                {totals.invoiceDiscount > 0 && <div className="flex justify-between py-1"><span>Invoice discount</span><span>− {money(totals.invoiceDiscount)}</span></div>}
                <div className="flex justify-between py-1"><span>{invoice.taxLabel}</span><span>{money(totals.totalTax)}</span></div>
                {totals.shipping > 0 && <div className="flex justify-between py-1"><span>Shipping</span><span>{money(totals.shipping)}</span></div>}
                <Separator className="my-2" />
                <div className="flex justify-between py-1 font-semibold"><span>Total</span><span>{money(totals.total)}</span></div>
                <div className="flex justify-between py-1 font-semibold text-primary"><span>Balance due</span><span>{money(totals.balance)}</span></div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Terms & notes</h3>
                <Button variant="outline" size="sm" disabled={isGeneratingAI} onClick={() => generateWithAI("terms")}>
                  <Sparkles className="mr-2 h-4 w-4" />{isGeneratingAI ? "Generating…" : "Generate terms"}
                </Button>
              </div>
              <div><Label>Payment terms</Label><Textarea rows={2} value={invoice.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} /></div>
              <div><Label>Notes to client</Label><Textarea rows={2} value={invoice.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              <div><Label>Terms & conditions</Label><Textarea rows={3} value={invoice.termsAndConditions} onChange={(e) => set("termsAndConditions", e.target.value)} /></div>
              <div><Label>Footer line</Label><Input value={invoice.footerNote} onChange={(e) => set("footerNote", e.target.value)} /></div>
            </Card>
          </TabsContent>

          {/* DESIGN */}
          <TabsContent value="design" className="mt-6 space-y-6">
            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold">Template</h3>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className={`rounded-lg border p-3 text-left transition-all hover:shadow-md ${invoice.theme.template === p.id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
                  >
                    <div className="mb-2 h-12 rounded" style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.accent})` }} />
                    <div className="text-sm font-medium">{p.name}</div>
                  </button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Primary colour</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="h-10 w-16 p-1" value={invoice.theme.primaryColor} onChange={(e) => setInvoice((p) => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }))} />
                    <Input value={invoice.theme.primaryColor} onChange={(e) => setInvoice((p) => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }))} />
                  </div>
                </div>
                <div>
                  <Label>Accent colour</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="h-10 w-16 p-1" value={invoice.theme.accentColor} onChange={(e) => setInvoice((p) => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }))} />
                    <Input value={invoice.theme.accentColor} onChange={(e) => setInvoice((p) => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }))} />
                  </div>
                </div>
                <div>
                  <Label>Font</Label>
                  <Select value={invoice.theme.fontFamily} onValueChange={(v) => setInvoice((p) => ({ ...p, theme: { ...p.theme, fontFamily: v } }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helvetica, Arial, sans-serif">Helvetica / Arial</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label className="cursor-pointer">Striped table rows</Label>
                    <Switch checked={invoice.theme.showLines} onCheckedChange={(v) => setInvoice((p) => ({ ...p, theme: { ...p.theme, showLines: v } }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label className="cursor-pointer">Compact spacing</Label>
                    <Switch checked={invoice.theme.compact} onCheckedChange={(v) => setInvoice((p) => ({ ...p, theme: { ...p.theme, compact: v } }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label className="cursor-pointer">Show signature block</Label>
                    <Switch checked={invoice.showSignature} onCheckedChange={(v) => set("showSignature", v)} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Saved invoices ({savedInvoices.length})</h3>
                  <p className="text-sm text-muted-foreground">Stored only in this browser — nothing is uploaded.</p>
                </div>
                {savedInvoices.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => { persist([]); toast.success("Saved list cleared"); }}>
                    <RotateCcw className="mr-2 h-4 w-4" />Clear all
                  </Button>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {savedInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <div className="font-medium">{inv.invoiceNumber} · {inv.clientName || "No client"}</div>
                      <div className="text-xs text-muted-foreground">
                        {inv.invoiceDate} · {formatMoney(computeTotals(inv).total, inv.currency)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setInvoice(inv); toast.success("Invoice loaded"); }}>Open</Button>
                      <Button size="sm" variant="ghost" onClick={() => persist(savedInvoices.filter((i) => i.id !== inv.id))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {savedInvoices.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nothing saved yet.</p>}
              </div>
            </Card>
          </TabsContent>

          {/* PREVIEW */}
          <TabsContent value="preview" className="mt-6">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={downloadPDF} disabled={busy} size="lg"><Download className="mr-2 h-5 w-5" />Download PDF</Button>
                <Button onClick={printInvoice} variant="outline" size="lg"><Printer className="mr-2 h-5 w-5" />Print</Button>
              </div>
              <div className="overflow-x-auto rounded-xl bg-muted/40 p-4">
                <div className="mx-auto w-fit shadow-2xl">
                  <InvoiceDocument invoice={invoice} totals={totals} qrDataUrl={qrDataUrl} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Off-screen render target so PDF/PNG export works from any tab */}
        {activeTab !== "preview" && (
          <div aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}>
            <InvoiceDocument invoice={invoice} totals={totals} qrDataUrl={qrDataUrl} />
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default InvoiceGenerator;
