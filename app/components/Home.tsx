


// "use client";

// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// export default function MainHome() {
//     const [openIndex, setOpenIndex] = useState<number | null>(0);

//   const faqs = [
//     {
//       q: "Can I use both sales and rental invoices?",
//       a: "Yes, Invoxa supports both models with separate pricing logic.",
//     },
//     {
//       q: "Does inventory reduce automatically?",
//       a: "Only sales invoices affect inventory when marked as paid.",
//     },
//     {
//       q: "Can I send invoices to clients?",
//       a: "Yes, paid plans allow email sending and PDF downloads.",
//     },
//     {
//       q: "Is there a free plan?",
//       a: "Yes, you can start free with limited features.",
//     },
//   ];
//   return (
//     <main className="bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
//       {/* HERO */}
//       <section className="relative min-h-screen flex items-center justify-center px-6 text-center">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#8BB174]/20" />

//         <motion.div
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           className="relative z-10 max-w-4xl"
//         >
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
//             Focus on growth.{" "}
//             <span className="text-[#355834]">
//               <br />
//               We handle the invoices.
//             </span>
//           </h1>

//           <p className="text-lg md:text-xl text-gray-600 mb-8">
//             Manage sales and rental invoices, automate workflows, and scale
//             effortlessly with Invoxa.
//           </p>

//           <div className="flex justify-center gap-4">
//             <Link
//               href="/signup"
//               className="bg-[#355834] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
//             >
//               Get Started
//             </Link>
//             {/* <Link
//               href="/about"
//               className="border border-[#355834] px-8 py-3 rounded-2xl hover:bg-[#355834] hover:text-white transition"
//             >
//               Learn More
//             </Link> */}
//           </div>
//         </motion.div>
//       </section>

//       {/* FEATURES */}
//       <section className="py-24 px-6" id="features">
//         <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
//         <motion.div
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//           className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
//         >
//           {[
//             {
//               title: "Sales & Rental Support",
//               desc: "Handle both invoice types with distinct pricing logic.",
//             },
//             {
//               title: "Automation",
//               desc: "Generate PDFs, send emails, and track payments automatically.",
//             },
//             {
//               title: "Scalable SaaS",
//               desc: "Multi-tenant architecture built for growth.",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               variants={fadeUp}
//               className="p-6 rounded-2xl backdrop-blur bg-white/70 border shadow-md hover:shadow-xl transition"
//             >
//               <h3 className="text-xl font-semibold mb-2 text-[#355834]">
//                 {item.title}
//               </h3>
//               <p className="text-gray-600">{item.desc}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="py-24 px-6 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <motion.h2
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="show"
//             className="text-3xl md:text-4xl font-bold text-center mb-16"
//           >
//             How Invoxa Works
//           </motion.h2>

//           <div className="relative grid md:grid-cols-3 gap-10">
//             <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-[#8BB174]/40" />

//             {[
//               {
//                 step: "01",
//                 title: "Create Invoice",
//                 desc: "Choose sales or rental, add items, and set pricing instantly.",
//               },
//               {
//                 step: "02",
//                 title: "Send to Client",
//                 desc: "Download PDF or send directly via email in seconds.",
//               },
//               {
//                 step: "03",
//                 title: "Track & Get Paid",
//                 desc: "Monitor invoice status and automate payment tracking.",
//               },
//             ].map((item, i) => (
//               <motion.div
//                 key={i}
//                 variants={fadeUp}
//                 initial="hidden"
//                 whileInView="show"
//                 className="relative text-center"
//               >
//                 <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#355834] text-white flex items-center justify-center text-lg font-bold shadow-lg">
//                   {item.step}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-600">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* PRODUCT PREVIEW */}
//       <section className="py-24 px-6 bg-white">
//         <motion.div
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           className="max-w-5xl mx-auto text-center"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">
//             Built for Real Business Workflows
//           </h2>
//           <p className="text-gray-600 mb-10">
//             From invoice creation to payment tracking, everything works
//             seamlessly.
//           </p>

//           <div className="h-64 rounded-2xl bg-gradient-to-br from-[#71B48D]/30 to-[#355834]/30 flex items-center justify-center text-gray-700">
//             Dashboard Preview (Add screenshot here)
//           </div>
//         </motion.div>
//       </section>

