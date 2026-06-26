
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import html2canvas from "html2canvas-pro";
// import jsPDF from "jspdf";
// import { getSupabaseClient } from "@/lib/supabase/client";
// import { useOrganization } from "../../components/OrganizationProvider";
// import type { InvoiceStatus, InvoiceType } from "@/lib/supabase/database.types";

// // ---------------- TYPES ----------------
// type Customer = { name: string; email?: string; phone?: string };

// type Invoice = {
//   id: string;
//   invoice_number?: string | null;
//   type: InvoiceType;
//   status: InvoiceStatus;
//   total: number;
//   notes?: string | null;
//   created_at: string;
//   issue_date?: string | null;
//   due_date?: string | null;
//   customers?: Customer;
//   start_date?: string | null;
//   end_date?: string | null;
// };

// type InvoiceItem = {
//   id: string;
//   name?: string | null;
//   product_id: string | null;
//   quantity: number;
//   unit_price: number;
//   total_price: number;
//   start_date?: string | null;
//   end_date?: string | null;
// };

// const STATUS_STYLES: Record<InvoiceStatus, string> = {
//   draft: "bg-gray-100 text-gray-600",
//   sent: "bg-blue-100 text-blue-700",
//   paid: "bg-green-100 text-green-700",
//   overdue: "bg-amber-100 text-amber-700",
//   void: "bg-red-100 text-red-700",
// };

// // -------------- HELPERS ---------------
// const daysBetween = (start?: string | null, end?: string | null) => {
//   if (!start || !end) return 0;
//   const diff = new Date(end).getTime() - new Date(start).getTime();
//   return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
// };

// export default function InvoiceDetailPage() {
//   const { id } = useParams() as { id: string };
//   const supabase = useMemo(() => getSupabaseClient(), []);
//   const { organization: org, isOwnerOrAdmin } = useOrganization();

//   const [invoice, setInvoice] = useState<Invoice | null>(null);
//   const [items, setItems] = useState<InvoiceItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionError, setActionError] = useState<string | null>(null);
//   const [paying, setPaying] = useState(false);
//   const [voiding, setVoiding] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     const load = async () => {
//       const { data: inv } = await supabase
//         .from("invoices")
//         .select("*, customers(name, email, phone)")
//         .eq("id", id)
//         .single();

//       const { data: itemData } = await supabase
//         .from("invoice_items")
//         .select("*")
//         .eq("invoice_id", id)
//         .order("created_at", { ascending: true });

//       if (isMounted) {
//         setInvoice(inv);
//         setItems(itemData || []);
//         setLoading(false);
//       }
//     };

//     if (id) load();

//     return () => {
//       isMounted = false;
//     };
//   }, [id, supabase]);

//   const grandTotal = useMemo(() => {
//     return items.reduce((s, it) => s + (it.total_price || 0), 0);
//   }, [items]);

//   const markAsPaid = async () => {
//     if (!invoice || invoice.status === "paid") return;
//     setActionError(null);
//     setPaying(true);

//     // Single atomic RPC: flips status to paid AND decrements stock (for
//     // sales) under a row lock — no more client-side loop of separate
//     // decrease_stock calls that could partially fail.
//     const { error } = await supabase.rpc("mark_invoice_paid", { p_invoice_id: invoice.id });

//     setPaying(false);

//     if (error) {
//       setActionError(error.message);
//       return;
//     }
//     setInvoice({ ...invoice, status: "paid" });
//   };

//   const voidInvoice = async () => {
//     if (!invoice || invoice.status === "void") return;
//     if (!confirm("Void this invoice? If it was already paid, stock will be restored.")) return;

//     setActionError(null);
//     setVoiding(true);

//     const { error } = await supabase.rpc("void_invoice", { p_invoice_id: invoice.id });

//     setVoiding(false);

//     if (error) {
//       setActionError(error.message);
//       return;
//     }
//     setInvoice({ ...invoice, status: "void" });
//   };

//   if (loading || !invoice) return <p>Loading...</p>;

//   const isRental = invoice.type === "rental";

//   const downloadPDF = async () => {
//     const element = document.getElementById("invoice");

//     if (!element) return;

//     // Save original style properties to restore later
//     const originalWidth = element.style.width;
//     const originalMaxWidth = element.style.maxWidth;
//     const originalPadding = element.style.padding;

