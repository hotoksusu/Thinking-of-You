import Link from "next/link";
import { Activity, ArrowRight, HeartHandshake, ScanLine, ShieldCheck } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const differences = [
  ["기존 안부 확인", "그날의 대답만 확인", "괜찮다는 한마디에 의존"],
  ["오늘안부", "생활 흐름의 변화를 확인", "가족이 이해하기 쉬운 안심 신호로 요약"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[980px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-black text-[#E9652B]">서비스 소개</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">중요한 건 안부가 아니라<br />변화입니다.</h1>
        <p className="mt-6 max-w-[700px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">오늘안부는 부모님의 작은 생활 신호를 살펴 가족이 이해하기 쉬운 안심 상태로 전하는 서비스입니다.</p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard icon={Activity} title="작은 생활 신호" text="응답 시간, 활동과 연락 흐름처럼 일상에서 자연스럽게 생기는 변화를 봅니다." />
          <InfoCard icon={ScanLine} title="변화 중심" text="하루의 한 번보다 이전과 달라진 흐름이 있는지 차분히 살펴봅니다." />
          <InfoCard icon={HeartHandshake} title="가족의 안심" text="복잡한 수치 대신 가족이 이해하고 행동할 수 있는 말로 정리합니다." />
        </div>

        <section className="mt-16 rounded-[24px] bg-[#203C2B] p-7 text-white sm:p-10">
          <ShieldCheck size={36} className="text-[#B9E1C0]" aria-hidden />
          <h2 className="mt-5 text-3xl font-black">건강 진단이 아닙니다.</h2>
          <p className="mt-4 max-w-[700px] text-lg font-semibold leading-8 text-white/75">오늘안부는 질병을 판단하거나 의료진을 대신하지 않습니다. 평소와 다른 생활 흐름을 놓치지 않고 가족이 한 번 더 안부를 물을 수 있도록 돕습니다.</p>
        </section>

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

