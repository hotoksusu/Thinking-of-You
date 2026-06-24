import type { ReactNode } from "react";
import { Brain, Building2, HeartHandshake, MessageCircle, ShieldCheck, TrendingDown, Users } from "lucide-react";

const usageSteps = [
  { title: "부모님을 등록합니다", icon: HeartHandshake },
  { title: "매일 안부 상태를 확인합니다", icon: MessageCircle },
  { title: "AI가 평소와 다른 변화를 감지합니다", icon: Brain },
  { title: "가족이 함께 안심 상태를 공유합니다", icon: Users },
];

const plans = [
  {
    name: "무료",
    price: "",
    items: ["부모님 1명", "최근 기록 확인"],
  },
  {
    name: "안심 플랜",
    price: "월 4,900원",
    items: ["자동 안부 요청", "미응답 알림", "안심 점수", "변화 감지"],
  },
  {
    name: "가족 플랜",
    price: "월 9,900원",
    items: ["최대 5명", "가족 공유", "AI 안심 리포트", "패턴 분석"],
  },
  {
    name: "프리미엄 케어",
    price: "월 19,900원",
    items: ["AI 전화 안부 확인", "주간 안심 리포트", "이상 패턴 분석", "긴급 연락망"],
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#EFF6FF] px-4 py-6 text-[#1F2937] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-[1120px]">
        <header className="fade-in mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <a href="/" className="text-sm font-black text-[#2563EB]">
              오늘안부
            </a>
            <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal">
              서비스 둘러보기
            </h1>
          </div>
          <a
            href="/app"
            className="flex min-h-12 items-center justify-center rounded-[20px] bg-[#2563EB] px-5 text-sm font-black text-white shadow-[0_14px_34px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
          >
            오늘안부 시작하기
          </a>
        </header>

        <section className="warm-card fade-in rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(37,99,235,0.14)] sm:p-9">
          <GuideLabel>오늘안부란?</GuideLabel>
          <div className="mt-4 grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-normal">
                오늘안부는 안부 기록 앱이 아닙니다
              </h2>
              <p className="mt-5 max-w-[720px] text-lg font-semibold leading-8 text-[#4B5563]">
                부모님의 식사, 약 복용, 컨디션, 응답 패턴을 바탕으로 AI가 평소와 다른 변화를
                감지하고 안심 상태를 알려주는 서비스입니다.
              </p>
              <p className="mt-6 rounded-[24px] bg-[#EFF6FF] px-5 py-4 text-xl font-black leading-8 text-[#2563EB]">
                오늘 식사를 했는지보다 부모님이 괜찮은지가 더 중요합니다.
              </p>
            </div>
            <div className="rounded-[28px] bg-[#FDE047] p-5 shadow-[0_18px_44px_rgba(253,224,71,0.26)]">
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-sm font-black text-[#2563EB]">AI 안심 요약</p>
                <p className="mt-3 text-4xl font-black">괜찮아요</p>
                <p className="mt-3 font-bold text-[#4B5563]">최근 이상 신호 없음</p>
                <div className="mt-5 grid gap-2">
                  {["식사 확인", "복약 안정", "응답 정상"].map((item) => (
                    <p key={item} className="rounded-[18px] bg-[#EFF6FF] px-4 py-3 text-sm font-black">
                      <span className="text-[#22C55E]">✓</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
          <GuideLabel>어떻게 사용하나요?</GuideLabel>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {usageSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="warm-card min-h-40 rounded-[24px] bg-[#F8FBFF] p-5 shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(37,99,235,0.14)]">
                  <span className="flex size-11 items-center justify-center rounded-[18px] bg-[#2563EB] text-white">
                    <Icon size={21} aria-hidden />
                  </span>
                  <p className="mt-4 text-sm font-black text-[#2563EB]">{index + 1}단계</p>
                  <h3 className="mt-2 text-xl font-black leading-7">{step.title}</h3>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
            <GuideLabel>안심 점수 예시</GuideLabel>
            <div className="mt-5 rounded-[28px] bg-[#2563EB] p-6 text-white shadow-[0_18px_44px_rgba(37,99,235,0.24)]">
              <p className="text-sm font-black text-blue-100">오늘의 안심 점수</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <strong className="text-6xl font-black leading-none">92점</strong>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#22C55E]">
                  양호
                </span>
              </div>
              <p className="mt-4 rounded-[18px] bg-white/15 px-4 py-3 font-bold">최근 이상 신호 없음</p>
              <div className="mt-4 grid gap-2 text-sm font-bold text-blue-50">
                <p>최근 7일 응답률 100%</p>
                <p>식사·약 복용 정상</p>
                <p>최근 활동 안정적</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm font-black text-[#4B5563]">
              <p className="rounded-[18px] bg-[#ECFDF5] px-3 py-3">90~100 양호</p>
              <p className="rounded-[18px] bg-[#FEFCE8] px-3 py-3">70~89 주의</p>
              <p className="rounded-[18px] bg-[#FEF2F2] px-3 py-3">0~69 확인</p>
            </div>
          </article>

          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
            <GuideLabel>AI 안심 리포트 예시</GuideLabel>
            <div className="mt-5 rounded-[28px] bg-[#F8FBFF] p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-12 items-center justify-center rounded-[20px] bg-[#2563EB] text-white">
                  <Brain size={23} aria-hidden />
                </span>
                <div>
                  <h2 className="text-2xl font-black">최근 2주 동안</h2>
                  <p className="mt-1 font-bold text-[#4B5563]">생활 흐름이 안정적으로 유지되고 있어요.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {["응답 시간 변화 없음", "식사 패턴 안정적", "약 복용 안정적", "활동량 소폭 감소"].map(
                  (item) => (
                    <p key={item} className="rounded-[18px] bg-white px-4 py-3 font-bold text-[#4B5563]">
                      {item}
                    </p>
                  ),
                )}
              </div>
              <div className="mt-5 rounded-[22px] bg-[#EFF6FF] p-5">
                <p className="text-sm font-black text-[#2563EB]">AI 의견</p>
                <p className="mt-2 font-bold leading-7 text-[#1F2937]">
                  현재 큰 이상은 없지만 활동량이 감소하고 있습니다. 이번 주에 한 번 통화를
                  권장합니다.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
            <GuideLabel>변화 감지 카드</GuideLabel>
            <div className="mt-5 rounded-[28px] bg-[#FEFCE8] p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-[20px] bg-[#FDE047] text-[#1F2937]">
                  <TrendingDown size={23} aria-hidden />
                </span>
                <div>
                  <h2 className="text-2xl font-black">생활 패턴 변화 감지</h2>
                  <p className="mt-1 font-bold text-[#4B5563]">응답시간 09:05 → 10:40</p>
                </div>
              </div>
              <p className="mt-5 rounded-[22px] bg-white px-5 py-4 font-bold leading-7 text-[#1F2937]">
                평소보다 응답이 늦어졌습니다. 반복되면 가족에게 알림을 보냅니다.
              </p>
            </div>
          </article>

          <article className="warm-card rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
            <GuideLabel>가족 안심 네트워크</GuideLabel>
            <h2 className="mt-4 text-2xl font-black">가족이 함께 확인하는 안심 상태</h2>
            <p className="mt-3 font-semibold leading-7 text-[#4B5563]">
              형제자매와 함께 부모님의 상태를 확인하고 최근 변화와 AI 리포트를 공유할 수 있습니다.
            </p>
            <div className="mt-5 rounded-[28px] bg-[#F8FBFF] p-5">
              <div className="flex items-center justify-between rounded-[22px] bg-white px-4 py-4">
                <strong className="text-xl font-black">엄마</strong>
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-black text-[#22C55E]">
                  상태 공유됨
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm font-black text-[#4B5563]">
                {["👩 장녀", "👨 장남", "👩 막내"].map((member) => (
                  <span key={member} className="rounded-[18px] bg-white px-3 py-4">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
          <GuideLabel>요금제</GuideLabel>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} className="warm-card rounded-[24px] bg-[#F8FBFF] p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(37,99,235,0.14)]">
                <h3 className="text-xl font-black">{plan.name}</h3>
                {plan.price ? <p className="mt-2 font-black text-[#2563EB]">{plan.price}</p> : null}
                <ul className="mt-5 grid gap-2 text-sm font-bold text-[#4B5563]">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="text-[#22C55E]">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
          <GuideLabel>기관 도입 문의</GuideLabel>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-[18px] bg-[#EFF6FF] text-[#2563EB]">
                  <Building2 size={21} aria-hidden />
                </span>
                <h2 className="text-2xl font-black">기관 도입 문의</h2>
              </div>
              <p className="mt-3 max-w-[620px] font-semibold leading-7 text-[#4B5563]">
                지자체, 요양기관, 노인정, 보험사 대상 AI 안심 모니터링 도입을 준비하고
                있습니다.
              </p>
            </div>
            <button
              type="button"
              className="min-h-12 rounded-[20px] border border-[#BFDBFE] bg-[#EFF6FF] px-5 text-sm font-black text-[#2563EB]"
              disabled
            >
              기관 도입 문의하기 준비 중
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-[#2563EB] p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.20)]">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} aria-hidden />
            <h2 className="text-2xl font-black">안심하고 이용하세요</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["개인정보 암호화", "가족만 공유 가능", "언제든 삭제 가능", "안전한 데이터 관리"].map((item) => (
              <p key={item} className="rounded-[20px] bg-white/15 px-4 py-4 font-black">
                ✓ {item}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function GuideLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm font-black text-[#2563EB]">{children}</p>;
}
