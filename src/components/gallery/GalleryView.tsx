"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "@/components/gallery/Lightbox";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { BRAND, whatsappLink } from "@/lib/constants";
import { GALLERIES, galleryHref, type GalleryInfo, type GalleryPhoto } from "@/lib/galleries";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = { gallery: GalleryInfo; photos: GalleryPhoto[] };

export default function GalleryView({ gallery, photos }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gv-reveal", {
          opacity: 0,
          y: 40,
          filter: "blur(8px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.08,
          clearProps: "filter",
          delay: 0.15,
        });

        // photos fade up in small groups as they scroll into view
        gsap.set(".gv-item", { opacity: 0, y: 40 });
        ScrollTrigger.batch(".gv-item", {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const askMessage = `Hello ${BRAND.name}, I was browsing your ${gallery.title} gallery on the website. Could you tell me which designs are available?`;

  return (
    <section ref={root} className="relative min-h-screen overflow-hidden bg-ink-950 pb-24 pt-32 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,#2c1a3d_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:pl-24 lg:pr-12 xl:px-24">
        {/* header */}
        <header className="mb-12 grid gap-10 lg:mb-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Link
              href={gallery.sectionHref}
              className="gv-reveal group mb-10 inline-flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-ivory/50 transition-colors hover:text-gold-200"
            >
              <span aria-hidden className="transition-transform duration-500 group-hover:-translate-x-1">←</span>
              Back to {gallery.title}
            </Link>
            <p className="gv-reveal eyebrow mb-6">
              <span className="mr-4 text-gold-500">{`// ${gallery.number}.`}</span>Store Gallery
            </p>
            <h1 className="gv-reveal font-display text-[clamp(2.75rem,6vw,5.75rem)] font-light leading-[1.1] tracking-tight">
              {gallery.title}{" "}
              <span className="-mb-[0.22em] inline-block pb-[0.22em] pr-[0.12em] italic text-gold">Gallery.</span>
            </h1>
          </div>

          <div className="gv-reveal lg:justify-self-end">
            <p className="max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/65">
              <span className="font-display text-xl text-gold-200 lining-nums">{photos.length} designs</span> to browse from home.
              See something you love? Call or WhatsApp us to check availability before you visit.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={whatsappLink(askMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-gold-400/50 px-5 py-3 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-gold-100 transition-colors duration-500 hover:bg-gold-400 hover:text-ink-950"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask about availability
              </a>
              <a href={BRAND.phone.tel} className="inline-flex items-center gap-2 font-display text-xl font-light lining-nums text-ivory transition-colors hover:text-gold-200">
                <PhoneIcon className="h-4 w-4 text-gold-400" />
                {BRAND.phone.display}
              </a>
            </div>
          </div>
        </header>

        {/* switch between galleries */}
        <nav aria-label="Galleries" className="gv-reveal -mx-4 mb-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:mb-14">
          <ul className="flex min-w-max gap-2 border-b border-gold-400/15 pb-5">
            {GALLERIES.map((g) => {
              const current = g.slug === gallery.slug;
              return (
                <li key={g.slug}>
                  <Link
                    href={galleryHref(g.slug)}
                    aria-current={current ? "page" : undefined}
                    className={`inline-block border px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] transition-colors duration-500 ${
                      current
                        ? "border-gold-300 bg-gold-400 text-ink-950"
                        : "border-gold-400/20 text-ivory/60 hover:border-gold-300/60 hover:text-gold-100"
                    }`}
                  >
                    {g.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* masonry */}
        {photos.length === 0 ? (
          <p className="py-24 text-center font-display text-2xl italic text-ivory/50">New photos are on their way.</p>
        ) : (
          <ul className="columns-2 gap-3 sm:gap-5 md:columns-3 xl:columns-4">
            {photos.map((photo, i) => (
              <li key={photo.src} className="gv-item mb-3 break-inside-avoid sm:mb-5">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Open ${photo.alt}`}
                  className="group relative block w-full overflow-hidden border border-gold-400/15 bg-ink-900 p-1 transition-[border-color,box-shadow] duration-700 hover:border-gold-300/60 hover:shadow-[0_0_0_1px_rgba(221,185,107,0.2),0_0_40px_-8px_rgba(212,168,83,0.45)] focus-visible:border-gold-300 focus-visible:outline-none"
                >
                  <span className="relative block overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
                      className="h-auto w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    />
                    {/* hover veil */}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <span className="font-display text-sm italic text-gold-200 lining-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-300/70 text-gold-100">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* closing call to action */}
        <div className="mt-20 flex flex-col items-center border-t border-gold-400/15 pt-16 text-center">
          <p className="font-display text-3xl font-light leading-snug text-ivory sm:text-4xl">
            Found a design you love?
          </p>
          <p className="mt-4 max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/60">
            Send us its number on WhatsApp and we&apos;ll confirm availability before you make the trip to Janta College Square.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={whatsappLink(askMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gold-400 px-7 py-4 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-ink-950 transition-colors duration-500 hover:bg-gold-100"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp the store
            </a>
            <Link
              href={gallery.sectionHref}
              className="inline-flex items-center gap-3 border border-gold-400/50 px-7 py-4 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-gold-100 transition-colors duration-500 hover:bg-gold-400 hover:text-ink-950"
            >
              ← Back to {gallery.title}
            </Link>
          </div>
        </div>
      </div>

      {active !== null && (
        <Lightbox
          photos={photos}
          index={active}
          galleryTitle={gallery.title}
          onIndexChange={setActive}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
