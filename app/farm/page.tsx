import Link from "next/link";
import { ArrowLeft, Check, Footprints, Gift, HeartHandshake, PackageOpen, Sprout, Sun } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { familyTraces, getFarmGrowth, todaySignals } from "@/lib/life-pattern";

export default function FarmPage() {
  const growth = getFarmGrowth();
  const steps = todaySignals.find((signal) => signal.type === "steps");

  return (
    <main className="app-frame has-bottom-nav bg-[#F5F8EE] text-[#183022]">
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/app?role=parent" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm" aria-label="오늘 화면으로"><ArrowLeft size={21} /></Link>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#3F704A]">함께 키우는 농장</span>
      </header>

      <section className="px-5">
        <p className="text-sm font-black text-[#4C7C56]">오늘도 함께 키우는 안부농장</p>
        <h1 className="mt-2 text-4xl font-black leading-tight">오늘도 토마토가<br /><span className="text-[#3E7A4D]">한 뼘 자랐어요.</span></h1>
        <p className="mt-4 font-semibold leading-7 text-[#69766C]">평소처럼 지내세요. 오늘의 움직임과 가족 소식이 햇빛과 물이 돼요.</p>
      </section>

      <section className="mx-5 mt-7 overflow-hidden rounded-[30px] bg-[#285A3A] text-white shadow-[0_24px_60px_rgba(40,90,58,.22)]">
        <div className="relative min-h-[270px] bg-[radial-gradient(circle_at_78%_16%,#DDF1A6_0_7%,transparent_8%),linear-gradient(#B9E2CF_0_58%,#88B864_58%)] p-6 text-center">
          <span className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-white/80 text-[#E19A29]"><Sun /></span>
          <p className="font-black text-[#285A3A]">이번 계절의 토마토</p>
          <div className="mt-8 text-8xl drop-shadow-lg">🍅</div>
          <p className="mt-5 font-black text-[#285A3A]">오늘도 한 뼘 자랐어요</p>
        </div>
        <div className="p-6">
          <div className="flex items-end justify-between"><div><p className="text-sm font-black text-[#BFE0C5]">오늘의 성장</p><h2 className="mt-1 text-2xl font-black">수확까지 차곡차곡</h2></div><strong className="text-3xl">{growth.percent}%</strong></div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#B9DD86]" style={{ width: `${growth.percent}%` }} /></div>
          <p className="mt-4 text-sm font-bold leading-6 text-white/75">{growth.message}</p>
        </div>
      </section>

      <section className="mx-5 mt-5 rounded-[28px] bg-white p-6">
        <p className="text-sm font-black text-[#4C7C56]">오늘 토마토가 자란 이유</p>
        <div className="mt-4 grid gap-3">
          <EnergyRow icon={<Footprints />} title="오늘도 몸을 움직였어요" copy="평소만큼 움직여 물을 받았어요" />
          <EnergyRow icon={<Check />} title="평소처럼 하루를 시작했어요" copy="편안한 하루가 영양이 됐어요" />
          <EnergyRow icon={<HeartHandshake />} title="오늘 도착한 가족 소식" copy="작은 순간이 햇빛이 됐어요" />
        </div>
      </section>

      <section className="mx-5 mt-5 rounded-[28px] bg-[#FFF8E9] p-6">
        <div className="flex items-start justify-between"><div><p className="text-sm font-black text-[#987028]">계절 수확</p><h2 className="mt-2 text-2xl font-black">생활이 모이면<br />진짜 선물이 돼요.</h2></div><span className="text-5xl">🧺</span></div>
        <p className="mt-4 font-semibold leading-7 text-[#776B55]">한 계절을 채우면 가족에게 수확 알림이 가고, 가족이 배송지를 확인해 선물을 보낼 수 있어요.</p>
        <Link href="/farm/gift" className="mt-5 flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-5 font-black text-white"><Gift size={18} />수확 선물 미리보기</Link>
      </section>

      <BottomTabBar active="farm" />
    </main>
  );
}

function EnergyRow({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return <div className="flex items-center gap-4 rounded-2xl bg-[#F2F7F0] p-4"><span className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#3D724A]">{icon}</span><span><strong className="block">{title}</strong><small className="mt-1 block font-semibold text-[#738077]">{copy}</small></span></div>;
}
