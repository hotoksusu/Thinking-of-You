import Link from "next/link";
import { ArrowRight, Building2, Landmark } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const partners = [
  { icon: Landmark, title: "지자체·복지기관", text: "반복 확인이 필요한 대상자를 우선 살펴볼 수 있도록 지원합니다." },
  { icon: Building2, title: "요양·돌봄기관", text: "보호자와 생활 변화를 간단히 공유할 수 있도록 지원합니다." },
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">기관 도입</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">가족 대상 MVP와<br />초기 파일럿을 준비합니다.</h1>
        <p className="mt-6 max-w-[740px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">기관 도입은 파일럿 협력 형태로 문의받고 있습니다. 현재 계약이나 운영 사례를 의미하지 않습니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {partners.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[22px] border border-[#E2E8DE] bg-white p-6"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 font-semibold leading-7 text-[#68756F]">{text}</p></article>)}
        </div>

        <section className="mt-16 rounded-[26px] bg-[#203C2B] p-8 text-center text-white sm:p-12">
          <h2 className="text-3xl font-black">초기 파일럿 협력을 문의해 주세요.</h2>
          <p className="mx-auto mt-4 max-w-[650px] font-semibold leading-8 text-white/70">대상 규모와 운영 방식을 함께 검토합니다.</p>
          <Link href="mailto:hello@oneulanbu.kr?subject=오늘안부 파일럿 협력 문의" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-7 text-lg font-black text-[#203C2B]">파일럿 문의하기 <ArrowRight size={20} aria-hidden /></Link>
        </section>
      </section>
      <MobileStartCta />
    </main>
  );
}

