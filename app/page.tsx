import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Heart,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import { InstallGuide } from "@/components/install-guide";

const heroPills = ["부모님의 하루 기록", "가족의 따뜻한 관심", "AI의 변화 분석"];

const flowSteps = [
  { step: "1", title: "하루 기록", description: "한 번만 선택", icon: MessageCircle },
  { step: "2", title: "가족 응원", description: "읽기만 해도 OK", icon: HeartHandshake },
  { step: "3", title: "AI 분석", description: "변화 흐름 감지", icon: Brain },
  { step: "4", title: "안심 리포트", description: "가족에게 요약", icon: BarChart3 },
];

const valueCards = [
  { title: "부모님", description: "하루를 남깁니다", icon: Heart },
  { title: "가족", description: "관심을 전합니다", icon: HeartHandshake },
  { title: "AI", description: "변화를 분석합니다", icon: Brain },
];

const notCards = ["위치 추적 아님", "건강 검사 아님", "긴 기록 없음"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-4 text-sm font-bold text-[#6B7280]">
          <a href="/guide" className="transition hover:text-[#2563EB]">
            이용 가이드
          </a>
          <a href="/app?registered=1" className="hidden transition hover:text-[#2563EB] sm:inline">
            리포트 체험
          </a>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-24">
        <div>
          <p className="text-sm font-black text-[#2563EB]">AI 안심 리포트 서비스</p>
          <h1 className="mt-5 text-[3rem] font-black leading-[1.12] tracking-[-0.01em] sm:text-[4.5rem]">
            관심이 쌓이면,
            <br />
            <span className="text-[#2563EB]">안심</span>이 됩니다.
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {heroPills.map((pill) => (
              <span key={pill} className="rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-black text-[#2563EB]">
                {pill}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app?registered=1"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              안심 리포트 체험하기
              <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href="/guide"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-7 font-black text-[#4B5563]"
            >
              이용 방법 보기
            </a>
          </div>
        </div>

        <ReportPreview />
      </section>

      <section className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-black sm:text-3xl">하루 기록 → 관심 전달 → AI 분석</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {flowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-black text-[#2563EB]">
                    {item.step}
                  </span>
                  <Icon size={22} className="mt-5 text-[#2563EB]" aria-hidden />
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-bold text-[#6B7280]">{item.description}</p>
                </article>
              );
            })}
          </div>
          <PrimaryLink />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-[26px] border border-[#E5E7EB] bg-white p-6">
                <Icon size={24} className="text-[#2563EB]" aria-hidden />
                <p className="mt-5 text-sm font-black text-[#2563EB]">{card.title}</p>
                <h2 className="mt-2 text-2xl font-black leading-8">{card.description}</h2>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#FFF7ED]">
        <div className="mx-auto grid w-full max-w-[1120px] gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#2563EB]">확인이 아니라 관심</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              부모님은 괜찮다고 하셔도,
              <br />
              가족은 늘 궁금합니다.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {notCards.map((item) => (
              <article key={item} className="rounded-[22px] bg-white p-5">
                <CheckCircle2 size={20} className="text-[#2563EB]" aria-hidden />
                <h3 className="mt-4 text-lg font-black">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
        <InstallGuide />
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-16 text-center sm:px-8">
        <h2 className="text-3xl font-black leading-tight sm:text-4xl">
          오늘부터 부모님의 하루를
          <br />
          따뜻하게 살펴보세요.
        </h2>
        <PrimaryLink centered />
      </section>
    </main>
  );
}

function ReportPreview() {
  return (
    <article className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#93C5FD]">AI 안심 리포트 예시</p>
          <h2 className="mt-3 text-3xl font-black">엄마</h2>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
          안정
        </span>
      </div>
      <p className="mt-7 text-6xl font-black leading-none">89</p>
      <p className="mt-2 text-sm font-black text-white/55">안심점수</p>
      <div className="mt-6 grid gap-3">
        {["최근 기록 참여도 유지", "생활 패턴 안정", "특이 변화 없음"].map((item) => (
          <p key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-black">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

function PrimaryLink({ centered = false }: { centered?: boolean }) {
  return (
    <div className={centered ? "mt-8 flex justify-center" : "mt-8"}>
      <a
        href="/app?registered=1"
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.18)]"
      >
        안심 리포트 체험하기
        <ArrowRight size={17} aria-hidden />
      </a>
    </div>
  );
}
