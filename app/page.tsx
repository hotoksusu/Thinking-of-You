import {
  Activity,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Smile,
  Users,
} from "lucide-react";

const changeSignals = [
  "응답 시간이 늦어짐",
  "활동량이 줄어듦",
  "식사 패턴이 달라짐",
  "컨디션 표현이 바뀜",
];

const comparisonItems = [
  {
    title: "기존 안부 확인",
    tone: "muted",
    items: ["오늘 식사했나요?", "오늘 괜찮으신가요?", "응답 여부 확인", "가족이 직접 판단"],
  },
  {
    title: "오늘안부",
    tone: "brand",
    items: ["안심 점수", "응답 시간 변화 감지", "활동량 변화 감지", "AI 안심 리포트", "권장 행동 제안"],
  },
];

const analysisItems = [
  { title: "응답 패턴", description: "평소보다 늦거나 달라진 응답 흐름", icon: Clock3 },
  { title: "생활 루틴", description: "식사, 약 복용, 하루 흐름의 변화", icon: HeartHandshake },
  { title: "활동량 변화", description: "움직임과 외출 신호의 감소", icon: Activity },
  { title: "반복 응답 누락", description: "하루 이상 반복되는 미응답 패턴", icon: MessageCircle },
  { title: "감정 표현", description: "평소와 다른 컨디션 표현과 말투", icon: Smile },
];

