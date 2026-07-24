"use client";

import { useEffect, useState, use, useMemo } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import { FiClock, FiCalendar, FiBriefcase, FiCheckCircle, FiFileText, FiCheck, FiInfo, FiLayers, FiPrinter, FiDownload, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

type ProposalData = {
  id: string;
  invoice_number: string;
  currency: string;
  notes: string | null;
  pricing_options: {
    hourly?: { rate: number; quantity: number; label: string };
    daily?: { rate: number; quantity: number; label: string };
    flat?: { rate: number; quantity: number; label: string };
  } | null;
  selected_pricing_option: string | null;
  status: string;
  customer_name: string;
  org_name: string;
  org_logo_url: string | null;
};

const MOCK_PROPOSAL: ProposalData = {
  id: "mock",
  invoice_number: "INV-2026-0042",
  currency: "USD",
  notes: `We are pleased to submit this service proposal for the Frontend UI Redesign & Brand Integration project.

Our scope of work encompasses:
• Redesigning client portal public pages to feature modern glassmorphic layouts, responsive elements, and clean animations.
• Constructing a reusable premium component library utilizing React, Tailwind CSS, and Framer Motion.
• Enhancing the billing and invoice dashboard layouts with premium interactions and responsive grid tables.
• Integrating complete dark/light mode toggles with optimized transition periods.

Please review the pricing options below and select the payment model that best matches your organization's budget and timeline preferences.`,
  pricing_options: {
    hourly: {
      rate: 90,
      quantity: 45,
      label: "Flexible hourly engagement model for ad-hoc changes & ongoing dev support."
    },
    daily: {
      rate: 680,
      quantity: 6,
      label: "Dedicated developer days focusing 105% of the daily cycles on your backlog items."
    },
    flat: {
      rate: 3500,
      quantity: 1,
      label: "Fixed-scope milestone package with guaranteed delivery timelines and budget safety."
    }
  },
  selected_pricing_option: null,
  status: "proposal",
  customer_name: "Acme Industries",
  org_name: "Vortex Creative Ltd",
  org_logo_url: null
};

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
          <p key={idx} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium pl-1.5 text-left bg-slate-50/50 dark:bg-zinc-850/20 p-4 rounded-2xl border border-slate-100/50 dark:border-zinc-800/30">
            {cleanLine}
          </p>
        );
      })}
    </div>
  );
};

