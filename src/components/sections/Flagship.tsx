"use client";

import { useRef } from "react";
import Image from "next/image";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import GoldButton from "@/components/ui/GoldButton";
import { BRAND } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { galleryHref, galleryPhoto } from "@/lib/galleries";

export default function Flagship() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const enter = { trigger: root.current, start: "top 65%" };
        gsap.from(".fs-reveal", {
          opacity: 0,
          y: 50,
          filter: "blur(8px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "filter",
          scrollTrigger: enter,
        });

        // store photo rises into its frame, then the two detail shots settle in around it
        const gallery = { trigger: ".fs-gallery", start: "top 75%" };
        gsap.fromTo(
          ".fs-mask",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "expo.inOut", scrollTrigger: gallery },
        );
        gsap.from(".fs-inset", { opacity: 0, y: 60, scale: 0.92, duration: 1.6, ease: "expo.out", stagger: 0.18, delay: 0.9, scrollTrigger: gallery });
        gsap.to(".fs-halo", { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out", delay: 0.6, scrollTrigger: gallery });

        const pass = { trigger: ".fs-gallery", start: "top bottom", end: "bottom top", scrub: 1.2 };
        gsap.fromTo(".fs-photo", { scale: 1.16 }, { scale: 1.02, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".fs-drift-a", { y: 50 }, { y: -70, ease: "none", scrollTrigger: pass });
        gsap.fromTo(".fs-drift-b", { y: -20 }, { y: 50, ease: "none", scrollTrigger: pass });

        gsap.from(".fs-map", {
          opacity: 0,
          y: 60,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".fs-map", start: "top 85%" },
        });
      });

      // without motion, show the glow straight away
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".fs-halo", { opacity: 1, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="flagship" className="relative overflow-hidden bg-ink-950 pb-20 pt-20 lg:pb-36 lg:pt-36">
      {/* night-sky backdrop, echoing the flagship photographed after dark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_35%,#2c1a3d_0%,#120c18_55%,#060509_100%)]" />
      <div aria-hidden className="hairline absolute inset-x-0 top-0 opacity-60" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:pl-24 lg:pr-12 xl:px-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* copy */}
          <div>
            <div className="fs-reveal mb-8 flex items-end gap-6">
              <span className="font-display text-7xl font-light italic leading-[1.1] text-gold-400/30 lg:text-8xl">07</span>
              <p className="eyebrow pb-4">
                <span className="mr-4 text-gold-500">{"// 07."}</span>The Flagship
              </p>
            </div>

            <h2 className="font-display text-[clamp(2.75rem,5.6vw,5.5rem)] font-light leading-[1.12] tracking-tight">
              <span className="fs-reveal block pb-[0.06em]">Visit our</span>
              <span className="fs-reveal block pb-[0.06em]">
                <span className="-mb-[0.22em] inline-block pb-[0.22em] pr-[0.12em] italic text-gold">flagship store.</span>
              </span>
            </h2>

            <p className="fs-reveal mt-8 max-w-lg text-[0.98rem] font-light leading-relaxed text-ivory/65">
              Every collection in this story is waiting for you at Janta College Square. Take a seat,
              try pieces on, bring the family, and choose without hurry.
            </p>

            {/* address card */}
            <div id="visit" className="fs-reveal relative mt-10 max-w-lg border border-gold-400/25 bg-ink-900/60 p-7 backdrop-blur-sm sm:p-8">
              {["-left-px -top-px border-l border-t", "-right-px -top-px border-r border-t", "-bottom-px -left-px border-b border-l", "-bottom-px -right-px border-b border-r"].map((pos) => (
                <span key={pos} aria-hidden className={`absolute h-4 w-4 border-gold-300 ${pos}`} />
              ))}
              <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-gold-300">Address</p>
              <address className="font-display text-2xl font-light lining-nums not-italic leading-snug text-ivory sm:text-[1.7rem]">
                {BRAND.address.line1},
                <br />
                {BRAND.address.line2},
                <br />
                {BRAND.address.region}
              </address>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.26em] text-gold-300 underline-offset-8 transition-colors hover:text-gold-100 hover:underline"
              >
                Open in Google Maps <span aria-hidden>↗</span>
              </a>

              <div className="my-7 h-px bg-gradient-to-r from-gold-400/40 to-transparent" />

              <p className="mb-3 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-gold-300">Call or WhatsApp</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href={BRAND.phone.tel} className="group inline-flex items-center gap-3 font-display text-2xl font-light lining-nums text-ivory transition-colors hover:text-gold-200 sm:text-[1.7rem]">
                  <PhoneIcon className="h-5 w-5 text-gold-400" />
                  {BRAND.phone.display}
                </a>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.26em] text-gold-300 underline-offset-8 transition-colors hover:text-gold-100 hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="fs-reveal mt-10 flex flex-wrap gap-4">
              {/* opens a WhatsApp chat with a pre-filled booking message */}
              <GoldButton href={BRAND.bookingUrl} external>
                Book a Visit
              </GoldButton>
              <GoldButton href={BRAND.directionsUrl} variant="outline" external>
                Get Directions
              </GoldButton>
              <GoldButton href={galleryHref("store")} variant="outline">
                See Flagship Store Gallery
              </GoldButton>
            </div>
          </div>

          {/* store photography */}
          <div className="fs-gallery relative mx-auto w-full max-w-[540px] pb-10 pt-6 lg:pb-16">
            <div aria-hidden className="fs-halo absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 scale-90 rounded-full bg-gold-500/20 opacity-0 blur-[100px]" />

            {/* main: the flagship lit up at night */}
            <figure className="relative ml-auto w-[88%] border border-gold-400/40 bg-ink-950 p-2 shadow-[0_0_90px_-25px_rgba(212,168,83,0.5),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="fs-mask absolute inset-0">
                  <div className="fs-photo absolute inset-0">
                    <Image
                      src={galleryPhoto("store", "flagship-night.webp")}
                      alt="Yellewar Jewellers flagship building lit up at night"
                      fill
                      sizes="(min-width: 1024px) 470px, 88vw"
                      className="object-cover object-[72%_50%]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/10" />
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_14px_rgba(6,5,9,0.65)]" />
                </div>
              </div>
              <span aria-hidden className="pointer-events-none absolute inset-4 border border-gold-200/20" />
              <figcaption className="absolute -top-4 left-6 z-10 border sm:-bottom-4 sm:left-auto sm:right-8 sm:top-auto border-gold-400/30 bg-ink-950 px-5 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-gold-200">
                <span className="mr-3 font-display text-xs italic tracking-normal text-gold-400">07</span>Janta College Square
              </figcaption>
            </figure>

            {/* festive storefront with the Marathi signage */}
            <div className="fs-inset absolute bottom-0 left-0 z-10 w-[38%]">
              <figure className="fs-drift-a border border-gold-300/50 bg-ink-950 p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(212,168,83,0.4)]">
                <div className="relative aspect-[9/16] overflow-hidden">
                  <Image src={galleryPhoto("store", "flagship-festive.webp")} alt="Yellewar Jewellers storefront decorated with marigolds and diyas" fill sizes="(min-width: 1024px) 200px, 38vw" className="object-cover" />
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_6px_rgba(6,5,9,0.5)]" />
                </div>
              </figure>
            </div>

            {/* daytime facade */}
            <div className="fs-inset absolute -right-4 top-0 z-10 w-[34%] sm:-right-8">
              <figure className="fs-drift-b border border-gold-300/50 bg-ink-950 p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(212,168,83,0.4)]">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={galleryPhoto("store", "flagship-day.webp")} alt="Yellewar Jewellers flagship facade with arched windows" fill sizes="(min-width: 1024px) 190px, 34vw" className="object-cover object-top" />
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_6px_rgba(6,5,9,0.5)]" />
                </div>
              </figure>
            </div>
          </div>
        </div>

        {/* map */}
        <div className="fs-map relative mt-16 lg:mt-32">
          <div className="relative overflow-hidden border border-gold-400/25 shadow-[0_0_80px_-30px_rgba(212,168,83,0.5)]">
            <iframe
              title={`Map showing ${BRAND.name}, ${BRAND.address.full}`}
              src={BRAND.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[340px] w-full border-0 [filter:grayscale(1)_invert(0.92)_sepia(0.45)_hue-rotate(-8deg)_saturate(1.4)_brightness(0.85)_contrast(0.95)] sm:h-[420px]"
            />
            {/* vignette ties the map into the page */}
            <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_30px_rgba(6,5,9,0.85)]" />
          </div>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 text-[0.62rem] uppercase tracking-[0.26em] text-ivory/40 sm:flex-row sm:items-center">
            <span>{BRAND.address.full}</span>
            <span className="text-gold-300/80">{BRAND.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
