"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  HeartHandshake,
  Home,
  Send,
} from "lucide-react";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTodayISO } from "@/lib/dates";
import { calculateSafetyStatus, methodLabel } from "@/lib/care-contact";
import { storageKeys } from "@/lib/storage-keys";
import type {
  DailyActivity,
  DailyCareCheck,
  DailyCheckIn,
  DailyMood,
  ParentProfile,
} from "@/types/onboarding";

const today = getTodayISO();

const defaultProfile: ParentProfile = {
  name: "",
  relation: "부모님",
  phone: "",
  contactMethod: "sms",
  responseMethod: "sms",
};

const defaultCheckIn: DailyCheckIn = {
  date: today,
  mood: "normal",
  activities: [],
  note: "",
};

const defaultCareCheck: DailyCareCheck = {
  date: today,
  meal: "unknown",
  medication: "unknown",
  condition: "normal",
  contact: "message",
  activity: "unknown",
  note: "",
  status: "good",
  responseStatus: "ready",
  responseMethod: "sms",
};

const moodOptions: Array<{ value: DailyMood; emoji: string; label: string }> = [
  { value: "comfortable", emoji: "😊", label: "편안했어요" },
  { value: "normal", emoji: "🙂", label: "평범했어요" },
  { value: "hard", emoji: "😔", label: "조금 힘들었어요" },
];

const activityOptions: Array<{ value: DailyActivity; emoji: string; label: string }> = [
  { value: "rest_home", emoji: "🏠", label: "집에서 쉬었어요" },
  { value: "walk", emoji: "🚶", label: "산책했어요" },
  { value: "shopping", emoji: "🛒", label: "장을 봤어요" },
  { value: "hospital", emoji: "🏥", label: "병원에 다녀왔어요" },
  { value: "family_contact", emoji: "👨‍👩‍👧", label: "가족과 연락했어요" },
  { value: "tea_rest", emoji: "☕", label: "차 한잔하며 쉬었어요" },
];

function normalizeCheckIn(checkIn: Partial<DailyCheckIn>): DailyCheckIn {
  if (checkIn.date !== today) return defaultCheckIn;

  return {
    ...defaultCheckIn,
    ...checkIn,
    activities: Array.isArray(checkIn.activities) ? checkIn.activities : [],
    note: checkIn.note ?? "",
  };
}

function mapCheckInToCareCheck(checkIn: DailyCheckIn): DailyCareCheck {
  const condition = {
    comfortable: "good",
    normal: "normal",
    hard: "bad",
  }[checkIn.mood] as DailyCareCheck["condition"];

  return {
    ...defaultCareCheck,
    date: checkIn.date,
    condition,
    contact: checkIn.activities.includes("family_contact") ? "call" : "message",
    activity: checkIn.activities.some((activity) =>
      ["walk", "shopping", "hospital"].includes(activity),
    )
      ? "active"
      : checkIn.activities.includes("rest_home")
        ? "home_only"
        : "unknown",
    note: checkIn.note,
    responseStatus: "completed",
    responseReceivedAt: new Date().toISOString(),
  };
}

