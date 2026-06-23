"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Home } from "lucide-react";
import { SelfShell } from "@/components/self-shell";
import { Card } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { storageKeys } from "@/lib/storage-keys";

const today = getTodayISO();

type DailySelfCheck = {
  date: string;
  value?: string;
  done: boolean;
};

export default function SelfSchedulePage() {
  const [schedule, setSchedule] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinSchedule,
    { date: today, done: false },
  );
  const saved = schedule.date === today && schedule.done;

  function confirmSchedule() {
    setSchedule({ date: today, value: "일정 보기", done: true });
  }

  return (
    <SelfShell title="병원 가는 날">
      <div className="space-y-4">
        <Card className={saved ? "bg-brand-mint" : "bg-white"}>
          <p className="text-xl font-bold text-brand-sage">오늘 일정</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-apricot text-4xl">
              🏥
            </span>
            <div>
              <p className="text-2xl font-bold">오늘 등록된 병원 일정은 없어요.</p>
              <p className="mt-2 text-lg leading-7 text-stone-700">
                몸 상태만 가볍게 확인해도 좋아요.
              </p>
            </div>
          </div>
          <button
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-5 text-xl font-bold text-white"
            onClick={confirmSchedule}
          >
            <CheckCircle2 size={22} aria-hidden />
            확인했어요
          </button>
        </Card>

        <Card className="bg-white">
          <p className="text-xl font-bold text-brand-sage">다음 일정</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-mint text-brand-ink">
              <CalendarDays size={34} aria-hidden />
            </span>
            <div>
              <p className="text-2xl font-bold">정형외과 진료</p>
              <p className="mt-2 text-xl text-stone-700">이번 주 목요일</p>
            </div>
          </div>
        </Card>

        <Link
          href="/self"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-xl font-bold text-brand-ink shadow-sm"
        >
          <Home size={22} aria-hidden />
          홈으로 돌아가기
        </Link>
      </div>
    </SelfShell>
  );
}
