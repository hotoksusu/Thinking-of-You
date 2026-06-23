import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, CalendarDays, FileText, Home, MessageSquare, Settings, Users } from "lucide-react";
import { clsx } from "clsx";

const familyNav = [
  { href: "/family", label: "대시보드", icon: Home },
  { href: "/family/members", label: "함께하는 사람", icon: Users },
  { href: "/family/schedules", label: "일정/루틴", icon: CalendarDays },
  { href: "/family/report", label: "공유 리포트", icon: FileText },
];

const adminNav = [
  { href: "/admin", label: "대시보드", icon: Home },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/groups", label: "가족 그룹", icon: FileText },
  { href: "/admin/notifications", label: "알림 관리", icon: Bell },
  { href: "/admin/support", label: "문의/CS", icon: MessageSquare },
  { href: "/admin/content", label: "문구 관리", icon: Settings },
];

export function FamilyManagerShell({
  title,
  description,
  active,
  children,
}: {
  title: string;
  description?: string;
  active: string;
  children: ReactNode;
}) {
  return (
    <ResponsiveShell
      brand="오늘안부 가족"
      nav={familyNav}
      active={active}
      title={title}
      description={description}
      actionLabel="함께 초대"
      actionHref="/family/members"
    >
      {children}
    </ResponsiveShell>
  );
}

export function AdminShell({
  title,
  description,
  active,
  children,
}: {
  title: string;
  description?: string;
  active: string;
  children: ReactNode;
}) {
  return (
    <ResponsiveShell
      brand="오늘안부 운영"
      nav={adminNav}
      active={active}
      title={title}
      description={description}
      actionLabel="리포트 내보내기"
      actionHref="/admin"
      wide
    >
      {children}
    </ResponsiveShell>
  );
}

function ResponsiveShell({
  brand,
  nav,
  active,
  title,
  description,
  actionLabel,
  actionHref,
  wide,
  children,
}: {
  brand: string;
  nav: typeof familyNav;
  active: string;
  title: string;
  description?: string;
  actionLabel: string;
  actionHref: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-brand-line bg-white/82 p-5 lg:block">
        <Link href="/" className="text-lg font-bold">
          {brand}
        </Link>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold",
                  isActive ? "bg-brand-mint text-brand-ink" : "text-stone-600 hover:bg-brand-cream",
                )}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className={clsx("mx-auto w-full px-4 py-5 sm:px-6 lg:px-8", wide ? "max-w-7xl" : "max-w-6xl")}>
        <header className="rounded-xl border border-brand-line bg-white/90 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-brand-coral">{brand}</p>
              <h1 className="brand-title mt-1 text-3xl">{title}</h1>
              {description ? <p className="soft-copy mt-2 text-sm text-stone-600">{description}</p> : null}
            </div>
            <Link
              href={actionHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-ink px-5 text-sm font-bold text-white"
            >
              {actionLabel}
            </Link>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-bold",
                  active === item.href ? "bg-brand-ink text-white" : "bg-brand-mint text-brand-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="mt-5">{children}</div>
      </section>
    </main>
  );
}
