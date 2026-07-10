"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiFileText, FiTrendingUp, FiClock, FiAlertCircle } from "react-icons/fi";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import { Card } from "@/app/components/ui/Card";
import { StatusBadge, TypeBadge } from "@/app/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { getExchangeRates, convertAmount } from "@/lib/currency";

type PaymentBreakdownItem = {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
  invoices: {
    invoice_number: string;
    currency: string;
    customers: {
      name: string;
    } | null;
  } | null;
  amountInBase: number;
};

type InvoiceBreakdownItem = {
  id: string;
  invoice_number: string;
  total: number;
  amount_paid: number;
  status: string;
  type: "sale" | "rental";
  currency: string;
  created_at: string;
  due_date: string | null;
  customers: {
    name: string;
  } | null;
  balanceDue: number;
  balanceDueInBase: number;
};

function BreakdownContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseClient();
  const { organization } = useOrganization();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"revenue" | "outstanding">(
    tabParam === "outstanding" ? "outstanding" : "revenue"
  );

  const [payments, setPayments] = useState<PaymentBreakdownItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceBreakdownItem[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalOutstanding: 0,
    outstandingCount: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const orgId = organization.id;
      const baseCurrency = organization.currency || "NGN";

      const [paymentsRes, invoicesRes, ratesData] = await Promise.all([
        supabase
          .from("payments")
          .select("id, amount, note, created_at, invoices(invoice_number, currency, customers(name))")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false }),
        supabase
          .from("invoices")
          .select("id, invoice_number, total, amount_paid, status, type, currency, created_at, due_date, customers(name)")
          .eq("organization_id", orgId)
          .neq("status", "void")
          .neq("status", "paid")
          .order("created_at", { ascending: false }),
        getExchangeRates(baseCurrency),
      ]);

      if (!isMounted) return;

      const fetchedPayments = (paymentsRes.data || []) as any[];
      const fetchedInvoices = (invoicesRes.data || []) as any[];

      // Calculate converted values
      let totalCollected = 0;
      const processedPayments = fetchedPayments.map((p) => {
        const invCurrency = p.invoices?.currency || baseCurrency;
        const amountInBase = convertAmount(p.amount, invCurrency, baseCurrency, ratesData);
        totalCollected += amountInBase;
        return {
          ...p,
          amountInBase,
        };
      });

      let totalOutstanding = 0;
      const processedInvoices = fetchedInvoices.map((inv) => {
        const paid = inv.amount_paid || 0;
        const balanceDue = Math.max(0, inv.total - paid);
        const balanceDueInBase = convertAmount(balanceDue, inv.currency, baseCurrency, ratesData);
        totalOutstanding += balanceDueInBase;
        return {
          ...inv,
          balanceDue,
          balanceDueInBase,
        };
      });

      setPayments(processedPayments);
      setInvoices(processedInvoices);
      setRates(ratesData);
      setSummary({
        totalCollected,
        totalOutstanding,
        outstandingCount: processedInvoices.length,
      });
      setLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [organization.id, organization.currency, supabase]);

  const baseCurrency = organization.currency || "NGN";

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (startDate) {
        const pDate = new Date(p.created_at);
        const filterStart = new Date(startDate);
        pDate.setHours(0, 0, 0, 0);
        filterStart.setHours(0, 0, 0, 0);
        if (pDate < filterStart) return false;
      }
      if (endDate) {
        const pDate = new Date(p.created_at);
        const filterEnd = new Date(endDate);
        pDate.setHours(0, 0, 0, 0);
        filterEnd.setHours(0, 0, 0, 0);
        if (pDate > filterEnd) return false;
      }
      return true;
    });
  }, [payments, startDate, endDate]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (startDate) {
        const invDate = new Date(inv.created_at);
        const filterStart = new Date(startDate);
        invDate.setHours(0, 0, 0, 0);
        filterStart.setHours(0, 0, 0, 0);
        if (invDate < filterStart) return false;
      }
      if (endDate) {
        const invDate = new Date(inv.created_at);
        const filterEnd = new Date(endDate);
        invDate.setHours(0, 0, 0, 0);
        filterEnd.setHours(0, 0, 0, 0);
        if (invDate > filterEnd) return false;
      }
      return true;
    });
  }, [invoices, startDate, endDate]);

  const dynamicSummary = useMemo(() => {
    const totalCollected = filteredPayments.reduce((sum, p) => sum + p.amountInBase, 0);
    const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.balanceDueInBase, 0);
    return {
      totalCollected,
      totalOutstanding,
      outstandingCount: filteredInvoices.length,
    };
  }, [filteredPayments, filteredInvoices]);

  const getDaysOverdue = (dueDateStr: string | null) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6 w-full text-dark dark:text-white">
      {/* Header Navigation */}
      <div className="flex items-center gap-2.5 mb-2">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] text-zinc-500 hover:text-dark dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Back"
        >
          <FiArrowLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-zinc-550 dark:text-zinc-400">Back to dashboard</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-dark dark:text-white">Financial Breakdown</h1>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tracking-wider uppercase">Ledger details</span>
      </div>

      {/* Overview stats cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 uppercase font-medium">Total collected</p>
            <p className="text-lg font-bold font-mono mt-0.5">{formatCurrency(dynamicSummary.totalCollected, baseCurrency)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-xl">
            <FiClock size={20} />
          </div>
          <div>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 uppercase font-medium">Total outstanding</p>
            <p className="text-lg font-bold font-mono mt-0.5">{formatCurrency(dynamicSummary.totalOutstanding, baseCurrency)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3.5 bg-zinc-100 dark:bg-[#1A1A1C] text-zinc-650 dark:text-zinc-350 rounded-xl">
            <FiFileText size={20} />
          </div>
          <div>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 uppercase font-medium">Active invoices</p>
            <p className="text-lg font-bold font-mono mt-0.5">{dynamicSummary.outstandingCount} open bills</p>
          </div>
        </Card>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-zinc-800 gap-3">
        <div className="flex">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "revenue"
                ? "border-[#355834] text-[#355834] dark:border-[#8BB174] dark:text-[#8BB174]"
                : "border-transparent text-zinc-500 hover:text-dark dark:hover:text-white"
            }`}
          >
            Revenue collected
          </button>
          <button
            onClick={() => setActiveTab("outstanding")}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "outstanding"
                ? "border-[#355834] text-[#355834] dark:border-[#8BB174] dark:text-[#8BB174]"
                : "border-transparent text-zinc-500 hover:text-dark dark:hover:text-white"
            }`}
          >
            Outstanding breakdown
          </button>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pb-2.5 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-zinc-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-0 p-0 text-dark dark:text-white focus:ring-0 focus:outline-none text-xs cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-zinc-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-0 p-0 text-dark dark:text-white focus:ring-0 focus:outline-none text-xs cursor-pointer"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs text-zinc-500 hover:text-dark dark:hover:text-white font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Ledger Listing */}
      {loading ? (
        <Card className="p-8 text-center animate-pulse">Loading transaction breakdown records...</Card>
      ) : activeTab === "revenue" ? (
        filteredPayments.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-zinc-555 dark:text-zinc-400">
            <FiAlertCircle size={28} className="mb-2 text-zinc-400" />
            <p className="font-semibold text-sm">{payments.length === 0 ? "No revenue transactions recorded yet" : "No revenue match your date filter"}</p>
            <p className="text-xs mt-1">{payments.length === 0 ? "Record payments on invoices to build your ledger." : "Try adjusting your dates or clear filters."}</p>
          </Card>
        ) : (
          <div className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-[#1A1A1C] border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Date</th>
                    <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Customer</th>
                    <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Invoice #</th>
                    <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Notes</th>
                    <th className="p-4 text-right font-semibold text-zinc-550 dark:text-zinc-400">Amount</th>
                    <th className="p-4 text-right font-semibold text-zinc-550 dark:text-zinc-400">Home value ({baseCurrency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                  {filteredPayments.map((p) => {
                    const inv = p.invoices;
                    const custName = inv?.customers?.name || "N/A";
                    const isMultiCurrency = (inv?.currency || baseCurrency) !== baseCurrency;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 text-zinc-655 dark:text-zinc-300">
                        <td className="p-4 text-xs font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold text-dark dark:text-white">{custName}</td>
                        <td className="p-4 font-mono font-medium text-zinc-650 dark:text-zinc-400">{inv?.invoice_number || "—"}</td>
                        <td className="p-4 text-xs text-zinc-500 max-w-[200px] truncate">{p.note || "—"}</td>
                        <td className="p-4 text-right font-mono font-medium">
                          {formatCurrency(p.amount, inv?.currency || baseCurrency)}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-dark dark:text-white">
                          {formatCurrency(p.amountInBase, baseCurrency)}
                          {isMultiCurrency && <span className="text-[10px] text-zinc-450 ml-1 font-sans font-normal">(conv.)</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : filteredInvoices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-zinc-555 dark:text-zinc-400">
          <FiAlertCircle size={28} className="mb-2 text-zinc-400" />
          <p className="font-semibold text-sm">{invoices.length === 0 ? "No outstanding balances recorded" : "No outstanding bills match your date filter"}</p>
          <p className="text-xs mt-1">{invoices.length === 0 ? "All invoices are settled or voided." : "Try adjusting your dates or clear filters."}</p>
        </Card>
      ) : (
        <div className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#1A1A1C] border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4 text-left font-semibold text-zinc-555 dark:text-zinc-400">Invoice #</th>
                  <th className="p-4 text-left font-semibold text-zinc-555 dark:text-zinc-400">Customer</th>
                  <th className="p-4 text-left font-semibold text-zinc-555 dark:text-zinc-400">Type</th>
                  <th className="p-4 text-left font-semibold text-zinc-555 dark:text-zinc-400">Status</th>
                  <th className="p-4 text-center font-semibold text-zinc-555 dark:text-zinc-400">Due date</th>
                  <th className="p-4 text-center font-semibold text-zinc-555 dark:text-zinc-400">Overdue</th>
                  <th className="p-4 text-right font-semibold text-zinc-555 dark:text-zinc-400">Owed</th>
                  <th className="p-4 text-right font-semibold text-zinc-555 dark:text-zinc-400">Home value ({baseCurrency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filteredInvoices.map((inv) => {
                  const custName = inv.customers?.name || "N/A";
                  const days = getDaysOverdue(inv.due_date);
                  const isMultiCurrency = inv.currency !== baseCurrency;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 text-zinc-655 dark:text-zinc-300">
                      <td className="p-4 font-mono font-bold text-dark dark:text-white">{inv.invoice_number}</td>
                      <td className="p-4 text-zinc-650 dark:text-zinc-200">{custName}</td>
                      <td className="p-4">
                        <TypeBadge type={inv.type} />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={inv.status as any} />
                      </td>
                      <td className="p-4 text-center text-xs font-mono">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</td>
                      <td className="p-4 text-center font-medium">
                        {days > 0 ? (
                          <span className="text-red-500 font-mono text-xs">{days} days</span>
                        ) : (
                          <span className="text-zinc-450 dark:text-zinc-550 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-medium">
                        {formatCurrency(inv.balanceDue, inv.currency)}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-dark dark:text-white">
                        {formatCurrency(inv.balanceDueInBase, baseCurrency)}
                        {isMultiCurrency && <span className="text-[10px] text-zinc-400 ml-1 font-sans font-normal">(conv.)</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BreakdownPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500 animate-pulse">Loading breakdown ledger...</div>}>
      <BreakdownContent />
    </Suspense>
  );
}
