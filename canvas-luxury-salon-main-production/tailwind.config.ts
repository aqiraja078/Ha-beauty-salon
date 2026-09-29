import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

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
        canvas: {
          DEFAULT: token("--canvas"),
          alt: token("--canvas-2"),
        },
        surface: token("--surface"),
        ink: {
          DEFAULT: token("--ink"),
          soft: token("--ink-soft"),
        },
        muted: token("--muted"),
        line: token("--line"),
        accent: {
          DEFAULT: token("--accent"),
          strong: token("--accent-strong"),
          soft: token("--accent-soft"),
          fg: token("--accent-fg"),
        },
        tint: {
          DEFAULT: token("--tint"),
          soft: token("--tint-soft"),
        },
        gilt: token("--gilt"),
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 32px -18px rgba(0, 0, 0, 0.55)",
        lift: "0 10px 30px -12px rgb(var(--accent) / 0.22)",
        "lift-lg": "0 22px 55px -20px rgb(var(--accent) / 0.28)",
        ring: "0 0 0 1px rgb(var(--accent) / 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "glow-soft": "glow-soft 5s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
        marquee: "marquee 32s linear infinite",
        "shimmer-sweep": "shimmer-sweep 2.8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(13, 106, 84, 0.12)" },
          "50%": { boxShadow: "0 0 42px 6px rgba(13, 106, 84, 0.14)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
