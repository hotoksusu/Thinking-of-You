import Link from "next/link";
import { Home, PencilLine, Sprout, UsersRound } from "lucide-react";

type TabId = "home" | "record" | "family" | "farm";

const tabs = [
  { id: "home" as const, label: "홈", href: "/", icon: Home },
  { id: "record" as const, label: "기록하기", href: "/app?role=parent", icon: PencilLine },
  { id: "family" as const, label: "가족", href: "/guide", icon: UsersRound },
  { id: "farm" as const, label: "안부농장", href: "/farm", icon: Sprout },
];

export function BottomTabBar({ active }: { active: TabId }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] border-t border-[#F2E6DA] bg-white/95 px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(74,48,31,0.08)] backdrop-blur" aria-label="주요 메뉴">
      <div className="grid min-w-0 grid-cols-4 gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={selected ? "page" : undefined}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-[0.68rem] font-black leading-tight transition min-[390px]:text-[0.72rem] active:scale-[0.97] ${
                selected ? "text-[#F45D18]" : "text-[#697386] hover:text-[#F45D18]"
              }`}
            >
              <Icon size={22} strokeWidth={selected ? 2.8 : 2.2} fill={selected && tab.id === "home" ? "currentColor" : "none"} aria-hidden />
              <span className="max-w-full truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
