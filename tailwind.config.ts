import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00BFFF",
        dark: "#0E0E10",
        card: "#1A1A1D",
      },
    },
  },
  plugins: [],
};

export default config;