"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Fixed vertical location label on the left edge, shown across the whole site.
 * Drifts gently with scroll and fills a thin gold progress line beneath it.
 */
export default function LocationRail() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // the rail lives in the root layout, so re-measure page height after every route change
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rail-inner", { opacity: 0, y: 30, duration: 1.8, ease: "expo.out", delay: 1.4 });

        const scrollAll = {
          trigger: document.documentElement,
          start: 0,
          end: "max",
          scrub: 1.2,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(".rail-drift", { y: -28 }, { y: 28, ease: "none", scrollTrigger: scrollAll });
        gsap.fromTo(".rail-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: scrollAll });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <aside
      ref={root}
      aria-label="Store location"
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-16 items-center justify-center lg:flex"
    >
      <div className="rail-inner">
        <div className="rail-drift flex flex-col items-center gap-5">
          <span className="h-20 w-px bg-gradient-to-b from-transparent to-gold-400/60" />
          <span className="h-1.5 w-1.5 rotate-45 border border-gold-300/80" />

          {/* vertical-rl + 180° turn reads bottom-to-top and renders identically in Chrome and Edge */}
          <p className="rail-text whitespace-nowrap text-[0.68rem] font-medium uppercase leading-none text-gold-200/75">
            {BRAND.address.city}
            <span className="rail-dot" aria-hidden />
            {BRAND.address.state}
          </p>

          <span className="h-1.5 w-1.5 rotate-45 border border-gold-300/80" />
          <span className="relative h-24 w-px overflow-hidden bg-gold-400/15">
            <span className="rail-progress absolute inset-0 origin-top bg-gradient-to-b from-gold-200 to-gold-500" />
          </span>
        </div>
      </div>
    </aside>
  );
}