//       {/* PRICING */}
//       <section className="py-24 px-6" id="pricing">
//         <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
//           {[
//             {
//               name: "Free",
//               price: "₦0",
//               features: [
//                 "Limited invoices",
//                 "No email sending",
//                 "Single currency",
//               ],
//             },
//             {
//               name: "Paid",
//               price: "₦5,000/mo",
//               features: [
//                 "Unlimited invoices",
//                 "Email + PDF sending",
//                 "Multi-currency",
//                 "Recurring invoices",
//               ],
//             },
//           ].map((plan, i) => (
//             <motion.div
//               key={i}
//               variants={fadeUp}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//               className="p-8 rounded-2xl bg-white border shadow-lg"
//             >
//               <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
//               <p className="text-3xl font-bold text-[#355834] mb-4">
//                 {plan.price}
//               </p>
//               <ul className="space-y-2 mb-6 text-gray-600">
//                 {plan.features.map((f, idx) => (
//                   <li key={idx}>• {f}</li>
//                 ))}
//               </ul>
//               <Link
//                 href="/signup"
//                 className="block text-center bg-[#355834] text-white py-3 rounded-xl hover:opacity-90"
//               >
//                 Choose Plan
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="py-24 px-6">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
//             Frequently Asked Questions
//           </h2>

//           <div className="space-y-4">
//             {faqs.map((item, i) => (
//               <div key={i} className="border rounded-2xl bg-white shadow-sm overflow-hidden">
//                 <button
//                   onClick={() => setOpenIndex(openIndex === i ? null : i)}
//                   className="w-full flex justify-between items-center p-6 text-left"
//                 >
//                   <span className="font-semibold">{item.q}</span>
//                   <span className="text-[#355834] text-xl">
//                     {openIndex === i ? "−" : "+"}
//                   </span>
//                 </button>

//                 <AnimatePresence>
//                   {openIndex === i && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="px-6 pb-6 text-gray-600"
//                     >
//                       {item.a}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-24 px-6 text-center bg-gradient-to-r from-[#71B48D] to-[#8BB174]">
//         <motion.div variants={fadeUp} initial="hidden" animate="show">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
//             Ready to simplify your invoicing?
//           </h2>
//           <Link
//             href="/signup"
//             className="bg-white text-[#355834] px-10 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
//           >
//             Start Free
//           </Link>
//         </motion.div>
//       </section>

//        {/* FOOTER */}
     
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiCheck, FiArrowRight, FiPlus, FiMinus, FiDatabase, FiLock, FiUnlock, FiUsers, FiFileText, FiShare2, FiDownload, FiCheckCircle, FiShield, FiTrendingUp, FiClock } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const faqs = [
  {
    q: "Can I use both sales and rental invoices?",
    a: "Yes — Invoxa treats them as two distinct invoice types with their own pricing logic, so you can run both sides of the business from one workspace.",
  },
  {
    q: "Does inventory update automatically?",
    a: "Sale invoices deduct stock the moment they're marked as paid, with a full audit trail. Rentals don't touch stock counts, since the item comes back.",
  },
  {
    q: "Can I send invoices to clients?",
    a: "You can generate and download a polished PDF invoice for any sale or rental in one click. Direct email delivery is on our roadmap.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — you can start free with core invoicing features and upgrade when you need more.",
  },
];

// Dynamic features managed within FeaturesSandbox component

const row1Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.2,
    },
  },
} as const;

const row2Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.4,
    },
  },
} as const;

const row3Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.6,
    },
  },
} as const;

