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
          ink: "#20332f",
          sage: "#6f8f7b",
          mint: "#eaf4ed",
          coral: "#e87f68",
          apricot: "#fff0e6",
          cream: "#fffaf4",
          sky: "#e8f4f8",
          line: "#e6e2d8",
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