//     // Temporarily force fixed width for clean A4 printing layout
//     element.style.width = "850px";
//     element.style.maxWidth = "none";
//     element.style.padding = "48px";

//     try {
//       const canvas = await html2canvas(element, {
//         scale: 2, // high quality
//         useCORS: true,
//         logging: false,
//       });

//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("p", "mm", "a4");

//       const imgWidth = 210;
//       const pageHeight = 295;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`invoice-${invoice.invoice_number || invoice.id.slice(0, 8)}.pdf`);
//     } catch (err) {
//       console.error("Failed to generate PDF", err);
//     } finally {
//       // Restore original styling
//       element.style.width = originalWidth;
//       element.style.maxWidth = originalMaxWidth;
//       element.style.padding = originalPadding;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto pb-12 space-y-6">
//       {/* Printable Invoice Container */}
//       <div
//         id="invoice"
//         className="bg-white p-12 space-y-10 border border-slate-200/60 rounded-2xl shadow-md"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start border-b border-slate-100 pb-8">
//           <div className="flex items-center gap-4">
//             {org?.logo_url ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 src={org.logo_url}
//                 alt="logo"
//                 className="h-16 w-16 object-cover rounded-xl border border-slate-200 shadow-sm"
//               />
//             ) : (
//               <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl uppercase tracking-wider">
//                 {org?.name ? org.name[0] : "B"}
//               </div>
//             )}
//             <div>
//               <h1 className="text-xl font-bold text-slate-900">
//                 {org?.name || "Business Name"}
//               </h1>
//               <p className="text-sm text-slate-500">{org?.email}</p>
//               <p className="text-sm text-slate-500">{org?.phone}</p>
//               <p className="text-xs text-slate-400 mt-1">{org?.address}</p>
//             </div>
//           </div>

//           <div className="text-right">
//             <div className="flex items-center justify-end gap-2 mb-2">
//               <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
//                 {invoice.type === "rental" ? "Rental Invoice" : "Sales Invoice"}
//               </span>
//               <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${STATUS_STYLES[invoice.status]}`}>
//                 {invoice.status}
//               </span>
//             </div>
//             <h2 className="text-3xl font-light text-slate-800 tracking-tight">INVOICE</h2>
//             <p className="text-sm font-mono text-slate-500 mt-0.5">
//               #{invoice.invoice_number || invoice.id.slice(0, 8)}
//             </p>
//           </div>
//         </div>

//         {/* Invoice Info / Dates */}
//         <div className="grid grid-cols-2 gap-12 text-sm pt-4">
//           <div className="space-y-1.5">
//             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billed To</h3>
//             <p className="font-bold text-slate-800 text-base">{invoice.customers?.name}</p>
//             {invoice.customers?.email && (
//               <p className="text-slate-500">{invoice.customers.email}</p>
//             )}
//             {invoice.customers?.phone && (
//               <p className="text-slate-500">{invoice.customers.phone}</p>
//             )}
//           </div>

