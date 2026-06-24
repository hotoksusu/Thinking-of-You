import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "오늘안부",
  title: "오늘안부",
  description:
    "부모님의 하루 안부를 가족이 놓치지 않도록 돕는 AI 안심 서비스",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "오늘안부",
    statusBarStyle: "default",
  },
  icons: {
    shortcut: [{ url: "/favicon.ico" }],
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F97316",
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
