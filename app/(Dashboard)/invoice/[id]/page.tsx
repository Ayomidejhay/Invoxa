


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import type { InvoiceStatus, InvoiceType } from "@/lib/supabase/database.types";
import { Button } from "@/app/components/ui/Button";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useConfirm } from "@/app/components/ui/useConfirm";
import { useToast } from "@/app/components/ui/Toast";
import { formatCurrency } from "@/lib/format";
import type { Payment } from "@/lib/supabase/database.types";

// ---------------- TYPES ----------------
type Customer = { name: string; email?: string; phone?: string };

type Invoice = {
  id: string;
  invoice_number?: string | null;
  type: InvoiceType;
  status: InvoiceStatus;
  total: number;
  amount_paid: number;
  currency?: string | null;
  notes?: string | null;
  created_at: string;
  issue_date?: string | null;
  due_date?: string | null;
  customers?: Customer;
  start_date?: string | null;
  end_date?: string | null;
};

type InvoiceItem = {
  id: string;
  name?: string | null;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  start_date?: string | null;
  end_date?: string | null;
};

// -------------- HELPERS ---------------
const daysBetween = (start?: string | null, end?: string | null) => {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// The shared StatusBadge/TypeBadge components (components/ui/Badge.tsx) use
// Tailwind's default palette, which Tailwind v4 builds on oklch() — fine
// everywhere else (browsers render oklch natively), but html2canvas doesn't
// reliably parse it and washes the colors out. These two are plain-hex
// stand-ins used *only* inside the html2canvas-captured #invoice container.
function PrintTypeBadge({ type }: { type: InvoiceType }) {
  const isSale = type === "sale";
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      style={isSale ? { background: "#EAF2EB", color: "#355834" } : { background: "#FBF1DE", color: "#B7791F" }}
    >
      {isSale ? "Sale" : "Rental"}
    </span>
  );
}

function PrintStatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, { background: string; color: string }> = {
    draft: { background: "#F1F5F9", color: "#475569" },
    sent: { background: "#DBEAFE", color: "#1D4ED8" },
    partial: { background: "#E0E7FF", color: "#4338CA" },
    paid: { background: "#DCFCE7", color: "#15803D" },
    overdue: { background: "#FEF3C7", color: "#B45309" },
    void: { background: "#FEE2E2", color: "#B91C1C" },
  };
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      style={styles[status]}
    >
      {status}
    </span>
  );
}

