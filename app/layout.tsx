import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oneul-anbu.yos1015.chatgpt.site"),
  applicationName: "오늘안부",
  title: "오늘안부 Care | 퇴원 후 생활변화 모니터링",
  description: "퇴원한 고령자의 생활 변화를 개인의 평소와 비교하고 가족 확인과 Care Report로 연결합니다.",
  openGraph: {
    title: "오늘안부 Care",
    description: "퇴원 후 집에서의 생활 변화까지 살펴봅니다.",
    images: [{ url: "/og-brand-v3.png", width: 1200, height: 630, alt: "매일 연락하지 못해도 평소와 다른 변화는 놓치지 않도록, 오늘안부" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "오늘안부",
    statusBarStyle: "default",
  },
  icons: {
    shortcut: [{ url: "/icons/favicon-v2.ico" }],
    icon: [
      { url: "/icons/favicon-v2.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icons/oneul-anbu-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/oneul-anbu-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/oneul-anbu-apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
