import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-slate-200 dark:border-zinc-800/80 rounded-2xl bg-slate-50/40 dark:bg-gradient-to-b dark:from-[#242427] dark:to-[#1C1C1E] shadow-sm dark:shadow-xl relative overflow-hidden transition-colors duration-200">
      {/* Decorative ambient glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {icon && (
        <div className="relative mb-5 p-4 rounded-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/30 text-blue-600 dark:text-blue-400 shadow-inner flex items-center justify-center">
          {/* Subtle pulse ambient background */}
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-md" />
          <div className="relative z-10">{icon}</div>
        </div>
      )}
      <h3 className="font-semibold text-lg text-dark dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6 relative z-10">{action}</div>}
    </div>
  );
}

