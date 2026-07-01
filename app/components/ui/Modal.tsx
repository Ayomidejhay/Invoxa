"use client";

import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white dark:bg-[#202023] border dark:border-zinc-800 text-dark dark:text-white rounded-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto shadow-xl`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-zinc-800/80 sticky top-0 bg-white dark:bg-[#202023] z-10">
            <h2 className="text-lg font-bold text-dark dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-muted dark:text-zinc-400 hover:text-dark dark:hover:text-white text-2xl leading-none cursor-pointer font-bold"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6 text-dark dark:text-zinc-150">{children}</div>
      </div>
    </div>
  );
}
