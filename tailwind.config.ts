import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Align Tailwind's emerald accent with the app's primary green.
        brand: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#065f46",
        },
      },
      borderColor: {
        DEFAULT: "#1e293b",
      },
    },
  },
  plugins: [],
};

export default config;
