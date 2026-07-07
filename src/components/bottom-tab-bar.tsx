import Link from "next/link";
import { Gift, Home, PencilLine, UsersRound } from "lucide-react";

type TabId = "home" | "record" | "family" | "farm";

const tabs = [
  { id: "home" as const, label: "홈", href: "/", icon: Home },
  { id: "record" as const, label: "기록하기", href: "/app?role=parent", icon: PencilLine },
  { id: "family" as const, label: "가족", href: "/app?role=family", icon: UsersRound },
  { id: "farm" as const, label: "농장 구경", href: "/farm", icon: Gift },
];

export function BottomTabBar({ active }: { active: TabId }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px] border-t border-[#D8E2D8] bg-white/95 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur lg:bottom-6 lg:max-w-[620px] lg:rounded-[26px] lg:border lg:p-3 lg:shadow-[0_20px_48px_rgba(38,52,45,0.18)]" aria-label="주요 메뉴">
      <div className="grid grid-cols-4 gap-2 lg:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 text-base font-black transition hover:-translate-y-0.5 lg:min-h-[60px] lg:flex-row lg:gap-2.5 lg:rounded-2xl lg:px-4 lg:text-[15px] ${selected ? "bg-[#FFF0E6] text-[#D95423] shadow-[inset_0_0_0_1px_rgba(233,101,43,0.18)]" : "text-[#4F5E57] hover:bg-[#F1F5EF]"}`}><Icon className="size-7 shrink-0 lg:size-6" strokeWidth={selected ? 2.8 : 2.2} /><span className="whitespace-nowrap">{tab.label}</span></Link>;
        })}
      </div>
    </nav>
  );
}
