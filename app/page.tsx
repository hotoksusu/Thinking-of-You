import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Heart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { familyEncouragements } from "@/lib/insights";

const empathyCards = [
  "매일 전화하기는 어렵습니다.",
  "괜찮다고 하셔도 가족은 늘 궁금합니다.",
  "상태를 계속 묻는 일은 조심스럽습니다.",
];

const differenceItems = [
  "위치를 추적하지 않습니다.",
  "건강을 검사하지 않습니다.",
  "긴 기록을 요구하지 않습니다.",
];

const valueCards = [
  {
    title: "부모님에게는",
    description: "내 하루를 남기는 작은 일기",
    icon: Heart,
  },
  {
    title: "가족에게는",
    description: "멀리서도 마음을 전하는 방법",
    icon: HeartHandshake,
  },
  {
    title: "AI에게는",
    description: "변화를 발견하는 기록의 흐름",
    icon: Brain,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-4 text-sm font-bold text-[#6B7280]">
          <a href="/" className="hidden transition hover:text-[#2563EB] sm:inline">
            서비스 소개
          </a>
          <a href="/guide" className="transition hover:text-[#2563EB]">
            이용 가이드
          </a>
          <a href="/app?registered=1" className="hidden transition hover:text-[#2563EB] sm:inline">
            안심 리포트 체험
          </a>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pb-28 lg:pt-18">
        <div className="max-w-[700px]">
          <p className="text-sm font-black text-[#2563EB]">가족의 관심이 기록되고 AI가 변화를 살펴보는 서비스</p>
          <h1 className="mt-8 text-[3rem] font-black leading-[1.12] tracking-[-0.01em] sm:text-[4.4rem]">
            관심이 쌓이면,
            <br />
            <span className="text-[#2563EB]">안심</span>이 됩니다.
          </h1>
          <p className="mt-8 max-w-[610px] text-xl font-semibold leading-9 text-[#4B5563]">
            멀리 있어도 부모님의 하루를 따뜻하게 살필 수 있도록 오늘안부가 작은 기록과 가족의 관심을 연결합니다.
          </p>
          <p className="mt-5 max-w-[590px] text-lg font-semibold leading-8 text-[#6B7280]">
            AI는 기록 속 변화를 분석해 가족에게 안심 리포트를 제공합니다.
          </p>
          <div className="mt-10 grid max-w-[520px] gap-3 sm:grid-cols-2">
            <a
              href="/app?registered=1"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              안심 리포트 체험하기
              <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href="/guide"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-base font-black text-[#1F2937] transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              사용 흐름 보기
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <article className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
            <p className="text-sm font-black text-[#93C5FD]">오늘안부가 전하는 것</p>
            <h2 className="mt-4 text-3xl font-black leading-tight">
              확인보다 먼저,
              <br />
              관심을 전합니다.
            </h2>
            <div className="mt-6 grid gap-3">
              {familyEncouragements.slice(0, 2).map((message) => (
                <div key={message.id} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-black text-[#BFDBFE]">
                    {message.icon} {message.sender}의 응원
                  </p>
                  <p className="mt-2 font-black leading-7">{message.message}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-[28px] border border-[#DBEAFE] bg-[#EFF6FF] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-[#2563EB]" aria-hidden />
              <h2 className="text-xl font-black">감시가 아니라 관심입니다.</h2>
            </div>
            <p className="mt-4 font-semibold leading-7 text-[#4B5563]">
              부모님은 읽기만 해도 괜찮고, 하루를 가볍게 남기기만 해도 충분합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#2563EB]">문제 공감</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              부모님은 괜찮다고 하시지만,
              <br />
              가족은 늘 궁금합니다.
            </h2>
            <p className="mt-6 max-w-[620px] text-lg font-semibold leading-8 text-[#6B7280]">
              매일 전화하기는 어렵고, 부모님께 매번 상태를 묻는 것도 조심스럽습니다. 오늘안부는 확인이 아니라 관심으로 시작합니다.
            </p>
          </div>
          <div className="grid gap-4">
            {empathyCards.map((item) => (
              <article key={item} className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <MessageCircle size={22} className="text-[#2563EB]" aria-hidden />
                <h3 className="mt-4 text-xl font-black leading-8">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
        <div className="max-w-[760px]">
          <p className="text-sm font-black text-[#2563EB]">다른 점</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            오늘안부는 누군가를
            <br />
            관리하는 서비스가 아닙니다.
          </h2>
          <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
            부모님은 하루를 가볍게 남기고, 가족은 따뜻한 메시지를 전합니다. AI는 그 흐름 속 변화를 조용히 살펴봅니다.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {differenceItems.map((item) => (
            <article key={item} className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
              <CheckCircle2 size={22} className="text-[#2563EB]" aria-hidden />
              <h3 className="mt-5 text-xl font-black leading-8">{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#FFF7ED]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
          <div className="max-w-[740px]">
            <p className="text-sm font-black text-[#2563EB]">가치</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              같은 기록도
              <br />
              보는 사람에 따라 가치가 달라집니다.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-[28px] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon size={24} aria-hidden />
                  </span>
                  <p className="mt-6 text-sm font-black text-[#2563EB]">{card.title}</p>
                  <h3 className="mt-3 text-2xl font-black leading-9">{card.description}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-24 text-center sm:px-8">
        <p className="text-sm font-black text-[#2563EB]">시작하기</p>
        <h2 className="mx-auto mt-4 max-w-[760px] text-4xl font-black leading-tight tracking-normal sm:text-5xl">
          오늘부터 부모님의 하루를
          <br />
          조금 더 따뜻하게 살펴보세요.
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-lg font-semibold leading-8 text-[#6B7280]">
          관심이 쌓이면 안심이 됩니다. 오늘안부는 그 관심을 부담 없는 기록과 리포트로 이어줍니다.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/app"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)]"
          >
            시작하기
          </a>
          <a
            href="/guide"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-7 font-black text-[#4B5563]"
          >
            이용 가이드 보기
          </a>
        </div>
      </section>
    </main>
  );
}
