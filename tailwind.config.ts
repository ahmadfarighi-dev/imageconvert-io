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
        ic: {
          cream:        "#FFFDF7",
          "cream-b":    "#F0EBE0",
          teal: {
            50:  "#F0FDFA",
            100: "#CCFBF1",
            300: "#5EEAD4",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
          },
          text: {
            900: "#1C2B2D",
            600: "#475569",
            400: "#94A3B8",
          },
          violet: {
            50:  "#F5F3FF",
            100: "#EDE9FE",
            300: "#C4B5FD",
            700: "#7C3AED",
          },
        },
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "ic-sm":   "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
        "ic-md":   "0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04)",
        "ic-teal": "0 6px 20px rgba(13,148,136,.18)",
      },
      borderRadius: {
        "ic-sm": "8px",
        "ic-md": "12px",
        "ic-lg": "18px",
        "ic-xl": "24px",
      },
    },
  },
  plugins: [],
};
export default config;
