import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import GalleryView from "@/components/gallery/GalleryView";
import { BRAND } from "@/lib/constants";
import { GALLERIES, galleryHref, getGallery } from "@/lib/galleries";
import { SEO } from "@/lib/site";
import { getGalleryPhotos } from "@/lib/gallery.server";

type Params = { params: { slug: string } };

// one static page per gallery folder, built ahead of time
export const dynamicParams = false;

export function generateStaticParams() {
  return GALLERIES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const gallery = getGallery(params.slug);
  if (!gallery) return {};
  const title = `${gallery.title} Gallery`;
  const description = `Browse ${gallery.title.toLowerCase()} designs from ${BRAND.name}, ${BRAND.address.city}. Call or WhatsApp ${BRAND.phone.display} to check availability before you visit.`;
  const url = galleryHref(gallery.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "en_IN", url, siteName: BRAND.name, title: `${title} | ${BRAND.name}`, description, images: [SEO.ogImage] },
    twitter: { card: "summary_large_image", title: `${title} | ${BRAND.name}`, description, images: [SEO.ogImage.url] },
  };
}

export default async function GalleryPage({ params }: Params) {
  const gallery = getGallery(params.slug);
  if (!gallery) notFound();

  const photos = await getGalleryPhotos(gallery.slug);

  return (
    <>
      <Navbar />
      <main>
        <GalleryView gallery={gallery} photos={photos} />
      </main>
      <Footer />
    </>
  );
}
