"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, CalendarDays, HeartPulse, Home, Settings, Share2 } from "lucide-react";
import { clsx } from "clsx";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { clearSampleFamilyData } from "@/lib/sample-data";
import { storageKeys } from "@/lib/storage-keys";

type ConsumerActive = "home" | "routine" | "schedule" | "invite" | "settings";

const navItems = [
  { key: "home", href: "/home", label: "홈", icon: Home },
  { key: "routine", href: "/routine", label: "루틴", icon: HeartPulse },
  { key: "schedule", href: "/schedule", label: "일정", icon: CalendarDays },
  { key: "invite", href: "/family-invite", label: "공유", icon: Share2 },
  { key: "settings", href: "/settings/notifications", label: "알림", icon: Settings },
] as const;

export function ConsumerShell({
  title,
  subtitle,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  active: ConsumerActive;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isSample] = useLocalStorage(storageKeys.isSample, false);

  function restartWithRealInfo() {
    clearSampleFamilyData();
    router.push("/setup?mode=family");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-cream text-brand-ink shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="sticky top-0 z-20 border-b border-brand-line bg-brand-cream/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-ink text-white">
              <Bell size={16} aria-hidden />
            </span>
            오늘안부
          </Link>
          <Link href="/setup" className="rounded-full bg-white px-3 py-2 text-xs font-bold shadow-sm">
            설정
          </Link>
        </div>
        <h1 className="brand-title mt-4 text-2xl">{title}</h1>
        {subtitle ? <p className="soft-copy mt-1 text-sm text-stone-600">{subtitle}</p> : null}
        {isSample ? (
          <div className="mt-4 rounded-xl border border-brand-line bg-white/78 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-brand-mint px-3 py-1 text-xs font-bold text-brand-ink">
                예시 화면입니다
              </span>
              <button
                type="button"
                className="rounded-full bg-brand-ink px-3 py-1.5 text-xs font-bold text-white"
                onClick={restartWithRealInfo}
              >
                내 정보로 다시 시작하기
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600">
              내 정보를 입력하지 않고 주요 화면을 먼저 둘러보는 중이에요.
            </p>
          </div>
        ) : null}
      </header>
      <div className="px-5 py-5 pb-40">{children}</div>
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-brand-line bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold",
                  isActive ? "bg-brand-mint text-brand-ink" : "text-stone-500",
                )}
              >
                <Icon size={20} aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
