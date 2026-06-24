import {
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  HeartHandshake,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { familyEncouragements } from "@/lib/insights";

const dailyOptions = ["😊 기분 좋았어요", "🙂 평범했어요", "☕ 여유로웠어요", "🏠 집에서 쉬었어요", "🚶 바쁘게 보냈어요"];

const aiSignals = [
  "기록 빈도",
  "응답 시간",
  "선택 변화",
  "긍정 표현 변화",
  "활동성 표현 변화",
];

const reportExample = [
  "최근 2주간 기록 참여도는 안정적입니다.",
  "다만 집에서 쉬었다는 응답이 이전보다 늘었습니다.",
  "이번 주에는 짧은 통화를 권장합니다.",
];

const guideFaqs = [
  {
    question: "부모님이 매일 답해야 하나요?",
    answer: "아닙니다. 오늘안부는 매일 긴 답변을 요구하지 않습니다. 간단한 선택이나 짧은 기록만으로 충분합니다.",
  },
  {
    question: "답변을 하지 않으면 이상 신호로 판단하나요?",
    answer:
      "아닙니다. 단순히 하루 답변이 없다고 위험으로 판단하지 않습니다. AI는 개인별 평소 패턴과 장기 변화를 기준으로 분석합니다.",
  },
  {
    question: "가족 메시지는 왜 필요한가요?",
    answer:
      "오늘안부는 상태 확인보다 관심 전달을 중요하게 생각합니다. 가족의 짧은 응원은 부모님에게 따뜻한 접점이 되고, 서비스 사용을 자연스럽게 이어가게 합니다.",
  },
  {
    question: "부모님을 감시하는 서비스인가요?",
    answer:
      "아닙니다. 오늘안부는 위치추적이나 감시 서비스가 아닙니다. 부모님의 하루 기록과 가족의 관심을 바탕으로 변화를 살펴보는 안심 서비스입니다.",
  },
  {
    question: "인터넷이 안 되면 어떻게 되나요?",
    answer:
      "인터넷 연결이 없으면 실시간 응답은 어려울 수 있습니다. 다만 오늘안부는 하루 응답 여부만으로 판단하지 않고, 장기적인 기록 흐름과 변화 패턴을 중심으로 분석합니다. 향후 문자 알림, 카카오 알림, 전화 안내 등 다양한 전달 방식을 단계적으로 검토합니다.",
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
          <a href="/app" className="transition hover:text-[#2563EB]">
            시작하기
          </a>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-10 sm:px-8 lg:pb-20">
        <div className="max-w-[760px]">
          <p className="text-sm font-black text-[#2563EB]">이용 가이드</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            오늘안부는
            <br />
            이렇게 작동합니다.
          </h1>
          <p className="mt-6 max-w-[680px] text-lg font-semibold leading-8 text-[#6B7280]">
            부모님이 하루를 남기고, 가족이 관심을 전하고, AI가 변화 흐름을 분석합니다.
          </p>
        </div>
      </section>

      <GuideStep
        step="1단계"
        icon={MessageCircle}
        title="부모님이 하루를 남깁니다"
        description="하루에 하나의 간단한 선택이나 짧은 기록만 남깁니다."
      >
        <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-black text-[#2563EB]">오늘 하루는 어땠나요?</p>
          <div className="mt-5 grid gap-3">
            {dailyOptions.map((item) => (
              <button
                key={item}
                type="button"
                className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 text-left text-lg font-black"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </GuideStep>

      <GuideStep
        step="2단계"
        icon={HeartHandshake}
        title="가족이 관심을 전합니다"
        description="가족은 부모님께 짧은 응원 메시지를 보낼 수 있습니다. 답장을 요구하지 않고, 읽기만 해도 괜찮습니다."
        tone="muted"
      >
        <div className="grid gap-3">
          {familyEncouragements.map((message) => (
            <article key={message.id} className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-black text-[#2563EB]">
                {message.icon} {message.sender}이 보낸 응원
              </p>
              <p className="mt-3 text-lg font-black leading-8">{message.message}</p>
              <p className="mt-3 text-sm font-black text-[#9CA3AF]">읽기만 해도 괜찮아요</p>
            </article>
          ))}
        </div>
      </GuideStep>

      <GuideStep
        step="3단계"
        icon={Sparkles}
        title="AI가 기록 흐름을 분석합니다"
        description="AI는 하루하루의 답변 하나만 보지 않습니다. 개인별 평소 흐름과 장기 변화를 함께 비교합니다."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {aiSignals.map((signal) => (
            <article key={signal} className="rounded-[22px] border border-[#DBEAFE] bg-[#EFF6FF] p-5">
              <Bell size={20} className="text-[#2563EB]" aria-hidden />
              <h3 className="mt-4 text-xl font-black">{signal}</h3>
            </article>
          ))}
        </div>
      </GuideStep>

      <GuideStep
        step="4단계"
        icon={FileText}
        title="가족에게 안심 리포트를 제공합니다"
        description="가족은 원시 기록보다 AI가 정리한 변화 요약을 확인합니다."
        tone="muted"
      >
        <article className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <BarChart3 size={22} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-black text-[#2563EB]">AI 안심 리포트 예시</p>
              <h3 className="text-2xl font-black">생활 흐름 안정</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {reportExample.map((item) => (
              <p key={item} className="rounded-2xl bg-[#F9FAFB] p-4 font-black leading-7">
                {item}
              </p>
            ))}
          </div>
        </article>
      </GuideStep>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-20 sm:px-8">
          <div className="mb-10 max-w-[700px]">
            <p className="text-sm font-black text-[#2563EB]">FAQ</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
              자주 묻는 질문
            </h2>
          </div>
          <div className="grid gap-3">
            {guideFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-[24px] bg-[#F9FAFB] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                  {faq.question}
                  <ChevronDown size={20} className="shrink-0 transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function GuideStep({
  step,
  icon: Icon,
  title,
  description,
  children,
  tone = "plain",
}: {
  step: string;
  icon: typeof MessageCircle;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "plain" | "muted";
}) {
  return (
    <section className={tone === "muted" ? "bg-[#F9FAFB]" : "bg-white"}>
      <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1.5 text-sm font-black text-[#2563EB]">
            <Icon size={18} aria-hidden />
            {step}
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h2>
          <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
