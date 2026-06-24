import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "오늘안부",
  title: "오늘안부",
  description:
    "하루의 작은 기록을 바탕으로 AI가 생활 패턴 변화를 분석하는 안심 서비스",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "오늘안부",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
