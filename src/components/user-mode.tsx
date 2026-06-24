"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Brain,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Home,
  LockKeyhole,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { InstallGuide } from "@/components/install-guide";
import {
  analyzeNoResponsePattern,
  dailyMomentOptions,
  familyEncouragements,
  generateFamilyAlert,
  generateLifePatternReport,
  generateReminderSchedule,
  getDailyTrend,
  getMonthlyTrend,
  getWeeklyTrend,
  memoryMomentOptions,
  type TrendPoint,
  weatherMoodOptions,
} from "@/lib/insights";

const registrationKey = "oneul-anbu-parent-registered";
const profileKey = "oneul-anbu-parent-profile";
const pendingCheckinKey = "oneul-anbu-pending-checkins";

type Tab = "home" | "report" | "signals" | "family" | "settings";
type ReportPeriod = "daily" | "weekly" | "monthly";

type ParentProfile = {
  userType: "family" | "self" | "care";
  parentName: string;
  relation: string;
  method: "kakao" | "sms" | "call";
  familyShare: boolean;
};

type PendingCheckin = {
  id: string;
  moment: string;
  memory: string;
  mood: string;
  createdAt: string;
  status: "pending" | "delivered";
  deliveredAt?: string;
};

const defaultProfile: ParentProfile = {
  userType: "family",
  parentName: "엄마",
  relation: "딸",
  method: "kakao",
  familyShare: true,
};

const methodLabel = {
  kakao: "카카오톡",
  sms: "문자",
  call: "전화",
};

const reportHistory = [
  { title: "최신 AI 리포트", value: "생활 리듬은 안정적이고 외부 활동 표현만 소폭 줄었습니다." },
  { title: "주간 리포트", value: "7일 기록 참여율 100%, 긍정 표현 유지" },
  { title: "월간 리포트", value: "월 평균 안심 점수 89점, 큰 변화 없음" },
  { title: "AI 리포트 히스토리", value: "최근 4주 동안 생활 리듬 변화 1회" },
];

const changeSignals = [
  { title: "기록 참여 빈도", value: "최근 7일 기록 참여가 평소보다 조금 줄었습니다.", status: "관찰" },
  { title: "외부 활동 표현", value: "산책·외출 관련 응답이 최근 2주간 감소했습니다.", status: "관찰" },
  { title: "긍정 표현 추이", value: "긍정 응답은 안정적으로 유지되고 있습니다.", status: "안정" },
  { title: "관심사 변화", value: "커피, TV, 책 관련 기록이 반복적으로 나타납니다.", status: "안정" },
  { title: "생활 리듬", value: "기록 시간대가 평소보다 늦어진 날이 2회 있었습니다.", status: "관찰" },
  { title: "기록 공백", value: "이틀간 기록 공백이 있었지만 이후 다시 회복했습니다.", status: "안정" },
  { title: "정서 표현", value: "조금 지침 표현이 지난주보다 1회 늘었습니다.", status: "관찰" },
];

const familyNetwork = [
  { name: "엄마", score: 91, status: "안정", checkedBy: "딸" },
  { name: "아빠", score: 74, status: "주의", checkedBy: "아들" },
];

const reportPeriods = [
  { id: "daily", label: "일간" },
  { id: "weekly", label: "주간" },
  { id: "monthly", label: "월간" },
] satisfies Array<{ id: ReportPeriod; label: string }>;

const navItems = [
  { id: "home", label: "홈", icon: Home },
  { id: "report", label: "리포트", icon: FileText },
  { id: "signals", label: "변화감지", icon: ShieldCheck },
  { id: "family", label: "가족", icon: Users },
  { id: "settings", label: "설정", icon: Settings },
] satisfies Array<{ id: Tab; label: string; icon: typeof Home }>;

