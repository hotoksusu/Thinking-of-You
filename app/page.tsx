import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Pill,
  ShieldCheck,
  Utensils,
  Users,
} from "lucide-react";

const aiSignals = [
  { title: "응답 패턴", description: "응답 시간과 미응답 흐름", icon: Clock3 },
  { title: "식사 상태", description: "식사 확인과 누락 변화", icon: Utensils },
  { title: "약 복용", description: "복용 확인과 지연 신호", icon: Pill },
  { title: "활동 변화", description: "평소 대비 활동량 변화", icon: Activity },
];

const trustItems = [
  { title: "가족만 확인 가능", icon: Users },
  { title: "데이터 암호화", icon: LockKeyhole },
  { title: "언제든 삭제 가능", icon: CheckCircle2 },
  { title: "안전한 보관", icon: ShieldCheck },
];

const plans = [
  { name: "무료", price: "0원", items: ["부모님 1명", "최근 기록 확인"] },
  { name: "안심 플랜", price: "월 4,900원", items: ["자동 안부 요청", "미응답 알림", "안심 점수", "변화 감지"] },
  { name: "가족 플랜", price: "월 9,900원", items: ["최대 5명", "가족 공유", "AI 안심 리포트", "패턴 분석"] },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <a href="/app" className="text-sm font-bold text-[#6B7280] hover:text-[#2563EB]">
          카카오톡으로 시작하기
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-[1120px] gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-32 lg:pt-24">
        <div className="fade-in">
          <p className="text-sm font-black text-[#2563EB]">AI 안심 서비스</p>
          <h1 className="mt-5 text-[3rem] font-black leading-[1.08] tracking-normal sm:text-[4.8rem]">
            부모님의 작은 변화를
            <br />
            <span className="text-[#2563EB]">AI가 먼저 알려드립니다</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-xl font-semibold leading-9 text-[#4B5563]">
            안부를 기록하는 것이 아니라 평소와 다른 신호를 발견해 부모님의 안심 상태를
            알려드립니다.
          </p>
          <div className="mt-10 grid max-w-[420px] gap-3 sm:grid-cols-2">
            <a
              href="/app"
              className="flex min-h-14 items-center justify-center rounded-2xl bg-[#2563EB] px-5 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              오늘안부 시작하기
            </a>
            <a
              href="/guide"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-5 text-base font-black text-[#1F2937] transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              서비스 둘러보기
            </a>
          </div>
        </div>

        <div className="fade-in grid gap-5">
          <StatusExample />
          <div className="grid gap-5 md:grid-cols-2">
            <AiReportExample />
            <ChangeExample />
          </div>
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#2563EB]">실제 안심점수 예시</p>
            <h2 className="mt-4 text-4xl font-black tracking-normal">숫자보다 중요한 건 변화입니다</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
              점수, 리포트, 변화 감지를 한 화면에서 확인해 가족이 더 빨리 판단할 수 있게 합니다.
            </p>
          </div>
          <StatusExample large />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
        <h2 className="text-4xl font-black tracking-normal">왜 오늘안부인가요?</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <CompareCard
            title="기존 안부 확인"
            muted
            items={["응답 여부 확인", "기록 확인", "직접 판단"]}
          />
          <div className="hidden items-center px-2 text-[#9CA3AF] lg:flex">
            <ArrowRight size={28} aria-hidden />
          </div>
          <CompareCard
            title="오늘안부"
            items={["안심 점수", "변화 감지", "AI 안심 리포트", "권장 행동 제안"]}
          />
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="max-w-[620px]">
            <h2 className="text-4xl font-black tracking-normal">AI는 무엇을 분석하나요?</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
              평소와 다른 변화가 감지되면 AI가 먼저 알려드립니다.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aiSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article key={signal.title} className="warm-card rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-black">{signal.title}</h3>
                  <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{signal.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="text-4xl font-black tracking-normal">가족이 함께 보는 안심 상태</h2>
          <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
            부모님의 최근 변화와 AI 리포트를 가족이 함께 확인하고 공유할 수 있습니다.
          </p>
        </div>
        <div className="rounded-[28px] bg-[#F9FAFB] p-6">
          <div className="rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <strong className="text-2xl font-black">엄마</strong>
              <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
                상태 공유됨
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm font-black text-[#4B5563]">
              {["장녀", "장남", "막내"].map((member) => (
                <span key={member} className="rounded-2xl bg-[#F3F4F6] px-3 py-4">
                  {member}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <h2 className="text-4xl font-black tracking-normal">요금제</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className="warm-card rounded-[24px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-3 text-lg font-black text-[#2563EB]">{plan.price}</p>
                <ul className="mt-7 grid gap-3 font-semibold text-[#4B5563]">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="text-[#22C55E]">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
        <div className="rounded-[28px] bg-[#F3F4F6] p-6 sm:p-8">
          <h2 className="text-3xl font-black tracking-normal">안심하고 이용하세요</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 font-black text-[#4B5563]">
                  <Icon size={19} className="text-[#2563EB]" aria-hidden />
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-28 text-center sm:px-8">
        <h2 className="text-4xl font-black tracking-normal">부모님의 변화를 먼저 확인하세요</h2>
        <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
          안심 점수와 AI 리포트로 가족의 걱정을 줄입니다.
        </p>
        <a
          href="/app"
          className="mx-auto mt-9 flex min-h-14 max-w-[360px] items-center justify-center rounded-2xl bg-[#2563EB] px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          오늘안부 시작하기
        </a>
      </section>
    </main>
  );
}

function StatusExample({ large = false }: { large?: boolean }) {
  return (
    <article className={`warm-card rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ${large ? "lg:p-8" : ""}`}>
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
        <p className="text-sm font-black text-[#2563EB]">안심점수</p>
        <p className="mt-2 text-6xl font-black leading-none">92점</p>
        <p className="mt-4 font-bold text-[#6B7280]">최근 이상 신호 없음</p>
      </div>
    </article>
  );
}

function AiReportExample() {
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

function ChangeExample() {
  return (
    <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <h2 className="text-xl font-black">최근 변화 감지</h2>
      <p className="mt-5 text-sm font-black text-[#6B7280]">응답시간</p>
      <p className="mt-2 text-3xl font-black">09:05 → 10:40</p>
      <p className="mt-5 rounded-2xl bg-[#FEF3C7] px-4 py-3 font-black text-[#92400E]">
        생활 패턴 변화 감지
      </p>
    </article>
  );
}

function CompareCard({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <article className={`rounded-[28px] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${muted ? "bg-[#F9FAFB]" : "bg-[#EFF6FF]"}`}>
      <h3 className="text-2xl font-black">{title}</h3>
      <ul className="mt-7 grid gap-3 font-semibold text-[#4B5563]">
        {items.map((item) => (
          <li key={item}>
            <span className={muted ? "text-[#9CA3AF]" : "text-[#2563EB]"}>✓</span> {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
