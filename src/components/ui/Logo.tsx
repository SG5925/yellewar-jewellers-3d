import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

type Props = {
  className?: string;
  /** Show the YELLEWAR / JEWELLERS wordmark next to the emblem */
  wordmark?: boolean;
};

export default function Logo({ className = "", wordmark = true }: Props) {
  return (
    <Link href="/" aria-label={`${BRAND.name} home`} className={`group flex items-center gap-3 ${className}`}>
      <Image
        src={BRAND.logo.src}
        alt={`${BRAND.name} logo`}
        width={BRAND.logo.width}
        height={BRAND.logo.height}
        priority
        className="h-11 w-auto drop-shadow-[0_0_12px_rgba(212,168,83,0.25)] transition-transform duration-700 group-hover:scale-105"
      />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-medium tracking-[0.22em] text-ivory transition-colors group-hover:text-gold-200">
            YELLEWAR
          </span>
          <span className="mt-1.5 text-[0.55rem] tracking-luxe text-gold-400">JEWELLERS</span>
        </span>
      )}
    </Link>
  );
}
