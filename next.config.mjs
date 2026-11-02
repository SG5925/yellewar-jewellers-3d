/** @type {import('next').NextConfig} */
const nextConfig = {
  // lets a production build run alongside `next dev` without sharing its output folder
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // gallery originals are large (up to 6000px); serve them resized as WebP and cache for a month
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // tree-shake the big animation/3D libraries more aggressively
    optimizePackageImports: ["@react-three/drei", "gsap"],
  },
};

export default nextConfig;
