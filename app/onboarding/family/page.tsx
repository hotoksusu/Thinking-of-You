"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { storageKeys } from "@/lib/storage-keys";

const FAMILY_HOME = "/app?role=family";
const content = [
  { label: "부모님께 부담 없이", message: <>부모님께<br />매일 긴 글을<br />부탁하지 않습니다.</>, note: "기분 하나만 선택하면 됩니다" },
  { label: "자동으로 함께 확인", message: <>기분과 함께<br />생활의 변화를<br />분석합니다.</>, note: "동의받은 정보만 확인합니다" },
  { label: "필요할 때만 알려드려요", message: <>평소와 다른 변화가<br />계속 이어질 때만<br />가족에게 알려드립니다.</>, note: "매일 알림을 보내지 않습니다" },
  { label: "연락할 때를 참고하세요", message: <>매일 확인하지 않아도<br />중요한 변화는 놓치지 않도록<br />도와드립니다.</>, note: "의료 진단이나 응급 신고 서비스는 아닙니다" },
] as const;

export default function FamilyOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const replay = new URLSearchParams(window.location.search).get("replay") === "1";
    if (!replay && window.localStorage.getItem(storageKeys.familyOnboardingCompleted) === "true") {
      router.replace(FAMILY_HOME);
      return;
    }
    setReady(true);
  }, [router]);

  function finish() {
    window.localStorage.setItem(storageKeys.familyOnboardingCompleted, "true");
    router.push(FAMILY_HOME);
  }

  if (!ready) return <main className="onboarding-page bg-[#F7F9F6]" />;
  const current = content[step - 1];

  return (
    <main className="onboarding-page bg-[#F7F9F6] px-5 text-[#17251F]">
      <header className="mx-auto flex min-h-16 w-full max-w-[560px] shrink-0 items-center justify-center gap-2 border-b border-[#E1E8E1] text-xl font-black text-[#48634F]"><Image src="/brand/brand-icon.png" alt="" width={34} height={34} className="rounded-xl" />오늘안부 가족</header>
      <section className="mx-auto flex min-h-0 w-full max-w-[560px] flex-1 flex-col pt-4">
        <div className="shrink-0"><p className="text-sm font-black tracking-[0.08em] text-[#2F6B46]">STEP {step}</p><p className="mt-1 text-lg font-bold text-[#52635C]">{current.label}</p></div>
        <div key={step} className="completion-slide flex min-h-0 flex-1 flex-col items-center justify-center py-5 text-center">
          {step === 2 ? <div className="mb-6 grid w-full max-w-[430px] grid-cols-3 gap-2">{["👟 걸음 수", "📱 사용량", "☀️ 생활 패턴"].map((item) => <span key={item} className="flex min-h-20 items-center justify-center rounded-2xl bg-white px-2 text-base font-black shadow-sm">{item}</span>)}</div> : <span className="mb-6 flex size-20 items-center justify-center rounded-[26px] bg-white text-[#2F6B46] shadow-[0_14px_38px_rgba(49,78,58,0.09)]">{step >= 3 ? <ShieldCheck size={39} /> : <span className="text-4xl">💚</span>}</span>}
          <h1 className="text-[clamp(2rem,8.5vw,3rem)] font-black leading-[1.2] tracking-[-0.02em]">{current.message}</h1>
          {step === 2 ? <p className="mt-4 text-lg font-bold leading-7 text-[#52635C]">통화 내용, 문자 내용, 사진은 확인하지 않습니다.</p> : null}
        </div>
        <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 flex items-center justify-center gap-2 text-lg font-black text-[#46644F]"><Check size={21} strokeWidth={3} />{current.note}</p>
          <button type="button" onClick={step < 4 ? () => setStep(step + 1) : finish} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-6 text-[1.3rem] font-black text-white shadow-[0_12px_28px_rgba(47,107,70,0.22)]">{step < 4 ? "알겠습니다" : "부모님 연결하기"}<ArrowRight size={24} /></button>
          {step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="mx-auto mt-1 flex min-h-11 items-center gap-1 px-3 text-sm font-bold text-[#7B8580]"><ArrowLeft size={17} />이전</button> : <div className="h-12" />}
        </div>
      </section>
    </main>
  );
}
