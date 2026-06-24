import {
  BarChart3,
  Bell,
  ChevronDown,
  HeartHandshake,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { familyEncouragements } from "@/lib/insights";

const flowSteps = [
  { step: "1", title: "하루 기록", detail: "오늘 하루는 어땠나요?", icon: MessageCircle },
  { step: "2", title: "가족 응원", detail: "답장 없이 읽기만 해도 OK", icon: HeartHandshake },
  { step: "3", title: "AI 분석", detail: "기록 흐름을 장기 비교", icon: Sparkles },
  { step: "4", title: "안심 리포트", detail: "가족에게 변화 요약", icon: BarChart3 },
];

const dailyOptions = ["😊 기분 좋았어요", "🙂 평범했어요", "☕ 여유로웠어요", "🏠 집에서 쉬었어요", "🚶 바쁘게 보냈어요"];

const aiSignals = ["기록 빈도", "응답 시간", "선택 변화", "긍정 표현", "활동성 표현"];

const guideFaqs = [
  {
    question: "부모님이 매일 답해야 하나요?",
    answer: "아닙니다. 간단한 선택이나 짧은 기록만으로 충분합니다.",
  },
  {
    question: "답변을 하지 않으면 이상 신호로 판단하나요?",
    answer: "아닙니다. 하루 응답 하나가 아니라 개인별 평소 패턴과 장기 변화를 기준으로 봅니다.",
  },
  {
    question: "가족 메시지는 왜 필요한가요?",
    answer: "상태 확인보다 관심 전달을 먼저 하기 위해서입니다.",
  },
  {
    question: "부모님을 감시하는 서비스인가요?",
    answer: "아닙니다. 위치추적이나 감시가 아니라 하루 기록과 가족 관심을 바탕으로 변화를 살펴봅니다.",
  },
  {
    question: "인터넷이 안 되면 어떻게 되나요?",
    answer: "실시간 응답은 어려울 수 있지만, 장기 기록 흐름을 중심으로 분석합니다. 문자·카카오·전화 안내도 단계적으로 검토합니다.",
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-4 text-sm font-bold text-[#6B7280]">
          <a href="/" className="transition hover:text-[#2563EB]">
            서비스 소개
          </a>
          <a href="/app?registered=1" className="transition hover:text-[#2563EB]">
            리포트 체험
          </a>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-[1120px] px-5 pb-10 pt-10 sm:px-8">
        <p className="text-sm font-black text-[#2563EB]">이용 가이드</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
          오늘안부는
          <br />
          이렇게 작동합니다.
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-10 sm:px-8">
        <h2 className="text-2xl font-black">서비스 흐름</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {flowSteps.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.step} className="rounded-[24px] bg-[#F9FAFB] p-5">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-black text-[#2563EB]">
                  {item.step}
                </span>
                <Icon size={22} className="mt-5 text-[#2563EB]" aria-hidden />
                <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm font-bold text-[#6B7280]">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1120px] gap-4 px-5 py-14 sm:px-8 lg:grid-cols-3">
          <ExampleDaily />
          <ExampleMessage />
          <ExampleReport />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
        <h2 className="text-2xl font-black">AI는 무엇을 보나요?</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {aiSignals.map((signal) => (
            <span key={signal} className="rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-black text-[#2563EB]">
              {signal}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-black">FAQ</h2>
          <div className="mt-6 grid gap-3">
            {guideFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-[22px] bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                  {faq.question}
                  <ChevronDown size={20} className="shrink-0 transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="/app?registered=1"
              className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-[#2563EB] px-6 font-black text-white"
            >
              안심 리포트 체험하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ExampleDaily() {
  return (
    <article className="rounded-[26px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-sm font-black text-[#2563EB]">부모님 화면</p>
      <h3 className="mt-3 text-xl font-black">오늘 하루는 어땠나요?</h3>
      <div className="mt-4 grid gap-2">
        {dailyOptions.slice(0, 4).map((item) => (
          <button key={item} type="button" className="min-h-12 rounded-2xl bg-[#F9FAFB] px-4 text-left font-black">
            {item}
          </button>
        ))}
      </div>
    </article>
  );
}

function ExampleMessage() {
  const message = familyEncouragements[0];

  return (
    <article className="rounded-[26px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <p className="text-sm font-black text-[#2563EB]">가족 응원</p>
      <h3 className="mt-3 text-xl font-black">
        {message.icon} {message.sender}이 보낸 응원
      </h3>
      <p className="mt-4 font-black leading-7">{message.message}</p>
      <p className="mt-4 text-sm font-black text-[#9CA3AF]">읽기만 해도 괜찮아요</p>
    </article>
  );
}

function ExampleReport() {
  return (
    <article className="rounded-[26px] bg-[#111827] p-5 text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#93C5FD]">AI 안심 리포트</p>
          <h3 className="mt-3 text-2xl font-black">엄마</h3>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안정</span>
      </div>
      <p className="mt-6 text-5xl font-black">89</p>
      <div className="mt-5 grid gap-2">
        {["기록 참여도 유지", "생활 패턴 안정", "특이 변화 없음"].map((item) => (
          <p key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-black">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
