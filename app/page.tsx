"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Footprints,
  Heart,
  Leaf,
  MessageCircleHeart,
  PhoneCall,
  Sun,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing-navigation";

const TOTAL_STEPS = 5;

export default function LandingPage() {
  const [step, setStep] = useState(1);

  const previous = () => setStep((current) => Math.max(1, current - 1));
  const next = () => setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  const skip = () => setStep(TOTAL_STEPS);

  return (
    <main className="h-[100svh] overflow-hidden bg-[#FFF9F0] text-[#20302C]">
      <MarketingHeader />

      <section className="mx-auto flex h-[calc(100svh-76px)] w-full max-w-[1280px] flex-col px-5 pb-5 pt-4 sm:px-8 sm:pb-7 lg:pt-5">
        <Progress step={step} onSkip={skip} />

        <div key={step} className="completion-slide flex min-h-0 flex-1 flex-col">
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
          {step === 5 && <StepFive onPrevious={previous} />}
        </div>

        {step < TOTAL_STEPS ? (
          <nav className="mx-auto mt-3 grid w-full max-w-[520px] grid-cols-2 gap-3" aria-label="소개 단계 이동">
            {step > 1 ? (
              <button
                type="button"
                onClick={previous}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#A7B7AA] bg-white text-lg font-black text-[#40534B] sm:min-h-16 sm:text-xl"
              >
                <ArrowLeft size={22} aria-hidden /> 이전
              </button>
            ) : null}
            <button
              type="button"
              onClick={next}
              className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#E9652B] text-lg font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.22)] sm:min-h-16 sm:text-xl ${step === 1 ? "col-start-1 col-end-3" : ""}`}
            >
              다음 <ArrowRight size={22} aria-hidden />
            </button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}

function Progress({ step, onSkip }: { step: number; onSkip: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] items-center justify-between" aria-label={`전체 5단계 중 ${step}단계`}>
      <span className="min-w-16 text-left text-base font-black text-[#52635C]">{step} / 5</span>
      <div className="flex items-center gap-2" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <span key={index} className={`h-2.5 rounded-full transition-all ${index + 1 === step ? "w-8 bg-[#E9652B]" : index + 1 < step ? "w-2.5 bg-[#89A083]" : "w-2.5 bg-[#D9DED7]"}`} />
        ))}
      </div>
      {step < TOTAL_STEPS ? (
        <button
          type="button"
          onClick={onSkip}
          className="min-h-11 min-w-16 rounded-xl px-2 text-right text-base font-black text-[#52635C]"
        >
          건너뛰기
        </button>
      ) : (
        <span className="min-w-16" aria-hidden />
      )}
    </div>
  );
}

function StepLayout({ eyebrow, title, description, children }: { eyebrow: string; title: React.ReactNode; description: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-0 flex-1 items-center gap-3 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
      <div className="order-2 mx-auto w-full max-w-[520px] text-center lg:order-1 lg:text-left">
        <p className="text-base font-black text-[#E9652B] sm:text-lg">{eyebrow}</p>
        <h1 className="mt-2 text-[2rem] font-black leading-[1.2] sm:text-[2.7rem] lg:text-[3.25rem]">{title}</h1>
        <p className="mt-3 text-lg font-bold leading-8 text-[#52635C] sm:text-xl sm:leading-9">{description}</p>
      </div>
      <div className="order-1 flex min-h-0 items-center justify-center lg:order-2">{children}</div>
    </div>
  );
}

function AppFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="w-full max-w-[290px] rounded-[26px] border-[5px] border-[#25352F] bg-white p-2 shadow-[0_20px_55px_rgba(42,55,48,0.15)] sm:max-w-[340px] lg:max-w-[390px]" aria-label={label}>
      <div className="mx-auto mb-1.5 h-1.5 w-14 rounded-full bg-[#D6DCD8]" aria-hidden />
      <div className="h-[300px] overflow-hidden rounded-[17px] bg-[#FFFDF8] sm:h-[360px] lg:h-[440px]">{children}</div>
    </div>
  );
}

function StepOne() {
  return (
    <StepLayout
      eyebrow="오늘안부와 함께"
      title={<>평소처럼<br />생활하세요.</>}
      description={<>생활이 차곡차곡 쌓이면<br />계절의 수확이 찾아옵니다.</>}
    >
      <AppFrame label="오늘안부 첫 화면 미리보기">
        <div className="flex h-full flex-col items-center justify-center bg-[#F3F6EC] p-5 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#648064] shadow-sm"><Leaf size={29} aria-hidden /></span>
          <p className="mt-5 text-sm font-black text-[#52725B]">7월 8일 수요일</p>
          <h2 className="mt-2 text-[1.55rem] font-black leading-[1.35] lg:text-[1.8rem]">오늘도 평소처럼<br />지내고 계세요.</h2>
          <div className="mt-5 w-full rounded-[18px] bg-white p-4 text-left">
            <p className="text-sm font-black text-[#52725B]">오늘의 생활</p>
            <p className="mt-1 text-base font-black">편안하게 이어지고 있어요.</p>
          </div>
        </div>
      </AppFrame>
    </StepLayout>
  );
}

