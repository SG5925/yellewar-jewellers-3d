import type { MetadataRoute } from "next";
import { GALLERIES, galleryHref } from "@/lib/galleries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...GALLERIES.map((g) => ({
      url: `${SITE_URL}${galleryHref(g.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
