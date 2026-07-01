"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export default function AuthLayout({ children, title, subtitle, illustration }: AuthLayoutProps) {
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#0C0C0E] text-zinc-100 overflow-hidden font-sans">
      {/* Left panel: Visual & Branding */}
      <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0F1C12] via-[#090E0A] to-[#050607] border-r border-zinc-900/50">
        
        {/* Glow Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 60, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.15, 0.95, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[380px] h-[380px] bg-deepgreen/25 blur-[110px] rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, -40, 60, 0],
              y: [0, 60, -30, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -right-20 w-[420px] h-[420px] bg-green/15 blur-[130px] rounded-full"
          />
          <motion.div
            animate={{ 
              opacity: [0.25, 0.5, 0.25]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 w-[280px] h-[280px] bg-lightgreen/10 blur-[85px] rounded-full"
          />
        </div>

        {/* Branding header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-deepgreen to-green flex items-center justify-center text-white text-sm font-mono shadow-md border border-white/10">I</span>
            <span>Invoxa</span>
          </Link>
        </div>

        {/* Floating Mock UI Card (Illustration) */}
        <div className="relative z-10 my-auto flex items-center justify-center py-6">
          {illustration}
        </div>

        {/* Footer info / Text */}
        <div className="relative z-10 max-w-sm">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{subtitle}</p>
        </div>
      </div>

      {/* Right panel: Form Card */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#0C0C0E]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top border highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-green/20 to-transparent" />
          {children}
        </motion.div>
      </div>
    </main>
  );
}
