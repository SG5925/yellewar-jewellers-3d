"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import CollectionIcon from "@/components/ui/CollectionIcon";
import type { Collection } from "@/lib/collections";

export default function CollectionCard({ item, index }: { item: Collection; index: number }) {
  // a soft gold light follows the cursor across the card
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Link
      href={`#${item.slug}`}
      onMouseMove={onMove}
      className="group relative flex aspect-square flex-col sm:aspect-[4/5] overflow-hidden border border-gold-400/15 bg-gradient-to-b from-ink-800 to-ink-950 p-7 transition-[transform,border-color,box-shadow] duration-700 ease-out hover:-translate-y-1.5 hover:border-gold-300/60 hover:shadow-[0_0_0_1px_rgba(221,185,107,0.25),0_0_40px_-6px_rgba(212,168,83,0.45),0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:p-8"
    >
      {/* full-bleed photo, toned dark so the copy stays legible */}
      {item.image && (
        <span aria-hidden className="card-photo absolute inset-0">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-90 transition-[transform,opacity] duration-[1400ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent" />
          <span className="absolute inset-0 shadow-[inset_0_0_80px_10px_rgba(6,5,9,0.7)]" />
        </span>
      )}
      {/* cursor light */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(212,168,83,0.16), transparent 60%)" }}
      />
      {/* inner hairline frame */}
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-gold-400/[0.12] transition-colors duration-700 group-hover:border-gold-300/40" />

      <div className="relative flex items-start justify-between">
        <span className="font-display text-sm italic text-gold-400/80">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-2 w-2 rotate-45 border border-gold-400/50 transition-all duration-700 group-hover:rotate-[225deg] group-hover:bg-gold-400" />
      </div>

      {/* artwork: line drawing only when there is no photo */}
      <div className="relative flex flex-1 items-center justify-center py-4">
        {!item.image && (
          <>
            <span aria-hidden className="absolute h-40 w-40 rounded-full bg-gold-500/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-gold-500/20" />
            <CollectionIcon
              name={item.icon}
              className="relative h-40 w-40 opacity-80 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100 sm:h-48 sm:w-48"
            />
          </>
        )}
      </div>

      <div className="relative">
        <div className="mb-4 h-px w-10 bg-gold-400/50 transition-all duration-700 group-hover:w-20 group-hover:bg-gold-300" />
        <h3 className="font-display text-3xl font-light leading-tight text-ivory transition-colors duration-500 group-hover:text-gold-100 sm:text-[2.1rem]">
          {item.name}
        </h3>
        <p className="mt-3 text-[0.85rem] font-light leading-relaxed text-ivory/70">{item.description}</p>
        <span className="mt-6 inline-flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-gold-300">
          Explore
          <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </Link>
  );
}
