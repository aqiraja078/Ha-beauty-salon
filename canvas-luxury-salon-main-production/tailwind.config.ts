import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#c9a962",
          light: "#e8d5a3",
          dark: "#8b7340",
        },
        nude: {
          DEFAULT: "#e8d4cf",
          deep: "#c4a59e",
          muted: "#f5ebe8",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        luxury: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        gold: "0 0 40px rgba(201, 169, 98, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "luxury-dark":
          "linear-gradient(180deg, #0a0a0a 0%, #121212 50%, #0a0a0a 100%)",
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glow-soft": "glow-soft 4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-soft": {
          "0%, 100%": { boxShadow: "0 0 28px rgba(201, 169, 98, 0.12)" },
          "50%": { boxShadow: "0 0 48px rgba(201, 169, 98, 0.22)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