export default function PublicProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectionSuccess, setSelectionSuccess] = useState(false);

  const parsedServiceNotes = useMemo(() => {
    if (!proposal?.notes) return { name: "", description: "" };
    try {
      const parsed = JSON.parse(proposal.notes);
      if (parsed && typeof parsed === "object" && "name" in parsed) {
        return {
          name: parsed.name || "",
          description: parsed.description || "",
        };
      }
    } catch (e) {
      // Ignored
    }
    return { name: "", description: proposal.notes };
  }, [proposal?.notes]);

  useEffect(() => {
    if (id === "mock") {
      setProposal(MOCK_PROPOSAL);
      setLoading(false);
      return;
    }
    if (id === "mock-success") {
      setProposal({
        ...MOCK_PROPOSAL,
        status: "draft",
        selected_pricing_option: "flat"
      });
      setSelectionSuccess(true);
      setLoading(false);
      return;
    }

    const fetchProposal = async () => {
      setLoading(true);
      try {
        const { data, error: rpcError } = await supabase.rpc("get_public_proposal", {
          p_invoice_id: id,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        if (!data || data.length === 0) {
          throw new Error("Proposal not found or invalid link.");
        }

        setProposal(data[0] as ProposalData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load proposal details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const [pendingChoice, setPendingChoice] = useState<{
    option: "hourly" | "daily" | "flat";
    rate: number;
    quantity: number;
    label: string;
  } | null>(null);

  const handleSelectOption = (option: "hourly" | "daily" | "flat") => {
    if (!proposal || submitting) return;
    const optData = proposal.pricing_options?.[option];
    if (!optData) return;
    setPendingChoice({
      option,
      rate: optData.rate,
      quantity: optData.quantity,
      label: optData.label || ""
    });
  };

  const executeOptionSelection = async () => {
    if (!proposal || !pendingChoice || submitting) return;
    const option = pendingChoice.option;
    setSubmitting(true);
    setPendingChoice(null);

    if (proposal.id === "mock") {
      setTimeout(() => {
        setSelectionSuccess(true);
        setProposal((prev) =>
          prev
            ? {
                ...prev,
                status: "draft",
                selected_pricing_option: option,
              }
            : null
        );
        setSubmitting(false);
      }, 800);
      return;
    }

    try {
      const { error: rpcError } = await supabase.rpc("select_invoice_pricing_option", {
        p_invoice_id: proposal.id,
        p_option: option,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      setSelectionSuccess(true);
      setProposal((prev) =>
        prev
          ? {
              ...prev,
              status: "draft",
              selected_pricing_option: option,
            }
          : null
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to lock in your pricing choice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070809] text-zinc-600 dark:text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#355834] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide animate-pulse">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070809] p-4 text-zinc-600 dark:text-zinc-400">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-650 dark:text-red-400 mx-auto mb-4">
            <FiFileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-dark dark:text-white mb-2">Failed to load proposal</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{error || "The proposal link is invalid or expired."}</p>
        </div>
      </div>
    );
  }

  const isProposalPending = proposal.status === "proposal";
  const options = proposal.pricing_options || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#070809] dark:to-[#0f1115] py-16 px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decorative Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-[#355834]/5 dark:bg-green-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[50%] bg-[#355834]/5 dark:bg-green-555/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        
        {/* Proposal Branding Header */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
          className="backdrop-blur-md bg-white/70 dark:bg-zinc-900/60 border border-slate-200/50 dark:border-zinc-800/60 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group"
        >
          {/* Glassmorphic border glow line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#355834]/20 dark:via-green-500/25 to-transparent" />
          
          <div className="flex items-center gap-4">
            {proposal.org_logo_url ? (
              <img
                src={proposal.org_logo_url}
                alt={proposal.org_name}
                className="w-14 h-14 rounded-2xl object-contain bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-1 shadow-inner"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#355834]/15 to-[#355834]/5 dark:from-[#355834]/30 dark:to-transparent flex items-center justify-center font-extrabold text-xl text-[#355834] dark:text-green-400 border border-[#355834]/10 dark:border-green-800/30 shadow-sm">
                {proposal.org_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-xl text-dark dark:text-white tracking-tight leading-none mb-2">{proposal.org_name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#355834]/10 dark:bg-[#355834]/20 text-[#355834] dark:text-green-400 border border-[#355834]/10 dark:border-green-800/30 uppercase tracking-wide">
                  Proposal
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-medium">#{proposal.invoice_number}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 dark:border-zinc-800/60 pt-4 md:pt-0">
            <div className="text-left md:text-right">
              <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Prepared For</span>
              <span className="font-bold text-base text-zinc-700 dark:text-zinc-200">{proposal.customer_name}</span>
            </div>
          </div>
        </motion.div>

        {/* Success or Existing Selection State */}
        {(() => {
          const selectedOpt = proposal.selected_pricing_option;
          const chosenPlan = selectedOpt ? proposal.pricing_options?.[selectedOpt as "hourly" | "daily" | "flat"] : null;
          
          if (!selectionSuccess && isProposalPending) return null;
          
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }}
              className="backdrop-blur-md bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] border border-emerald-500/20 dark:border-emerald-500/15 p-8 rounded-3xl text-center space-y-6 relative overflow-hidden print:hidden"
            >
              {/* Background pattern */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mx-auto shadow-sm border border-emerald-500/20">
                <FiCheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 tracking-tight">
                  Billing Plan Confirmed!
                </h2>
                <p className="text-sm text-zinc-650 dark:text-zinc-355 leading-relaxed max-w-lg mx-auto font-medium">
                  Thank you! You have selected the <strong className="uppercase text-emerald-700 dark:text-emerald-400">{proposal.selected_pricing_option}</strong> option for this engagement. 
                  The team at <strong>{proposal.org_name}</strong> is finalizing your official invoice details now.
                </p>
              </div>

              {/* Premium Plan Details Summary Card */}
              {chosenPlan && (
                <div className="bg-white/60 dark:bg-zinc-950/40 border border-slate-200/50 dark:border-zinc-800/40 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-inner relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-deepgreen/5 to-transparent rounded-bl-full pointer-events-none" />
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500">Locked-in Plan Details</h4>
                  
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-800/60 pb-3">
                    <div>
                      <h5 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 capitalize">{proposal.selected_pricing_option} Rate Plan</h5>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">{chosenPlan.label || "Service billing contract rate."}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
                        {formatCurrency(chosenPlan.rate, proposal.currency)}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">/ {proposal.selected_pricing_option === "hourly" ? "hr" : proposal.selected_pricing_option === "daily" ? "day" : "fixed"}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-zinc-650 dark:text-zinc-400 pt-1">
                    <span>Estimated Volume</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">{chosenPlan.quantity} {proposal.selected_pricing_option === "hourly" ? "hrs" : proposal.selected_pricing_option === "daily" ? "days" : "project"}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-slate-200 dark:border-zinc-800 pt-3 flex justify-between items-center font-bold text-sm text-zinc-800 dark:text-zinc-200">
                    <span className="text-xs text-zinc-550 dark:text-zinc-400">Total Contract Value</span>
                    <span className="font-mono text-deepgreen dark:text-lightgreen">
                      {formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl shadow-sm text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Locked Selection: {proposal.selected_pricing_option?.toUpperCase()} PLAN
                </div>
                
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#355834] dark:bg-lightgreen text-white dark:text-dark rounded-2xl font-bold text-xs hover:opacity-90 shadow-sm transition-all cursor-pointer select-none"
                >
                  <FiPrinter className="w-3.5 h-3.5" /> Download / Print Invoice
                </button>
              </div>

              {/* Show Invoice Sheet directly in the web view as a preview! */}
              <div className="border-t border-slate-200/50 dark:border-zinc-800/60 pt-6 space-y-3">
                <h4 className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Invoice Document Preview</h4>
                
                <div 
                  className="bg-white dark:bg-zinc-950 text-dark dark:text-white p-6 md:p-8 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-inner space-y-6 overflow-hidden text-left"
                >
                  <div className="flex justify-between items-start border-b border-slate-150 dark:border-zinc-900 pb-4">
                    <div className="flex items-center gap-3">
                      {proposal.org_logo_url ? (
                        <img
                          src={proposal.org_logo_url}
                          alt="logo"
                          className="h-10 w-10 object-cover rounded-lg border border-[#e2e8f0] dark:border-zinc-800"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider bg-zinc-900"
                        >
                          {proposal.org_name ? proposal.org_name[0] : "B"}
                        </div>
                      )}
                      <div>
                        <h2 className="text-sm font-bold text-zinc-850 dark:text-zinc-100">{proposal.org_name}</h2>
                        <p className="text-[9px] text-zinc-400">Service Provider</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-100 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border border-emerald-200/30 uppercase tracking-widest">
                        Accepted
                      </span>
                      <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">#{proposal.invoice_number}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="space-y-0.5">
                      <span className="block text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Prepared For</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{proposal.customer_name}</span>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="block text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Plan Selected</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 capitalize">{proposal.selected_pricing_option} Rate Plan</span>
                    </div>
                  </div>

                  {parsedServiceNotes.name && (
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/50 space-y-2">
                      <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-deepgreen dark:text-lightgreen border-b border-slate-100/50 dark:border-zinc-900 pb-1">
                        {parsedServiceNotes.name}
                      </h4>
                      <div className="text-[10px] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-0.5 whitespace-pre-line">
                        {parsedServiceNotes.description}
                      </div>
                    </div>
                  )}

                  {chosenPlan && (
                    <div className="pt-2">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }} className="dark:bg-zinc-900/30 dark:border-zinc-900">
                            <th className="p-2 text-left font-bold text-[8px] uppercase tracking-wider text-zinc-500">Description</th>
                            <th className="p-2 text-center font-bold text-[8px] uppercase tracking-wider text-zinc-500">Qty</th>
                            <th className="p-2 text-right font-bold text-[8px] uppercase tracking-wider text-zinc-500">Unit Price</th>
                            <th className="p-2 text-right font-bold text-[8px] uppercase tracking-wider text-zinc-500">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: "1px solid #f1f5f9" }} className="dark:border-zinc-900">
                            <td className="p-2 font-medium text-zinc-800 dark:text-zinc-200">
                              {chosenPlan.label || `${proposal.selected_pricing_option?.toUpperCase()} billing plan`}
                            </td>
                            <td className="p-2 text-center font-mono text-zinc-600 dark:text-zinc-400">
                              {chosenPlan.quantity}
                            </td>
                            <td className="p-2 text-right font-mono text-zinc-600 dark:text-zinc-400">
                              {formatCurrency(chosenPlan.rate, proposal.currency)}
                            </td>
                            <td className="p-2 text-right font-semibold font-mono text-zinc-800 dark:text-zinc-100">
                              {formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {chosenPlan && (
                    <div className="flex justify-end pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                      <div className="w-full max-w-[180px] space-y-1 text-[10px]">
                        <div className="flex justify-between text-zinc-500">
                          <span>Subtotal</span>
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                        </div>
                        <div
                          className="flex justify-between font-bold text-xs pt-1 text-deepgreen dark:text-lightgreen"
                          style={{ borderTop: "1px solid #f1f5f9" }}
                        >
                          <span>Total</span>
                          <span className="font-mono">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps Timeline */}
              <div className="border-t border-slate-200/50 dark:border-zinc-800/60 pt-6 max-w-md mx-auto space-y-4">
                <h4 className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Next Steps Timeline</h4>
                <div className="relative pl-6 space-y-6 text-left border-l border-slate-200 dark:border-zinc-800 ml-3">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070809] flex items-center justify-center">
                      <FiCheck className="w-2.5 h-2.5 text-white" />
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Pricing Option Selected</h5>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Choice locked in to {proposal.selected_pricing_option?.toUpperCase()} billing model.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070809] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Invoice Generation & Finalization</h5>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">The agency is drafting the invoice items based on the selected choice.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 border-2 border-white dark:border-[#070809]" />
                    <div>
                      <h5 className="text-xs font-bold text-zinc-650 dark:text-zinc-400">Secure Payment Link Delivered</h5>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">You will receive an email notice once the invoice is ready for checkout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Printable Invoice Sheet (Clean design, strictly for print) */}
        {(() => {
          const selectedOpt = proposal.selected_pricing_option;
          const chosenPlan = selectedOpt ? proposal.pricing_options?.[selectedOpt as "hourly" | "daily" | "flat"] : null;
          if (!chosenPlan || (isProposalPending && !selectionSuccess)) return null;
          return (
            <>
              {/* CSS Print Overrides */}
              <style jsx global>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #invoice-sheet, #invoice-sheet * {
                    visibility: visible !important;
                  }
                  #invoice-sheet {
                    display: block !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    color: black !important;
                  }
                }
              `}</style>
              
              <div 
                id="invoice-sheet"
                className="hidden print:block bg-white text-black p-12 border border-slate-250 rounded-2xl shadow-none space-y-10 overflow-hidden text-left"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#f1f5f9] pb-8">
                  <div className="flex items-center gap-4">
                    {proposal.org_logo_url ? (
                      <img
                        src={proposal.org_logo_url}
                        alt="logo"
                        className="h-16 w-16 object-cover rounded-xl border border-[#e2e8f0]"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase tracking-wider bg-zinc-900"
                      >
                        {proposal.org_name ? proposal.org_name[0] : "B"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">{proposal.org_name}</h2>
                      <p className="text-xs text-zinc-550">Service Provider</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-105 text-emerald-800 border border-emerald-200 uppercase tracking-widest">
                      Accepted
                    </span>
                    <p className="text-sm font-mono text-zinc-800 font-bold mt-2">#{proposal.invoice_number}</p>
                  </div>
                </div>

                {/* Client & Date Details */}
                <div className="grid grid-cols-2 gap-8 text-xs">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prepared For</span>
                    <span className="font-bold text-base text-zinc-800">{proposal.customer_name}</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Plan Selected</span>
                    <span className="font-bold text-sm text-zinc-800 capitalize">{proposal.selected_pricing_option} Rate Plan</span>
                  </div>
                </div>

                {/* Service Details Card */}
                {parsedServiceNotes.name && (
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#355834] border-b border-slate-100 pb-2">
                      {parsedServiceNotes.name}
                    </h4>
                    <div className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line">
                      {parsedServiceNotes.description}
                    </div>
                  </div>
                )}

                {/* Items table showing virtual item */}
                <div className="pt-6">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                        <th className="p-3 text-left font-bold text-[10px] uppercase tracking-wider text-zinc-500">Description</th>
                        <th className="p-3 text-center font-bold text-[10px] uppercase tracking-wider text-zinc-500">Qty</th>
                        <th className="p-3 text-right font-bold text-[10px] uppercase tracking-wider text-zinc-500">Unit Price</th>
                        <th className="p-3 text-right font-bold text-[10px] uppercase tracking-wider text-zinc-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td className="p-3 font-semibold text-zinc-800">
                          {chosenPlan.label || `${proposal.selected_pricing_option?.toUpperCase()} billing plan`}
                        </td>
                        <td className="p-3 text-center font-mono text-zinc-600">
                          {chosenPlan.quantity}
                        </td>
                        <td className="p-3 text-right font-mono text-zinc-600">
                          {formatCurrency(chosenPlan.rate, proposal.currency)}
                        </td>
                        <td className="p-3 text-right font-semibold font-mono text-zinc-800">
                          {formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary Block */}
                <div className="flex justify-end pt-6" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <div className="w-full max-w-xs space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span className="font-mono text-zinc-800">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                    </div>
                    <div
                      className="flex justify-between font-bold text-sm pt-2 text-[#355834]"
                      style={{ borderTop: "1px solid #355834" }}
                    >
                      <span>Total contract value</span>
                      <span className="font-mono text-[#355834]">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Detailed Notes / Overview */}
        {proposal.notes && (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/60 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden text-left"
          >
            {/* Accent border bar on left */}
            <div className="absolute left-0 top-6 bottom-6 w-[4px] rounded-r bg-gradient-to-b from-deepgreen to-lightgreen" />
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#355834]/10 dark:bg-emerald-500/10 text-[#355834] dark:text-emerald-400 flex items-center justify-center">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                    Project Scope & Deliverables
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Specifications and alignment criteria</p>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/15 shadow-sm">
                Official Proposal
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
          </motion.div>
        )}

        {/* Active Rate Options Selection */}
        {isProposalPending && (
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6"
          >
            <div className="space-y-1 px-1">
              <h3 className="font-extrabold text-sm uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                Choose Your Preferred Pricing Plan
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">Select one of the models below to align on terms and request final invoicing.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              
              {/* Hourly Plan Card */}
              {options.hourly && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-zinc-800/80 hover:border-[#355834]/40 dark:hover:border-green-800/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 transition-colors duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shadow-inner">
                        <FiClock className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                        Flexible
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-dark dark:text-white tracking-tight">Hourly Plan</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{options.hourly.label || "Billing by the hour"}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-50 dark:border-zinc-900">
                      <span className="text-3xl font-extrabold text-dark dark:text-white font-mono tracking-tight">
                        {formatCurrency(options.hourly.rate, proposal.currency)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold"> / hr</span>
                    </div>

                    {/* Features list */}
                    <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Pay only for active hours</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Est. Duration: <strong>{options.hourly.quantity} hrs</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Timesheet breakdowns</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4 mt-auto">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Est. Plan Total</span>
                      <span className="text-lg font-extrabold text-dark dark:text-white font-mono">
                        {formatCurrency(options.hourly.rate * options.hourly.quantity, proposal.currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectOption("hourly")}
                      disabled={submitting}
                      className="w-full py-3 border border-[#355834] hover:bg-[#355834]/5 text-[#355834] dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-500/5 active:scale-[0.98] text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : "Select Hourly Plan"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Daily Plan Card */}
              {options.daily && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-zinc-800/80 hover:border-[#355834]/40 dark:hover:border-green-800/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 transition-colors duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shadow-inner">
                        <FiCalendar className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800/80 text-zinc-650 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                        Sprints
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-dark dark:text-white tracking-tight">Daily Plan</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{options.daily.label || "Billing by the day"}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-50 dark:border-zinc-900">
                      <span className="text-3xl font-extrabold text-dark dark:text-white font-mono tracking-tight">
                        {formatCurrency(options.daily.rate, proposal.currency)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold"> / day</span>
                    </div>

                    {/* Features list */}
                    <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Dedicated full-day focus</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Est. Duration: <strong>{options.daily.quantity} days</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Rapid task progression</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4 mt-auto">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Est. Plan Total</span>
                      <span className="text-lg font-extrabold text-dark dark:text-white font-mono">
                        {formatCurrency(options.daily.rate * options.daily.quantity, proposal.currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectOption("daily")}
                      disabled={submitting}
                      className="w-full py-3 border border-[#355834] hover:bg-[#355834]/5 text-[#355834] dark:border-green-500/40 dark:text-green-400 dark:hover:bg-green-500/5 active:scale-[0.98] text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : "Select Daily Plan"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Flat/Project Plan Card */}
              {options.flat && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-[#121214] border border-[#355834]/40 dark:border-green-800/30 hover:border-[#355834] dark:hover:border-green-600 rounded-3xl p-6 shadow-md flex flex-col justify-between gap-6 transition-colors duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#355834]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#355834]/15 dark:bg-[#355834]/30 text-[#355834] dark:text-green-400 flex items-center justify-center shadow-inner border border-[#355834]/10">
                        <FiBriefcase className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#355834]/15 dark:bg-[#355834]/30 text-[#355834] dark:text-green-400 border border-[#355834]/20 dark:border-green-800/40 text-[9px] font-bold uppercase tracking-wider">
                        Predictable
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-dark dark:text-white tracking-tight">Fixed Plan</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{options.flat.label || "One-time project fee"}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-50 dark:border-zinc-900">
                      <span className="text-3xl font-extrabold text-dark dark:text-white font-mono tracking-tight">
                        {formatCurrency(options.flat.rate, proposal.currency)}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold"> flat fee</span>
                    </div>

                    {/* Features list */}
                    <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>100% budget certainty</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Scope: <strong>{options.flat.quantity} project</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheck className="text-[#355834] dark:text-green-400 w-3.5 h-3.5 shrink-0" />
                        <span>Guaranteed scope delivery</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-4 mt-auto">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Est. Plan Total</span>
                      <span className="text-lg font-extrabold text-dark dark:text-white font-mono">
                        {formatCurrency(options.flat.rate * options.flat.quantity, proposal.currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectOption("flat")}
                      disabled={submitting}
                      className="w-full py-3 bg-[#355834] hover:bg-[#2c472c] text-white active:scale-[0.98] text-xs font-bold rounded-2xl transition-all shadow-md shadow-[#355834]/15 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : "Select Fixed Plan"}
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}

      {/* Custom Confirmation Modal */}
      {pendingChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-deepgreen/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-between items-start text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-deepgreen/10 dark:bg-lightgreen/10 text-deepgreen dark:text-lightgreen flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-800 dark:text-zinc-150">
                    Confirm Plan Selection
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Please review your billing terms</p>
                </div>
              </div>
              <button 
                onClick={() => setPendingChoice(null)} 
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl border border-slate-100 dark:border-zinc-900 space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400 text-left">
              <p>
                You are about to select the <strong className="capitalize text-zinc-850 dark:text-zinc-200">{pendingChoice.option} Plan</strong>. This will lock in the billing rate and transition the proposal to draft status.
              </p>
              <div className="flex justify-between items-center py-2.5 border-t border-b border-dashed border-slate-200 dark:border-zinc-850 font-bold text-zinc-800 dark:text-zinc-200">
                <span className="text-xs text-zinc-500 font-normal">Contract Rate</span>
                <span className="font-mono text-deepgreen dark:text-lightgreen">
                  {formatCurrency(pendingChoice.rate, proposal.currency)} / {pendingChoice.option === "hourly" ? "hr" : pendingChoice.option === "daily" ? "day" : "fixed"}
                </span>
              </div>
              <div className="flex justify-between items-center font-bold text-zinc-850 dark:text-zinc-200">
                <span className="text-xs text-zinc-500 font-normal">Proposed Total</span>
                <span className="font-mono text-lg text-deepgreen dark:text-lightgreen">
                  {formatCurrency(pendingChoice.rate * pendingChoice.quantity, proposal.currency)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPendingChoice(null)}
                className="flex-1 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeOptionSelection}
                className="flex-1 py-3 bg-[#355834] hover:bg-[#2c472c] dark:bg-lightgreen dark:text-dark text-white rounded-2xl font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm Choice
              </button>
            </div>
          </motion.div>
        </div>
      )}

      </motion.div>
    </div>
  );
}
