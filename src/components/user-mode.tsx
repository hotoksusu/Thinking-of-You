"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Footprints,
  HeartHandshake,
  Home,
  ImagePlus,
  Leaf,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Sprout,
  UsersRound,
} from "lucide-react";
import { familyTraces, getFarmGrowth, todayReport, todaySignals } from "@/lib/life-pattern";

type ExperienceRole = "parent" | "family";

export function UserMode({ initialRole }: { initialRegistered: boolean; initialRole?: ExperienceRole }) {
  const [role, setRole] = useState<ExperienceRole | null>(initialRole ?? null);

  if (!role) return <RoleSelect onSelect={setRole} />;
  return role === "parent"
    ? <ParentHome onSwitch={() => setRole("family")} />
    : <FamilyHome onSwitch={() => setRole("parent")} />;
}

function RoleSelect({ onSelect }: { onSelect: (role: ExperienceRole) => void }) {
  return (
    <main className="min-h-screen bg-[#F4F7F3] px-5 py-8 text-[#17221B]">
      <div className="mx-auto max-w-[860px]">
        <Brand />
        <section className="mt-16 max-w-[640px]">
          <p className="text-sm font-black text-[#4F7A5A]">생활이 안부가 되는 순간</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.18] sm:text-6xl">기록하지 않아도,<br /><span className="text-[#2F6B46]">오늘은 전해집니다.</span></h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-[#657069]">평소처럼 생활하면 AI가 생활 패턴을 살펴 가족에게 편안한 안심을 전해요.</p>
        </section>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <RoleCard icon={<Leaf />} eyebrow="부모님" title="평소처럼 생활하기" description="앱 설치와 권한 동의 후에는 따로 기록할 일이 없어요." onClick={() => onSelect("parent")} />
          <RoleCard icon={<HeartHandshake />} eyebrow="가족" title="안심 확인하기" description="AI가 정리한 생활 흐름을 보고 가끔 작은 소식을 남겨요." onClick={() => onSelect("family")} />
        </div>
        <p className="mt-8 text-center text-sm font-bold text-[#7B857E]">통화 내용은 수집하지 않으며, 생활 신호는 동의한 범위에서만 사용합니다.</p>
      </div>
    </main>
  );
}

