import { BRAND } from "@/lib/constants";

/**
 * Public URL of the deployed site, used for canonical links, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL in the hosting dashboard (e.g. https://www.yellewarjewellers.com);
 * until then, Vercel's own production domain (e.g. yellewar-jewellers.vercel.app) is used.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000")
).replace(/\/$/, "");

export const SEO = {
  title: `${BRAND.name} | Fine Gold, Diamond & Bridal Jewellery`,
  description: `Jewellers in Chandrapur for fine gold, diamond, silver, temple and bridal jewellery. Visit our flagship store at Janta College Square, Civil Lines, or call / WhatsApp ${BRAND.phone.display}.`,
  keywords: [
    "Yellewar Jewellers",
    "jewellers in Chandrapur",
    "jewellery shop Chandrapur",
    "gold jewellery Chandrapur",
    "bridal jewellery Chandrapur",
    "diamond jewellery Chandrapur",
    "silver payal Chandrapur",
    "temple jewellery",
    "Civil Lines Chandrapur",
    "Vidarbha jewellers",
  ],
  ogImage: { url: "/og-image.jpg", width: 1200, height: 630, alt: `${BRAND.name} flagship store, Chandrapur` },
};
