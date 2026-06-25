import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronDown,
  HeartHandshake,
  Link,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const flowSteps = [
  {
    step: "1",
    title: "가족 응원",
    description: "가족이 짧은 응원을 보내고 부모님은 읽기만 해도 됩니다.",
    icon: HeartHandshake,
  },
  {
    step: "2",
    title: "부모님께 링크 보내기",
    description: "설치 설명 없이 오늘의 기록 링크를 보냅니다.",
    icon: Link,
  },
  {
    step: "3",
    title: "오늘의 기록",
    description: "부모님은 큰 버튼 하나로 하루를 남깁니다.",
    icon: MessageCircle,
  },
  {
    step: "4",
    title: "안심 리포트",
    description: "AI가 변화 감지 결과를 가족에게 정리해줍니다.",
    icon: BarChart3,
  },
];

const faqs = [
  {
    question: "앱 설치가 꼭 필요한가요?",
    answer: "아닙니다. 부모님은 카카오톡이나 문자로 받은 링크만 열어도 오늘의 기록을 남길 수 있습니다.",
  },
  {
    question: "왜 가족 메시지가 중요한가요?",
    answer: "부모님이 다시 찾아오게 만드는 건 기능이 아니라 가족의 관심입니다. 응원을 읽고 나서 하루를 남기는 흐름을 만듭니다.",
  },
  {
    question: "부모님을 감시하는 서비스인가요?",
    answer: "아닙니다. 위치 추적이나 감시가 아니라, 부모님이 남긴 오늘의 기록과 가족의 관심을 바탕으로 변화 감지를 돕는 서비스입니다.",
  },
  {
    question: "답변하지 않으면 위험 신호인가요?",
    answer: "한 번의 미응답을 위험으로 단정하지 않습니다. 반복되는 흐름을 평소와 비교해 안심 리포트에 반영합니다.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <nav className="flex items-center gap-5 text-sm font-bold text-[#6B7280]">
          <a href="/" className="text-[#2563EB]">
            홈
          </a>
          <a href="/app" className="transition hover:text-[#2563EB]">
            앱 체험
          </a>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:pb-24 lg:pt-16">
        <div>
          <p className="text-sm font-black text-[#2563EB]">가족의 관심으로 다시 찾아오는 AI 안심 서비스</p>
          <h1 className="mt-5 max-w-[680px] text-[3.05rem] font-black leading-[1.12] tracking-[-0.01em] sm:text-[4.25rem]">
            관심이 쌓이면,
            <br />
            <span className="text-[#2563EB]">안심</span>이 됩니다.
          </h1>
          <p className="mt-7 max-w-[620px] text-xl font-black leading-9 text-[#1F2937]">
            부모님은 가족의 응원을 읽고
            <br />
            오늘의 기록을 가볍게 남기고
            <br />
            가족은 안심 리포트를 확인합니다.
          </p>

          <div className="mt-7 rounded-[24px] bg-[#EFF6FF] p-5">
            <p className="text-sm font-black text-[#2563EB]">
              부모님이 다시 찾아오게 만드는 건 기능이 아니라 가족의 관심입니다.
            </p>
            <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
              오늘안부는 가족의 짧은 응원과 부모님의 하루 기록을 연결합니다. AI는 그 흐름 속 변화를 살펴 가족에게 안심 리포트를 제공합니다.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/app"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              안심 리포트 체험하기
              <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href="/app?registered=1"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-7 font-black text-[#4B5563]"
            >
              앱 체험하기
            </a>
          </div>
        </div>

        <ReportPreview />
      </section>

      <section className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8">
          <p className="text-sm font-black text-[#2563EB]">재방문 루프</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            응원을 읽고,
            <br />
            하루를 남깁니다.
          </h2>
          <div className="mt-9 grid gap-3 md:grid-cols-4">
            {flowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.step} className="rounded-[24px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-black text-[#2563EB]">
                    {item.step}
                  </span>
                  <Icon size={22} className="mt-5 text-[#2563EB]" aria-hidden />
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#6B7280]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-black text-[#2563EB]">예시 안심 리포트</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            원시 데이터가 아니라
            <br />
            변화 요약을 봅니다.
          </h2>
          <p className="mt-5 font-semibold leading-8 text-[#6B7280]">
            최근 7일간 기록 참여도, 가족의 관심, 변화 감지 결과를 안심 리포트로 정리합니다.
          </p>
        </div>
        <ReportPreview compact />
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[920px] px-5 py-16 sm:px-8">
          <p className="text-sm font-black text-[#2563EB]">FAQ</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">자주 묻는 질문</h2>
          <div className="mt-8 grid gap-3">
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-[920px] px-5 py-16 text-center sm:px-8">
        <ShieldCheck size={34} className="mx-auto text-[#2563EB]" aria-hidden />
        <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
          첫 경험은 설치가 아니라
          <br />
          가족의 응원입니다.
        </h2>
        <div className="mt-8 flex justify-center">
          <a
            href="/app"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-7 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
          >
            바로 시작하기
            <ArrowRight size={18} aria-hidden />
          </a>
        </div>
      </section>
    </main>
  );
}

function ReportPreview({ compact = false }: { compact?: boolean }) {
  return (
    <article className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#93C5FD]">안심 리포트</p>
          <h2 className="mt-3 text-3xl font-black">엄마</h2>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안심</span>
      </div>
      <p className="mt-7 text-6xl font-black leading-none">89</p>
      <p className="mt-2 text-sm font-black text-white/55">안심 점수</p>
      <div className="mt-6 grid gap-3">
        {["오늘의 응원 확인", "오늘의 기록이 도착했습니다", "변화 감지 결과 큰 변화 없음"].map((item) => (
          <p key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-black">
            {item}
          </p>
        ))}
      </div>
      {!compact ? (
        <p className="mt-5 rounded-2xl bg-white px-4 py-3 font-black leading-7 text-[#2563EB]">
          최근 7일간 기록 참여도는 안정적입니다. 이번 주에는 짧은 통화를 권장합니다.
        </p>
      ) : null}
    </article>
  );
}
