"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "부모님", href: "/for-parent" },
  { label: "가족", href: "/for-family" },
  { label: "작동 방식", href: "/how-it-works" },
  { label: "기술", href: "/technology" },
  { label: "요금", href: "/pricing" },
  { label: "도움말", href: "/guide" },
];

export function MarketingHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`sticky top-0 z-50 shrink-0 border-b border-[#E5E8E1] bg-[#FFF9F0]/95 backdrop-blur ${compact ? "onboarding-header" : ""}`}>
      <div className={`mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 sm:px-8 ${compact ? "min-h-14 gap-3 sm:min-h-16" : "min-h-20 gap-5"}`}>
        <Link href="/" className={`flex shrink-0 items-center font-black text-[#52725B] ${compact ? "min-h-11 gap-2 text-xl" : "min-h-14 gap-3 text-2xl"}`}>
          <Image src="/brand/brand-icon.png" alt="" width={compact ? 34 : 44} height={compact ? 34 : 44} className="rounded-xl" />
          오늘안부
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="서비스 메뉴">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black text-[#43534C] hover:bg-white hover:text-[#20302C]">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group relative lg:hidden">
          <summary className={`flex cursor-pointer list-none items-center justify-center rounded-xl border-2 border-[#C8D6C4] bg-white text-[#31473D] [&::-webkit-details-marker]:hidden ${compact ? "size-10" : "size-14"}`} aria-label="메뉴 열기">
            <Menu size={compact ? 23 : 29} aria-hidden />
          </summary>
          <nav className={`absolute right-0 w-72 rounded-2xl border border-[#E1E6DE] bg-white p-3 shadow-[0_20px_50px_rgba(45,57,50,0.16)] ${compact ? "top-12" : "top-16"}`} aria-label="모바일 서비스 메뉴">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black text-[#31473D] hover:bg-[#F3F6F0]">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function MobileStartCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const primaryCta = document.getElementById("landing-primary-cta");
    if (!primaryCta) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(primaryCta);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E8E1] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition duration-200 lg:hidden ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}`} aria-hidden={!visible}>
      <Link href="/start" className="mx-auto flex min-h-16 w-full max-w-[440px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-6 text-xl font-black text-white shadow-[0_10px_28px_rgba(233,101,43,0.24)]">
        오늘안부 시작하기 <ArrowRight size={22} aria-hidden />
      </Link>
    </div>
  );
}
