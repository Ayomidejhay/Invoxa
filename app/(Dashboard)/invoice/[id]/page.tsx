


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiClock, FiCalendar, FiBriefcase, FiCheckCircle, FiInfo, FiLayers, FiFileText, FiCheck } from "react-icons/fi";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import type { InvoiceStatus, InvoiceType, BankAccount } from "@/lib/supabase/database.types";
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
  pricing_options?: {
    hourly?: { rate: number; quantity: number; label: string };
    daily?: { rate: number; quantity: number; label: string };
    flat?: { rate: number; quantity: number; label: string };
  } | null;
  selected_pricing_option?: string | null;
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
  const styles: Record<InvoiceType, { background: string; color: string; label: string }> = {
    sale: { background: "#EAF2EB", color: "#355834", label: "Sale" },
    rental: { background: "#FBF1DE", color: "#B7791F", label: "Rental" },
    service: { background: "#E0F2FE", color: "#0369A1", label: "Service" },
  };
  const config = styles[type] || styles.sale;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      style={{ background: config.background, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function PrintStatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, { background: string; color: string }> = {
    proposal: { background: "#EAF2EB", color: "#355834" },
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

const renderFormattedNotes = (text: string) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        const cleanLine = line.trim();
        if (!cleanLine) return null;

        // 1. Check if it's a section header (e.g. ends with ":")
        if (cleanLine.endsWith(':')) {
          return (
            <div key={idx} className="pt-4 first:pt-0">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-deepgreen dark:text-lightgreen flex items-center gap-2 mb-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-deepgreen dark:bg-lightgreen animate-pulse" />
                {cleanLine.slice(0, -1)}
              </h4>
              <div className="h-[1px] bg-gradient-to-r from-deepgreen/20 dark:from-lightgreen/20 to-transparent" />
            </div>
          );
        }

        // 2. Check if it's a bullet point
        if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ') || cleanLine.startsWith('•')) {
          const markerLength = cleanLine.startsWith('•') && !cleanLine.startsWith('• ') ? 1 : 2;
          const content = cleanLine.substring(markerLength).trim();
          return (
            <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-slate-100/80 dark:border-zinc-800/40 shadow-sm hover:shadow-md hover:border-deepgreen/20 dark:hover:border-lightgreen/20 transition-all duration-300 text-left">
              <div className="w-5 h-5 rounded-lg bg-deepgreen/10 dark:bg-lightgreen/10 text-deepgreen dark:text-lightgreen flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                <FiCheck className="w-3 h-3" />
              </div>
              <span className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-medium">
                {content}
              </span>
            </div>
          );
        }

        // 3. Check if it's a numbered list
        const numberMatch = cleanLine.match(/^\d+\.\s(.*)/) || cleanLine.match(/^\d+\.(.*)/);
        if (numberMatch) {
          const number = cleanLine.split('.')[0];
          const content = numberMatch[1].trim();
          return (
            <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-slate-100/80 dark:border-zinc-800/40 shadow-sm hover:shadow-md hover:border-deepgreen/20 dark:hover:border-lightgreen/20 transition-all duration-300 text-left">
              <div className="w-5 h-5 rounded-lg bg-deepgreen/10 dark:bg-lightgreen/10 text-deepgreen dark:text-lightgreen flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 shadow-inner">
                {number}
              </div>
              <span className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-medium">
                {content}
              </span>
            </div>
          );
        }

        // 4. Default standard paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-350 font-medium pl-1.5 text-left bg-slate-50/50 dark:bg-zinc-850/20 p-4 rounded-2xl border border-slate-100/50 dark:border-zinc-800/30">
            {cleanLine}
          </p>
        );
      })}
    </div>
  );
};

