"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;
/** The active smooth-scroll instance, or null when the visitor prefers reduced motion. */
export const getLenis = () => lenis;

/**
 * Inertial smooth scrolling for wheel/trackpad, driven by GSAP's ticker so the pinned hero
 * and every ScrollTrigger stay perfectly in sync. Touch devices keep native scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9 });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // same-page anchors ("/#bridal" while on "/") glide to their section instead of jumping
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest("a");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      // preventDefault (not stopPropagation) so link onClick handlers, like closing the menu, still run
      e.preventDefault();
      // mobile-menu links fire while scrolling is paused; resume first, because a later
      // start() (when the menu closes) would reset Lenis and cancel this scroll
      instance.start();
      instance.scrollTo(target, { offset: target.tagName === "SECTION" ? 0 : -110, duration: 1.6 });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
