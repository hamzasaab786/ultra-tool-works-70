import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Download, Save, FolderOpen, Sparkles, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  currency: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  paymentTerms: string;
  notes: string;
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
}

const InvoiceGenerator = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    id: crypto.randomUUID(),
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    items: [],
    currency: "USD",
    discountType: "percentage",
    discountValue: 0,
    paymentTerms: "",
    notes: "",
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    total: 0,
  });

  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    loadSavedInvoices();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.discountType, invoice.discountValue]);

  const loadSavedInvoices = () => {
    const saved = localStorage.getItem("invoices");
    if (saved) {
      setSavedInvoices(JSON.parse(saved));
    }
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = invoice.items.reduce((sum, item) => sum + (item.amount * item.taxRate / 100), 0);
    
    let totalDiscount = 0;
    if (invoice.discountType === "percentage") {
      totalDiscount = subtotal * (invoice.discountValue / 100);
    } else {
      totalDiscount = invoice.discountValue;
    }

    const total = subtotal + totalTax - totalDiscount;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      totalTax,
      totalDiscount,
      total: Math.max(0, total),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 0,
      amount: 0,
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount = updated.quantity * updated.rate;
          return updated;
        }
        return item;
      }),
    }));
  };

  const deleteItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const saveInvoice = () => {
    const invoices = [...savedInvoices];
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex !== -1) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    
    localStorage.setItem("invoices", JSON.stringify(invoices));
    setSavedInvoices(invoices);
    toast.success("Invoice saved successfully!");
  };

  const loadInvoice = (savedInvoice: Invoice) => {
    setInvoice(savedInvoice);
    toast.success("Invoice loaded successfully!");
  };

  const deleteInvoice = (id: string) => {
    const invoices = savedInvoices.filter(inv => inv.id !== id);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    setSavedInvoices(invoices);
    toast.success("Invoice deleted successfully!");
  };

  const generateWithAI = async (type: "description" | "terms") => {
    setIsGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-invoice-helper", {
        body: { 
          type,
          context: type === "description" ? invoice.items : invoice.companyName,
        },
      });

      if (error) throw error;

      if (type === "description" && invoice.items.length > 0) {
        const lastItem = invoice.items[invoice.items.length - 1];
        updateItem(lastItem.id, "description", data.result);
        toast.success("AI generated description added!");
      } else if (type === "terms") {
        setInvoice(prev => ({ ...prev, paymentTerms: data.result }));
        toast.success("AI generated payment terms added!");
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "Failed to generate with AI");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoice(prev => ({ ...prev, companyLogo: reader.result as string }));
        toast.success("Logo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let yPos = 20;

    // Company Logo
    if (invoice.companyLogo) {
      pdf.addImage(invoice.companyLogo, "PNG", 20, yPos, 30, 30);
      yPos += 35;
    }

    // Title
    pdf.setFontSize(24);
    pdf.text("INVOICE", 20, yPos);
    yPos += 15;

    // Invoice Details
    pdf.setFontSize(10);
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 20, yPos);
    pdf.text(`Date: ${invoice.invoiceDate}`, 120, yPos);
    yPos += 7;
    pdf.text(`Due Date: ${invoice.dueDate}`, 120, yPos);
    yPos += 15;

    // Company Info
    pdf.setFontSize(12);
    pdf.text("From:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    pdf.text(invoice.companyName, 20, yPos);
    yPos += 5;
    pdf.text(invoice.companyEmail, 20, yPos);
    yPos += 5;
    pdf.text(invoice.companyPhone, 20, yPos);
    yPos += 5;
    const companyAddressLines = pdf.splitTextToSize(invoice.companyAddress, 80);
    pdf.text(companyAddressLines, 20, yPos);
    yPos += companyAddressLines.length * 5 + 10;

    // Client Info
    pdf.setFontSize(12);
    pdf.text("Bill To:", 20, yPos);
    yPos += 7;
    pdf.setFontSize(10);
    pdf.text(invoice.clientName, 20, yPos);
    yPos += 5;
    pdf.text(invoice.clientEmail, 20, yPos);
    yPos += 5;
    pdf.text(invoice.clientPhone, 20, yPos);
    yPos += 5;
    const clientAddressLines = pdf.splitTextToSize(invoice.clientAddress, 80);
    pdf.text(clientAddressLines, 20, yPos);
    yPos += clientAddressLines.length * 5 + 10;

    // Items Table Header
    pdf.setFontSize(10);
    pdf.text("Description", 20, yPos);
    pdf.text("Qty", 110, yPos);
    pdf.text("Rate", 130, yPos);
    pdf.text("Tax%", 150, yPos);
    pdf.text("Amount", 170, yPos);
    yPos += 7;
    pdf.line(20, yPos, 190, yPos);
    yPos += 7;

    // Items
    invoice.items.forEach(item => {
      const descLines = pdf.splitTextToSize(item.description, 85);
      pdf.text(descLines, 20, yPos);
      pdf.text(item.quantity.toString(), 110, yPos);
      pdf.text(`${invoice.currency} ${item.rate.toFixed(2)}`, 130, yPos);
      pdf.text(`${item.taxRate}%`, 150, yPos);
      pdf.text(`${invoice.currency} ${item.amount.toFixed(2)}`, 170, yPos);
      yPos += Math.max(descLines.length * 5, 7) + 5;
    });

    yPos += 5;
    pdf.line(20, yPos, 190, yPos);
    yPos += 10;

    // Totals
    pdf.text(`Subtotal:`, 130, yPos);
    pdf.text(`${invoice.currency} ${invoice.subtotal.toFixed(2)}`, 170, yPos);
    yPos += 7;
    pdf.text(`Tax:`, 130, yPos);
    pdf.text(`${invoice.currency} ${invoice.totalTax.toFixed(2)}`, 170, yPos);
    yPos += 7;
    pdf.text(`Discount:`, 130, yPos);
    pdf.text(`${invoice.currency} ${invoice.totalDiscount.toFixed(2)}`, 170, yPos);
    yPos += 7;
    pdf.setFontSize(12);
    pdf.text(`Total:`, 130, yPos);
    pdf.text(`${invoice.currency} ${invoice.total.toFixed(2)}`, 170, yPos);
    yPos += 15;

    // Payment Terms
    if (invoice.paymentTerms) {
      pdf.setFontSize(10);
      pdf.text("Payment Terms:", 20, yPos);
      yPos += 7;
      const termsLines = pdf.splitTextToSize(invoice.paymentTerms, 170);
      pdf.text(termsLines, 20, yPos);
      yPos += termsLines.length * 5 + 10;
    }

    // Notes
    if (invoice.notes) {
      pdf.text("Notes:", 20, yPos);
      yPos += 7;
      const notesLines = pdf.splitTextToSize(invoice.notes, 170);
      pdf.text(notesLines, 20, yPos);
    }

    pdf.save(`${invoice.invoiceNumber}.pdf`);
    toast.success("Invoice downloaded as PDF!");
  };

  const createNewInvoice = () => {
    setInvoice({
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyAddress: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      items: [],
      currency: "USD",
      discountType: "percentage",
      discountValue: 0,
      paymentTerms: "",
      notes: "",
      subtotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      total: 0,
    });
    toast.success("New invoice created!");
  };

  return (
    <ToolPageTemplate
      title="AI Invoice Generator"
      description="Generate professional invoices with AI-powered features, customizable templates, and automatic calculations"
      keywords="invoice generator, ai invoice, billing, professional invoice"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={createNewInvoice} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
          <Button onClick={saveInvoice}>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
          <Button onClick={downloadPDF} variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Saved Invoices */}
        {savedInvoices.length > 0 && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Saved Invoices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedInvoices.map((inv) => (
                <Card key={inv.id} className="p-3 hover:bg-accent cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div onClick={() => loadInvoice(inv)} className="flex-1">
                      <p className="font-semibold">{inv.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{inv.clientName}</p>
                      <p className="text-sm">{inv.currency} {inv.total.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteInvoice(inv.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Invoice Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            
            <div>
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4 mt-2">
                {invoice.companyLogo && (
                  <img src={invoice.companyLogo} alt="Logo" className="h-16 w-16 object-contain" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Company Name</Label>
              <Input
                value={invoice.companyName}
                onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={invoice.companyEmail}
                onChange={(e) => setInvoice({ ...invoice, companyEmail: e.target.value })}
                placeholder="company@example.com"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={invoice.companyPhone}
                onChange={(e) => setInvoice({ ...invoice, companyPhone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                value={invoice.companyAddress}
                onChange={(e) => setInvoice({ ...invoice, companyAddress: e.target.value })}
                placeholder="Street Address, City, State, ZIP"
                rows={3}
              />
            </div>
          </Card>

          {/* Client Information */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Bill To</h3>
            
            <div>
              <Label>Client Name</Label>
              <Input
                value={invoice.clientName}
                onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                placeholder="Client Name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={invoice.clientEmail}
                onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })}
                placeholder="client@example.com"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={invoice.clientPhone}
                onChange={(e) => setInvoice({ ...invoice, clientPhone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <Label>Address</Label>
              <Textarea
                value={invoice.clientAddress}
                onChange={(e) => setInvoice({ ...invoice, clientAddress: e.target.value })}
                placeholder="Street Address, City, State, ZIP"
                rows={3}
              />
            </div>
          </Card>
        </div>

        {/* Invoice Details */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Invoice Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              />
            </div>

            <div>
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                value={invoice.currency}
                onValueChange={(value) => setInvoice({ ...invoice, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Items</h3>
            <Button onClick={addItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <Label>Description</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        rows={2}
                      />
                      {index === invoice.items.length - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => generateWithAI("description")}
                          disabled={isGeneratingAI}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Rate ({invoice.currency})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Tax (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.taxRate}
                      onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label>Amount</Label>
                    <p className="text-lg font-semibold mt-2">
                      {invoice.currency} {item.amount.toFixed(2)}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Discount and Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Discount</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={invoice.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setInvoice({ ...invoice, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoice.discountValue}
                  onChange={(e) =>
                    setInvoice({ ...invoice, discountValue: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">
                {invoice.currency} {invoice.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax:</span>
              <span className="font-semibold">
                {invoice.currency} {invoice.totalTax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="font-semibold text-destructive">
                - {invoice.currency} {invoice.totalDiscount.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  {invoice.currency} {invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Terms and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Terms</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateWithAI("terms")}
                disabled={isGeneratingAI}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Generate
              </Button>
            </div>
            <Textarea
              value={invoice.paymentTerms}
              onChange={(e) => setInvoice({ ...invoice, paymentTerms: e.target.value })}
              placeholder="Payment terms and conditions..."
              rows={5}
            />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <Textarea
              value={invoice.notes}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
              placeholder="Additional notes or information..."
              rows={5}
            />
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default InvoiceGenerator;