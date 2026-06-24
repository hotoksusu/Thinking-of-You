import type { ReactNode } from "react";

const usageSteps = [
  "부모님을 등록합니다",
  "매일 안부 상태를 확인합니다",
  "AI가 평소와 다른 변화를 감지합니다",
  "가족이 함께 안심 상태를 공유합니다",
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
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-6 text-[#16201b] sm:px-7 sm:py-8">
      <div className="mx-auto w-full max-w-[1060px]">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="text-sm font-black text-[#1f8a5b]">
              오늘안부
            </a>
            <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal">
              서비스 둘러보기
            </h1>
          </div>
          <a
            href="/app"
            className="flex min-h-11 items-center justify-center rounded-lg bg-[#16201b] px-5 text-sm font-black text-white"
          >
            오늘안부 시작하기
          </a>
        </header>

        <section className="rounded-lg border border-[#dfe5dc] bg-white p-7 shadow-[0_22px_60px_rgba(24,36,29,0.10)] sm:p-9">
          <GuideLabel>오늘안부란?</GuideLabel>
          <h2 className="mt-3 text-3xl font-black tracking-normal">
            오늘안부는 안부 기록 앱이 아닙니다
          </h2>
          <p className="mt-5 max-w-[720px] text-lg font-semibold leading-8 text-[#66736b]">
            부모님의 식사, 약 복용, 컨디션, 응답 패턴을 바탕으로 AI가 평소와 다른 변화를
            감지하고 안심 상태를 알려주는 서비스입니다.
          </p>
          <p className="mt-6 rounded-lg bg-[#e5f5ee] px-5 py-4 text-xl font-black leading-8 text-[#1f8a5b]">
            오늘 식사를 했는지보다 부모님이 괜찮은지가 더 중요합니다.
          </p>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <GuideLabel>어떻게 사용하나요?</GuideLabel>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {usageSteps.map((step, index) => (
              <article key={step} className="min-h-36 rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] p-5">
                <span className="text-sm font-black text-[#1f8a5b]">{index + 1}단계</span>
                <h3 className="mt-3 text-xl font-black leading-7">{step}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-[#dfe5dc] bg-white p-6">
            <GuideLabel>안심 점수 예시</GuideLabel>
            <div className="mt-5 rounded-lg bg-[#10231b] p-6 text-white">
              <p className="text-sm font-black text-[#b9d5c8]">오늘의 안심 점수</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <strong className="text-6xl font-black leading-none">92점</strong>
                <span className="rounded-full bg-[#e5f5ee] px-4 py-2 text-sm font-black text-[#1f8a5b]">
                  양호
                </span>
              </div>
              <div className="mt-6 grid gap-2 text-sm font-bold text-[#dce9e3]">
                <p>최근 7일 응답률 100%</p>
                <p>식사·약 복용 정상</p>
                <p>최근 활동 안정적</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm font-black text-[#66736b]">
              <p>90~100 양호</p>
              <p>70~89 주의 필요</p>
              <p>0~69 확인 필요</p>
            </div>
          </article>

          <article className="rounded-lg border border-[#dfe5dc] bg-white p-6">
            <GuideLabel>AI 안심 리포트 예시</GuideLabel>
            <h2 className="mt-4 text-2xl font-black">최근 2주 동안</h2>
            <div className="mt-4 grid gap-2">
              {["응답 시간 변화 없음", "식사 패턴 안정적", "약 복용 안정적", "활동량 소폭 감소"].map(
                (item) => (
                  <p key={item} className="rounded-lg bg-[#f6f8f5] px-4 py-3 font-bold text-[#66736b]">
                    {item}
                  </p>
                ),
              )}
            </div>
            <div className="mt-5 rounded-lg bg-[#e5f5ee] p-5">
              <p className="text-sm font-black text-[#1f8a5b]">AI 의견</p>
              <p className="mt-2 font-bold leading-7 text-[#16201b]">
                현재 큰 이상은 없지만 활동량이 감소하고 있습니다. 이번 주에 한 번 통화를
                권장합니다.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <GuideLabel>가족 안심 네트워크</GuideLabel>
          <div className="mt-4 grid gap-5 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <h2 className="text-2xl font-black">가족이 함께 확인하는 안심 상태</h2>
              <p className="mt-4 text-lg font-semibold leading-8 text-[#66736b]">
                형제자매와 함께 부모님의 상태를 확인하고 최근 변화와 AI 리포트를 공유할 수
                있습니다.
              </p>
            </div>
            <div className="rounded-lg bg-[#f6f8f5] p-5">
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-4">
                <strong className="text-xl font-black">엄마</strong>
                <span className="rounded-full bg-[#e5f5ee] px-3 py-1 text-xs font-black text-[#1f8a5b]">
                  최근 상태 공유됨
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm font-black text-[#66736b]">
                {["장녀", "장남", "막내"].map((member) => (
                  <span key={member} className="rounded-lg bg-white px-3 py-3">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <GuideLabel>요금제</GuideLabel>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] p-5">
                <h3 className="text-xl font-black">{plan.name}</h3>
                {plan.price ? <p className="mt-2 font-black text-[#1f8a5b]">{plan.price}</p> : null}
                <ul className="mt-5 grid gap-2 text-sm font-bold text-[#66736b]">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#dfe5dc] bg-white p-6">
          <GuideLabel>기관 도입 문의</GuideLabel>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-black">기관 도입 문의</h2>
              <p className="mt-3 max-w-[620px] font-semibold leading-7 text-[#66736b]">
                지자체, 요양기관, 노인정, 보험사 대상 AI 안심 모니터링 도입을 준비하고
                있습니다.
              </p>
            </div>
            <button
              type="button"
              className="min-h-12 rounded-lg border border-[#dfe5dc] bg-[#fbfcfa] px-5 text-sm font-black text-[#66736b]"
              disabled
            >
              기관 도입 문의하기 준비 중
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function GuideLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm font-black text-[#1f8a5b]">{children}</p>;
}
