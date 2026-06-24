import {
  Activity,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Smile,
  Users,
} from "lucide-react";
import { familyEncouragements } from "@/lib/insights";

const changeSignals = [
  "기록 참여가 줄어듦",
  "외부 활동 표현이 줄어듦",
  "하루 흐름이 달라짐",
  "긍정 표현이 바뀜",
];

const heroProofs = ["디지털 하루 기록", "AI 변화 분석", "가족 안심 리포트", "생활 패턴 감지"];

const trendCards = [
  { title: "일간", description: "오늘의 한 순간 기록" },
  { title: "주간", description: "최근 7일 기록 참여·활력 변화" },
  { title: "월간", description: "최근 30일 생활 패턴 추이" },
];

const monthlyScores = [92, 91, 90, 88, 89];

const reminderCards = [
  { time: "오전 10:00", message: "오늘 하루를 표현한다면?" },
  { time: "오후 2:00", message: "오늘 가장 기억에 남는 것은?" },
  { time: "저녁 7:00", message: "가족 리포트에 변화만 정리" },
];

const premiumLocks = [
  { title: "최근 30일 변화 분석", plan: "안심 플랜" },
  { title: "주간 AI 안심 리포트", plan: "가족 플랜" },
  { title: "생활 변화 알림", plan: "프리미엄 케어" },
];

const comparisonItems = [
  {
    title: "기존 안부 확인",
    tone: "muted",
    items: ["상태를 직접 묻기", "매일 체크 부담", "원시 기록 확인", "가족이 직접 판단"],
  },
  {
    title: "오늘안부",
    tone: "brand",
    items: ["하루 한 순간 기록", "생활 패턴 변화 감지", "AI 안심 리포트", "가족에게 요약 제공", "권장 행동 제안"],
  },
];

const analysisItems = [
  { title: "기록 참여도", description: "하루 기록을 남기는 리듬의 변화", icon: Clock3 },
  { title: "생활 활력", description: "평소와 다른 하루 표현의 변화", icon: HeartHandshake },
  { title: "활동 표현", description: "산책, 외출, 집에서 쉼 같은 표현 흐름", icon: Activity },
  { title: "관심사 변화", description: "커피, TV, 책, 가족 등 반복 주제 변화", icon: MessageCircle },
  { title: "정서 표현", description: "맑음, 보통, 지침 같은 하루 표현 변화", icon: Smile },
];

const trustNotes = [
  "의료 진단이 아닌 안심 상태 분석입니다.",
  "AI는 원시 기록을 감시하지 않고 평소 생활 패턴과의 차이를 정리합니다.",
  "위험을 단정하지 않고, 관심 있게 살펴볼 변화만 알려줍니다.",
];

