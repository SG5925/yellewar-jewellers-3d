"use client";

import { useRef } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/ContactIcons";
import GoldButton from "@/components/ui/GoldButton";
import { whatsappLink } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { galleryHref, galleryPhoto } from "@/lib/galleries";

const MARQUEE = ["New Arrivals", "Bridal", "Gold", "Diamond", "Silver", "Temple"];

const PHOTOS = [
  { src: galleryPhoto("new-arrivals", "new-arrival-1.webp"), alt: "Gold necklace with ruby drops and emerald accents" },
  { src: galleryPhoto("new-arrivals", "new-arrival-2.webp"), alt: "Gold pendant necklace on a teal display bust" },
  { src: galleryPhoto("new-arrivals", "new-arrival-3.webp"), alt: "Long necklace with black stone pendant on a dark display" },
  { src: galleryPhoto("new-arrivals", "new-arrival-4.webp"), alt: "Diamond necklace with emerald drops and matching earrings" },
  { src: galleryPhoto("new-arrivals", "new-arrival-5.webp"), alt: "Three gold and diamond rings on navy" },
];

/**
 * Interlude between the collection chapters and the flagship.
 * New designs change often, so visitors ask for the latest ones directly on WhatsApp.
 */
export default function NewArrivals() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const pass = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 };
        gsap.fromTo(".na-track-a", { xPercent: 0 }, { xPercent: -25, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".na-track-b", { xPercent: -25 }, { xPercent: 0, ease: "none", scrollTrigger: pass });

        // gallery frames fade up in sequence, then drift at slightly different speeds
        gsap.from(".na-frame", {
          opacity: 0,
          y: 80,
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".na-gallery", start: "top 80%" },
        });
        gsap.utils.toArray<HTMLElement>(".na-drift").forEach((el, i) => {
          const travel = [30, 60, 20, 70, 40][i % 5];
          gsap.fromTo(el, { y: travel }, { y: -travel, ease: "none", scrollTrigger: pass });
        });

        gsap.from(".na-reveal", {
          opacity: 0,
          y: 40,
          filter: "blur(8px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "filter",
          scrollTrigger: { trigger: ".na-copy", start: "top 75%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = [...MARQUEE, ...MARQUEE, ...MARQUEE];

  return (
    <section ref={root} id="new-arrivals" className="relative overflow-hidden border-y border-gold-400/15 bg-ink-900 py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(212,168,83,0.08)_0%,transparent_70%)]" />

      {/* two counter-moving rows of words */}
      <div aria-hidden className="pointer-events-none select-none space-y-2 font-display font-light leading-[1.15]">
        <p className="na-track-a flex whitespace-nowrap text-[clamp(3rem,8vw,7.5rem)] italic">
          {row.map((w, i) => (
            <span key={i} className="flex items-center">
              <span className="-mb-[0.2em] inline-block pb-[0.2em] pr-[0.1em] text-gold">{w}</span>
              <span className="mx-[0.4em] inline-block h-[0.14em] w-[0.14em] rotate-45 bg-gold-400/60" />
            </span>
          ))}
        </p>
        <p className="na-track-b flex whitespace-nowrap text-[clamp(3rem,8vw,7.5rem)] text-transparent [-webkit-text-stroke:1px_rgba(212,168,83,0.3)]">
          {row.map((w, i) => (
            <span key={i} className="flex items-center">
              {w}
              <span className="mx-[0.4em] inline-block h-[0.14em] w-[0.14em] rotate-45 border border-gold-400/40" />
            </span>
          ))}
        </p>
      </div>

      {/* gallery: a row on desktop, swipeable on phones */}
      <div className="na-gallery relative mx-auto mt-14 max-w-[1440px] lg:mt-20 lg:pl-24 lg:pr-12 xl:px-24">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {PHOTOS.map((photo, i) => (
            <li key={photo.src} className={`na-frame w-[62vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none ${i % 2 === 1 ? "lg:mt-16" : ""}`}>
              <figure className="na-drift group relative border border-gold-400/30 bg-ink-950 p-1.5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-700 hover:border-gold-300/70 hover:shadow-[0_0_40px_-8px_rgba(212,168,83,0.45),0_30px_60px_-25px_rgba(0,0,0,0.9)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 62vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_6px_rgba(6,5,9,0.6)]" />
                </div>
                <figcaption className="absolute bottom-4 left-5 font-display text-sm italic text-gold-200/90">
                  {String(i + 1).padStart(2, "0")} · New
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="na-copy relative mx-auto mt-14 flex max-w-[1440px] flex-col items-start justify-between gap-8 px-6 lg:mt-20 lg:flex-row lg:items-end lg:pl-24 lg:pr-12 xl:px-24">
        <div className="max-w-xl">
          <p className="na-reveal eyebrow mb-5">
            <span className="mr-4 text-gold-500">{"// New."}</span>Just arrived
          </p>
          <p className="na-reveal font-display text-3xl font-light leading-snug text-ivory sm:text-4xl">
            New designs reach our counters every season. Ask us for the latest pieces and we&apos;ll
            send photos straight to your phone.
          </p>
        </div>
        <div className="na-reveal flex flex-wrap gap-4">
          <GoldButton href={whatsappLink("Hello Yellewar Jewellers, please share your latest new arrivals.")} external>
            <span className="inline-flex items-center gap-3">
              <WhatsAppIcon className="h-4 w-4" />
              Ask for New Arrivals
            </span>
          </GoldButton>
          <GoldButton href={galleryHref("new-arrivals")} variant="outline">
            See New Arrival Sets in Store Gallery
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
