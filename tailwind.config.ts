import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB",
          hover: "#1D4ED8",
          secondary: "#2563EB",
          accent: "#FEE500",
          text: "#111827",
          subtext: "#6B7280",
          background: "#FFF8F1",
          card: "#FFFFFF",
          ink: "#111827",
          sage: "#2563EB",
          mint: "#EFF6FF",
          border: "#BFDBFE",
          coral: "#FF7A6A",
          apricot: "#fff0e6",
          cream: "#FFF8F1",
          sky: "#e8f4f8",
          line: "#F1E5DA",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(49, 64, 58, 0.12)",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "SUIT",
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
