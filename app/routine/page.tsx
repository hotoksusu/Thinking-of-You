"use client";

import { ConsumerShell } from "@/components/consumer-shell";
import { Button, Card, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultRoutineState, type RoutineState } from "@/lib/mock-data";
import { storageKeys } from "@/lib/storage-keys";

const toggles: Array<[keyof Pick<RoutineState, "medicine" | "meal" | "sleep" | "exercise">, string]> = [
  ["medicine", "약 복용 체크"],
  ["meal", "식사 체크"],
  ["sleep", "수면 체크"],
  ["exercise", "운동 체크"],
];

export default function RoutinePage() {
  const [routine, setRoutine] = useLocalStorage<RoutineState>(
    storageKeys.consumerRoutine,
    defaultRoutineState,
  );

  return (
    <ConsumerShell title="루틴 체크" subtitle="약, 식사, 수면, 운동과 컨디션을 가볍게 기록해요." active="routine">
      <div className="space-y-4">
        {toggles.map(([key, label]) => (
          <button
            key={key}
            className={`flex min-h-16 w-full items-center justify-between rounded-xl border px-4 text-left font-bold ${
              routine[key] ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"
            }`}
            onClick={() => setRoutine((current) => ({ ...current, [key]: !current[key] }))}
          >
            {label}
            <span>{routine[key] ? "완료" : "대기"}</span>
          </button>
        ))}

        <Card>
          <label className="text-sm font-bold" htmlFor="condition">오늘 컨디션</label>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["좋아요", "보통이에요", "조금 불편해요"] as const).map((value) => (
              <button
                key={value}
                className={`min-h-12 rounded-lg border px-2 text-sm font-bold ${
                  routine.condition === value ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"
                }`}
                onClick={() => setRoutine((current) => ({ ...current, condition: value }))}
              >
                {value}
              </button>
            ))}
          </div>
          <textarea
            id="condition"
            className={`${inputClassName} mt-3 min-h-28 py-3`}
            value={routine.memo}
            onChange={(event) => setRoutine((current) => ({ ...current, memo: event.target.value }))}
            placeholder="오늘 메모를 남겨보세요"
          />
        </Card>

        <Button className="w-full" onClick={() => setRoutine((current) => ({ ...current, completedToday: true }))}>
          루틴 저장하기
        </Button>
      </div>
    </ConsumerShell>
  );
}
