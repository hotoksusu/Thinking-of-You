"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { getFarmGrowth } from "@/lib/life-pattern";

const dailyChanges = [
  { title: "오늘 첫 꽃이\n피었어요.", speech: "오늘도 잘 자라고 있어요." },
  { title: "오늘 토마토가\n조금 더 자랐어요.", speech: "천천히 잘 크고 있어요." },
  { title: "오늘 열매가\n더 익었어요.", speech: "조금만 더 크면 수확이에요." },
  { title: "오늘 햇빛을\n듬뿍 받았어요.", speech: "오늘도 잘 자라고 있어요." },
] as const;

function todayNumber() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
}

export default function FarmPage() {
  const percent = getFarmGrowth().percent;
  const remainingDays = Math.max(90 - Math.round((percent / 100) * 90), 0);
  const [changeIndex, setChangeIndex] = useState(0);

  useEffect(() => {
    const index = todayNumber() % dailyChanges.length;
    setChangeIndex(index);
    window.localStorage.setItem("oneul-anbu-farm-last-event", JSON.stringify({ date: new Date().toISOString().slice(0, 10), index }));
  }, []);

  const change = dailyChanges[changeIndex];

  return (
    <main className="app-frame has-bottom-nav bg-[#F5F8EE] text-[#183022]">
      <header className="flex min-h-[66px] items-center gap-3 border-b border-[#DDE7DA] bg-[#FBFCF8] px-5">
        <Link href="/app?role=parent&view=farm" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#D3DED0] bg-white" aria-label="이전 화면"><ArrowLeft size={24} /></Link>
        <h1 className="text-[1.5rem] font-black">안부농장</h1>
      </header>

      <div className="farm-page-content px-5 pt-5">
        <h2 className="whitespace-pre-line text-[2rem] font-black leading-[1.18] tracking-[-0.025em]">{change.title}</h2>

        <section className="farm-scene mt-4 overflow-hidden rounded-[30px] border border-[#C9DDC3] bg-[#E8F3E2] text-center shadow-[0_16px_38px_rgba(43,82,51,.11)]" aria-label="오늘의 토마토 농장">
          <div className="relative min-h-[270px] overflow-hidden px-5 pt-4">
            <img src="/brand/farm-mascot.png?v=10" alt="열매가 익어가는 토마토 농장" className="mx-auto size-[190px] rounded-[34px] object-cover shadow-[0_14px_30px_rgba(51,103,61,.14)]" />
            <p className="relative z-10 mx-auto mt-3 inline-block rounded-2xl bg-white px-5 py-2.5 text-lg font-black text-[#315F3A] shadow-sm">{change.speech}</p>
            <div className="absolute inset-x-0 bottom-0 h-9 bg-[#9FC678]" aria-hidden />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(40,70,48,.07)]" aria-label="토마토 수확 진행 상황">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[1.6rem] font-black">수확까지 {remainingDays}일</h2>
            <span className="text-lg font-black text-[#397248]">{percent}%</span>
          </div>
          <div className="mt-3 h-5 overflow-hidden rounded-full bg-[#E4ECE1]" role="progressbar" aria-label="토마토 성장률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full rounded-full bg-[#66A35E]" style={{ width: `${percent}%` }} /></div>
          <p className="mt-3 text-lg font-bold text-[#52645A]">열매가 익어가는 중이에요.</p>
          <details className="mt-2 text-lg font-bold text-[#397248]">
            <summary className="cursor-pointer list-none py-1">다음에는 토마토가 더 붉어져요. <ChevronRight className="inline" size={19} /></summary>
            <p className="mt-2 rounded-xl bg-[#F4F8F1] p-3 text-base text-[#5C6C62]">생활이 쌓이면 다음 모습이 자동으로 나타납니다.</p>
          </details>
        </section>

        <Link href="/app?role=parent&view=record" className="mt-4 flex min-h-[66px] w-full items-center justify-center rounded-[20px] bg-[#D95C24] px-6 text-[1.35rem] font-black text-white shadow-[0_12px_25px_rgba(217,92,36,.22)]">오늘 기분 알려주기</Link>

        <details className="mt-4 rounded-[20px] bg-[#FFF8E9] px-5 py-4 text-[#694D22]">
          <summary className="cursor-pointer list-none text-lg font-black">수확하면 토마토를 보내드려요. <ChevronRight className="inline" size={19} /></summary>
          <div className="mt-3 border-t border-[#E8D7B7] pt-3 text-base font-bold leading-7"><p>주소는 수확할 때 가족이 확인합니다.</p><p>현재는 체험용이며 실제 배송 조건은 정식 운영 전에 안내합니다.</p></div>
        </details>
      </div>

      <BottomTabBar active="farm" />
    </main>
  );
}
