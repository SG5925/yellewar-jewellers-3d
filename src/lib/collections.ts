import { galleryPhoto } from "@/lib/galleries";

export type CollectionIcon = "bridal" | "gold" | "diamond" | "silver" | "temple" | "new";

export type Collection = {
  slug: string;
  name: string;
  description: string;
  icon: CollectionIcon;
  /** Photo in /public; the card falls back to its line-art icon when absent */
  image?: string;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "bridal",
    name: "Bridal",
    description: "Complete bridal sets, from haar and choker to nath and bangles, for the most important day.",
    icon: "bridal",
    image: galleryPhoto("bridal", "bridal-bride.webp"),
  },
  {
    slug: "gold",
    name: "Gold",
    description: "Chains, bangles, rings and statement necklaces in rich yellow gold, for every day and every celebration.",
    icon: "gold",
    image: galleryPhoto("gold", "gold-necklace.webp"),
  },
  {
    slug: "diamond",
    name: "Diamond",
    description: "Solitaires, studs and pendants set to catch the light from every angle.",
    icon: "diamond",
    image: galleryPhoto("diamond", "diamond-ring.webp"),
  },
  {
    slug: "silver",
    name: "Silver",
    description: "Payal, toe rings, pooja silver and gifting pieces with fine, hand-finished detailing.",
    icon: "silver",
    image: galleryPhoto("silver", "silver-ring.webp"),
  },
  {
    slug: "temple",
    name: "Temple Jewellery",
    description: "Antique-finish necklaces and jhumkas with deity motifs and traditional temple craftsmanship.",
    icon: "temple",
    image: galleryPhoto("temple", "temple-jhumka.webp"),
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest designs to reach our counters this season. Be the first to wear them.",
    icon: "new",
    image: galleryPhoto("new-arrivals", "new-arrival-1.webp"),
  },
];
