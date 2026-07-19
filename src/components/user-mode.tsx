"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Footprints,
  HeartHandshake,
  Home,
  ImagePlus,
  Images,
  Leaf,
  PackageOpen,
  Phone,
  Settings,
  ShieldCheck,
  Sprout,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { familyTraces, getFarmGrowth, todayReport, todaySignals, type FamilyTrace } from "@/lib/life-pattern";

type ExperienceRole = "parent" | "family";
type ParentView = "home" | "record" | "photos" | "farm" | "profile" | "guide";
type FamilyView = "home" | "reassurance" | "changes" | "compose" | "farm" | "profile" | "guide";

const moods = [
  { emoji: "😊", label: "좋았어요" },
  { emoji: "🙂", label: "괜찮아요" },
  { emoji: "😴", label: "피곤해요" },
  { emoji: "😟", label: "조금 힘들어요" },
];

export function UserMode({
  initialRole,
  initialParentView = "home",
  initialFamilyView = "home",
}: {
  initialRegistered: boolean;
  initialRole?: ExperienceRole;
  initialParentView?: ParentView;
  initialFamilyView?: FamilyView;
}) {
  const [role, setRole] = useState<ExperienceRole | null>(initialRole ?? null);
  const [moments, setMoments] = useState<FamilyTrace[]>(familyTraces);

  if (!role) return <RoleSelect onSelect={setRole} />;
  return role === "parent" ? (
    <ParentHome moments={moments} initialView={initialParentView} />
  ) : (
    <FamilyHome moments={moments} initialView={initialFamilyView} onAddMoment={(moment) => setMoments((current) => [moment, ...current])} />
  );
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
          <RoleCard icon={<Leaf />} role="부모님" description="평소처럼 생활하고 가족 소식과 농장을 확인해요." actionLabel="부모님으로 시작하기" onClick={() => onSelect("parent")} />
          <RoleCard icon={<HeartHandshake />} role="가족" description="오늘의 안심과 생활 변화를 확인하고 소식을 남겨요." actionLabel="가족으로 시작하기" onClick={() => onSelect("family")} />
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
      <span className="mt-5 flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-5 text-xl font-black text-white shadow-[0_12px_28px_rgba(47,107,70,0.22)] transition group-hover:bg-[#285D3D]">
        {actionLabel} <ArrowRight size={22} />
      </span>
    </button>
  );
}

