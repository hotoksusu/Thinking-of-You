"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const TOTAL_STEPS = 3;
const FIRST_RECORD_URL = "/app?role=parent&view=record";

const steps = [
  {
    label: "처음 사용하는 방법",
    reassurance: "하루 20초면 충분해요",
    action: "알겠습니다",
  },
  {
    label: "버튼으로 기록하기",
    reassurance: "버튼만 누르면 됩니다",
    action: "이해했습니다",
  },
  {
    label: "오늘 기록 시작하기",
    reassurance: "가족만 볼 수 있습니다",
    action: "오늘 기록 시작",
  },
] as const;

export default function ParentOnboardingPage() {
  const [step, setStep] = useState(1);

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
            <Link href={FIRST_RECORD_URL} className="min-h-11 shrink-0 px-1 py-3 text-sm font-bold text-[#8A938E] underline decoration-[#C7CCC8] underline-offset-4">
              건너뛰기
            </Link>
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
            <Link href={FIRST_RECORD_URL} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#E9652B] px-6 text-[1.3rem] font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.24)] focus:outline-none focus:ring-4 focus:ring-[#F5A36D]/40">
              {current.action} <ArrowRight size={25} strokeWidth={2.8} aria-hidden />
            </Link>
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

function StepOne() {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-[88px] items-center justify-center rounded-[30px] bg-[#EAF3E5] text-[2.8rem] shadow-[0_14px_36px_rgba(65,91,67,0.10)]" aria-hidden>🌿</span>
      <h1 className="mx-auto mt-7 max-w-[470px] text-[clamp(2rem,9vw,3rem)] font-black leading-[1.2] tracking-[-0.02em] text-[#17251F]">
        오늘 하루를<br />간단히 기록하면<br />가족이 안심할 수 있어요.
      </h1>
    </div>
  );
}

function StepTwo() {
  const moods = [
    { emoji: "😀", label: "좋음" },
    { emoji: "🙂", label: "보통" },
    { emoji: "😐", label: "피곤함" },
  ];

  return (
    <div className="text-center">
      <h1 className="text-[clamp(2rem,9vw,3rem)] font-black leading-[1.18] tracking-[-0.02em]">
        걱정하지 마세요.<br />버튼만 누르면 됩니다.
      </h1>
      <div className="mx-auto mt-6 grid max-w-[460px] gap-3 rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(49,78,58,0.10)] sm:p-5">
        {moods.map((mood) => (
          <div key={mood.label} className="flex min-h-[72px] items-center gap-5 rounded-[20px] border-2 border-[#DCE5DA] bg-[#FAFCF9] px-5 text-left text-[1.35rem] font-black">
            <span className="text-[2.25rem]" aria-hidden>{mood.emoji}</span>
            {mood.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-[96px] items-center justify-center rounded-full bg-[#FFF0E5] text-[3rem] shadow-[0_14px_36px_rgba(233,101,43,0.11)]" aria-hidden>😊</span>
      <p className="mt-7 text-xl font-black text-[#52725B]">좋습니다.</p>
      <h1 className="mt-3 text-[clamp(2.2rem,10vw,3.2rem)] font-black leading-[1.18] tracking-[-0.02em]">
        그럼 오늘 하루를<br />기록해볼까요?
      </h1>
    </div>
  );
}