function InvoicePreviewCard({
  type,
  number,
  customer,
  line,
  total,
  status,
  statusTone,
  rotate,
  animateRows = false,
}: {
  type: "Sale" | "Rental";
  number: string;
  customer: string;
  line: string;
  total: string;
  status: string;
  statusTone: "green" | "purple";
  rotate: string;
  animateRows?: boolean;
}) {
  const isSale = type === "Sale";

  if (animateRows) {
    return (
      <div
        style={{ transform: rotate }}
        className="w-64 bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl/40 p-5 space-y-4 text-dark dark:text-white transition-all duration-200"
      >
        {/* Row 1 */}
        <motion.div
          variants={row1Variants}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between"
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
              isSale ? "bg-primary-soft text-deepgreen" : "bg-rental-soft text-rental"
            }`}
          >
            {type}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
              statusTone === "green" ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
            }`}
          >
            {status}
          </span>
        </motion.div>

        {/* Row 2 */}
        <motion.div
          variants={row2Variants}
          initial="hidden"
          animate="show"
          className="flex justify-between items-center gap-2"
        >
          <p className="font-mono text-xs text-muted dark:text-zinc-550 truncate">{number}</p>
          <p className="font-semibold text-dark dark:text-zinc-100 truncate text-right">{customer}</p>
        </motion.div>

        {/* Row 3 */}
        <motion.div
          variants={row3Variants}
          initial="hidden"
          animate="show"
          className="border-t border-border dark:border-zinc-800 pt-3 flex justify-between items-end gap-2"
        >
          <p className="text-xs text-muted dark:text-zinc-550 truncate">{line}</p>
          <p className="font-mono text-lg font-bold text-dark dark:text-white truncate text-right">{total}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{ transform: rotate }}
      className="w-64 bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl/40 p-5 space-y-4 text-dark dark:text-white transition-all duration-200"
    >
      {/* Row 1 */}
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
            isSale ? "bg-primary-soft text-deepgreen" : "bg-rental-soft text-rental"
          }`}
        >
          {type}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
            statusTone === "green" ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Row 2 */}
      <div className="flex justify-between items-center gap-2">
        <p className="font-mono text-xs text-muted dark:text-zinc-550 truncate">{number}</p>
        <p className="font-semibold text-dark dark:text-zinc-100 truncate text-right">{customer}</p>
      </div>

      {/* Row 3 */}
      <div className="border-t border-border dark:border-zinc-800 pt-3 flex justify-between items-end gap-2">
        <p className="text-xs text-muted dark:text-zinc-550 truncate">{line}</p>
        <p className="font-mono text-lg font-bold text-dark dark:text-white truncate text-right">{total}</p>
      </div>
    </div>
  );
}

function FeaturesSandbox() {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Tab 1 (Sales vs Rentals) states
  const [isSale, setIsSale] = useState(true);
  const [qty, setQty] = useState(2);
  const [duration, setDuration] = useState(5);

  // Tab 2 (Race condition) states
  const [clashStatus, setClashStatus] = useState<'idle' | 'running' | 'locked' | 'success' | 'failed'>('idle');

  // Tab 3 (Role permissions) states
  const [activeRole, setActiveRole] = useState<'owner' | 'admin' | 'staff'>('owner');

  // Auto-running simulation for clash
  const runClashSimulation = () => {
    if (clashStatus === 'running') return;
    setClashStatus('running');
    setTimeout(() => {
      setClashStatus('locked');
      setTimeout(() => {
        setClashStatus('success');
      }, 1200);
    }, 1000);
  };

  const resetClash = () => {
    setClashStatus('idle');
  };

  const tabs = [
    {
      id: 0,
      title: "Sales & rentals, one workspace",
      desc: "Each invoice type gets its own pricing logic — per-unit for sales, per-day for rentals — instead of forcing both into the same template.",
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      id: 1,
      title: "Inventory that doesn't drift",
      desc: "Stock decrements are server-side and atomic, so two staff invoicing the same item at once can never oversell it.",
      icon: <FiDatabase className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Built for your whole team",
      desc: "Invite staff with owner, admin, or staff roles. Everyone works from the same customer list, inventory, and invoice numbering.",
      icon: <FiUsers className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-28 px-6 bg-light dark:bg-[#070809]/50 transition-colors duration-200" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-deepgreen dark:text-lightgreen bg-primary-soft dark:bg-zinc-800/85 px-3.5 py-1.5 rounded-full">
            Deep Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 tracking-tight">Built around one difference</h2>
          <p className="text-lg text-muted">
            Most invoicing tools treat every line item the same. Invoxa doesn&apos;t — because selling
            something and renting it out are genuinely different businesses.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Interactive Tab Selectors */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                    isActive
                      ? "bg-white dark:bg-[#0E0F12] border-deepgreen/25 dark:border-lightgreen/20 shadow-md translate-x-1"
                      : "bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                    isActive
                      ? "bg-deepgreen text-white dark:bg-lightgreen dark:text-dark"
                      : "bg-primary-soft dark:bg-zinc-900 text-deepgreen dark:text-lightgreen"
                  }`}>
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-2 transition-colors ${
                      isActive ? "text-dark dark:text-white" : "text-dark/80 dark:text-white/80"
                    }`}>
                      {tab.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Visual Sandbox Showcase */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[460px] relative overflow-hidden">
            {/* Ambient Background Gradient for the sandbox */}
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-lightgreen/10 dark:bg-lightgreen/5 blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="tab0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                        Sandbox / Live Simulator
                      </span>
                      <div className="bg-light dark:bg-zinc-900 border border-border dark:border-zinc-800 p-1 rounded-xl flex gap-1">
                        <button
                          onClick={() => setIsSale(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSale
                              ? "bg-deepgreen text-white dark:bg-lightgreen dark:text-dark shadow-sm"
                              : "text-muted hover:text-dark dark:hover:text-white"
                          }`}
                        >
                          Sales Flow
                        </button>
                        <button
                          onClick={() => setIsSale(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            !isSale
                              ? "bg-deepgreen text-white dark:bg-lightgreen dark:text-dark shadow-sm"
                              : "text-muted hover:text-dark dark:hover:text-white"
                          }`}
                        >
                          Rentals Flow
                        </button>
                      </div>
                    </div>

                    <div className="bg-light/60 dark:bg-zinc-900/50 rounded-2xl p-5 border border-border dark:border-zinc-800 space-y-4">
                      {isSale ? (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-sm">Ergonomic Office Chair</h4>
                              <p className="text-xs text-muted">Stock availability: 50 units</p>
                            </div>
                            <span className="font-mono text-sm font-bold text-deepgreen dark:text-lightgreen">
                              ₦45,000 / unit
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-border/60 dark:border-zinc-800/60 pt-4">
                            <span className="text-xs text-muted font-medium">Quantity to Invoice</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-850 border border-border dark:border-zinc-800 flex items-center justify-center hover:bg-light dark:hover:bg-zinc-800 transition-colors"
                              >
                                <FiMinus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-bold font-mono text-sm w-6 text-center">{qty}</span>
                              <button
                                onClick={() => setQty(q => Math.min(10, q + 1))}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-850 border border-border dark:border-zinc-800 flex items-center justify-center hover:bg-light dark:hover:bg-zinc-800 transition-colors"
                              >
                                <FiPlus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-sm">Heavy Duty Generator</h4>
                              <p className="text-xs text-muted">Stock availability: 1 unit</p>
                            </div>
                            <span className="font-mono text-sm font-bold text-deepgreen dark:text-lightgreen">
                              ₦15,000 / day
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-border/60 dark:border-zinc-800/60 pt-4">
                            <span className="text-xs text-muted font-medium">Rental Duration</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setDuration(d => Math.max(1, d - 1))}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-850 border border-border dark:border-zinc-800 flex items-center justify-center hover:bg-light dark:hover:bg-zinc-800 transition-colors"
                              >
                                <FiMinus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-bold font-mono text-sm w-16 text-center">
                                {duration} {duration === 1 ? 'Day' : 'Days'}
                              </span>
                              <button
                                onClick={() => setDuration(d => Math.min(30, d + 1))}
                                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-850 border border-border dark:border-zinc-800 flex items-center justify-center hover:bg-light dark:hover:bg-zinc-800 transition-colors"
                              >
                                <FiPlus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Visual Output Card */}
                  <div className="space-y-4 pt-4">
                    <div className="border border-dashed border-border dark:border-zinc-800 rounded-2xl p-5 space-y-3 bg-light/30 dark:bg-zinc-900/10">
                      <div className="flex justify-between text-xs text-muted">
                        <span>Invoice Line Summary</span>
                        <span>Total Calculation</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-semibold text-sm">
                            {isSale ? "Ergonomic Office Chair" : "Heavy Duty Generator"}
                          </p>
                          <p className="text-xs text-muted">
                            {isSale ? `${qty} units @ ₦45,000` : `1 unit × ${duration} days @ ₦15,000/day`}
                          </p>
                        </div>
                        <p className="font-mono text-xl font-bold text-dark dark:text-white">
                          ₦{isSale ? (qty * 45000).toLocaleString() : (duration * 15000).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-primary-soft/50 dark:bg-zinc-900/40 p-4 rounded-xl text-xs">
                      {isSale ? (
                        <>
                          <FiDatabase className="w-4 h-4 text-deepgreen dark:text-lightgreen shrink-0" />
                          <span className="text-muted leading-relaxed">
                            <strong>Sales stock lock:</strong> Marking paid will deduct exactly <strong>{qty} chairs</strong> from your current warehouse count (now {50 - qty} remaining).
                          </span>
                        </>
                      ) : (
                        <>
                          <FiClock className="w-4 h-4 text-deepgreen dark:text-lightgreen shrink-0" />
                          <span className="text-muted leading-relaxed">
                            <strong>Rental duration billing:</strong> Generator is blocked for <strong>{duration} days</strong>. Total counts stay at 1, but status marks booked during this date range.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="tab1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                        Concurrency & Lock Simulator
                      </span>
                      <button
                        onClick={clashStatus !== 'idle' ? resetClash : runClashSimulation}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all shadow-sm cursor-pointer ${
                          clashStatus === 'idle'
                            ? "bg-deepgreen text-white dark:bg-lightgreen dark:text-dark hover:opacity-90"
                            : "bg-light dark:bg-zinc-900 border border-border dark:border-zinc-800 text-muted"
                        }`}
                      >
                        {clashStatus !== 'idle' ? 'Reset Simulation' : 'Simulate Conflict'}
                      </button>
                    </div>

                    <p className="text-sm text-muted mb-6">
                      See what happens when two staff members try to check out the last remaining item in stock at the exact same millisecond.
                    </p>

                    {/* Simulation Flow Visualizer */}
                    <div className="space-y-3 relative">
                      {/* Alice Request */}
                      <div className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                        clashStatus === 'idle'
                          ? "bg-light/40 dark:bg-zinc-900/30 border-border dark:border-zinc-800"
                          : clashStatus === 'running'
                          ? "bg-yellow-500/5 dark:bg-yellow-500/5 border-yellow-500/20"
                          : "bg-green-500/5 dark:bg-green-500/5 border-green-500/20"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            clashStatus === 'idle' ? 'bg-zinc-300 dark:bg-zinc-700' : clashStatus === 'running' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="text-xs font-bold font-mono">REQUEST #A102 (Alice)</p>
                            <p className="text-[11px] text-muted">Checkout last generator</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold">
                          {clashStatus === 'idle' && 'Idle'}
                          {clashStatus === 'running' && 'Processing transaction...'}
                          {clashStatus === 'locked' && 'Acquiring row lock...'}
                          {(clashStatus === 'success' || clashStatus === 'failed') && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <FiCheck className="w-3.5 h-3.5" /> Paid & Completed
                            </span>
                          )}
                        </span>
                      </div>

                      {/* DB Lock Status */}
                      <div className={`p-3 rounded-lg border text-center transition-all duration-300 text-xs font-semibold ${
                        clashStatus === 'idle'
                          ? "bg-light/20 dark:bg-zinc-900/10 border-dashed border-border dark:border-zinc-800 text-muted"
                          : clashStatus === 'running'
                          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                          : clashStatus === 'locked'
                          ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 animate-pulse"
                          : "bg-zinc-100 dark:bg-zinc-900 border-border dark:border-zinc-800 text-muted"
                      }`}>
                        {clashStatus === 'idle' && "Database Lock: Inactive"}
                        {clashStatus === 'running' && "Database Lock: SELECT FOR UPDATE acquired"}
                        {clashStatus === 'locked' && "Database Lock: Row level transaction locked"}
                        {(clashStatus === 'success' || clashStatus === 'failed') && "Database Lock: Transaction committed and released"}
                      </div>

                      {/* Bob Request */}
                      <div className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-305 ${
                        clashStatus === 'idle'
                          ? "bg-light/40 dark:bg-zinc-900/30 border-border dark:border-zinc-800"
                          : clashStatus === 'running'
                          ? "bg-yellow-500/5 dark:bg-yellow-500/5 border-yellow-500/20"
                          : clashStatus === 'locked'
                          ? "bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/20"
                          : "bg-red-500/5 dark:bg-red-500/5 border-red-500/20"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            clashStatus === 'idle' ? 'bg-zinc-300 dark:bg-zinc-700' : clashStatus === 'running' || clashStatus === 'locked' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-xs font-bold font-mono">REQUEST #B892 (Bob)</p>
                            <p className="text-[11px] text-muted">Checkout last generator</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold">
                          {clashStatus === 'idle' && 'Idle'}
                          {(clashStatus === 'running' || clashStatus === 'locked') && 'Blocked by Lock...'}
                          {clashStatus === 'success' && (
                            <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                              <FiLock className="w-3 h-3" /> Blocked: Out of stock
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-soft/50 dark:bg-zinc-900/40 p-4 rounded-xl text-xs flex gap-3">
                    <FiShield className="w-5 h-5 text-deepgreen dark:text-lightgreen shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-0.5">How this works under the hood</p>
                      <p className="text-muted leading-relaxed">
                        Invoxa uses server-side PostgreSQL transactions. Selecting stock for update creates an instant lock at the database engine level. This ensures no invoice can ever trigger double-spending or cause drifting ledger inventory.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  key="tab2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                        Workspace Permissions
                      </span>
                      <div className="bg-light dark:bg-zinc-900 border border-border dark:border-zinc-800 p-1 rounded-xl flex gap-1">
                        {(['owner', 'admin', 'staff'] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => setActiveRole(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                              activeRole === role
                                ? "bg-deepgreen text-white dark:bg-lightgreen dark:text-dark shadow-sm"
                                : "text-muted hover:text-dark dark:hover:text-white"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted mb-6">
                      Invoxa grants fine-grained workspace roles. Switching the active role changes layout structures and limits user permissions.
                    </p>

                    {/* Mock Dashboard UI based on active role */}
                    <div className="bg-light/50 dark:bg-zinc-900/40 border border-border dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
                      {/* Dashboard Topbar */}
                      <div className="bg-white dark:bg-[#0E0F12] border-b border-border dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-deepgreen dark:bg-lightgreen" />
                          <span className="text-[11px] font-bold tracking-tight">Invoxa Workspace</span>
                        </div>
                        <span className="text-[10px] font-mono capitalize font-bold px-2 py-0.5 rounded bg-primary-soft dark:bg-zinc-800 text-deepgreen dark:text-lightgreen border border-deepgreen/10 dark:border-zinc-700">
                          Role: {activeRole}
                        </span>
                      </div>

                      {/* Mock Layout Columns */}
                      <div className="flex min-h-[140px]">
                        {/* Sidebar Mock */}
                        <div className="w-1/3 bg-white dark:bg-[#0E0F12] border-r border-border dark:border-zinc-800 p-3 space-y-1.5 text-[10px] font-medium text-muted">
                          <div className="p-1.5 rounded bg-light dark:bg-zinc-900 text-dark dark:text-white font-bold">Invoices</div>
                          <div className="p-1.5 rounded hover:bg-light/40 dark:hover:bg-zinc-900/30">Customers</div>
                          <div className="p-1.5 rounded hover:bg-light/40 dark:hover:bg-zinc-900/30 flex items-center justify-between">
                            <span>Inventory</span>
                            {activeRole === 'staff' && <FiLock className="w-2.5 h-2.5 text-red-500" />}
                          </div>
                          
                          {/* Owner/Admin Reports */}
                          {activeRole !== 'staff' ? (
                            <div className="p-1.5 rounded hover:bg-light/40 dark:hover:bg-zinc-900/30">Reports</div>
                          ) : (
                            <div className="p-1.5 rounded opacity-30 select-none flex items-center justify-between">
                              <span>Reports</span>
                              <FiLock className="w-2.5 h-2.5" />
                            </div>
                          )}

                          {/* Owner-only Settings */}
                          {activeRole === 'owner' ? (
                            <div className="p-1.5 rounded hover:bg-light/40 dark:hover:bg-zinc-900/30">Settings</div>
                          ) : (
                            <div className="p-1.5 rounded opacity-30 select-none flex items-center justify-between">
                              <span>Settings</span>
                              <FiLock className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>

                        {/* Main Workpane Mock */}
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h5 className="text-[11px] font-bold">Invoices Dashboard</h5>
                            <p className="text-[9px] text-muted">Manage your business metrics</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {/* Revenue metrics (Owner and Admin only) */}
                            {activeRole !== 'staff' ? (
                              <div className="bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 p-2.5 rounded-lg">
                                <p className="text-[8px] text-muted">Weekly Revenue</p>
                                <p className="text-xs font-mono font-bold text-deepgreen dark:text-lightgreen">₦1,240,000</p>
                              </div>
                            ) : (
                              <div className="bg-light/40 dark:bg-zinc-950/20 border border-dashed border-border dark:border-zinc-800/80 p-2.5 rounded-lg flex items-center justify-center text-center opacity-65">
                                <span className="text-[8px] text-muted italic flex items-center gap-1">
                                  <FiLock className="w-2 h-2 shrink-0" /> Hidden
                                </span>
                              </div>
                            )}

                            <div className="bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 p-2.5 rounded-lg">
                              <p className="text-[8px] text-muted">Draft Invoices</p>
                              <p className="text-xs font-mono font-bold">24 Active</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-soft/50 dark:bg-zinc-900/40 p-4 rounded-xl text-xs flex gap-3">
                    <FiUsers className="w-5 h-5 text-deepgreen dark:text-lightgreen shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-0.5">Customizable roles for security</p>
                      <p className="text-muted leading-relaxed">
                        Control exactly what actions team members can perform. <strong>Staff</strong> can only draft invoices, protecting crucial financial settings and pricing margins from drift.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowTimeline() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through steps
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % 3);
          return 0;
        }
        return prev + 1.25; // updates every 100ms, hits 100 in ~8s
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Reset progress when manual action happens
  const selectStep = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    setIsPaused(true);
  };

  const steps = [
    {
      id: 0,
      step: "01",
      title: "Create an invoice",
      desc: "Pick sale or rental, add items, and the total — including rental days — calculates itself.",
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      id: 1,
      step: "02",
      title: "Share it",
      desc: "Download a clean PDF to send however your client prefers, or copy sharing links.",
      icon: <FiShare2 className="w-5 h-5" />,
    },
    {
      id: 2,
      step: "03",
      title: "Track & get paid",
      desc: "Mark it paid and stock updates automatically. Void it and stock comes right back.",
      icon: <FiTrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-28 px-6 bg-white dark:bg-[#070809] border-y border-border dark:border-zinc-800/50 transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">How Invoxa works</h2>
        <p className="text-center text-muted max-w-xl mx-auto mb-20 text-lg">
          From drafting to getting paid, track everything in a fluid, unified workspace.
        </p>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Timeline side */}
          <div className="lg:col-span-5 space-y-6 relative">
            {/* Draw vertical connector line on desktop */}
            <div className="hidden lg:block absolute left-14 top-12 bottom-12 w-0.5 bg-border dark:bg-zinc-800" />
            
            {steps.map((item, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={i}
                  onClick={() => selectStep(i)}
                  className={`text-left w-full p-6 rounded-2xl transition-all duration-300 flex items-start gap-6 cursor-pointer relative z-10 ${
                    isActive 
                      ? "bg-light dark:bg-[#0E0F12] border border-border dark:border-zinc-800/80 shadow-sm" 
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full shrink-0 flex flex-col items-center justify-center text-lg font-bold font-mono relative overflow-hidden transition-all ${
                    isActive 
                      ? "bg-deepgreen dark:bg-lightgreen text-white dark:text-dark shadow-md scale-105" 
                      : "bg-primary-soft dark:bg-zinc-900 text-deepgreen dark:text-lightgreen"
                  }`}>
                    {/* Ring showing automated progress */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/15 origin-bottom transition-all duration-100 pointer-events-none" style={{ transform: `scaleY(${progress / 100})` }} />
                    )}
                    <span className="relative z-10">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Preview */}
          <div className="lg:col-span-7 bg-light dark:bg-[#0E0F12]/40 border border-border dark:border-zinc-800/60 rounded-3xl p-6 md:p-8 shadow-sm flex items-center justify-center min-h-[380px] relative overflow-hidden">
            {/* Ambient Background Gradient for the canvas */}
            <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-deepgreen/5 dark:bg-deepgreen/3 blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 rounded-2xl shadow-xl p-5 space-y-4 text-dark dark:text-white"
                >
                  <div className="flex items-center justify-between border-b border-border dark:border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-deepgreen dark:text-lightgreen uppercase bg-primary-soft dark:bg-zinc-800 px-2 py-0.5 rounded">
                        New Invoice
                      </span>
                      <h4 className="font-bold text-sm mt-1">INV-00245</h4>
                    </div>
                    <span className="text-[10px] text-muted font-mono">Date: Today</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted uppercase font-bold">Client</label>
                      <div className="w-full bg-light dark:bg-zinc-900/50 border border-border dark:border-zinc-800 p-2 rounded-lg font-medium flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-deepgreen dark:bg-lightgreen animate-ping" />
                        <span>Aisha Bello</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase font-bold">Type</label>
                        <div className="bg-light dark:bg-zinc-900/50 border border-border dark:border-zinc-800 p-2 rounded-lg font-bold text-deepgreen dark:text-lightgreen text-center">
                          Sale
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted uppercase font-bold">Items</label>
                        <div className="bg-light dark:bg-zinc-900/50 border border-border dark:border-zinc-800 p-2 rounded-lg font-medium text-center">
                          2 × Office Chairs
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border dark:border-zinc-800 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-xs">Total Amount</span>
                      <span className="font-mono text-base font-bold text-deepgreen dark:text-lightgreen">₦90,000</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 rounded-2xl shadow-xl p-5 space-y-4 text-dark dark:text-white"
                >
                  <div className="flex justify-between items-center border-b border-border dark:border-zinc-800 pb-3">
                    <h4 className="font-bold text-sm">Export &amp; Share</h4>
                    <span className="text-[10px] font-bold text-purple-750 bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-light dark:bg-zinc-900/50 border border-border dark:border-zinc-800 rounded-xl space-y-2">
                      <p className="text-[10px] text-muted font-bold uppercase">Shareable Link</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value="https://invooxa.netlify.app/proposal/mock"
                          className="bg-white dark:bg-zinc-950 text-xs border border-border dark:border-zinc-850 p-2 rounded-lg grow font-mono select-none"
                        />
                        <button className="bg-deepgreen text-white dark:bg-lightgreen dark:text-dark px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shrink-0">
                          <FiCheckCircle className="w-3.5 h-3.5" /> Copied
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 py-2.5 rounded-xl text-xs font-semibold hover:bg-light dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                        <FiDownload className="w-4 h-4" /> Download PDF
                      </button>
                      <button className="flex-1 bg-deepgreen text-white dark:bg-lightgreen dark:text-dark py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <FiShare2 className="w-4 h-4" /> Direct Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md bg-white dark:bg-[#0E0F12] border border-border dark:border-zinc-800 rounded-2xl shadow-xl p-5 space-y-4 text-dark dark:text-white"
                >
                  <div className="flex justify-between items-center border-b border-border dark:border-zinc-800 pb-3">
                    <h4 className="font-bold text-sm">Automated Ledger</h4>
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 dark:bg-green-950/30 dark:text-green-400 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Paid
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="bg-light dark:bg-zinc-900/50 p-3.5 rounded-xl border border-border dark:border-zinc-800 space-y-3">
                      <div className="flex justify-between items-center text-muted text-[10px] uppercase font-bold">
                        <span>Database Action</span>
                        <span>Status</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Ledger Entry: Aisha Bello</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold font-mono text-[11px]">+₦90,000</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border/40 dark:border-zinc-800/40 pt-2">
                        <span className="font-medium">Inventory Change: Office Chair</span>
                        <span className="text-red-500 font-semibold font-mono text-[11px]">-2 Units</span>
                      </div>
                    </div>

                    <div className="bg-green-500/5 dark:bg-green-500/5 border border-green-500/25 p-3 rounded-xl flex items-center gap-2.5">
                      <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                      <span className="text-[11px] text-muted">
                        Stock updated. Transaction completed and written to ledger records.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MainHome() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-light dark:bg-[#070809] text-dark dark:text-white transition-colors duration-200 overflow-hidden">
      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-light via-light to-lightgreen/20 dark:from-[#070809] dark:via-[#070809] dark:to-lightgreen/10" />

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-deepgreen dark:text-lightgreen bg-primary-soft dark:bg-zinc-800 px-3 py-1.5 rounded-full mb-6">
              Invoicing for sales &amp; rentals
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Focus on growth.
              <br />
              <span className="text-deepgreen dark:text-lightgreen">We handle the invoices.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted mb-8 max-w-lg">
              One workspace for sales and rental invoices — with pricing logic, inventory, and your
              whole team built in from day one.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-deepgreen text-white px-8 py-3.5 rounded-2xl shadow-lg hover:bg-primary-hover transition-colors font-semibold"
              >
                Get Started <FiArrowRight />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-3.5 rounded-2xl border border-border dark:border-zinc-800 text-dark dark:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors font-semibold"
              >
                Log in
              </Link>
            </div>
          </motion.div>

          {/* Product preview — the sale/rental distinction, shown rather than described */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="relative h-80 hidden md:block"
          >
            <div className="absolute left-2 top-6">
              <InvoicePreviewCard
                type="Sale"
                number="INV-00231"
                customer="Aisha Bello"
                line="2× Office Chairs"
                total="₦90,000"
                status="Paid"
                statusTone="green"
                rotate="rotate(-6deg)"
                animateRows={true}
              />
            </div>
            <div className="absolute right-2 top-0">
              <InvoicePreviewCard
                type="Rental"
                number="INV-00232"
                customer="Bayo Events Co."
                line="1× Generator · 7 days"
                total="₦105,000"
                status="Sent"
                statusTone="purple"
                rotate="rotate(4deg)"
                animateRows={true}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES - Interactive Showcase Sandbox */}
      <FeaturesSandbox />

      {/* HOW IT WORKS - Synced Timeline Walkthrough */}
      <WorkflowTimeline />

      {/* PRICING */}
      <section className="py-24 px-6" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Free",
              price: "₦0",
              features: ["Limited invoices", "Single currency", "Core inventory tracking"],
              highlight: false,
            },
            {
              name: "Paid",
              price: "₦5,000/mo",
              features: [
                "Unlimited invoices",
                "PDF downloads",
                "Multi-currency",
                "Recurring invoices",
              ],
              highlight: true,
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl bg-white dark:bg-[#0E0F12] border shadow-sm ${
                plan.highlight ? "border-deepgreen dark:border-lightgreen shadow-lg" : "border-border dark:border-zinc-800"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-8 bg-deepgreen dark:bg-lightgreen text-white dark:text-dark text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-deepgreen dark:text-lightgreen mb-6 font-mono">{plan.price}</p>
              <ul className="space-y-3 mb-8 text-dark dark:text-zinc-200">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FiCheck className="text-deepgreen dark:text-lightgreen shrink-0" />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-deepgreen text-white hover:bg-primary-hover"
                    : "bg-primary-soft dark:bg-zinc-900 text-deepgreen dark:text-lightgreen hover:bg-lightgreen/30 dark:hover:bg-zinc-800"
                }`}
              >
                Choose {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white dark:bg-[#070809] transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="border border-border dark:border-zinc-800 rounded-2xl bg-light/50 dark:bg-[#0E0F12]/60 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-dark dark:text-white">{item.q}</span>
                  <span className="text-deepgreen dark:text-lightgreen text-xl shrink-0 ml-4">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-muted overflow-hidden"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-green to-lightgreen dark:from-deepgreen dark:to-green">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to simplify your invoicing?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-deepgreen px-10 py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Start Free <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
