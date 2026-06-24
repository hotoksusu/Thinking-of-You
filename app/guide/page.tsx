import {
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

const startSteps = [
  { title: "기록자 선택", description: "누구의 하루 기록을 쌓을지 먼저 정합니다." },
  { title: "대상자 등록", description: "호칭과 관계처럼 필요한 정보만 짧게 입력합니다." },
  { title: "기록 방식 선택", description: "카카오톡, 문자, 전화 흐름 중 편한 방식을 고릅니다." },
  { title: "가족 리포트 설정", description: "AI가 정리한 변화 리포트를 함께 볼 가족을 초대할 수 있습니다." },
];

const dailySteps = [
  { time: "오늘", title: "오늘의 한 순간", description: "기분, 기억, 하루 표현 중 하나만 눌러도 됩니다." },
  { time: "리마인드", title: "기록 안내", description: "정해진 시간에 대화처럼 부드럽게 다시 알려줍니다." },
  { time: "공백", title: "리듬 분석", description: "기록 공백은 평소 리듬과 비교해 변화 신호로 분석됩니다." },
];

const familyChecks = [
  { title: "홈", description: "생활 안심 점수와 AI 요약을 확인합니다." },
  { title: "리포트", description: "기록 참여도, 생활 활력, 관심사 변화를 봅니다." },
  { title: "변화감지", description: "기록 공백, 외부 활동 표현, 긍정 표현 변화를 확인합니다." },
];

const reportItems = [
  { title: "생활 안심 점수", description: "하루 기록의 흐름을 숫자로 빠르게 이해합니다." },
  { title: "AI 의견", description: "최근 변화가 어떤 의미인지 짧게 해석합니다." },
  { title: "변화 원인", description: "기록 참여도, 활동 표현, 정서 표현을 함께 봅니다." },
  { title: "권장 행동", description: "부담 없는 대화처럼 가족이 할 일을 제안합니다." },
];

const planItems = [
  { title: "무료", description: "오늘의 한 순간, 기본 안심 점수" },
  { title: "안심 플랜", description: "변화 감지, 주간 리포트" },
  { title: "가족 플랜", description: "가족 공유, 월간 추이" },
  { title: "프리미엄", description: "생활 변화 알림, AI 전화" },
];

const faqs = [
  {
    question: "하루 기록을 남기지 않으면 어떻게 되나요?",
    answer: "기록 공백도 변화 신호로 보고 평소 기록 리듬과 비교합니다. 반복되면 가족 리포트에 확인 권장 신호로 정리됩니다.",
  },
  {
    question: "실제 푸시는 되나요?",
    answer: "현재 화면은 Mock UI입니다. 실제 푸시, 문자, 카카오톡 연동은 이후 단계에서 붙일 예정입니다.",
  },
  {
    question: "카카오톡 연동은 되나요?",
    answer: "지금은 기록 방식 선택과 리마인드 흐름을 먼저 보여주고, 실제 카카오톡 연동은 준비 단계입니다.",
  },
  {
    question: "가족에게 어떤 알림이 가나요?",
    answer: "기록 공백, 긍정 표현 감소, 외부 활동 표현 감소처럼 확인이 필요한 변화가 있을 때 리포트에 표시하는 구조입니다.",
  },
  {
    question: "개인정보는 어떻게 보호되나요?",
    answer: "가족 공유 범위를 제한하고, 언제든 삭제할 수 있는 구조를 전제로 설계하고 있습니다.",
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <a href="/app" className="text-sm font-bold text-[#6B7280] transition hover:text-[#2563EB]">
          오늘안부 시작하기
        </a>
      </header>

      <section className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-10 sm:px-8 lg:pb-20">
        <div className="max-w-[720px]">
          <p className="text-sm font-black text-[#2563EB]">서비스 둘러보기</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            오늘안부 사용법
          </h1>
          <p className="mt-6 max-w-[640px] text-lg font-semibold leading-8 text-[#6B7280]">
            시니어는 하루를 가볍게 남기고, 가족은 AI가 정리한 변화를 확인하는 흐름을 알려드릴게요.
          </p>
        </div>
      </section>

      <GuideSection
        eyebrow="시작 흐름"
        title={
          <>
            오늘안부는
            <br />
            이렇게 시작합니다
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-4">
          {startSteps.map((step, index) => (
            <StepCard key={step.title} index={index + 1} title={step.title} description={step.description} />
          ))}
        </div>
      </GuideSection>

      <GuideSection
        tone="muted"
        eyebrow="매일 사용"
        title={
          <>
            매일 이렇게
            <br />
            사용합니다
          </>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-black text-[#2563EB]">오늘 하루는 어땠나요?</p>
            <div className="mt-5 grid gap-3">
              {["😊 기분 좋았어요", "🙂 평범했어요", "☕ 여유롭게 보냈어요", "🏠 집에서 쉬었어요"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 text-left text-lg font-black"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {["☕ 커피 한 잔", "🌳 산책", "📺 TV"].map((item) => (
                <span key={item} className="rounded-2xl bg-[#DCFCE7] px-4 py-3 text-sm font-black text-[#15803D]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {dailySteps.map((step) => (
              <ScenarioCard key={step.title} badge={step.time} title={step.title} description={step.description} />
            ))}
          </div>
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="가족 확인"
        title={
          <>
            가족은 이렇게
            <br />
            확인합니다
          </>
        }
      >
        <div className="grid gap-5 md:grid-cols-3">
          {familyChecks.map((item) => (
            <IconCard key={item.title} icon={item.title === "홈" ? ShieldCheck : item.title === "리포트" ? FileText : Bell} title={item.title} description={item.description} />
          ))}
        </div>
      </GuideSection>

      <GuideSection
        tone="muted"
        eyebrow="리포트 읽기"
        title={
          <>
            리포트는 이렇게
            <br />
            읽습니다
          </>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {reportItems.map((item) => (
              <IconCard key={item.title} icon={Sparkles} title={item.title} description={item.description} />
            ))}
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-black text-[#2563EB]">AI 안심 리포트 예시</p>
            <p className="mt-5 text-5xl font-black">87점</p>
            <p className="mt-4 font-bold text-[#6B7280]">최근 외부 활동 관련 표현이 소폭 줄었습니다.</p>
            <p className="mt-5 rounded-2xl bg-[#EFF6FF] p-4 font-black leading-7 text-[#2563EB]">
              이번 주 부담 없는 근황 대화를 권장합니다.
            </p>
          </div>
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="요금제 차이"
        title={
          <>
            요금제는
            <br />
            무엇이 다른가요
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-4">
          {planItems.map((item) => (
            <article key={item.title} className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
              <CreditCard size={22} className="text-[#2563EB]" aria-hidden />
              <h3 className="mt-5 text-xl font-black">{item.title}</h3>
              <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{item.description}</p>
            </article>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        tone="muted"
        eyebrow="FAQ"
        title={
          <>
            자주 묻는
            <br />
            질문
          </>
        }
      >
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                {faq.question}
                <ChevronDown size={20} className="shrink-0 transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </GuideSection>
    </main>
  );
}

function GuideSection({
  eyebrow,
  title,
  children,
  tone = "plain",
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  tone?: "plain" | "muted";
}) {
  return (
    <section className={tone === "muted" ? "bg-[#F9FAFB]" : "bg-white"}>
      <div className="mx-auto w-full max-w-[1120px] px-5 py-20 sm:px-8">
        <div className="mb-10 max-w-[680px]">
          <p className="text-sm font-black text-[#2563EB]">{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function StepCard({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <article className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-black text-[#2563EB]">
        {index}
      </span>
      <h3 className="mt-5 text-xl font-black leading-7">{title}</h3>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{description}</p>
    </article>
  );
}

function ScenarioCard({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <article className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-black text-[#2563EB]">{badge}</span>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{description}</p>
    </article>
  );
}

function IconCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="mt-6 text-xl font-black">{title}</h3>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{description}</p>
    </article>
  );
}
