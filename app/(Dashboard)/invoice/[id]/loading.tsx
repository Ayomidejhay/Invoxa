"use client";

import React from "react";

export default function InvoiceDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6 animate-pulse p-1">
      {/* Document Sheet Skeleton */}
      <div className="relative bg-white dark:bg-[#202023]/60 p-12 space-y-10 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden">
        {/* Top brand line highlight mockup */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-zinc-800" />

        {/* Header line */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-800/40 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4.5 w-40 bg-slate-150 dark:bg-zinc-800/60 rounded" />
              <div className="h-4 w-28 bg-slate-100 dark:bg-zinc-800/40 rounded" />
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center justify-end gap-2">
              <div className="h-5 w-14 bg-slate-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-5 w-14 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="h-7 w-28 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" />
            <div className="h-4 w-20 bg-slate-150 dark:bg-zinc-850 rounded ml-auto" />
          </div>
        </div>

        {/* Invoice details grid */}
        <div className="grid grid-cols-2 gap-12 pt-4">
          <div className="space-y-2.5">
            <div className="h-4.5 w-20 bg-slate-150 dark:bg-zinc-800 rounded" />
            <div className="h-5.5 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-4.5 w-28 bg-slate-100 dark:bg-zinc-850 rounded" />
          </div>
          <div className="flex flex-col items-end text-right space-y-2.5">
            <div className="h-4.5 w-20 bg-slate-150 dark:bg-zinc-800 rounded ml-auto" />
            <div className="h-4.5 w-36 bg-slate-250 dark:bg-zinc-800 rounded ml-auto" />
            <div className="h-4.5 w-32 bg-slate-100 dark:bg-zinc-850 rounded ml-auto" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="pt-6 space-y-4">
          <div className="h-10 bg-slate-100 dark:bg-zinc-800/40 rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-zinc-800/40 last:border-0">
              <div className="h-4 w-44 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-12 bg-slate-150 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>

        {/* Bottom summary block */}
        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-zinc-800/40">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-zinc-800/60">
              <div className="h-5 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-24 bg-slate-200 dark:bg-zinc-850 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons skeleton mockup */}
      <div className="flex justify-end gap-3 pt-2">
        <div className="h-10 w-20 bg-slate-200 dark:bg-zinc-850 rounded-lg" />
        <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-850 rounded-lg" />
        <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-850 rounded-lg" />
      </div>
    </div>
  );
}
