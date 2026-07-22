import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, Home, Link as LinkIcon, ShieldCheck, UserPlus } from "lucide-react";
import { AnsimiStory } from "@/components/ansimi-story";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";
import { PRODUCT_COPY } from "@/lib/product-copy";

const steps = [
  { icon: UserPlus, title: "가족이 시작해요", text: "가족이 오늘안부를 시작하고 부모님 연결을 준비합니다." },
  { icon: LinkIcon, title: "연결 링크를 보내요", text: "카카오톡이나 문자로 부모님께 연결 링크를 보냅니다." },
  { icon: Home, title: "부모님이 권한을 확인해요", text: "받은 링크에서 바로 시작합니다. 홈 화면 추가는 선택 사항입니다." },
  { icon: Clock3, title: "필요한 날에만 답해요", text: "평소에는 기록하지 않고 질문 알림이 온 날만 짧게 답하거나 건너뜁니다." },
  { icon: ShieldCheck, title: "가족이 이유와 행동을 확인해요", text: "평소와 다른 흐름이 이어질 때 확인할 이유와 행동 하나를 봅니다." },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[980px] px-5 pt-16 text-center sm:px-8 sm:pt-24">
        <p className="text-sm font-black text-[#E9652B]">이용 방법</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">매일 묻지 않아도,<br />달라진 날을 알 수 있어요.</h1>
        <p className="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">{PRODUCT_COPY.parentBehavior} {PRODUCT_COPY.familyBehavior}</p>
      </section>

      <div className="mt-12"><AnsimiStory /></div>

      <section className="mx-auto w-full max-w-[900px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-sm font-black text-[#E9652B]">5단계로 시작해요</p>
        <h2 className="mt-3 text-3xl font-black">복잡하지 않아요.</h2>
        <div className="mt-8 rounded-[26px] border border-[#E2E8DE] bg-white p-5 shadow-[0_20px_55px_rgba(55,72,55,0.08)] sm:p-8">
          <div className="relative">
            <div className="absolute bottom-12 left-7 top-12 border-l-2 border-dashed border-[#CAD8C5]" aria-hidden />
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="relative grid grid-cols-[56px_1fr] gap-4 border-b border-[#E8ECE5] py-6 last:border-0">
                <span className="z-10 flex size-14 items-center justify-center rounded-full bg-[#EDF4E9] text-[#52725B]"><Icon size={24} aria-hidden /></span>
                <div><p className="text-sm font-black text-[#E9652B]">{index + 1}단계</p><h3 className="mt-1 text-2xl font-black">{title}</h3><p className="mt-2 font-semibold leading-7 text-[#68756F]">{text}</p></div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[24px] bg-[#EEF5E9] p-6 sm:p-8">
          <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#52725B]"><HeartHandshake size={24} aria-hidden /></span><div><h2 className="text-2xl font-black">부모님도 쉽게 사용할 수 있어요.</h2><p className="mt-3 font-semibold leading-8 text-[#52635C]">큰 글씨와 큰 버튼으로 구성되어 있고, 필요한 날의 질문 하나만 선택하면 됩니다.</p></div></div>
        </div>
        <div className="mt-5 rounded-[24px] bg-white p-6 font-bold leading-8 text-[#52635C]"><p>평소에는 앱을 매일 열지 않아도 괜찮습니다.</p><p>답하기 어려운 날은 건너뛰어도 괜찮습니다.</p><p>한 번 답하지 않았다고 위험한 상태로 표시하지 않습니다.</p></div>

        <div className="mt-10 text-center">
          <Link href="/start" className="inline-flex min-h-16 w-full max-w-[440px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white">오늘안부 시작하기 <ArrowRight size={21} aria-hidden /></Link>
        </div>
      </section>
      <MobileStartCta />
    </main>
  );
}
