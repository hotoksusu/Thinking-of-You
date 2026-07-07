import Link from "next/link";
import { Activity, ArrowRight, BarChart3, BellRing, CalendarRange, Clock3, FileHeart, ShieldCheck } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const features = [
  { icon: ShieldCheck, title: "안심 점수", text: "최근 생활 흐름을 한눈에 이해할 수 있도록 쉬운 상태로 보여줍니다." },
  { icon: FileHeart, title: "AI 안심 리포트", text: "가족이 알아야 할 변화와 평소 흐름을 짧고 따뜻한 문장으로 정리합니다." },
  { icon: Activity, title: "변화 감지", text: "응답 시간, 활동, 연락 흐름이 평소와 달라지는지 비교해 살펴봅니다." },
  { icon: Clock3, title: "미응답 분석", text: "한 번의 미응답보다 반복되거나 길어지는 흐름을 중심으로 확인합니다." },
  { icon: BellRing, title: "리마인드 알림", text: "부담스럽지 않은 시간에 안부를 남길 수 있도록 부드럽게 알려드립니다." },
  { icon: CalendarRange, title: "일간·주간·월간 추이", text: "하루의 기록을 넘어 생활 흐름이 어떻게 이어지는지 기간별로 보여줍니다." },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">주요 기능</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">생활 변화는 살피고,<br />가족에게는 쉽게 전합니다.</h1>
        <p className="mt-6 max-w-[720px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">수치와 알림을 늘어놓기보다 가족이 지금 무엇을 알면 되는지 먼저 보여드립니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-3 font-semibold leading-7 text-[#68756F]">{text}</p>
            </article>
          ))}
        </div>

        <section className="mt-16 grid gap-6 rounded-[26px] bg-[#203C2B] p-7 text-white md:grid-cols-[1fr_auto] md:items-center sm:p-10">
          <div><BarChart3 size={34} className="text-[#B9E1C0]" aria-hidden /><h2 className="mt-4 text-3xl font-black">보고서보다 먼저, 안심을 전합니다.</h2><p className="mt-3 max-w-[680px] font-semibold leading-8 text-white/70">분석은 뒤에서 작동하고, 화면에는 가족이 이해하기 쉬운 변화와 다음 행동만 남깁니다.</p></div>
          <Link href="/guide" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-black text-[#203C2B]">이용 방법 보기 <ArrowRight size={19} aria-hidden /></Link>
        </section>
      </section>
      <MobileStartCta />
    </main>
  );
}

