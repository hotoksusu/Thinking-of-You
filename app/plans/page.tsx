import { Check, Clock3 } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const plans = [
  { name: "무료 체험", description: "오늘안부의 기본 흐름을 경험해요.", features: ["하루 한 질문 체험", "부모·가족 화면 체험", "가족 소식", "생활 변화 예시 확인"] },
  { name: "안심 구독", description: "실제 연결과 변화 알림을 준비하고 있어요.", features: ["실제 생활 데이터 연결", "개인 기준선 기반 변화 확인", "확인이 필요한 변화 알림", "가족 행동 제안", "주간 생활 요약", "가족 공동 확인"] },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">요금/플랜</p>
        <div className="mt-4 flex flex-wrap items-center gap-4"><h1 className="copy-title text-4xl font-black leading-tight sm:text-6xl">가족에게 맞는 안심을 준비하고 있어요.</h1><span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0E4] px-4 py-2 font-black text-[#D95423]"><Clock3 size={18} aria-hidden /> 준비 중</span></div>
        <p className="copy-body mt-6 max-w-[700px] text-lg font-bold leading-8 text-[#5E6C66]">지금은 모든 기능을 무료로 체험할 수 있어요. 요금은 정식 출시 전에 안내합니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]">
              <span className="rounded-full bg-[#F1F4EF] px-3 py-1 text-xs font-black text-[#68756F]">요금 준비 중</span>
              <h2 className="mt-5 text-2xl font-black">{plan.name}</h2>
              <p className="mt-3 min-h-14 font-semibold leading-7 text-[#68756F]">{plan.description}</p>
              <ul className="mt-5 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 font-bold"><Check size={18} className="text-[#52725B]" aria-hidden />{feature}</li>)}</ul>
              <button type="button" disabled className="mt-7 min-h-14 w-full cursor-not-allowed rounded-2xl bg-[#EEF0EC] px-5 font-black text-[#858C87]">가격 준비 중</button>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto mb-8 grid w-[calc(100%-2.5rem)] max-w-[1030px] gap-4 md:grid-cols-2"><article className="rounded-[24px] bg-white p-6"><h2 className="text-2xl font-black">전화와 카카오톡</h2><p className="mt-3 font-bold leading-7 text-[#68756F]">가족이 먼저 연락해 확인합니다. 매일 반복하면 서로 부담될 수 있습니다.</p></article><article className="rounded-[24px] bg-[#EAF3E5] p-6"><h2 className="text-2xl font-black">오늘안부</h2><p className="mt-3 font-bold leading-7 text-[#52635C]">평소 흐름을 알아가고 필요한 날에만 질문한 뒤, 이유와 행동 하나를 안내합니다.</p></article></section>
      <section className="mx-auto mb-8 w-[calc(100%-2.5rem)] max-w-[1030px] rounded-[24px] bg-white p-6 font-bold leading-8 text-[#52635C]"><h2 className="text-2xl font-black text-[#20302C]">알림은 꼭 필요할 때만</h2><p className="mt-3">하루의 작은 변화마다 알리지 않습니다. 단일 미응답이나 한 번의 부정 응답만으로 판단하지 않습니다.</p></section>
      <section className="mx-auto mb-16 w-[calc(100%-2.5rem)] max-w-[1030px] rounded-[26px] bg-[#EAF3E5] p-6 text-center sm:p-8"><h2 className="copy-title text-2xl font-black">매일 확인하지 않아도 달라진 날을 알려드려요.</h2></section>
      <MobileStartCta />
    </main>
  );
}

