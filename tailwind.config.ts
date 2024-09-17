import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        yellow: {
          300: "#fffc33",
        },
      },
    },
  },
  plugins: [],
};
export default config;
