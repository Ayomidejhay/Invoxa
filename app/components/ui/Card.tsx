export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={[
        "bg-white border border-border rounded-2xl shadow-sm",
        padded ? "p-6" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
