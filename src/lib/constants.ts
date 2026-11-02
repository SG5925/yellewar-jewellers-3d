const PHONE_E164 = "919503624001";

/** Opens a WhatsApp chat with an optional pre-filled message. */
export const whatsappLink = (message?: string) =>
  `https://wa.me/${PHONE_E164}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

// Exact Google Maps place link for the Janta College Square flagship (supplied by the client)
const FLAGSHIP_MAPS_URL =
  "https://www.google.com/maps/place/Yellewar+Jewellers/@19.9741111,79.284757,18.41z/data=!4m22!1m15!4m14!1m6!1m2!1s0x3bd2d5d674bb20bb:0x5db83e52ca21c1c8!2sRamnagar+Rd,+Civil+Lines,+Chandrapur,+Maharashtra+442401,+India!2m2!1d79.2916934!2d19.9621245!1m6!1m2!1s0x3bd2d7c92036f871:0xa58ea4b6979b1b01!2sYellewar+Jewellers,+Janta+college+square,+Near,+near+Nagpur+Road,+Civil+Lines,+Chandrapur,+Maharashtra+442401!2m2!1d79.2856475!2d19.9739163!3m5!1s0x3bd2d7c92036f871:0xa58ea4b6979b1b01!8m2!3d19.9739163!4d79.2856475!16s%2Fg%2F11z1vqp8vw?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D";

export const BRAND = {
  name: "Yellewar Jewellers",
  shortName: "Yellewar",
  tagline: "Fine Gold, Diamonds & Bridal Jewellery",
  logo: { src: "/logo.png", width: 320, height: 498 },
  address: {
    line1: "Janta College Square, Near Nagpur Road",
    line2: "Civil Lines, Chandrapur",
    region: "Maharashtra 442401",
    city: "Chandrapur",
    state: "Maharashtra",
    full: "Janta College Square, Near Nagpur Road, Civil Lines, Chandrapur, Maharashtra 442401",
  },
  phone: {
    display: "+91 95036 24001",
    tel: `tel:+${PHONE_E164}`,
  },
  whatsappUrl: whatsappLink(),
  bookingUrl: whatsappLink("Hello Yellewar Jewellers, I would like to book a visit to your flagship store at Janta College Square."),
  mapsUrl: FLAGSHIP_MAPS_URL,
  directionsUrl: FLAGSHIP_MAPS_URL,
  // Place links can't be framed, so the embed pins the flagship's exact coordinates instead
  mapEmbedUrl: "https://www.google.com/maps?q=19.9739163,79.2856475&z=17&output=embed",
} as const;

export const NAV_LINKS = [
  { label: "Collections", href: "/#collections" },
  { label: "Bridal", href: "/#bridal" },
  { label: "Gold", href: "/#gold" },
  { label: "Diamond", href: "/#diamond" },
  { label: "Silver", href: "/#silver" },
  { label: "Flagship", href: "/#flagship" },
] as const;
