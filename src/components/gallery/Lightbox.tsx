"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/ContactIcons";
import { BRAND, whatsappLink } from "@/lib/constants";
import type { GalleryPhoto } from "@/lib/galleries";
import { getLenis } from "@/components/layout/SmoothScroll";

type Props = {
  photos: GalleryPhoto[];
  index: number;
  galleryTitle: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export default function Lightbox({ photos, index, galleryTitle, onIndexChange, onClose }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [origin, setOrigin] = useState("");

  const count = photos.length;
  const photo = photos[index];
  const go = useCallback((step: number) => onIndexChange((index + step + count) % count), [index, count, onIndexChange]);

  // keyboard, scroll lock and focus handling while open
  useEffect(() => {
    setOrigin(window.location.origin);
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      getLenis()?.start();
      previousFocus?.focus();
    };
  }, [go, onClose]);

  const number = String(index + 1).padStart(2, "0");
  // a direct link to the photo lets the store see exactly which design was meant
  const askMessage = `Hello ${BRAND.name}, I liked design #${number} in your ${galleryTitle} gallery. Is it available?${
    origin ? `\n${origin}${photo.src}` : ""
  }`;

  return (
    <div
      role="dialog"
      data-lenis-prevent
      aria-modal="true"
      aria-label={`${galleryTitle} gallery, photo ${index + 1} of ${count}`}
      className="fixed inset-0 z-[70] flex animate-lb-fade flex-col bg-ink-950/95 backdrop-blur-md"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(44,26,61,0.6)_0%,transparent_70%)]" />

      {/* top bar */}
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        <p className="flex items-baseline gap-3">
          <span className="font-display text-2xl italic text-gold-200 lining-nums">{number}</span>
          <span className="text-[0.62rem] uppercase tracking-[0.26em] text-ivory/50 lining-nums">
            of {count} · {galleryTitle}
          </span>
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/50 text-gold-100 transition-colors duration-300 hover:bg-gold-400 hover:text-ink-950 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* stage: clicking the empty space around the photo closes */}
      <div
        className="relative flex-1 px-4 sm:px-24"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* keyed so each photo replays the zoom-in */}
        <figure key={photo.src} className="pointer-events-none relative mx-auto h-full w-full max-w-5xl animate-lb-zoom">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            quality={90}
            priority
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          />
        </figure>

        <NavButton direction="prev" onClick={() => go(-1)} />
        <NavButton direction="next" onClick={() => go(1)} />
      </div>

      {/* bottom bar */}
      <div className="relative flex flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-center sm:gap-8 sm:py-7">
        <a
          href={whatsappLink(askMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-gold-400 px-6 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.26em] text-ink-950 transition-colors duration-500 hover:bg-gold-100"
        >
          <WhatsAppIcon className="h-4 w-4" /> Ask about this design
        </a>
        <a href={BRAND.phone.tel} className="font-display text-lg font-light text-ivory/80 lining-nums transition-colors hover:text-gold-200">
          or call {BRAND.phone.display}
        </a>
      </div>

      {/* preload neighbours so next/previous feel instant */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        {Array.from(new Set([(index + 1) % count, (index - 1 + count) % count]))
          .filter((i) => i !== index)
          .map((i) => photos[i])
          .map((p) => (
          <Image key={p.src} src={p.src} alt="" width={p.width} height={p.height} sizes="(min-width: 1024px) 80vw, 100vw" quality={90} priority />
        ))}
      </div>
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/50 bg-ink-950/60 text-gold-100 backdrop-blur transition-colors duration-300 hover:bg-gold-400 hover:text-ink-950 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold-300 sm:flex ${
        prev ? "left-4 sm:left-8" : "right-4 sm:right-8"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={prev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
