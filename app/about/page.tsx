import Link from "next/link";
import { Activity, ArrowRight, HeartHandshake, ScanLine, ShieldCheck } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";
import { PRODUCT_COPY } from "@/lib/product-copy";

const differences = [
  ["기존 안부 확인", "그날의 대답만 확인", "괜찮다는 한마디에 의존"],
  ["오늘안부", "생활 흐름의 변화를 확인", "가족이 이해하기 쉬운 안심 신호로 요약"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[980px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="inline-flex rounded-full bg-[#EAF3E5] px-4 py-2 text-sm font-black text-[#2F6B46]">생활 변화 확인 서비스</p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">매일 상태를 묻지 않고,<br />평소와 다른 흐름을 확인합니다.</h1>
        <p className="mt-6 max-w-[760px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">{PRODUCT_COPY.parentBehavior} 현재 지원하는 질문 응답과 응답 시간대를 알아가며, 반복되는 변화가 확인되면 가족에게 이유와 행동 하나를 알려드립니다.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/start" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#E9652B] px-6 text-lg font-black text-white">우리 가족 시작하기 <ArrowRight size={20} /></Link><Link href="/features" className="inline-flex min-h-14 items-center rounded-2xl border-2 border-[#8FA98D] bg-white px-6 text-lg font-black">어떻게 살펴보나요?</Link></div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard icon={Activity} title="평소 생활을 알아갑니다" text="현재 지원하는 질문 응답과 응답 시간대를 바탕으로 개인의 평소 흐름을 알아갑니다." />
          <InfoCard icon={ScanLine} title="필요한 날에만 질문합니다" text="확인이 필요할 때만 짧고 쉬운 선택형 질문 하나를 드립니다." />
          <InfoCard icon={HeartHandshake} title="이유와 행동을 알려드립니다" text="무엇이 달라졌는지 설명하고 전화하기 같은 행동 하나를 제안합니다." />
        </div>

        <section className="mt-16 rounded-[24px] bg-[#203C2B] p-7 text-white sm:p-10">
          <ShieldCheck size={36} className="text-[#B9E1C0]" aria-hidden />
          <h2 className="mt-5 text-3xl font-black">건강 진단이 아닙니다.</h2>
          <p className="mt-4 max-w-[700px] text-lg font-semibold leading-8 text-white/75">오늘안부는 질병을 판단하거나 의료진을 대신하지 않습니다. 평소와 다른 생활 흐름을 놓치지 않고 가족이 한 번 더 안부를 물을 수 있도록 돕습니다.</p>
        </section>

        <section className="mt-10 rounded-[24px] border border-[#E2E8DE] bg-white p-7"><h2 className="text-2xl font-black">계속 사용하기 위한 보조 기능</h2><p className="mt-3 font-bold leading-7 text-[#68756F]">가족 소식, 안심이 안내, 체험용 농장은 핵심 변화 감지 흐름을 편하게 이어가도록 돕습니다.</p></section>

        <section className="mt-16">
          <h2 className="text-3xl font-black">기존 안부 확인과 무엇이 다른가요?</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {differences.map(([title, line1, line2], index) => (
              <article key={title} className={`rounded-[22px] border p-6 ${index === 1 ? "border-[#AFC6AE] bg-[#EEF5E9]" : "border-[#E3E6E1] bg-white"}`}>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-lg font-bold text-[#52635C]">{line1}</p>
                <p className="mt-2 font-semibold leading-7 text-[#68756F]">{line2}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14 text-center">
          <Link href="/features" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-[#A9BEA6] bg-white px-6 text-lg font-black text-[#40534B]">주요 기능 보기 <ArrowRight size={19} aria-hidden /></Link>
        </div>
      </section>
      <MobileStartCta />
    </main>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Activity; title: string; text: string }) {
  return <article className="rounded-[22px] border border-[#E2E8DE] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 font-semibold leading-7 text-[#68756F]">{text}</p></article>;
}

