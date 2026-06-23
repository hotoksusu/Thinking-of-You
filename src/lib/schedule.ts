import type { CareScheduleType, ScheduleRepeat } from "@/types/care";

export const scheduleTypeLabel: Record<CareScheduleType, string> = {
  안부: "안부",
  병원: "병원",
  약: "약",
  건강검진: "건강검진",
  생신: "생신",
  가족모임: "가족 모임",
  기타: "기타",
};

export const scheduleTypeTone: Record<CareScheduleType, string> = {
  안부: "bg-brand-apricot/80 text-amber-800",
  병원: "bg-brand-sky text-slate-700",
  약: "bg-brand-mint text-brand-ink",
  건강검진: "bg-white text-brand-ink",
  생신: "bg-brand-apricot text-rose-700",
  가족모임: "bg-emerald-50 text-emerald-700",
  기타: "bg-stone-100 text-stone-700",
};

export const scheduleTypeIcon: Record<CareScheduleType, string> = {
  안부: "💬",
  병원: "🏥",
  약: "💊",
  건강검진: "🩺",
  생신: "🎂",
  가족모임: "👨‍👩‍👧",
  기타: "📌",
};

export const repeatLabel: Record<ScheduleRepeat, string> = {
  none: "반복 없음",
  daily: "매일",
  weekly: "매주",
  monthly: "매월",
  yearly: "매년",
};