function ParentHome({ moments, initialView }: { moments: FamilyTrace[]; initialView: ParentView }) {
  const farm = getFarmGrowth(todaySignals, moments);
  const [checkInStep, setCheckInStep] = useState<"home" | "done">("home");
  const [selectedMood, setSelectedMood] = useState("");

  if (checkInStep === "done") {
    return (
      <AppFrame role="parent" active={initialView === "home" ? "home" : initialView} hideNavigation>
        <section className="flex min-h-screen items-center px-5 py-10">
          <div className="mx-auto w-full max-w-[560px] rounded-[36px] bg-white p-7 text-center shadow-[0_24px_70px_rgba(49,78,58,0.13)] sm:p-10">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#EAF3E5] text-[#2F6B46]">
              <Check size={52} strokeWidth={3} aria-hidden />
            </div>
            <p className="mt-7 text-[2.25rem] font-black leading-tight text-[#17221B]">오늘도 완료했어요!</p>
            <p className="mt-3 text-[1.35rem] font-black text-[#D95423]">18일 연속 기록 중이에요.</p>
            <div className="mt-7 grid gap-3 text-left">
              <div className="flex items-center gap-4 rounded-[22px] bg-[#F1F7F0] p-5"><HeartHandshake className="shrink-0 text-[#2F6B46]" size={30} aria-hidden /><p className="text-lg font-black leading-7">가족에게 안심 소식이 전달됐어요.</p></div>
              <div className="flex items-center gap-4 rounded-[22px] bg-[#FFF5EC] p-5"><Sprout className="shrink-0 text-[#D95423]" size={30} aria-hidden /><p className="text-lg font-black leading-7">농장이 자랐어요. 수확까지 3일!</p></div>
            </div>
            <p className="mt-7 text-lg font-bold text-[#667169]">오늘도 잘하셨어요.</p>
            <Link href="/app?role=parent" className="mt-6 flex min-h-[76px] w-full items-center justify-center rounded-[22px] bg-[#2F6B46] px-6 text-[1.35rem] font-black text-white shadow-[0_14px_32px_rgba(47,107,70,0.22)]">확인</Link>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "record") {
    return (
      <AppFrame role="parent" active="home" hideNavigation>
        <ParentSectionHeader title="오늘 기록하기" />
        <MoodPicker selectedMood={selectedMood} onSelect={setSelectedMood} onDone={() => setCheckInStep("done")} />
      </AppFrame>
    );
  }

  if (initialView === "photos") {
    return (
      <AppFrame role="parent" active="photos">
        <ParentSectionHeader title="가족 소식" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px]">
            <p className="text-xl font-black leading-8 text-[#37433D]">가족이 보낸 사진과 소식을 편하게 보세요.</p>
            <div className="mt-6 grid gap-6">
              {moments.map((moment, index) => (
                <article key={moment.id} className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_48px_rgba(49,78,58,0.10)]">
                  {moment.imageUrl ? <img src={moment.imageUrl} alt={moment.title} className="aspect-[4/3] w-full object-cover" /> : <div className={`flex aspect-[4/3] items-center justify-center text-[6rem] ${index % 2 ? "bg-[#EAF3E5]" : "bg-[#FFF3E8]"}`}>{moment.emoji}</div>}
                  <div className="p-6 sm:p-7">
                    <p className="text-lg font-black text-[#477052]">{moment.sender}님이 보낸 가족 소식</p>
                    <h2 className="mt-3 text-[1.45rem] font-black leading-9 text-[#17221B]">{moment.title}</h2>
                    <p className="mt-3 text-base font-bold text-[#7A847D]">부담 없이 천천히 둘러보세요.</p>
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
      <AppFrame role="parent" active="farm">
        <ParentSectionHeader title="안부농장" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px] rounded-[30px] bg-[#EAF3E5] p-7 text-center shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
            <img src="/brand/farm-mascot.png" alt="토마토를 키우는 안심이" className="mx-auto size-44 rounded-[30px] object-cover" />
            <p className="mt-6 text-xl font-black text-[#477052]">정희님의 토마토</p>
            <h1 className="mt-3 text-[2rem] font-black leading-tight text-[#17221B]">오늘도 생활이 쌓여 작물이 자라고 있어요.</h1>
            <div className="mt-7 h-5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#78A76E]" style={{ width: `${farm.percent}%` }} /></div>
            <p className="mt-4 text-xl font-black text-[#315B3D]">지금 {farm.percent}% 자랐어요</p>
            <p className="mt-5 text-lg font-bold leading-8 text-[#526258]">수확할 때가 되면 가족이 배송을 도와드려요.</p>
            <Link href="/farm" className="mt-8 flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-6 text-[1.35rem] font-black text-white">농장 자세히 보기 <ChevronRight size={25} /></Link>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "profile") {
    return (
      <AppFrame role="parent" active="profile">
        <ParentSectionHeader title="내정보" />
        <section className="px-5 pb-36 pt-7">
          <div className="mx-auto max-w-[560px]">
            <section className="rounded-[28px] bg-white p-6 shadow-[0_16px_42px_rgba(49,78,58,0.08)]">
              <div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-full bg-[#FFF0E6] text-[2.5rem]">👩</span><div><p className="text-[1.55rem] font-black">김정희님</p><p className="mt-2 text-lg font-bold text-[#69736D]">오늘안부를 사용 중이에요</p></div></div>
            </section>
            <div className="mt-5 grid gap-4">
              <SettingLink href="/settings/notifications" icon={<Bell />} title="알림 시간" description="저녁 8시에 알려드려요." tone="parent" />
              <SettingLink href="/family/members" icon={<UsersRound />} title="연결된 가족" description="지은님, 민수님과 연결됐어요." tone="parent" />
              <SettingLink href="/permissions" icon={<ShieldCheck />} title="연결 상태" description="생활 정보 연결을 확인해요." tone="parent" />
              <SettingLink href="/app?role=parent&view=guide" icon={<Leaf />} title="오늘안부 이용 안내" description="주요 서비스를 다시 볼 수 있어요." tone="parent" />
            </div>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "guide") {
    return (
      <AppFrame role="parent" active="home">
        <ParentSectionHeader title="오늘안부 이용 안내" />
        <ServiceGuide role="parent" />
      </AppFrame>
    );
  }

  return (
    <AppFrame role="parent" active="home">
      <section className="px-5 pb-36">
        <div className="mx-auto max-w-[560px]">
          <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-center py-10 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#EAF3E5] px-4 py-2 text-sm font-black text-[#2F6B46]"><ShieldCheck size={18} aria-hidden /> 생활 패턴 변화 감지 서비스</div>
            <p className="mt-8 text-xl font-black text-[#477052]">정희님, 안녕하세요.</p>
            <h1 className="mt-3 text-[2.35rem] font-black leading-[1.2] text-[#17221B]">오늘도 안부를<br />남겨볼까요?</h1>
            <p className="mt-5 text-xl font-bold leading-8 text-[#5E6A62]">기분만 선택해주세요.</p>
            <Link href="/app?role=parent&view=record" className="mt-8 flex min-h-[88px] items-center justify-center rounded-[26px] bg-[#E9652B] px-7 text-[1.6rem] font-black text-white shadow-[0_18px_40px_rgba(233,101,43,0.3)] active:scale-[0.98]">오늘 기록하기</Link>
            <p className="mt-5 text-lg font-black text-[#37433D]">20초면 충분합니다.</p>
            <p className="mt-2 text-base font-bold leading-7 text-[#68736C]">걷기와 생활패턴은<br className="sm:hidden" /> 자동으로 확인됩니다.</p>
          </section>

          <section className="rounded-[30px] bg-[#2F6B46] p-7 text-white shadow-[0_18px_46px_rgba(47,107,70,0.18)]">
            <p className="text-sm font-black text-[#D5EBD8]">생활 변화</p>
            <h2 className="mt-3 text-[1.65rem] font-black leading-9">오늘은 평소와 비슷합니다.</h2>
            <p className="mt-3 text-lg font-bold leading-8 text-white/80">최근 일주일 동안<br />큰 변화가 없습니다.</p>
            <div className="mt-6 border-t border-white/20 pt-5">
              <p className="text-sm font-bold text-white/65">안심점수</p>
              <p className="mt-1 text-xl font-black">{todayReport.score}점</p>
            </div>
          </section>

          <section className="mt-5 rounded-[28px] bg-[#FFF8F2] p-6">
            <p className="text-sm font-black text-[#B95327]">오늘 기록하면</p>
            <div className="mt-4 grid gap-4 text-lg font-black">
              <p className="flex items-center gap-3"><Check className="text-[#2F6B46]" /> 가족이 안심합니다.</p>
              <p className="flex items-center gap-3"><Check className="text-[#2F6B46]" /> 생활 변화가 확인됩니다.</p>
              <p className="flex items-center gap-3"><Check className="text-[#2F6B46]" /> 농장이 자랍니다.</p>
            </div>
          </section>

          <section className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_12px_34px_rgba(49,78,58,0.07)]">
            <div className="flex items-center gap-4"><span className="flex size-14 items-center justify-center rounded-full bg-[#FFF0E6] text-2xl">💛</span><div><p className="text-sm font-black text-[#B95327]">가족 소식</p><h2 className="mt-1 text-xl font-black">딸이 응원을 보냈습니다.</h2></div></div>
          </section>

          <section className="mt-9">
            <h2 className="text-xl font-black">최근 기록</h2>
            <div className="mt-4 grid gap-3">
              {["어제 · 좋아요", "7월 17일 · 괜찮아요", "7월 16일 · 좋아요"].map((record) => <div key={record} className="flex min-h-16 items-center rounded-[20px] bg-white px-5 text-lg font-bold shadow-sm"><CheckCircle2 className="mr-3 text-[#78A76E]" />{record}</div>)}
            </div>
          </section>
        </div>
      </section>
    </AppFrame>
  );
}

function MoodPicker({ selectedMood, onSelect, onDone }: { selectedMood: string; onSelect: (mood: string) => void; onDone: () => void }) {
  return (
    <section className="px-5 pb-36 pt-7">
      <div className="mx-auto max-w-[560px] rounded-[30px] bg-white p-7 shadow-[0_20px_55px_rgba(49,78,58,0.10)] sm:p-9">
        <p className="text-lg font-black text-[#477052]">기분만 선택해주세요.</p>
        <h1 className="mt-3 text-[2.15rem] font-black leading-tight text-[#17221B]">오늘 기분은<br />어떠세요?</h1>
        <p className="mt-4 rounded-2xl bg-[#F1F7F0] p-4 text-base font-bold leading-7 text-[#526258]">걷기와 생활패턴은<br />자동으로 확인됩니다.</p>
        <div className="mt-8 grid gap-4">
          {moods.map((mood) => (
            <button key={mood.label} type="button" onClick={() => onSelect(mood.label)} className={`flex min-h-[82px] w-full items-center gap-5 rounded-[22px] border-2 px-6 text-left text-[1.45rem] font-black transition ${selectedMood === mood.label ? "border-[#E9652B] bg-[#FFF1E8] text-[#9A3E18]" : "border-[#DDE5DC] bg-[#FAFCF9] text-[#222222]"}`}>
              <span className="text-[2.35rem]" aria-hidden>{mood.emoji}</span>{mood.label}{selectedMood === mood.label ? <Check className="ml-auto text-[#E9652B]" size={29} aria-hidden /> : null}
            </button>
          ))}
        </div>
        <button type="button" disabled={!selectedMood} onClick={onDone} className="mt-8 min-h-[82px] w-full rounded-[22px] bg-[#E9652B] px-6 text-[1.45rem] font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.24)] disabled:bg-[#C8CEC6] disabled:shadow-none">기록 완료하기</button>
      </div>
    </section>
  );
}

function FamilyHome({ moments, initialView, onAddMoment }: { moments: FamilyTrace[]; initialView: FamilyView; onAddMoment: (moment: FamilyTrace) => void }) {
  const farm = getFarmGrowth(todaySignals, moments);
  const [isWriting, setIsWriting] = useState(initialView === "compose");

  if (initialView === "reassurance") {
    return (
      <AppFrame role="family" active="home">
        <FamilySectionHeader title="오늘의 안심" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <section className="rounded-[30px] bg-[#1F6F7A] p-7 text-white shadow-[0_22px_58px_rgba(31,111,122,0.22)]">
              <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black">오늘 오후 8:20 기준</span><ShieldCheck size={30} /></div>
              <h1 className="mt-7 text-[2rem] font-black leading-tight">오늘도 평소와 비슷한 생활이에요.</h1>
              <p className="mt-4 text-lg font-bold leading-8 text-white/80">안심 점수 {todayReport.score}점은 보조 정보로만 확인해요.</p>
            </section>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "changes") {
    return (
      <AppFrame role="family" active="changes">
        <FamilySectionHeader title="생활 변화" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <span className="inline-flex rounded-full bg-[#FFF0E6] px-3 py-2 text-sm font-black text-[#B95327]">체험용 데이터</span>
            <h1 className="mt-5 text-[2rem] font-black leading-tight">최근 일주일 동안<br />큰 변화가 없습니다.</h1>
            <p className="mt-3 text-lg font-bold leading-8 text-[#657069]">결과의 근거를 함께 확인하세요.</p>
            <div className="mt-5 grid gap-4">
              <FamilyChangeCard icon={<Footprints />} title="생활 움직임" value="평소와 비슷해요" detail="최근 7일 동안 큰 변화가 없어요." />
              <FamilyChangeCard icon={<Clock3 />} title="하루 리듬" value="안정적으로 이어져요" detail="기상과 활동 시간이 평소 범위예요." />
              <FamilyChangeCard icon={<Phone />} title="가족 연락" value="꾸준히 이어졌어요" detail="이번 주에도 가족과 연락했어요." />
            </div>
            <section className="mt-6 rounded-[22px] bg-[#F1F4EF] p-5 text-sm font-bold leading-6 text-[#606C65]">오늘안부는 의료 진단 서비스가 아닙니다.<br />생활 변화 확인을 돕는 참고 서비스입니다.</section>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "compose") {
    return (
      <AppFrame role="family" active="compose">
        <FamilySectionHeader title="가족 소식 남기기" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <FamilyNewsIntro onStart={() => setIsWriting(true)} />
            <section className="mt-5 rounded-[28px] bg-[#FFF8ED] p-5">
              <MomentComposer onCancel={() => setIsWriting(false)} onSave={(moment) => { onAddMoment(moment); setIsWriting(false); }} />
            </section>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "farm") {
    return (
      <AppFrame role="family" active="farm">
        <FamilySectionHeader title="안부농장" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px] rounded-[28px] bg-[#FFF8ED] p-6 shadow-[0_14px_38px_rgba(49,78,58,0.07)]">
            <div className="flex items-center gap-4"><span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#D95423]"><Sprout size={30} /></span><div><p className="text-sm font-black text-[#B95327]">안부농장</p><h1 className="text-2xl font-black">토마토가 {farm.percent}% 자랐어요.</h1></div></div>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#78A76E]" style={{ width: `${farm.percent}%` }} /></div>
            <p className="mt-5 text-lg font-bold leading-8 text-[#655D54]">수확까지 47일 남았어요. 수확 시기가 되면 가족이 배송지를 확인할 수 있어요.</p>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "profile") {
    return (
      <AppFrame role="family" active="home">
        <FamilySectionHeader title="설정" />
        <section className="px-5 pb-32 pt-6">
          <div className="mx-auto max-w-[620px]">
            <section className="rounded-[26px] bg-white p-6 shadow-[0_14px_38px_rgba(49,78,58,0.07)]">
              <p className="text-sm font-black text-[#1F6F7A]">연결된 부모님</p>
              <div className="mt-4 flex items-center gap-4"><span className="flex size-16 items-center justify-center rounded-full bg-[#EAF6F7] text-3xl">👩</span><div><h1 className="text-xl font-black">김정희님</h1><p className="mt-1 font-bold text-[#727C75]">어머니 · 연결됨</p></div><span className="ml-auto rounded-full bg-[#E8F5EF] px-3 py-2 text-sm font-black text-[#2F6B46]">안심</span></div>
            </section>
            <div className="mt-5 grid gap-3">
              <SettingLink href="/family/members" icon={<UsersRound />} title="가족 연결 관리" description="함께 확인할 가족을 관리해요." tone="family" />
              <SettingLink href="/settings/notifications" icon={<Bell />} title="알림 설정" description="알림 받을 시간과 내용을 정해요." tone="family" />
              <SettingLink href="/app?role=family&view=guide" icon={<Leaf />} title="오늘안부 이용 안내" description="주요 서비스를 다시 볼 수 있어요." tone="family" />
            </div>
          </div>
        </section>
      </AppFrame>
    );
  }

  if (initialView === "guide") {
    return (
      <AppFrame role="family" active="home">
        <FamilySectionHeader title="오늘안부 이용 안내" />
        <ServiceGuide role="family" />
      </AppFrame>
    );
  }

  return (
    <AppFrame role="family" active="home">
      <FamilySectionHeader title="엄마의 오늘" />
      <section className="px-5 pb-32 pt-5">
        <div className="mx-auto max-w-[620px]">
          <span className="inline-flex rounded-full bg-[#FFF0E6] px-3 py-2 text-sm font-black text-[#B95327]">체험용 데이터</span>
          <section className="mt-3 rounded-[30px] bg-[#1F6F7A] p-6 text-white shadow-[0_24px_65px_rgba(31,111,122,0.22)]">
            <p className="flex items-center gap-2 text-sm font-black text-[#D8EEF0]"><span className="size-2 rounded-full bg-[#95DDE5]" />오늘의 상태</p>
            <h1 className="mt-5 text-[1.85rem] font-black leading-10">오늘은 평소와 비슷합니다.</h1>
            <p className="mt-3 text-lg font-bold leading-8 text-white/80">최근 일주일 동안<br />큰 변화가 없습니다.</p>
            <div className="mt-6 border-t border-white/20 pt-5"><p className="text-sm font-bold text-white/65">참고 점수</p><p className="mt-1 font-black">{todayReport.score}점 · 체험용</p></div>
          </section>

          <section className="mt-5 rounded-[24px] border-2 border-[#CFE1E4] bg-white p-6 shadow-[0_12px_34px_rgba(49,78,58,0.06)]">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF6F7] text-[#1F6F7A]"><Check /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#35737B]">지금 할 일</p>
                <h2 className="mt-1 text-xl font-black leading-7">지금 확인할 일은 없습니다.</h2>
                <p className="mt-2 font-bold text-[#657069]">평소처럼 연락해주세요.</p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[24px] bg-[#FFF8ED] p-6">
            <p className="text-sm font-black text-[#B95327]">부모님의 오늘 기록</p>
            <h2 className="mt-2 text-xl font-black">오늘 기분은 “좋아요”입니다.</h2>
            <p className="mt-2 font-bold text-[#6F665E]">어머니가 18일째 안부를 남겼습니다.</p>
          </section>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/app?role=family&view=changes" className="flex min-h-20 items-center justify-center rounded-[20px] border border-[#CFE1E4] bg-white px-4 text-center font-black text-[#1F6F7A]">변화 근거 보기</Link>
            <Link href="/app?role=family&view=compose" className="flex min-h-20 items-center justify-center rounded-[20px] border border-[#E8D8C5] bg-white px-4 text-center font-black text-[#B95327]">응원 보내기</Link>
          </div>

          <p className="mt-7 text-center text-sm font-bold leading-6 text-[#7A847D]">기기 연결 전 체험 화면입니다.<br />실제 연동 후 생활 데이터가 표시됩니다.</p>
        </div>
      </section>
    </AppFrame>
  );
}

function FamilyNewsIntro({ onStart }: { onStart: () => void }) {
  return (
    <section className="mt-5 rounded-[24px] border border-[#E8D8C5] bg-[#FFF8ED] p-5">
      <p className="text-sm font-black text-[#B95327]">가족 소식 남기기</p>
      <h2 className="mt-2 text-xl font-black leading-7">사진 한 장이나 한 줄만 남겨도 충분해요.</h2>
      <p className="mt-2 text-base font-bold leading-7 text-[#6F665E]">가끔, 필요할 때, 부담 없이 남겨주세요.</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-black text-[#6B625A]"><span className="rounded-full bg-white px-3 py-2">사진</span><span className="rounded-full bg-white px-3 py-2">한 줄</span><span className="rounded-full bg-white px-3 py-2">사진 + 한 줄</span></div>
      <button type="button" onClick={onStart} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D95423] px-5 font-black text-white">가족 소식 남기기 <ImagePlus size={20} /></button>
    </section>
  );
}

function ServiceShortcutSection({ title, items, tone }: { title: string; items: Array<{ href: string; icon: React.ReactNode; title: string; description: string }>; tone: "parent" | "family" }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-black text-[#37433D]">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => <ServiceShortcut key={item.title} {...item} tone={tone} />)}
      </div>
    </section>
  );
}

function ServiceShortcut({ href, icon, title, description, tone }: { href: string; icon: React.ReactNode; title: string; description: string; tone: "parent" | "family" }) {
  const color = tone === "parent" ? "text-[#2F6B46] bg-[#EAF3E5]" : "text-[#1F6F7A] bg-[#EAF6F7]";
  return (
    <Link href={href} className="flex min-h-[96px] items-center gap-4 rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(49,78,58,0.06)]">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>{icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-lg font-black leading-tight">{title}</strong><small className="mt-1 block text-sm font-bold leading-5 text-[#68736C]">{description}</small></span>
      <ChevronRight className="shrink-0 text-[#7A847D]" size={22} />
    </Link>
  );
}

function GuideLink({ href, tone }: { href: string; tone: "parent" | "family" }) {
  const color = tone === "parent" ? "border-[#DCE7DC] text-[#2F6B46]" : "border-[#CFE1E4] text-[#1F6F7A]";
  return <Link href={href} className={`mt-5 flex min-h-14 items-center justify-between rounded-2xl border bg-white px-5 font-black ${color}`}>오늘안부 이용 안내 <ChevronRight size={22} /></Link>;
}

function ServiceGuide({ role }: { role: ExperienceRole }) {
  const isParent = role === "parent";
  const items = isParent
    ? [
        { icon: <Leaf />, title: "오늘의 생활", description: "걸음과 생활 흐름을 자연스럽게 살펴봐요." },
        { icon: <Images />, title: "가족 소식", description: "가족이 보낸 사진과 소식을 받아봐요." },
        { icon: <Sprout />, title: "안부농장", description: "생활이 쌓이면 선택한 작물이 자라요." },
        { icon: <PackageOpen />, title: "수확 선물", description: "수확할 때가 되면 가족이 배송을 도와드려요." },
      ]
    : [
        { icon: <ShieldCheck />, title: "오늘의 안심", description: "오늘 생활이 평소와 비슷한지 확인해요." },
        { icon: <TrendingUp />, title: "생활 변화", description: "최근 달라진 흐름만 살펴볼 수 있어요." },
        { icon: <ImagePlus />, title: "가족 소식", description: "가끔 사진 한 장이나 한 줄을 남길 수 있어요." },
        { icon: <Sprout />, title: "안부농장", description: "성장 상태를 보고 수확 시 배송지를 확인해요." },
      ];

  return (
    <section className="px-5 pb-36 pt-8">
      <div className="mx-auto max-w-[620px]">
        <p className={`text-sm font-black ${isParent ? "text-[#D95423]" : "text-[#1F6F7A]"}`}>오늘안부 이용 안내</p>
        <h1 className="mt-3 text-[2.1rem] font-black leading-tight">{isParent ? "평소처럼 생활하시면 됩니다." : "필요한 안심만 확인하세요."}</h1>
        <p className="mt-4 text-lg font-bold leading-8 text-[#657069]">{isParent ? "복잡하게 적지 않아도 오늘안부가 생활 흐름을 살펴봅니다." : "생활이 평소와 다른 경우 달라진 점만 알려드립니다."}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(49,78,58,0.07)]">
              <span className={`flex size-14 items-center justify-center rounded-2xl ${isParent ? "bg-[#FFF1E8] text-[#D95423]" : "bg-[#EAF6F7] text-[#1F6F7A]"}`}>{item.icon}</span>
              <h2 className="mt-5 text-xl font-black">{item.title}</h2>
              <p className="mt-2 font-bold leading-7 text-[#68736C]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParentSectionHeader({ title, home = false }: { title: string; home?: boolean }) {
  return <header className="sticky top-0 z-20 border-b border-[#DCE5DC] bg-[#F7F9F6]/95 px-5 py-5 backdrop-blur"><div className="mx-auto flex max-w-[560px] items-center gap-3">{home ? <span className="flex size-12 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><Bell size={23} /></span> : <Link href="/app?role=parent" aria-label="홈으로" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#D7E0D6] bg-white text-[#2F3D34] shadow-sm"><ArrowLeft size={25} /></Link>}<h1 className="text-[1.55rem] font-black text-[#17221B]">{title}</h1></div></header>;
}

function FamilySectionHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#DCE5DC] bg-[#F7F9F6]/95 px-5 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-[620px] items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1F6F7A] text-white"><HeartHandshake size={22} /></span>
        <div className="min-w-0 flex-1"><p className="text-xs font-black text-[#597061]">오늘안부 가족</p><h1 className="text-xl font-black text-[#17221B]">{title}</h1></div>
        <Link href="/app?role=family&view=profile" aria-label="설정" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#D7E0D6] bg-white text-[#2F3D34] shadow-sm"><Settings size={22} /></Link>
      </div>
    </header>
  );
}

function FamilyChangeCard({ icon, title, value, detail }: { icon: React.ReactNode; title: string; value: string; detail: string }) {
  return <article className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(49,78,58,0.07)]"><div className="flex items-center gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF6F7] text-[#1F6F7A]">{icon}</span><div><p className="text-sm font-black text-[#68736C]">{title}</p><h2 className="mt-1 text-lg font-black">{value}</h2></div></div><p className="mt-4 border-t border-[#E8EEE8] pt-4 font-bold leading-7 text-[#69746D]">{detail}</p></article>;
}

function SettingLink({ href, icon, title, description, tone }: { href: string; icon: React.ReactNode; title: string; description: string; tone: "parent" | "family" }) {
  const color = tone === "parent" ? "bg-[#EAF3E9] text-[#2F6B46]" : "bg-[#EAF6F7] text-[#1F6F7A]";
  return <Link href={href} className="flex min-h-[88px] items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(49,78,58,0.06)]"><span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>{icon}</span><span className="min-w-0 flex-1"><strong className="block text-lg">{title}</strong><small className="mt-1 block font-semibold leading-5 text-[#737C75]">{description}</small></span><ChevronRight className="shrink-0" /></Link>;
}

function ParentBottomNavigation({ active }: { active: ParentView }) {
  const tabs = [
    { id: "home" as const, label: "홈", href: "/app?role=parent", icon: Home },
    { id: "photos" as const, label: "가족소식", href: "/app?role=parent&view=photos", icon: Images },
    { id: "farm" as const, label: "농장", href: "/app?role=parent&view=farm", icon: Sprout },
    { id: "profile" as const, label: "내정보", href: "/app?role=parent&view=profile", icon: UserRound },
  ];
  return <nav aria-label="부모님 메뉴" className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px] border-t border-[#D8E2D8] bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur"><div className="grid grid-cols-4 gap-1">{tabs.map((tab) => { const Icon = tab.icon; const selected = active === tab.id || (active === "record" && tab.id === "home") || (active === "guide" && tab.id === "home"); return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.95rem] font-black leading-tight ${selected ? "bg-[#FFF0E6] text-[#D95423]" : "text-[#526059]"}`}><Icon size={26} strokeWidth={selected ? 2.8 : 2.2} /><span className="whitespace-nowrap">{tab.label}</span></Link>; })}</div></nav>;
}

function FamilyBottomNavigation({ active }: { active: FamilyView }) {
  const tabs = [
    { id: "home" as const, label: "홈", href: "/app?role=family", icon: Home },
    { id: "changes" as const, label: "생활변화", href: "/app?role=family&view=changes", icon: TrendingUp },
    { id: "compose" as const, label: "소식남기기", href: "/app?role=family&view=compose", icon: ImagePlus },
    { id: "farm" as const, label: "농장", href: "/app?role=family&view=farm", icon: Sprout },
  ];
  return <nav aria-label="가족 메뉴" className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px] border-t border-[#D8E2D8] bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(55,72,55,0.1)] backdrop-blur"><div className="grid grid-cols-4 gap-1">{tabs.map((tab) => { const Icon = tab.icon; const selected = active === tab.id || (active === "reassurance" && tab.id === "home") || (active === "profile" && tab.id === "home") || (active === "guide" && tab.id === "home"); return <Link key={tab.id} href={tab.href} aria-current={selected ? "page" : undefined} className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.9rem] font-black ${selected ? "bg-[#EAF6F7] text-[#1F6F7A]" : "text-[#59655E]"}`}><Icon size={25} strokeWidth={selected ? 2.8 : 2.1} /><span className="whitespace-nowrap">{tab.label}</span></Link>; })}</div></nav>;
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
  return <div className="rounded-2xl bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between"><strong>가족 소식 남기기</strong><button type="button" onClick={onCancel} className="flex size-9 items-center justify-center rounded-full bg-[#F5F2EC]" aria-label="닫기"><X size={17} /></button></div>
    {imageUrl ? <div className="relative mt-4"><img src={imageUrl} alt="선택한 가족 소식" className="h-44 w-full rounded-2xl object-cover" /><label className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-white px-3 py-2 text-xs font-black shadow"><input type="file" accept="image/*" onChange={readImage} className="sr-only" />사진 바꾸기</label></div> : <label className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D8CBB8] bg-[#FFFCF7] text-sm font-black text-[#746B60]"><ImagePlus size={22} /><span>사진 선택 <small className="font-semibold">(선택)</small></span><input type="file" accept="image/*" onChange={readImage} className="sr-only" /></label>}
    <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={120} placeholder="한 줄을 남겨보세요. (선택)" className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-[#E6DED2] px-4 py-3 font-semibold outline-none focus:border-[#6E9174]" />
    <p className="mt-2 text-xs font-semibold text-[#948A7D]">사진만, 한 줄만, 사진과 한 줄 함께 남겨도 괜찮아요.</p>
    <button type="button" disabled={!canSave} onClick={() => onSave({ id: `moment-${Date.now()}`, kind: imageUrl ? "photo" : "memo", sender: "나", title: text.trim() || "사진으로 가족 소식을 남겼어요.", emoji: imageUrl ? "📷" : "✍️", imageUrl, createdAt: new Date().toISOString() })} className="mt-4 min-h-12 w-full rounded-2xl bg-[#D95423] px-5 font-black text-white disabled:bg-[#C8D2C9]">가족 소식 남기기</button>
  </div>;
}

function Brand() {
  return <Link href="/" className="inline-flex items-center gap-2 font-black"><span className="flex size-9 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><Bell size={18} /></span>오늘안부</Link>;
}

function AppFrame({ children, role, active, hideNavigation = false }: { children: React.ReactNode; role: ExperienceRole; active: ParentView | FamilyView; hideNavigation?: boolean }) {
  return <main className="app-frame min-h-screen bg-[#F7F9F6] text-[#17221B]">{children}{hideNavigation ? null : role === "parent" ? <ParentBottomNavigation active={active as ParentView} /> : <FamilyBottomNavigation active={active as FamilyView} />}</main>;
}
