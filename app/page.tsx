"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { storageKeys } from "@/lib/storage-keys";

const TOTAL_STEPS = 3;
const FIRST_RECORD_URL = "/app?role=parent&view=record";

type EntryNotice = {
  id: string;
  emoji: string;
  eyebrow: string;
  message: string;
  storageKey: "milestone" | "event";
};

const steps = [
  {
    label: "기분 하나만 알려주세요",
    reassurance: "부모님은 기분만 누르면 됩니다",
    action: "알겠습니다",
  },
  {
    label: "나머지는 자동으로 확인해요",
    reassurance: "동의한 항목만 확인합니다",
    action: "이해했습니다",
  },
  {
    label: "평소처럼 생활하세요",
    reassurance: "변화만 조용히 살펴봅니다",
    action: "오늘 기록 시작",
  },
] as const;

export default function ParentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [entryNotice, setEntryNotice] = useState<EntryNotice | null>(null);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--onboarding-vh", `${height}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const replay = new URLSearchParams(window.location.search).get("replay") === "1";
    const completed = window.localStorage.getItem(storageKeys.onboardingCompleted) === "true";

    if (replay || !completed) {
      setIsReady(true);
      return;
    }

    const notice = getOneTimeEntryNotice();
    if (notice) {
      setEntryNotice(notice);
      setIsReady(true);
      return;
    }

    router.replace(FIRST_RECORD_URL);
  }, [router]);

  function completeOnboarding() {
    window.localStorage.setItem(storageKeys.onboardingCompleted, "true");
    router.push(FIRST_RECORD_URL);
  }

  function skipOnboarding() {
    window.localStorage.setItem(storageKeys.onboardingCompleted, "true");
    router.push(FIRST_RECORD_URL);
  }

  function closeEntryNotice() {
    if (entryNotice) markEntryNoticeSeen(entryNotice);
    router.replace(FIRST_RECORD_URL);
  }

  if (!isReady) {
    return <main className="onboarding-page bg-[#FFF9F0]" aria-label="오늘 기록 화면을 준비하고 있습니다" />;
  }

  if (entryNotice) {
    return <OneTimeNotice notice={entryNotice} onContinue={closeEntryNotice} />;
  }

  const current = steps[step - 1];

  return (
    <main className="onboarding-page bg-[#FFF9F0] text-[#17251F]">
      <header className="flex min-h-14 shrink-0 items-center justify-center border-b border-[#E4E8E0] px-4 sm:min-h-16">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-xl font-black text-[#48634F]" aria-label="오늘안부 첫 화면">
          <Image src="/brand/brand-icon.png" alt="" width={34} height={34} className="rounded-xl" priority />
          오늘안부
        </Link>
      </header>

      <section className="onboarding-content mx-auto flex w-full max-w-[560px] flex-col px-5 pt-3 sm:px-8 sm:pt-5">
        <div className="flex min-h-12 shrink-0 items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black tracking-[0.08em] text-[#E9652B]">STEP {step}</p>
            <p className="mt-0.5 text-base font-bold text-[#52635C] sm:text-lg">{current.label}</p>
          </div>
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={skipOnboarding} className="min-h-11 shrink-0 px-1 py-3 text-sm font-bold text-[#8A938E] underline decoration-[#C7CCC8] underline-offset-4">
              건너뛰기
            </button>
          ) : <span className="w-14" aria-hidden />}
        </div>

        <div key={step} className="completion-slide flex min-h-0 flex-1 flex-col justify-center py-3 sm:py-5">
          {step === 1 ? <StepOne /> : null}
          {step === 2 ? <StepTwo /> : null}
          {step === 3 ? <StepThree /> : null}
        </div>

        <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 flex min-h-7 items-center justify-center gap-2 text-center text-lg font-black text-[#46644F]">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#E6F0E2]" aria-hidden><Check size={17} strokeWidth={3} /></span>
            {current.reassurance}
          </p>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(TOTAL_STEPS, value + 1))}
              className="flex min-h-[68px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#E9652B] px-6 text-[1.3rem] font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.24)] focus:outline-none focus:ring-4 focus:ring-[#F5A36D]/40"
            >
              {current.action} <ArrowRight size={24} strokeWidth={2.8} aria-hidden />
            </button>
          ) : (
            <button type="button" onClick={completeOnboarding} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#E9652B] px-6 text-[1.3rem] font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.24)] focus:outline-none focus:ring-4 focus:ring-[#F5A36D]/40">
              {current.action} <ArrowRight size={25} strokeWidth={2.8} aria-hidden />
            </button>
          )}

          {step > 1 ? (
            <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} className="mx-auto mt-1 flex min-h-11 items-center gap-1 px-3 text-sm font-bold text-[#7B8580]">
              <ArrowLeft size={17} aria-hidden /> 이전
            </button>
          ) : <div className="h-12" aria-hidden />}
        </div>
      </section>
    </main>
  );
}

