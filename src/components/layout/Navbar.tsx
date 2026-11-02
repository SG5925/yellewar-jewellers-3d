"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLenis } from "@/components/layout/SmoothScroll";
import Logo from "@/components/ui/Logo";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-ink-950/75 py-3 backdrop-blur-xl"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Logo />

          <ul className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative text-[0.7rem] uppercase tracking-[0.26em] text-ivory/70 transition-colors hover:text-gold-200"
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-gold-400 transition-all duration-500 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <Link
              href="/#visit"
              className="hidden border border-gold-400/50 px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.26em] text-gold-100 transition-colors duration-500 hover:bg-gold-400 hover:text-ink-950 md:inline-block"
            >
              Book a Visit
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={`h-px w-6 bg-gold-200 transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 bg-gold-200 transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: a sibling of the header, because the header's backdrop blur
          would otherwise trap this fixed overlay inside the header bar */}
      <div
        data-lenis-prevent
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950/95 px-8 py-24 backdrop-blur-xl transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* my-auto centres the menu but still lets it scroll on very short screens */}
        <div className="my-auto">
          <ul className="space-y-6">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 font-display text-4xl text-ivory transition-colors hover:text-gold-200"
                >
                  <span className="font-sans text-xs text-gold-400">
                    0{i + 1}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* contact + location (the vertical location rail is desktop-only) */}
          <div className="mt-12 space-y-5 border-t border-gold-400/20 pt-8">
            <a
              href={BRAND.bookingUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-3 bg-gold-400 px-6 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.26em] text-ink-950"
            >
              <WhatsAppIcon className="h-4 w-4" /> Book a Visit
            </a>
            <a
              href={BRAND.phone.tel}
              className="flex items-center gap-3 font-display text-2xl font-light lining-nums text-ivory"
            >
              <PhoneIcon className="h-4 w-4 text-gold-400" />
              {BRAND.phone.display}
            </a>
            <p className="text-[0.6rem] uppercase tracking-luxe text-gold-300/80">
              {BRAND.address.city} · {BRAND.address.state}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
