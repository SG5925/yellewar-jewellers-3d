import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060509",
          900: "#0b0910",
          800: "#121019",
          700: "#1c1824",
        },
        plum: {
          900: "#1a0f24",
          700: "#2c1a3d",
        },
        gold: {
          50: "#fbf6e9",
          100: "#f4e7c3",
          200: "#e9d29a",
          300: "#ddb96b",
          400: "#d4a853",
          500: "#c0913a",
          600: "#a0742b",
          700: "#7a5821",
        },
        ivory: "#f3ede2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.32em",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(110deg, #a0742b 0%, #e9d29a 35%, #d4a853 55%, #f4e7c3 70%, #a0742b 100%)",
      },
      keyframes: {
        "lb-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "lb-zoom": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "lb-fade": "lb-fade 0.5s ease-out both",
        "lb-zoom": "lb-zoom 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 8s linear infinite",
        "scroll-line": "scroll-line 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "spin-slow": "spin 80s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
