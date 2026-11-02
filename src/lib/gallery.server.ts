import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { galleryPhoto, getGallery, type GalleryPhoto, type GallerySlug } from "@/lib/galleries";

const IMAGE_FILE = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Files that must never be published:
 * - iStock "612x612"/"2048x2048" files are unlicensed previews (some carry a visible watermark)
 * - premium_photo-* are Unsplash+ images that need a paid licence
 * - raw screenshots still have Google's UI around them (cropped .webp versions are used instead)
 * - "(1)" copies are duplicates
 */
const EXCLUDED_PATTERNS = [/^istockphoto-/i, /^premium_photo-/i, /^screenshot/i, / \(\d+\)\.\w+$/];

const EXCLUDED_FILES = new Set([
  // show other jewellers' brand names
  "pexels-photo-29245547.avif",
  "pexels-photo-29245548.avif",
  "pexels-photo-28985984.avif",
  // originals that already have an optimised, cropped .webp copy in the same folder
  "pexels-bharatkuiper-36519701.jpg",
  "pexels-rani-sahu-9157350.jpg",
  "pexels-skgphotography-5814563.jpg",
  "photo-1704817234962-80ca84f8fbed.avif",
  "photo-1758995116383-f51775896add.avif",
  "pexels-photo-16082501.avif",
  "pexels-photo-2735981.avif",
  "pexels-photo-2735970.avif",
  "pexels-photo-38984019.avif",
  "pexels-photo-28347073.avif",
  "pexels-photo-15787782.avif",
  "pexels-photo-15272716.avif",
  "pexels-photo-20768279.avif",
  "pexels-photo-13037597.avif",
  "pexels-photo-29245549.avif",
  "pexels-photo-17068459.avif",
  "images.jpeg",
]);

/** Hand-picked photos used elsewhere on the site lead each gallery, in this order. */
const FEATURED = [
  "yellewar-antique-necklace.webp",
  "yellewar-payal.webp",
  "flagship-night.webp",
  "flagship-festive.webp",
  "flagship-day.webp",
  "bridal-portrait.webp",
  "bridal-bride.webp",
  "bridal-detail.webp",
  "gold-necklace.webp",
  "gold-bangles.webp",
  "diamond-necklace.webp",
  "diamond-ring.webp",
  "diamond-studs.webp",
  "silver-ring.webp",
  "temple-haaram.webp",
  "temple-jhumka.webp",
];

const rank = (file: string) => {
  const i = FEATURED.indexOf(file);
  return i === -1 ? FEATURED.length : i;
};

export async function getGalleryPhotos(slug: GallerySlug): Promise<GalleryPhoto[]> {
  const gallery = getGallery(slug)!;
  const dir = path.join(process.cwd(), "public", gallery.folder);

  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    console.warn(`[gallery] folder not found: public/${gallery.folder}`);
    return [];
  }

  const usable = files
    .filter((f) => IMAGE_FILE.test(f) && !EXCLUDED_FILES.has(f) && !EXCLUDED_PATTERNS.some((p) => p.test(f)))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, undefined, { numeric: true }));

  const photos = await Promise.all(
    usable.map(async (file, i) => {
      try {
        const meta = await sharp(path.join(dir, file)).metadata();
        if (!meta.width || !meta.height) return null;
        // EXIF orientations 5–8 are rotated 90°, so the displayed size is swapped
        const rotated = (meta.orientation ?? 1) >= 5;
        return {
          src: galleryPhoto(slug, file),
          width: rotated ? meta.height : meta.width,
          height: rotated ? meta.width : meta.height,
          alt: `${gallery.title} design ${i + 1}`,
        };
      } catch {
        console.warn(`[gallery] could not read ${gallery.folder}/${file}`);
        return null;
      }
    }),
  );

  return photos.filter((p): p is GalleryPhoto => p !== null);
}