const trustNotes = [
  "의료 진단이 아닌 안심 상태 분석입니다.",
  "AI는 부모님의 평소 패턴과 비교해 변화 신호를 보여줍니다.",
  "위험을 단정하지 않고, 확인이 필요한 신호를 알려줍니다.",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <a href="/guide" className="text-sm font-bold text-[#6B7280] transition hover:text-[#2563EB]">
          서비스 둘러보기
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-16">
        <div className="fade-in max-w-[680px]">
          <p className="text-sm font-black text-[#2563EB]">변화 감지 기반 가족 안심 서비스</p>
          <h1 className="mt-8 max-w-[680px] text-[2.85rem] font-black leading-[1.22] tracking-[-0.01em] sm:text-[4.2rem] lg:text-[5.15rem]">
            <span className="block">중요한 건</span>
            <span className="mt-5 block">안부가 아니라</span>
            <span className="mt-6 block">
              <span className="text-[#2563EB]">변화</span>입니다.
            </span>
          </h1>
          <p className="mt-10 max-w-[580px] text-lg font-semibold leading-8 text-[#4B5563]">
            부모님의 생활 패턴 속 작은 변화를 분석해 가족이 놓치기 쉬운 신호를 알려드립니다.
          </p>
          <p className="mt-5 max-w-[540px] text-base font-semibold leading-7 text-[#6B7280]">
            오늘안부는 안부 확인을 대신하는 서비스가 아니라, 평소와 다른 변화를 가족이 더 빨리 알아차릴 수 있도록 돕는
            AI 안심 서비스입니다.
          </p>
          <a
            href="/app"
            className="mt-9 flex min-h-14 w-full max-w-[360px] items-center justify-center rounded-2xl bg-[#2563EB] px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
          >
            오늘안부 시작하기
          </a>
        </div>

        <div className="fade-in grid gap-6 lg:pl-2">
          <ParentStatusCard />
          <AiReportCard />
          <ChangeSignalCard />
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-[600px]">
            <p className="text-sm font-black text-[#2563EB]">왜 필요한가요?</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              작은 변화는
              <br />
              대부분 뒤늦게 발견됩니다.
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
              오늘안부는 평소와 다른 신호를 먼저 감지해 가족에게 안심 상태를 알려드립니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {changeSignals.map((signal) => (
              <article
                key={signal}
                className="warm-card rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                  <Bell size={20} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-black leading-7">{signal}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
        <div className="max-w-[720px]">
          <p className="text-sm font-black text-[#2563EB]">서비스 차이</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            안부 확인을 넘어
            <br />
            변화 감지로
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {comparisonItems.map((group) => (
            <article
              key={group.title}
              className={
                group.tone === "brand"
                  ? "warm-card rounded-[28px] bg-[#EFF6FF] p-7 shadow-[0_20px_60px_rgba(37,99,235,0.10)]"
                  : "warm-card rounded-[28px] border border-[#E5E7EB] bg-white p-7"
              }
            >
              <h3 className="text-2xl font-black">{group.title}</h3>
              <div className="mt-7 grid gap-3">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3">
                    <CheckCircle2
                      size={19}
                      className={group.tone === "brand" ? "text-[#2563EB]" : "text-[#9CA3AF]"}
                      aria-hidden
                    />
                    <span className="font-bold text-[#374151]">{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
          <div className="max-w-[680px]">
            <p className="text-sm font-black text-[#2563EB]">분석 항목</p>
            <h2 className="mt-4 text-4xl font-black tracking-normal">AI는 무엇을 분석하나요?</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {analysisItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="warm-card rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-black leading-7">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#6B7280]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <p className="text-sm font-black text-[#2563EB]">신뢰 설명</p>
          <h2 className="mt-4 text-4xl font-black tracking-normal">
            건강 진단이 아니라
            <br />
            가족을 위한 안심 신호입니다.
          </h2>
          <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
            오늘안부는 질병을 판단하지 않습니다. 부모님의 평소 응답과 생활 루틴을 기준으로 평소와 다른 신호를 가족에게
            보여줍니다.
          </p>
        </div>
        <div className="grid gap-4">
          {trustNotes.map((note) => (
            <div key={note} className="flex items-start gap-4 rounded-[24px] bg-[#F9FAFB] p-5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                <CheckCircle2 size={18} aria-hidden />
              </span>
              <p className="text-lg font-black leading-7">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <Building2 size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-black">기관 도입 문의</h2>
              <p className="mt-2 max-w-[620px] font-semibold leading-7 text-[#6B7280]">
                지자체, 요양기관, 보험사 대상 AI 안심 모니터링 도입을 준비하고 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="min-h-11 rounded-2xl border border-[#D1D5DB] bg-white px-5 text-sm font-black text-[#4B5563]"
          >
            준비 중
          </button>
        </div>
      </section>
    </main>
  );
}

function ParentStatusCard() {
  return (
    <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-black text-[#6B7280]">엄마</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#22C55E]" />
            <strong className="text-xl font-black">안심 상태</strong>
          </div>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">양호</span>
      </div>
      <div className="mt-8">
        <p className="text-sm font-black text-[#2563EB]">안심 점수</p>
        <p className="mt-2 text-6xl font-black leading-none">92점</p>
        <p className="mt-4 font-bold text-[#6B7280]">최근 이상 신호 없음</p>
      </div>
    </article>
  );
}

function AiReportCard() {
  return (
    <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <Brain size={22} aria-hidden />
        </span>
        <h2 className="text-xl font-black">AI 안심 리포트</h2>
      </div>
      <div className="mt-5 grid gap-2 font-semibold leading-7 text-[#4B5563]">
        <p>최근 생활 패턴에 큰 변화는 없습니다.</p>
        <p>다만 활동량이 소폭 감소했습니다.</p>
      </div>
      <p className="mt-4 rounded-2xl bg-[#EFF6FF] px-4 py-3 font-black text-[#2563EB]">
        이번 주 통화를 권장합니다.
      </p>
    </article>
  );
}

function ChangeSignalCard() {
  return (
    <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#FEF3C7] text-[#92400E]">
          <ShieldCheck size={22} aria-hidden />
        </span>
        <h2 className="text-xl font-black">최근 변화 감지</h2>
      </div>
      <div className="mt-5 grid gap-4">
        <div>
          <p className="text-sm font-black text-[#6B7280]">응답 시간</p>
          <p className="mt-2 text-3xl font-black">09:05 → 10:40</p>
        </div>
        <div>
          <p className="text-sm font-black text-[#6B7280]">활동량</p>
          <p className="mt-2 text-2xl font-black">정상 → 감소</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-[#FEF3C7] px-4 py-3">
        <p className="text-sm font-black text-[#92400E]">AI 분석</p>
        <p className="mt-2 font-black leading-7 text-[#92400E]">
          최근 생활 패턴 변화가 감지되었습니다. 이번 주 짧은 통화를 권장합니다.
        </p>
      </div>
    </article>
  );
}