//           <div className="flex flex-col items-end text-right space-y-1.5 text-slate-600">
//             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Details</h3>
//             {invoice.issue_date && (
//               <p>
//                 <span className="text-slate-400">Date Issued:</span>{" "}
//                 <span className="font-medium text-slate-800">
//                   {new Date(invoice.issue_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </p>
//             )}
//             {invoice.due_date && (
//               <p>
//                 <span className="text-slate-400">Due Date:</span>{" "}
//                 <span className="font-medium text-slate-800">
//                   {new Date(invoice.due_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </p>
//             )}
//             {isRental && invoice.start_date && (
//               <p>
//                 <span className="text-slate-400">Rental Start:</span>{" "}
//                 <span className="font-medium text-slate-800">
//                   {new Date(invoice.start_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </p>
//             )}
//             {isRental && invoice.end_date && (
//               <p>
//                 <span className="text-slate-400">Rental End:</span>{" "}
//                 <span className="font-medium text-slate-800">
//                   {new Date(invoice.end_date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Table of Items */}
//         <div className="pt-6">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-y border-slate-200 bg-slate-50/50">
//                 <th className="p-3 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Description</th>
//                 {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Start</th>}
//                 {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">End</th>}
//                 {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Days</th>}
//                 <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Qty</th>
//                 <th className="p-3 text-right font-bold text-slate-500 text-xs uppercase tracking-wider">Unit Price</th>
//                 <th className="p-3 text-right font-bold text-slate-500 text-xs uppercase tracking-wider">Amount</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {items.map((it) => {
//                 const days = daysBetween(
//                   it.start_date || invoice.start_date || undefined,
//                   it.end_date || invoice.end_date || undefined,
//                 );
//                 return (
//                   <tr key={it.id} className="text-slate-700">
//                     <td className="p-3 font-medium text-slate-900">{it.name || "Product"}</td>
//                     {isRental && (
//                       <td className="p-3 text-center text-slate-500 whitespace-nowrap">
//                         {it.start_date || invoice.start_date
//                           ? new Date(it.start_date || invoice.start_date!).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })
//                           : "-"}
//                       </td>
//                     )}
//                     {isRental && (
//                       <td className="p-3 text-center text-slate-500 whitespace-nowrap">
//                         {it.end_date || invoice.end_date
//                           ? new Date(it.end_date || invoice.end_date!).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                             })
//                           : "-"}
//                       </td>
//                     )}
//                     {isRental && <td className="p-3 text-center text-slate-500 font-mono">{days || "-"}</td>}
//                     <td className="p-3 text-center text-slate-500 font-mono">{it.quantity}</td>
//                     <td className="p-3 text-right text-slate-500 font-mono">₦{it.unit_price.toLocaleString()}</td>
//                     <td className="p-3 text-right font-semibold text-slate-950 font-mono">₦{it.total_price.toLocaleString()}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Summary Block */}
//         <div className="flex justify-end pt-6 border-t border-slate-100">
//           <div className="w-full max-w-xs space-y-2.5 text-sm">
//             <div className="flex justify-between text-slate-500">
//               <span>Subtotal</span>
//               <span className="font-mono text-slate-700">₦{grandTotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200/60 pt-2.5">
//               <span>Total</span>
//               <span className="font-mono text-slate-950">₦{(invoice.total ?? grandTotal).toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* Bank & Payment Details */}
//         {(org?.bank_name || org?.account_name || org?.account_number) && (
//           <div className="border-t border-slate-100 pt-6 space-y-2 text-xs">
//             <h4 className="font-bold text-slate-400 uppercase tracking-wider">Payment Details</h4>
//             <div className="grid grid-cols-3 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
//               <div>
//                 <span className="text-slate-400 block mb-0.5">Bank</span>
//                 <span className="font-medium text-slate-800">{org?.bank_name}</span>
//               </div>
//               <div>
//                 <span className="text-slate-400 block mb-0.5">Account Name</span>
//                 <span className="font-medium text-slate-800">{org?.account_name}</span>
//               </div>
//               <div>
//                 <span className="text-slate-400 block mb-0.5">Account Number</span>
//                 <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">{org?.account_number}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Terms & Conditions */}
//         {org?.payment_terms && (
//           <div className="border-t border-slate-100 pt-6 space-y-1.5 text-xs">
//             <h4 className="font-bold text-slate-400 uppercase tracking-wider">Terms & Conditions</h4>
//             <p className="text-slate-500 leading-relaxed whitespace-pre-line bg-slate-50/30 p-4 rounded-xl border border-slate-100/50">
//               {org.payment_terms}
//             </p>
//           </div>
//         )}

//         {/* Notes */}
//         {invoice.notes && (
//           <div className="border-t border-slate-100 pt-6 space-y-1.5 text-xs">
//             <h4 className="font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
//             <p className="text-slate-500 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
//           </div>
//         )}
//       </div>

//       {actionError && (
//         <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 print:hidden">
//           {actionError}
//         </div>
//       )}

//       {/* Actions (hidden on print) */}
//       <div className="flex justify-end gap-3 print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-850 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium cursor-pointer"
//         >
//           Print
//         </button>

//         <button
//           onClick={downloadPDF}
//           className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-850 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium cursor-pointer"
//         >
//           Download PDF
//         </button>