export function UserMode({ initialRegistered }: { initialRegistered: boolean }) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [profile, setProfile] = useState<ParentProfile>(defaultProfile);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(profileKey);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile) as ParentProfile);
    }

    if (initialRegistered) {
      window.localStorage.setItem(registrationKey, "true");
      return;
    }

    setRegistered(window.localStorage.getItem(registrationKey) === "true");
  }, [initialRegistered]);

  function completeOnboarding(nextProfile: ParentProfile) {
    window.localStorage.setItem(registrationKey, "true");
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setRegistered(true);
    setActiveTab("home");
  }

  function resetService() {
    window.localStorage.removeItem(registrationKey);
    window.localStorage.removeItem(profileKey);
    setProfile(defaultProfile);
    setRegistered(false);
    setActiveTab("home");
  }

  if (!registered) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-24 text-[#1F2937]">
      <div className="mx-auto w-full max-w-[920px] px-5 py-7 sm:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-[#2563EB]">오늘안부</p>
            <h1 className="mt-1 text-2xl font-black tracking-normal">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
            안심
          </span>
        </header>

        {activeTab === "home" ? <HomeTab profile={profile} /> : null}
        {activeTab === "report" ? <ReportTab /> : null}
        {activeTab === "signals" ? <SignalsTab /> : null}
        {activeTab === "family" ? <FamilyTab profile={profile} /> : null}
        {activeTab === "settings" ? <SettingsTab profile={profile} onReset={resetService} /> : null}
      </div>
      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}

function OnboardingFlow({ onComplete }: { onComplete: (profile: ParentProfile) => void }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ParentProfile>(defaultProfile);
  const progress = Math.max(1, step);
  const showProgress = step > 0;

  function next() {
    if (step >= 5) {
      onComplete(profile);
      return;
    }
    setStep((current) => current + 1);
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-5 py-7 text-[#1F2937] sm:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-[680px] content-center">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          {showProgress ? (
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm font-black text-[#6B7280]">
                <span>{progress}/5</span>
                <span>온보딩</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
                <div
                  className="h-2 rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${(progress / 5) * 100}%` }}
                />
              </div>
            </div>
          ) : null}

          {step === 0 ? <WelcomeStep /> : null}
          {step === 1 ? <UserTypeStep profile={profile} onChange={setProfile} /> : null}
          {step === 2 ? <ParentInfoStep profile={profile} onChange={setProfile} /> : null}
          {step === 3 ? <CareMethodStep profile={profile} onChange={setProfile} /> : null}
          {step === 4 ? <FamilyShareStep profile={profile} onChange={setProfile} /> : null}
          {step === 5 ? <CompleteStep profile={profile} /> : null}

          <div className="mt-9 flex gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="min-h-14 flex-1 rounded-2xl border border-[#D1D5DB] bg-white px-5 font-black text-[#4B5563]"
              >
                이전
              </button>
            ) : null}
            <button
              type="button"
              onClick={next}
              className="min-h-14 flex-[2] rounded-2xl bg-[#2563EB] px-5 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              {step === 0 ? "시작하기" : step === 5 ? "홈으로 이동" : "다음"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function WelcomeStep() {
  return (
    <div>
      <p className="text-sm font-black text-[#2563EB]">시작 안내</p>
      <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal">
        하루를 남기면
        <br />
        AI가 변화를 살펴봅니다
      </h1>
      <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
        검사처럼 묻지 않습니다. 가벼운 하루 기록이 쌓이면 가족에게는 변화 리포트로 정리됩니다.
      </p>
      <div className="mt-7 grid gap-3">
        <MiniSummary title="오늘의 한 순간" value="하루에 하나만, 1초 안에 남깁니다." />
        <MiniSummary title="생활 패턴 생성" value="기분, 순간, 관심사 흐름을 조용히 쌓습니다." />
        <MiniSummary title="AI 변화 분석" value="가족은 원시 기록이 아니라 정리된 리포트를 봅니다." />
      </div>
      <div className="mt-6">
        <InstallGuide compact />
      </div>
    </div>
  );
}

function UserTypeStep({
  profile,
  onChange,
}: {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
}) {
  return (
    <StepFrame label="사용자 유형 선택" title="어떤 방식으로 시작할까요?">
      <ChoiceGrid
        value={profile.userType}
        options={[
          { value: "family", title: "가족으로 보기", description: "AI가 정리한 생활 변화 리포트를 확인합니다." },
          { value: "self", title: "내 하루 남기기", description: "관리받는 느낌 없이 오늘의 한 순간을 기록합니다." },
          { value: "care", title: "기관 리포트 준비", description: "생활 패턴 변화 중심의 기관 도입 흐름에 맞춥니다." },
        ]}
        onChange={(userType) => onChange({ ...profile, userType })}
      />
    </StepFrame>
  );
}

