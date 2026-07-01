import type { InvoiceStatus, InvoiceType } from "@/lib/supabase/database.types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  partial: "bg-indigo-100 text-indigo-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-amber-100 text-amber-700",
  void: "bg-red-100 text-red-700",
};

// The sale/rental distinction is the one thing this product treats
// differently everywhere on purpose — green for sale, amber for rental —
// so it should never accidentally look the same as a status badge.
const TYPE_STYLES: Record<InvoiceType, string> = {
  sale: "bg-primary-soft text-deepgreen",
  rental: "bg-rental-soft text-rental",
};

export function StatusBadge({ status, className = "" }: { status: InvoiceStatus; className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
        STATUS_STYLES[status],
        className,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export function TypeBadge({ type, className = "" }: { type: InvoiceType; className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
        TYPE_STYLES[type],
        className,
      ].join(" ")}
    >
      {type === "sale" ? "Sale" : "Rental"}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const tones: Record<typeof tone, string> = {
    neutral: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
