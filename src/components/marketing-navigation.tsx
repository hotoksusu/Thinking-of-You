import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

const navigation = [
  { label: "서비스 소개", href: "/about" },
  { label: "주요 기능", href: "/features" },
  { label: "이용 방법", href: "/guide" },
  { label: "요금/플랜", href: "/plans" },
  { label: "기관 도입", href: "/partners" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E8E1] bg-[#FFF9F0]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1180px] items-center justify-between gap-5 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-black text-[#52725B]">
          <Image src="/brand/brand-icon.png" alt="" width={38} height={38} className="rounded-xl" />
          오늘안부
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="서비스 메뉴">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-sm font-black text-[#52615B] hover:bg-white hover:text-[#20302C]">
              {item.label}
            </Link>
          ))}
          <Link href="/start" className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#E9652B] px-5 text-sm font-black text-white">
            시작하기 <ArrowRight size={17} aria-hidden />
          </Link>
        </nav>

        <details className="group relative lg:hidden">
          <summary className="flex size-12 cursor-pointer list-none items-center justify-center rounded-xl border border-[#D8E2D4] bg-white text-[#40534B] [&::-webkit-details-marker]:hidden" aria-label="메뉴 열기">
            <Menu size={25} aria-hidden />
          </summary>
          <nav className="absolute right-0 top-14 w-64 rounded-2xl border border-[#E1E6DE] bg-white p-2 shadow-[0_20px_50px_rgba(45,57,50,0.16)]" aria-label="모바일 서비스 메뉴">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block min-h-12 rounded-xl px-4 py-3 font-black text-[#40534B] hover:bg-[#F3F6F0]">
                {item.label}
              </Link>
            ))}
            <Link href="/start" className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E9652B] px-4 font-black text-white">
              오늘안부 시작하기 <ArrowRight size={18} aria-hidden />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function MobileStartCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E8E1] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <Link href="/start" className="mx-auto flex min-h-14 w-full max-w-[420px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-5 text-lg font-black text-white shadow-[0_10px_28px_rgba(233,101,43,0.24)]">
        오늘안부 시작하기 <ArrowRight size={20} aria-hidden />
      </Link>
    </div>
  );
}

