import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4e9",
          100: "#ffe4c2",
          200: "#ffc98a",
          300: "#ffab52",
          400: "#ff8a2e",
          500: "#ff6a1f",
          600: "#e5501a",
          700: "#c23a1c",
          800: "#9c2f1d",
          900: "#6e1f19",
        },
        ink: "#0c0a09",
        cream: "#fbf4e8",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "sans-serif"],
        display: ["var(--font-urbanist)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        sunset: "linear-gradient(135deg, #ffb64d 0%, #ff6a1f 48%, #c81e3a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
