import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bell, Clock3, Gift, PackageOpen, Sprout, Users } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { getCurrentFarmSeason, getSeasonalCrops, seasonLabels } from "@/lib/reassurance-farm";

const stages = [
  { label: "작물 선택", emoji: "🍅" },
  { label: "매일 기록", emoji: "📝" },
  { label: "작물 성장", emoji: "🌱" },
  { label: "수확 완료", emoji: "🧺" },
  { label: "가족이 선물", emoji: "📦" },
];

const growthStages = [
  ["0~7일", "씨앗", "•"],
  ["8~30일", "새싹", "🌱"],
  ["31~60일", "줄기", "🌿"],
  ["61~89일", "열매", "🍅"],
  ["90일", "수확 완료", "🧺"],
];

export default function FarmPage() {
  const season = getCurrentFarmSeason();
  const crops = getSeasonalCrops(season);

  return (
    <main className="min-h-screen bg-[#F9F8EE] pb-28 text-[#17223B]">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/app" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm" aria-label="뒤로가기"><ArrowLeft size={22} aria-hidden /></Link>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#4B7F42] shadow-sm">안부농장</span>
      </header>

      <section className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
        <p className="text-sm font-black text-[#4B7F42]">가족이 함께 키우는 90일</p>
        <h1 className="mt-3 text-[2.45rem] font-black leading-[1.17] sm:text-5xl">함께 키우는<br /><span className="text-[#F45D18]">안부농장</span></h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-[#667085]">매일 저녁 8시, 오늘의 기록으로 선택한 작물이 자랍니다.<br />90일 동안 꾸준히 키우면 가족이 수확 선물을 보내드릴 수 있어요.</p>

        <div className="relative mt-7 overflow-hidden rounded-[30px] border border-[#DFE7D4] bg-[#EEF5DE] shadow-[0_22px_55px_rgba(72,98,52,0.12)]">
          <Image src="/illustrations/role-characters.png" alt="제철 채소를 수확한 오늘안부 농장 캐릭터" width={1824} height={1024} className="h-[260px] w-full object-cover object-right sm:h-[340px]" priority />
          <div className="absolute bottom-4 left-4 max-w-[72%] rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-[#4B7F42]">부모님은 기록만 하면 돼요</p>
            <p className="mt-1 font-black leading-6">수확되면 가족이 배송지를 확인해 선물을 보낼 수 있어요.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="flex items-center gap-4 rounded-[24px] bg-[#17223B] p-5 text-white shadow-[0_18px_42px_rgba(23,34,59,0.14)]">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#FFB184]"><Clock3 size={24} aria-hidden /></span>
          <div><p className="text-sm font-black text-[#FFB184]">매일 저녁 8시</p><p className="mt-1 font-black leading-7">토마토가 오늘의 기록을 기다리고 있어요.</p></div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[26px] bg-white p-5 shadow-[0_16px_42px_rgba(72,62,48,0.07)] sm:p-7">
          <div className="flex items-end justify-between gap-3"><div><p className="text-sm font-black text-[#F45D18]">이번 계절은 토마토를 함께 키워요</p><h2 className="mt-1 text-2xl font-black">토마토 성장률 43%</h2></div><span className="rounded-full bg-[#FFF2EA] px-3 py-2 text-sm font-black text-[#F45D18]">수확까지 51일</span></div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#E7EEDC]" role="progressbar" aria-label="토마토 성장률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={43}><div className="h-full w-[43%] rounded-full bg-[#6AA85D]" /></div>
          <p className="mt-4 font-bold leading-7 text-[#5D6678]">오늘 기록하면 토마토가 한 단계 자라요. 한 번 선택한 작물은 수확 전까지 바꿀 수 없어요.</p>
          <div className="mt-6 grid grid-cols-5 gap-1">
            {stages.map((stage, index) => <div key={stage.label} className={`rounded-xl p-2 text-center ${index <= 2 ? "bg-[#EEF7E8]" : "bg-[#F5F5F3] opacity-70"}`}><span className="text-xl">{stage.emoji}</span><p className="mt-1 text-[0.68rem] font-black leading-4">{stage.label}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <div className="flex items-end justify-between"><div><p className="text-sm font-black text-[#4B7F42]">{seasonLabels[season]} 제철 작물 3가지</p><h2 className="mt-1 text-2xl font-black">하나만 골라 함께 키워요</h2></div><Sprout className="text-[#6AA85D]" aria-hidden /></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {crops.map((crop, index) => <article key={crop.id} className={`rounded-[22px] border p-5 ${index === 0 ? "border-[#FFB28D] bg-[#FFF5EF]" : "border-[#E4E7E1] bg-white"}`}><span className="text-4xl">{crop.emoji}</span><h3 className="mt-4 font-black">{crop.name}</h3><p className="mt-1 text-sm font-semibold text-[#6C7280]">90일 · {crop.giftPackage}</p></article>)}
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <h2 className="text-2xl font-black">90일 동안 이렇게 자라요</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {growthStages.map(([days, label, emoji]) => <div key={label} className="rounded-2xl bg-white p-3 text-center shadow-sm"><span className="text-2xl" aria-hidden>{emoji}</span><p className="mt-2 text-xs font-black text-[#4B7F42]">{days}</p><p className="mt-1 text-xs font-bold">{label}</p></div>)}
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-[760px] gap-3 px-5 sm:grid-cols-2 sm:px-8">
        <article className="rounded-[24px] bg-[#17223B] p-5 text-white"><Users size={26} className="text-[#FFC09B]" aria-hidden /><h2 className="mt-4 text-xl font-black">가족도 함께 키워요</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#CFD4DD]">가족이 물을 주고 응원을 보내며 90일을 함께합니다.</p></article>
        <article className="rounded-[24px] bg-[#FFF0E6] p-5"><Gift size={26} className="text-[#F45D18]" aria-hidden /><h2 className="mt-4 text-xl font-black">수확 선물</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6A625D]">수확 알림을 받은 가족이 배송지를 확인하고 선물을 보냅니다.</p></article>
      </section>

      <section className="mx-auto mt-3 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[26px] border border-[#FFD7C3] bg-white p-6 shadow-[0_16px_38px_rgba(80,52,32,0.07)]">
          <div className="flex items-center gap-3 text-[#F45D18]"><Bell size={22} aria-hidden /><p className="text-sm font-black">가족에게 도착하는 수확 알림</p></div>
          <h2 className="mt-3 text-2xl font-black">어머님이 90일 동안 토마토를 꾸준히 키우셨어요.</h2>
          <p className="mt-3 font-bold leading-7 text-[#4F5868]">수확 선물을 보내드릴까요? 부모님께 직접 주소 입력을 부탁드리지 않아도 됩니다.</p>
          <Link href="/farm/gift" className="mt-5 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FF681F] px-5 font-black text-white"><PackageOpen size={19} className="mr-2" aria-hidden />수확 선물 보내기</Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-8 sm:px-8">
        <Link href="/app?role=parent" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-6 text-lg font-black text-white shadow-[0_15px_30px_rgba(255,104,31,0.22)]">오늘 기록하기<ArrowRight size={18} aria-hidden /></Link>
      </section>

      <BottomTabBar active="farm" />
    </main>
  );
}
