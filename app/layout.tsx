import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "오늘안부",
  title: "오늘안부",
  description: "평소의 생활 흐름을 AI가 살펴 가족에게 따뜻한 안심 리포트로 전하는 서비스",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "오늘안부",
    statusBarStyle: "default",
  },
  icons: {
    shortcut: [{ url: "/icons/favicon-ansimi.ico" }],
    icon: [
      { url: "/icons/favicon-ansimi.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icons/ansimi-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/ansimi-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/ansimi-apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6F8D72",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" strategy="afterInteractive" />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
