import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Download, Save, FolderOpen, Sparkles, Eye, Settings, Palette } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
}

interface InvoiceTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
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
  companyTaxId?: string;
  companyRegNumber?: string;
  companyWebsite?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankSwiftCode?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxId?: string;
  items: InvoiceItem[];
  currency: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  paymentTerms: string;
  notes: string;
  termsAndConditions?: string;
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  theme: InvoiceTheme;
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
    companyTaxId: "",
    companyRegNumber: "",
    companyWebsite: "",
    bankName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    bankSwiftCode: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientTaxId: "",
    items: [],
    currency: "USD",
    discountType: "percentage",
    discountValue: 0,
    paymentTerms: "Payment due within 30 days",
    notes: "",
    termsAndConditions: "",
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    total: 0,
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6",
      accentColor: "#0ea5e9",
      fontFamily: "Arial",
      fontSize: "medium",
      borderRadius: "small",
    },
  });

  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

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

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element) {
      toast.error("Invoice preview not found!");
      return;
    }

    try {
      toast.info("Generating PDF...");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      toast.success("Invoice downloaded as PDF!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
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
      companyTaxId: "",
      companyRegNumber: "",
      companyWebsite: "",
      bankName: "",
      bankAccountNumber: "",
      bankRoutingNumber: "",
      bankSwiftCode: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      clientTaxId: "",
      items: [],
      currency: "USD",
      discountType: "percentage",
      discountValue: 0,
      paymentTerms: "Payment due within 30 days",
      notes: "",
      termsAndConditions: "",
      subtotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      total: 0,
      theme: {
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
        accentColor: "#0ea5e9",
        fontFamily: "Arial",
        fontSize: "medium",
        borderRadius: "small",
      },
    });
    toast.success("New invoice created!");
  };

  const updateTheme = (field: keyof InvoiceTheme, value: string) => {
    setInvoice(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  };

  const InvoicePreview = () => {
    return (
      <div className="space-y-6">
        <div 
          id="invoice-preview"
          className="bg-white border shadow-lg overflow-hidden max-w-[210mm] mx-auto"
          style={{ 
            fontFamily: invoice.theme.fontFamily,
            minHeight: "297mm",
          }}
        >
        {/* Professional Header */}
        <div className="bg-white border-b-4" style={{ borderBottomColor: invoice.theme.primaryColor }}>
          <div className="p-10">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {invoice.companyLogo && (
                  <img src={invoice.companyLogo} alt="Logo" className="h-20 w-auto mb-4" />
                )}
                <h1 className="text-3xl font-bold mb-3" style={{ color: invoice.theme.primaryColor }}>
                  {invoice.companyName || "YOUR COMPANY NAME"}
                </h1>
                <div className="text-sm space-y-1 text-gray-700">
                  {invoice.companyAddress && <p>{invoice.companyAddress}</p>}
                  {invoice.companyPhone && <p>Tel: {invoice.companyPhone}</p>}
                  {invoice.companyEmail && <p>Email: {invoice.companyEmail}</p>}
                  {invoice.companyWebsite && <p>Web: {invoice.companyWebsite}</p>}
                  {invoice.companyTaxId && <p>Tax ID: {invoice.companyTaxId}</p>}
                  {invoice.companyRegNumber && <p>Reg. No: {invoice.companyRegNumber}</p>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold mb-2" style={{ color: invoice.theme.primaryColor }}>INVOICE</h2>
                <div className="text-sm space-y-1 text-gray-700">
                  <p className="font-semibold">Invoice #: {invoice.invoiceNumber}</p>
                  <p>Date: {new Date(invoice.invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-semibold">Due Date: {new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8">
          {/* Bill To Section */}
          <div className="bg-gray-50 p-6 border-l-4" style={{ borderLeftColor: invoice.theme.primaryColor }}>
            <p className="text-xs font-bold text-gray-600 mb-3 tracking-wider">BILL TO:</p>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{invoice.clientName || "Client Name"}</h3>
            <div className="text-sm space-y-1 text-gray-700">
              {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
              {invoice.clientPhone && <p>Tel: {invoice.clientPhone}</p>}
              {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
              {invoice.clientTaxId && <p>Tax ID: {invoice.clientTaxId}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-bold text-gray-800 text-sm">DESCRIPTION</th>
                  <th className="text-center p-3 font-bold text-gray-800 text-sm w-20">QTY</th>
                  <th className="text-right p-3 font-bold text-gray-800 text-sm w-28">RATE</th>
                  <th className="text-right p-3 font-bold text-gray-800 text-sm w-20">TAX %</th>
                  <th className="text-right p-3 font-bold text-gray-800 text-sm w-32">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="p-3 text-gray-800">{item.description || "—"}</td>
                      <td className="p-3 text-center text-gray-800">{item.quantity}</td>
                      <td className="p-3 text-right text-gray-800">{invoice.currency} {item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right text-gray-800">{item.taxRate}%</td>
                      <td className="p-3 text-right font-semibold text-gray-900">{invoice.currency} {item.amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-96 border-2 border-gray-300">
              <div className="flex justify-between py-3 px-4 border-b border-gray-300 bg-gray-50">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 px-4 border-b border-gray-300 bg-white">
                <span className="font-semibold text-gray-700">Tax:</span>
                <span className="font-semibold text-gray-900">{invoice.currency} {invoice.totalTax.toFixed(2)}</span>
              </div>
              {invoice.totalDiscount > 0 && (
                <div className="flex justify-between py-3 px-4 border-b border-gray-300 bg-gray-50">
                  <span className="font-semibold text-gray-700">Discount:</span>
                  <span className="font-semibold text-red-600">
                    - {invoice.currency} {invoice.totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div 
                className="flex justify-between py-4 px-4 text-white font-bold text-xl"
                style={{ backgroundColor: invoice.theme.primaryColor }}
              >
                <span>TOTAL DUE:</span>
                <span>{invoice.currency} {invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bank Details & Payment Instructions */}
          {(invoice.bankName || invoice.bankAccountNumber) && (
            <div className="bg-blue-50 p-6 border-2 border-blue-200">
              <h4 className="font-bold text-gray-800 mb-3 text-sm tracking-wider">PAYMENT INFORMATION</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                {invoice.bankName && (
                  <div>
                    <p className="font-semibold text-gray-600">Bank Name:</p>
                    <p>{invoice.bankName}</p>
                  </div>
                )}
                {invoice.bankAccountNumber && (
                  <div>
                    <p className="font-semibold text-gray-600">Account Number:</p>
                    <p>{invoice.bankAccountNumber}</p>
                  </div>
                )}
                {invoice.bankRoutingNumber && (
                  <div>
                    <p className="font-semibold text-gray-600">Routing Number:</p>
                    <p>{invoice.bankRoutingNumber}</p>
                  </div>
                )}
                {invoice.bankSwiftCode && (
                  <div>
                    <p className="font-semibold text-gray-600">SWIFT Code:</p>
                    <p>{invoice.bankSwiftCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Terms, Notes, and Terms & Conditions */}
          <div className="space-y-6">
            {invoice.paymentTerms && (
              <div className="border-l-4 pl-4" style={{ borderLeftColor: invoice.theme.primaryColor }}>
                <h4 className="font-bold text-gray-800 mb-2 text-sm tracking-wider">PAYMENT TERMS</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.paymentTerms}</p>
              </div>
            )}
            
            {invoice.notes && (
              <div className="border-l-4 pl-4" style={{ borderLeftColor: invoice.theme.accentColor }}>
                <h4 className="font-bold text-gray-800 mb-2 text-sm tracking-wider">NOTES</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {invoice.termsAndConditions && (
              <div className="border-t-2 border-gray-300 pt-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm tracking-wider">TERMS & CONDITIONS</h4>
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{invoice.termsAndConditions}</p>
              </div>
            )}
          </div>
        </div>

        </div>
        
        {/* Download Button below invoice */}
        <div className="flex justify-center">
          <Button onClick={downloadPDF} size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Download Invoice as PDF
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ToolPageTemplate
      title="AI Invoice Generator"
      description="Generate professional invoices with AI-powered features, customizable templates, and automatic calculations"
      keywords="invoice generator, ai invoice, billing, professional invoice"
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="edit">
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="customize">
              <Palette className="mr-2 h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="mt-6">
            <InvoicePreview />
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="mt-6">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Invoice Theme & Style</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={invoice.theme.primaryColor}
                        onChange={(e) => updateTheme("primaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={invoice.theme.primaryColor}
                        onChange={(e) => updateTheme("primaryColor", e.target.value)}
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={invoice.theme.secondaryColor}
                        onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={invoice.theme.secondaryColor}
                        onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={invoice.theme.accentColor}
                        onChange={(e) => updateTheme("accentColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={invoice.theme.accentColor}
                        onChange={(e) => updateTheme("accentColor", e.target.value)}
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select value={invoice.theme.fontFamily} onValueChange={(v) => updateTheme("fontFamily", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter (Modern)</SelectItem>
                        <SelectItem value="Georgia">Georgia (Classic)</SelectItem>
                        <SelectItem value="Courier New">Courier New (Mono)</SelectItem>
                        <SelectItem value="Arial">Arial (Simple)</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman (Formal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Font Size</Label>
                    <Select value={invoice.theme.fontSize} onValueChange={(v) => updateTheme("fontSize", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Border Radius</Label>
                    <Select value={invoice.theme.borderRadius} onValueChange={(v) => updateTheme("borderRadius", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  💡 Tip: Switch to the Preview tab to see your changes in real-time!
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="mt-6 space-y-6">
            {/* Saved Invoices */}
            {savedInvoices.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Saved Invoices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedInvoices.map((inv) => (
                    <Card key={inv.id} className="p-3 hover:bg-accent cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <div onClick={() => loadInvoice(inv)} className="flex-1">
                          <p className="font-semibold">{inv.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{inv.clientName}</p>
                          <p className="text-sm font-medium">{inv.currency} {inv.total.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteInvoice(inv.id);
                          }}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tax ID / VAT Number</Label>
                    <Input
                      value={invoice.companyTaxId || ""}
                      onChange={(e) => setInvoice({ ...invoice, companyTaxId: e.target.value })}
                      placeholder="TX-123456789"
                    />
                  </div>

                  <div>
                    <Label>Registration Number</Label>
                    <Input
                      value={invoice.companyRegNumber || ""}
                      onChange={(e) => setInvoice({ ...invoice, companyRegNumber: e.target.value })}
                      placeholder="REG-123456"
                    />
                  </div>
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    value={invoice.companyWebsite || ""}
                    onChange={(e) => setInvoice({ ...invoice, companyWebsite: e.target.value })}
                    placeholder="www.yourcompany.com"
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

                <div>
                  <Label>Client Tax ID / VAT Number</Label>
                  <Input
                    value={invoice.clientTaxId || ""}
                    onChange={(e) => setInvoice({ ...invoice, clientTaxId: e.target.value })}
                    placeholder="TX-987654321"
                  />
                </div>
              </Card>
            </div>

            {/* Bank Details */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Payment & Bank Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={invoice.bankName || ""}
                    onChange={(e) => setInvoice({ ...invoice, bankName: e.target.value })}
                    placeholder="Bank Name"
                  />
                </div>

                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={invoice.bankAccountNumber || ""}
                    onChange={(e) => setInvoice({ ...invoice, bankAccountNumber: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX-1234"
                  />
                </div>

                <div>
                  <Label>Routing / Sort Code</Label>
                  <Input
                    value={invoice.bankRoutingNumber || ""}
                    onChange={(e) => setInvoice({ ...invoice, bankRoutingNumber: e.target.value })}
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <Label>SWIFT / BIC Code</Label>
                  <Input
                    value={invoice.bankSwiftCode || ""}
                    onChange={(e) => setInvoice({ ...invoice, bankSwiftCode: e.target.value })}
                    placeholder="ABCDUS33XXX"
                  />
                </div>
              </div>
            </Card>

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
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="AED">AED (د.إ) - UAE Dirham</SelectItem>
                      <SelectItem value="AFN">AFN (؋) - Afghan Afghani</SelectItem>
                      <SelectItem value="ALL">ALL (L) - Albanian Lek</SelectItem>
                      <SelectItem value="AMD">AMD (֏) - Armenian Dram</SelectItem>
                      <SelectItem value="ANG">ANG (ƒ) - Netherlands Antillean Guilder</SelectItem>
                      <SelectItem value="AOA">AOA (Kz) - Angolan Kwanza</SelectItem>
                      <SelectItem value="ARS">ARS ($) - Argentine Peso</SelectItem>
                      <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                      <SelectItem value="AWG">AWG (ƒ) - Aruban Florin</SelectItem>
                      <SelectItem value="AZN">AZN (₼) - Azerbaijani Manat</SelectItem>
                      <SelectItem value="BAM">BAM (KM) - Bosnia-Herzegovina Convertible Mark</SelectItem>
                      <SelectItem value="BBD">BBD ($) - Barbadian Dollar</SelectItem>
                      <SelectItem value="BDT">BDT (৳) - Bangladeshi Taka</SelectItem>
                      <SelectItem value="BGN">BGN (лв) - Bulgarian Lev</SelectItem>
                      <SelectItem value="BHD">BHD (.د.ب) - Bahraini Dinar</SelectItem>
                      <SelectItem value="BIF">BIF (Fr) - Burundian Franc</SelectItem>
                      <SelectItem value="BMD">BMD ($) - Bermudian Dollar</SelectItem>
                      <SelectItem value="BND">BND ($) - Brunei Dollar</SelectItem>
                      <SelectItem value="BOB">BOB (Bs.) - Bolivian Boliviano</SelectItem>
                      <SelectItem value="BRL">BRL (R$) - Brazilian Real</SelectItem>
                      <SelectItem value="BSD">BSD ($) - Bahamian Dollar</SelectItem>
                      <SelectItem value="BTN">BTN (Nu.) - Bhutanese Ngultrum</SelectItem>
                      <SelectItem value="BWP">BWP (P) - Botswanan Pula</SelectItem>
                      <SelectItem value="BYN">BYN (Br) - Belarusian Ruble</SelectItem>
                      <SelectItem value="BZD">BZD ($) - Belize Dollar</SelectItem>
                      <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                      <SelectItem value="CDF">CDF (Fr) - Congolese Franc</SelectItem>
                      <SelectItem value="CHF">CHF (Fr) - Swiss Franc</SelectItem>
                      <SelectItem value="CLP">CLP ($) - Chilean Peso</SelectItem>
                      <SelectItem value="CNY">CNY (¥) - Chinese Yuan</SelectItem>
                      <SelectItem value="COP">COP ($) - Colombian Peso</SelectItem>
                      <SelectItem value="CRC">CRC (₡) - Costa Rican Colón</SelectItem>
                      <SelectItem value="CUP">CUP ($) - Cuban Peso</SelectItem>
                      <SelectItem value="CVE">CVE ($) - Cape Verdean Escudo</SelectItem>
                      <SelectItem value="CZK">CZK (Kč) - Czech Koruna</SelectItem>
                      <SelectItem value="DJF">DJF (Fr) - Djiboutian Franc</SelectItem>
                      <SelectItem value="DKK">DKK (kr) - Danish Krone</SelectItem>
                      <SelectItem value="DOP">DOP ($) - Dominican Peso</SelectItem>
                      <SelectItem value="DZD">DZD (د.ج) - Algerian Dinar</SelectItem>
                      <SelectItem value="EGP">EGP (£) - Egyptian Pound</SelectItem>
                      <SelectItem value="ERN">ERN (Nfk) - Eritrean Nakfa</SelectItem>
                      <SelectItem value="ETB">ETB (Br) - Ethiopian Birr</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="FJD">FJD ($) - Fijian Dollar</SelectItem>
                      <SelectItem value="FKP">FKP (£) - Falkland Islands Pound</SelectItem>
                      <SelectItem value="FOK">FOK (kr) - Faroese Króna</SelectItem>
                      <SelectItem value="GBP">GBP (£) - British Pound Sterling</SelectItem>
                      <SelectItem value="GEL">GEL (₾) - Georgian Lari</SelectItem>
                      <SelectItem value="GGP">GGP (£) - Guernsey Pound</SelectItem>
                      <SelectItem value="GHS">GHS (₵) - Ghanaian Cedi</SelectItem>
                      <SelectItem value="GIP">GIP (£) - Gibraltar Pound</SelectItem>
                      <SelectItem value="GMD">GMD (D) - Gambian Dalasi</SelectItem>
                      <SelectItem value="GNF">GNF (Fr) - Guinean Franc</SelectItem>
                      <SelectItem value="GTQ">GTQ (Q) - Guatemalan Quetzal</SelectItem>
                      <SelectItem value="GYD">GYD ($) - Guyanese Dollar</SelectItem>
                      <SelectItem value="HKD">HKD ($) - Hong Kong Dollar</SelectItem>
                      <SelectItem value="HNL">HNL (L) - Honduran Lempira</SelectItem>
                      <SelectItem value="HRK">HRK (kn) - Croatian Kuna</SelectItem>
                      <SelectItem value="HTG">HTG (G) - Haitian Gourde</SelectItem>
                      <SelectItem value="HUF">HUF (Ft) - Hungarian Forint</SelectItem>
                      <SelectItem value="IDR">IDR (Rp) - Indonesian Rupiah</SelectItem>
                      <SelectItem value="IMP">IMP (£) - Isle of Man Pound</SelectItem>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="IQD">IQD (ع.د) - Iraqi Dinar</SelectItem>
                      <SelectItem value="IRR">IRR (﷼) - Iranian Rial</SelectItem>
                      <SelectItem value="ISK">ISK (kr) - Icelandic Króna</SelectItem>
                      <SelectItem value="JEP">JEP (£) - Jersey Pound</SelectItem>
                      <SelectItem value="JMD">JMD ($) - Jamaican Dollar</SelectItem>
                      <SelectItem value="JOD">JOD (د.ا) - Jordanian Dinar</SelectItem>
                      <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                      <SelectItem value="KES">KES (Sh) - Kenyan Shilling</SelectItem>
                      <SelectItem value="KGS">KGS (с) - Kyrgyzstani Som</SelectItem>
                      <SelectItem value="KHR">KHR (៛) - Cambodian Riel</SelectItem>
                      <SelectItem value="KID">KID ($) - Kiribati Dollar</SelectItem>
                      <SelectItem value="KMF">KMF (Fr) - Comorian Franc</SelectItem>
                      <SelectItem value="KRW">KRW (₩) - South Korean Won</SelectItem>
                      <SelectItem value="KWD">KWD (د.ك) - Kuwaiti Dinar</SelectItem>
                      <SelectItem value="KYD">KYD ($) - Cayman Islands Dollar</SelectItem>
                      <SelectItem value="KZT">KZT (₸) - Kazakhstani Tenge</SelectItem>
                      <SelectItem value="LAK">LAK (₭) - Lao Kip</SelectItem>
                      <SelectItem value="LBP">LBP (ل.ل) - Lebanese Pound</SelectItem>
                      <SelectItem value="LKR">LKR (Rs) - Sri Lankan Rupee</SelectItem>
                      <SelectItem value="LRD">LRD ($) - Liberian Dollar</SelectItem>
                      <SelectItem value="LSL">LSL (L) - Lesotho Loti</SelectItem>
                      <SelectItem value="LYD">LYD (ل.د) - Libyan Dinar</SelectItem>
                      <SelectItem value="MAD">MAD (د.م.) - Moroccan Dirham</SelectItem>
                      <SelectItem value="MDL">MDL (L) - Moldovan Leu</SelectItem>
                      <SelectItem value="MGA">MGA (Ar) - Malagasy Ariary</SelectItem>
                      <SelectItem value="MKD">MKD (ден) - Macedonian Denar</SelectItem>
                      <SelectItem value="MMK">MMK (K) - Myanmar Kyat</SelectItem>
                      <SelectItem value="MNT">MNT (₮) - Mongolian Tögrög</SelectItem>
                      <SelectItem value="MOP">MOP (P) - Macanese Pataca</SelectItem>
                      <SelectItem value="MRU">MRU (UM) - Mauritanian Ouguiya</SelectItem>
                      <SelectItem value="MUR">MUR (₨) - Mauritian Rupee</SelectItem>
                      <SelectItem value="MVR">MVR (ރ.) - Maldivian Rufiyaa</SelectItem>
                      <SelectItem value="MWK">MWK (MK) - Malawian Kwacha</SelectItem>
                      <SelectItem value="MXN">MXN ($) - Mexican Peso</SelectItem>
                      <SelectItem value="MYR">MYR (RM) - Malaysian Ringgit</SelectItem>
                      <SelectItem value="MZN">MZN (MT) - Mozambican Metical</SelectItem>
                      <SelectItem value="NAD">NAD ($) - Namibian Dollar</SelectItem>
                      <SelectItem value="NGN">NGN (₦) - Nigerian Naira</SelectItem>
                      <SelectItem value="NIO">NIO (C$) - Nicaraguan Córdoba</SelectItem>
                      <SelectItem value="NOK">NOK (kr) - Norwegian Krone</SelectItem>
                      <SelectItem value="NPR">NPR (₨) - Nepalese Rupee</SelectItem>
                      <SelectItem value="NZD">NZD ($) - New Zealand Dollar</SelectItem>
                      <SelectItem value="OMR">OMR (ر.ع.) - Omani Rial</SelectItem>
                      <SelectItem value="PAB">PAB (B/.) - Panamanian Balboa</SelectItem>
                      <SelectItem value="PEN">PEN (S/.) - Peruvian Sol</SelectItem>
                      <SelectItem value="PGK">PGK (K) - Papua New Guinean Kina</SelectItem>
                      <SelectItem value="PHP">PHP (₱) - Philippine Peso</SelectItem>
                      <SelectItem value="PKR">PKR (₨) - Pakistani Rupee</SelectItem>
                      <SelectItem value="PLN">PLN (zł) - Polish Złoty</SelectItem>
                      <SelectItem value="PYG">PYG (₲) - Paraguayan Guaraní</SelectItem>
                      <SelectItem value="QAR">QAR (ر.ق) - Qatari Riyal</SelectItem>
                      <SelectItem value="RON">RON (lei) - Romanian Leu</SelectItem>
                      <SelectItem value="RSD">RSD (дин) - Serbian Dinar</SelectItem>
                      <SelectItem value="RUB">RUB (₽) - Russian Ruble</SelectItem>
                      <SelectItem value="RWF">RWF (Fr) - Rwandan Franc</SelectItem>
                      <SelectItem value="SAR">SAR (ر.س) - Saudi Riyal</SelectItem>
                      <SelectItem value="SBD">SBD ($) - Solomon Islands Dollar</SelectItem>
                      <SelectItem value="SCR">SCR (₨) - Seychellois Rupee</SelectItem>
                      <SelectItem value="SDG">SDG (£) - Sudanese Pound</SelectItem>
                      <SelectItem value="SEK">SEK (kr) - Swedish Krona</SelectItem>
                      <SelectItem value="SGD">SGD ($) - Singapore Dollar</SelectItem>
                      <SelectItem value="SHP">SHP (£) - Saint Helena Pound</SelectItem>
                      <SelectItem value="SLL">SLL (Le) - Sierra Leonean Leone</SelectItem>
                      <SelectItem value="SOS">SOS (Sh) - Somali Shilling</SelectItem>
                      <SelectItem value="SRD">SRD ($) - Surinamese Dollar</SelectItem>
                      <SelectItem value="SSP">SSP (£) - South Sudanese Pound</SelectItem>
                      <SelectItem value="STN">STN (Db) - São Tomé and Príncipe Dobra</SelectItem>
                      <SelectItem value="SYP">SYP (£) - Syrian Pound</SelectItem>
                      <SelectItem value="SZL">SZL (L) - Eswatini Lilangeni</SelectItem>
                      <SelectItem value="THB">THB (฿) - Thai Baht</SelectItem>
                      <SelectItem value="TJS">TJS (ЅМ) - Tajikistani Somoni</SelectItem>
                      <SelectItem value="TMT">TMT (m) - Turkmenistan Manat</SelectItem>
                      <SelectItem value="TND">TND (د.ت) - Tunisian Dinar</SelectItem>
                      <SelectItem value="TOP">TOP (T$) - Tongan Paʻanga</SelectItem>
                      <SelectItem value="TRY">TRY (₺) - Turkish Lira</SelectItem>
                      <SelectItem value="TTD">TTD ($) - Trinidad and Tobago Dollar</SelectItem>
                      <SelectItem value="TVD">TVD ($) - Tuvaluan Dollar</SelectItem>
                      <SelectItem value="TWD">TWD ($) - New Taiwan Dollar</SelectItem>
                      <SelectItem value="TZS">TZS (Sh) - Tanzanian Shilling</SelectItem>
                      <SelectItem value="UAH">UAH (₴) - Ukrainian Hryvnia</SelectItem>
                      <SelectItem value="UGX">UGX (Sh) - Ugandan Shilling</SelectItem>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="UYU">UYU ($) - Uruguayan Peso</SelectItem>
                      <SelectItem value="UZS">UZS (so'm) - Uzbekistani Som</SelectItem>
                      <SelectItem value="VES">VES (Bs.S.) - Venezuelan Bolívar</SelectItem>
                      <SelectItem value="VND">VND (₫) - Vietnamese Đồng</SelectItem>
                      <SelectItem value="VUV">VUV (Vt) - Vanuatu Vatu</SelectItem>
                      <SelectItem value="WST">WST (T) - Samoan Tālā</SelectItem>
                      <SelectItem value="XAF">XAF (Fr) - Central African CFA Franc</SelectItem>
                      <SelectItem value="XCD">XCD ($) - East Caribbean Dollar</SelectItem>
                      <SelectItem value="XOF">XOF (Fr) - West African CFA Franc</SelectItem>
                      <SelectItem value="XPF">XPF (₣) - CFP Franc</SelectItem>
                      <SelectItem value="YER">YER (﷼) - Yemeni Rial</SelectItem>
                      <SelectItem value="ZAR">ZAR (R) - South African Rand</SelectItem>
                      <SelectItem value="ZMW">ZMW (ZK) - Zambian Kwacha</SelectItem>
                      <SelectItem value="ZWL">ZWL ($) - Zimbabwean Dollar</SelectItem>
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
                  placeholder="e.g., Payment due within 30 days. Late payments subject to 2% monthly interest."
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

            {/* Terms and Conditions */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              <Textarea
                value={invoice.termsAndConditions || ""}
                onChange={(e) => setInvoice({ ...invoice, termsAndConditions: e.target.value })}
                placeholder="e.g., All work performed and materials supplied are subject to our standard terms and conditions. Payment is non-refundable. We reserve the right to charge interest on overdue accounts."
                rows={4}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolPageTemplate>
  );
};

export default InvoiceGenerator;
