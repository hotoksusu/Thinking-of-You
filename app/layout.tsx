import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";
import "./onboarding.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oneul-anbu.yos1015.chatgpt.site"),
  applicationName: "오늘안부",
  title: "오늘안부 — 부모님은 평소처럼 생활하세요",
  description: "걷기와 휴대전화 사용 같은 생활 변화를 살펴보고, 평소와 다른 변화가 이어질 때 가족에게 알려드립니다. 매일 기록하지 않아도 됩니다.",
  openGraph: {
    title: "오늘안부",
    description: "부모님은 평소처럼 생활하세요. 오늘안부가 생활 변화를 살펴보고 필요한 날 가족에게 알려드립니다.",
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
