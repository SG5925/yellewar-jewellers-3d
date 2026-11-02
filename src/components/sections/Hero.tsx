"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import { BRAND } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroScroll } from "@/lib/scrollStore";

// WebGL only runs in the browser
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const CATEGORIES = ["Bridal", "Gold", "Diamond", "Silver"];
const CHAPTER_WORD = "COLLECTIONS";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [ringReady, setRingReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // stop rendering WebGL once the hero (and its pinned transition) has scrolled away
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      // ── Intro on load ───────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-emblem", { opacity: 0, y: -16, scale: 0.9, duration: 1.6 }, 0.1)
        .from(".hero-line", { opacity: 0, y: 40, filter: "blur(8px)", duration: 1.6, stagger: 0.14, clearProps: "filter" }, 0.35)
        .from(".hero-fade", { opacity: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.9)
        .from(".hero-scene", { opacity: 0, scale: 0.9, duration: 2.4 }, 0.2)
        .from(".hero-halo", { opacity: 0, scale: 0.8, rotate: -40, duration: 2.8 }, 0.3)
        .from(".hero-rule", { scaleX: 0, duration: 1.6, transformOrigin: "left" }, 0.7)
        .from(".hero-frame", { opacity: 0, duration: 2 }, 1);

      // slow, endless rotation of the gold halo
      gsap.to(".hero-halo-ring", { rotate: 360, duration: 90, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

      // ── Pinned scroll: Hero → Chapter 02 ────────────────────────────
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        // matchMedia only runs this when at least one query matches, so cover both widths
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023.98px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isDesktop, reduceMotion } = ctx.conditions as { isDesktop: boolean; reduceMotion: boolean };
          if (reduceMotion) return;

          const scroll = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=220%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            // drive the 3D scene from the smoothed timeline progress
            onUpdate: () => {
              heroScroll.progress = scroll.progress();
            },
          });

          // 1. hero copy leaves
          scroll
            .to(q(".hero-copy"), { opacity: 0, y: -90, ease: "power2.in", duration: 0.25 }, 0)
            .to(q(".hero-out"), { opacity: 0, duration: 0.15 }, 0)
            .to(q(".hero-shade"), { opacity: 0, duration: 0.25 }, 0)
            .to(q(".halo-scroll"), { scale: 1.3, opacity: 0.35, duration: 0.55 }, 0);

          // 2. ring moves to centre stage
          if (isDesktop) {
            const toCentre = () => -window.innerWidth * 0.19;
            scroll
              .to(q(".hero-stage"), { x: toCentre, duration: 0.35, ease: "power2.inOut" }, 0.02)
              .to(q(".halo-scroll"), { x: toCentre, duration: 0.35, ease: "power2.inOut" }, 0.02);
          } else {
            // ring glides from the top of the screen to the centre for the chapter title
            scroll.fromTo(q(".hero-stage"), { y: 0, yPercent: -18 }, { y: 0, yPercent: 0, duration: 0.35, ease: "power2.inOut" }, 0);
          }

          // 3. chapter title rises behind the ring
          scroll
            .to(q(".c-intro"), { opacity: 1, duration: 0.01 }, 0.32)
            .fromTo(q(".c-intro-eyebrow"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.34)
            .fromTo(
              q(".c-intro-char"),
              { yPercent: 70, opacity: 0, filter: "blur(14px)" },
              { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.018, duration: 0.22 },
              0.38,
            )
            .fromTo(q(".c-intro-sub"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.62)
            // hold so the burst can be enjoyed before the grid scrolls in
            .to({}, { duration: 0.2 }, 0.8);

          return () => {
            heroScroll.progress = 0;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950 lg:items-center">
      {/* backdrop: night-sky plum glow like the flagship facade, with a warm gold bloom */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_72%_45%,#2c1a3d_0%,#120c18_50%,#060509_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,#2c1a3d_0%,transparent_100%)] opacity-60" />

      {/* gold halo behind the ring (desktop) */}
      <div aria-hidden className="pointer-events-none absolute left-[69%] top-1/2 hidden h-[min(720px,88vh)] w-[min(720px,88vh)] -translate-x-1/2 -translate-y-1/2 lg:block">
        <div className="halo-scroll h-full w-full">
          <div className="hero-halo h-full w-full">
            <svg viewBox="0 0 640 640" className="hero-halo-ring h-full w-full">
              <defs>
                <linearGradient id="halo-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e9d29a" stopOpacity="0.55" />
                  <stop offset="50%" stopColor="#d4a853" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#e9d29a" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <circle cx="320" cy="320" r="300" fill="none" stroke="url(#halo-gold)" strokeWidth="1" />
              <circle cx="320" cy="320" r="268" fill="none" stroke="#d4a853" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 10" />
              {Array.from({ length: 72 }).map((_, i) => (
                <line
                  key={i}
                  x1="320"
                  y1="14"
                  x2="320"
                  y2={i % 6 === 0 ? 30 : 22}
                  stroke="#d4a853"
                  strokeOpacity={i % 6 === 0 ? 0.5 : 0.18}
                  transform={`rotate(${i * 5} 320 320)`}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Chapter 02 title: sits behind the ring, revealed while pinned */}
      <div aria-hidden className="c-intro pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0">
        <p className="c-intro-eyebrow eyebrow absolute top-[13%]">
          <span className="mr-4 text-gold-500">{"// 02."}</span>The Collections
        </p>
        <p className="flex select-none font-display text-[clamp(3.5rem,13.5vw,15rem)] font-light leading-[1.1] tracking-[-0.02em]">
          {CHAPTER_WORD.split("").map((ch, i) => (
            <span key={i} className="c-intro-char text-gold inline-block pb-[0.12em]">
              {ch}
            </span>
          ))}
        </p>
        <p className="c-intro-sub absolute bottom-[7%] px-6 text-center font-display text-xl italic text-ivory/70 md:text-2xl">
          Six worlds of craft, one family of jewellers.
        </p>
      </div>

      {/* 3D */}
      {/* phones: ring sits in the upper part of the screen, copy below; desktop: ring on the right */}
      <div className="hero-stage absolute inset-0 -translate-y-[18%] lg:left-[38%] lg:translate-y-0">
        <div className="hero-scene h-full w-full">
          <HeroScene paused={!onScreen} onReady={() => setRingReady(true)} />
        </div>
        {/* shown while the 3D ring downloads; fades out once it is on screen */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${ringReady ? "opacity-0" : "opacity-100"}`}
        >
          <span className="relative flex h-40 w-40 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-gold-400/15" />
            <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-gold-300/80 [animation-duration:1.6s]" />
            <span className="absolute inset-6 animate-pulse rounded-full bg-gold-500/10 blur-xl" />
            <span className="text-[0.55rem] uppercase tracking-luxe text-gold-200/70">Loading</span>
          </span>
        </div>
      </div>

      {/* legibility + vignette */}
      <div aria-hidden className="hero-shade absolute inset-0 bg-[linear-gradient(to_top,#060509_0%,rgba(6,5,9,0.85)_40%,transparent_66%)] lg:bg-[linear-gradient(to_right,rgba(6,5,9,0.7)_0%,transparent_50%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_60px_rgba(6,5,9,0.9)]" />

      {/* fine gold frame */}
      <div aria-hidden className="hero-frame pointer-events-none absolute inset-x-4 bottom-4 top-24 hidden border border-gold-400/10 md:block lg:bottom-6 lg:left-16 lg:right-6">
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos) => (
          <span key={pos} className={`absolute h-6 w-6 border-gold-300/60 ${pos}`} />
        ))}
      </div>

      <div className="hero-out">
        {/* footer rail */}
        <div className="hero-fade absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1440px] items-end justify-between px-6 pb-10 lg:pl-24 lg:pr-12">
          <a
            href={BRAND.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden max-w-md text-[0.62rem] uppercase leading-relaxed tracking-[0.22em] text-ivory/40 transition-colors hover:text-gold-200 sm:block"
          >
            <address className="not-italic">
              {BRAND.address.line1}
              <br />
              {BRAND.address.line2}, {BRAND.address.region}
            </address>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
            <span className="text-[0.6rem] uppercase tracking-luxe text-ivory/50">Scroll</span>
            <span className="relative h-14 w-px overflow-hidden bg-ivory/10">
              <span className="absolute inset-0 animate-scroll-line bg-gold-300" />
            </span>
          </div>

          <span className="hidden font-display text-sm italic text-gold-300/80 sm:block">01 / 07</span>
        </div>
      </div>

      {/* copy */}
      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-12 pt-24 sm:pb-24 lg:pl-24 lg:pr-12">
        <div className="max-w-2xl">
          <div className="hero-emblem mb-6 hidden items-center gap-5 sm:flex">
            <Image
              src={BRAND.logo.src}
              alt=""
              width={BRAND.logo.width}
              height={BRAND.logo.height}
              priority
              className="h-14 w-auto drop-shadow-[0_0_24px_rgba(212,168,83,0.35)]"
            />
            <span className="h-px w-16 bg-gradient-to-r from-gold-400/70 to-transparent" />
          </div>

          <p className="hero-fade eyebrow mb-7">
            <span className="mr-4 whitespace-nowrap text-gold-500">{"// 01."}</span>
            {BRAND.tagline}
          </p>

          {/* no clipping on these lines, so descenders (g, y, p) always render in full */}
          <h1 className="font-display text-[clamp(2.5rem,min(7vw,9.5vh),6.75rem)] font-light leading-[1.15] tracking-tight">
            <span className="hero-line block pb-[0.08em]">
              <span className="block">Heirlooms</span>
            </span>
            <span className="hero-line block pb-[0.08em]">
              {/* gradient text is painted by the span's background, so the span itself needs
                  room below the baseline or the bottom of the "g" is left unpainted */}
              <span className="-mb-[0.22em] inline-block pb-[0.22em] pr-[0.12em] italic text-gold">forged in gold,</span>
            </span>
            <span className="hero-line block pb-[0.08em]">
              <span className="block">worn for ever.</span>
            </span>
          </h1>

          <div className="hero-rule mb-6 mt-6 flex items-center gap-3">
            <span className="h-px w-24 bg-gradient-to-r from-gold-400 to-gold-400/0" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold-300" />
          </div>

          <p className="hero-fade hidden max-w-md text-[0.95rem] sm:block font-light leading-relaxed text-ivory/65">
            Bridal sets, temple gold, diamonds and silver, chosen piece by piece for the
            moments your family will remember. Visit our flagship store in Chandrapur.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap gap-4">
            <GoldButton href="#collections">Explore Collections</GoldButton>
            <GoldButton href="#flagship" variant="outline">
              Visit the Flagship
            </GoldButton>
          </div>

          <ul className="hero-fade mt-8 hidden flex-wrap items-center sm:flex gap-x-3 gap-y-2 text-[0.62rem] uppercase tracking-[0.24em] text-ivory/40 sm:gap-x-5 sm:tracking-luxe">
            {CATEGORIES.map((c, i) => (
              <li key={c} className="flex items-center gap-3 sm:gap-5">
                {i > 0 && <span className="h-1 w-1 rotate-45 bg-gold-500/60" />}
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
