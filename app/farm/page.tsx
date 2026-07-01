import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Gift, PackageOpen, Sprout } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const crops = [
  { name: "방울토마토", emoji: "🍅", season: "여름", days: "12일" },
  { name: "미니 당근", emoji: "🥕", season: "가을", days: "18일" },
  { name: "포근한 감자", emoji: "🥔", season: "초여름", days: "24일" },
];

const stages = [
  { label: "작물 선택", emoji: "🍅" },
  { label: "매일 기록", emoji: "📝" },
  { label: "작물 성장", emoji: "🌱" },
  { label: "수확 완료", emoji: "🧺" },
  { label: "집 앞 배송", emoji: "📦" },
];

export default function FarmPage() {
  return (
    <main className="min-h-screen bg-[#F9F8EE] pb-28 text-[#17223B]">
      <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/app" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm" aria-label="뒤로가기"><ArrowLeft size={22} aria-hidden /></Link>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#4B7F42] shadow-sm">안부농장</span>
      </header>

      <section className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
        <p className="text-sm font-black text-[#4B7F42]">기록은 쉽고, 보상은 확실하게</p>
        <h1 className="mt-3 text-[2.45rem] font-black leading-[1.17] sm:text-5xl">함께 키우는<br /><span className="text-[#F45D18]">안부농장</span></h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-[#667085]">매일 기록하면 작물이 자라고,<br />수확한 농산물이 집 앞까지 도착해요.</p>

        <div className="relative mt-7 overflow-hidden rounded-[30px] border border-[#DFE7D4] bg-[#EEF5DE] shadow-[0_22px_55px_rgba(72,98,52,0.12)]">
          <Image src="/illustrations/role-characters.png" alt="제철 채소를 수확한 오늘안부 농장 캐릭터" width={1824} height={1024} className="h-[260px] w-full object-cover object-right sm:h-[340px]" priority />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-black text-[#4B7F42]">이번 주 성장</p>
            <p className="mt-1 text-xl font-black">오늘의 안부 덕분에 더 자랐어요!</p>
            <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-[#E4ECD8]"><div className="h-full w-[38%] rounded-full bg-[#6AA85D]" /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-[760px] px-5 sm:px-8">
        <div className="flex items-center gap-4 rounded-[24px] bg-[#17223B] p-5 text-white shadow-[0_18px_42px_rgba(23,34,59,0.14)]">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#FFB184]"><Clock3 size={24} aria-hidden /></span>
          <div><p className="text-sm font-black text-[#FFB184]">오늘의 기록 전</p><p className="mt-1 font-black leading-7">오늘 기록하면 토마토가 한 단계 자라요.</p></div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[26px] bg-white p-5 shadow-[0_16px_42px_rgba(72,62,48,0.07)] sm:p-7">
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black text-[#F45D18]">이번 달 선택 작물</p><h2 className="mt-1 text-2xl font-black">토마토</h2></div><span className="flex items-center gap-1.5 rounded-full bg-[#FFF2EA] px-3 py-2 text-sm font-black text-[#F45D18]"><CalendarDays size={16} aria-hidden />수확까지 8일</span></div>
          <p className="mt-4 font-bold leading-7 text-[#5D6678]">오늘의 기록이 쌓이면 선택한 작물이 조금씩 자랍니다. 수확까지 채우면 실제 농산물을 받아볼 수 있어요.</p>
          <div className="mt-6 grid grid-cols-5 gap-1">
            {stages.map((stage, index) => <div key={stage.label} className={`rounded-xl p-2 text-center ${index <= 1 ? "bg-[#EEF7E8]" : "bg-[#F5F5F3] opacity-70"}`}><span className="text-xl">{stage.emoji}</span><p className="mt-1 text-[0.68rem] font-black leading-4">{stage.label}</p></div>)}
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
        <article className="rounded-[24px] bg-[#FFF0E6] p-5"><Gift size={26} className="text-[#F45D18]" aria-hidden /><h2 className="mt-4 text-xl font-black">집 앞 배송</h2><p className="mt-2 text-sm font-semibold leading-6 text-[#6A625D]">수확을 완료하고 배송 정보를 확인하면 신선한 농산물이 집 앞까지 도착해요.</p></article>
      </section>

      <section className="mx-auto mt-3 w-full max-w-[760px] px-5 sm:px-8">
        <div className="rounded-[26px] border border-[#FFD7C3] bg-white p-6 shadow-[0_16px_38px_rgba(80,52,32,0.07)]">
          <p className="text-sm font-black text-[#F45D18]">수확 완료 상태</p>
          <h2 className="mt-2 text-2xl font-black">축하해요!</h2>
          <p className="mt-3 font-bold leading-7 text-[#4F5868]">꾸준한 기록으로 토마토 수확을 완료했어요. 배송 정보를 확인하면 신선한 농산물이 집 앞까지 도착합니다.</p>
          <button type="button" className="mt-5 min-h-12 w-full rounded-2xl bg-[#FF681F] px-5 font-black text-white">배송 정보 확인하기</button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-8 sm:px-8">
        <Link href="/app?role=parent" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-6 text-lg font-black text-white shadow-[0_15px_30px_rgba(255,104,31,0.22)]">안부농장 구경하기<ArrowRight size={18} aria-hidden /></Link>
      </section>

      <BottomTabBar active="farm" />
    </main>
  );
}
