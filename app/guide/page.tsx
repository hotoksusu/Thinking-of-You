import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Smartphone,
  Sprout,
  UsersRound,
} from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { InstallGuide } from "@/components/install-guide";

const connectionSteps = [
  {
    number: "1",
    title: "가족 계정 만들기",
    description: "우리 가족의 기록과 안심 리포트를 확인할 계정을 만듭니다.",
    action: "완료",
    complete: true,
    icon: UsersRound,
  },
  {
    number: "2",
    title: "소중한 가족 초대하기",
    description: "기록할 가족에게 초대 링크를 보냅니다.",
    action: "초대 링크 보내기",
    href: "/onboarding/add-parent",
    icon: Smartphone,
  },
  {
    number: "3",
    title: "매일 기록 링크 받기",
    description: "정해진 시간에 오늘 기록 링크가 도착합니다.",
    action: "링크 받기",
    href: "/app?role=parent",
    icon: Clock3,
  },
  {
    number: "4",
    title: "기록 시작하기",
    description: "링크를 눌러 간단히 기록하면 AI 안심 리포트가 만들어집니다.",
    action: "기록 시작하기",
    href: "/app?role=parent",
    icon: ClipboardCheck,
  },
];

const rewardSteps = [
  { label: "작물 선택", emoji: "🍅" },
  { label: "매일 기록", emoji: "📝" },
  { label: "작물 성장", emoji: "🌱" },
  { label: "수확 완료", emoji: "🧺" },
  { label: "집 앞 배송", emoji: "📦" },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#FFF9F2] pb-28 text-[#17223B]">
      <header className="mx-auto flex w-full max-w-[760px] items-center px-5 py-5 sm:px-8">
        <Link href="/app" className="flex size-11 items-center justify-center rounded-full bg-white text-[#17223B] shadow-[0_8px_22px_rgba(75,49,31,0.08)]" aria-label="뒤로가기">
          <ArrowLeft size={22} aria-hidden />
        </Link>
      </header>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-8 sm:px-8">
        <p className="text-sm font-black text-[#F45D18]">가족 연결 가이드</p>
        <h1 className="mt-3 text-[2.35rem] font-black leading-[1.18] sm:text-5xl">
          이제, 우리 가족을
          <br />연결해 볼까요? <span aria-hidden>✨</span>
        </h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-[#667085]">오늘안부는 매일 저녁 8시에 하루를 남기는 따뜻한 루틴입니다.</p>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[#F0E4D8] bg-white px-5 shadow-[0_20px_55px_rgba(83,54,33,0.08)] sm:px-7">
          {connectionSteps.map((step, index) => {
            const Icon = step.icon;
            const actionClass = step.complete ? "bg-[#FFF0E7] text-[#F45D18]" : "bg-[#FFF0E7] text-[#F45D18]";

            return (
              <article key={step.number} className="relative grid grid-cols-[44px_1fr] gap-3 border-b border-[#F0ECE7] py-6 last:border-0 sm:grid-cols-[48px_1fr]">
                {index < connectionSteps.length - 1 ? <span className="absolute left-[21px] top-[66px] h-[calc(100%-42px)] border-l-2 border-dashed border-[#FFD5BF]" aria-hidden /> : null}
                <span className="relative z-10 flex size-11 items-center justify-center rounded-full bg-[#FF681F] text-base font-black text-white shadow-[0_7px_16px_rgba(255,104,31,0.2)]">{step.number}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-[#F45D18]" aria-hidden />
                    <h2 className="font-black leading-6">{step.title}</h2>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6C7280]">{step.description}</p>
                  {step.complete ? (
                    <span className={`mt-3 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${actionClass}`}>
                      {step.action}<Check size={15} aria-hidden />
                    </span>
                  ) : (
                    <Link href={step.href ?? "#"} className={`mt-3 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${actionClass}`}>
                      {step.action}<ChevronRight size={16} aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[28px] bg-[#17223B] p-6 text-white shadow-[0_20px_48px_rgba(23,34,59,0.16)]">
          <div className="flex items-center gap-2 text-[#FFB184]"><Clock3 size={20} aria-hidden /><p className="text-sm font-black">가족에게 전해지는 저녁 루틴</p></div>
          <h2 className="mt-3 text-2xl font-black leading-9">부모님이 매일 저녁 8시에 하루를 남기세요.</h2>
          <p className="mt-3 font-semibold leading-7 text-[#D6DAE2]">부모님은 20초만 기록하고, 가족은 안심 리포트로 오늘의 변화를 확인할 수 있습니다.</p>
          <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm font-bold leading-6 text-[#EDF0F4]">기록이 이어질수록 선택한 작물과 인생달력도 채워져 꾸준히 사용할 작은 즐거움이 됩니다.</p>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[28px] border border-[#E4ECD9] bg-[#F5F8EC] p-5 shadow-[0_16px_40px_rgba(80,104,55,0.07)] sm:p-7">
          <div className="flex items-center gap-2 text-[#467A3E]"><Sprout size={20} aria-hidden /><h2 className="text-lg font-black">꾸준히 기록하면 이런 선물이!</h2></div>
          <div className="mt-6 grid grid-cols-5 gap-1">
            {rewardSteps.map((step, index) => (
              <div key={step.label} className="relative text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{step.emoji}</span>
                <p className="mt-2 text-xs font-black text-[#465044] sm:text-sm">{step.label}</p>
                {index < rewardSteps.length - 1 ? <ArrowRight size={14} className="absolute -right-2 top-4 text-[#9AA592]" aria-hidden /> : null}
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-bold leading-6 text-[#687264]">매일 기록하면 작물이 자라고, 수확한 농산물이 집 앞까지 도착해요.</p>
        </div>
      </section>

      <section id="install-guide" className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[#F0E4D8] bg-white shadow-[0_18px_45px_rgba(83,54,33,0.08)]">
          <Image src="/illustrations/family-guide.png" alt="오늘안부를 함께 시작하는 따뜻한 가족" width={1536} height={1024} className="h-auto w-full" />
          <div className="p-5 sm:p-7"><InstallGuide /></div>
        </div>
      </section>

      <BottomTabBar active="family" />
    </main>
  );
}
