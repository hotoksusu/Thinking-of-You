import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, Home, Link as LinkIcon, ShieldCheck, UserPlus } from "lucide-react";
import { AnsimiStory } from "@/components/ansimi-story";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const steps = [
  { icon: UserPlus, title: "자녀가 가입해요", text: "가족 계정을 만들고 부모님 연결을 준비합니다." },
  { icon: LinkIcon, title: "부모님을 연결해요", text: "카카오톡이나 문자로 받은 초대 링크를 열면 됩니다." },
  { icon: Home, title: "홈화면에 추가해요", text: "별도 앱 설치 없이 부모님 휴대폰 홈화면에 오늘안부를 둡니다." },
  { icon: Clock3, title: "매일 20초만 남겨요", text: "정해진 시간에 오늘 하루를 몇 번의 선택으로 남깁니다." },
  { icon: ShieldCheck, title: "가족이 안심을 확인해요", text: "AI가 정리한 생활 변화와 안심 상태를 가족이 확인합니다." },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />
      <section className="mx-auto w-full max-w-[980px] px-5 pt-16 text-center sm:px-8 sm:pt-24">
        <p className="text-sm font-black text-[#E9652B]">이용 방법</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">설치 없이 시작하고,<br />20초면 안부가 전해집니다.</h1>
        <p className="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">안심이가 오늘안부의 시작부터 가족에게 안심이 전해지는 순간까지 쉽게 알려드릴게요.</p>
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
          <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#52725B]"><HeartHandshake size={24} aria-hidden /></span><div><h2 className="text-2xl font-black">부모님도 쉽게 사용할 수 있어요.</h2><p className="mt-3 font-semibold leading-8 text-[#52635C]">큰 글씨와 큰 버튼으로 구성되어 있고, 기분 선택 하나만으로 오늘의 안부가 가족에게 전해집니다.</p></div></div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/start" className="inline-flex min-h-16 w-full max-w-[440px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white">오늘안부 시작하기 <ArrowRight size={21} aria-hidden /></Link>
        </div>
      </section>
      <MobileStartCta />
    </main>
  );
}
