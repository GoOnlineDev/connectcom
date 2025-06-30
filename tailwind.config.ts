import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        burgundy: {
          DEFAULT: "#8B1C31", // A rich burgundy color
          dark: "#6A1525",    // Darker shade for hover states
          light: "#AD354B",   // Lighter shade for accents
        },
        beige: {
          DEFAULT: "#F5F0E9", // A soft beige for backgrounds
          dark: "#E8DFD3",    // Darker beige for hover states
        },
      },
    },
  },
  plugins: [],
} satisfies Config);
