"use client";

import React from "react";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Title */}
      <div className="h-8 w-28 bg-slate-200 dark:bg-zinc-800 rounded-lg mb-6" />

      {/* Tabs list mockup */}
      <div className="border-b border-slate-200 dark:border-zinc-800 flex gap-6 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-5 w-24 bg-slate-150 dark:bg-zinc-800 rounded-md`} />
        ))}
      </div>

      {/* Card Form placeholder */}
      <div className="bg-white dark:bg-[#202023]/60 border border-slate-250 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded" />

        {/* Form elements grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-slate-150 dark:bg-zinc-800 rounded" />
              <div className="h-10 w-full bg-slate-100 dark:bg-zinc-900/40 rounded-lg border border-slate-200/50 dark:border-zinc-800/40" />
            </div>
          ))}
        </div>

        {/* Image upload placeholder */}
        <div className="space-y-3 pt-2">
          <div className="h-4 w-28 bg-slate-150 dark:bg-zinc-800 rounded" />
          <div className="h-16 w-16 bg-slate-100 dark:bg-zinc-850 rounded-xl" />
          <div className="h-10 w-full max-w-sm bg-slate-100 dark:bg-zinc-900/40 rounded-lg border border-slate-200/50 dark:border-zinc-800/40" />
        </div>

        {/* Submit button */}
        <div className="h-10 w-32 bg-slate-250 dark:bg-zinc-800 rounded-lg pt-2" />
      </div>
    </div>
  );
}
