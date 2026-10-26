"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

export function LegacyKakaoLoader() {
  const pathname = usePathname(), query = useSearchParams();
  // Patient records and invitation tokens do not need the legacy sharing SDK.
  if (query.has("token") || pathname === "/i" || pathname === "/patient" ||
      pathname.startsWith("/app/patient") || pathname.startsWith("/care/server")) return null;
  return <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" strategy="afterInteractive" />;
}
