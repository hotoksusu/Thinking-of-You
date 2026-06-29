import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Gift, PackageOpen, Sprout } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const crops = [
  { name: "방울토마토", emoji: "🍅", season: "여름", days: "12일" },
  { name: "미니 당근", emoji: "🥕", season: "가을", days: "18일" },
  { name: "포근한 감자", emoji: "🥔", season: "초여름", days: "24일" },
];

const stages = [
  { label: "씨앗", emoji: "🫘" },
  { label: "새싹", emoji: "🌱" },
  { label: "성장", emoji: "🪴" },
  { label: "수확", emoji: "🧺" },
];

export default function FarmPage() {
  return (
    <main className="min-h-screen bg-[#F9F8EE] pb-28 text-[#17223B]">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/app" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm" aria-label="뒤로가기"><ArrowLeft size={22} aria-hidden /></Link>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#4B7F42] shadow-sm">오늘안부 농장</span>
      </header>

      <section className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
        <p className="text-sm font-black text-[#4B7F42]">함께 키우는 농장</p>
        <h1 className="mt-3 text-[2.45rem] font-black leading-[1.17] sm:text-5xl">하루를 기록하면<br /><span className="text-[#F45D18]">작물이 조금씩 자라요.</span></h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-[#667085]">오늘의 안부가 쌓일수록 내가 고른 작물이 자라고, 수확의 기쁨도 기다립니다.</p>

        <div className="relative mt-7 overflow-hidden rounded-[30px] border border-[#DFE7D4] bg-[#EEF5DE] shadow-[0_22px_55px_rgba(72,98,52,0.12)]">
          <Image src="/illustrations/role-characters.png" alt="제철 채소를 수확한 오늘안부 농장 캐릭터" width={1824} height={1024} className="h-[260px] w-full object-cover object-right sm:h-[340px]" priority />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-[#4B7F42]">이번 주 성장</p>
            <p className="mt-1 text-xl font-black">새싹이 되었어요!</p>
            <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-[#E4ECD8]"><div className="h-full w-[38%] rounded-full bg-[#6AA85D]" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[26px] bg-white p-5 shadow-[0_16px_42px_rgba(72,62,48,0.07)] sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-sm font-black text-[#F45D18]">내 작물</p><h2 className="mt-1 text-2xl font-black">방울토마토</h2></div><span className="flex items-center gap-1.5 rounded-full bg-[#FFF2EA] px-3 py-2 text-sm font-black text-[#F45D18]"><CalendarDays size={16} aria-hidden />수확까지 12일</span></div>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {stages.map((stage, index) => <div key={stage.label} className={`rounded-2xl p-3 text-center ${index <= 1 ? "bg-[#EEF7E8]" : "bg-[#F5F5F3] opacity-70"}`}><span className="text-2xl">{stage.emoji}</span><p className="mt-1 text-xs font-black">{stage.label}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <div className="flex items-end justify-between"><div><p className="text-sm font-black text-[#4B7F42]">제철 씨앗</p><h2 className="mt-1 text-2xl font-black">무엇을 키워볼까요?</h2></div><Sprout className="text-[#6AA85D]" aria-hidden /></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {crops.map((crop, index) => <article key={crop.name} className={`rounded-[22px] border p-5 ${index === 0 ? "border-[#FFB28D] bg-[#FFF5EF]" : "border-[#E4E7E1] bg-white"}`}><span className="text-4xl">{crop.emoji}</span><h3 className="mt-4 font-black">{crop.name}</h3><p className="mt-1 text-sm font-semibold text-[#6C7280]">{crop.season} 작물 · {crop.days}</p></article>)}
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-[760px] gap-3 px-5 sm:grid-cols-2 sm:px-8">
        <article className="rounded-[24px] bg-[#17223B] p-5 text-white"><PackageOpen size={26} className="text-[#FFC09B]" aria-hidden /><h2 className="mt-4 text-xl font-black">수확 창고</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#CFD4DD]">완성한 디지털 작물을 한곳에 차곡차곡 모아요.</p></article>
        <article className="rounded-[24px] bg-[#FFF0E6] p-5"><Gift size={26} className="text-[#F45D18]" aria-hidden /><h2 className="mt-4 text-xl font-black">시즌 수확 이벤트</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6A625D]">브랜드 협업 이벤트를 통해 실제 농산물을 만날 수 있어요.</p></article>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-8 sm:px-8">
        <Link href="/app?role=parent" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-6 text-lg font-black text-white shadow-[0_15px_30px_rgba(255,104,31,0.22)]">오늘 기록하고 작물 키우기<ArrowRight size={18} aria-hidden /></Link>
      </section>

      <BottomTabBar active="farm" />
    </main>
  );
}
