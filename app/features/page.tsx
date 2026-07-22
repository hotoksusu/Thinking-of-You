import Link from "next/link";
import { Activity, ArrowRight, BarChart3, BellRing, CalendarRange, Clock3, FileHeart, ShieldCheck } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const features = [
  { icon: Activity, title: "평소 생활을 알아갑니다", text: "현재 지원하는 질문 응답과 응답 시간대를 바탕으로 개인의 평소 흐름을 알아갑니다." },
  { icon: ShieldCheck, title: "필요한 날에만 질문 하나", text: "작은 변화마다 묻지 않고 확인이 필요할 때만 쉬운 선택형 질문을 드립니다." },
  { icon: FileHeart, title: "가족에게 이유와 행동 안내", text: "무엇이 달라졌는지 쉬운 문장으로 설명하고 지금 필요한 행동 하나를 제안합니다." },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">주요 기능</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">생활 변화는 살피고,<br />가족에게는 쉽게 전합니다.</h1>
        <p className="mt-6 max-w-[720px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">수치와 알림을 늘어놓기보다 가족이 지금 무엇을 알면 되는지 먼저 보여드립니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-3 font-semibold leading-7 text-[#68756F]">{text}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-[22px] bg-[#EEF5E9] p-5 font-bold leading-7 text-[#52635C]">장기 리포트, 자동 움직임 연동, 주간 요약은 준비 중이며 현재 기능처럼 표시하지 않습니다.</p>

        <section className="mt-16 grid gap-6 rounded-[26px] bg-[#203C2B] p-7 text-white md:grid-cols-[1fr_auto] md:items-center sm:p-10">
          <div><BarChart3 size={34} className="text-[#B9E1C0]" aria-hidden /><h2 className="mt-4 text-3xl font-black">보고서보다 먼저, 안심을 전합니다.</h2><p className="mt-3 max-w-[680px] font-semibold leading-8 text-white/70">분석은 뒤에서 작동하고, 화면에는 가족이 이해하기 쉬운 변화와 다음 행동만 남깁니다.</p></div>
          <Link href="/guide" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-black text-[#203C2B]">이용 방법 보기 <ArrowRight size={19} aria-hidden /></Link>
        </section>
      </section>
      <MobileStartCta />
    </main>
  );
}