export default function CareCheckPage() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile] = useLocalStorage<ParentProfile>(
    storageKeys.lovedOneProfile,
    defaultProfile,
  );
  const [storedCheckIn, setStoredCheckIn] = useLocalStorage<DailyCheckIn>(
    storageKeys.dailyCheckIn,
    defaultCheckIn,
  );
  const [, setCareCheck] = useLocalStorage<DailyCareCheck>(
    storageKeys.dailyCareCheck,
    defaultCareCheck,
  );

  const checkIn = useMemo(() => normalizeCheckIn(storedCheckIn), [storedCheckIn]);
  const displayName = useMemo(() => profile.name.trim() || "가족", [profile.name]);
  const contactTarget = profile.phone.trim() || "등록된 가족 연락처";
  const safetySnapshot = useMemo(
    () => calculateSafetyStatus(mapCheckInToCareCheck(checkIn)),
    [checkIn],
  );

  function updateCheckIn(next: Partial<DailyCheckIn>) {
    setStoredCheckIn((current) => ({
      ...normalizeCheckIn(current),
      ...next,
      date: today,
    }));
    setSaved(false);
  }

  function toggleActivity(value: DailyActivity) {
    const nextActivities = checkIn.activities.includes(value)
      ? checkIn.activities.filter((activity) => activity !== value)
      : [...checkIn.activities, value];

    updateCheckIn({ activities: nextActivities });
  }

  function completeCheckIn(next?: Partial<DailyCheckIn>) {
    const completed = {
      ...checkIn,
      ...next,
      date: today,
    };
    setStoredCheckIn(completed);
    setCareCheck(mapCheckInToCareCheck(completed));
    setSaved(true);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[440px] bg-brand-background px-5 py-6 text-brand-text shadow-[0_0_80px_rgba(32,51,47,0.10)]">
      <header>
        <p className="text-sm font-bold text-brand-primary">오늘 안부 전하기</p>
        <h1 className="brand-title mt-2 text-3xl">
          오늘도 잘 지내셨어요?
        </h1>
        <p className="soft-copy mt-2 text-base leading-7 text-brand-subtext">
          버튼 하나만 눌러도 {displayName}님의 안부가 가족에게 전해져요.
          더 남기고 싶은 이야기는 천천히 골라도 괜찮아요.
        </p>
      </header>

      <Card className="mt-5 rounded-2xl border-brand-primary/20 bg-white">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
            <HeartHandshake size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-base font-extrabold text-brand-text">
              연락 방식: {methodLabel[profile.contactMethod]}
            </p>
            <p className="soft-copy mt-1 text-sm leading-6 text-brand-subtext">
              {contactTarget}로 가족이 안심할 수 있는 오늘의 안부를 전합니다.
            </p>
          </div>
        </div>
      </Card>

      <section className="mt-5 space-y-3">
        <button
          type="button"
          className="flex min-h-20 w-full items-center justify-between rounded-2xl bg-brand-primary px-5 py-4 text-left text-white shadow-[0_12px_28px_rgba(79,138,115,0.26)] transition hover:bg-brand-hover active:scale-[0.99]"
          onClick={() =>
            completeCheckIn({
              mood: "normal",
              activities: checkIn.activities.length > 0 ? checkIn.activities : ["rest_home"],
            })
          }
        >
          <span>
            <span className="block text-lg font-extrabold">오늘도 잘 지냈어요</span>
            <span className="mt-1 block text-sm font-bold text-white/85">
              이 버튼만 눌러도 안부가 전해져요
            </span>
          </span>
          <Send size={24} aria-hidden />
        </button>

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-brand-border bg-white px-4 text-left text-base font-extrabold text-brand-hover shadow-sm transition hover:bg-brand-mint active:scale-[0.99]"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
        >
          조금 더 남기기
          <ChevronDown
            size={20}
            className={`transition ${detailsOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </section>

      {detailsOpen ? (
        <Card className="mt-4 space-y-5 rounded-2xl bg-white">
          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-extrabold text-brand-text">
                오늘 하루는 어떠셨나요?
              </h2>
              <p className="soft-copy mt-1 text-sm leading-6 text-brand-subtext">
                정답은 없어요. 오늘과 가장 가까운 문장을 골라주세요.
              </p>
            </div>
            <div className="grid gap-2">
              {moodOptions.map((option) => (
                <LargeChoiceButton
                  key={option.value}
                  selected={checkIn.mood === option.value}
                  emoji={option.emoji}
                  label={option.label}
                  onClick={() => updateCheckIn({ mood: option.value })}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-extrabold text-brand-text">
                오늘은 무엇을 하셨나요?
              </h2>
              <p className="soft-copy mt-1 text-sm leading-6 text-brand-subtext">
                기억나는 것만 골라도 충분해요. 여러 개를 선택할 수 있어요.
              </p>
            </div>
            <div className="grid gap-2">
              {activityOptions.map((option) => (
                <ToggleChoiceButton
                  key={option.value}
                  selected={checkIn.activities.includes(option.value)}
                  emoji={option.emoji}
                  label={option.label}
                  onClick={() => toggleActivity(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-line bg-brand-cream p-4">
            <FieldLabel>남기고 싶은 말이 있나요? (선택)</FieldLabel>
            <textarea
              className={`${inputClassName} mt-2 min-h-24 resize-none py-3 text-base`}
              value={checkIn.note ?? ""}
              onChange={(event) => updateCheckIn({ note: event.target.value })}
              placeholder="예: 오늘은 집에서 쉬었어요."
            />
          </section>

          <Button
            type="button"
            className="min-h-14 w-full bg-brand-primary text-base hover:bg-brand-hover"
            onClick={() => completeCheckIn()}
          >
            <CheckCircle2 size={20} aria-hidden />
            오늘 안부 전하기
          </Button>
        </Card>
      ) : null}

      {saved ? <CompletionMessage /> : null}

      <WeeklyPatternCard
        hasEnoughData={saved}
        comfortableDays={3}
        restHomeDays={4}
        walkDays={1}
        teaRestCount={2}
      />

      <AiSafetyCard hasEnoughData={saved} statusLabel={safetySnapshot.label} />
    </main>
  );
}

function LargeChoiceButton({
  selected,
  emoji,
  label,
  onClick,
}: {
  selected: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border px-4 text-left text-lg font-extrabold transition active:scale-[0.99] ${
        selected
          ? "border-brand-primary bg-brand-mint text-brand-hover shadow-sm"
          : "border-brand-line bg-white text-brand-text hover:border-brand-primary/50"
      }`}
      onClick={onClick}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="flex-1">{label}</span>
      {selected ? (
        <span className="flex size-7 items-center justify-center rounded-full bg-brand-primary text-white">
          <Check size={17} aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

function ToggleChoiceButton({
  selected,
  emoji,
  label,
  onClick,
}: {
  selected: boolean;
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex min-h-[60px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base font-extrabold transition active:scale-[0.99] ${
        selected
          ? "border-brand-primary bg-brand-mint text-brand-hover shadow-sm"
          : "border-brand-line bg-white text-brand-text hover:border-brand-primary/50"
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="flex-1">{label}</span>
      <span
        className={`flex size-7 items-center justify-center rounded-full border ${
          selected
            ? "border-brand-primary bg-brand-primary text-white"
            : "border-brand-line bg-white text-transparent"
        }`}
      >
        <Check size={17} aria-hidden />
      </span>
    </button>
  );
}

function CompletionMessage() {
  return (
    <Card className="mt-5 rounded-2xl border-brand-primary/20 bg-brand-mint">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary">
          <CheckCircle2 size={23} aria-hidden />
        </span>
        <div>
          <p className="text-lg font-extrabold text-brand-hover">
            오늘의 안부가 가족에게 전해졌어요.
          </p>
          <p className="soft-copy mt-2 text-sm leading-6 text-brand-subtext">
            답장을 기다리지 않아도 괜찮아요. 기록만으로도 가족은 안심할 수 있어요.
          </p>
        </div>
      </div>
    </Card>
  );
}

function WeeklyPatternCard({
  hasEnoughData,
  comfortableDays,
  restHomeDays,
  walkDays,
  teaRestCount,
}: {
  hasEnoughData: boolean;
  comfortableDays: number;
  restHomeDays: number;
  walkDays: number;
  teaRestCount: number;
}) {
  const rows = [
    ["😊", `편안한 날 ${comfortableDays}일`],
    ["🏠", `집에서 쉰 날 ${restHomeDays}일`],
    ["🚶", `산책한 날 ${walkDays}일`],
    ["☕", `휴식 기록 ${teaRestCount}회`],
  ];

  return (
    <Card className="mt-5 rounded-2xl bg-white">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
          <BarChart3 size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-extrabold text-brand-primary">최근 7일 기준</p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-text">
            이번 주 안심 패턴
          </h2>
          <p className="soft-copy mt-2 text-base leading-7 text-brand-subtext">
            {hasEnoughData
              ? "평범하고 안정적인 하루가 많았어요."
              : "아직 비교할 기록이 충분하지 않아요."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {rows.map(([emoji, label]) => (
          <div
            key={label}
            className="flex min-h-12 items-center gap-3 rounded-2xl bg-brand-cream px-4 text-base font-extrabold text-brand-text"
          >
            <span className="text-xl" aria-hidden>
              {emoji}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AiSafetyCard({
  hasEnoughData,
  statusLabel,
}: {
  hasEnoughData: boolean;
  statusLabel: string;
}) {
  return (
    <Card className="mt-4 rounded-2xl border-brand-border bg-brand-mint">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary">
          <Home size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-extrabold text-brand-primary">
            AI 안심 인사이트 · {statusLabel}
          </p>
          <p className="soft-copy mt-2 text-sm leading-6 text-brand-subtext">
            {hasEnoughData
              ? "AI가 이번 주 기록 흐름을 살펴봤어요. 특별히 걱정할 변화는 보이지 않습니다."
              : "아직 비교할 기록이 충분하지 않아요. 며칠 더 기록하면 변화 흐름을 알려드릴게요."}
          </p>
        </div>
      </div>
    </Card>
  );
}
