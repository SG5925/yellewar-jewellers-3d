import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  /** Open in a new tab (maps, WhatsApp, etc.) */
  external?: boolean;
  className?: string;
};

export default function GoldButton({ href, children, variant = "solid", external = false, className = "" }: Props) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] transition-colors duration-500";
  const styles =
    variant === "solid"
      ? "bg-gold-400 text-ink-950 hover:text-ink-950"
      : "border border-gold-400/50 text-gold-100 hover:border-gold-300 hover:text-ink-950";

  return (
    <Link
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {/* sweep fill on hover */}
      <span
        aria-hidden
        className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 ${
          variant === "solid" ? "bg-gold-100" : "bg-gold-400"
        }`}
      />
      <span className="relative">{children}</span>
      <span aria-hidden className="relative transition-transform duration-500 group-hover:translate-x-1">
        {external ? "↗" : "→"}
      </span>
    </Link>
  );
}