function OneTimeNotice({ notice, onContinue }: { notice: EntryNotice; onContinue: () => void }) {
  return (
    <main className="onboarding-page bg-[#FFF9F0] px-5 text-[#17251F]">
      <section className="mx-auto flex min-h-0 w-full max-w-[520px] flex-1 flex-col justify-center py-6 text-center">
        <span className="mx-auto flex size-24 items-center justify-center rounded-[32px] bg-white text-5xl shadow-[0_16px_44px_rgba(49,78,58,0.10)]" aria-hidden>{notice.emoji}</span>
        <p className="mt-7 text-xl font-black text-[#52725B]">{notice.eyebrow}</p>
        <h1 className="mt-3 whitespace-pre-line text-[clamp(2.1rem,9vw,3rem)] font-black leading-[1.2] tracking-[-0.02em]">{notice.message}</h1>
      </section>
      <div className="mx-auto w-full max-w-[520px] shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={onContinue} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#E9652B] px-6 text-[1.3rem] font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.24)]">
          오늘 기록하기 <ArrowRight size={25} aria-hidden />
        </button>
      </div>
    </main>
  );
}

function readStringArray(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function getOneTimeEntryNotice(): EntryNotice | null {
  try {
    const event = JSON.parse(window.localStorage.getItem(storageKeys.pendingEntryEvent) ?? "null") as Partial<EntryNotice> | null;
    const seenEvents = readStringArray(storageKeys.seenEntryEvents);
    if (event?.id && event.message && !seenEvents.includes(event.id)) {
      return {
        id: event.id,
        emoji: event.emoji ?? "🎉",
        eyebrow: event.eyebrow ?? "오늘의 특별한 소식",
        message: event.message,
        storageKey: "event",
      };
    }
  } catch {
    // 잘못 저장된 이벤트는 건너뛰고 오늘 기록으로 이동합니다.
  }

  const streak = Number(window.localStorage.getItem(storageKeys.recordStreak) ?? 0);
  const milestone = [90, 30, 7].find((day) => streak >= day);
  const seenMilestones = readStringArray(storageKeys.seenMilestones);
  if (milestone && !seenMilestones.includes(String(milestone))) {
    return {
      id: String(milestone),
      emoji: "👏",
      eyebrow: "오늘도 감사합니다.",
      message: `벌써 ${milestone}일째\n기록하고 있어요.`,
      storageKey: "milestone",
    };
  }

  return null;
}

function markEntryNoticeSeen(notice: EntryNotice) {
  const key = notice.storageKey === "event" ? storageKeys.seenEntryEvents : storageKeys.seenMilestones;
  const seen = readStringArray(key);
  if (!seen.includes(notice.id)) {
    window.localStorage.setItem(key, JSON.stringify([...seen, notice.id]));
  }
}

function StepOne() {
  const moods = [
    { emoji: "😀", label: "좋음" },
    { emoji: "🙂", label: "보통" },
    { emoji: "😐", label: "피곤함" },
  ];

  return (
    <div className="text-center">
      <h1 className="mx-auto max-w-[470px] text-[clamp(2rem,9vw,3rem)] font-black leading-[1.2] tracking-[-0.02em] text-[#17251F]">
        오늘 하루 기분만<br />알려주세요.
      </h1>
      <div className="mx-auto mt-7 grid max-w-[460px] grid-cols-3 gap-2.5 rounded-[26px] bg-white p-4 shadow-[0_16px_44px_rgba(49,78,58,0.09)]">
        {moods.map((mood) => <div key={mood.label} className="flex min-h-[92px] flex-col items-center justify-center rounded-[18px] border-2 border-[#DCE5DA] bg-[#FAFCF9] text-lg font-black"><span className="text-3xl" aria-hidden>{mood.emoji}</span><span className="mt-2">{mood.label}</span></div>)}
      </div>
    </div>
  );
}

function StepTwo() {
  const signals = [
    { emoji: "👟", label: "걸음 수" },
    { emoji: "📱", label: "휴대폰 사용량" },
    { emoji: "☀️", label: "생활 패턴" },
  ];

  return (
    <div className="text-center">
      <h1 className="text-[clamp(2rem,9vw,3rem)] font-black leading-[1.18] tracking-[-0.02em]">
        나머지는<br />자동으로 확인합니다.
      </h1>
      <div className="mx-auto mt-6 grid max-w-[460px] gap-2.5 rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(49,78,58,0.10)] sm:p-5">
        {signals.map((signal) => (
          <div key={signal.label} className="flex min-h-[64px] items-center gap-4 rounded-[18px] border border-[#DCE5DA] bg-[#F3F7F1] px-5 text-left text-xl font-black">
            <span className="text-[1.8rem]" aria-hidden>{signal.emoji}</span>
            {signal.label}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-[440px] text-lg font-bold leading-7 text-[#5F6D65]">처음 한 번, 동의해주신 항목만 확인합니다.</p>
    </div>
  );
}

function StepThree() {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-[96px] items-center justify-center rounded-full bg-[#FFF0E5] text-[3rem] shadow-[0_14px_36px_rgba(233,101,43,0.11)]" aria-hidden>😊</span>
      <h1 className="mt-7 text-[clamp(2.2rem,10vw,3.2rem)] font-black leading-[1.18] tracking-[-0.02em]">
        평소처럼<br />생활하세요.
      </h1>
      <p className="mt-4 text-xl font-bold leading-8 text-[#52635C]">오늘안부가 생활의 변화를<br />조용히 살펴봅니다.</p>
    </div>
  );
}
