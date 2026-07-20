"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Gift, Heart, Info, Sprout, Sun } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { familyTraces, getFarmGrowth } from "@/lib/life-pattern";

const events = [
  { title: "토마토에\n첫 꽃이 피었어요.", note: "오늘의 생활이 반영되어 한 단계 자랐습니다.", icon: "🌼", speech: "꽃이 피어 기분 좋은 하루예요." },
  { title: "작은 열매가\n하나 더 맺혔어요.", note: "평소의 생활 흐름이 농장에 반영됐습니다.", icon: "🍅", speech: "오늘도 천천히 잘 자라고 있어요." },
  { title: "토마토가\n조금 더 붉어졌어요.", note: "오늘도 생활이 자연스럽게 쌓였습니다.", icon: "☀️", speech: "따뜻한 햇빛을 잘 받았어요." },
  { title: "수확 바구니가\n농장에 도착했어요.", note: "수확을 준비할 때가 가까워지고 있습니다.", icon: "🧺", speech: "조금만 더 크면 수확이에요." },
  { title: "농장에 따뜻한\n햇빛이 비쳤어요.", note: "성장이 쉬어가는 날도 괜찮습니다.", icon: "🌤️", speech: "오늘은 편하게 쉬어도 괜찮아요." },
] as const;

function todayNumber() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
}

export default function FarmPage() {
  const growth = getFarmGrowth();
  const percent = growth.percent;
  const remainingDays = Math.max(90 - Math.round((percent / 100) * 90), 0);
  const [eventIndex, setEventIndex] = useState(0);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    const index = todayNumber() % events.length;
    setEventIndex(index);
    window.localStorage.setItem("oneul-anbu-farm-last-event", JSON.stringify({ date: new Date().toISOString().slice(0, 10), index }));
  }, []);

  const event = events[eventIndex];
  const todayFamilyTrace = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return familyTraces.find((trace) => trace.createdAt.slice(0, 10) === today);
  }, []);

  return (
    <main className="app-frame has-bottom-nav farm-page bg-[#F5F8EE] text-[#183022]">
      <header className="flex min-h-[76px] items-center gap-4 border-b border-[#DDE7DA] bg-[#FBFCF8] px-5">
        <Link href="/app?role=parent&view=farm" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#D3DED0] bg-white" aria-label="안부농장 이전 화면"><ArrowLeft size={25} /></Link>
        <h1 className="text-[1.55rem] font-black">안부농장</h1>
      </header>

      <div className="farm-page-content px-5 pt-7">
        <section aria-labelledby="today-change-title">
          <p className="text-lg font-black text-[#397248]">오늘의 변화</p>
          <h2 id="today-change-title" className="mt-2 whitespace-pre-line text-[2.15rem] font-black leading-[1.22] tracking-[-0.025em]">{event.title}</h2>
          <p className="mt-3 text-lg font-bold leading-8 text-[#607066]">{event.note}</p>
        </section>

        <section className="farm-scene mt-6 overflow-hidden rounded-[30px] border border-[#CFE0C9] bg-[#E9F3E3] text-center shadow-[0_18px_45px_rgba(43,82,51,.10)]" aria-label="현재 토마토 농장 모습">
          <div className="relative min-h-[285px] overflow-hidden px-5 pt-6">
            <span className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm" aria-hidden>{event.icon}</span>
            <div className="mx-auto mt-3 flex size-44 items-center justify-center rounded-full bg-white/70 text-[6.5rem] shadow-[0_16px_34px_rgba(51,103,61,.14)]" aria-hidden>🌿🍅</div>
            <p className="relative z-10 mx-auto mt-5 inline-block rounded-2xl bg-white px-5 py-3 text-lg font-black text-[#315F3A] shadow-sm">{event.speech}</p>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-[#9FC678]" aria-hidden />
          </div>
        </section>

        <section className="mt-5 rounded-[26px] bg-white p-6 shadow-[0_12px_35px_rgba(40,70,48,.07)]" aria-labelledby="farm-stage-title">
          <p className="text-base font-black text-[#397248]">지금은 4단계 · 열매</p>
          <h2 id="farm-stage-title" className="mt-2 text-[1.75rem] font-black">열매가 익어가는 중</h2>
          <p className="mt-3 text-[1.35rem] font-black text-[#D65B27]">수확까지 {remainingDays}일</p>
          <div className="mt-4 h-5 overflow-hidden rounded-full bg-[#E4ECE1]" role="progressbar" aria-label="토마토 성장률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full rounded-full bg-[#66A35E]" style={{ width: `${percent}%` }} /></div>
          <p className="mt-2 text-right text-base font-bold text-[#66746B]">{percent}% 자랐어요</p>
        </section>

        {todayFamilyTrace ? (
          <section className="mt-4 flex items-center gap-4 rounded-[24px] bg-[#FFF3E9] p-5" aria-label="오늘의 가족 소식">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#D95C24]"><Heart size={25} /></span>
            <p className="text-lg font-black leading-7"><span className="text-[#C34E21]">{todayFamilyTrace.sender}님이</span><br />따뜻한 햇빛을 보내셨어요.</p>
          </section>
        ) : null}

        <section className="mt-4 rounded-[24px] border-2 border-[#CFE0C9] bg-[#F8FBF5] p-5">
          <div className="flex items-center gap-3"><Sprout className="shrink-0 text-[#397248]" size={27} /><div><p className="text-sm font-black text-[#617067]">다음 변화</p><p className="mt-1 text-xl font-black">75%가 되면 토마토가 더 붉어져요.</p></div></div>
        </section>

        <section className="mt-4 rounded-[24px] bg-[#FFF8E9] p-5">
          <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C77624]"><Gift size={25} /></span><div><h2 className="text-xl font-black">수확하면 제철 토마토를 보내드려요.</h2><p className="mt-2 text-base font-bold leading-7 text-[#6F6655]">주소는 수확할 때 가족이 확인합니다.</p></div></div>
          <button type="button" onClick={() => setShowDelivery((open) => !open)} aria-expanded={showDelivery} className="mt-3 flex min-h-12 items-center gap-2 text-base font-black text-[#76521E]"><Info size={20} /> 배송 안내 보기 <ChevronRight className={showDelivery ? "rotate-90" : ""} size={19} /></button>
          {showDelivery ? <div className="rounded-2xl bg-white p-4 text-base font-bold leading-7 text-[#625C51]"><p>현재는 체험용 화면입니다.</p><p>실제 수확 조건·수량·배송비는 정식 운영 전에 안내드립니다.</p></div> : null}
        </section>

        <Link href="/app?role=parent&view=record" className="mt-6 flex min-h-[72px] w-full items-center justify-center rounded-[22px] bg-[#D95C24] px-6 text-[1.35rem] font-black text-white shadow-[0_14px_28px_rgba(217,92,36,.22)]">오늘 기분 알려주기</Link>
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-base font-bold text-[#657268]"><Sun size={19} className="text-[#C5872C]" /> 평소처럼 생활하시면 됩니다.</p>
      </div>

      <BottomTabBar active="farm" />
    </main>
  );
}
