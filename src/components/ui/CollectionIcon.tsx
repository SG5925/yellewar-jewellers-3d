import type { CollectionIcon as IconName } from "@/lib/collections";

/** Fine-line gold illustrations used until real product photography is added. */
export default function CollectionIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const stroke = name === "silver" ? "url(#ci-silver)" : "url(#ci-gold)";

  return (
    <svg viewBox="0 0 160 160" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <defs>
        <linearGradient id="ci-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4e7c3" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#a0742b" />
        </linearGradient>
        <linearGradient id="ci-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#c9ccd6" />
          <stop offset="100%" stopColor="#8a8e9c" />
        </linearGradient>
      </defs>
      {ICONS[name]}
    </svg>
  );
}

const ICONS: Record<IconName, JSX.Element> = {
  // layered bridal haar with a pendant
  bridal: (
    <>
      <path d="M30 34 Q80 104 130 34" />
      <path d="M38 34 Q80 120 122 34" />
      <path d="M46 34 Q80 134 114 34" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const t = (i + 1) / 8;
        const x = 46 + (114 - 46) * t;
        const y = 34 + 4 * 50 * t * (1 - t);
        return <circle key={i} cx={x} cy={y + 2} r="2.4" />;
      })}
      <path d="M80 118 L90 130 L80 146 L70 130 Z" />
      <circle cx="80" cy="131" r="3" />
    </>
  ),
  // stacked bangles
  gold: (
    <>
      <ellipse cx="80" cy="62" rx="44" ry="14" />
      <ellipse cx="80" cy="80" rx="44" ry="14" />
      <ellipse cx="80" cy="98" rx="44" ry="14" />
      <path d="M36 62 V98 M124 62 V98" opacity="0.5" />
      {[-30, -15, 0, 15, 30].map((dx) => (
        <circle key={dx} cx={80 + dx} cy={80 + 13.4 * Math.sqrt(1 - (dx / 44) ** 2)} r="1.6" />
      ))}
    </>
  ),
  // brilliant-cut diamond
  diamond: (
    <>
      <path d="M44 62 L60 42 H100 L116 62 L80 122 Z" />
      <path d="M44 62 H116" />
      <path d="M60 42 L68 62 L80 42 L92 62 L100 42" />
      <path d="M68 62 L80 122 L92 62" />
      <path d="M80 18 V30 M58 24 L64 32 M102 24 L96 32" opacity="0.6" />
    </>
  ),
  // payal (anklet) with ghungroo bells
  silver: (
    <>
      <path d="M28 64 Q80 112 132 64" />
      <path d="M28 70 Q80 118 132 70" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const t = (i + 1) / 10;
        const x = 28 + 104 * t;
        const y = 70 + 2 * 48 * t * (1 - t) * 1;
        return (
          <g key={i}>
            <path d={`M${x} ${y} V${y + 8}`} />
            <circle cx={x} cy={y + 11} r="3" />
          </g>
        );
      })}
    </>
  ),
  // temple arch with a deity-style pendant
  temple: (
    <>
      <path d="M48 128 V70 Q48 40 80 28 Q112 40 112 70 V128" />
      <path d="M58 128 V74 Q58 50 80 40 Q102 50 102 74 V128" />
      <path d="M40 128 H120" />
      <circle cx="80" cy="84" r="12" />
      <circle cx="80" cy="84" r="4" />
      <path d="M80 96 V108 M72 112 Q80 120 88 112" />
      <path d="M80 18 L84 26 L80 30 L76 26 Z" />
    </>
  ),
  // sparkle burst
  new: (
    <>
      <path d="M80 30 C84 62 98 76 130 80 C98 84 84 98 80 130 C76 98 62 84 30 80 C62 76 76 62 80 30 Z" />
      <path d="M118 30 C119 38 122 41 130 42 C122 43 119 46 118 54 C117 46 114 43 106 42 C114 41 117 38 118 30 Z" />
      <path d="M42 108 C43 114 45 116 50 117 C45 118 43 120 42 126 C41 120 39 118 34 117 C39 116 41 114 42 108 Z" />
    </>
  ),
};
