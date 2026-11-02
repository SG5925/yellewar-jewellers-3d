import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-gold-400/15 bg-ink-950">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(44,26,61,0.9)_0%,transparent_70%)]" />
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />

      <div className="relative mx-auto max-w-[1440px] px-6 pt-20 lg:pl-24 lg:pr-12 lg:pt-28 xl:px-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr] lg:gap-12">
          {/* brand */}
          <div>
            <Link href="/" aria-label={`${BRAND.name} home`} className="inline-flex items-center gap-4">
              <Image
                src={BRAND.logo.src}
                alt={`${BRAND.name} logo`}
                width={BRAND.logo.width}
                height={BRAND.logo.height}
                className="h-16 w-auto drop-shadow-[0_0_18px_rgba(212,168,83,0.3)]"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-medium tracking-[0.22em] text-ivory">YELLEWAR</span>
                <span className="mt-2 text-[0.58rem] tracking-luxe text-gold-400">JEWELLERS</span>
              </span>
            </Link>
            <p className="mt-7 max-w-xs font-display text-xl font-light italic leading-snug text-ivory/60">
              {BRAND.tagline}, from our family to yours.
            </p>
          </div>

          {/* visit */}
          <div>
            <h3 className="mb-6 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-gold-300">Visit</h3>
            <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="group flex gap-3">
              <PinIcon className="mt-1 h-4 w-4 shrink-0 text-gold-400" />
              <address className="text-[0.9rem] font-light not-italic leading-relaxed text-ivory/70 transition-colors group-hover:text-gold-100">
                {BRAND.address.line1},
                <br />
                {BRAND.address.line2},
                <br />
                {BRAND.address.region}
              </address>
            </a>
            <a
              href={BRAND.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 pl-7 text-[0.62rem] uppercase tracking-[0.26em] text-gold-300 underline-offset-8 hover:text-gold-100 hover:underline"
            >
              Get Directions <span aria-hidden>↗</span>
            </a>
          </div>

          {/* contact */}
          <div>
            <h3 className="mb-6 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-gold-300">Contact</h3>
            <a href={BRAND.phone.tel} className="group flex items-center gap-3 font-display text-2xl font-light lining-nums text-ivory transition-colors hover:text-gold-200">
              <PhoneIcon className="h-4 w-4 text-gold-400" />
              {BRAND.phone.display}
            </a>
            <a
              href={BRAND.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-3 border border-gold-400/50 px-6 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.26em] text-gold-100 transition-colors duration-500 hover:border-gold-300 hover:bg-gold-400 hover:text-ink-950"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          {/* explore */}
          <nav aria-label="Footer">
            <h3 className="mb-6 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-gold-300">Explore</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 text-[0.9rem] font-light text-ivory/70 transition-colors hover:text-gold-100"
                  >
                    <span className="h-px w-3 bg-gold-400/50 transition-all duration-500 group-hover:w-6 group-hover:bg-gold-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* oversized wordmark */}
        <p
          aria-hidden
          className="pointer-events-none mt-20 select-none whitespace-nowrap text-center font-display text-[clamp(4rem,17vw,16rem)] font-light leading-[0.9] tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgba(212,168,83,0.22)] lg:mt-24"
        >
          YELLEWAR
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-gold-400/15 py-8 text-[0.62rem] uppercase tracking-[0.22em] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-gold-300/70">
            {BRAND.address.city} · {BRAND.address.state}
          </p>
        </div>

        {/* credit required by the 3D ring model's CC BY 4.0 licence */}
        <p className="pb-8 text-[0.6rem] leading-relaxed text-ivory/30">
          3D ring based on{" "}
          <a
            href="https://sketchfab.com/3d-models/black-diamond-solitaire-engagement-ring-61e45adb7e4a4d0f9f9d6f1375dc8334"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-gold-200 hover:underline"
          >
            &ldquo;Black Diamond Solitaire Engagement Ring&rdquo;
          </a>{" "}
          by{" "}
          <a href="https://sketchfab.com/busanello" target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-gold-200 hover:underline">
            Busanello
          </a>
          , licensed under{" "}
          <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-gold-200 hover:underline">
            CC BY 4.0
          </a>
          . Materials adapted.
        </p>
      </div>
    </footer>
  );
}
