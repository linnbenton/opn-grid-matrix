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
        cyberBg: "#0D0D11",
        iopnCyan: "#00F0FF",
        iopnNeon: "#39FF14",
        cyberPurple: "#9D00FF",
      },
      boxShadow: {
        neonCyan: "0 0 15px #00F0FF, inset 0 0 5px #00F0FF",
        neonGreen: "0 0 15px #39FF14, inset 0 0 5px #39FF14",
      },
    },
  },
  plugins: [],
};
export default config;
