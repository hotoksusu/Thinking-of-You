import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  PackageCheck,
  Smartphone,
  Sprout,
  UsersRound,
} from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const connectionSteps = [
  {
    number: "1",
    title: "가족(자녀) 계정 만들기",
    description: "이 계정으로 우리 가족을 연결하고 안심 리포트를 확인할 수 있어요.",
    action: "완료",
    complete: true,
    icon: UsersRound,
  },
  {
    number: "2",
    title: "기록자(부모님) 연결하기",
    description: "부모님 휴대폰에 오늘안부를 초대하고 연결을 완료해 주세요.",
    action: "연결하기",
    href: "/onboarding/add-parent",
    icon: Smartphone,
  },
  {
    number: "3",
    title: "기록자 휴대폰에 설치하기",
    description: "부모님 휴대폰 첫 화면에 오늘안부를 꺼내두세요.",
    action: "설치 가이드",
    href: "#install-guide",
    icon: PackageCheck,
  },
  {
    number: "4",
    title: "기록 시작하기",
    description: "오늘부터 간단한 기록을 남기고 안심 리포트를 받아보세요.",
    action: "곧 시작",
    href: "/app?role=parent",
    icon: ClipboardCheck,
  },
];

const rewardSteps = [
  { label: "기록하기", emoji: "📝" },
  { label: "작물 성장", emoji: "🌱" },
  { label: "수확 완료", emoji: "🧺" },
  { label: "집 앞 도착", emoji: "📦" },
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
        <p className="mt-4 text-lg font-semibold text-[#667085]">단계별로 안내해 드릴게요.</p>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[#F0E4D8] bg-white px-5 shadow-[0_20px_55px_rgba(83,54,33,0.08)] sm:px-7">
          {connectionSteps.map((step, index) => {
            const Icon = step.icon;
            const actionClass = step.complete
              ? "bg-[#FFF0E7] text-[#F45D18]"
              : index === 3
                ? "bg-[#F3F4F6] text-[#697386]"
                : "bg-[#FFF0E7] text-[#F45D18]";

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
        <div className="rounded-[28px] border border-[#E4ECD9] bg-[#F5F8EC] p-5 shadow-[0_16px_40px_rgba(80,104,55,0.07)] sm:p-7">
          <div className="flex items-center gap-2 text-[#467A3E]"><Sprout size={20} aria-hidden /><h2 className="text-lg font-black">꾸준히 기록하면 이런 선물이!</h2></div>
          <div className="mt-6 grid grid-cols-4 gap-1">
            {rewardSteps.map((step, index) => (
              <div key={step.label} className="relative text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{step.emoji}</span>
                <p className="mt-2 text-xs font-black text-[#465044] sm:text-sm">{step.label}</p>
                {index < rewardSteps.length - 1 ? <ArrowRight size={14} className="absolute -right-2 top-4 text-[#9AA592]" aria-hidden /> : null}
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-bold leading-6 text-[#687264]">매일의 기록이 작물을 키우고, 수확의 기쁨으로 이어져요.</p>
          <p className="mt-1 text-center text-xs font-semibold leading-5 text-[#858D81]">수확 이벤트를 통해 실제 농산물을 만날 수 있어요.</p>
        </div>
      </section>

      <section id="install-guide" className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[#F0E4D8] bg-white shadow-[0_18px_45px_rgba(83,54,33,0.08)]">
          <Image src="/illustrations/family-guide.png" alt="오늘안부를 함께 시작하는 따뜻한 가족" width={1536} height={1024} className="h-auto w-full" />
          <div className="p-5 text-center sm:p-7">
            <h2 className="text-2xl font-black">복잡하지 않아요!</h2>
            <p className="mt-2 font-semibold text-[#6C7280]">어렵지 않게, 차근차근 안내해 드릴게요.</p>
            <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FFF5EE] p-4"><p className="text-sm font-black text-[#F45D18]">iPhone</p><p className="mt-1 text-sm font-bold leading-6 text-[#525B6B]">Safari 공유 버튼 → 홈 화면에 추가</p></div>
              <div className="rounded-2xl bg-[#F4F6F8] p-4"><p className="text-sm font-black text-[#17223B]">Android</p><p className="mt-1 text-sm font-bold leading-6 text-[#525B6B]">Chrome 메뉴 → 홈 화면에 추가</p></div>
            </div>
            <Link href="/app" className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-6 text-lg font-black text-white shadow-[0_14px_28px_rgba(255,104,31,0.2)]">
              설치 가이드 보기<ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <BottomTabBar active="family" />
    </main>
  );
}
