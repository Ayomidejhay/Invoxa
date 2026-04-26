"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ---------------- TYPES ----------------
type Customer = { name: string; email?: string; phone?: string };

type Organization = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string | null;
  payment_terms?: string | null;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
};

type Invoice = {
  id: string;
  invoice_number?: string | null;
  type: "sale" | "rental";
  status: "draft" | "sent" | "paid";
  total: number;
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
  product_id: string;
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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user?.id)
        .single();

      const { data: organization } = await supabase
        .from("organizations")
        .select(
          "name, email, phone, address, logo_url, payment_terms, bank_name, account_name, account_number",
        )
        .eq("id", profile?.organization_id)
        .single();

      if (isMounted) {
        setInvoice(inv);
        setItems(itemData || []);
        setOrg(organization);
        setLoading(false);
      }
    };

    if (id) load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const grandTotal = useMemo(() => {
    return items.reduce((s, it) => s + (it.total_price || 0), 0);
  }, [items]);

  const markAsPaid = async () => {
    if (!invoice || invoice.status === "paid") return;
    setPaying(true);

    await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoice.id);

    // Stock deduction ONLY for sales
    if (invoice.type === "sale") {
      for (const it of items) {
        await supabase.rpc("decrease_stock", {
          product_id: it.product_id,
          qty: it.quantity,
        });
      }
    }

    setPaying(false);
    location.reload();
  };

  if (loading || !invoice) return <p>Loading...</p>;

  const isRental = invoice.type === "rental";

  // const downloadPDF = async () => {
  //   const element = document.getElementById("invoice");

  //   if (!element) return;

  //   const canvas = await html2canvas(element, {
  //     scale: 2, // high quality
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const imgWidth = 210;
  //   const pageHeight = 295;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   let heightLeft = imgHeight;
  //   let position = 0;

  //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //   heightLeft -= pageHeight;

  //   while (heightLeft > 0) {
  //     position = heightLeft - imgHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //   }

  //   pdf.save(`invoice-${invoice.invoice_number || invoice.id}.pdf`);
  // };

  return (
    <div
      id="invoice"
      className="bg-white max-w-4xl mx-auto p-10 space-y-8 print:p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {org?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logo_url} alt="logo" className="h-20 w-auto" />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {org?.name || "Business Name"}
            </h1>
            <p className="text-sm text-gray-600">{org?.email}</p>
            <p className="text-sm text-gray-600">{org?.phone}</p>
            <p className="text-sm text-gray-600">{org?.address}</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-semibold">INVOICE</h2>
          <p className="text-sm">
            #{invoice.invoice_number || invoice.id.slice(0, 8)}
          </p>
          <p className="text-sm mt-1">
            Invoice Type: <span className="capitalize">{invoice.type}</span>
          </p>
          {invoice.issue_date && (
            <p className="text-sm">
              Issue: {new Date(invoice.issue_date).toLocaleDateString()}
            </p>
          )}
          {invoice.due_date && (
            <p className="text-sm">
              Due: {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          )}
          {isRental && (
            <p className="text-sm">
              Start Date:
              {invoice.start_date
                ? new Date(invoice.start_date).toLocaleDateString()
                : "-"}
            </p>
          )}
          {isRental && (
            <p className="text-sm">
              End Date:
              {invoice.end_date
                ? new Date(invoice.end_date).toLocaleDateString()
                : "-"}
            </p>
          )}
          {/* {isRental && (
                    <p className="p-3 text-center">{days || '-'}</p>
                  )} */}
        </div>
      </div>

      {/* Bill To */}
      <div>
        <h3 className="font-semibold mb-1">Bill To</h3>
        <p>{invoice.customers?.name}</p>
        {invoice.customers?.email && (
          <p className="text-sm text-gray-600">{invoice.customers.email}</p>
        )}
        {invoice.customers?.phone && (
          <p className="text-sm text-gray-600">{invoice.customers.phone}</p>
        )}
      </div>

      {/* Items */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Item</th>
              {/* {isRental && <th className="p-3 text-center">Start</th>}
              {isRental && <th className="p-3 text-center">End</th>}
              {isRental && <th className="p-3 text-center">Days</th>} */}
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Unit</th>
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const days = daysBetween(
                it.start_date || undefined,
                it.end_date || undefined,
              );
              return (
                <tr key={it.id} className="border-t">
                  <td className="p-3">{it.name || "Product"}</td>

                  <td className="p-3 text-center">{it.quantity}</td>
                  <td className="p-3 text-center">₦{it.unit_price}</td>
                  <td className="p-3 text-center">₦{it.total_price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{grandTotal}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>₦{invoice.total ?? grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Bank / Payment Details */}
      {(org?.bank_name || org?.account_name || org?.account_number) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Payment Details</h4>
          <p className="text-sm">Bank: {org?.bank_name}</p>
          <p className="text-sm">Account Name: {org?.account_name}</p>
          <p className="text-sm">Account Number: {org?.account_number}</p>
        </div>
      )}

      {/* Terms */}
      {org?.payment_terms && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Terms</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {org.payment_terms}
          </p>
        </div>
      )}

      {/* Actions (hidden on print) */}
      {invoice.status !== "paid" && (
        <div className="flex justify-end gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border rounded-lg"
          >
            Print
          </button>

          <button
            onClick={markAsPaid}
            disabled={paying}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            {paying ? "Processing..." : "Mark as Paid"}
          </button>
          {/* <button onClick={downloadPDF} className="px-4 py-2 border rounded-lg">
            Download PDF
          </button> */}
        </div>
      )}

      {/* Print tweaks */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
