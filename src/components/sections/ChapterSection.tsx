"use client";

import { useRef } from "react";
import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import type { Chapter, Photo } from "@/lib/chapters";
import { galleryHref } from "@/lib/galleries";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  chapter: Chapter;
  /** Put the visual on the left instead of the right */
  reverse?: boolean;
};

/** Full-screen editorial chapter: text on one side, a gold "showcase arch" on the other. */
export default function ChapterSection({ chapter, reverse = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const pair = chapter.visuals.length > 1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const enter = { trigger: root.current, start: "top 65%" };

        // copy reveals in sequence
        gsap.from(".ch-reveal", {
          opacity: 0,
          y: 50,
          filter: "blur(8px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "filter",
          scrollTrigger: enter,
        });
        gsap.from(".ch-rule", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.out", scrollTrigger: enter });
        gsap.from(".ch-visual", { opacity: 0, y: 80, duration: 1.8, ease: "expo.out", stagger: 0.15, scrollTrigger: enter });
        // photos rise into their arches like a curtain lifting, then the detail shot settles in
        gsap.fromTo(
          ".ch-mask",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", stagger: 0.2, scrollTrigger: enter },
        );
        const hasInset = chapter.visuals.some((v) => v.inset);
        if (hasInset) {
          gsap.from(".ch-inset", { opacity: 0, y: 50, scale: 0.92, duration: 1.6, ease: "expo.out", delay: 0.9, scrollTrigger: enter });
        }

        // scrubbed, cinematic motion while the section passes through the viewport
        const pass = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 };
        gsap.fromTo(".ch-word", { xPercent: reverse ? -12 : 4 }, { xPercent: reverse ? 4 : -12, ease: "none", scrollTrigger: pass });
        // stacked layouts on small screens get gentler parallax so arches don't drift into the copy
        const depth = window.innerWidth >= 1024 ? 1 : 0.35;
        gsap.utils.toArray<HTMLElement>(".ch-arch").forEach((el, i) => {
          const travel = (i === 0 ? 70 : 130) * depth;
          gsap.fromTo(el, { y: travel }, { y: -travel, ease: "none", scrollTrigger: pass });
        });
        // slow zoom-out on the photos, detail shot drifts faster for depth
        gsap.fromTo(".ch-photo", { scale: 1.18 }, { scale: 1.02, ease: "none", scrollTrigger: pass });
        if (hasInset) {
          gsap.fromTo(".ch-inset-drift", { y: 60 * depth }, { y: -90 * depth, ease: "none", scrollTrigger: pass });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={chapter.id} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950 py-20 lg:py-36">
      {chapter.aliases?.map((a) => <span key={a} id={a} className="absolute top-0" aria-hidden />)}

      {/* backdrop glow sits behind the visual */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${
          reverse
            ? "bg-[radial-gradient(ellipse_55%_70%_at_25%_50%,#2c1a3d_0%,transparent_70%)]"
            : "bg-[radial-gradient(ellipse_55%_70%_at_75%_50%,#2c1a3d_0%,transparent_70%)]"
        } opacity-80`}
      />
      <div aria-hidden className="hairline absolute inset-x-0 top-0 opacity-60" />

      {/* giant outlined word drifting behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden">
        <p className="ch-word whitespace-nowrap pl-[6vw] font-display text-[clamp(8rem,24vw,26rem)] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(212,168,83,0.13)]">
          {chapter.word}
        </p>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:pl-24 lg:pr-12 xl:px-24">
        {/* copy */}
        <div className={reverse ? "lg:order-2" : "lg:order-1"}>
          <div className="ch-reveal mb-8 flex items-end gap-6">
            <span className="font-display text-7xl font-light italic leading-[1.1] text-gold-400/30 lg:text-8xl">{chapter.number}</span>
            <p className="eyebrow pb-4">
              <span className="mr-4 text-gold-500">{`// ${chapter.number}.`}</span>
              {chapter.label}
            </p>
          </div>

          <h2 className="font-display text-[clamp(2.75rem,5.6vw,5.5rem)] font-light leading-[1.12] tracking-tight">
            <span className="ch-reveal block pb-[0.06em]">{chapter.headline[0]}</span>
            <span className="ch-reveal block pb-[0.06em]">
              {/* padding gives the gradient fill room for descenders */}
              <span className="-mb-[0.22em] inline-block pb-[0.22em] pr-[0.12em] italic text-gold">{chapter.headline[1]}</span>
            </span>
          </h2>

          <div className="ch-rule my-8 flex items-center gap-3">
            <span className="h-px w-24 bg-gradient-to-r from-gold-400 to-gold-400/0" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold-300" />
          </div>

          <p className="ch-reveal max-w-lg text-[0.98rem] font-light leading-relaxed text-ivory/65">{chapter.description}</p>

          <ul className="mt-10 grid max-w-xl gap-6 sm:grid-cols-3">
            {chapter.highlights.map((h) => (
              <li key={h.title} className="ch-reveal border-t border-gold-400/20 pt-4">
                <p className="mb-2 flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-gold-300">
                  <span className="h-1 w-1 rotate-45 bg-gold-400" />
                  {h.title}
                </p>
                <p className="text-[0.82rem] font-light leading-relaxed text-ivory/50">{h.text}</p>
              </li>
            ))}
          </ul>

          <div className="ch-reveal mt-12 flex flex-wrap gap-4">
            {chapter.galleries.map((g) => (
              <GoldButton key={g.slug} href={galleryHref(g.slug)} variant="outline">
                {g.label}
              </GoldButton>
            ))}
          </div>
        </div>

        {/* visual */}
        {/* photo leads on phones; alternates sides on desktop */}
        <div className={`relative order-first flex items-center justify-center gap-6 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
          {chapter.visuals.map((v, i) => (
            <div key={v.photo.src} className={`ch-visual w-full ${pair ? "max-w-[260px]" : "max-w-[420px]"} ${pair && i === 1 ? "mt-12 lg:mt-24" : ""}`}>
              <Arch photo={v.photo} caption={v.caption} number={chapter.number} inset={v.inset} insetSide={reverse ? "right" : "left"} small={pair} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ArchProps = {
  photo: Photo;
  caption: string;
  number: string;
  inset?: Photo;
  /** Which side the detail shot overlaps, toward the copy */
  insetSide: "left" | "right";
  small?: boolean;
};

function Arch({ photo, caption, number, inset, insetSide, small = false }: ArchProps) {
  return (
    <figure className="ch-arch relative aspect-[3/4] w-full">
      {/* outer arch */}
      <div className="absolute inset-0 rounded-t-full border border-gold-400/40 shadow-[0_0_90px_-20px_rgba(212,168,83,0.4)]" />
      {/* photo window */}
      <div className="absolute inset-3 overflow-hidden rounded-t-full bg-ink-900 sm:inset-4">
        <div className="ch-mask absolute inset-0">
          <div className="ch-photo absolute inset-0">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={small ? "(min-width: 1024px) 260px, 45vw" : "(min-width: 1024px) 420px, 90vw"}
              className="object-cover"
            />
          </div>
          {/* tone the photo into the dark theme: vignette, base shadow and a faint gold sheen */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/5 to-ink-950/25" />
          <div className="absolute inset-0 shadow-[inset_0_0_70px_12px_rgba(6,5,9,0.75)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-200/[0.07] to-transparent mix-blend-screen" />
        </div>
      </div>
      {/* fine inner gold line */}
      <div className="pointer-events-none absolute inset-5 rounded-t-full border border-gold-200/20 sm:inset-6" />

      {inset && (
        <div
          className={`ch-inset absolute bottom-[14%] z-10 w-[36%] lg:w-[40%] ${insetSide === "left" ? "-left-[3%] lg:-left-[14%]" : "-right-[3%] lg:-right-[14%]"}`}
        >
          <div className="ch-inset-drift border border-gold-300/50 bg-ink-950 p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(212,168,83,0.35)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={inset.src} alt={inset.alt} fill sizes="(min-width: 1024px) 170px, 36vw" className="object-cover" />
              <div className="absolute inset-0 shadow-[inset_0_0_30px_6px_rgba(6,5,9,0.6)]" />
            </div>
          </div>
        </div>
      )}

      <figcaption className="absolute -bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap border border-gold-400/30 bg-ink-950 px-5 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-gold-200">
        <span className="font-display text-xs italic tracking-normal text-gold-400">{number}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
