import Link from "next/link";
import { Home, Images, Sprout, UserRound } from "lucide-react";

type TabId = "home" | "news" | "farm" | "profile";

const tabs = [
  { id: "home" as const, label: "홈", href: "/app?role=parent", icon: Home },
  { id: "news" as const, label: "가족소식", href: "/app?role=parent&view=photos", icon: Images },
  { id: "farm" as const, label: "농장", href: "/farm", icon: Sprout },
  { id: "profile" as const, label: "내정보", href: "/app?role=parent&view=profile", icon: UserRound },
];

export function BottomTabBar({ active }: { active: TabId }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] border-t border-[#D8E2D8] bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur" aria-label="부모님 메뉴">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.95rem] font-black ${selected ? "bg-[#FFF0E6] text-[#D95423]" : "text-[#526059]"}`}><Icon size={25} strokeWidth={selected ? 2.8 : 2.2} /><span className="whitespace-nowrap">{tab.label}</span></Link>;
        })}
      </div>
    </nav>
  );
}
