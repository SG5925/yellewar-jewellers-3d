import Footer from "@/components/layout/Footer";
import HashScroll from "@/components/layout/HashScroll";
import Navbar from "@/components/layout/Navbar";
import ChapterSection from "@/components/sections/ChapterSection";
import Collections from "@/components/sections/Collections";
import Flagship from "@/components/sections/Flagship";
import Hero from "@/components/sections/Hero";
import NewArrivals from "@/components/sections/NewArrivals";
import { CHAPTERS } from "@/lib/chapters";
import { BRAND } from "@/lib/constants";
import { SEO, SITE_URL } from "@/lib/site";

/** Local-business details for Google (map pack, knowledge panel, rich results). */
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: BRAND.name,
  description: SEO.description,
  url: SITE_URL,
  logo: `${SITE_URL}${BRAND.logo.src}`,
  image: `${SITE_URL}${SEO.ogImage.url}`,
  telephone: BRAND.phone.display.replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: BRAND.address.line1,
    addressLocality: BRAND.address.city,
    addressRegion: BRAND.address.state,
    postalCode: "442401",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 19.9739163, longitude: 79.2856475 },
  hasMap: BRAND.mapsUrl,
};

export default function Home() {
  return (
    <>
      {/* start fetching the hero's 3D ring in parallel with the JavaScript */}
      <link rel="preload" href="/models/ring.glb" as="fetch" crossOrigin="anonymous" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <Navbar />
      <HashScroll />
      <main>
        <Hero />
        <Collections />
        {CHAPTERS.map((chapter, i) => (
          <ChapterSection key={chapter.id} chapter={chapter} reverse={i % 2 === 1} />
        ))}
        <NewArrivals />
        <Flagship />
      </main>
      <Footer />
    </>
  );
}
