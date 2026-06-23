"use client";

import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { SelfShell } from "@/components/self-shell";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { storageKeys } from "@/lib/storage-keys";
import type { SelfMedicineStatus } from "@/types/care";

const options: SelfMedicineStatus[] = ["먹었어요", "아직이에요", "해당 없어요"];
const today = getTodayISO();

type DailySelfCheck = {
  date: string;
  value?: SelfMedicineStatus;
  done: boolean;
};

export default function SelfMedicinePage() {
  const [medicine, setMedicine] = useLocalStorage<DailySelfCheck>(
    storageKeys.selfCheckinMedicine,
    { date: today, done: false },
  );
  const selected = medicine.date === today ? medicine.value : undefined;
  const saved = medicine.date === today && medicine.done;

  function saveMedicine(value: SelfMedicineStatus) {
    setMedicine({ date: today, value, done: true });
  }

  return (
    <SelfShell title="오늘 약은 드셨나요?">
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option}
            className={`min-h-20 rounded-2xl border px-5 text-left text-3xl font-bold ${
              selected === option
                ? "border-brand-sage bg-brand-mint"
                : "border-brand-line bg-white"
            }`}
            onClick={() => saveMedicine(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {saved ? (
        <p className="flex items-center gap-3 rounded-2xl bg-brand-mint p-5 text-2xl font-bold">
          <CheckCircle2 size={30} aria-hidden />
          약 확인을 기록했어요.
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
