import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SelfShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page-shell mx-auto w-full max-w-[440px] bg-[#fbfff9] px-5 py-5 text-brand-ink shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <Link
        href="/self"
        className="mb-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-4 text-base font-bold shadow-sm"
      >
        <ArrowLeft size={22} aria-hidden />
        돌아가기
      </Link>
      <h1 className="text-3xl font-bold leading-tight">{title}</h1>
      {subtitle ? (
        <p className="mt-3 text-xl leading-8 text-stone-700">{subtitle}</p>
      ) : null}
      <div className="mt-6 space-y-4">{children}</div>
    </main>
  );
}

