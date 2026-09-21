import React from "react";
import { Invoice, InvoiceTotals, lineNet } from "@/lib/invoice/types";
import { amountInWords, formatMoney } from "@/lib/invoice/currencies";

/**
 * Print-accurate A4 invoice document.
 * Colors here are intentionally literal (not design tokens): the document is a
 * printable artifact that must look identical in light mode, dark mode and PDF.
 */

interface Props {
  invoice: Invoice;
  totals: InvoiceTotals;
  qrDataUrl?: string;
}

const DOC_LABEL: Record<string, string> = {
  invoice: "INVOICE",
  quote: "QUOTATION",
  proforma: "PROFORMA INVOICE",
  receipt: "RECEIPT",
  "credit-note": "CREDIT NOTE",
};

const STATUS_COLOR: Record<string, string> = {
  paid: "#16a34a",
  unpaid: "#dc2626",
  partial: "#d97706",
  overdue: "#dc2626",
  draft: "#64748b",
};

const fmtDate = (d: string) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const InvoiceDocument = ({ invoice: inv, totals, qrDataUrl }: Props) => {
  const t = inv.theme;
  const money = (v: number) => formatMoney(v, inv.currency);
  const label = DOC_LABEL[inv.documentType] ?? "INVOICE";
  const pad = t.compact ? "28px" : "40px";
  const template = t.template;

  const Meta = () => (
    <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
      <div>
        <strong>{label} #</strong> {inv.invoiceNumber || "—"}
      </div>
      <div>
        <strong>Date:</strong> {fmtDate(inv.invoiceDate)}
      </div>
      {inv.documentType !== "receipt" && (
        <div>
          <strong>Due:</strong> {fmtDate(inv.dueDate)}
        </div>
      )}
      {inv.poNumber && (
        <div>
          <strong>PO #:</strong> {inv.poNumber}
        </div>
      )}
      {inv.projectName && (
        <div>
          <strong>Project:</strong> {inv.projectName}
        </div>
      )}
    </div>
  );

  const Parties = () => (
    <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, color: "#6b7280", fontWeight: 700, marginBottom: 6 }}>
          BILL TO
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{inv.clientName || "Client name"}</div>
        <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {inv.clientAddress}
          {inv.clientPhone ? `\nTel: ${inv.clientPhone}` : ""}
          {inv.clientEmail ? `\n${inv.clientEmail}` : ""}
          {inv.clientTaxId ? `\nTax ID: ${inv.clientTaxId}` : ""}
        </div>
      </div>
      {!inv.shipToSame && inv.shippingAddress && (
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, color: "#6b7280", fontWeight: 700, marginBottom: 6 }}>
            SHIP TO
          </div>
          <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {inv.shippingAddress}
          </div>
        </div>
      )}
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.4, color: "#6b7280", fontWeight: 700, marginBottom: 6 }}>
          {inv.documentType === "receipt" ? "AMOUNT PAID" : "BALANCE DUE"}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: t.primaryColor }}>
          {money(inv.documentType === "receipt" ? totals.paid : totals.balance)}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{inv.currency}</div>
      </div>
    </div>
  );

  const showTaxCol = inv.taxMode === "per-item";
  const showDiscCol = inv.items.some((i) => Number(i.discount) > 0);

  const ItemsTable = () => (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 26, fontSize: 12 }}>
      <thead>
        <tr style={{ background: template === "minimal" ? "transparent" : t.primaryColor }}>
          {["DESCRIPTION", "QTY", "RATE", ...(showDiscCol ? ["DISC"] : []), ...(showTaxCol ? [inv.taxLabel.toUpperCase()] : []), "AMOUNT"].map(
            (h, i, arr) => (
              <th
                key={h}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "10px 12px",
                  color: template === "minimal" ? "#111827" : "#ffffff",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: 1,
                  borderBottom: template === "minimal" ? `2px solid ${t.primaryColor}` : "none",
                  width: i === 0 ? "auto" : `${Math.floor(60 / (arr.length - 1))}px`,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {inv.items.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: 28, textAlign: "center", color: "#9ca3af" }}>
              No items added yet
            </td>
          </tr>
        ) : (
          inv.items.map((item, idx) => (
            <tr
              key={item.id}
              style={{
                background: t.showLines && idx % 2 === 1 ? "#f9fafb" : "transparent",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td style={{ padding: "10px 12px", color: "#111827" }}>
                <div style={{ fontWeight: 600 }}>{item.description || "—"}</div>
                {item.details && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.details}</div>}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", color: "#374151", whiteSpace: "nowrap" }}>
                {item.quantity} {item.unit}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", color: "#374151" }}>{money(item.rate)}</td>
              {showDiscCol && (
                <td style={{ padding: "10px 12px", textAlign: "right", color: "#374151" }}>{item.discount || 0}%</td>
              )}
              {showTaxCol && (
                <td style={{ padding: "10px 12px", textAlign: "right", color: "#374151" }}>{item.taxRate || 0}%</td>
              )}
              <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                {money(lineNet(item))}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const Row = ({ label: l, value, strong }: { label: string; value: string; strong?: boolean }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "7px 0",
        fontSize: 12.5,
        color: strong ? "#111827" : "#4b5563",
        fontWeight: strong ? 700 : 500,
      }}
    >
      <span>{l}</span>
      <span>{value}</span>
    </div>
  );

  const Summary = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
      <div style={{ width: 300 }}>
        <Row label="Subtotal" value={money(totals.subtotal)} />
        {totals.lineDiscounts > 0 && <Row label="Item discounts" value={`− ${money(totals.lineDiscounts)}`} />}
        {totals.invoiceDiscount > 0 && (
          <Row
            label={`Discount${inv.discountType === "percentage" ? ` (${inv.discountValue}%)` : ""}`}
            value={`− ${money(totals.invoiceDiscount)}`}
          />
        )}
        <Row
          label={`${inv.taxLabel}${inv.taxMode === "global" ? ` (${inv.globalTaxRate}%)` : ""}${inv.taxInclusive ? " — included" : ""}`}
          value={money(totals.totalTax)}
        />
        {totals.shipping > 0 && <Row label="Shipping" value={money(totals.shipping)} />}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 14px",
            marginTop: 8,
            background: t.primaryColor,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 15,
            borderRadius: template === "creative" ? 10 : 0,
          }}
        >
          <span>TOTAL</span>
          <span>{money(totals.total)}</span>
        </div>
        {totals.paid > 0 && (
          <>
            <Row label="Amount paid" value={`− ${money(totals.paid)}`} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                border: `2px solid ${t.accentColor}`,
                color: t.accentColor,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <span>BALANCE DUE</span>
              <span>{money(totals.balance)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const Footer = () => (
    <div style={{ marginTop: 28 }}>
      {inv.showAmountInWords && totals.total > 0 && (
        <div
          style={{
            fontSize: 11.5,
            color: "#374151",
            padding: "10px 12px",
            background: "#f9fafb",
            borderLeft: `3px solid ${t.primaryColor}`,
            marginBottom: 18,
          }}
        >
          <strong>Amount in words: </strong>
          {amountInWords(totals.total, inv.currency)}
        </div>
      )}

      {(inv.bankName || inv.bankAccountNumber || qrDataUrl) && (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>
              PAYMENT DETAILS
            </div>
            <div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.8 }}>
              {inv.bankAccountName && <div>Account name: {inv.bankAccountName}</div>}
              {inv.bankName && <div>Bank: {inv.bankName}</div>}
              {inv.bankAccountNumber && <div>Account / IBAN: {inv.bankAccountNumber}</div>}
              {inv.bankRoutingNumber && <div>Routing / Sort code: {inv.bankRoutingNumber}</div>}
              {inv.bankSwiftCode && <div>SWIFT / BIC: {inv.bankSwiftCode}</div>}
              {inv.paymentLink && <div>Pay online: {inv.paymentLink}</div>}
            </div>
          </div>
          {qrDataUrl && (
            <div style={{ textAlign: "center" }}>
              <img src={qrDataUrl} alt="Payment QR code" style={{ width: 96, height: 96 }} />
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 4 }}>Scan to pay</div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
        <div style={{ flex: 1, fontSize: 11, color: "#4b5563", lineHeight: 1.7 }}>
          {inv.paymentTerms && (
            <div style={{ marginBottom: 10 }}>
              <strong style={{ color: "#111827" }}>Payment terms: </strong>
              <span style={{ whiteSpace: "pre-wrap" }}>{inv.paymentTerms}</span>
            </div>
          )}
          {inv.notes && (
            <div style={{ marginBottom: 10 }}>
              <strong style={{ color: "#111827" }}>Notes: </strong>
              <span style={{ whiteSpace: "pre-wrap" }}>{inv.notes}</span>
            </div>
          )}
          {inv.termsAndConditions && (
            <div style={{ fontSize: 10, color: "#6b7280", whiteSpace: "pre-wrap" }}>{inv.termsAndConditions}</div>
          )}
        </div>
        {inv.showSignature && (
          <div style={{ textAlign: "center", minWidth: 180 }}>
            {inv.signatureImage ? (
              <img src={inv.signatureImage} alt="Signature" style={{ height: 52, margin: "0 auto" }} />
            ) : (
              <div style={{ height: 52 }} />
            )}
            <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 6, fontSize: 11, color: "#374151" }}>
              {inv.signatureName || "Authorised signature"}
            </div>
          </div>
        )}
      </div>

      {inv.footerNote && (
        <div
          style={{
            marginTop: 22,
            paddingTop: 12,
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          {inv.footerNote}
        </div>
      )}
    </div>
  );

  const CompanyBlock = ({ align = "left" }: { align?: "left" | "right" }) => (
    <div style={{ textAlign: align }}>
      {inv.companyLogo && (
        <img
          src={inv.companyLogo}
          alt="Company logo"
          style={{ height: 56, objectFit: "contain", marginBottom: 10, marginLeft: align === "right" ? "auto" : 0 }}
        />
      )}
      <div style={{ fontSize: 19, fontWeight: 800, color: template === "corporate" ? "#ffffff" : t.primaryColor }}>
        {inv.companyName || "Your company name"}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: template === "corporate" ? "rgba(255,255,255,0.85)" : "#4b5563",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          marginTop: 4,
        }}
      >
        {inv.companyAddress}
        {inv.companyPhone ? `\nTel: ${inv.companyPhone}` : ""}
        {inv.companyEmail ? `\n${inv.companyEmail}` : ""}
        {inv.companyWebsite ? `\n${inv.companyWebsite}` : ""}
        {inv.companyTaxId ? `\nTax ID: ${inv.companyTaxId}` : ""}
        {inv.companyRegNumber ? `\nReg No: ${inv.companyRegNumber}` : ""}
      </div>
    </div>
  );

  const StatusStamp = () =>
    inv.status === "draft" ? null : (
      <div
        style={{
          position: "absolute",
          top: 150,
          right: 48,
          transform: "rotate(-14deg)",
          border: `4px solid ${STATUS_COLOR[inv.status]}`,
          color: STATUS_COLOR[inv.status],
          padding: "6px 18px",
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 3,
          opacity: 0.22,
          borderRadius: 8,
          pointerEvents: "none",
        }}
      >
        {inv.status.toUpperCase()}
      </div>
    );

  const Header = () => {
    if (template === "corporate") {
      return (
        <div style={{ background: t.primaryColor, padding: `${pad} ${pad} 28px` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <CompanyBlock />
            <div style={{ textAlign: "right", color: "#ffffff" }}>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>{label}</div>
              <div style={{ fontSize: 12, lineHeight: 1.7, marginTop: 6, color: "rgba(255,255,255,0.9)" }}>
                <div>#{inv.invoiceNumber || "—"}</div>
                <div>Date: {fmtDate(inv.invoiceDate)}</div>
                {inv.documentType !== "receipt" && <div>Due: {fmtDate(inv.dueDate)}</div>}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (template === "creative") {
      return (
        <div style={{ padding: pad, paddingBottom: 0 }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`,
              borderRadius: 16,
              padding: 26,
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {inv.companyLogo && (
                <img src={inv.companyLogo} alt="Company logo" style={{ height: 44, marginBottom: 8 }} />
              )}
              <div style={{ fontSize: 20, fontWeight: 800 }}>{inv.companyName || "Your company name"}</div>
              <div style={{ fontSize: 11.5, opacity: 0.9, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {inv.companyAddress}
                {inv.companyEmail ? `\n${inv.companyEmail}` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>{label}</div>
              <div style={{ fontSize: 12, opacity: 0.95, lineHeight: 1.7 }}>
                <div>#{inv.invoiceNumber || "—"}</div>
                <div>{fmtDate(inv.invoiceDate)}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (template === "minimal") {
      return (
        <div style={{ padding: pad, paddingBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <CompanyBlock />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 300, letterSpacing: 6, color: "#111827" }}>{label}</div>
              <div style={{ marginTop: 8 }}>
                <Meta />
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: "#e5e7eb", marginTop: 20 }} />
        </div>
      );
    }
    if (template === "classic") {
      return (
        <div style={{ padding: pad, paddingBottom: 0, textAlign: "center" }}>
          {inv.companyLogo && (
            <img src={inv.companyLogo} alt="Company logo" style={{ height: 56, margin: "0 auto 10px" }} />
          )}
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", fontFamily: "Georgia, serif" }}>
            {inv.companyName || "Your company name"}
          </div>
          <div style={{ fontSize: 11.5, color: "#4b5563", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {inv.companyAddress}
            {inv.companyPhone ? ` · Tel: ${inv.companyPhone}` : ""}
            {inv.companyEmail ? ` · ${inv.companyEmail}` : ""}
          </div>
          <div style={{ borderTop: `3px double ${t.primaryColor}`, margin: "16px 0 12px" }} />
          <div style={{ fontSize: 20, letterSpacing: 5, fontWeight: 700, color: t.primaryColor }}>{label}</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <Meta />
          </div>
        </div>
      );
    }
    // modern (default)
    return (
      <div style={{ padding: pad, paddingBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <CompanyBlock />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: t.primaryColor, letterSpacing: 1 }}>{label}</div>
            <div style={{ marginTop: 8 }}>
              <Meta />
            </div>
          </div>
        </div>
        <div style={{ height: 4, background: t.primaryColor, marginTop: 18 }} />
      </div>
    );
  };

  return (
    <div
      id="invoice-preview"
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "#ffffff",
        color: "#111827",
        fontFamily: t.fontFamily,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <StatusStamp />
      <Header />
      <div style={{ padding: `0 ${pad} ${pad}` }}>
        <Parties />
        <ItemsTable />
        <Summary />
        <Footer />
      </div>
    </div>
  );
};

export default InvoiceDocument;