export default function InvoiceDetailPage() {
  const { id } = useParams() as { id: string };
  const supabase = useMemo(() => getSupabaseClient(), []);
  const { organization: org, isOwnerOrAdmin } = useOrganization();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiding, setVoiding] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  const loadInvoice = async () => {
    const { data: inv } = await supabase
      .from("invoices")
      .select("*, customers(name, email, phone)")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: true });

    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: false });

    // Normalize nullable fields from Supabase (which may be null) to match our Invoice type
    // where customer fields expect undefined instead of null
    const normalizedInv: Invoice | null = inv
      ? {
          ...inv,
          customers: inv.customers
            ? {
                ...inv.customers,
                email: inv.customers.email ?? undefined,
                phone: inv.customers.phone ?? undefined,
              }
            : undefined,
        }
      : null;

    setInvoice(normalizedInv);
    setItems(itemData || []);
    setPayments(paymentData || []);
  };

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true);
      await loadInvoice();
      if (isMounted) setLoading(false);
    };

    if (id) load();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const grandTotal = useMemo(() => {
    return items.reduce((s, it) => s + (it.total_price || 0), 0);
  }, [items]);

  if (loading || !invoice) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-deepgreen border-t-transparent animate-spin" />
      </div>
    );
  }

  const isRental = invoice.type === "rental";
  const currency = invoice.currency || org.currency || "NGN";
  const balanceDue = invoice.total - invoice.amount_paid;

  const openPaymentModal = () => {
    const remaining = invoice.total - invoice.amount_paid;
    // First payment on this invoice: suggest the org's default deposit %
    // if one is set, otherwise suggest the full remaining balance.
    const suggested =
      invoice.amount_paid === 0 && org.default_deposit_percentage
        ? Math.round(invoice.total * (org.default_deposit_percentage / 100) * 100) / 100
        : remaining;
    setPaymentAmount(suggested.toString());
    setPaymentNote("");
    setPaymentModalOpen(true);
  };

  const submitPayment = async () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    if (amount > balanceDue + 0.01) {
      toast.error(`That exceeds the remaining balance of ${formatCurrency(balanceDue, currency)}`);
      return;
    }

    setRecordingPayment(true);
    const { error } = await supabase.rpc("record_payment", {
      p_invoice_id: invoice.id,
      p_amount: amount,
      p_note: paymentNote || null,
    });
    setRecordingPayment(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setPaymentModalOpen(false);
    toast.success(amount >= balanceDue - 0.01 ? "Invoice marked as paid" : "Payment recorded");
    loadInvoice();
  };

  const voidInvoice = async () => {
    if (invoice.status === "void") return;

    const ok = await confirm({
      title: "Void this invoice?",
      description: invoice.amount_paid > 0 ? "Stock will be restored, but recorded payments stay on file." : undefined,
      confirmLabel: "Void Invoice",
      tone: "danger",
    });
    if (!ok) return;

    setVoiding(true);

    const { error } = await supabase.rpc("void_invoice", { p_invoice_id: invoice.id });

    setVoiding(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setInvoice({ ...invoice, status: "void" });
    toast.success("Invoice voided");
  };

  const downloadPDF = async () => {
    const element = document.getElementById("invoice");

    if (!element) return;

    // Find the scrollable container (the main dashboard wrapper)
    const scrollContainer = element.closest(".overflow-y-auto");
    const originalScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    // Save original style properties to restore later
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalPadding = element.style.padding;

    // Temporarily force fixed width for clean A4 printing layout
    element.style.width = "850px";
    element.style.maxWidth = "none";
    element.style.padding = "48px";

    // Temporarily scroll to the top of the container to prevent any vertical scroll clipping
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // high quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        // letterRendering forces html2canvas to draw each character
        // individually instead of whole strings at once — this is the
        // standard fix for the ₦ (Naira) glyph overlapping adjacent
        // digits, which is a width-calculation bug in html2canvas's own
        // text rasterizer, not a font issue.
        // @ts-expect-error: letterRendering exists at runtime though missing in types
        letterRendering: true,
        // We scrolled the container to the top, so we don't need scroll offsets anymore.
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeInvoiceNumber = (invoice.invoice_number || invoice.id.slice(0, 8))
        .replace(/[^a-zA-Z0-9-_\s.]/g, "_");

      pdf.save(`invoice-${safeInvoiceNumber}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      const errMsg = err instanceof Error ? err.stack || err.message : String(err);
      const errorDiv = document.createElement("div");
      errorDiv.id = "pdf-debug-error";
      errorDiv.style.position = "fixed";
      errorDiv.style.top = "10px";
      errorDiv.style.left = "10px";
      errorDiv.style.right = "10px";
      errorDiv.style.background = "red";
      errorDiv.style.color = "white";
      errorDiv.style.padding = "20px";
      errorDiv.style.zIndex = "999999";
      errorDiv.style.fontFamily = "monospace";
      errorDiv.style.whiteSpace = "pre-wrap";
      errorDiv.innerText = "PDF Error:\n" + errMsg;
      document.body.appendChild(errorDiv);
    } finally {
      // Restore original styling and scroll position
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.padding = originalPadding;
      if (scrollContainer) {
        scrollContainer.scrollTop = originalScrollTop;
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Printable Invoice Container */}
      <div
        id="invoice"
        className="relative bg-white p-12 space-y-10 border border-[#e2e8f0] rounded-2xl shadow-md overflow-hidden"
      >
        {/* Brand accent — green for sale, amber for rental, matching the badges everywhere else */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: isRental ? "#B7791F" : "#355834" }}
        />

        {/* PAID / VOID stamp — a real invoice convention, and useful even printed in black & white */}
        {(invoice.status === "paid" || invoice.status === "void") && (
          <div
            className="absolute top-24 right-12 pointer-events-none select-none"
            style={{ transform: "rotate(-12deg)" }}
          >
            <span
              className="text-5xl font-extrabold uppercase tracking-widest border-4 rounded-xl px-4 py-1"
              style={
                invoice.status === "paid"
                  ? { color: "#16A34A", borderColor: "#16A34A", opacity: 0.35 }
                  : { color: "#DC2626", borderColor: "#DC2626", opacity: 0.35 }
              }
            >
              {invoice.status}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#f1f5f9] pb-8">
          <div className="flex items-center gap-4">
            {org?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={org.logo_url}
                crossOrigin="anonymous"
                alt="logo"
                className="h-16 w-16 object-cover rounded-xl border border-[#e2e8f0] shadow-sm"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase tracking-wider"
                style={{ background: "#0f172a" }}
              >
                {org?.name ? org.name[0] : "B"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                {org?.name || "Business Name"}
              </h1>
              <p className="text-sm" style={{ color: "#64748b" }}>{org?.email}</p>
              <p className="text-sm" style={{ color: "#64748b" }}>{org?.phone}</p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{org?.address}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <PrintTypeBadge type={invoice.type} />
              <PrintStatusBadge status={invoice.status} />
            </div>
            <h2 className="text-3xl font-light tracking-tight" style={{ color: "#1e293b" }}>INVOICE</h2>
            <p className="text-sm font-mono mt-0.5" style={{ color: "#64748b" }}>
              #{invoice.invoice_number || invoice.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Invoice Info / Dates */}
        <div className="grid grid-cols-2 gap-12 text-sm pt-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Billed To</h3>
            <p className="font-bold text-base" style={{ color: "#1e293b" }}>{invoice.customers?.name}</p>
            {invoice.customers?.email && (
              <p style={{ color: "#64748b" }}>{invoice.customers.email}</p>
            )}
            {invoice.customers?.phone && (
              <p style={{ color: "#64748b" }}>{invoice.customers.phone}</p>
            )}
          </div>

          <div className="flex flex-col items-end text-right space-y-1.5" style={{ color: "#475569" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#94a3b8" }}>Details</h3>
            {invoice.issue_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>Date Issued:</span>{" "}
                <span className="font-medium" style={{ color: "#1e293b" }}>
                  {new Date(invoice.issue_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
            {invoice.due_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>Due Date:</span>{" "}
                <span className="font-medium" style={{ color: "#1e293b" }}>
                  {new Date(invoice.due_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
            {isRental && invoice.start_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>Rental Start:</span>{" "}
                <span className="font-medium" style={{ color: "#1e293b" }}>
                  {new Date(invoice.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
            {isRental && invoice.end_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>Rental End:</span>{" "}
                <span className="font-medium" style={{ color: "#1e293b" }}>
                  {new Date(invoice.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Table of Items */}
        <div className="pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <th className="p-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>Description</th>
                {isRental && <th className="p-3 text-center font-bold text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>Days</th>}
                <th className="p-3 text-center font-bold text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>Qty</th>
                <th className="p-3 text-right font-bold text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>
                  {isRental ? "Rate / day" : "Unit Price"}
                </th>
                <th className="p-3 text-right font-bold text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const days = daysBetween(
                  it.start_date || invoice.start_date || undefined,
                  it.end_date || invoice.end_date || undefined,
                );
                return (
                  <tr key={it.id} style={{ borderTop: idx === 0 ? "none" : "1px solid #f1f5f9" }}>
                    <td className="p-3 font-medium" style={{ color: "#0f172a" }}>
                      {it.name || "Product"}
                      {isRental && (
                        <p className="text-xs font-normal mt-0.5" style={{ color: "#94a3b8" }}>
                          {formatCurrency(it.unit_price, currency, { forCanvas: true })}/day × {it.quantity} × {days || 1} days
                        </p>
                      )}
                    </td>
                    {isRental && <td className="p-3 text-center font-mono" style={{ color: "#64748b" }}>{days || "-"}</td>}
                    <td className="p-3 text-center font-mono" style={{ color: "#64748b" }}>{it.quantity}</td>
                    <td className="p-3 text-right font-mono" style={{ color: "#64748b" }}>{formatCurrency(it.unit_price, currency, { forCanvas: true })}</td>
                    <td className="p-3 text-right font-semibold font-mono" style={{ color: "#020617" }}>{formatCurrency(it.total_price, currency, { forCanvas: true })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Block */}
        <div className="flex justify-end pt-6" style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="w-full max-w-xs space-y-2.5 text-sm">
            <div className="flex justify-between" style={{ color: "#64748b" }}>
              <span>Subtotal</span>
              <span className="font-mono" style={{ color: "#334155" }}>{formatCurrency(grandTotal, currency, { forCanvas: true })}</span>
            </div>
            <div
              className="flex justify-between font-bold text-base pt-2.5"
              style={{ color: "#0f172a", borderTop: "1px solid #e2e8f0" }}
            >
              <span>Total</span>
              <span className="font-mono" style={{ color: "#020617" }}>{formatCurrency(invoice.total ?? grandTotal, currency, { forCanvas: true })}</span>
            </div>
            {invoice.amount_paid > 0 && (
              <>
                <div className="flex justify-between" style={{ color: "#16A34A" }}>
                  <span>Amount Paid</span>
                  <span className="font-mono">{formatCurrency(invoice.amount_paid, currency, { forCanvas: true })}</span>
                </div>
                <div
                  className="flex justify-between font-bold pt-2"
                  style={{ color: balanceDue > 0 ? "#B45309" : "#16A34A", borderTop: "1px dashed #e2e8f0" }}
                >
                  <span>Balance Due</span>
                  <span className="font-mono">{formatCurrency(balanceDue, currency, { forCanvas: true })}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bank & Payment Details */}
        {(org?.bank_name || org?.account_name || org?.account_number) && (
          <div className="pt-6 space-y-2 text-xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 className="font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Payment Details</h4>
            <div className="grid grid-cols-3 gap-6 p-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Bank</span>
                <span className="font-medium" style={{ color: "#1e293b" }}>{org?.bank_name}</span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Account Name</span>
                <span className="font-medium" style={{ color: "#1e293b" }}>{org?.account_name}</span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Account Number</span>
                <span className="font-mono font-bold text-sm tracking-wide" style={{ color: "#0f172a" }}>{org?.account_number}</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {org?.payment_terms && (
          <div className="pt-6 space-y-1.5 text-xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 className="font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Terms & Conditions</h4>
            <p
              className="leading-relaxed whitespace-pre-line p-4 rounded-xl"
              style={{ color: "#64748b", background: "#fafbfc", border: "1px solid #f8fafc" }}
            >
              {org.payment_terms}
            </p>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="pt-6 space-y-1.5 text-xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 className="font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Notes</h4>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>{invoice.notes}</p>
          </div>
        )}
      </div>

      {confirmDialog}

      {/* Payment history — internal record-keeping, not shown on the printable invoice */}
      {payments.length > 0 && (
        <div className="bg-[#202023] border border-zinc-800 rounded-2xl p-6 print:hidden">
          <h3 className="text-sm font-semibold text-white mb-4">Payment History</h3>
          <div className="divide-y divide-zinc-850">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 text-sm border-b border-zinc-850/50 last:border-b-0">
                <div>
                  <p className="text-white font-medium">{formatCurrency(p.amount, currency)}</p>
                  {p.note && <p className="text-zinc-400 text-xs mt-0.5">{p.note}</p>}
                </div>
                <span className="text-zinc-400 text-xs">
                  {new Date(p.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions (hidden on print) */}
      <div className="flex justify-end gap-3 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          Print
        </Button>

        <Button variant="outline" onClick={downloadPDF}>
          Download PDF
        </Button>

        {isOwnerOrAdmin && invoice.status !== "void" && (
          <Button variant="danger" onClick={voidInvoice} loading={voiding}>
            Void
          </Button>
        )}

        {invoice.status !== "paid" && invoice.status !== "void" && (
          <Button onClick={openPaymentModal} className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold px-4 py-2.5">
            Record Payment
          </Button>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Record Payment" size="sm">
        <div className="space-y-4 text-zinc-300">
          <p className="text-sm text-zinc-400">
            Balance due: <span className="font-mono font-bold text-white">{formatCurrency(balanceDue, currency, { forCanvas: true })}</span>
          </p>
          <Input
            label="Amount received"
            type="number"
            min="0"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            hint={
              invoice.amount_paid === 0 && org.default_deposit_percentage
                ? `Prefilled at your default deposit of ${org.default_deposit_percentage}% — change as needed`
                : undefined
            }
            className="bg-[#202023] border-zinc-800 text-white"
          />
          <Textarea
            label="Note (optional)"
            placeholder="e.g. Cash deposit, bank transfer ref..."
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            rows={2}
            className="bg-[#202023] border-zinc-800 text-white"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitPayment} loading={recordingPayment} className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold px-4 py-2.5">
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Print tweaks */}
      <style jsx global>{`
        @media print {
          body, html {
            background: #fff !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Hide sidebars, navigation, and top bars */
          aside, header, nav, .print\:hidden {
            display: none !important;
          }
          /* Reset viewport-locked height and scroll constraints */
          .h-screen, [class*="h-screen"],
          .overflow-y-auto, [class*="overflow-y-auto"] {
            height: auto !important;
            overflow: visible !important;
          }
          /* Expand layouts to print at full width without sidebar offsets */
          div, main, section {
            height: auto !important;
            overflow: visible !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          #invoice {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}
