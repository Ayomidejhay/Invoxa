
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function MainHome() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I use both sales and rental invoices?",
      a: "Yes, Invoxa supports both models with separate pricing logic.",
    },
    {
      q: "Does inventory reduce automatically?",
      a: "Only sales invoices affect inventory when marked as paid.",
    },
    {
      q: "Can I send invoices to clients?",
      a: "Yes, paid plans allow email sending and PDF downloads.",
    },
    {
      q: "Is there a free plan?",
      a: "Yes, you can start free with limited features.",
    },
  ];
  return (
    <main className="bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#8BB174]/20" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Focus on growth.{" "}
            <span className="text-[#355834]">
              <br />
              We handle the invoices.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Manage sales and rental invoices, automate workflows, and scale
            effortlessly with Invoxa.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-[#355834] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
            {/* <Link
              href="/about"
              className="border border-[#355834] px-8 py-3 rounded-2xl hover:bg-[#355834] hover:text-white transition"
            >
              Learn More
            </Link> */}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6" id="features">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Sales & Rental Support",
              desc: "Handle both invoice types with distinct pricing logic.",
            },
            {
              title: "Automation",
              desc: "Generate PDFs, send emails, and track payments automatically.",
            },
            {
              title: "Scalable SaaS",
              desc: "Multi-tenant architecture built for growth.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 rounded-2xl backdrop-blur bg-white/70 border shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#355834]">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
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
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            How Invoxa Works
          </motion.h2>

          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-[#8BB174]/40" />

            {[
              {
                step: "01",
                title: "Create Invoice",
                desc: "Choose sales or rental, add items, and set pricing instantly.",
              },
              {
                step: "02",
                title: "Send to Client",
                desc: "Download PDF or send directly via email in seconds.",
              },
              {
                step: "03",
                title: "Track & Get Paid",
                desc: "Monitor invoice status and automate payment tracking.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#355834] text-white flex items-center justify-center text-lg font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for Real Business Workflows
          </h2>
          <p className="text-gray-600 mb-10">
            From invoice creation to payment tracking, everything works
            seamlessly.
          </p>

          <div className="h-64 rounded-2xl bg-gradient-to-br from-[#71B48D]/30 to-[#355834]/30 flex items-center justify-center text-gray-700">
            Dashboard Preview (Add screenshot here)
          </div>
        </motion.div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Free",
              price: "₦0",
              features: [
                "Limited invoices",
                "No email sending",
                "Single currency",
              ],
            },
            {
              name: "Paid",
              price: "₦5,000/mo",
              features: [
                "Unlimited invoices",
                "Email + PDF sending",
                "Multi-currency",
                "Recurring invoices",
              ],
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-[#355834] mb-4">
                {plan.price}
              </p>
              <ul className="space-y-2 mb-6 text-gray-600">
                {plan.features.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-[#355834] text-white py-3 rounded-xl hover:opacity-90"
              >
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="border rounded-2xl bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-semibold">{item.q}</span>
                  <span className="text-[#355834] text-xl">
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
                      className="px-6 pb-6 text-gray-600"
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
      <section className="py-24 px-6 text-center bg-gradient-to-r from-[#71B48D] to-[#8BB174]">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to simplify your invoicing?
          </h2>
          <Link
            href="/signup"
            className="bg-white text-[#355834] px-10 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Start Free
          </Link>
        </motion.div>
      </section>

       {/* FOOTER */}
     
    </main>
  );
}