function ParentInfoStep({
  profile,
  onChange,
}: {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
}) {
  return (
    <StepFrame label="기록 대상 설정" title="누구의 하루를 쌓아볼까요?">
      <div className="grid gap-4">
        <label className="grid gap-2 font-black">
          부모님 호칭
          <input
            value={profile.parentName}
            onChange={(event) => onChange({ ...profile, parentName: event.target.value })}
            className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-bold outline-none focus:border-[#2563EB]"
          />
        </label>
        <label className="grid gap-2 font-black">
          나와의 관계
          <input
            value={profile.relation}
            onChange={(event) => onChange({ ...profile, relation: event.target.value })}
            className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-bold outline-none focus:border-[#2563EB]"
          />
        </label>
      </div>
    </StepFrame>
  );
}

function CareMethodStep({
  profile,
  onChange,
}: {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
}) {
  return (
    <StepFrame label="기록 알림 방식" title="어떤 방식으로 하루 기록을 받을까요?">
      <ChoiceGrid
        value={profile.method}
        options={[
          { value: "kakao", title: "카카오톡", description: "익숙한 대화창에서 하루를 남깁니다." },
          { value: "sms", title: "문자", description: "앱 설치 없이 문자 링크로 기록합니다." },
          { value: "call", title: "전화", description: "스마트폰이 어려운 분을 위한 전화 기록 흐름입니다." },
        ]}
        onChange={(method) => onChange({ ...profile, method })}
      />
    </StepFrame>
  );
}

function FamilyShareStep({
  profile,
  onChange,
}: {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
}) {
  return (
    <StepFrame label="가족 공유" title="가족과 함께 볼까요?">
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => onChange({ ...profile, familyShare: true })}
          className={`rounded-2xl border p-5 text-left ${profile.familyShare ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"}`}
        >
          <strong className="block text-lg">가족 공유 켜기</strong>
          <span className="mt-2 block font-semibold text-[#6B7280]">형제자매와 AI가 정리한 변화 리포트를 같이 확인합니다.</span>
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...profile, familyShare: false })}
          className={`rounded-2xl border p-5 text-left ${!profile.familyShare ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"}`}
        >
          <strong className="block text-lg">나중에 설정</strong>
          <span className="mt-2 block font-semibold text-[#6B7280]">먼저 혼자 사용하고 나중에 초대합니다.</span>
        </button>
      </div>
    </StepFrame>
  );
}

function CompleteStep({ profile }: { profile: ParentProfile }) {
  return (
    <div>
      <p className="text-sm font-black text-[#2563EB]">설정 완료</p>
      <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal">
        {profile.parentName}의
        <br />
        샘플 AI 분석이 준비됐어요
      </h1>
      <div className="mt-7 rounded-[24px] bg-[#F9FAFB] p-5">
        <StatusLine label="기록 방식" value={methodLabel[profile.method]} />
        <StatusLine label="가족 공유" value={profile.familyShare ? "사용" : "나중에 설정"} />
        <StatusLine label="첫 화면" value="AI 생활 변화 리포트" />
        <StatusLine label="샘플 분석" value="외부 활동 표현 소폭 감소" />
      </div>
    </div>
  );
}

