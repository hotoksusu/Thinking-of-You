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
          primary: "#245FD2",
          hover: "#1D4ED8",
          secondary: "#245FD2",
          accent: "#FEE500",
          text: "#111827",
          subtext: "#526176",
          background: "#F5F8FC",
          card: "#FFFFFF",
          ink: "#111827",
          sage: "#245FD2",
          mint: "#EFF6FF",
          border: "#BFDBFE",
          coral: "#FF7A6A",
          apricot: "#fff0e6",
          cream: "#F5F8FC",
          sky: "#e8f4f8",
          line: "#F1E5DA",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(49, 64, 58, 0.12)",
      },
      fontFamily: {
        sans: [
          "Pretendard Care",
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
