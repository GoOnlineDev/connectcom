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
        // Burgundy Color Palette
        burgundy: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d4d4',
          300: '#f5b8b8',
          400: '#ef8f8f',
          500: '#e55c5c',
          600: '#d63333',
          700: '#b91c1c',
          800: '#9a1a1a',
          900: '#7f1d1d',
          950: '#450a0a',
          dark: '#7f1d1d',
          darker: '#450a0a',
        },
        // Beige Color Palette
        beige: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ecd8',
          300: '#ecdfb8',
          400: '#e1cd8f',
          500: '#d4b866',
          600: '#c4a34d',
          700: '#a88a3f',
          800: '#8a6f37',
          900: '#735c32',
          950: '#3f2f1a',
          dark: '#8a6f37',
          darker: '#3f2f1a',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
} satisfies Config);
