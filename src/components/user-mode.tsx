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
import { BottomTabBar } from "@/components/bottom-tab-bar";

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
    <main className="min-h-screen bg-[#F4F7F3] px-5 py-6 text-[#17221B] sm:py-10">
      <div className="mx-auto max-w-[760px]">
        <Brand />
        <section className="mt-10 text-center sm:mt-14">
          <h1 className="text-[2.15rem] font-black leading-tight sm:text-5xl">누가 시작하시나요?</h1>
          <p className="mt-3 text-lg font-semibold text-[#657069]">사용할 화면을 선택해 주세요.</p>
        </section>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <RoleCard icon={<Leaf />} role="부모님" description="평소 생활로 가족에게 안부를 전해요." actionLabel="부모님으로 시작하기" onClick={() => onSelect("parent")} />
          <RoleCard icon={<HeartHandshake />} role="가족" description="부모님의 오늘과 변화를 확인해요." actionLabel="가족으로 시작하기" onClick={() => onSelect("family")} />
        </div>
      </div>
    </main>
  );
}

function RoleCard({ icon, role, description, actionLabel, onClick }: { icon: React.ReactNode; role: string; description: string; actionLabel: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group rounded-[28px] border-2 border-[#DCE7DC] bg-white p-5 text-left shadow-[0_18px_55px_rgba(49,78,58,0.08)] transition hover:-translate-y-1 hover:border-[#83A98C] sm:p-6">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EAF3E9] text-[#2F6B46]">{icon}</span>
      <h2 className="mt-5 text-[1.7rem] font-black">{role}</h2>
      <p className="mt-2 min-h-14 text-lg font-semibold leading-7 text-[#6D766F]">{description}</p>
      <span className="mt-5 flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-5 text-xl font-black text-white shadow-[0_12px_28px_rgba(47,107,70,0.22)] transition group-hover:bg-[#285D3D]">{actionLabel} <ArrowRight size={22} /></span>
    </button>
  );
}

function ParentHome({ moments, onSwitch }: { moments: FamilyTrace[]; onSwitch: () => void }) {
  const farm = getFarmGrowth(todaySignals, moments);
  const [checkInStep, setCheckInStep] = useState<"home" | "mood" | "done">("home");
  const [selectedMood, setSelectedMood] = useState("");

  if (checkInStep === "mood") {
    const moods = [
      { emoji: "😊", label: "좋았어요" },
      { emoji: "🙂", label: "괜찮아요" },
      { emoji: "😴", label: "피곤해요" },
      { emoji: "😟", label: "조금 힘들어요" },
    ];
    return (
      <AppFrame active="home">
        <TopBar label="오늘 하루 돌아보기" onSwitch={() => setCheckInStep("home")} switchLabel="돌아가기" senior />
        <section className="px-5 pb-28 pt-8">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-white p-7 shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <p className="text-xl font-black text-[#477052]">천천히 골라도 괜찮아요.</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight text-[#222222]">오늘 기분은<br />어떠셨어요?</h1>
            <div className="mt-8 grid gap-4">
              {moods.map((mood) => (
                <button key={mood.label} type="button" onClick={() => setSelectedMood(mood.label)} className={`flex min-h-[76px] w-full items-center gap-5 rounded-[22px] border-2 px-6 text-left text-[1.4rem] font-black transition ${selectedMood === mood.label ? "border-[#E9652B] bg-[#FFF1E8] text-[#9A3E18]" : "border-[#DDE5DC] bg-[#FAFCF9] text-[#222222]"}`}>
                  <span className="text-[2.2rem]" aria-hidden>{mood.emoji}</span>{mood.label}{selectedMood === mood.label ? <Check className="ml-auto text-[#E9652B]" size={27} aria-hidden /> : null}
                </button>
              ))}
            </div>
            <button type="button" disabled={!selectedMood} onClick={() => setCheckInStep("done")} className="mt-8 min-h-[68px] w-full rounded-2xl bg-[#E9652B] px-6 text-[1.4rem] font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.24)] disabled:bg-[#C8CEC6] disabled:shadow-none">가족에게 안심 전하기</button>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (checkInStep === "done") {
    return (
      <AppFrame active="home">
        <TopBar label="오늘의 안심" onSwitch={() => setCheckInStep("home")} switchLabel="홈으로" senior />
        <section className="px-5 pb-28 pt-8">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-[#FFF9F0] p-7 text-center shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <img src="/brand/farm-mascot.png" alt="칭찬을 전하는 안심이" className="mx-auto size-36 rounded-[28px] object-cover" />
            <p className="mt-7 text-[2rem] font-black leading-tight text-[#222222]">👏 오늘도<br />잘하셨어요.</p>
            <p className="mt-5 text-[1.3rem] font-bold leading-9 text-[#37433D]">오늘 하루도 잘 남겨주셨어요.<br />가족에게 따뜻한 안심이 전해졌어요.</p>
            <p className="mt-5 rounded-2xl bg-[#EAF3E5] p-4 text-xl font-black leading-8 text-[#315B3D]">🌱 안심이와 농장도<br />오늘 한 뼘 자랐어요.</p>
            <button type="button" onClick={() => { setCheckInStep("home"); setSelectedMood(""); }} className="mt-8 min-h-[68px] w-full rounded-2xl bg-[#2F6B46] px-6 text-[1.4rem] font-black text-white">홈으로 돌아가기</button>
          </div>
        </section>
      </AppFrame>
    );
  }

  return (
    <AppFrame active="home">
      <TopBar label="정희님의 오늘" onSwitch={onSwitch} switchLabel="가족 화면" senior />
      <section className="px-5 pb-28 pt-7">
        <section className="rounded-[30px] bg-[#2F6B46] p-7 text-white shadow-[0_24px_65px_rgba(47,107,70,0.23)] sm:p-9">
          <p className="text-[1.15rem] font-black text-[#D5EBD8]">😊 오늘도 평소처럼 보내고 계세요.</p>
          <h1 className="mt-5 text-[2rem] font-black leading-tight">오늘도<br />편안한 하루예요.</h1>
          <p className="mt-5 text-[1.25rem] font-bold leading-9 text-white">AI가 생활 변화를<br />조용히 살펴보고 있어요.</p>
          <button type="button" onClick={() => setCheckInStep("mood")} className="mt-8 min-h-[70px] w-full rounded-2xl bg-[#FFF7ED] px-6 text-[1.45rem] font-black text-[#9A3E18] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">오늘 하루 돌아보기</button>
          <p className="mt-5 text-[1.05rem] font-bold leading-8 text-[#E8F3E9]">신경 쓰지 않아도 가족에게<br />필요한 안심을 전해드려요.</p>
        </section>

        {moments.length ? (
          <section className="mt-8 rounded-[28px] bg-[#FFF8ED] p-7">
            <p className="text-lg font-black text-[#7A573D]">가족이 소식을 보냈어요.</p>
            <p className="mt-3 text-[1.35rem] font-black leading-9 text-[#222222]">{moments[0].emoji} {moments[0].title}</p>
            <p className="mt-3 text-lg font-bold text-[#755F4D]">{moments[0].sender} · 조금 전</p>
          </section>
        ) : null}

        <Link href="/farm" className="mt-8 block rounded-[28px] bg-[#EAF3E5] p-7 text-[#24372B] shadow-[0_18px_45px_rgba(49,78,58,0.08)]">
          <div className="flex items-start justify-between">
            <div><p className="text-lg font-black text-[#477052]">안심이의 농장 소식</p><h2 className="mt-3 text-[1.65rem] font-black leading-tight">토마토가<br />한 뼘 자랐어요.</h2></div>
            <span className="text-5xl">🍅</span>
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#78A76E]" style={{ width: `${farm.percent}%` }} /></div>
          <p className="mt-5 flex min-h-16 items-center justify-between rounded-2xl bg-white px-5 text-xl font-black text-[#315B3D]">농장 구경하기 <ChevronRight size={24} /></p>
        </Link>
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

function TopBar({ label, onSwitch, switchLabel, senior = false }: { label: string; onSwitch: () => void; switchLabel: string; senior?: boolean }) {
  return <header className={`sticky top-0 z-20 flex items-center justify-between border-b border-[#DCE5DC] bg-[#F7F9F6]/95 px-5 backdrop-blur ${senior ? "py-5" : "py-4"}`}><div><Brand /><p className={`mt-2 font-black text-[#222222] ${senior ? "text-[1.65rem]" : "text-xl"}`}>{label}</p></div><button type="button" onClick={onSwitch} className={`rounded-full border border-[#D7E0D6] bg-white font-black text-[#37433D] shadow-sm ${senior ? "min-h-12 px-4 text-base" : "px-3 py-2 text-xs"}`}>{switchLabel}</button></header>;
}

function AppFrame({ children, active }: { children: React.ReactNode; active: "home" | "family" }) {
  return <main className="app-frame min-h-screen bg-[#F7F9F6] text-[#17221B]">{children}<BottomTabBar active={active} /></main>;
}
