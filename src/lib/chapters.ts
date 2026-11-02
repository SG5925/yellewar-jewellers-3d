import { galleryPhoto, type GallerySlug } from "@/lib/galleries";

export type Photo = { src: string; alt: string };

export type Chapter = {
  /** Section id, used by the navbar and collection card links */
  id: string;
  /** Extra anchor ids that should land on this chapter (e.g. "temple") */
  aliases?: string[];
  number: string;
  label: string;
  /** Giant outlined word drifting behind the section */
  word: string;
  headline: [string, string];
  description: string;
  highlights: { title: string; text: string }[];
  /** One arch, or two side by side; `inset` adds a small framed detail shot */
  visuals: { photo: Photo; caption: string; inset?: Photo }[];
  /** Buttons that open the full photo gallery for this category */
  galleries: { slug: GallerySlug; label: string }[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "bridal",
    number: "03",
    label: "Bridal",
    word: "BRIDAL",
    headline: ["For the day", "you've dreamed of."],
    description:
      "From the first haldi to the final pheras, our bridal collection is made for every ritual. Layered rani haars, chokers, kundan and polki sets, nath, maang tikka and bangles, chosen so the whole look comes together.",
    highlights: [
      { title: "Complete sets", text: "Necklace, earrings, tikka and bangles that belong together." },
      { title: "Every ritual", text: "Pieces for haldi, mehendi, the wedding and the reception." },
      { title: "Made to last", text: "Substantial pieces meant to be passed down." },
    ],
    visuals: [
      {
        photo: { src: galleryPhoto("bridal", "bridal-portrait.webp"), alt: "Bride wearing a layered gold and emerald bridal necklace with maang tikka" },
        caption: "The Bridal Edit",
        inset: { src: galleryPhoto("bridal", "bridal-detail.webp"), alt: "Bride in red lehenga with a green and gold necklace set" },
      },
    ],
    galleries: [{ slug: "bridal", label: "See Bridal Sets in Store Gallery" }],
  },
  {
    id: "gold",
    number: "04",
    label: "Gold",
    word: "GOLD",
    headline: ["Pure gold,", "endless forms."],
    description:
      "Chains, bangles, rings, mangalsutras and statement necklaces in rich yellow gold. Everyday pieces you will never want to take off, and festival pieces your family will remember.",
    highlights: [
      { title: "Everyday", text: "Light chains, studs and rings for daily wear." },
      { title: "Festive", text: "Statement necklaces and kadas for celebrations." },
      { title: "Gifting", text: "Coins, pendants and keepsakes for every occasion." },
    ],
    visuals: [
      {
        photo: { src: galleryPhoto("gold", "yellewar-antique-necklace.webp"), alt: "Yellewar antique gold necklace and earring set on teal velvet" },
        caption: "Yellow Gold",
        inset: { src: galleryPhoto("gold", "gold-bangles.webp"), alt: "Stack of engraved gold bangles" },
      },
    ],
    galleries: [{ slug: "gold", label: "See Gold Sets in Store Gallery" }],
  },
  {
    id: "diamond",
    number: "05",
    label: "Diamond",
    word: "DIAMOND",
    headline: ["Light,", "captured."],
    description:
      "Solitaire rings, studs, pendants and bracelets, each stone set to bring out its brilliance. Choose a timeless design or sit with us and find the one that feels like yours.",
    highlights: [
      { title: "Solitaires", text: "Single stones in classic and modern settings." },
      { title: "Engagement", text: "Rings for the question, and for the answer." },
      { title: "Everyday sparkle", text: "Studs and pendants made to be worn often." },
    ],
    visuals: [
      {
        photo: { src: galleryPhoto("diamond", "diamond-necklace.webp"), alt: "Diamond necklace and drop earrings on black" },
        caption: "Diamonds",
        inset: { src: galleryPhoto("diamond", "diamond-studs.webp"), alt: "Pair of solitaire diamond studs on dark stone" },
      },
    ],
    galleries: [{ slug: "diamond", label: "See Diamond Sets in Store Gallery" }],
  },
  {
    id: "silver",
    aliases: ["temple"],
    number: "06",
    label: "Silver & Temple",
    word: "HERITAGE",
    headline: ["Silver &", "temple craft."],
    description:
      "Delicate payal and toe rings, pooja silver and thoughtful gifts, alongside antique-finish temple jewellery with deity motifs inspired by centuries-old craft.",
    highlights: [
      { title: "Silver", text: "Payal, bichhiya, pooja articles and gifts." },
      { title: "Temple", text: "Antique-finish necklaces, jhumkas and pendants." },
      { title: "Heritage", text: "Traditional motifs, finished by hand." },
    ],
    visuals: [
      { photo: { src: galleryPhoto("silver", "yellewar-payal.webp"), alt: "Yellewar silver payal and toe rings" }, caption: "Silver" },
      { photo: { src: galleryPhoto("temple", "temple-haaram.webp"), alt: "Layered gold temple haaram with jhumkas on a display bust" }, caption: "Temple" },
    ],
    galleries: [
      { slug: "silver", label: "See Silver Sets in Store Gallery" },
      { slug: "temple", label: "See Temple Sets in Store Gallery" },
    ],
  },
];
