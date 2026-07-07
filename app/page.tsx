import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, BellRing, Clock3, FileHeart, MessageCircle, MousePointerClick, PhoneCall, ShieldCheck, UserPlus } from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const changes = [
  { icon: Clock3, title: "응답 시간이 달라져요", text: "평소보다 답이 늦어지는 흐름" },
  { icon: Activity, title: "활동이 줄어들어요", text: "외출과 움직임이 줄어드는 변화" },
  { icon: MessageCircle, title: "미응답이 늘어나요", text: "연락이 닿지 않는 날이 이어지는 흐름" },
];

const features = [
  { icon: ShieldCheck, title: "안심 점수", text: "오늘의 생활 흐름을 한눈에 봅니다." },
  { icon: FileHeart, title: "AI 안심 리포트", text: "가족이 알아야 할 변화를 쉽게 정리합니다." },
  { icon: Activity, title: "변화 감지", text: "평소와 다른 생활 신호를 살펴봅니다." },
  { icon: BellRing, title: "리마인드 알림", text: "부담 없는 시간에 안부를 이어갑니다." },
];

const steps = [
  { icon: UserPlus, title: "자녀가 시작", text: "가족 계정을 만듭니다." },
  { icon: PhoneCall, title: "부모님 연결", text: "초대 링크로 연결합니다." },
  { icon: MousePointerClick, title: "매일 20초 입력", text: "부모님은 짧게 하루를 남깁니다." },
  { icon: ShieldCheck, title: "안심 상태 확인", text: "가족은 변화 요약을 봅니다." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />

      <section className="relative isolate overflow-hidden border-b border-[#E7E5DE] bg-[#F6EDDF]">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
          <Image src="/brand/hero-family.png" alt="부모님 곁에서 생활 변화를 살피는 오늘안부 안심이" fill priority className="object-cover" sizes="48vw" />
        </div>
        <div className="absolute inset-y-0 left-0 w-full bg-[#FFF9F0] lg:w-[58%]" aria-hidden />
        <div className="relative z-10 mx-auto grid min-h-[680px] w-full max-w-[1200px] items-center px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-[650px]">
            <p className="text-lg font-black leading-8 text-[#E9652B]">부모님의 작은 생활 신호를<br className="sm:hidden" /> 가족의 안심으로</p>
            <h1 className="mt-5 text-[3rem] font-black leading-[1.16] sm:text-[3.5rem]">중요한 건<br />안부가 아니라<br /><span className="text-[#52725B]">변화입니다.</span></h1>
            <p className="mt-6 max-w-[600px] text-xl font-bold leading-9 text-[#43564E]">부모님의 작은 생활 신호를 살펴<br />가족에게 안심 상태로 알려드립니다.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/start" className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.22)]">오늘안부 시작하기 <ArrowRight size={21} aria-hidden /></Link>
              <Link href="/about" className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 border-[#8FA98D] bg-white px-7 text-xl font-black text-[#31473D]">서비스 둘러보기</Link>
            </div>
            <div className="relative mt-9 aspect-[4/3] overflow-hidden rounded-[22px] shadow-[0_18px_44px_rgba(67,49,34,0.14)] lg:hidden">
              <Image src="/brand/hero-family.png" alt="부모님과 오늘안부 안심이" fill priority className="object-cover" sizes="100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-lg font-black text-[#E9652B]">놓치기 쉬운 변화</p>
        <h2 className="mt-3 text-[2rem] font-black leading-[1.3] sm:text-4xl">작은 변화는 대부분<br />뒤늦게 발견됩니다.</h2>
        <p className="mt-5 max-w-[720px] text-xl font-semibold leading-9 text-[#52635C]">한 번의 대답보다<br className="sm:hidden" /> 평소와 달라지는 흐름이 중요합니다.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {changes.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[24px] border border-[#DCE4D9] bg-white p-7"><span className="flex size-14 items-center justify-center rounded-2xl bg-[#FFF0E4] text-[#D95423]"><Icon size={28} aria-hidden /></span><h3 className="mt-6 text-2xl font-black">{title}</h3><p className="mt-3 text-lg font-semibold leading-8 text-[#596861]">{text}</p></article>)}
        </div>
      </section>

      <section className="border-y border-[#DFE7DC] bg-[#F1F5EB] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="text-lg font-black text-[#52725B]">핵심 기능</p>
          <h2 className="mt-3 text-[2rem] font-black leading-[1.3] sm:text-4xl">필요한 안심만<br />쉽게 확인하세요.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => <Link href="/features" key={title} className="rounded-[24px] border border-transparent bg-white p-7 transition hover:-translate-y-1 hover:border-[#B8CBB4] hover:shadow-[0_14px_32px_rgba(55,72,55,0.08)]"><Icon size={30} className="text-[#52725B]" aria-hidden /><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-lg font-semibold leading-8 text-[#596861]">{text}</p></Link>)}
          </div>
          <Link href="/features" className="mt-10 inline-flex min-h-[60px] items-center gap-2 rounded-2xl border-2 border-[#8FA98D] bg-white px-7 text-lg font-black text-[#31473D]">기능 자세히 보기 <ArrowRight size={20} aria-hidden /></Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-lg font-black text-[#E9652B]">시작하는 방법</p>
        <h2 className="mt-3 text-[2rem] font-black leading-[1.3] sm:text-4xl">연결은 간단하고,<br />안부는 짧습니다.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => <Link href="/guide" key={title} className="relative rounded-[24px] border border-[#DCE4D9] bg-white p-7 transition hover:-translate-y-1 hover:border-[#AFC4AC]"><span className="text-lg font-black text-[#E9652B]">{index + 1}단계</span><Icon size={30} className="mt-6 text-[#52725B]" aria-hidden /><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-lg font-semibold leading-8 text-[#596861]">{text}</p></Link>)}
        </div>
        <Link href="/guide" className="mt-10 inline-flex min-h-[60px] items-center gap-2 rounded-2xl border-2 border-[#8FA98D] bg-white px-7 text-lg font-black text-[#31473D]">이용 방법 보기 <ArrowRight size={20} aria-hidden /></Link>
      </section>

      <section className="bg-[#203C2B] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-7 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-[#B9E1C0]"><ShieldCheck size={34} aria-hidden /></span>
          <div><h2 className="text-[2rem] font-black leading-[1.3] sm:text-4xl">의료 진단이 아니라<br />가족을 위한 안심 신호입니다.</h2><p className="mt-4 max-w-[650px] text-lg font-semibold leading-8 text-white/80">질병을 판단하지 않습니다.<br />평소와 다른 흐름을 가족이 살펴보도록 돕습니다.</p></div>
          <Link href="/about" className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-2xl bg-white px-7 text-lg font-black text-[#203C2B]">서비스 자세히 보기 <ArrowRight size={20} aria-hidden /></Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center sm:px-8 sm:py-28">
        <h2 className="text-[2rem] font-black leading-[1.3] sm:text-4xl">부모님의 오늘을<br />오늘부터 함께 확인해보세요.</h2>
        <p className="mt-6 text-xl font-bold leading-9 text-[#52635C]">앱 설치 없이<br className="sm:hidden" /> 바로 시작할 수 있습니다.</p>
        <Link href="/start" className="mt-8 inline-flex min-h-16 w-full max-w-[460px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.22)]">부모님과 연결 시작하기 <ArrowRight size={21} aria-hidden /></Link>
      </section>

      <MobileStartCta />
    </main>
  );
}