function HomeTab({ profile }: { profile: ParentProfile }) {
  const lifeReport = useMemo(() => generateLifePatternReport(), []);

  return (
    <div className="grid gap-5">
      <section className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#93C5FD]">AI 생활 변화 리포트</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">안심점수 89점</h2>
          </div>
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
            안정
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm font-black text-white/60">기록 참여도</p>
            <p className="mt-2 font-black">{lifeReport.participation}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm font-black text-white/60">생활 활력</p>
            <p className="mt-2 font-black">{lifeReport.vitality}</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white p-4 text-[#1F2937]">
          <p className="text-sm font-black text-[#2563EB]">AI 요약 분석</p>
          <p className="mt-2 font-black leading-7">
            {lifeReport.activityPattern}
          </p>
          <p className="mt-3 font-semibold leading-7 text-[#6B7280]">
            {lifeReport.aiInsight}
          </p>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#6B7280]">{profile.parentName}</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">일상 흐름 안정</h2>
            <p className="mt-4 text-lg font-bold text-[#6B7280]">최근 특별한 변화는 감지되지 않았습니다</p>
          </div>
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
            안심
          </span>
        </div>
        <div className="mt-8">
          <p className="text-sm font-black text-[#2563EB]">안심 점수</p>
          <p className="mt-2 text-6xl font-black leading-none">92점</p>
        </div>
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#6B7280]">오늘 안부 도착 여부</p>
            <h2 className="mt-2 text-2xl font-black">도착 완료</h2>
          </div>
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">
            가족 확인 가능
          </span>
        </div>
      </section>

      <TodayMomentCard />
      <EncouragementInbox />
      <InstallGuide compact />

      <section className="rounded-[24px] bg-[#EFF6FF] p-5">
        <p className="text-sm font-black text-[#2563EB]">AI 한 줄 의견</p>
        <p className="mt-3 text-xl font-black leading-8">
          엄마는 최근에도 꾸준히 기록을 남기고 있으며 생활 패턴은 안정적으로 유지되고 있습니다.
        </p>
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-black text-[#6B7280]">최근 변화 감지</p>
        <div className="mt-4 rounded-2xl bg-[#FEF3C7] px-4 py-4">
          <p className="font-black text-[#92400E]">외부 활동 관련 응답이 소폭 감소했습니다.</p>
          <p className="mt-2 font-semibold text-[#92400E]">생활 패턴 변화 여부를 확인해보는 것을 권장합니다.</p>
        </div>
      </section>
    </div>
  );
}

function EncouragementInbox() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">오늘의 응원</p>
      <h2 className="mt-3 text-3xl font-black leading-tight">읽기만 해도 괜찮아요</h2>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">
        가족이 보낸 짧은 관심 메시지입니다. 답장을 요구하지 않고, 마음만 전합니다.
      </p>
      <div className="mt-5 grid gap-3">
        {familyEncouragements.slice(0, 2).map((message) => (
          <article key={message.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FFFDF8] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-[#1F2937]">
                {message.icon} {message.sender}이 보낸 응원
              </p>
              <span className="text-xs font-black text-[#9CA3AF]">{message.sentAt}</span>
            </div>
            <p className="mt-3 font-bold leading-7 text-[#4B5563]">{message.message}</p>
            <p className="mt-3 text-xs font-black text-[#2563EB]">답장하지 않아도 괜찮아요</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TodayMomentCard() {
  const [selectedMoment, setSelectedMoment] = useState(dailyMomentOptions[1]);
  const [selectedMemory, setSelectedMemory] = useState(memoryMomentOptions[0]);
  const [selectedMood, setSelectedMood] = useState(weatherMoodOptions[1]);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingCount(readPendingCheckins().filter((item) => item.status === "pending").length);

    function handleOnline() {
      setIsOnline(true);
      const delivered = deliverPendingCheckins();
      setPendingCount(0);
      if (delivered > 0) {
        setDeliveryMessage("임시 저장된 오늘 안부를 가족에게 전달했어요.");
      }
    }

    function handleOffline() {
      setIsOnline(false);
      setDeliveryMessage("아직 가족에게 전달 전이에요.");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      const delivered = deliverPendingCheckins();
      if (delivered > 0) {
        setDeliveryMessage("임시 저장된 오늘 안부를 가족에게 전달했어요.");
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function submitMoment() {
    const record: PendingCheckin = {
      id: `checkin-${Date.now()}`,
      moment: selectedMoment,
      memory: selectedMemory,
      mood: selectedMood,
      createdAt: new Date().toISOString(),
      status: isOnline ? "delivered" : "pending",
      deliveredAt: isOnline ? new Date().toISOString() : undefined,
    };

    if (!isOnline) {
      const next = [...readPendingCheckins(), record];
      window.localStorage.setItem(pendingCheckinKey, JSON.stringify(next));
      setPendingCount(next.filter((item) => item.status === "pending").length);
      setDeliveryMessage("아직 가족에게 전달 전이에요.");
      return;
    }

    setDeliveryMessage("오늘 안부가 가족에게 전달됐어요.");
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">오늘의 한 순간</p>
      <h2 className="mt-3 text-3xl font-black leading-tight">오늘 하루는 어땠나요?</h2>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">
        검사처럼 답하지 않아도 됩니다. 가장 가까운 느낌 하나만 남겨주세요.
      </p>
      <MomentChoiceGroup options={dailyMomentOptions} value={selectedMoment} onChange={setSelectedMoment} />
      <p className="mt-6 text-sm font-black text-[#6B7280]">오늘 가장 기억에 남는 것은?</p>
      <MomentChoiceGroup options={memoryMomentOptions} value={selectedMemory} onChange={setSelectedMemory} compact />
      <p className="mt-6 text-sm font-black text-[#6B7280]">오늘 하루를 표현한다면?</p>
      <MomentChoiceGroup options={weatherMoodOptions} value={selectedMood} onChange={setSelectedMood} compact />
      <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
        <p className="text-sm font-black text-[#2563EB]">저장될 하루 기록</p>
        <p className="mt-2 font-black leading-7">
          {selectedMoment} · {selectedMemory} · {selectedMood}
        </p>
      </div>
      <div className={`mt-4 rounded-2xl p-4 ${isOnline ? "bg-[#F0FDF4]" : "bg-[#FEF3C7]"}`}>
        <p className={`text-sm font-black ${isOnline ? "text-[#15803D]" : "text-[#92400E]"}`}>
          {isOnline ? "온라인 상태" : "오프라인 상태"}
        </p>
        <p className={`mt-2 font-bold leading-7 ${isOnline ? "text-[#166534]" : "text-[#92400E]"}`}>
          {deliveryMessage || (isOnline ? "작성하면 바로 가족에게 전달됩니다." : "인터넷이 연결되면 자동으로 전달됩니다.")}
        </p>
        {!isOnline || pendingCount > 0 ? (
          <p className="mt-2 text-sm font-black text-[#92400E]">
            {pendingCount > 0 ? `임시 저장 ${pendingCount}건` : "인터넷이 연결되면 자동으로 전달됩니다."}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={submitMoment}
        className="mt-4 min-h-14 w-full rounded-2xl bg-[#2563EB] px-5 font-black text-white"
      >
        오늘 안부 남기기
      </button>
    </section>
  );
}

function readPendingCheckins(): PendingCheckin[] {
  try {
    const raw = window.localStorage.getItem(pendingCheckinKey);
    return raw ? (JSON.parse(raw) as PendingCheckin[]) : [];
  } catch {
    return [];
  }
}

function deliverPendingCheckins() {
  const items = readPendingCheckins();
  const pending = items.filter((item) => item.status === "pending");

  if (pending.length === 0) {
    return 0;
  }

  const next = items.map((item) =>
    item.status === "pending"
      ? { ...item, status: "delivered" as const, deliveredAt: new Date().toISOString() }
      : item,
  );
  window.localStorage.setItem(pendingCheckinKey, JSON.stringify(next));
  return pending.length;
}

function MomentChoiceGroup({
  options,
  value,
  onChange,
  compact = false,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`mt-4 grid gap-3 ${compact ? "sm:grid-cols-3" : ""}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`min-h-14 rounded-2xl border px-4 text-left text-base font-black transition ${
            value === option ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-[#F9FAFB]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ParentTab({ profile }: { profile: ParentProfile }) {
  const [moment, setMoment] = useState(dailyMomentOptions[1]);
  const [memory, setMemory] = useState(memoryMomentOptions[0]);

  return (
    <div className="grid gap-5">
      <SectionCard title="프로필">
        <StatusLine label="호칭" value={profile.parentName} />
        <StatusLine label="관계" value={profile.relation} />
        <StatusLine label="기록 방식" value={methodLabel[profile.method]} />
      </SectionCard>

      <SectionCard title="오늘의 한 순간">
        <MomentChoiceGroup options={dailyMomentOptions} value={moment} onChange={setMoment} />
        <MomentChoiceGroup options={memoryMomentOptions} value={memory} onChange={setMemory} compact />
        <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4">
          <p className="text-sm font-black text-[#6B7280]">오늘 남긴 기록</p>
          <p className="mt-2 text-lg font-black">{moment}</p>
          <p className="mt-1 font-semibold leading-7 text-[#6B7280]">{memory}</p>
        </div>
      </SectionCard>

      <SectionCard title="최근 기록 흐름">
        <div className="grid gap-3">
          <StatusLine label="오늘 08:42" value="오늘의 한 순간 기록" />
          <StatusLine label="어제 09:10" value="커피 한 잔 기록" />
          <StatusLine label="2일 전" value="산책 기록" />
        </div>
      </SectionCard>
    </div>
  );
}

function ReportTab() {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const dailyTrend = useMemo(() => getDailyTrend(), []);
  const weeklyTrend = useMemo(() => getWeeklyTrend(), []);
  const monthlyTrend = useMemo(() => getMonthlyTrend(), []);

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        {reportPeriods.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPeriod(item.id)}
            className={`min-h-12 rounded-2xl text-sm font-black transition ${
              period === item.id ? "bg-[#2563EB] text-white" : "text-[#6B7280]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <SectionCard title={period === "daily" ? "일간 리포트" : period === "weekly" ? "주간 리포트" : "월간 리포트"}>
        <PeriodReportContent period={period} dailyTrend={dailyTrend} weeklyTrend={weeklyTrend} monthlyTrend={monthlyTrend} />
      </SectionCard>

      <SectionCard title="최근 30일 안심 점수">
        <TrendChart points={monthlyTrend} />
        <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
          <p className="text-sm font-black text-[#2563EB]">AI 분석</p>
          <p className="mt-2 font-black leading-7 text-[#1F2937]">
            최근 4주간 안심 점수는 안정권입니다. 다만 외부 활동 관련 표현이 소폭 줄었습니다.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="AI 리포트 히스토리">
        <div className="grid gap-3">
          {reportHistory.map((item, index) => (
            <div key={item.title} className={index > 0 ? "relative overflow-hidden rounded-2xl" : ""}>
              <MiniSummary title={item.title} value={item.value} />
              {index > 0 ? (
                <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-[1px]">
                  <span className="rounded-full bg-[#111827] px-4 py-2 text-sm font-black text-white">
                    🔒 안심 플랜에서 확인 가능
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>

      <PremiumLockCard title="최근 30일 변화 분석" description="월간 추이, 관심사 변화, 가족 리포트 상세는 안심 플랜에서 확인할 수 있어요." />
    </div>
  );
}

function SignalsTab() {
  const noResponsePattern = useMemo(() => analyzeNoResponsePattern(), []);
  const familyAlert = useMemo(() => generateFamilyAlert(), []);

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#2563EB]">변화 감지 센터</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">AI가 평소와 다른 신호를 분류합니다</h2>
        <p className="mt-4 font-semibold leading-7 text-[#6B7280]">
          기록 참여도, 하루 표현, 관심사, 활동 관련 표현을 함께 보고 안정·관찰로 나눕니다.
        </p>
      </section>

      <SectionCard title="기록 공백 분석">
        <NoResponsePatternCard pattern={noResponsePattern} />
      </SectionCard>

      <SectionCard title="감지 항목">
        <div className="grid gap-3 sm:grid-cols-2">
          {changeSignals.map((signal) => (
            <div key={signal.title} className="rounded-2xl bg-[#F9FAFB] p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-black">{signal.title}</p>
                <SignalBadge status={signal.status} />
              </div>
              <p className="mt-3 font-semibold leading-7 text-[#6B7280]">{signal.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="rounded-[24px] bg-[#EFF6FF] p-5">
        <p className="text-sm font-black text-[#2563EB]">AI 인사이트</p>
        <p className="mt-3 text-xl font-black leading-8">
          최근 2주간 기록은 유지되고 있으나 외부 활동을 표현하는 기록이 줄었습니다.
        </p>
        <p className="mt-3 font-semibold leading-7 text-[#4B5563]">
          급격한 변화는 아니지만 생활 리듬이 안쪽으로 좁아지는지 살펴볼 필요가 있습니다.
        </p>
      </section>

      <FamilyAlertCard alert={familyAlert} />

      <PremiumLockCard title="생활 변화 알림" description="기록 공백, 긍정 표현 감소, 활동 표현 감소가 겹치면 가족에게 확인 권장 알림을 표시합니다." />
    </div>
  );
}

function SignalBadge({ status }: { status: string }) {
  const className =
    status === "위험"
      ? "bg-[#FEE2E2] text-[#DC2626]"
      : status === "주의" || status === "관찰"
        ? "bg-[#FEF3C7] text-[#92400E]"
        : "bg-[#DCFCE7] text-[#15803D]";

  return <span className={`rounded-full px-3 py-1 text-sm font-black ${className}`}>{status}</span>;
}

function PeriodReportContent({
  period,
  dailyTrend,
  weeklyTrend,
  monthlyTrend,
}: {
  period: ReportPeriod;
  dailyTrend: ReturnType<typeof getDailyTrend>;
  weeklyTrend: TrendPoint[];
  monthlyTrend: TrendPoint[];
}) {
  if (period === "daily") {
    return (
      <div className="grid gap-3">
        <StatusLine label="오늘의 안심 상태" value={`${dailyTrend.score}점`} />
        <StatusLine label="오늘의 기록 여부" value={dailyTrend.recorded ? "기록 완료" : "아직 기록 전"} />
        <StatusLine label="오늘의 표현" value={dailyTrend.mood} />
        <div className="grid gap-2 pt-2">
          {dailyTrend.notes.map((note) => (
            <MiniSummary key={note} title={note} value="생활 패턴 분석에 반영되었습니다." />
          ))}
        </div>
      </div>
    );
  }

  if (period === "weekly") {
    const latest = weeklyTrend[weeklyTrend.length - 1];
    return (
      <div className="grid gap-4">
        <TrendChart points={weeklyTrend} />
        <StatusLine label="최근 7일 기록 참여율" value={`${latest?.participationRate ?? 0}%`} />
        <StatusLine label="활동 표현 변화" value="외부 활동 표현 소폭 감소" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <TrendChart points={monthlyTrend} />
      <StatusLine label="생활 활력 변화" value="안정권 유지" />
      <StatusLine label="기록 공백 패턴" value="최근 2일 공백 후 회복" />
      <MiniSummary title="AI 종합 의견" value="특별한 이상 신호는 없지만 외부 활동 표현 감소가 보여 가벼운 대화를 권장합니다." />
    </div>
  );
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  return (
    <div className="rounded-2xl bg-[#F9FAFB] p-4">
      <div className="flex h-32 items-end gap-3">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-xl bg-[#2563EB]" style={{ height: `${Math.max(point.score, 18)}%` }} />
            <span className="text-xs font-black text-[#6B7280]">{point.score}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between gap-2 text-center text-xs font-black text-[#6B7280]">
        {points.map((point) => (
          <span key={point.label} className="flex-1">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function NoResponsePatternCard({
  pattern,
}: {
  pattern: ReturnType<typeof analyzeNoResponsePattern>;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniSummary title="평소 기록 참여율" value={`${pattern.baselineParticipationRate}%`} />
        <MiniSummary title="최근 7일 기록 참여율" value={`${pattern.recentParticipationRate}%`} />
        <MiniSummary title="기록 공백" value={`${pattern.missedRecordDays}일`} />
      </div>
      <div className="rounded-2xl bg-[#FEF3C7] p-4">
        <p className="text-sm font-black text-[#92400E]">AI 해석</p>
        <p className="mt-2 font-black leading-7 text-[#92400E]">
          {pattern.summary} {pattern.interpretation}
        </p>
      </div>
    </div>
  );
}

function FamilyAlertCard({ alert }: { alert: ReturnType<typeof generateFamilyAlert> }) {
  return (
    <section className="rounded-[24px] bg-[#111827] p-5 text-white shadow-[0_20px_60px_rgba(17,24,39,0.18)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#FDE047]">
          <Bell size={22} aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-black">{alert.title}</h2>
          <p className="mt-3 font-semibold leading-7 text-white/75">{alert.description}</p>
          <p className="mt-3 text-lg font-black text-[#FDE047]">{alert.recommendation}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {alert.reasons.map((reason) => (
          <span key={reason} className="rounded-full bg-white/10 px-3 py-1 text-sm font-black">
            {reason}
          </span>
        ))}
      </div>
    </section>
  );
}

function PremiumLockCard({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-[24px] border border-[#DBEAFE] bg-[#EFF6FF] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
          <LockKeyhole size={22} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black">🔒 {title}</h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">{description}</p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#2563EB] px-5 font-black text-white"
          >
            <CreditCard size={18} aria-hidden />
            안심 플랜 보기
          </button>
        </div>
      </div>
    </section>
  );
}

function FamilyTab({ profile }: { profile: ParentProfile }) {
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const quickMessages = [
    "엄마 오늘도 좋은 하루 보내세요.",
    "오늘 날씨가 좋네요. 산책도 하시고 맛있는 것도 드세요.",
    "이번 주말에 전화드릴게요. 사랑합니다.",
  ];

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#2563EB]">가족 안심 네트워크</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">가족은 정리된 변화만 봅니다</h2>
        <p className="mt-4 font-semibold leading-7 text-[#6B7280]">
          원시 기록을 하나하나 보지 않고 AI가 정리한 생활 흐름과 변화 신호만 공유합니다.
        </p>
      </section>

      <SectionCard title="부모님별 안심 상태">
        <div className="grid gap-3">
          {familyNetwork.map((member) => (
            <div key={member.name} className="rounded-2xl bg-[#F9FAFB] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black">{member.name}</p>
                  <p className="mt-2 font-semibold text-[#6B7280]">최근 확인 : {member.checkedBy}</p>
                </div>
                <SignalBadge status={member.status} />
              </div>
              <p className="mt-4 text-4xl font-black">{member.score}점</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="가족 공동 리포트">
        <StatusLine label="최근 리포트 확인자" value={profile.relation} />
        <StatusLine label="가족 리포트 공유" value={profile.familyShare ? "켜짐" : "나중에 설정"} />
        <StatusLine label="초대 상태" value="장남 초대 대기" />
      </SectionCard>

      <SectionCard title="가족 응원 보내기">
        <p className="mb-4 font-semibold leading-7 text-[#6B7280]">
          답장을 요구하지 않는 짧은 관심 메시지입니다. 부모님은 읽기만 해도 됩니다.
        </p>
        <div className="grid gap-3">
          {quickMessages.map((message) => (
            <button
              key={message}
              type="button"
              onClick={() => setSentMessage(message)}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-left font-black leading-7 transition hover:border-[#2563EB] hover:bg-[#EFF6FF]"
            >
              {message}
            </button>
          ))}
        </div>
        {sentMessage ? (
          <div className="mt-4 rounded-2xl bg-[#EFF6FF] p-4">
            <p className="text-sm font-black text-[#2563EB]">응원 메시지를 보냈어요</p>
            <p className="mt-2 font-black leading-7 text-[#1F2937]">{sentMessage}</p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="가족 초대">
        <button className="min-h-12 rounded-2xl bg-[#2563EB] px-5 font-black text-white" type="button">
          가족 초대하기
        </button>
      </SectionCard>
    </div>
  );
}

function SettingsTab({ profile, onReset }: { profile: ParentProfile; onReset: () => void }) {
  const reminderSchedule = useMemo(() => generateReminderSchedule(), []);

  return (
    <div className="grid gap-5">
      <SectionCard title="하루 기록 방식">
        <StatusLine label="현재 방식" value={methodLabel[profile.method]} />
      </SectionCard>

      <SectionCard title="리마인드 시간 설정">
        <div className="grid gap-3">
          {reminderSchedule.map((reminder) => (
            <div key={reminder.step} className="rounded-2xl bg-[#F9FAFB] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{reminder.step}</p>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#2563EB]">
                  {reminder.time}
                </span>
              </div>
              <p className="mt-2 font-semibold leading-7 text-[#6B7280]">{reminder.message}</p>
              <p className="mt-2 text-sm font-black text-[#9CA3AF]">
                {reminder.target === "parent" ? "기록자 알림" : "가족 리포트 반영"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="알림 설정">
        <StatusLine label="기록 공백 감지" value="켜짐" />
        <StatusLine label="가족 확인 권장" value="생활 변화가 반복될 때" />
        <StatusLine label="주간 리포트" value="매주 월요일" />
      </SectionCard>

      <PremiumLockCard title="가족 리포트 자동화" description="기록 공백, 긍정 표현 감소, 관심사 변화가 반복되면 가족에게 확인 권장 리포트를 표시합니다." />

      <SectionCard title="요금제">
        <StatusLine label="무료" value="오늘의 한 순간, 기본 안심 점수" />
        <StatusLine label="안심 플랜" value="주간/월간 변화 분석, AI 리포트, 가족 공유" />
      </SectionCard>

      <SectionCard title="개인정보">
        <StatusLine label="데이터 보관" value="안전한 암호화 저장" />
        <button className="mt-4 min-h-12 rounded-2xl border border-[#FCA5A5] px-5 font-black text-[#DC2626]" type="button" onClick={onReset}>
          등록 정보 초기화
        </button>
      </SectionCard>
    </div>
  );
}

function BottomNavigation({ activeTab, onChange }: { activeTab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5E7EB] bg-white/95 px-3 py-2 backdrop-blur">
      <div className="mx-auto grid max-w-[920px] grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black ${
                active ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#6B7280]"
              }`}
            >
              <Icon size={20} aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function StepFrame({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-black text-[#2563EB]">{label}</p>
      <h1 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h1>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ChoiceGrid<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; title: string; description: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-2xl border p-5 text-left ${
            value === option.value ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"
          }`}
        >
          <strong className="block text-lg">{option.title}</strong>
          <span className="mt-2 block font-semibold text-[#6B7280]">{option.description}</span>
        </button>
      ))}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="text-xl font-black tracking-normal">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MiniSummary({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F9FAFB] p-4">
      <p className="font-black">{title}</p>
      <p className="mt-2 font-semibold leading-7 text-[#6B7280]">{value}</p>
    </div>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F3F4F6] py-3 last:border-b-0">
      <span className="font-bold text-[#6B7280]">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