function RoleCard({ icon, eyebrow, title, description, onClick }: { icon: React.ReactNode; eyebrow: string; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group rounded-[28px] border border-[#DCE7DC] bg-white p-6 text-left shadow-[0_18px_55px_rgba(49,78,58,0.08)] transition hover:-translate-y-1 hover:border-[#83A98C]">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF3E9] text-[#2F6B46]">{icon}</span>
      <p className="mt-6 text-sm font-black text-[#62806A]">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black">{title}</h2>
      <p className="mt-3 font-semibold leading-7 text-[#6D766F]">{description}</p>
      <span className="mt-6 flex items-center gap-2 font-black text-[#2F6B46]">시작하기 <ArrowRight size={18} /></span>
    </button>
  );
}

function ParentHome({ onSwitch }: { onSwitch: () => void }) {
  const farm = getFarmGrowth();
  return (
    <AppFrame active="home">
      <TopBar label="정희님의 오늘" onSwitch={onSwitch} switchLabel="가족 화면" />
      <section className="px-5 pb-28 pt-5">
        <ReassuranceHero />

        {familyTraces.length ? (
          <section className="mt-5">
            <SectionTitle eyebrow="새로운 가족 소식" title="오늘 도착한 작은 기쁨" />
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {familyTraces.map((trace) => (
                <article key={trace.id} className="min-w-[250px] rounded-[24px] bg-[#FFF8ED] p-5">
                  <span className="text-4xl">{trace.emoji}</span>
                  <p className="mt-5 text-lg font-black leading-7">{trace.title}</p>
                  <p className="mt-2 text-sm font-bold text-[#8A7560]">{trace.sender} · 조금 전</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <Link href="/farm" className="mt-5 block rounded-[28px] bg-[#234D35] p-6 text-white shadow-[0_22px_55px_rgba(35,77,53,0.2)]">
          <div className="flex items-start justify-between">
            <div><p className="text-sm font-black text-[#BFE0C4]">안부농장</p><h2 className="mt-2 text-2xl font-black">생활이 키운 토마토</h2></div>
            <span className="text-5xl">🍅</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#B8DD8B]" style={{ width: `${farm.percent}%` }} /></div>
          <div className="mt-3 flex justify-between text-sm font-bold text-white/75"><span>걸음과 생활 리듬 +{farm.lifePoints}</span><span>{farm.percent}%</span></div>
          <p className="mt-5 flex items-center justify-between font-bold">농장 둘러보기 <ChevronRight size={19} /></p>
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#E1E8E1] bg-white p-6">
          <SectionTitle eyebrow="AI 생활 리포트" title="이번 주도 안정적이에요" />
          <div className="mt-5 grid grid-cols-7 items-end gap-2" aria-label="최근 7일 안심지수">
            {todayReport.trend.map((point, index) => <div key={index} className="flex flex-col items-center gap-2"><div className="w-full rounded-full bg-[#CFE1D1]" style={{ height: `${Math.max(30, point - 38)}px` }} /><span className="text-[10px] font-bold text-[#879089]">{index + 1}일</span></div>)}
          </div>
          <p className="mt-5 rounded-2xl bg-[#F2F6F1] p-4 font-semibold leading-7 text-[#59645C]">평소 활동 범위와 수면 전 사용 시간이 일정합니다. 특별한 변화는 감지되지 않았어요.</p>
        </section>
      </section>
    </AppFrame>
  );
}

function FamilyHome({ onSwitch }: { onSwitch: () => void }) {
  return (
    <AppFrame active="family">
      <TopBar label="엄마의 오늘" onSwitch={onSwitch} switchLabel="부모님 화면" />
      <section className="px-5 pb-28 pt-5">
        <ReassuranceHero />

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_16px_45px_rgba(49,78,58,0.07)]">
          <div className="flex items-center justify-between"><SectionTitle eyebrow="자동 생활 신호" title="오늘의 생활 흐름" /><span className="rounded-full bg-[#EDF6EE] px-3 py-1 text-xs font-black text-[#39704A]">자동 업데이트</span></div>
          <div className="mt-5 divide-y divide-[#EEF1EE]">
            {todaySignals.slice(0, 4).map((signal) => <SignalRow key={signal.type} signal={signal} />)}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#7D857F]"><ShieldCheck size={15} /> 통화 내용은 수집하지 않습니다.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-[#FFF8ED] p-6">
          <SectionTitle eyebrow="가족의 작은 흔적" title="부담 없이 하나 남겨볼까요?" />
          <p className="mt-2 font-semibold leading-7 text-[#746B60]">새로 할 일은 없어요. 오늘 찍은 사진이나 한 줄이면 충분해요.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <TraceButton icon={<ImagePlus size={20} />} label="사진" />
            <TraceButton icon={<MessageCircle size={20} />} label="한 줄" />
            <TraceButton icon={<Sparkles size={20} />} label="오늘 순간" />
          </div>
        </section>

        <Link href="/family/report" className="mt-5 flex items-center justify-between rounded-[24px] border border-[#E1E8E1] bg-white p-5">
          <span className="flex items-center gap-4"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF4EE] text-[#2F6B46]"><BarChart3 /></span><span><strong className="block">장기 변화 리포트</strong><small className="mt-1 block font-semibold text-[#737C75]">최근 4주 생활 패턴 보기</small></span></span><ChevronRight />
        </Link>
      </section>
    </AppFrame>
  );
}

function ReassuranceHero() {
  return (
    <section className="overflow-hidden rounded-[30px] bg-[#2F6B46] p-6 text-white shadow-[0_24px_65px_rgba(47,107,70,0.23)]">
      <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-black text-[#D5EBD8]"><span className="size-2 rounded-full bg-[#9DE2A8]" />오늘의 안심</p><span className="text-xs font-bold text-white/65">오후 8:20 기준</span></div>
      <div className="mt-6 flex items-end gap-2"><strong className="text-7xl font-black tracking-[-0.07em]">{todayReport.score}</strong><span className="pb-2 text-xl font-black">점</span></div>
      <p className="mt-4 text-xl font-black leading-8">{todayReport.summary}</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {todayReport.factors.map((factor) => <p key={factor} className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-bold"><Check size={16} className="text-[#B9E7BF]" />{factor}</p>)}
      </div>
    </section>
  );
}

function SignalRow({ signal }: { signal: (typeof todaySignals)[number] }) {
  const icons = { steps: Footprints, daily_rhythm: Clock3, call_activity: Phone, app_activity: Activity, mobility: Activity };
  const Icon = icons[signal.type];
  return <div className="flex items-center justify-between py-4"><span className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#F0F5F0] text-[#3D6F4B]"><Icon size={19} /></span><span><strong className="block text-sm">{signal.label}</strong><small className="font-semibold text-[#848C86]">평소와 비슷해요</small></span></span><strong>{signal.value.toLocaleString()}{signal.unit}</strong></div>;
}

function TraceButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button type="button" className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#4D5A50] shadow-sm">{icon}{label}</button>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-xs font-black text-[#5A7D63]">{eyebrow}</p><h2 className="mt-1 text-xl font-black">{title}</h2></div>;
}

function Brand() {
  return <Link href="/" className="inline-flex items-center gap-2 font-black"><span className="flex size-9 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><Bell size={18} /></span>오늘안부</Link>;
}

function TopBar({ label, onSwitch, switchLabel }: { label: string; onSwitch: () => void; switchLabel: string }) {
  return <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4EAE4] bg-[#F7F9F6]/95 px-5 py-4 backdrop-blur"><div><Brand /><p className="mt-2 text-xl font-black">{label}</p></div><button type="button" onClick={onSwitch} className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#506056] shadow-sm">{switchLabel}</button></header>;
}

function AppFrame({ children, active }: { children: React.ReactNode; active: "home" | "family" }) {
  return <main className="app-frame min-h-screen bg-[#F7F9F6] text-[#17221B]">{children}<nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[480px] grid-cols-3 border-t border-[#E2E8E2] bg-white/95 px-3 pb-[max(.7rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"><NavItem icon={<Home size={21} />} label="오늘" active={active === "home"} href="/app?role=parent" /><NavItem icon={<Sprout size={21} />} label="농장" href="/farm" /><NavItem icon={<UsersRound size={21} />} label="가족" active={active === "family"} href="/app?role=family" /></nav></main>;
}

function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
  return <Link href={href} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black ${active ? "bg-[#EDF5ED] text-[#2F6B46]" : "text-[#7D867F]"}`}>{icon}{label}</Link>;
}