const landingFaqs = [
  {
    question: "부모님이 매일 답변해야 하나요?",
    answer:
      "아닙니다. 오늘안부는 매일 긴 답변을 요구하지 않습니다. 간단한 기록이나 선택만으로 충분하며, 응답이 없더라도 AI는 장기적인 변화 패턴을 중심으로 분석합니다.",
  },
  {
    question: "부모님을 감시하는 서비스인가요?",
    answer:
      "아닙니다. 오늘안부는 감시가 아니라 관심에 가깝습니다. 가족이 응원과 안부를 전하고, AI는 기록 속 변화를 분석해 가족에게 안심 리포트를 제공합니다.",
  },
  {
    question: "부모님이 스마트폰을 잘 사용하지 못해도 괜찮나요?",
    answer:
      "괜찮습니다. 오늘안부는 복잡한 입력이나 긴 작성이 필요하지 않습니다. 하루를 표현하는 간단한 선택만으로도 충분히 사용할 수 있습니다.",
  },
  {
    question: "왜 가족 메시지 기능이 있나요?",
    answer:
      "많은 부모님들은 상태를 확인받는 것보다 관심을 받는 것을 더 좋아합니다. 오늘안부는 안부 확인보다 관심과 연결을 중요하게 생각합니다.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-black text-[#2563EB]">
          오늘안부
        </a>
        <a href="/guide" className="text-sm font-bold text-[#6B7280] transition hover:text-[#2563EB]">
          서비스 둘러보기 →
        </a>
      </header>

      <section className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-16">
        <div className="fade-in max-w-[680px]">
          <p className="text-sm font-black text-[#2563EB]">디지털 일상 기록 기반 AI 안심 서비스</p>
          <h1 className="mt-8 max-w-[680px] text-[2.7rem] font-black leading-[1.2] tracking-[-0.01em] sm:text-[4rem] lg:text-[4.85rem]">
            <span className="block">오늘의 하루가</span>
            <span className="mt-5 block">쌓이면</span>
            <span className="mt-6 block">
              <span className="text-[#2563EB]">안심</span>이 됩니다.
            </span>
          </h1>
          <p className="mt-10 max-w-[580px] text-lg font-semibold leading-8 text-[#4B5563]">
            시니어는 하루의 한 순간만 가볍게 남기고, AI는 그 기록 속 변화를 분석합니다.
          </p>
          <p className="mt-5 max-w-[540px] text-base font-semibold leading-7 text-[#6B7280]">
            가족과 기관은 원시 기록이 아니라 AI가 정리한 생활 패턴 변화 리포트를 받습니다.
          </p>
          <div className="mt-9 grid max-w-[520px] gap-3 sm:grid-cols-2">
            <a
              href="/app"
              className="flex min-h-14 items-center justify-center rounded-2xl bg-[#2563EB] px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              하루 기록 체험하기
            </a>
            <a
              href="/app?registered=1"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-base font-black text-[#1F2937] transition hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              AI 변화 리포트 보기
            </a>
          </div>
          <div className="mt-6 flex max-w-[520px] flex-wrap gap-2">
            {heroProofs.map((proof) => (
              <span
                key={proof}
                className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2 text-sm font-black text-[#2563EB]"
              >
                {proof}
              </span>
            ))}
          </div>
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
              중요한 것은
              <br />
              하루의 기록이 아니라 변화입니다.
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
              오늘안부는 가벼운 일상 기록이 쌓일 때 나타나는 변화를 AI가 먼저 감지해 가족에게 안심 리포트로 알려드립니다.
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
            관리받는 느낌을 넘어
            <br />
            하루 기록으로
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

      <section className="bg-[#FFF7ED]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-[620px]">
            <p className="text-sm font-black text-[#2563EB]">가족의 관심 표현</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              멀리 있어도
              <br />
              관심은 가까이 전할 수 있습니다.
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
              오늘안부는 단순히 상태를 확인하는 서비스가 아닙니다. 가족이 보내는 작은 관심과 응원이 부모님의 하루에 따뜻하게 전달됩니다.
            </p>
            <p className="mt-4 text-lg font-semibold leading-8 text-[#6B7280]">
              AI는 그 기록 속 변화를 살펴보고 가족에게 안심 리포트를 제공합니다.
            </p>
          </div>
          <div className="grid gap-4">
            {familyEncouragements.map((message) => (
              <article
                key={message.id}
                className="warm-card rounded-[26px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-black text-[#2563EB]">
                    {message.icon} {message.sender}의 응원
                  </span>
                  <span className="text-sm font-black text-[#9CA3AF]">답장 없어도 괜찮아요</span>
                </div>
                <p className="mt-5 text-xl font-black leading-8 text-[#1F2937]">{message.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="max-w-[620px]">
            <p className="text-sm font-black text-[#2563EB]">추이 분석</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              하나의 기록만 보지 않고
              <br />
              흐름의 변화를 봅니다
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
              일간·주간·월간 추이로 기록 참여도, 생활 활력, 관심사 변화를 한눈에 확인합니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trendCards.map((card) => (
                <article key={card.title} className="rounded-[22px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-black text-[#2563EB]">{card.title}</p>
                  <h3 className="mt-3 text-lg font-black leading-7">{card.description}</h3>
                </article>
              ))}
            </div>
          </div>
          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <h3 className="text-xl font-black">최근 30일 생활 안심 점수</h3>
            <div className="mt-5 flex h-32 items-end gap-3 rounded-2xl bg-[#F9FAFB] p-4">
              {monthlyScores.map((score, index) => (
                <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-[#2563EB]" style={{ height: `${score}%` }} />
                  <span className="text-xs font-black text-[#6B7280]">{score}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-2xl font-black leading-9">92 → 91 → 90 → 88 → 89</p>
            <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
              <p className="text-sm font-black text-[#2563EB]">AI 분석</p>
              <p className="mt-2 font-black leading-7">최근 4주간 생활 안심 점수는 안정권입니다. 외부 활동 표현만 소폭 줄었습니다.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-[620px]">
          <p className="text-sm font-black text-[#2563EB]">리마인드</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            입력을 잊어도
            <br />
            부드럽게 다시 알려드립니다
          </h2>
          <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
            하루 기록은 부담 없이, 정해진 시간에 대화처럼 부드럽게 안내합니다.
          </p>
        </div>
        <div className="grid gap-4">
          {reminderCards.map((card, index) => (
            <article key={card.time} className="warm-card rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-black text-[#2563EB]">
                  {index + 1}차 알림
                </span>
                <span className="text-sm font-black text-[#6B7280]">{card.time}</span>
              </div>
              <h3 className="mt-4 text-xl font-black">{card.message}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-[620px]">
            <p className="text-sm font-black text-[#2563EB]">기록 공백 분석</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              기록이 줄어드는 것도
              <br />
              변화의 신호입니다
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-[#6B7280]">
              단순히 하루 기록이 비었다고 판단하지 않습니다. 평소 기록 리듬과 비교해 생활 변화 가능성을 분석합니다.
            </p>
          </div>
          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F9FAFB] p-5">
                <p className="text-sm font-black text-[#6B7280]">평소 기록 참여율</p>
                <p className="mt-2 text-4xl font-black">95%</p>
              </div>
              <div className="rounded-2xl bg-[#FEF3C7] p-5">
                <p className="text-sm font-black text-[#92400E]">최근 7일 기록 참여율</p>
                <p className="mt-2 text-4xl font-black text-[#92400E]">78%</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
              <p className="text-sm font-black text-[#2563EB]">AI 분석</p>
              <p className="mt-2 font-black leading-7">
                최근 기록 참여가 평소보다 조금 줄었습니다. 생활 리듬 변화 가능성이 있어 가벼운 대화를 권장합니다.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
        <div className="max-w-[720px]">
          <p className="text-sm font-black text-[#2563EB]">유료 가치</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            더 깊은 변화 분석은
            <br />
            필요한 순간 열립니다
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {premiumLocks.map((item) => (
            <article key={item.title} className="warm-card rounded-[24px] border border-[#DBEAFE] bg-[#EFF6FF] p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
                <LockKeyhole size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-xl font-black leading-8">{item.title}</h3>
              <p className="mt-3 font-bold text-[#4B5563]">🔒 {item.plan}에서 확인 가능</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#2563EB] px-6 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)]"
        >
          <CreditCard size={18} aria-hidden />
          안심 플랜 보기
        </button>
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
            오늘안부는 질병을 판단하지 않습니다. 시니어가 남긴 하루 기록과 생활 신호를 기준으로 평소와 다른 변화를 가족에게
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

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8">
          <div className="max-w-[680px]">
            <p className="text-sm font-black text-[#2563EB]">FAQ</p>
            <h2 className="mt-4 text-4xl font-black tracking-normal">
              관심이 쌓여
              <br />
              안심이 되는 방식
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {landingFaqs.map((faq) => (
              <article key={faq.question} className="rounded-[24px] bg-[#F9FAFB] p-6">
                <h3 className="text-xl font-black leading-8">{faq.question}</h3>
                <p className="mt-4 font-semibold leading-7 text-[#6B7280]">{faq.answer}</p>
              </article>
            ))}
          </div>
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
                지자체, 복지기관, 보험사, 요양기관 대상 생활 패턴 변화 리포트 도입을 준비하고 있습니다.
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
            <strong className="text-xl font-black">생활 흐름</strong>
          </div>
        </div>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">양호</span>
      </div>
      <div className="mt-8">
        <p className="text-sm font-black text-[#2563EB]">생활 안심 점수</p>
        <p className="mt-2 text-6xl font-black leading-none">92점</p>
        <p className="mt-4 font-bold text-[#6B7280]">최근 특별한 변화 없음</p>
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
        <h2 className="text-xl font-black">AI 변화 리포트</h2>
      </div>
      <div className="mt-5 grid gap-2 font-semibold leading-7 text-[#4B5563]">
        <p>최근 기록 참여도는 안정적입니다.</p>
        <p>다만 외부 활동 관련 표현이 소폭 줄었습니다.</p>
      </div>
      <p className="mt-4 rounded-2xl bg-[#EFF6FF] px-4 py-3 font-black text-[#2563EB]">
        이번 주 부담 없는 근황 대화를 권장합니다.
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
          <p className="text-sm font-black text-[#6B7280]">기록 참여</p>
          <p className="mt-2 text-3xl font-black">꾸준함 → 소폭 감소</p>
        </div>
        <div>
          <p className="text-sm font-black text-[#6B7280]">하루 표현</p>
          <p className="mt-2 text-2xl font-black">산책 → 집에서 쉼</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-[#FEF3C7] px-4 py-3">
        <p className="text-sm font-black text-[#92400E]">AI 분석</p>
        <p className="mt-2 font-black leading-7 text-[#92400E]">
          최근 2주간 외부 활동 관련 응답이 감소했습니다. 생활 패턴 변화 여부를 확인해보는 것을 권장합니다.
        </p>
      </div>
    </article>
  );
}
