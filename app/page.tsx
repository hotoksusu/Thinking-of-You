import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CheckCircle2,
  Clock3,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

const steps = [
  {
    title: "부모님은 간단히 안부만 남깁니다",
    description: "식사, 약 복용, 컨디션처럼 부담 없는 질문에 짧게 답합니다.",
    icon: HeartHandshake,
  },
  {
    title: "AI가 평소 패턴과 비교합니다",
    description: "응답 시간과 생활 루틴이 평소와 달라졌는지 살펴봅니다.",
    icon: Brain,
  },
  {
    title: "자녀는 안심 점수와 리포트를 확인합니다",
    description: "지금 괜찮은지, 확인이 필요한 변화가 있는지 한눈에 봅니다.",
    icon: FileText,
  },
];

const values = [
  {
    title: "전화 확인의 부담을 줄입니다",
    description: "매일 전화하지 않아도 부모님의 안심 상태를 먼저 확인할 수 있습니다.",
    icon: Clock3,
  },
  {
    title: "평소와 다른 변화를 놓치지 않습니다",
    description: "미응답, 응답 시간 변화, 활동 감소처럼 작은 변화를 놓치지 않게 돕습니다.",
    icon: Activity,
  },
  {
    title: "가족이 같은 안심 정보를 공유합니다",
    description: "형제자매가 같은 상태와 리포트를 보고 함께 판단할 수 있습니다.",
    icon: Users,
  },
];

const trustNotes = [
  "의료 진단이 아닌 안심 상태 분석입니다",
  "AI는 부모님의 평소 패턴과 비교해 변화 신호를 보여줍니다",
  "위험을 단정하지 않고, 확인이 필요한 신호를 알려줍니다",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <a href="/guide" className="text-sm font-bold text-[#6B7280] hover:text-[#2563EB]">
          서비스 둘러보기
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-16">
        <div className="fade-in max-w-[680px]">
          <p className="text-sm font-black text-[#2563EB]">AI 기반 부모님 안심 상태 분석 서비스</p>
          <h1 className="mt-5 max-w-[680px] text-4xl font-black leading-[1.13] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            부모님께 매일 전화하지 않아도,
            <br />
            AI가 생활 패턴 변화를 분석해
            <br />
            <span className="text-[#2563EB]">자녀에게 안심 상태를 알려드립니다.</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-lg font-semibold leading-8 text-[#4B5563]">
            오늘안부는 부모님의 간단한 안부 입력과 생활 패턴 변화를 바탕으로 안심 점수,
            변화 감지, AI 안심 리포트를 제공하는 가족 안심 서비스입니다.
          </p>
          <div className="mt-9 grid max-w-[440px] gap-3 sm:grid-cols-2">
            <a
              href="/app"
              className="flex min-h-14 items-center justify-center rounded-2xl bg-[#2563EB] px-5 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              자녀로 시작하기
            </a>
            <a
              href="/self"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-5 text-base font-black text-[#1F2937] transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              부모님 화면 미리보기
            </a>
          </div>
        </div>

        <div className="fade-in grid gap-5 lg:pl-2">
          <ParentStatusCard />
          <AiReportCard />
          <ChangeSignalCard />
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="max-w-[680px]">
            <p className="text-sm font-black text-[#2563EB]">서비스 이해</p>
            <h2 className="mt-4 text-4xl font-black tracking-normal">오늘안부는 이렇게 작동합니다</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="warm-card rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon size={22} aria-hidden />
                  </span>
                  <p className="mt-6 text-sm font-black text-[#2563EB]">{index + 1}단계</p>
                  <h3 className="mt-2 text-2xl font-black leading-8">{step.title}</h3>
                  <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
        <div className="max-w-[680px]">
          <p className="text-sm font-black text-[#2563EB]">핵심 가치</p>
          <h2 className="mt-4 text-4xl font-black tracking-normal">안심은 자주 확인하는 것보다 빨리 알아차리는 것입니다</h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="warm-card rounded-[24px] border border-[#E5E7EB] bg-white p-6"
              >
                <Icon size={25} className="text-[#2563EB]" aria-hidden />
                <h3 className="mt-6 text-2xl font-black leading-8">{value.title}</h3>
                <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#2563EB]">신뢰 설명</p>
            <h2 className="mt-4 text-4xl font-black tracking-normal">건강 진단이 아니라 가족을 위한 안심 신호입니다</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
              오늘안부는 질병을 판단하지 않습니다. 부모님의 평소 응답과 생활 루틴을 기준으로
              평소와 다른 신호를 가족에게 보여줍니다.
            </p>
          </div>
          <div className="grid gap-4">
            {trustNotes.map((note) => (
              <div key={note} className="flex items-start gap-4 rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                  <CheckCircle2 size={18} aria-hidden />
                </span>
                <p className="text-lg font-black leading-7">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 py-24 text-center sm:px-8">
        <div className="rounded-[28px] bg-[#EFF6FF] p-8 sm:p-10">
          <Bell size={32} className="mx-auto text-[#2563EB]" aria-hidden />
          <h2 className="mt-5 text-4xl font-black tracking-normal">우리 가족 안심 상태 확인 시작하기</h2>
          <p className="mx-auto mt-5 max-w-[520px] text-lg font-semibold leading-8 text-[#6B7280]">
            매일 확인하지 않아도, 평소와 다른 변화가 보이면 가족이 먼저 알 수 있습니다.
          </p>
          <a
            href="/app"
            className="mx-auto mt-9 flex min-h-14 max-w-[360px] items-center justify-center rounded-2xl bg-[#2563EB] px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
          >
            자녀로 시작하기
          </a>
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
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
          양호
        </span>
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
      <p className="mt-5 font-semibold leading-7 text-[#4B5563]">
        최근 생활 패턴에 큰 변화는 없습니다. 다만 활동량이 소폭 감소했습니다.
      </p>
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
      <p className="mt-5 text-sm font-black text-[#6B7280]">응답 시간</p>
      <p className="mt-2 text-3xl font-black">09:05 → 10:40</p>
      <p className="mt-5 rounded-2xl bg-[#FEF3C7] px-4 py-3 font-black text-[#92400E]">
        평소와 다른 생활 루틴 변화
      </p>
    </article>
  );
}
