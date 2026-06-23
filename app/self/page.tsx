"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Settings } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { storageKeys } from "@/lib/storage-keys";

type DailySelfCheck = {
  date: string;
  value?: string;
  done: boolean;
};

const today = getTodayISO();
const emptyCheck: DailySelfCheck = { date: today, done: false };

function normalizeTodayCheck(check: DailySelfCheck) {
  return check.date === today ? check : emptyCheck;
}

export default function SelfDemoPage() {
  const [condition] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinCondition,
    emptyCheck,
  );
  const [medicine] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinMedicine,
    emptyCheck,
  );
  const [schedule] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinSchedule,
    emptyCheck,
  );
  const [message, setMessage] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinMessage,
    emptyCheck,
  );

  return (
    <main className="page-shell mx-auto w-full max-w-[440px] bg-[#fbfff9] px-5 py-5 text-brand-ink shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-4 text-base font-bold shadow-sm"
        >
          <ArrowLeft size={22} aria-hidden />
          처음으로
        </Link>
        <span className="text-lg font-bold">오늘안부</span>
      </header>

      <section className="mt-8">
        <h1 className="brand-title text-4xl leading-tight">
          <span className="block">오늘 하루,</span>
          <span className="block">가볍게 확인해요</span>
        </h1>
      </section>

      <section className="mt-7 space-y-4">
        <EasyHomeCard
          href="/self/checkin"
          icon="😊"
          title="컨디션 확인"
          description="오늘 몸은 어떠세요?"
          button="확인하기"
          done={normalizeTodayCheck(condition).done}
        />
        <EasyHomeCard
          href="/self/medicine"
          icon="💊"
          title="약 확인"
          description="오늘 약은 드셨나요?"
          button="확인하기"
          done={normalizeTodayCheck(medicine).done}
        />
        <EasyHomeCard
          href="/self/schedule"
          icon="🏥"
          title="병원 일정"
          description="다가오는 병원 일정을 확인해요."
          button="일정 보기"
          done={normalizeTodayCheck(schedule).done}
        />

        <EasyHomeCard
          href="/self/contacts"
          icon="💬"
          title="안부 나누기"
          description="필요한 안부를 믿을 수 있는 사람과 나눌 수 있어요."
          button="안부 남기기"
          done={normalizeTodayCheck(message).done}
          onClick={() => setMessage({ date: today, value: "안부 남기기", done: true })}
          secondary
        />
      </section>

      <Link
        href="/self/contacts"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-base font-bold text-brand-ink shadow-sm"
      >
        <Settings size={18} aria-hidden />
        함께하는 사람 설정
      </Link>
    </main>
  );
}

function EasyHomeCard({
  href,
  icon,
  title,
  description,
  button,
  done,
  onClick,
  secondary = false,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  button: string;
  done: boolean;
  onClick?: () => void;
  secondary?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm ${
        done ? "border-brand-sage bg-brand-mint/80" : secondary ? "border-brand-line bg-white/82" : "border-brand-line bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-apricot text-4xl">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            {done ? <CheckCircle2 size={26} className="text-brand-sage" aria-hidden /> : null}
          </div>
          <p className="mt-2 text-lg leading-7 text-stone-700">{description}</p>
        </div>
      </div>
      <Link
        href={href}
        onClick={onClick}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand-ink px-5 text-lg font-bold text-white"
      >
        {done ? "다시 보기" : button}
      </Link>
    </article>
  );
}
