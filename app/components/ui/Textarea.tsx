"use client";

import { forwardRef, useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dark dark:text-zinc-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          className={[
            "w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-sm transition-colors resize-y text-dark dark:text-zinc-100",
            "placeholder:text-muted dark:placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-deepgreen/30 dark:focus:ring-blue-500/30 focus:border-deepgreen dark:focus:border-blue-500",
            error ? "border-red-400" : "border-border dark:border-zinc-700/50",
            className,
          ].join(" ")}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
