"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, HeartPulse, Pill, Share2 } from "lucide-react";
import { ConsumerShell } from "@/components/consumer-shell";
import { Button, Card, inputClassName } from "@/components/ui";
import { ProgressBar } from "@/components/progress-bar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  consumerSchedules,
  defaultConsumerSettings,
  defaultRoutineState,
  type ConsumerSettings,
  type RoutineState,
} from "@/lib/mock-data";
import { storageKeys } from "@/lib/storage-keys";

export default function ConsumerHomePage() {
  const [settings] = useLocalStorage<ConsumerSettings>(
    storageKeys.consumerSettings,
    defaultConsumerSettings,
  );
  const [routine, setRoutine] = useLocalStorage<RoutineState>(
    storageKeys.consumerRoutine,
    defaultRoutineState,
  );
  const [schedules] = useLocalStorage(storageKeys.consumerSchedules, consumerSchedules);

  const doneCount = [routine.medicine, routine.meal, routine.sleep, routine.exercise].filter(Boolean).length;
  const progress = Math.round((doneCount / 4) * 100);
  const isSelfCare = settings.mode === "self-care";

  return (
    <ConsumerShell
      title="오늘의 안부 홈"
      subtitle={`${settings.name}님의 안부와 건강 루틴을 한눈에 확인해요.`}
      active="home"
    >
      <div className="space-y-5">
        <Card className="bg-brand-ink text-white">
          <p className="text-sm font-bold text-white/70">
            {isSelfCare ? "오늘 가볍게 확인해요" : "오늘의 체크리스트"}
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold">{progress}%</p>
              <p className="mt-1 text-sm text-white/75">{doneCount}개 완료 · {4 - doneCount}개 남음</p>
            </div>
            <CheckCircle2 size={42} className="text-brand-coral" aria-hidden />
          </div>
          <div className="mt-5">
            <ProgressBar value={progress} />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <Pill size={22} className="text-brand-sage" aria-hidden />
            <p className="mt-3 text-sm font-bold">약 복용</p>
            <p className="mt-1 text-xl font-bold">{routine.medicine ? "확인" : "대기"}</p>
          </Card>
          <Card>
            <HeartPulse size={22} className="text-brand-sage" aria-hidden />
            <p className="mt-3 text-sm font-bold">안부 상태</p>
            <p className="mt-1 text-xl font-bold">{routine.completedToday ? "완료" : "확인 전"}</p>
          </Card>
        </div>

        <Card>
          <div className="flex items-start gap-3">
            <CalendarDays size={24} className="text-brand-sage" aria-hidden />
            <div>
              <h2 className="font-bold">가까운 병원/검진 일정</h2>
              <p className="mt-1 text-sm text-stone-600">{schedules[0]?.title} · {schedules[0]?.date}</p>
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          onClick={() => setRoutine((current) => ({ ...current, completedToday: true }))}
        >
          오늘 안부 확인 완료
        </Button>

        <Card>
          <label className="text-sm font-bold text-brand-ink" htmlFor="shareMemo">
            함께하는 사람에게 공유할 짧은 안부 메모
          </label>
          <textarea
            id="shareMemo"
            className={`${inputClassName} mt-2 min-h-24 py-3`}
            value={routine.shareMemo}
            onChange={(event) => setRoutine((current) => ({ ...current, shareMemo: event.target.value }))}
          />
          <Link
            href="/family-invite"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-brand-line bg-white text-sm font-bold"
          >
            <Share2 size={17} aria-hidden />
            함께하는 사람 설정
          </Link>
        </Card>
      </div>
    </ConsumerShell>
  );
}