function StepTwo() {
  const signals = [
    { icon: Footprints, title: "걸음", text: "평소처럼 움직였어요" },
    { icon: Sun, title: "생활 리듬", text: "규칙적으로 이어지고 있어요" },
    { icon: PhoneCall, title: "통화 활동", text: "소식을 나눈 날이에요" },
  ];

  return (
    <StepLayout
      eyebrow="복잡한 기록 없이"
      title={<>아무것도 기록하지<br />않아도 됩니다.</>}
      description={<>걸음과 생활 리듬을<br />AI가 자연스럽게 살펴봅니다.</>}
    >
      <AppFrame label="생활 안심 화면 미리보기">
        <div className="h-full bg-[#EEF5E9] p-4 lg:p-5">
          <p className="text-sm font-black text-[#52725B]">오늘의 안심</p>
          <h2 className="mt-1 text-xl font-black lg:text-2xl">생활이 자연스럽게<br />이어지고 있어요.</h2>
          <div className="mt-4 grid gap-2.5">
            {signals.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex min-h-[62px] items-center gap-3 rounded-[16px] bg-white p-3 lg:min-h-[74px]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF4E9] text-[#52725B]"><Icon size={22} aria-hidden /></span>
                <div><p className="font-black">{title}</p><p className="text-sm font-bold text-[#68756F]">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </AppFrame>
    </StepLayout>
  );
}

function StepThree() {
  return (
    <StepLayout
      eyebrow="가끔 도착하는 가족 소식"
      title={<>가족의 작은 소식이<br />하루의 기쁨이 됩니다.</>}
      description={<>손주 사진이나 퇴근길 풍경을<br />부담 없이 함께 볼 수 있어요.</>}
    >
      <AppFrame label="가족 소식 화면 미리보기">
        <div className="h-full p-4 lg:p-5">
          <div className="flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#C65C3C]"><MessageCircleHeart size={22} aria-hidden /></span><div><p className="text-sm font-black text-[#B35C45]">오늘 도착한 가족 소식</p><p className="text-xs font-bold text-[#6A756F]">딸이 사진 한 장을 보냈어요</p></div></div>
          <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-[17px] lg:mt-4">
            <Image src="/brand/hero-family.png" alt="가족이 보낸 따뜻한 사진" fill className="object-cover" sizes="390px" />
          </div>
          <div className="mt-3 rounded-[16px] bg-[#FFF3EC] p-3 lg:mt-4 lg:p-4">
            <p className="text-base font-black leading-6 lg:text-lg">아빠, 퇴근길 노을이<br />참 예뻐서 보내요.</p>
            <p className="mt-2 text-xs font-bold text-[#7B6258] lg:text-sm">답장 없이 사진만 보셔도 괜찮아요.</p>
          </div>
        </div>
      </AppFrame>
    </StepLayout>
  );
}

function StepFour() {
  return (
    <StepLayout
      eyebrow="생활이 만든 따뜻한 보상"
      title={<>생활이 쌓이면<br />계절의 수확이 찾아옵니다.</>}
      description={<>평소처럼 보낸 시간이 쌓이면<br />선택한 제철 농산물이 찾아옵니다.</>}
    >
      <AppFrame label="안부농장 화면 미리보기">
        <div className="relative h-full bg-[#F4EEDC] p-4 lg:p-5">
          <p className="text-sm font-black text-[#52725B]">계절의 수확</p>
          <h2 className="mt-1 text-xl font-black lg:text-2xl">방울토마토가<br />잘 자라고 있어요.</h2>
          <div className="relative mt-3 h-[145px] overflow-hidden rounded-[17px] bg-[#FFF8E9] lg:h-[225px]">
            <Image src="/brand/farm-mascot.png" alt="수확한 채소를 안고 있는 안심이" fill className="object-cover object-center" sizes="390px" />
          </div>
          <div className="mt-3 rounded-[15px] bg-white p-3">
            <div className="flex justify-between text-sm font-black"><span>성장 중</span><span className="text-[#52725B]">72%</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E5E9DF]"><div className="h-full w-[72%] rounded-full bg-[#75A46E]" /></div>
          </div>
        </div>
      </AppFrame>
    </StepLayout>
  );
}

function StepFive({ onPrevious }: { onPrevious: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center text-center">
      <div className="w-full max-w-[720px]">
        <span className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#EAF3E5] text-[#52725B] sm:size-20">
          <Heart size={36} fill="currentColor" aria-hidden />
        </span>
        <p className="mt-5 text-lg font-black text-[#52725B]">이제 준비됐어요</p>
        <h1 className="mt-3 text-[2.25rem] font-black leading-[1.2] sm:text-[3.5rem]">오늘부터<br />평소처럼 생활하세요.</h1>
        <p className="mx-auto mt-4 max-w-[600px] text-lg font-bold leading-8 text-[#52635C] sm:text-xl sm:leading-9">
          부모님은 평소처럼 지내고,<br />가족은 가끔 사진 한 장만 남기면 됩니다.
        </p>
        <div className="mx-auto mt-7 grid max-w-[520px] gap-3 sm:grid-cols-2">
          <Link href="/start" className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-6 text-xl font-black text-white shadow-[0_12px_28px_rgba(233,101,43,0.22)]">
            오늘안부 시작하기 <ArrowRight size={22} aria-hidden />
          </Link>
          <Link href="/onboarding/add-parent" className="inline-flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#8FA98D] bg-white px-6 text-xl font-black text-[#31473D]">
            부모님 연결하기
          </Link>
        </div>
        <button type="button" onClick={onPrevious} className="mt-5 inline-flex min-h-11 items-center gap-2 px-3 text-base font-black text-[#52635C]">
          <ArrowLeft size={20} aria-hidden /> 이전
        </button>
      </div>
    </div>
  );
}
