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
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[680px] border-t border-[#E2E9E2] bg-white/95 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.08)] backdrop-blur" aria-label="주요 메뉴">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[.7rem] font-black ${selected ? "bg-[#FFF1E8] text-[#E9652B]" : "text-[#66706B]"}`}><Icon size={21} strokeWidth={selected ? 2.7 : 2.1} /><span>{tab.label}</span></Link>;
        })}
      </div>
    </nav>
  );
}
