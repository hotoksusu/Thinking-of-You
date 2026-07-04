"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
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
  X,
} from "lucide-react";
import { familyTraces, getFarmGrowth, todayReport, todaySignals, type FamilyTrace } from "@/lib/life-pattern";

type ExperienceRole = "parent" | "family";

export function UserMode({ initialRole }: { initialRegistered: boolean; initialRole?: ExperienceRole }) {
  const [role, setRole] = useState<ExperienceRole | null>(initialRole ?? null);
  const [moments, setMoments] = useState<FamilyTrace[]>(familyTraces);

  if (!role) return <RoleSelect onSelect={setRole} />;
  return role === "parent"
    ? <ParentHome moments={moments} onSwitch={() => setRole("family")} />
    : <FamilyHome moments={moments} onAddMoment={(moment) => setMoments((current) => [moment, ...current])} onSwitch={() => setRole("parent")} />;
}

function RoleSelect({ onSelect }: { onSelect: (role: ExperienceRole) => void }) {
  return (
    <main className="min-h-screen bg-[#F4F7F3] px-5 py-8 text-[#17221B]">
      <div className="mx-auto max-w-[860px]">
        <Brand />
        <section className="mt-16 max-w-[640px]">
          <p className="text-sm font-black text-[#4F7A5A]">생활이 안부가 되는 순간</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.18] sm:text-6xl">기록하지 않아도,<br /><span className="text-[#2F6B46]">오늘은 전해집니다.</span></h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-[#657069]">평소처럼 지내세요. 최근 생활을 조용히 살펴 가족에게 안심을 전해드려요.</p>
        </section>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <RoleCard icon={<Leaf />} eyebrow="부모님" title="평소처럼 생활하기" description="앱 설치와 권한 동의 후에는 따로 기록할 일이 없어요." onClick={() => onSelect("parent")} />
          <RoleCard icon={<HeartHandshake />} eyebrow="가족" title="안심 확인하기" description="오늘의 생활을 확인하고, 가끔 작은 순간을 나눠요." onClick={() => onSelect("family")} />
        </div>
        <p className="mt-8 text-center text-sm font-bold text-[#7B857E]">통화 내용은 보지 않아요. 동의한 정보만 안전하게 살펴봅니다.</p>
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

function ParentHome({ moments, onSwitch }: { moments: FamilyTrace[]; onSwitch: () => void }) {
  const farm = getFarmGrowth(todaySignals, moments);
  return (
    <AppFrame active="home">
      <TopBar label="정희님의 오늘" onSwitch={onSwitch} switchLabel="가족 화면" />
      <section className="px-5 pb-28 pt-5">
        <ReassuranceHero />

        {moments.length ? (
          <section className="mt-5">
            <SectionTitle eyebrow="오늘 도착한 가족 소식" title="작은 순간이 도착했어요" />
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {moments.map((trace) => (
                <article key={trace.id} className="w-[250px] shrink-0 rounded-[24px] bg-[#FFF8ED] p-5">
                  {trace.imageUrl ? <img src={trace.imageUrl} alt="가족이 남긴 오늘의 순간" className="h-32 w-full rounded-2xl object-cover" /> : <span className="text-4xl">{trace.emoji}</span>}
                  <p className="mt-5 line-clamp-2 text-lg font-black leading-7">{trace.title}</p>
                  <p className="mt-2 text-sm font-bold text-[#8A7560]">{trace.sender} · 조금 전</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <Link href="/farm" className="mt-5 block rounded-[28px] bg-[#234D35] p-6 text-white shadow-[0_22px_55px_rgba(35,77,53,0.2)]">
          <div className="flex items-start justify-between">
            <div><p className="text-sm font-black text-[#BFE0C4]">오늘도 함께 키우는 안부농장</p><h2 className="mt-2 text-2xl font-black">토마토가 한 뼘 자랐어요</h2></div>
            <span className="text-5xl">🍅</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#B8DD8B]" style={{ width: `${farm.percent}%` }} /></div>
          <div className="mt-3 flex justify-between text-sm font-bold text-white/75"><span>오늘의 생활로 물 +{farm.lifePoints}</span><span>{farm.percent}%</span></div>
          <p className="mt-5 flex items-center justify-between font-bold">농장 둘러보기 <ChevronRight size={19} /></p>
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#E1E8E1] bg-white p-6">
          <SectionTitle eyebrow="최근 생활 변화" title="이번 주도 편안하게 지내셨어요" />
          <div className="mt-5 grid grid-cols-7 items-end gap-2" aria-label="최근 7일 안심 흐름">
            {todayReport.trend.map((point, index) => <div key={index} className="flex flex-col items-center gap-2"><div className="w-full rounded-full bg-[#CFE1D1]" style={{ height: `${Math.max(30, point - 38)}px` }} /><span className="text-[10px] font-bold text-[#879089]">{index + 1}일</span></div>)}
          </div>
          <p className="mt-5 rounded-2xl bg-[#F2F6F1] p-4 font-semibold leading-7 text-[#59645C]">평소와 비슷하게 움직이고 쉬셨어요. 특별히 달라진 점은 없어요.</p>
          <p className="mt-3 text-xs font-bold text-[#8A938C]">최근 생활을 AI가 조용히 살펴봤어요.</p>
        </section>
      </section>
    </AppFrame>
  );
}

function FamilyHome({ moments, onAddMoment, onSwitch }: { moments: FamilyTrace[]; onAddMoment: (moment: FamilyTrace) => void; onSwitch: () => void }) {
  const [isWriting, setIsWriting] = useState(false);
  return (
    <AppFrame active="family">
      <TopBar label="엄마의 오늘" onSwitch={onSwitch} switchLabel="부모님 화면" />
      <section className="px-5 pb-28 pt-5">
        <ReassuranceHero />

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_16px_45px_rgba(49,78,58,0.07)]">
          <div className="flex items-center justify-between gap-3"><SectionTitle eyebrow="오늘의 생활" title="오늘도 생활이 자연스럽게 기록되고 있어요" /><span className="shrink-0 rounded-full bg-[#EDF6EE] px-3 py-1 text-xs font-black text-[#39704A]">잘 기록 중</span></div>
          <div className="mt-5 divide-y divide-[#EEF1EE]">
            {todaySignals.slice(0, 4).map((signal) => <SignalRow key={signal.type} signal={signal} />)}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#7D857F]"><ShieldCheck size={15} /> 통화 내용은 보지 않아요.</p>
        </section>

        <section className="mt-5 rounded-[28px] bg-[#FFF8ED] p-6">
          <SectionTitle eyebrow="오늘의 순간" title="오늘 남기고 싶은 순간이 있나요?" />
          <p className="mt-2 font-semibold leading-7 text-[#746B60]">사진 한 장도, 짧은 글도 좋아요.</p>
          {isWriting ? <MomentComposer onCancel={() => setIsWriting(false)} onSave={(moment) => { onAddMoment(moment); setIsWriting(false); }} /> : <button type="button" onClick={() => setIsWriting(true)} className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-5 font-black text-white"><ImagePlus size={19} />오늘의 순간 남기기</button>}
          {moments.length ? <div className="mt-5 border-t border-[#F0E5D5] pt-4"><p className="text-sm font-black text-[#746B60]">최근 남긴 순간</p><p className="mt-2 line-clamp-2 font-bold">{moments[0].title}</p></div> : null}
        </section>

        <Link href="/family/report" className="mt-5 flex items-center justify-between rounded-[24px] border border-[#E1E8E1] bg-white p-5">
          <span className="flex items-center gap-4"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF4EE] text-[#2F6B46]"><BarChart3 /></span><span><strong className="block">최근 생활 변화 보기</strong><small className="mt-1 block font-semibold text-[#737C75]">AI가 최근 변화를 살펴봤어요</small></span></span><ChevronRight />
        </Link>
      </section>
    </AppFrame>
  );
}

function ReassuranceHero() {
  const reassuringMessages = ["오늘도 몸을 움직였어요", "평소처럼 하루를 시작했어요", "소중한 사람과 연락했어요"];
  return (
    <section className="overflow-hidden rounded-[30px] bg-[#2F6B46] p-6 text-white shadow-[0_24px_65px_rgba(47,107,70,0.23)]">
      <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-black text-[#D5EBD8]"><span className="size-2 rounded-full bg-[#9DE2A8]" />오늘도 안심이에요</p><span className="text-xs font-bold text-white/65">오후 8:20 기준</span></div>
      <p className="mt-6 text-2xl font-black leading-9">오늘도 평소처럼<br />지내고 계세요 😊</p>
      <p className="mt-3 text-sm font-bold text-white/65">오늘의 안심 {todayReport.score}점</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {reassuringMessages.map((message) => <p key={message} className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-bold"><Check size={16} className="shrink-0 text-[#B9E7BF]" />{message}</p>)}
      </div>
    </section>
  );
}

function SignalRow({ signal }: { signal: (typeof todaySignals)[number] }) {
  const icons = { steps: Footprints, daily_rhythm: Clock3, call_activity: Phone, app_activity: Activity, mobility: Activity };
  const Icon = icons[signal.type];
  const copy = {
    steps: ["오늘도 몸을 움직였어요", "평소만큼 움직였어요"],
    daily_rhythm: ["오늘도 평소처럼 하루를 시작했어요", "편안한 흐름이에요"],
    call_activity: ["오늘도 소중한 사람과 연락했어요", "평소와 비슷해요"],
    app_activity: ["오늘도 생활이 자연스럽게 기록되고 있어요", "잘 기록되고 있어요"],
    mobility: ["오늘도 익숙한 곳을 다녀오셨어요", "평소와 비슷해요"],
  }[signal.type];
  return <div className="flex items-center gap-3 py-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#F0F5F0] text-[#3D6F4B]"><Icon size={19} /></span><span><strong className="block text-sm leading-6">{copy[0]}</strong><small className="font-semibold text-[#848C86]">{copy[1]}</small></span></div>;
}

function MomentComposer({ onCancel, onSave }: { onCancel: () => void; onSave: (moment: FamilyTrace) => void }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();

  function readImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  const canSave = Boolean(text.trim() || imageUrl);
  return <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between"><strong>오늘의 순간 남기기</strong><button type="button" onClick={onCancel} className="flex size-9 items-center justify-center rounded-full bg-[#F5F2EC]" aria-label="닫기"><X size={17} /></button></div>
    {imageUrl ? <div className="relative mt-4"><img src={imageUrl} alt="선택한 오늘의 순간" className="h-44 w-full rounded-2xl object-cover" /><label className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-white px-3 py-2 text-xs font-black shadow"><input type="file" accept="image/*" onChange={readImage} className="sr-only" />사진 바꾸기</label></div> : <label className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D8CBB8] bg-[#FFFCF7] text-sm font-black text-[#746B60]"><ImagePlus size={22} /><span>사진 고르기 <small className="font-semibold">(선택)</small></span><input type="file" accept="image/*" onChange={readImage} className="sr-only" /></label>}
    <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={120} placeholder="짧은 글을 남겨보세요. (선택)" className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-[#E6DED2] px-4 py-3 font-semibold outline-none focus:border-[#6E9174]" />
    <p className="mt-2 text-xs font-semibold text-[#948A7D]">사진만 또는 글만 남겨도 괜찮아요.</p>
    <button type="button" disabled={!canSave} onClick={() => onSave({ id: `moment-${Date.now()}`, kind: imageUrl ? "photo" : "memo", sender: "나", title: text.trim() || "사진으로 오늘의 순간을 남겼어요.", emoji: imageUrl ? "📷" : "✍️", imageUrl, createdAt: new Date().toISOString() })} className="mt-4 min-h-12 w-full rounded-2xl bg-[#2F6B46] px-5 font-black text-white disabled:bg-[#C8D2C9]">가족에게 전하기</button>
  </div>;
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
