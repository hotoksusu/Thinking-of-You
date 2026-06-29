import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardEdit,
  Sparkles,
  Sprout,
} from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { BrandLogo } from "@/components/brand-ui";

const values = [
  {
    title: "간단한 하루 기록",
    description: "식사, 컨디션, 활동을 쉽고 빠르게 기록해요.",
    icon: ClipboardEdit,
    color: "bg-[#FFF0E8] text-[#F45D18]",
  },
  {
    title: "AI 안심 리포트",
    description: "기록을 분석해 변화와 안심 상태를 알려드려요.",
    icon: BarChart3,
    color: "bg-[#F0EDFF] text-[#7563D9]",
  },
  {
    title: "함께 키우는 농장",
    description: "꾸준히 기록하면 선택한 작물이 조금씩 자라요.",
    icon: Sprout,
    color: "bg-[#EDF7E7] text-[#4E8D45]",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F2] pb-24 text-[#17223B]">
      <header className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-5 py-5 sm:px-8">
        <BrandLogo />
        <Link
          href="#service"
          className="inline-flex min-h-11 items-center rounded-full border border-[#F1E6DA] bg-white px-4 text-sm font-black text-[#27344E] shadow-sm transition hover:border-[#FFB48F] hover:text-[#F45D18]"
        >
          서비스 소개
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-[1080px] gap-8 px-5 pb-12 pt-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:pb-16 lg:pt-10">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0E8] px-3 py-1.5 text-sm font-black text-[#F45D18]">
            <Sparkles size={15} aria-hidden />
            하루를 기록하면 안심이 쌓여요
          </span>
          <h1 className="mt-5 text-[2.55rem] font-black leading-[1.16] text-[#14213D] sm:text-[3.5rem]">
            우리 가족의 오늘을
            <br />
            <span className="text-[#F45D18]">AI가 안심으로</span>
            <br />
            이어드립니다
          </h1>
          <p className="mt-5 text-[1.05rem] font-semibold leading-8 text-[#5D6678] sm:text-lg">
            간단한 하루 기록이 AI 안심 리포트로 이어지고,
            <br className="hidden sm:block" /> 가족 모두가 변화를 함께 확인해요.
          </p>
          <div className="mt-7 hidden gap-3 sm:flex">
            <Link href="/app" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-7 text-lg font-black text-white shadow-[0_16px_34px_rgba(255,104,31,0.24)] transition hover:bg-[#EB5712] active:scale-[0.98]">
              오늘안부 시작하기
              <ArrowRight size={19} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-[#F4E5D6] bg-[#FFEEDD] shadow-[0_26px_70px_rgba(125,79,38,0.14)]">
          <Image
            src="/illustrations/todayanbu-hero.png"
            alt="따뜻한 방에서 오늘의 하루를 기록하는 오늘안부 캐릭터"
            width={1536}
            height={1152}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <section id="service" className="mx-auto w-full max-w-[1080px] scroll-mt-6 px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="flex gap-4 rounded-[22px] border border-[#F1E7DC] bg-white p-5 shadow-[0_12px_28px_rgba(80,52,32,0.06)] sm:block">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${value.color}`}>
                  <Icon size={24} strokeWidth={2.4} aria-hidden />
                </span>
                <div>
                  <h2 className="font-black sm:mt-4">{value.title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#6C7280]">{value.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 sm:hidden">
          <Link href="/app" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-6 text-lg font-black text-white shadow-[0_16px_34px_rgba(255,104,31,0.24)] active:scale-[0.98]">
            오늘안부 시작하기
            <ArrowRight size={19} aria-hidden />
          </Link>
          <p className="mt-4 text-center text-sm font-semibold text-[#6C7280]">
            이미 계정이 있으신가요? <Link href="/app?role=family" className="font-black text-[#F45D18]">로그인</Link>
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-5 rounded-[30px] bg-[#17223B] p-6 text-white shadow-[0_24px_60px_rgba(23,34,59,0.16)] sm:grid-cols-[1fr_0.9fr] sm:p-10">
          <div>
            <p className="text-sm font-black text-[#FFB184]">AI 안심 리포트 미리보기</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">기록은 짧게,<br />가족의 안심은 선명하게.</h2>
            <p className="mt-4 font-semibold leading-7 text-[#CBD1DC]">하루하루의 응답보다 평소와 달라진 흐름을 먼저 정리해 드려요.</p>
            <Link href="/app?role=family" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-black text-[#17223B]">
              안심 리포트 체험하기
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="rounded-[22px] bg-white p-5 text-[#17223B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-[#6C7280]">오늘의 안심 상태</p>
                <p className="mt-1 text-2xl font-black">안정적이에요</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-full bg-[#EAF7E5] text-[#43853B]"><CheckCircle2 size={26} aria-hidden /></span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F0F1F3]"><div className="h-full w-[89%] rounded-full bg-[#FF681F]" /></div>
            <p className="mt-4 text-sm font-bold leading-6 text-[#5D6678]">최근 기록 참여도와 생활 패턴이 안정적으로 유지되고 있어요.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-10 text-center sm:px-8">
        <p className="text-sm font-black text-[#F45D18]">오늘안부의 약속</p>
        <h2 className="mt-3 text-2xl font-black sm:text-3xl">하루를 기록하면, 안심은 쌓이고, 작물은 자랍니다.</h2>
      </section>

      <BottomTabBar active="home" />
    </main>
  );
}
