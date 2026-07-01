


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
import { useState } from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";

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

const features = [
  {
    title: "Sales & rentals, one workspace",
    desc: "Each invoice type gets its own pricing logic — per-unit for sales, per-day for rentals — instead of forcing both into the same template.",
  },
  {
    title: "Inventory that doesn't drift",
    desc: "Stock decrements are server-side and atomic, so two staff invoicing the same item at once can never oversell it.",
  },
  {
    title: "Built for your whole team",
    desc: "Invite staff with owner, admin, or staff roles. Everyone works from the same customer list, inventory, and invoice numbering.",
  },
];

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
  statusTone: "green" | "blue";
  rotate: string;
  animateRows?: boolean;
}) {
  const isSale = type === "Sale";

  if (animateRows) {
    return (
      <div
        style={{ transform: rotate }}
        className="w-64 bg-white border border-border rounded-2xl shadow-xl p-5 space-y-4"
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
              statusTone === "green" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
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
          <p className="font-mono text-xs text-muted truncate">{number}</p>
          <p className="font-semibold text-dark truncate text-right">{customer}</p>
        </motion.div>

        {/* Row 3 */}
        <motion.div
          variants={row3Variants}
          initial="hidden"
          animate="show"
          className="border-t border-border pt-3 flex justify-between items-end gap-2"
        >
          <p className="text-xs text-muted truncate">{line}</p>
          <p className="font-mono text-lg font-bold text-dark truncate text-right">{total}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{ transform: rotate }}
      className="w-64 bg-white border border-border rounded-2xl shadow-xl p-5 space-y-4"
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
            statusTone === "green" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Row 2 */}
      <div className="flex justify-between items-center gap-2">
        <p className="font-mono text-xs text-muted truncate">{number}</p>
        <p className="font-semibold text-dark truncate text-right">{customer}</p>
      </div>

      {/* Row 3 */}
      <div className="border-t border-border pt-3 flex justify-between items-end gap-2">
        <p className="text-xs text-muted truncate">{line}</p>
        <p className="font-mono text-lg font-bold text-dark truncate text-right">{total}</p>
      </div>
    </div>
  );
}

export default function MainHome() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="bg-light text-dark overflow-hidden">
      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-light via-light to-lightgreen/20" />

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-deepgreen bg-primary-soft px-3 py-1.5 rounded-full mb-6">
              Invoicing for sales &amp; rentals
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Focus on growth.
              <br />
              <span className="text-deepgreen">We handle the invoices.</span>
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
                className="inline-flex items-center px-8 py-3.5 rounded-2xl border border-border text-dark hover:bg-white transition-colors font-semibold"
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
                statusTone="blue"
                rotate="rotate(4deg)"
                animateRows={true}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6" id="features">
        <h2 className="text-3xl font-bold text-center mb-4">Built around one difference</h2>
        <p className="text-center text-muted max-w-xl mx-auto mb-12">
          Most invoicing tools treat every line item the same. Invoxa doesn&apos;t — because selling
          something and renting it out are genuinely different businesses.
        </p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-deepgreen">{item.title}</h3>
              <p className="text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            How Invoxa works
          </motion.h2>

          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-lightgreen/40" />

            {[
              {
                step: "01",
                title: "Create an invoice",
                desc: "Pick sale or rental, add items, and the total — including rental days — calculates itself.",
              },
              {
                step: "02",
                title: "Share it",
                desc: "Download a clean PDF to send however your client prefers.",
              },
              {
                step: "03",
                title: "Track & get paid",
                desc: "Mark it paid and stock updates automatically. Void it and stock comes right back.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-deepgreen text-white flex items-center justify-center text-lg font-bold shadow-lg font-mono">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              className={`relative p-8 rounded-2xl bg-white border shadow-sm ${
                plan.highlight ? "border-deepgreen shadow-lg" : "border-border"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-8 bg-deepgreen text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-deepgreen mb-6 font-mono">{plan.price}</p>
              <ul className="space-y-3 mb-8 text-dark">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FiCheck className="text-deepgreen shrink-0" />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-deepgreen text-white hover:bg-primary-hover"
                    : "bg-primary-soft text-deepgreen hover:bg-lightgreen/30"
                }`}
              >
                Choose {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="border border-border rounded-2xl bg-light/50 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-dark">{item.q}</span>
                  <span className="text-deepgreen text-xl shrink-0 ml-4">
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
      <section className="py-24 px-6 text-center bg-gradient-to-r from-green to-lightgreen">
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