//         {isOwnerOrAdmin && invoice.status !== "void" && (
//           <button
//             onClick={voidInvoice}
//             disabled={voiding}
//             className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium cursor-pointer disabled:opacity-50"
//           >
//             {voiding ? "Voiding..." : "Void"}
//           </button>
//         )}

//         {invoice.status !== "paid" && invoice.status !== "void" && (
//           <button
//             onClick={markAsPaid}
//             disabled={paying}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
//           >
//             {paying ? "Processing..." : "Mark as Paid"}
//           </button>
//         )}
//       </div>

//       {/* Print tweaks */}
//       <style jsx global>{`
//         @media print {
//           body {
//             background: #fff;
//           }
//           .print\:hidden {
//             display: none !important;
//           }
//           #invoice {
//             border: none !important;
//             box-shadow: none !important;
//             padding: 0 !important;
//             margin: 0 !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import type { InvoiceStatus, InvoiceType } from "@/lib/supabase/database.types";
import { StatusBadge, TypeBadge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { useConfirm } from "@/app/components/ui/useConfirm";
import { useToast } from "@/app/components/ui/Toast";

// ---------------- TYPES ----------------
type Customer = { name: string; email?: string | null; phone?: string | null };

type Invoice = {
  id: string;
  invoice_number?: string | null;
  type: InvoiceType;
  status: InvoiceStatus;
  total: number;
  notes?: string | null;
  created_at: string;
  issue_date?: string | null;
  due_date?: string | null;
  customers?: Customer | null;
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

export default function InvoiceDetailPage() {
  const { id } = useParams() as { id: string };
  const supabase = useMemo(() => getSupabaseClient(), []);
  const { organization: org, isOwnerOrAdmin } = useOrganization();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [voiding, setVoiding] = useState(false);

  useEffect(() => {
    let isMounted = true

    const load = async () => {
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

      if (isMounted) {
        setInvoice(inv);
        setItems(itemData || []);
        setLoading(false);
      }
    };

    if (id) load();

    return () => {
      isMounted = false;
    };
  }, [id, supabase]);

  const grandTotal = useMemo(() => {
    return items.reduce((s, it) => s + (it.total_price || 0), 0);
  }, [items]);

  const markAsPaid = async () => {
    if (!invoice || invoice.status === "paid") return;

    const ok = await confirm({
      title: "Mark this invoice as paid?",
      description: invoice.type === "sale" ? "This will deduct the sold items from stock." : undefined,
      confirmLabel: "Mark as Paid",
    });
    if (!ok) return;

    setPaying(true);

    // Single atomic RPC: flips status to paid AND decrements stock (for
    // sales) under a row lock — no more client-side loop of separate
    // decrease_stock calls that could partially fail.
    const { error } = await supabase.rpc("mark_invoice_paid", { p_invoice_id: invoice.id });

    setPaying(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setInvoice({ ...invoice, status: "paid" });
    toast.success("Invoice marked as paid");
  };

  const voidInvoice = async () => {
    if (!invoice || invoice.status === "void") return;

    const ok = await confirm({
      title: "Void this invoice?",
      description: "If it was already paid, stock will be restored.",
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

  if (loading || !invoice) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-deepgreen border-t-transparent animate-spin" />
      </div>
    );
  }

  const isRental = invoice.type === "rental";

  const downloadPDF = async () => {
    const element = document.getElementById("invoice");

    if (!element) return;

    // Save original style properties to restore later
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalPadding = element.style.padding;

    // Temporarily force fixed width for clean A4 printing layout
    element.style.width = "850px";
    element.style.maxWidth = "none";
    element.style.padding = "48px";

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // high quality
        useCORS: true,
        logging: false,
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

      pdf.save(`invoice-${invoice.invoice_number || invoice.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      // Restore original styling
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.padding = originalPadding;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Printable Invoice Container */}
      <div
        id="invoice"
        className="bg-white p-12 space-y-10 border border-slate-200/60 rounded-2xl shadow-md"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            {org?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={org.logo_url}
                alt="logo"
                className="h-16 w-16 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl uppercase tracking-wider">
                {org?.name ? org.name[0] : "B"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {org?.name || "Business Name"}
              </h1>
              <p className="text-sm text-slate-500">{org?.email}</p>
              <p className="text-sm text-slate-500">{org?.phone}</p>
              <p className="text-xs text-slate-400 mt-1">{org?.address}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <TypeBadge type={invoice.type} />
              <StatusBadge status={invoice.status} />
            </div>
            <h2 className="text-3xl font-light text-slate-800 tracking-tight">INVOICE</h2>
            <p className="text-sm font-mono text-slate-500 mt-0.5">
              #{invoice.invoice_number || invoice.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Invoice Info / Dates */}
        <div className="grid grid-cols-2 gap-12 text-sm pt-4">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billed To</h3>
            <p className="font-bold text-slate-800 text-base">{invoice.customers?.name}</p>
            {invoice.customers?.email && (
              <p className="text-slate-500">{invoice.customers.email}</p>
            )}
            {invoice.customers?.phone && (
              <p className="text-slate-500">{invoice.customers.phone}</p>
            )}
          </div>

          <div className="flex flex-col items-end text-right space-y-1.5 text-slate-600">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Details</h3>
            {invoice.issue_date && (
              <p>
                <span className="text-slate-400">Date Issued:</span>{" "}
                <span className="font-medium text-slate-800">
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
                <span className="text-slate-400">Due Date:</span>{" "}
                <span className="font-medium text-slate-800">
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
                <span className="text-slate-400">Rental Start:</span>{" "}
                <span className="font-medium text-slate-800">
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
                <span className="text-slate-400">Rental End:</span>{" "}
                <span className="font-medium text-slate-800">
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
              <tr className="border-y border-slate-200 bg-slate-50/50">
                <th className="p-3 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">Description</th>
                {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Start</th>}
                {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">End</th>}
                {isRental && <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Days</th>}
                <th className="p-3 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Qty</th>
                <th className="p-3 text-right font-bold text-slate-500 text-xs uppercase tracking-wider">Unit Price</th>
                <th className="p-3 text-right font-bold text-slate-500 text-xs uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => {
                const days = daysBetween(
                  it.start_date || invoice.start_date || undefined,
                  it.end_date || invoice.end_date || undefined,
                );
                return (
                  <tr key={it.id} className="text-slate-700">
                    <td className="p-3 font-medium text-slate-900">{it.name || "Product"}</td>
                    {isRental && (
                      <td className="p-3 text-center text-slate-500 whitespace-nowrap">
                        {it.start_date || invoice.start_date
                          ? new Date(it.start_date || invoice.start_date!).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    )}
                    {isRental && (
                      <td className="p-3 text-center text-slate-500 whitespace-nowrap">
                        {it.end_date || invoice.end_date
                          ? new Date(it.end_date || invoice.end_date!).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    )}
                    {isRental && <td className="p-3 text-center text-slate-500 font-mono">{days || "-"}</td>}
                    <td className="p-3 text-center text-slate-500 font-mono">{it.quantity}</td>
                    <td className="p-3 text-right text-slate-500 font-mono">₦{it.unit_price.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold text-slate-950 font-mono">₦{it.total_price.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Block */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <div className="w-full max-w-xs space-y-2.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono text-slate-700">₦{grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200/60 pt-2.5">
              <span>Total</span>
              <span className="font-mono text-slate-950">₦{(invoice.total ?? grandTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Bank & Payment Details */}
        {(org?.bank_name || org?.account_name || org?.account_number) && (
          <div className="border-t border-slate-100 pt-6 space-y-2 text-xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider">Payment Details</h4>
            <div className="grid grid-cols-3 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block mb-0.5">Bank</span>
                <span className="font-medium text-slate-800">{org?.bank_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Account Name</span>
                <span className="font-medium text-slate-800">{org?.account_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Account Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">{org?.account_number}</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {org?.payment_terms && (
          <div className="border-t border-slate-100 pt-6 space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider">Terms & Conditions</h4>
            <p className="text-slate-500 leading-relaxed whitespace-pre-line bg-slate-50/30 p-4 rounded-xl border border-slate-100/50">
              {org.payment_terms}
            </p>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-slate-100 pt-6 space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
            <p className="text-slate-500 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>

      {confirmDialog}

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
          <Button onClick={markAsPaid} loading={paying}>
            Mark as Paid
          </Button>
        )}
      </div>

      {/* Print tweaks */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff;
          }
          .print\:hidden {
            display: none !important;
          }
          #invoice {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
