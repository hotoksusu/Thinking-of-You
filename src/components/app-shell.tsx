"use client";

import Link from "next/link";
import {
  BarChart3,
  Bell,
  CalendarDays,
  HeartPulse,
  Home,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { clsx } from "clsx";

type ActiveKey = "home" | "tasks" | "schedule" | "message" | "report";

const navItems = [
  { key: "home", href: "/family", label: "홈", icon: Home },
  { key: "tasks", href: "/family/tasks", label: "체크", icon: HeartPulse },
  { key: "schedule", href: "/family/schedule", label: "일정", icon: CalendarDays },
  { key: "message", href: "/family/message", label: "메시지", icon: MessageCircle },
  { key: "report", href: "/family/report", label: "리포트", icon: BarChart3 },
] as const;

export function AppShell({
  title,
  subtitle,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  active: ActiveKey;
  children: React.ReactNode;
}) {
  return (
    <main className="page-shell mx-auto flex w-full max-w-[440px] flex-col bg-brand-cream shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="sticky top-0 z-20 border-b border-brand-line bg-brand-cream/92 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="오늘안부 홈">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-ink text-white">
              <Bell size={18} aria-hidden />
            </span>
            <span className="text-sm font-bold text-brand-ink">오늘안부</span>
          </Link>
          <Link
            href="/family/profile"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-brand-line bg-white px-3 text-xs font-semibold text-brand-ink"
          >
            <UserRound size={15} aria-hidden />
            프로필
          </Link>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-brand-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm leading-6 text-stone-600">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="flex-1 px-5 py-5 pb-28">{children}</div>
      <BottomNav active={active} />
    </main>
  );
}

export function BottomNav({ active }: { active: ActiveKey }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-brand-line bg-white/94 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition",
                isActive
                  ? "bg-brand-mint text-brand-ink"
                  : "text-stone-500 hover:bg-stone-50",
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
