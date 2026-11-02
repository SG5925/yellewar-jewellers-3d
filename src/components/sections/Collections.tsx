"use client";

import { useRef } from "react";
import CollectionCard from "@/components/ui/CollectionCard";
import { COLLECTIONS } from "@/lib/collections";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export default function Collections() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".col-head > *", {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".col-head", start: "top 80%" },
        });

        gsap.set(".collection-card", { opacity: 0, y: 70 });
        gsap.set(".collection-card .card-photo", { opacity: 0, scale: 1.2 });
        ScrollTrigger.batch(".collection-card", {
          start: "top 88%",
          onEnter: (batch) => {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, overwrite: true });
            // photos settle in slightly after their cards
            const photos = batch.flatMap((card) => Array.from(card.querySelectorAll(".card-photo")));
            gsap.to(photos, { opacity: 1, scale: 1, duration: 2, ease: "expo.out", stagger: 0.12, delay: 0.15 });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="collections" className="relative overflow-hidden bg-ink-950 py-28 lg:py-40">
      {/* backdrop continues the hero's plum glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,#2c1a3d_0%,transparent_70%)] opacity-70" />
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:pl-24 lg:pr-12 xl:px-24">
        <header className="col-head mb-16 grid gap-8 lg:mb-24 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-6">
              <span className="mr-4 text-gold-500">{"// 02."}</span>The Collections
            </p>
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-light leading-[1.12]">
              Curated for every
              <br />
              <span className="-mb-[0.2em] inline-block pb-[0.2em] pr-[0.1em] italic text-gold">occasion.</span>
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/60 lg:justify-self-end">
            From a bride&apos;s first set to the silver payal gifted at a naming ceremony, every
            collection is chosen with the same care. Step inside any of them.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {COLLECTIONS.map((item, i) => (
            // GSAP animates this wrapper; the card's own transform is left to its CSS hover
            <div key={item.slug} className="collection-card">
              <CollectionCard item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
