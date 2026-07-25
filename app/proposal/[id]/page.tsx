"use client";

import { useEffect, useState, use, useMemo } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/format";
import { FiClock, FiCalendar, FiBriefcase, FiCheckCircle, FiFileText, FiCheck, FiInfo, FiLayers, FiPrinter, FiDownload, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/components/ui/Toast";

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
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectionSuccess, setSelectionSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Receipt link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = async () => {
    if (!proposal) return;

    const safeInvoiceNumber = (proposal.invoice_number || proposal.id.slice(0, 8))
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
      const response = await fetch(`/api/invoice/${proposal.id}/pdf`);
      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData?.error || "Failed to generate PDF");
      }
      const blob = await response.blob();
      triggerDownload(blob);
      toast.success("PDF downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const executeOptionSelection = async () => {
    if (!proposal || !pendingChoice || submitting) return;
    const option = pendingChoice.option;
    setSubmitting(true);

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
        setPendingChoice(null);
        toast.success("Pricing plan locked in successfully!");
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
      setPendingChoice(null);
      toast.success("Pricing plan locked in successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to lock in your pricing choice. Please try again.");
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden text-left">
              
              {/* Left Column - Main Invoice Document (Skeuomorphic Paper Sheet) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-900 rounded-3xl shadow-xl overflow-hidden relative"
              >
                {/* Top border color line matching brand green */}
                <div className="h-1.5 w-full bg-deepgreen" />
                
                {/* Subtle digital paper pattern / lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(241,245,249,0.08)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none opacity-50" />
                
                {/* Visual Digital Seal Stamp */}
                <div className="absolute top-10 right-10 z-20 pointer-events-auto">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 8 }}
                    className="w-24 h-24 rounded-full border border-dashed border-deepgreen/40 dark:border-lightgreen/30 flex items-center justify-center p-1 cursor-pointer select-none relative group"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_25s_linear_infinite] text-deepgreen dark:text-lightgreen fill-none">
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                      <text className="text-[7px] uppercase font-mono font-bold tracking-[2.5px] fill-current">
                        <textPath href="#circlePath">
                          • SECURED WITH INVOXA • FINALIZED & ACTIVE
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <FiCheckCircle className="w-5 h-5 text-deepgreen dark:text-lightgreen group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-[6px] font-mono font-extrabold text-deepgreen dark:text-lightgreen uppercase tracking-wider mt-0.5">Active</span>
                    </div>
                  </motion.div>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  {/* Header: Brand details & Invoice meta */}
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-900 pb-6">
                    <div className="flex items-center gap-4">
                      {proposal.org_logo_url ? (
                        <img
                          src={proposal.org_logo_url}
                          alt={proposal.org_name}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-deepgreen/10 dark:bg-deepgreen/20 flex items-center justify-center font-extrabold text-lg text-deepgreen dark:text-lightgreen border border-deepgreen/10">
                          {proposal.org_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h2 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight">{proposal.org_name}</h2>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-550 uppercase tracking-widest font-bold mt-0.5">Service Provider</p>
                      </div>
                    </div>

                    <div className="text-right pr-28">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#355834]/10 dark:bg-[#8bb174]/15 text-[#355834] dark:text-[#8bb174] border border-[#355834]/20 uppercase tracking-wide">
                        FINALIZED
                      </span>
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1.5">#{proposal.invoice_number}</p>
                    </div>
                  </div>

                  {/* Customer and billing metadata */}
                  <div className="grid grid-cols-2 gap-8 text-[11px]">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Prepared For</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{proposal.customer_name}</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Plan Selected</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 capitalize">{proposal.selected_pricing_option} Rate Plan</span>
                    </div>
                  </div>

                  {/* Scope Details (notes preview) */}
                  {parsedServiceNotes.name && (
                    <div className="p-5 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 space-y-2">
                      <h4 className="font-extrabold text-[9px] uppercase tracking-wider text-deepgreen dark:text-lightgreen border-b border-slate-150/60 dark:border-zinc-900/60 pb-2">
                        {parsedServiceNotes.name}
                      </h4>
                      <div className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed pl-0.5 whitespace-pre-line">
                        {parsedServiceNotes.description}
                      </div>
                    </div>
                  )}

                  {/* Table of items */}
                  {chosenPlan && (
                    <div className="pt-2">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-t border-b border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-950/20 text-zinc-400 dark:text-zinc-500">
                            <th className="p-3 text-left font-bold text-[9px] uppercase tracking-wider">Description</th>
                            <th className="p-3 text-center font-bold text-[9px] uppercase tracking-wider w-16">Qty</th>
                            <th className="p-3 text-right font-bold text-[9px] uppercase tracking-wider w-24">Unit Price</th>
                            <th className="p-3 text-right font-bold text-[9px] uppercase tracking-wider w-24">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100 dark:border-zinc-900/60">
                            <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                              {chosenPlan.label || `${proposal.selected_pricing_option?.toUpperCase()} billing plan`}
                            </td>
                            <td className="p-3 text-center font-mono text-zinc-500 dark:text-zinc-400">
                              {chosenPlan.quantity}
                            </td>
                            <td className="p-3 text-right font-mono text-zinc-500 dark:text-zinc-400">
                              {formatCurrency(chosenPlan.rate, proposal.currency)}
                            </td>
                            <td className="p-3 text-right font-bold font-mono text-zinc-800 dark:text-zinc-100">
                              {formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Grand total block */}
                  {chosenPlan && (
                    <div className="flex justify-end pt-2">
                      <div className="w-full max-w-[240px] space-y-2 text-xs">
                        <div className="flex justify-between text-zinc-550 dark:text-zinc-450">
                          <span>Subtotal</span>
                          <span className="font-mono text-zinc-700 dark:text-zinc-300">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-sm pt-3 border-t border-slate-100 dark:border-zinc-900/60 text-deepgreen dark:text-lightgreen">
                          <span>Grand Total</span>
                          <span className="font-mono text-base">{formatCurrency(chosenPlan.rate * chosenPlan.quantity, proposal.currency)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>

              {/* Right Column - Status & Sidebar Control Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="lg:col-span-4 space-y-6"
              >
                {/* Active Capsule Status card */}
                <div className="backdrop-blur-md bg-white/80 dark:bg-zinc-900/60 border border-slate-200/50 dark:border-zinc-800/60 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#355834]/10 dark:bg-[#8bb174]/15 text-[#355834] dark:text-[#8bb174] border border-[#355834]/20 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-deepgreen dark:bg-lightgreen animate-pulse" />
                      Active Engagement
                    </span>
                    <h3 className="text-lg font-extrabold text-zinc-850 dark:text-white tracking-tight leading-snug">
                      Plan Locked In
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      You have selected the <strong className="capitalize text-zinc-800 dark:text-zinc-200">{proposal.selected_pricing_option}</strong> option. The invoice has been locked and transitioned to active status.
                    </p>
                  </div>

                  {chosenPlan && (
                    <div className="bg-slate-50/50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-100/50 dark:border-zinc-900/60 space-y-2 text-[11px] text-zinc-650 dark:text-zinc-400">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-450 uppercase font-semibold text-[9px] tracking-wider">Locked rate</span>
                        <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {formatCurrency(chosenPlan.rate, proposal.currency)} / {proposal.selected_pricing_option === "hourly" ? "hr" : proposal.selected_pricing_option === "daily" ? "day" : "fixed"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-450 uppercase font-semibold text-[9px] tracking-wider">Estimated volume</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {chosenPlan.quantity} {proposal.selected_pricing_option === "hourly" ? "hrs" : proposal.selected_pricing_option === "daily" ? "days" : "project"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary CTA Action group */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={downloadPDF}
                      disabled={downloading}
                      className="w-full py-3 bg-[#355834] hover:bg-[#2c472c] dark:bg-[#8bb174] dark:hover:bg-[#7ba064] dark:text-dark text-white rounded-2xl font-bold text-xs shadow-md shadow-[#355834]/15 hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-white dark:border-dark border-t-transparent rounded-full animate-spin shrink-0" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <FiDownload className="w-3.5 h-3.5" /> Download Official PDF
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => window.print()}
                      disabled={downloading}
                      className="w-full py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-[#1A1C20] text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FiPrinter className="w-3.5 h-3.5" /> Print Receipt
                    </button>
                    
                    <button
                      onClick={handleCopyLink}
                      className="w-full py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-[#1A1C20] text-zinc-750 dark:text-zinc-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-3.5 h-3.5" />
                      {copied ? "Link Copied!" : "Copy Receipt Portal URL"}
                    </button>
                  </div>
                </div>

                {/* Modern Tracked Progress Timeline */}
                <div className="backdrop-blur-md bg-white/80 dark:bg-zinc-900/60 border border-slate-200/50 dark:border-zinc-800/60 p-6 rounded-3xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">Engagement Timeline</h4>
                  <div className="relative pl-5 space-y-5 text-left border-l border-slate-100 dark:border-zinc-900 ml-2">
                    
                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-deepgreen dark:bg-lightgreen border-2 border-white dark:border-[#070809] flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-white dark:bg-dark" />
                      </span>
                      <div>
                        <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Plan Selection Locked</h5>
                        <p className="text-[9.5px] text-zinc-400 mt-0.5">Choice confirmed as {proposal.selected_pricing_option?.toUpperCase()} billing model.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-deepgreen dark:bg-lightgreen border-2 border-white dark:border-[#070809] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-dark animate-ping" />
                      </span>
                      <div>
                        <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Invoice Drafting & Finalization</h5>
                        <p className="text-[9.5px] text-zinc-400 mt-0.5">Agency is structuring official billing items and parameters.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-slate-200 dark:bg-zinc-800 border-2 border-white dark:border-[#070809]" />
                      <div>
                        <h5 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500">Kickoff Notice & Invoice Checkout</h5>
                        <p className="text-[9.5px] text-zinc-450 mt-0.5">Secure payment link will be sent to your email for invoice finalization.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
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
      <AnimatePresence>
        {pendingChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setPendingChoice(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
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
                  onClick={() => !submitting && setPendingChoice(null)} 
                  disabled={submitting}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  onClick={() => !submitting && setPendingChoice(null)}
                  disabled={submitting}
                  className="flex-1 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={executeOptionSelection}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#355834] hover:bg-[#2c472c] dark:bg-lightgreen dark:text-dark text-white rounded-2xl font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white dark:border-dark border-t-transparent rounded-full animate-spin shrink-0" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Choice"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </motion.div>
    </div>
  );
}
