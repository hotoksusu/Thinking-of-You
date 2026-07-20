"use client";

import { useState } from "react";
import { Bell, CalendarDays, ChevronLeft, HeartHandshake, MoonStar, Pill, Stethoscope } from "lucide-react";
import Link from "next/link";

const items = [
  { id: "medication", title: "약 복용", frequency: "등록한 시간에만 확인", icon: Pill },
  { id: "hospital", title: "병원 일정", frequency: "전날과 당일에 안내", icon: CalendarDays },
  { id: "checkup", title: "건강검진", frequency: "예정일이 있을 때 확인", icon: Stethoscope },
  { id: "daily", title: "식사·수면·활동", frequency: "주 2~3회 또는 변화 시 확인", icon: MoonStar },
  { id: "mood", title: "마음·안부", frequency: "주 1~2회 또는 변화 시 확인", icon: HeartHandshake },
] as const;

export default function QuestionSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((item) => [item.id, true])));
  const [preferredTime, setPreferredTime] = useState("19:00");
  return <main className="min-h-screen bg-[#F7F9F6] px-4 py-5 text-[#17221B]"><div className="mx-auto max-w-[620px]">
    <header className="flex items-center gap-3"><Link href="/app?role=family&view=profile" className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm"><ChevronLeft /></Link><div><p className="text-sm font-black text-[#1F6F7A]">가족이 대신 설정할 수 있어요</p><h1 className="text-2xl font-black">질문 설정</h1></div></header>
    <section className="mt-6 rounded-[26px] bg-[#EAF6F7] p-6"><Bell className="text-[#1F6F7A]" /><h2 className="mt-4 text-2xl font-black">매일 많은 것을 묻지 않아요.</h2><p className="mt-2 font-bold leading-7 text-[#53656A]">자동으로 알 수 있는 정보는 다시 묻지 않고, 필요한 날에 질문 하나만 드립니다.</p></section>
    <div className="mt-5 grid gap-3">{items.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setEnabled((current) => ({ ...current, [item.id]: !current[item.id] }))} className={`flex min-h-[92px] items-center gap-4 rounded-[22px] border-2 p-5 text-left ${enabled[item.id] ? "border-[#9FC4A7] bg-white" : "border-[#E0E6DF] bg-[#F0F2EF]"}`}><span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${enabled[item.id] ? "bg-[#EAF3E5] text-[#2F6B46]" : "bg-white text-[#8B948E]"}`}><Icon /></span><span className="min-w-0 flex-1"><strong className="block text-lg">{item.title}</strong><small className="mt-1 block font-bold text-[#68736C]">{item.frequency}</small></span><span className={`rounded-full px-3 py-2 text-sm font-black ${enabled[item.id] ? "bg-[#2F6B46] text-white" : "bg-white text-[#7A847D]"}`}>{enabled[item.id] ? "사용" : "쉼"}</span></button>; })}</div>
    <section className="mt-5 rounded-[22px] bg-white p-5"><label htmlFor="preferred-time" className="font-black">질문을 받기 편한 시간</label><input id="preferred-time" type="time" value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)} className="mt-3 min-h-14 w-full rounded-2xl border-2 border-[#DCE5DC] px-4 text-lg font-black" /><p className="mt-2 text-sm font-bold text-[#727C75]">일정 질문은 필요한 시간에 예외적으로 안내할 수 있어요.</p></section>
    <p className="mt-5 text-center text-sm font-bold leading-6 text-[#7A847D]">하루 기본 질문 1개 · 추가 질문 최대 1개<br />같은 질문은 최소 3일 간격으로 관리합니다.</p>
  </div></main>;
}
