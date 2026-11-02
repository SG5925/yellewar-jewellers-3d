/**
 * Photo galleries, one per folder in /public.
 * If a folder is renamed on disk, update its `folder` here and every photo path follows.
 */
export const GALLERIES = [
  { slug: "bridal", title: "Bridal", folder: "Bridal jewellery photos", number: "03", sectionHref: "/#bridal" },
  { slug: "gold", title: "Gold", folder: "Gold jewellery photos", number: "04", sectionHref: "/#gold" },
  { slug: "diamond", title: "Diamond", folder: "Dimond jewellery photos", number: "05", sectionHref: "/#diamond" },
  { slug: "silver", title: "Silver", folder: "Silver jewellery photos", number: "06", sectionHref: "/#silver" },
  { slug: "temple", title: "Temple", folder: "Temple Gold jewellery photos", number: "06", sectionHref: "/#temple" },
  { slug: "new-arrivals", title: "New Arrivals", folder: "New Arrivals jewellery Photos", number: "New", sectionHref: "/#new-arrivals" },
  { slug: "store", title: "Flagship Store", folder: "FlagshipStore photos", number: "07", sectionHref: "/#flagship" },
] as const;

export type GallerySlug = (typeof GALLERIES)[number]["slug"];
export type GalleryInfo = (typeof GALLERIES)[number];

export type GalleryPhoto = { src: string; width: number; height: number; alt: string };

export const getGallery = (slug: string) => GALLERIES.find((g) => g.slug === slug);

/** URL for a file inside a gallery folder (folder names contain spaces, so encode them). */
export const galleryPhoto = (slug: GallerySlug, file: string) =>
  `/${encodeURIComponent(getGallery(slug)!.folder)}/${encodeURIComponent(file)}`;

export const galleryHref = (slug: GallerySlug) => `/gallery/${slug}`;
