import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";
import "./onboarding.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oneul-anbu.yos1015.chatgpt.site"),
  applicationName: "오늘안부",
  title: "오늘안부 — 부모님의 평소와 다른 날을 먼저 알려드립니다",
  description: "매일 기록하거나 전화하지 않아도 괜찮습니다. 오늘안부가 생활 흐름의 변화를 살펴보고 필요한 날만 가족에게 알려드립니다.",
  openGraph: {
    title: "오늘안부",
    description: "AI가 부모님의 평소 생활 속 변화를 조용히 감지해 가족에게 알려주는 안심 서비스",
    images: [{ url: "/illustrations/oneul-anbu-ai-hero.png", width: 1728, height: 910, alt: "평소처럼 생활하는 부모님과 안부를 확인하는 가족" }],
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "오늘안부", statusBarStyle: "default" },
  icons: {
    shortcut: [{ url: "/icons/favicon-ansimi.ico" }],
    icon: [{ url: "/icons/favicon-ansimi.ico", sizes: "64x64", type: "image/x-icon" },{ url: "/icons/ansimi-icon-192.png", sizes: "192x192", type: "image/png" },{ url: "/icons/ansimi-icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icons/ansimi-apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFFFFF" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body><Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" strategy="afterInteractive"/><PwaRegister/>{children}</body></html>}
