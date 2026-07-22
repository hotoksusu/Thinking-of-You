"use client";

import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { SelfShell } from "@/components/self-shell";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { storageKeys } from "@/lib/storage-keys";

const options = ["좋아요", "보통이에요", "조금 불편해요"];
const today = getTodayISO();

type DailySelfCheck = {
  date: string;
  value?: string;
  done: boolean;
};

export default function SelfCheckinPage() {
  const [condition, setCondition] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinCondition,
    { date: today, done: false },
  );
  const selected = condition.date === today ? condition.value : undefined;
  const saved = condition.date === today && condition.done;

  function saveCondition(value: string) {
    setCondition({ date: today, value, done: true });
  }

  return (
    <SelfShell title="오늘 몸은 어떠세요?">
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option}
            className={`min-h-20 rounded-2xl border px-5 text-left text-3xl font-bold ${
              selected === option
                ? "border-brand-sage bg-brand-mint"
                : "border-brand-line bg-white"
            }`}
            onClick={() => saveCondition(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {saved ? (
        <p className="flex items-center gap-3 rounded-2xl bg-brand-mint p-5 text-2xl font-bold">
          <CheckCircle2 size={30} aria-hidden />
          오늘 질문에 답했어요.
        </p>
      ) : null}

      <Link
        href="/self"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-5 text-xl font-bold text-white"
      >
        <Home size={22} aria-hidden />
        홈으로 돌아가기
      </Link>
    </SelfShell>
  );
}
