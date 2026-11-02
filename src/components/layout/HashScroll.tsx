"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Arriving on the home page with a hash (e.g. from a gallery's "Back to Bridal"):
 * the hero's pin spacer is added after first paint and shifts every section down,
 * so re-scroll to the target once ScrollTrigger has laid things out.
 */
export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
      document.querySelector(hash)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }, 350);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
