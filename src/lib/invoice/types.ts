export type DocumentType = "invoice" | "quote" | "proforma" | "receipt" | "credit-note";
export type InvoiceStatus = "draft" | "unpaid" | "paid" | "partial" | "overdue";
export type TemplateId = "modern" | "classic" | "minimal" | "corporate" | "creative";

export interface InvoiceItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number; // percent, per line
  taxRate: number; // percent, per line
}

export interface InvoiceTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  template: TemplateId;
  showLines: boolean;
  compact: boolean;
}

export interface Invoice {
  id: string;
  documentType: DocumentType;
  status: InvoiceStatus;
  invoiceNumber: string;
  poNumber: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;

  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite: string;
  companyTaxId: string;
  companyRegNumber: string;
  companyLogo?: string;

  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxId: string;
  shipToSame: boolean;
  shippingAddress: string;

  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankSwiftCode: string;
  paymentLink: string;
  showPaymentQr: boolean;

  items: InvoiceItem[];
  currency: string;
  taxLabel: string;
  taxMode: "per-item" | "global";
  globalTaxRate: number;
  taxInclusive: boolean;
  discountType: "percentage" | "fixed";
  discountValue: number;
  shipping: number;
  amountPaid: number;
  roundTotal: boolean;

  paymentTerms: string;
  notes: string;
  termsAndConditions: string;
  footerNote: string;
  showAmountInWords: boolean;
  showSignature: boolean;
  signatureName: string;
  signatureImage?: string;

  theme: InvoiceTheme;
  updatedAt: string;
}

export interface InvoiceTotals {
  subtotal: number;
  lineDiscounts: number;
  invoiceDiscount: number;
  taxable: number;
  totalTax: number;
  shipping: number;
  total: number;
  paid: number;
  balance: number;
}

export const lineNet = (item: InvoiceItem) => {
  const gross = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
  return gross - gross * ((Number(item.discount) || 0) / 100);
};

export const computeTotals = (inv: Invoice): InvoiceTotals => {
  const gross = inv.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const net = inv.items.reduce((s, i) => s + lineNet(i), 0);
  const lineDiscounts = gross - net;

  const invoiceDiscount =
    inv.discountType === "percentage" ? net * ((Number(inv.discountValue) || 0) / 100) : Number(inv.discountValue) || 0;

  const taxableBase = Math.max(0, net - invoiceDiscount);
  const discountFactor = net > 0 ? taxableBase / net : 0;

  let totalTax = 0;
  if (inv.taxMode === "global") {
    totalTax = taxableBase * ((Number(inv.globalTaxRate) || 0) / 100);
  } else {
    totalTax = inv.items.reduce(
      (s, i) => s + lineNet(i) * discountFactor * ((Number(i.taxRate) || 0) / 100),
      0
    );
  }

  const shipping = Number(inv.shipping) || 0;
  let total = inv.taxInclusive ? taxableBase + shipping : taxableBase + totalTax + shipping;
  if (inv.taxInclusive) {
    // taxes already inside the prices — show the embedded portion instead
    const rate = inv.taxMode === "global" ? (Number(inv.globalTaxRate) || 0) / 100 : 0;
    totalTax = inv.taxMode === "global" ? taxableBase - taxableBase / (1 + rate) : totalTax;
  }
  if (inv.roundTotal) total = Math.round(total);

  const paid = Number(inv.amountPaid) || 0;
  return {
    subtotal: gross,
    lineDiscounts,
    invoiceDiscount,
    taxable: taxableBase,
    totalTax,
    shipping,
    total: Math.max(0, total),
    paid,
    balance: Math.max(0, total - paid),
  };
};
