"use client";

import React from "react";

export default function InventoryLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Title & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-7 w-28 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-850 rounded-lg" />
      </div>

      {/* Search Input Mockup */}
      <div className="h-10 w-full max-w-sm bg-slate-150 dark:bg-zinc-800 rounded-lg" />

      {/* Mobile view skeleton blocks */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#202023]/60 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-12 bg-slate-150 dark:bg-zinc-850 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 bg-slate-100 dark:bg-zinc-900/50 rounded-lg" />
              <div className="h-12 bg-slate-100 dark:bg-zinc-900/50 rounded-lg" />
              <div className="h-12 bg-slate-100 dark:bg-zinc-900/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view skeleton table */}
      <div className="hidden md:block bg-white dark:bg-[#202023]/60 border border-slate-200 dark:border-zinc-855 rounded-xl overflow-hidden shadow-sm">
        <div className="h-12 bg-slate-50 dark:bg-[#1A1A1C]/50 border-b border-slate-200 dark:border-zinc-800" />
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-800/40 last:border-0 pb-3">
              <div className="h-4.5 w-1/4 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4.5 w-1/6 bg-slate-150 dark:bg-zinc-800/60 rounded" />
              <div className="h-4.5 w-1/6 bg-slate-100 dark:bg-zinc-850 rounded" />
              <div className="h-4.5 w-12 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4.5 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
