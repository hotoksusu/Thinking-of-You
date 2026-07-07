"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Footprints,
  HeartHandshake,
  Home,
  ImagePlus,
  Images,
  Leaf,
  PencilLine,
  Phone,
  Settings,
  ShieldCheck,
  Sprout,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { familyTraces, getFarmGrowth, todaySignals, type FamilyTrace } from "@/lib/life-pattern";
import { BottomTabBar } from "@/components/bottom-tab-bar";

type ExperienceRole = "parent" | "family";
type ParentView = "home" | "record" | "photos" | "farm" | "profile";
type FamilyView = "home" | "reassurance" | "changes" | "profile";

export function UserMode({ initialRole, initialParentView = "home", initialFamilyView = "home" }: { initialRegistered: boolean; initialRole?: ExperienceRole; initialParentView?: ParentView; initialFamilyView?: FamilyView }) {
  const [role, setRole] = useState<ExperienceRole | null>(initialRole ?? null);
  const [moments, setMoments] = useState<FamilyTrace[]>(familyTraces);

  if (!role) return <RoleSelect onSelect={setRole} />;
  return role === "parent"
    ? <ParentHome moments={moments} initialView={initialParentView} />
    : <FamilyHome moments={moments} initialView={initialFamilyView} onAddMoment={(moment) => setMoments((current) => [moment, ...current])} />;
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

function ParentHome({ moments, initialView }: { moments: FamilyTrace[]; initialView: ParentView }) {
  const farm = getFarmGrowth(todaySignals, moments);
  const [checkInStep, setCheckInStep] = useState<"home" | "done">("home");
  const [selectedMood, setSelectedMood] = useState("");
  const moods = [
    { emoji: "😊", label: "좋았어요" },
    { emoji: "🙂", label: "괜찮아요" },
    { emoji: "😴", label: "피곤해요" },
    { emoji: "😟", label: "조금 힘들어요" },
  ];

  if (checkInStep === "done") {
    return (
      <AppFrame active="home" parentView="record">
        <ParentSectionHeader title="오늘 기록 완료" />
        <section className="px-5 pb-28 pt-8">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-[#FFF9F0] p-7 text-center shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <img src="/brand/farm-mascot.png" alt="칭찬을 전하는 안심이" className="mx-auto size-36 rounded-[28px] object-cover" />
            <p className="mt-7 text-[2rem] font-black leading-tight text-[#222222]">👏 오늘도<br />잘하셨어요.</p>
            <p className="mt-5 text-[1.3rem] font-bold leading-9 text-[#37433D]">오늘 하루가 잘 기록됐어요.<br />이제 편하게 쉬세요.</p>
            <p className="mt-5 rounded-2xl bg-[#EAF3E5] p-4 text-xl font-black leading-8 text-[#315B3D]">🌱 오늘 기록으로<br />토마토도 한 뼘 자랐어요.</p>
            <Link href="/app?role=parent" className="mt-8 flex min-h-[72px] w-full items-center justify-center rounded-2xl bg-[#2F6B46] px-6 text-[1.4rem] font-black text-white">처음 화면으로</Link>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "record") {
    return (
      <AppFrame active="home" parentView="record">
        <ParentSectionHeader title="오늘 하루 기록" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-white p-7 shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <p className="text-xl font-black text-[#477052]">하나만 골라주세요.</p>
            <h1 className="mt-3 text-[2.15rem] font-black leading-tight text-[#17221B]">오늘 기분은<br />어떠셨어요?</h1>
            <div className="mt-8 grid gap-4">
              {moods.map((mood) => (
                <button key={mood.label} type="button" onClick={() => setSelectedMood(mood.label)} className={`flex min-h-[82px] w-full items-center gap-5 rounded-[22px] border-2 px-6 text-left text-[1.45rem] font-black transition ${selectedMood === mood.label ? "border-[#E9652B] bg-[#FFF1E8] text-[#9A3E18]" : "border-[#DDE5DC] bg-[#FAFCF9] text-[#222222]"}`}>
                  <span className="text-[2.35rem]" aria-hidden>{mood.emoji}</span>{mood.label}{selectedMood === mood.label ? <Check className="ml-auto text-[#E9652B]" size={29} aria-hidden /> : null}
                </button>
              ))}
            </div>
            <button type="button" disabled={!selectedMood} onClick={() => setCheckInStep("done")} className="mt-8 min-h-[76px] w-full rounded-[22px] bg-[#E9652B] px-6 text-[1.45rem] font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.24)] disabled:bg-[#C8CEC6] disabled:shadow-none">오늘 기록 마치기</button>
            <p className="mt-4 text-center text-base font-bold text-[#77817A]">천천히 하셔도 괜찮아요.</p>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "photos") {
    return (
      <AppFrame active="home" parentView="photos">
        <ParentSectionHeader title="가족이 보낸 사진" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px]">
            <p className="text-xl font-black leading-8 text-[#37433D]">가족의 반가운 소식을<br />사진과 함께 보세요.</p>
            <div className="mt-6 grid gap-6">
              {moments.map((moment, index) => (
                <article key={moment.id} className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_48px_rgba(49,78,58,0.10)]">
                  {moment.imageUrl ? <img src={moment.imageUrl} alt={moment.title} className="aspect-[4/3] w-full object-cover" /> : <div className={`flex aspect-[4/3] items-center justify-center text-[6rem] ${index % 2 ? "bg-[#EAF3E5]" : "bg-[#FFF3E8]"}`}>{moment.emoji}</div>}
                  <div className="p-6 sm:p-7">
                    <p className="text-lg font-black text-[#477052]">{moment.sender}님이 보냈어요</p>
                    <h2 className="mt-3 text-[1.45rem] font-black leading-9 text-[#17221B]">{moment.title}</h2>
                    <p className="mt-3 text-base font-bold text-[#7A847D]">최근에 도착한 소식</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "farm") {
    return (
      <AppFrame active="home" parentView="farm">
        <ParentSectionHeader title="내 농장" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-[#EAF3E5] p-7 text-center shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <img src="/brand/farm-mascot.png" alt="토마토를 키우는 안심이" className="mx-auto size-44 rounded-[30px] object-cover" />
            <p className="mt-6 text-xl font-black text-[#477052]">정희님의 토마토</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight text-[#17221B]">오늘도 한 뼘<br />자랐어요.</h1>
            <div className="mt-7 h-5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#78A76E]" style={{ width: `${farm.percent}%` }} /></div>
            <p className="mt-4 text-xl font-black text-[#315B3D]">지금 {farm.percent}% 자랐어요</p>
            <p className="mt-5 text-lg font-bold leading-8 text-[#526258]">오늘 기록을 남기면<br />토마토가 조금 더 자라요.</p>
            <Link href="/farm" className="mt-8 flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-6 text-[1.35rem] font-black text-white">농장 자세히 보기 <ChevronRight size={25} /></Link>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "profile") {
    return (
      <AppFrame active="home" parentView="profile">
        <ParentSectionHeader title="내정보" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px]">
            <section className="rounded-[28px] bg-white p-6 shadow-[0_16px_42px_rgba(49,78,58,0.08)]">
              <div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-full bg-[#FFF0E6] text-[2.5rem]">👩</span><div><p className="text-[1.55rem] font-black">김정희님</p><p className="mt-2 text-lg font-bold text-[#69736D]">오늘안부를 사용 중이에요</p></div></div>
            </section>
            <div className="mt-5 grid gap-4">
              <ParentSettingLink href="/settings/notifications" icon={<Bell />} title="알림 시간" description="저녁 8시에 알려드려요." />
              <ParentSettingLink href="/family/members" icon={<UsersRound />} title="연결된 가족" description="지은님, 민수님과 연결됐어요." />
              <ParentSettingLink href="/guide" icon={<Settings />} title="사용 방법" description="오늘안부 사용법을 다시 봐요." />
            </div>
            <p className="mt-7 text-center text-base font-bold leading-7 text-[#768079]">도움이 필요하면<br />가족에게 편하게 물어보세요.</p>
          </div>
        </section>
      </AppFrame>
    );
  }

  return (
    <AppFrame active="home" parentView="home">
      <ParentSectionHeader title="정희님의 오늘안부" home />
      <section className="px-5 pb-36 pt-7">
        <div className="mx-auto max-w-[560px]">
          <p className="text-xl font-black text-[#477052]">정희님, 안녕하세요.</p>
          <h1 className="mt-2 text-[2.15rem] font-black leading-tight text-[#17221B]">오늘 하루를<br />남겨볼까요?</h1>
          <section className="mt-7 rounded-[30px] bg-[#2F6B46] p-7 text-white shadow-[0_22px_58px_rgba(47,107,70,0.22)]">
            <p className="text-lg font-black text-[#D5EBD8]">오늘 아직 기록 전이에요</p>
            <p className="mt-3 text-[1.55rem] font-black leading-9">기분 하나만 고르면<br />오늘 기록이 끝나요.</p>
            <Link href="/app?role=parent&view=record" className="mt-6 flex min-h-[78px] w-full items-center justify-center gap-3 rounded-[22px] bg-[#FFF7ED] px-5 text-[1.5rem] font-black text-[#9A3E18] shadow-[0_12px_28px_rgba(0,0,0,0.14)]"><PencilLine size={28} />오늘 기분 남기기</Link>
          </section>
          <p className="mt-8 text-xl font-black text-[#37433D]">다른 것도 둘러보세요</p>
          <div className="mt-4 grid gap-4">
            <ParentMenuCard href="/app?role=parent&view=photos" icon={<Images size={34} />} eyebrow="가족 소식" title="가족 사진 보기" description="가족이 보낸 사진을 크게 봐요." tone="blue" />
            <ParentMenuCard href="/app?role=parent&view=farm" icon={<Sprout size={34} />} eyebrow="나의 즐거움" title="내 농장 보기" description="토마토가 얼마나 자랐는지 봐요." tone="green" />
          </div>
        </div>
      </section>
    </AppFrame>
  );
}

function ParentSectionHeader({ title, home = false }: { title: string; home?: boolean }) {
  return <header className="sticky top-0 z-20 border-b border-[#DCE5DC] bg-[#F7F9F6]/95 px-5 py-5 backdrop-blur"><div className="mx-auto flex max-w-[560px] items-center gap-3">{home ? <span className="flex size-12 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><Bell size={23} /></span> : <Link href="/app?role=parent" aria-label="처음 화면으로" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#D7E0D6] bg-white text-[#2F3D34] shadow-sm"><ArrowLeft size={25} /></Link>}<h1 className="text-[1.55rem] font-black text-[#17221B]">{title}</h1></div></header>;
}

function ParentMenuCard({ href, icon, eyebrow, title, description, tone }: { href: string; icon: React.ReactNode; eyebrow: string; title: string; description: string; tone: "orange" | "blue" | "green" }) {
  const styles = {
    orange: "border-[#F4C9B5] bg-[#FFF7F1] text-[#B94A20]",
    blue: "border-[#C9DDE8] bg-[#F3F8FB] text-[#35677E]",
    green: "border-[#C8DDC9] bg-[#F0F7ED] text-[#35704A]",
  }[tone];
  return <Link href={href} className={`flex min-h-[154px] items-center gap-5 rounded-[28px] border-2 p-6 shadow-[0_14px_38px_rgba(49,78,58,0.07)] transition active:scale-[0.99] ${styles}`}><span className="flex size-16 shrink-0 items-center justify-center rounded-[22px] bg-white shadow-sm">{icon}</span><span className="min-w-0 flex-1"><span className="text-base font-black opacity-80">{eyebrow}</span><strong className="mt-1 block text-[1.55rem] font-black leading-tight text-[#17221B]">{title}</strong><span className="mt-2 block text-lg font-bold leading-7 text-[#657069]">{description}</span></span><ChevronRight className="shrink-0" size={28} /></Link>;
}

function ParentBottomNavigation({ active }: { active: ParentView }) {
  const tabs = [
    { id: "home" as const, label: "오늘", href: "/app?role=parent", icon: Home },
    { id: "photos" as const, label: "사진", href: "/app?role=parent&view=photos", icon: Images },
    { id: "farm" as const, label: "농장", href: "/app?role=parent&view=farm", icon: Sprout },
    { id: "profile" as const, label: "내정보", href: "/app?role=parent&view=profile", icon: UserRound },
  ];
  return <nav aria-label="부모님 메뉴" className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px] border-t border-[#D8E2D8] bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur"><div className="grid grid-cols-4 gap-1">{tabs.map((tab) => { const Icon = tab.icon; const selected = active === tab.id || (active === "record" && tab.id === "home"); return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-base font-black leading-tight ${selected ? "bg-[#FFF0E6] text-[#D95423]" : "text-[#526059]"}`}><Icon size={28} strokeWidth={selected ? 2.8 : 2.2} /><span className="whitespace-nowrap">{tab.label}</span></Link>; })}</div></nav>;
}

function ParentSettingLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link href={href} className="flex min-h-[104px] items-center gap-5 rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(49,78,58,0.07)]"><span className="flex size-16 shrink-0 items-center justify-center rounded-[20px] bg-[#EAF3E9] text-[#2F6B46]">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-[1.3rem] font-black">{title}</strong><small className="mt-2 block text-base font-bold leading-6 text-[#69736D]">{description}</small></span><ChevronRight className="shrink-0" size={28} /></Link>;
}

function FamilyHome({ moments, initialView, onAddMoment }: { moments: FamilyTrace[]; initialView: FamilyView; onAddMoment: (moment: FamilyTrace) => void }) {
  const [isWriting, setIsWriting] = useState(false);

  if (initialView === "reassurance") {
    return (
      <FamilyAppFrame active="reassurance">
        <FamilySectionHeader title="오늘의 안심" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <section className="rounded-[30px] bg-[#2F6B46] p-7 text-white shadow-[0_22px_58px_rgba(47,107,70,0.22)]">
              <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black">오늘 오후 8:20 기준</span><ShieldCheck size={30} /></div>
              <h1 className="mt-7 text-[2rem] font-black leading-tight">엄마는 오늘도<br />평소와 비슷해요.</h1>
              <p className="mt-4 text-lg font-bold leading-8 text-white/80">지금 바로 확인할 변화는 없어요.</p>
            </section>
            <section className="mt-5 rounded-[26px] bg-white p-6 shadow-[0_14px_38px_rgba(49,78,58,0.07)]">
              <h2 className="text-xl font-black">한눈에 보는 오늘</h2>
              <div className="mt-4 divide-y divide-[#E8EEE8]">
                {["평소처럼 하루를 시작했어요", "오늘도 몸을 움직였어요", "가족과 연락을 나눴어요"].map((item) => <p key={item} className="flex items-center gap-3 py-4 text-base font-bold"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAF3E9] text-[#2F6B46]"><Check size={18} /></span>{item}</p>)}
              </div>
            </section>
            <section className="mt-5 rounded-[26px] border border-[#F0D7C6] bg-[#FFF8F2] p-6">
              <p className="text-sm font-black text-[#B95327]">오늘안부가 전하는 한마디</p>
              <p className="mt-3 text-lg font-black leading-8">걱정되는 변화는 없어요.<br />평소처럼 안부를 나눠보세요.</p>
            </section>
          </div>
        </section>
      </FamilyAppFrame>
    );
  }

  if (initialView === "changes") {
    return (
      <FamilyAppFrame active="changes">
        <FamilySectionHeader title="최근 변화" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <p className="text-lg font-bold leading-8 text-[#657069]">숫자보다 달라진 점만<br />쉽게 정리했어요.</p>
            <div className="mt-5 grid gap-4">
              <FamilyChangeCard icon={<Footprints />} title="생활 움직임" value="평소와 비슷해요" detail="최근 7일 동안 큰 변화가 없어요." />
              <FamilyChangeCard icon={<Clock3 />} title="하루 리듬" value="안정적으로 이어져요" detail="기상과 활동 시간이 평소 범위예요." />
              <FamilyChangeCard icon={<Phone />} title="가족 연락" value="꾸준히 이어졌어요" detail="이번 주에도 가족과 연락했어요." />
            </div>
            <Link href="/family/report" className="mt-6 flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 border-[#2F6B46] bg-white px-5 text-lg font-black text-[#2F6B46]">자세한 변화 보기 <ChevronRight size={22} /></Link>
          </div>
        </section>
      </FamilyAppFrame>
    );
  }

  if (initialView === "profile") {
    return (
      <FamilyAppFrame active="profile">
        <FamilySectionHeader title="내정보" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <section className="rounded-[26px] bg-white p-6 shadow-[0_14px_38px_rgba(49,78,58,0.07)]">
              <p className="text-sm font-black text-[#477052]">연결된 부모님</p>
              <div className="mt-4 flex items-center gap-4"><span className="flex size-16 items-center justify-center rounded-full bg-[#FFF0E6] text-3xl">👩</span><div><h1 className="text-xl font-black">김정희님</h1><p className="mt-1 font-bold text-[#727C75]">어머니 · 연결됨</p></div><span className="ml-auto rounded-full bg-[#EAF3E9] px-3 py-2 text-sm font-black text-[#2F6B46]">안심</span></div>
            </section>
            <div className="mt-5 grid gap-3">
              <FamilySettingLink href="/family/members" icon={<UsersRound />} title="가족 연결 관리" description="함께 확인할 가족을 관리해요." />
              <FamilySettingLink href="/settings/notifications" icon={<Bell />} title="알림 설정" description="알림 받을 시간과 내용을 정해요." />
              <FamilySettingLink href="/guide" icon={<Settings />} title="이용 방법" description="부모님 연결과 사용법을 확인해요." />
            </div>
          </div>
        </section>
      </FamilyAppFrame>
    );
  }

  return (
    <FamilyAppFrame active="home">
      <FamilySectionHeader title="엄마의 오늘" />
      <section className="px-5 pb-32 pt-5">
        <div className="mx-auto max-w-[620px]">
        <ReassuranceHero />

        <section className="mt-5 grid grid-cols-2 gap-3">
          <a href="tel:010-1234-5678" className="flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-[24px] bg-[#FFF0E6] text-base font-black text-[#B94A20]"><Phone size={26} />엄마께 전화하기</a>
          <button type="button" onClick={() => setIsWriting(true)} className="flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-[24px] bg-[#EAF3E9] text-base font-black text-[#2F6B46]"><ImagePlus size={26} />사진 보내기</button>
        </section>

        {isWriting ? <section className="mt-5 rounded-[28px] bg-[#FFF8ED] p-5"><MomentComposer onCancel={() => setIsWriting(false)} onSave={(moment) => { onAddMoment(moment); setIsWriting(false); }} /></section> : null}

        <Link href="/app?role=family&view=changes" className="mt-5 flex items-center justify-between rounded-[24px] border border-[#E1E8E1] bg-white p-5 shadow-[0_12px_34px_rgba(49,78,58,0.06)]">
          <span className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF4EE] text-[#2F6B46]"><TrendingUp /></span><span><strong className="block text-lg">최근 7일도 안정적이에요</strong><small className="mt-1 block font-semibold text-[#737C75]">달라진 점이 있는지 확인해 보세요</small></span></span><ChevronRight className="shrink-0" />
        </Link>

        <section className="mt-5 rounded-[24px] bg-[#FFF8ED] p-5">
          <div className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-2xl bg-white text-2xl">🌱</span><div><p className="font-black">엄마의 토마토도 잘 자라고 있어요</p><p className="mt-1 text-sm font-bold text-[#786B5E]">다음 수확까지 천천히 함께해요.</p></div></div>
        </section>
        </div>
      </section>
    </FamilyAppFrame>
  );
}

function ReassuranceHero() {
  return (
    <section className="overflow-hidden rounded-[30px] bg-[#2F6B46] p-6 text-white shadow-[0_24px_65px_rgba(47,107,70,0.23)]">
      <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-black text-[#D5EBD8]"><span className="size-2 rounded-full bg-[#9DE2A8]" />오늘 확인 완료</p><span className="text-xs font-bold text-white/65">오후 8:20 기준</span></div>
      <p className="mt-6 text-[1.75rem] font-black leading-10">엄마는 오늘도<br />평소와 비슷해요.</p>
      <p className="mt-3 text-base font-bold leading-7 text-white/75">지금 바로 확인할 변화는 없어요.</p>
      <Link href="/app?role=family&view=reassurance" className="mt-6 flex min-h-14 items-center justify-between rounded-2xl bg-white px-5 text-base font-black text-[#2F6B46]">오늘 상태 자세히 보기 <ChevronRight size={22} /></Link>
    </section>
  );
}

function FamilySectionHeader({ title }: { title: string }) {
  return <header className="sticky top-0 z-20 border-b border-[#DCE5DC] bg-[#F7F9F6]/95 px-5 py-4 backdrop-blur"><div className="mx-auto flex max-w-[620px] items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><HeartHandshake size={22} /></span><div><p className="text-xs font-black text-[#597061]">오늘안부 가족</p><h1 className="text-xl font-black text-[#17221B]">{title}</h1></div></div></header>;
}

function FamilyChangeCard({ icon, title, value, detail }: { icon: React.ReactNode; title: string; value: string; detail: string }) {
  return <article className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(49,78,58,0.07)]"><div className="flex items-center gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E9] text-[#2F6B46]">{icon}</span><div><p className="text-sm font-black text-[#68736C]">{title}</p><h2 className="mt-1 text-lg font-black">{value}</h2></div></div><p className="mt-4 border-t border-[#E8EEE8] pt-4 font-bold leading-7 text-[#69746D]">{detail}</p></article>;
}

function FamilySettingLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link href={href} className="flex min-h-[88px] items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(49,78,58,0.06)]"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4EE] text-[#2F6B46]">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-lg">{title}</strong><small className="mt-1 block font-semibold leading-5 text-[#737C75]">{description}</small></span><ChevronRight className="shrink-0" /></Link>;
}

function FamilyBottomNavigation({ active }: { active: FamilyView }) {
  const tabs = [
    { id: "home" as const, label: "부모님", href: "/app?role=family", icon: HeartHandshake },
    { id: "reassurance" as const, label: "안심", href: "/app?role=family&view=reassurance", icon: ShieldCheck },
    { id: "changes" as const, label: "변화", href: "/app?role=family&view=changes", icon: TrendingUp },
    { id: "profile" as const, label: "내정보", href: "/app?role=family&view=profile", icon: UserRound },
  ];
  return <nav aria-label="가족 메뉴" className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px] border-t border-[#D8E2D8] bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur"><div className="grid grid-cols-4 gap-1">{tabs.map((tab) => { const Icon = tab.icon; const selected = active === tab.id; return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.95rem] font-black ${selected ? "bg-[#EAF3E9] text-[#2F6B46]" : "text-[#59655E]"}`}><Icon size={26} strokeWidth={selected ? 2.8 : 2.1} /><span>{tab.label}</span></Link>; })}</div></nav>;
}

function FamilyAppFrame({ children, active }: { children: React.ReactNode; active: FamilyView }) {
  return <main className="app-frame min-h-screen bg-[#F7F9F6] text-[#17221B]">{children}<FamilyBottomNavigation active={active} /></main>;
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

function Brand() {
  return <Link href="/" className="inline-flex items-center gap-2 font-black"><span className="flex size-9 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><Bell size={18} /></span>오늘안부</Link>;
}

function AppFrame({ children, active, parentView }: { children: React.ReactNode; active: "home" | "family"; parentView?: ParentView }) {
  return <main className="app-frame min-h-screen bg-[#F7F9F6] text-[#17221B]">{children}{parentView ? <ParentBottomNavigation active={parentView} /> : <BottomTabBar active={active} />}</main>;
}
