"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Title / Header Area */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-44 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-5 w-32 bg-slate-100 dark:bg-zinc-800/60 rounded-md" />
      </div>

      {/* Checklist / Action Area */}
      <div className="bg-slate-55/40 dark:bg-[#1E1E21]/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-4 w-2/3 bg-slate-150 dark:bg-zinc-800/60 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-[#161618] border border-slate-200/40 dark:border-zinc-850 rounded-xl p-4" />
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl h-[98px]" />
        ))}
      </div>

      {/* Charts & Mockup Panels Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side: Chart Mockup */}
        <div className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl h-[280px] space-y-4">
          <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="w-full h-44 bg-slate-100 dark:bg-zinc-900/50 rounded-lg flex items-end justify-between p-4 gap-4">
            <div className="w-1/4 h-1/3 bg-slate-200 dark:bg-zinc-800 rounded-t" />
            <div className="w-1/4 h-2/3 bg-slate-200 dark:bg-zinc-800 rounded-t" />
            <div className="w-1/4 h-1/2 bg-slate-200 dark:bg-zinc-800 rounded-t" />
            <div className="w-1/4 h-5/6 bg-slate-200 dark:bg-zinc-800 rounded-t" />
          </div>
        </div>

        {/* Right Side: List Mockup */}
        <div className="bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl h-[280px] space-y-4">
          <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-800/40 last:border-0">
                <div className="space-y-1.5 w-2/3">
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-zinc-800/60 rounded" />
                </div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
