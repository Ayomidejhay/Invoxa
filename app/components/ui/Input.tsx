"use client";

import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dark dark:text-zinc-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={[
            "w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-sm transition-colors text-dark dark:text-zinc-100",
            "placeholder:text-muted dark:placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-deepgreen/30 dark:focus:ring-blue-500/30 focus:border-deepgreen dark:focus:border-blue-500",
            error ? "border-red-400" : "border-border dark:border-zinc-700/50",
            props.disabled ? "bg-gray-50 text-muted cursor-not-allowed dark:bg-zinc-900 dark:text-zinc-600" : "",
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

Input.displayName = "Input";
