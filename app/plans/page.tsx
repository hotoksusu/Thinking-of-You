import { Check, Clock3 } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const plans = [
  { name: "안심 플랜", description: "부모님 한 분의 기본 안심 흐름", features: ["안심 점수", "미응답 알림", "변화 감지"] },
  { name: "가족 플랜", description: "여러 가족이 함께 확인하는 안심", features: ["가족 공동 확인", "AI 안심 리포트", "주간 변화 요약"] },
  { name: "프리미엄 케어", description: "더 긴 기간의 생활 흐름과 세심한 알림", features: ["월간 추이", "맞춤 리마인드", "우선 상담 지원"] },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">요금/플랜</p>
        <div className="mt-4 flex flex-wrap items-center gap-4"><h1 className="text-4xl font-black leading-tight sm:text-6xl">가족에게 맞는 안심을<br />준비하고 있습니다.</h1><span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0E4] px-4 py-2 font-black text-[#D95423]"><Clock3 size={18} aria-hidden /> 준비 중</span></div>
        <p className="mt-6 max-w-[700px] text-lg font-bold leading-8 text-[#5E6C66]">현재는 모든 기능을 체험할 수 있으며 실제 결제는 연결되어 있지 않습니다. 정식 출시 전에 요금과 구성을 다시 안내드리겠습니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]">
              <span className="rounded-full bg-[#F1F4EF] px-3 py-1 text-xs font-black text-[#68756F]">준비 중</span>
              <h2 className="mt-5 text-2xl font-black">{plan.name}</h2>
              <p className="mt-3 min-h-14 font-semibold leading-7 text-[#68756F]">{plan.description}</p>
              <ul className="mt-5 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 font-bold"><Check size={18} className="text-[#52725B]" aria-hidden />{feature}</li>)}</ul>
              <button type="button" disabled className="mt-7 min-h-14 w-full cursor-not-allowed rounded-2xl bg-[#EEF0EC] px-5 font-black text-[#858C87]">출시 준비 중</button>
            </article>
          ))}
        </div>
      </section>
      <MobileStartCta />
    </main>
  );
}

