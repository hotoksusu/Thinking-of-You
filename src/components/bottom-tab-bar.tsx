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
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[680px] border-t border-[#E2E9E2] bg-white/95 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.08)] backdrop-blur lg:bottom-5 lg:max-w-[480px] lg:rounded-[22px] lg:border lg:p-2 lg:shadow-[0_16px_42px_rgba(38,52,45,0.16)]" aria-label="주요 메뉴">
      <div className="grid grid-cols-4 gap-1 lg:gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[.7rem] font-black transition lg:min-h-11 lg:flex-row lg:gap-2 lg:rounded-xl lg:px-2 lg:text-xs ${selected ? "bg-[#FFF1E8] text-[#E9652B]" : "text-[#66706B] hover:bg-[#F5F7F4]"}`}><Icon className="size-[21px] shrink-0 lg:size-[18px]" strokeWidth={selected ? 2.7 : 2.1} /><span className="whitespace-nowrap">{tab.label}</span></Link>;
        })}
      </div>
    </nav>
  );
}
