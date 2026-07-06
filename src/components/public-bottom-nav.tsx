"use client";

import Link from "next/link";
import { Gift, Home, PencilLine, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { label: "홈", href: "/", icon: Home, match: "home" },
  { label: "기록하기", href: "/app?role=parent", icon: PencilLine, match: "record" },
  { label: "가족", href: "/app?role=family", icon: UsersRound, match: "family" },
  { label: "농장 구경", href: "/app/farm", icon: Gift, match: "farm" },
];

export function PublicBottomNav({ active: activeOverride }: { active?: "home" | "record" | "family" | "farm" }) {
  const pathname = usePathname();
  const active = activeOverride ?? (pathname === "/app/farm" ? "farm" : "home");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto grid w-full max-w-[680px] grid-cols-4 border-t border-[#DDE6D8] bg-[#FFFCF7]/95 px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.08)] backdrop-blur" aria-label="주요 메뉴">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.match;
        return <Link key={item.href} href={item.href} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-black ${selected ? "text-[#E9652B]" : "text-[#5F6B66]"}`}><Icon size={23} strokeWidth={selected ? 2.8 : 2.1} aria-hidden /><span>{item.label}</span></Link>;
      })}
    </nav>
  );
}
