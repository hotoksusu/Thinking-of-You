import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";
import "./onboarding.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oneul-anbu.yos1015.chatgpt.site"),
  applicationName: "오늘안부 Care",
  title: "오늘안부 Care | 퇴원 후 회복·안심관리",
  description: "퇴원 후 환자의 일상 변화를 살펴보고 필요한 순간 병원과 환자를 다시 연결합니다.",
  openGraph: {
    title: "오늘안부 Care · 퇴원 후에도 병원과 함께",
    description: "퇴원 후 사라지는 병원과 환자의 연결을 이어갑니다.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "퇴원 후에도 병원과 함께, 오늘안부 Care" }],
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "오늘안부", statusBarStyle: "default" },
  icons: {
    shortcut: [{ url: "/icons/favicon-v2.ico" }],
    icon: [{ url: "/icons/favicon-v2.ico", sizes: "64x64", type: "image/x-icon" },{ url: "/icons/oneul-anbu-icon-192.png", sizes: "192x192", type: "image/png" },{ url: "/icons/oneul-anbu-icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icons/oneul-anbu-apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFFFF" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body><Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" strategy="afterInteractive"/><PwaRegister/>{children}</body></html>}
