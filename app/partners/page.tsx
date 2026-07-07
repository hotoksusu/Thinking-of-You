import Link from "next/link";
import { ArrowRight, Building2, HeartPulse, Landmark, ShieldPlus } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const partners = [
  { icon: Landmark, title: "지자체", text: "지역 어르신의 안부 흐름을 살피고 필요한 돌봄 연결을 돕습니다." },
  { icon: Building2, title: "요양기관", text: "일상 기록과 가족 소통을 한 흐름으로 이어 보호자 안심을 높입니다." },
  { icon: ShieldPlus, title: "보험사", text: "시니어 고객의 꾸준한 생활 참여와 예방적 안심 경험을 설계합니다." },
  { icon: HeartPulse, title: "시니어 케어 기관", text: "대상자별 생활 흐름을 이해하기 쉬운 요약으로 확인할 수 있습니다." },
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">기관 도입</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">생활 변화 데이터로<br />더 따뜻한 돌봄을 만듭니다.</h1>
        <p className="mt-6 max-w-[740px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">오늘안부는 어르신에게 복잡한 입력을 요구하지 않으면서 기관과 가족이 필요한 생활 흐름을 이해하도록 돕습니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {partners.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 font-semibold leading-7 text-[#68756F]">{text}</p></article>)}
        </div>

        <section className="mt-16 rounded-[26px] bg-[#203C2B] p-8 text-center text-white sm:p-12">
          <h2 className="text-3xl font-black">기관에 맞는 도입 방식을 함께 찾습니다.</h2>
          <p className="mx-auto mt-4 max-w-[650px] font-semibold leading-8 text-white/70">대상 규모, 운영 방식, 필요한 리포트 범위를 알려주시면 도입 시나리오를 제안해드립니다.</p>
          <Link href="mailto:hello@oneulanbu.kr?subject=오늘안부 기관 도입 문의" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-7 text-lg font-black text-[#203C2B]">도입 문의하기 <ArrowRight size={20} aria-hidden /></Link>
        </section>
      </section>
      <MobileStartCta />
    </main>
  );
}