export default function InvoiceDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const { organization: org, isOwnerOrAdmin } = useOrganization();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiding, setVoiding] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);

  const [manualSelectModalOpen, setManualSelectModalOpen] = useState(false);
  const [modalChosenOption, setModalChosenOption] = useState<"hourly" | "daily" | "flat" | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

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

    // Fetch currency specific bank details
    if (inv) {
      const invCurrency = inv.currency || org.currency || "NGN";
      const { data: bankAcctData } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("organization_id", org.id)
        .eq("currency", invCurrency)
        .maybeSingle();
      setBankAccount(bankAcctData);
    }

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

    let finalItems: InvoiceItem[] = itemData || [];
    if (inv && (!itemData || itemData.length === 0) && inv.selected_pricing_option) {
      const option = inv.selected_pricing_option;
      const pricingOptions = inv.pricing_options as any;
      const chosenPlan = pricingOptions?.[option];
      if (chosenPlan) {
        finalItems = [
          {
            id: `virtual-${option}`,
            product_id: null,
            name: `${chosenPlan.label || `${option.toUpperCase()} Billing Option`} (Accepted Proposal Plan)`,
            quantity: chosenPlan.quantity || 1,
            unit_price: chosenPlan.rate || 0,
            total_price: (chosenPlan.quantity || 1) * (chosenPlan.rate || 0),
            start_date: inv.start_date || null,
            end_date: inv.end_date || null,
          },
        ];
      }
    }

    setInvoice(normalizedInv);
    setItems(finalItems);
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

  // Pre-generate and cache the PDF in memory on the client side from the server
  useEffect(() => {
    if (loading || !invoice || !id || invoice.status === "proposal") return;

    let isMounted = true;

    const generateBgPDF = async () => {
      try {
        const response = await fetch(`/api/invoice/${id}/pdf`);
        if (response.ok && isMounted) {
          const blob = await response.blob();
          setPdfBlob(blob);
        }
      } catch (err) {
        console.error("Background server-side PDF generation failed:", err);
      }
    };

    generateBgPDF();

    return () => {
      isMounted = false;
    };
  }, [loading, invoice, id, items]);

  const grandTotal = useMemo(() => {
    return items.reduce((s, it) => s + (it.total_price || 0), 0);
  }, [items]);

  const parsedServiceNotes = useMemo(() => {
    if (!invoice?.notes) return { name: "", description: "" };
    try {
      const parsed = JSON.parse(invoice.notes);
      if (parsed && typeof parsed === "object" && "name" in parsed) {
        return {
          name: parsed.name || "",
          description: parsed.description || "",
        };
      }
    } catch (e) {
      // Ignored
    }
    return { name: "", description: invoice.notes };
  }, [invoice?.notes]);

  if (loading || !invoice) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-deepgreen border-t-transparent animate-spin" />
      </div>
    );
  }

  const isRental = invoice.type === "rental";
  const isService = invoice.type === "service";
  const currency = invoice.currency || org.currency || "NGN";
  const effectiveTotal = invoice.total > 0 ? invoice.total : grandTotal;
  const balanceDue = effectiveTotal - invoice.amount_paid;
  const primaryColor = org?.primary_color || (isService ? "#0284C7" : isRental ? "#B7791F" : "#355834");

  const copyProposalLink = () => {
    const link = `${window.location.origin}/proposal/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Proposal link copied to clipboard!");
  };

  const openPaymentModal = () => {
    const remaining = effectiveTotal - invoice.amount_paid;
    // First payment on this invoice: suggest the org's default deposit %
    // if one is set, otherwise suggest the full remaining balance.
    const suggested =
      invoice.amount_paid === 0 && org.default_deposit_percentage
        ? Math.round(effectiveTotal * (org.default_deposit_percentage / 100) * 100) / 100
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
    if (!invoice) return;

    const safeInvoiceNumber = (invoice.invoice_number || invoice.id.slice(0, 8))
      .replace(/[^a-zA-Z0-9-_\s.]/g, "_");
    const filename = `invoice-${safeInvoiceNumber}.pdf`;

    const triggerDownload = (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    setDownloading(true);
    try {
      const response = await fetch(`/api/invoice/${id}/pdf`);
      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData?.error || "Failed to generate PDF");
      }
      const blob = await response.blob();
      setPdfBlob(blob);
      triggerDownload(blob);
      toast.success("PDF downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const shareInvoice = async () => {
    if (!invoice) return;

    if (invoice.status === "proposal") {
      const proposalLink = `${window.location.origin}/proposal/${id}`;
      const shareText = `Dear ${invoice.customers?.name || "Customer"},\n\nPlease review our service proposal and select your preferred payment plan:\n${proposalLink}\n\nThank you,\nThe ${org.name} Team`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, "_blank");
      toast.success("Opening WhatsApp with proposal link!");
      return;
    }

    const shareText = `Dear ${invoice.customers?.name || "Customer"},\n\nPlease find attached invoice #${invoice.invoice_number || invoice.id.slice(0, 8)} for your recent transaction.\n\nTotal Amount: ${formatCurrency(invoice.total, currency)}\nRemaining Balance: ${formatCurrency(balanceDue, currency)}\n\nThank you,\nThe ${org.name} Team`;
    const safeInvoiceNumber = (invoice.invoice_number || invoice.id.slice(0, 8))
      .replace(/[^a-zA-Z0-9-_\s.]/g, "_");
    const filename = `invoice-${safeInvoiceNumber}.pdf`;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // On mobile, use native Web Share API to send the PDF file + text together
    if (isMobile && navigator.share) {
      setSharing(true);
      let activeBlob = pdfBlob;
      if (!activeBlob) {
        try {
          const response = await fetch(`/api/invoice/${id}/pdf`);
          if (response.ok) {
            activeBlob = await response.blob();
            setPdfBlob(activeBlob);
          }
        } catch (err) {
          console.error("Failed to generate PDF on demand:", err);
        }
      }

      if (activeBlob) {
        const file = new File([activeBlob], filename, { type: "application/pdf" });
        const canShareFiles = !navigator.canShare || navigator.canShare({ files: [file] });
        
        if (canShareFiles) {
          try {
            await navigator.share({
              files: [file],
              title: `Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}`,
              text: shareText,
            });
            toast.success("Invoice shared successfully!");
            setSharing(false);
            return;
          } catch (err: any) {
            if (err.name === "AbortError") {
              setSharing(false);
              return;
            }
            console.error("Native sharing failed, falling back to window.open:", err);
          }
        }
      }
      setSharing(false);
    }

    // Desktop/Fallback: Open WhatsApp Web/App synchronously to bypass browser popup blockers
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");

    toast.info("Opening WhatsApp and downloading the invoice PDF. Please select your contact in WhatsApp, send the text, and then attach the downloaded PDF.");

    // Download the PDF in the background
    let activeBlob = pdfBlob;
    if (!activeBlob) {
      setSharing(true);
      try {
        const response = await fetch(`/api/invoice/${id}/pdf`);
        if (response.ok) {
          activeBlob = await response.blob();
          setPdfBlob(activeBlob);
        }
      } catch (err) {
        console.error("Failed to generate PDF on demand:", err);
      } finally {
        setSharing(false);
      }
    }

    if (activeBlob) {
      const url = window.URL.createObjectURL(activeBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      toast.error("Could not generate invoice PDF file. Please download it manually.");
    }
  };

  const openEmailModal = () => {
    if (!invoice) return;
    setClientEmail(invoice.customers?.email || "");
    
    if (invoice.status === "proposal") {
      const proposalLink = `${window.location.origin}/proposal/${id}`;
      setEmailSubject(`Service Proposal #${invoice.invoice_number || invoice.id.slice(0, 8)} from ${org.name}`);
      setEmailBody(
        `Dear ${invoice.customers?.name || "Customer"},\n\nPlease review our service proposal and select your preferred payment plan here:\n\n${proposalLink}\n\nThank you,\nThe ${org.name} Team`
      );
    } else {
      setEmailSubject(`Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)} from ${org.name}`);
      setEmailBody(
        `Dear ${invoice.customers?.name || "Customer"},\n\nPlease find attached invoice #${invoice.invoice_number || invoice.id.slice(0, 8)} for your recent transaction.\n\nTotal Amount: ${formatCurrency(invoice.total, currency)}\nRemaining Balance: ${formatCurrency(balanceDue, currency)}\n\nThank you,\nThe ${org.name} Team`
      );
    }
    setEmailModalOpen(true);
  };

  const submitEmail = async () => {
    if (!clientEmail) {
      toast.error("Please enter a valid recipient email address");
      return;
    }
    setSendingEmail(true);
    try {
      const response = await fetch("/api/invoice/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: id,
          clientEmail,
          emailSubject,
          emailBody,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData?.error || "Failed to send invoice email");
      }

      toast.success("Invoice email sent successfully!");
      setEmailModalOpen(false);
      loadInvoice();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send invoice email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 md:px-0 pb-12 space-y-6">
      {/* Top Banner for Selected Proposal Option */}
      {invoice.selected_pricing_option && (
        <div className="p-4 rounded-2xl border border-[#355834]/30 dark:border-green-800/20 bg-[#355834]/5 dark:bg-[#1C2C22]/30 text-sm text-[#355834] dark:text-[#8BB174] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm print:hidden">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-[#355834]/10 dark:bg-green-500/10 flex items-center justify-center shrink-0">
              <FiCheckCircle className="w-4 h-4 text-[#355834] dark:text-green-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-dark dark:text-white">Proposal billing active!</span>{" "}
              Locked in option: <span className="font-extrabold uppercase text-[#355834] dark:text-[#8BB174]">{invoice.selected_pricing_option}</span> plan. 
              {effectiveTotal > 0 && ` Contract value: ${formatCurrency(effectiveTotal, currency)}`}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#355834]/15 dark:bg-[#355834]/35 text-[#355834] dark:text-green-300 border border-[#355834]/20 uppercase tracking-widest">
            Option Active
          </span>
        </div>
      )}

      <div className="flex items-center gap-2.5 print:hidden mb-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] text-zinc-500 hover:text-dark dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Back"
        >
          <FiArrowLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-zinc-550 dark:text-zinc-400">Back to invoices</span>
      </div>

      {/* Scrollable Wrapper to make sure only the invoice overflows on mobile */}
      <div className="w-full overflow-x-auto pb-4 print:overflow-visible">
        <div
          id="invoice"
          className="relative bg-white p-6 md:p-12 space-y-10 border border-[#e2e8f0] rounded-2xl shadow-md overflow-hidden min-w-[768px] md:min-w-0"
        >
        {/* Subtle Watermark Logo / Initials */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.07] w-[380px] h-[380px]"
        >
          {org?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.logo_url}
              crossOrigin="anonymous"
              alt="watermark"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-[260px] font-black uppercase text-[#0f172a] font-display leading-none">
              {org?.name ? org.name[0] : "B"}
            </span>
          )}
        </div>

        {/* Brand accent — custom primary color, fallback to type color */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: primaryColor }}
        />

        {/* PAID / VOID / PROPOSAL stamp — a real invoice convention, and useful even printed in black & white */}
        {(invoice.status === "paid" || invoice.status === "void" || invoice.status === "proposal") && (
          <div
            className="absolute top-24 right-12 pointer-events-none select-none"
            style={{ transform: "rotate(-12deg)" }}
          >
            <span
              className="text-5xl font-extrabold uppercase tracking-widest border-4 rounded-xl px-4 py-1"
              style={
                invoice.status === "paid"
                  ? { color: "#16A34A", borderColor: "#16A34A", opacity: 0.35 }
                  : invoice.status === "void"
                  ? { color: "#DC2626", borderColor: "#DC2626", opacity: 0.35 }
                  : { color: "#355834", borderColor: "#355834", opacity: 0.15 }
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
            <h2 className="text-3xl font-light tracking-tight tracking-wide uppercase" style={{ color: primaryColor }}>
              {invoice.status === "proposal" ? "PROPOSAL" : "INVOICE"}
            </h2>
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
            {(isRental || isService) && invoice.start_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>{isRental ? "Rental Start:" : "Service Start:"}</span>{" "}
                <span className="font-medium" style={{ color: "#1e293b" }}>
                  {new Date(invoice.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
            {(isRental || isService) && invoice.end_date && (
              <p>
                <span style={{ color: "#94a3b8" }}>{isRental ? "Rental End:" : "Service End:"}</span>{" "}
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

        {/* Table of Items / Proposal Pricing Options */}
        {invoice.status === "proposal" ? (
          <div className="pt-6 space-y-6">
            {invoice.notes && (
              <div 
                className="bg-slate-50/50 dark:bg-zinc-900/25 backdrop-blur-sm border border-slate-200/60 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden text-left"
              >
                <div className="absolute left-0 top-6 bottom-6 w-[4px] rounded-r bg-gradient-to-b from-deepgreen to-lightgreen" />
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#355834]/10 dark:bg-emerald-500/10 text-[#355834] dark:text-emerald-400 flex items-center justify-center">
                      <FiLayers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Project Scope & Deliverables
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">Specifications and alignment criteria</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10">
                    Official Scope
                  </span>
                </div>

                {parsedServiceNotes.name && (
                  <div className="px-1 mt-2">
                    <h3 className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">
                      {parsedServiceNotes.name}
                    </h3>
                  </div>
                )}

                <div className="pl-1">
                  {renderFormattedNotes(parsedServiceNotes.description)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Proposed Pricing Options</h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#355834]/10 text-[#355834] border border-[#355834]/10">
                Awaiting Client Selection
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {invoice.pricing_options?.hourly && (
                <div className="relative overflow-hidden group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#355834]/40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#355834]/10 text-[#355834] flex items-center justify-center shrink-0">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                        Hourly Rate
                      </span>
                      <h4 className="font-bold text-sm text-zinc-800">Hourly Plan</h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{invoice.pricing_options.hourly.label || "Billing by the hour"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800 font-mono">
                        {formatCurrency(invoice.pricing_options.hourly.rate, currency)}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">/ hr</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-600 border-t border-slate-100 pt-4">
                      <span>Est. Quantity</span>
                      <strong className="font-semibold text-zinc-700">{invoice.pricing_options.hourly.quantity} hrs</strong>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center font-bold text-sm text-zinc-800">
                      <span className="text-xs text-zinc-500">Proposed Total</span>
                      <span className="font-mono text-[#355834]">
                        {formatCurrency(invoice.pricing_options.hourly.rate * invoice.pricing_options.hourly.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {invoice.pricing_options?.daily && (
                <div className="relative overflow-hidden group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#355834]/40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#355834]/10 text-[#355834] flex items-center justify-center shrink-0">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                        Daily Rate
                      </span>
                      <h4 className="font-bold text-sm text-zinc-800">Daily Plan</h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{invoice.pricing_options.daily.label || "Billing by the day"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800 font-mono">
                        {formatCurrency(invoice.pricing_options.daily.rate, currency)}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">/ day</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-600 border-t border-slate-100 pt-4">
                      <span>Est. Quantity</span>
                      <strong className="font-semibold text-zinc-700">{invoice.pricing_options.daily.quantity} days</strong>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center font-bold text-sm text-zinc-800">
                      <span className="text-xs text-zinc-500">Proposed Total</span>
                      <span className="font-mono text-[#355834]">
                        {formatCurrency(invoice.pricing_options.daily.rate * invoice.pricing_options.daily.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {invoice.pricing_options?.flat && (
                <div className="relative overflow-hidden group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#355834]/40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#355834]/10 text-[#355834] flex items-center justify-center shrink-0">
                      <FiBriefcase className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                        Fixed Price
                      </span>
                      <h4 className="font-bold text-sm text-zinc-800">Fixed Project Plan</h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{invoice.pricing_options.flat.label || "One-time project fee"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-zinc-800 font-mono">
                        {formatCurrency(invoice.pricing_options.flat.rate, currency)}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium"> flat fee</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-600 border-t border-slate-100 pt-4">
                      <span>Est. Quantity</span>
                      <strong className="font-semibold text-zinc-700">{invoice.pricing_options.flat.quantity} project</strong>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center font-bold text-sm text-zinc-800">
                      <span className="text-xs text-zinc-500">Proposed Total</span>
                      <span className="font-mono text-[#355834]">
                        {formatCurrency(invoice.pricing_options.flat.rate * invoice.pricing_options.flat.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 text-xs text-blue-800 dark:text-blue-300 leading-relaxed justify-between">
              <div className="flex gap-3 items-start text-left">
                <FiInfo className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  This invoice is currently in <strong className="font-semibold text-blue-900 dark:text-blue-200">Proposal</strong> status.
                  <p className="mt-1 text-zinc-550 dark:text-zinc-400">Share the public proposal link with the client, or confirm and lock in a plan manually on their behalf.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 border-blue-100 dark:border-blue-900/30 pt-3 md:pt-0">
                <button
                  onClick={() => {
                    setModalChosenOption(null);
                    setManualSelectModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-650 dark:hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <FiLayers className="w-3.5 h-3.5" /> Select Option for Client
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Table of Items */
          <div className="space-y-6 pt-6">
            {isService && invoice.notes && (
              <div 
                className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/60 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden text-left"
              >
                <div className="absolute left-0 top-6 bottom-6 w-[4px] rounded-r bg-gradient-to-b from-deepgreen to-lightgreen" />
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-deepgreen/10 dark:bg-lightgreen/10 text-deepgreen dark:text-lightgreen flex items-center justify-center">
                      <FiLayers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        Service Description / Scope
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Details of services rendered</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full bg-deepgreen/15 dark:bg-deepgreen/35 text-deepgreen dark:text-green-300 border border-deepgreen/20 shadow-sm">
                    Scope of Services
                  </span>
                </div>

                {parsedServiceNotes.name && (
                  <div className="px-1 mt-2">
                    <h3 className="text-base font-extrabold text-zinc-800 dark:text-zinc-100">
                      {parsedServiceNotes.name}
                    </h3>
                  </div>
                )}

                <div className="pl-1">
                  {renderFormattedNotes(parsedServiceNotes.description)}
                </div>
              </div>
            )}

            <div className="pt-2">
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
          </div>
        )}

        {/* Summary Block */}
        {invoice.status !== "proposal" && (
          <div className="flex justify-end pt-6" style={{ borderTop: "1px solid #f1f5f9" }}>
            <div className="w-full max-w-xs space-y-2.5 text-sm">
              <div className="flex justify-between" style={{ color: "#64748b" }}>
                <span>Subtotal</span>
                <span className="font-mono" style={{ color: "#334155" }}>{formatCurrency(grandTotal, currency, { forCanvas: true })}</span>
              </div>
              <div
                className="flex justify-between font-bold text-base pt-2.5"
                style={{ color: primaryColor, borderTop: `1px solid ${primaryColor}` }}
              >
                <span>Total</span>
                <span className="font-mono" style={{ color: primaryColor }}>{formatCurrency(effectiveTotal, currency, { forCanvas: true })}</span>
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
        )}

        {/* Bank & Payment Details */}
        {invoice.status !== "proposal" &&
          ((bankAccount && (bankAccount.bank_name || bankAccount.account_name || bankAccount.account_number)) ||
            (org?.bank_name || org?.account_name || org?.account_number)) && (
          <div className="pt-6 space-y-2 text-xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 className="font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Payment Details</h4>
            <div className={`grid ${bankAccount?.routing_number || bankAccount?.swift_code ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'} gap-6 p-4 rounded-xl`} style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Bank</span>
                <span className="font-medium" style={{ color: "#1e293b" }}>{bankAccount ? bankAccount.bank_name : org?.bank_name}</span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Account Name</span>
                <span className="font-medium" style={{ color: "#1e293b" }}>{bankAccount ? bankAccount.account_name : org?.account_name}</span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: "#94a3b8" }}>Account Number</span>
                <span className="font-mono font-bold text-sm tracking-wide" style={{ color: "#0f172a" }}>{bankAccount ? bankAccount.account_number : org?.account_number}</span>
              </div>
              {(bankAccount?.routing_number || bankAccount?.swift_code) && (
                <div>
                  {bankAccount?.routing_number && (
                    <div className="mb-1">
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Routing</span>
                      <span className="font-mono text-zinc-600 font-semibold">{bankAccount.routing_number}</span>
                    </div>
                  )}
                  {bankAccount?.swift_code && (
                    <div>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">SWIFT/BIC</span>
                      <span className="font-mono text-zinc-600 font-semibold">{bankAccount.swift_code}</span>
                    </div>
                  )}
                </div>
              )}
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

        {/* Custom Branding Footer */}
        {org?.custom_footer && (
          <div className="pt-6 space-y-1.5 text-xs text-center" style={{ borderTop: "1px solid #f1f5f9" }}>
            <p className="leading-relaxed whitespace-pre-line text-zinc-500 font-medium">
              {org.custom_footer}
            </p>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && !isService && (
          <div className="pt-6 space-y-1.5 text-xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 className="font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Notes</h4>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>{invoice.notes}</p>
          </div>
        )}
      </div>
      </div>

      {confirmDialog}

      {/* Payment history — internal record-keeping, not shown on the printable invoice */}
      {payments.length > 0 && (
        <div className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 print:hidden shadow-sm">
          <h3 className="text-sm font-semibold text-dark dark:text-white mb-4">Payment History</h3>
          <div className="divide-y divide-slate-100 dark:divide-zinc-850">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 text-sm border-b border-slate-100 dark:border-zinc-850/50 last:border-b-0">
                <div>
                  <p className="text-dark dark:text-white font-medium">{formatCurrency(p.amount, currency)}</p>
                  {p.note && <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{p.note}</p>}
                </div>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
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
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-end print:hidden">
        {invoice.status === "proposal" && (
          <Button
            variant="outline"
            onClick={copyProposalLink}
            className="col-span-2 w-full sm:w-auto font-semibold border-blue-650 text-blue-650 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            Copy Proposal Link
          </Button>
        )}

        {invoice.status !== "paid" && invoice.status !== "void" && invoice.status !== "proposal" && (
          <Button
            onClick={openPaymentModal}
            className="col-span-2 w-full sm:w-auto font-semibold px-4 py-2.5"
          >
            Record Payment
          </Button>
        )}

        <Button
          variant="outline"
          onClick={shareInvoice}
          loading={sharing}
          className="col-span-2 w-full sm:w-auto font-medium"
        >
          {invoice.status === "proposal" ? "Share Proposal Link" : "Share to WhatsApp"}
        </Button>

        {invoice.status !== "proposal" && (
          <Button
            variant="outline"
            onClick={downloadPDF}
            loading={downloading}
            className="col-span-1 w-full sm:w-auto"
          >
            Download PDF
          </Button>
        )}

        {invoice.status !== "void" && (
          <Button
            variant="outline"
            onClick={openEmailModal}
            className={invoice.status === "proposal" ? "col-span-2 w-full sm:w-auto" : "col-span-1 w-full sm:w-auto"}
          >
            {invoice.status === "proposal" ? "Send Proposal Email" : "Send Email"}
          </Button>
        )}

        {invoice.status !== "proposal" && (
          <Button
            variant="outline"
            onClick={() => window.print()}
            className={`w-full sm:w-auto ${
              invoice.status === "void"
                ? "col-span-1"
                : !isOwnerOrAdmin
                ? "col-span-2"
                : "col-span-1"
            }`}
          >
            Print
          </Button>
        )}

        {isOwnerOrAdmin && invoice.status !== "void" && (
          <Button
            variant="danger"
            onClick={voidInvoice}
            loading={voiding}
            className="col-span-1 w-full sm:w-auto"
          >
            Void
          </Button>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Record Payment" size="sm">
        <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Balance due: <span className="font-mono font-bold text-dark dark:text-white">{formatCurrency(balanceDue, currency, { forCanvas: true })}</span>
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
          />
          <Textarea
            label="Note (optional)"
            placeholder="e.g. Cash deposit, bank transfer ref..."
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitPayment} loading={recordingPayment} className="font-semibold px-4 py-2.5">
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Send Invoice Email Modal */}
      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Invoice to Client" size="sm">
        <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
          <Input
            label="Client email address"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="client@example.com"
          />
          <Input
            label="Subject"
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <Textarea
            label="Message"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={6}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEmail} loading={sendingEmail} className="font-semibold px-4 py-2.5">
              Send Email
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manual Pricing Option Selection Modal */}
      <Modal 
        open={manualSelectModalOpen} 
        onClose={() => setManualSelectModalOpen(false)} 
        title="Confirm Plan on Client's Behalf" 
        size="sm"
      >
        <div className="space-y-5 text-zinc-700 dark:text-zinc-300">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select one of the proposed pricing plans below to lock in the billing rate and transition this proposal to active status.
          </p>

          <div className="space-y-3">
            {invoice.pricing_options?.hourly && (
              <button
                type="button"
                onClick={() => setModalChosenOption("hourly")}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  modalChosenOption === "hourly"
                    ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-500/60"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] hover:border-slate-350 dark:hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                    Hourly Rate
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">Hourly Plan</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-450 line-clamp-1">{invoice.pricing_options.hourly.label || "Billing by the hour"}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-zinc-850 dark:text-zinc-200">
                    {formatCurrency(invoice.pricing_options.hourly.rate, currency)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">/ hr</span>
                </div>
              </button>
            )}

            {invoice.pricing_options?.daily && (
              <button
                type="button"
                onClick={() => setModalChosenOption("daily")}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  modalChosenOption === "daily"
                    ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-500/60"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] hover:border-slate-350 dark:hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                    Daily Rate
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">Daily Plan</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-450 line-clamp-1">{invoice.pricing_options.daily.label || "Billing by the day"}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-zinc-850 dark:text-zinc-200">
                    {formatCurrency(invoice.pricing_options.daily.rate, currency)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">/ day</span>
                </div>
              </button>
            )}

            {invoice.pricing_options?.flat && (
              <button
                type="button"
                onClick={() => setModalChosenOption("flat")}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  modalChosenOption === "flat"
                    ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-500/60"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] hover:border-slate-350 dark:hover:border-zinc-700"
                }`}
              >
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-655 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                    Fixed Fee
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">Fixed Plan</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-455 line-clamp-1">{invoice.pricing_options.flat.label || "Billing by flat fee"}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-zinc-850 dark:text-zinc-200">
                    {formatCurrency(invoice.pricing_options.flat.rate, currency)}
                  </span>
                  <span className="text-[10px] text-zinc-500 block"> flat</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-850">
            <Button variant="outline" onClick={() => setManualSelectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!modalChosenOption}
              onClick={async () => {
                if (!modalChosenOption) return;
                try {
                  setManualSelectModalOpen(false);
                  setLoading(true);
                  const { error: rpcErr } = await supabase.rpc("select_invoice_pricing_option", {
                    p_invoice_id: invoice.id,
                    p_option: modalChosenOption,
                  });
                  if (rpcErr) throw new Error(rpcErr.message);
                  await loadInvoice();
                  toast.success(`Success! Locked in the ${modalChosenOption} option.`);
                } catch (err: any) {
                  console.error(err);
                  toast.error(err.message || "Failed to select option.");
                } finally {
                  setLoading(false);
                }
              }}
              className="font-bold px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm Selection
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
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
            min-width: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
