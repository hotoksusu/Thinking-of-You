"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Copy,
  CreditCard,
  FileText,
  Home,
  Link,
  LockKeyhole,
  MessageCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { InstallGuide } from "@/components/install-guide";
import {
  analyzeNoResponsePattern,
  familyEncouragements,
  generateFamilyAlert,
  generateLifePatternReport,
  generateReminderSchedule,
  getDailyTrend,
  getMonthlyTrend,
  getWeeklyTrend,
  type TrendPoint,
} from "@/lib/insights";

const registrationKey = "oneul-anbu-parent-registered";
const profileKey = "oneul-anbu-parent-profile";
const pendingRecordKey = "oneul-anbu-pending-records";

type Tab = "home" | "record" | "report" | "signals" | "settings";
type ReportPeriod = "daily" | "weekly" | "monthly";

type ParentProfile = {
  userType: "family" | "self";
  parentName: string;
  relation: string;
  method: "kakao" | "sms" | "link";
  familyShare: boolean;
};

type PendingRecord = {
  id: string;
  moment: string;
  activity: string;
  message: string;
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
  link: "링크 복사",
};

const navItems = [
  { id: "home", label: "홈", icon: Home },
  { id: "record", label: "오늘의 기록", icon: MessageCircle },
  { id: "report", label: "안심 리포트", icon: FileText },
  { id: "signals", label: "변화 감지", icon: ShieldCheck },
  { id: "settings", label: "설정", icon: Settings },
] satisfies Array<{ id: Tab; label: string; icon: typeof Home }>;

const reportPeriods = [
  { id: "daily", label: "일간" },
  { id: "weekly", label: "주간" },
  { id: "monthly", label: "월간" },
] satisfies Array<{ id: ReportPeriod; label: string }>;

const momentOptions = ["😊 좋았어요", "🙂 평범했어요", "☕ 여유로웠어요", "🏠 집에서 쉬었어요", "🚶 바빴어요"];
const activityOptions = ["식사했어요", "약 먹었어요", "가볍게 움직였어요"];
const messageOptions = ["괜찮아요", "가족에게 전해주세요", "나중에 이야기할게요"];

const reportHistory = [
  { title: "최신 안심 리포트", value: "오늘의 기록 참여는 유지되고 외부 활동 표현만 소폭 줄었습니다." },
  { title: "주간 안심 리포트", value: "최근 7일 안심 점수는 89점 안팎으로 유지되고 있습니다." },
  { title: "월간 안심 리포트", value: "최근 30일 변화 감지 결과, 큰 위험 신호는 없습니다." },
];

const changeSignals = [
  { title: "오늘의 기록 참여", value: "최근 7일 참여율이 평소보다 조금 낮아졌습니다.", status: "관찰" },
  { title: "응답 시간 변화", value: "오늘의 기록 시간이 평소보다 늦어진 날이 2회 있었습니다.", status: "관찰" },
  { title: "활동 표현 변화", value: "외부 활동 관련 표현이 최근 2주간 소폭 줄었습니다.", status: "관찰" },
  { title: "긍정 표현 변화", value: "긍정 표현은 안심권으로 유지되고 있습니다.", status: "안심" },
  { title: "오늘의 기록 공백", value: "2일 공백 후 다시 회복했습니다.", status: "안심" },
  { title: "감정 표현 변화", value: "조금 지쳤다는 표현이 지난주보다 1회 늘었습니다.", status: "관찰" },
];

const familyNetwork = [
  { name: "엄마", score: 91, status: "안심", checkedBy: "딸" },
  { name: "아빠", score: 74, status: "관찰", checkedBy: "아들" },
];

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
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안심</span>
        </header>

        {activeTab === "home" ? <HomeTab profile={profile} onOpenReport={() => setActiveTab("report")} /> : null}
        {activeTab === "record" ? <RecordTab profile={profile} /> : null}
        {activeTab === "report" ? <ReportTab /> : null}
        {activeTab === "signals" ? <SignalsTab /> : null}
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
                <span>첫 기록 준비</span>
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
          {step === 3 ? <SendLinkStep profile={profile} onChange={setProfile} /> : null}
          {step === 4 ? <FirstRecordStep profile={profile} /> : null}
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
              {step === 0 ? "바로 시작하기" : step === 5 ? "안심 리포트 보기" : "다음"}
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
      <p className="text-sm font-black text-[#2563EB]">설치 없이 시작</p>
      <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal">
        부모님께 링크만 보내면
        <br />
        첫 기록이 시작됩니다.
      </h1>
      <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
        오늘안부의 첫 경험은 설치가 아니라 첫 번째 오늘의 기록입니다.
      </p>
      <div className="mt-7 grid gap-3">
        <MiniSummary title="부모님께 링크 보내기" value="카카오톡, 문자, 링크 복사 중 편한 방법을 선택합니다." />
        <MiniSummary title="부모님 첫 기록" value="링크를 열고 큰 버튼 하나만 누르면 끝납니다." />
        <MiniSummary title="안심 리포트 생성" value="가족은 안심 점수와 변화 감지 결과를 확인합니다." />
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
    <StepFrame label="자녀 가입" title="누구의 안심 리포트를 볼까요?">
      <ChoiceGrid
        value={profile.userType}
        options={[
          { value: "family", title: "부모님 안심 확인", description: "부모님의 오늘의 기록을 가족이 안심 리포트로 확인합니다." },
          { value: "self", title: "내 안심 공유", description: "내 오늘의 기록을 남기고 가족과 공유합니다." },
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
    <StepFrame label="부모님 등록" title="부모님 정보를 간단히 등록합니다.">
      <div className="grid gap-4">
        <label className="grid gap-2 font-black">
          이름
          <input
            value={profile.parentName}
            onChange={(event) => onChange({ ...profile, parentName: event.target.value })}
            className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-bold outline-none focus:border-[#2563EB]"
          />
        </label>
        <label className="grid gap-2 font-black">
          가족 관계
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

function SendLinkStep({
  profile,
  onChange,
}: {
  profile: ParentProfile;
  onChange: (profile: ParentProfile) => void;
}) {
  return (
    <StepFrame label="부모님께 링크 보내기" title="설치 설명 없이 링크만 보내세요.">
      <ChoiceGrid
        value={profile.method}
        options={[
          { value: "kakao", title: "카카오톡으로 보내기", description: "가장 익숙한 대화방으로 오늘의 기록 링크를 보냅니다." },
          { value: "sms", title: "문자로 보내기", description: "카카오톡이 어려운 경우 문자 링크로 보냅니다." },
          { value: "link", title: "링크 복사", description: "직접 전달할 수 있도록 링크를 복사합니다." },
        ]}
        onChange={(method) => onChange({ ...profile, method })}
      />
      <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
        <p className="text-sm font-black text-[#2563EB]">보낼 메시지 예시</p>
        <p className="mt-2 font-black leading-7 text-[#1F2937]">
          {profile.parentName}, 여기 눌러서 오늘 하루만 알려주세요. 설치하지 않아도 바로 됩니다.
        </p>
      </div>
    </StepFrame>
  );
}

function FirstRecordStep({ profile }: { profile: ParentProfile }) {
  return (
    <StepFrame label="부모님 첫 기록" title="부모님은 3초 안에 끝낼 수 있어요.">
      <article className="rounded-[28px] bg-[#FFF7ED] p-5">
        <p className="text-sm font-black text-[#F97316]">부모님 화면 예시</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">
          안녕하세요 😊
          <br />
          오늘 하루는 어떠셨나요?
        </h2>
        <div className="mt-5 grid gap-3">
          {momentOptions.map((option) => (
            <button key={option} type="button" className="min-h-14 rounded-2xl bg-white px-5 text-left text-lg font-black">
              {option}
            </button>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#F97316]">
          선택하면 바로 {profile.parentName}님의 오늘의 기록이 완성됩니다.
        </p>
      </article>
    </StepFrame>
  );
}

function CompleteStep({ profile }: { profile: ParentProfile }) {
  return (
    <div>
      <p className="text-sm font-black text-[#2563EB]">안심 리포트 생성</p>
      <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal">
        {profile.parentName}님의
        <br />
        샘플 안심 리포트가 준비됐어요.
      </h1>
      <div className="mt-7 rounded-[24px] bg-[#F9FAFB] p-5">
        <StatusLine label="부모님께 보내기" value={methodLabel[profile.method]} />
        <StatusLine label="첫 기록" value="완료 예시 생성" />
        <StatusLine label="안심 점수" value="89점" />
        <StatusLine label="변화 감지" value="큰 변화 없음" />
      </div>
      <div className="mt-5">
        <InstallGuide compact />
      </div>
    </div>
  );
}

function HomeTab({ profile, onOpenReport }: { profile: ParentProfile; onOpenReport: () => void }) {
  const lifeReport = useMemo(() => generateLifePatternReport(), []);

  return (
    <div className="grid gap-5">
      <section className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#93C5FD]">안심 리포트</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">안심 점수 89점</h2>
          </div>
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안심</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <MiniDark title="오늘의 기록" value={lifeReport.participation} />
          <MiniDark title="변화 감지" value={lifeReport.activityPattern} />
        </div>
        <div className="mt-5 rounded-2xl bg-white p-4 text-[#1F2937]">
          <p className="text-sm font-black text-[#2563EB]">AI가 살펴본 변화</p>
          <p className="mt-2 font-black leading-7">{lifeReport.aiInsight}</p>
        </div>
        <button
          type="button"
          onClick={onOpenReport}
          className="mt-5 min-h-12 rounded-2xl bg-white px-5 font-black text-[#111827]"
        >
          안심 리포트 자세히 보기
        </button>
      </section>

      <SectionCard title={`${profile.parentName}님의 오늘`}>
        <StatusLine label="안심 점수" value="92점" />
        <StatusLine label="오늘의 기록" value="도착" />
        <StatusLine label="변화 감지" value="큰 변화 없음" />
        <StatusLine label="가족의 관심" value="메시지 2건" />
      </SectionCard>

      <SendLinkCard profile={profile} />
      <EncouragementInbox />
    </div>
  );
}

function SendLinkCard({ profile }: { profile: ParentProfile }) {
  return (
    <SectionCard title="부모님께 보내기">
      <p className="font-semibold leading-7 text-[#6B7280]">설치 안내보다 먼저 오늘의 기록 링크를 보냅니다.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <LinkButton title="카카오톡으로 보내기" primary />
        <LinkButton title="문자로 보내기" />
        <LinkButton title="링크 복사" icon={<Copy size={18} aria-hidden />} />
      </div>
      <p className="mt-4 rounded-2xl bg-[#EFF6FF] p-4 text-sm font-black leading-6 text-[#2563EB]">
        {profile.parentName}, 여기 눌러서 오늘 하루만 알려주세요. 설치하지 않아도 바로 됩니다.
      </p>
    </SectionCard>
  );
}

function LinkButton({ title, primary = false, icon }: { title: string; primary?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 font-black ${
        primary ? "bg-[#2563EB] text-white" : "border border-[#D1D5DB] bg-white text-[#4B5563]"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function RecordTab({ profile }: { profile: ParentProfile }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#2563EB]">{profile.parentName}님의 공간</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">오늘의 기록</h2>
        <p className="mt-3 font-semibold leading-7 text-[#6B7280]">
          링크를 열고 큰 버튼을 누르면 끝납니다. 설치하지 않아도 바로 사용할 수 있습니다.
        </p>
      </section>
      <TodayRecordCard />
      <SectionCard title="최근 오늘의 기록">
        <div className="grid gap-3">
          <StatusLine label="오늘 08:42" value="좋았어요 · 식사했어요" />
          <StatusLine label="어제 09:10" value="평범했어요 · 커피 한 잔" />
          <StatusLine label="2일 전" value="가볍게 움직였어요" />
        </div>
      </SectionCard>
    </div>
  );
}

function EncouragementInbox() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">가족의 관심</p>
      <h2 className="mt-3 text-3xl font-black leading-tight">읽기만 해도 충분해요</h2>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">
        답장을 요구하지 않는 짧은 관심 메시지입니다. 오늘의 기록과 함께 안심 리포트에 반영됩니다.
      </p>
      <div className="mt-5 grid gap-3">
        {familyEncouragements.slice(0, 2).map((message) => (
          <article key={message.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FFFDF8] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-[#1F2937]">
                {message.icon} {message.sender}의 관심
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

function TodayRecordCard() {
  const [selectedMoment, setSelectedMoment] = useState(momentOptions[0]);
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [selectedMessage, setSelectedMessage] = useState(messageOptions[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingCount(readPendingRecords().filter((item) => item.status === "pending").length);

    function handleOnline() {
      setIsOnline(true);
      const delivered = deliverPendingRecords();
      setPendingCount(0);
      if (delivered > 0) {
        setDeliveryMessage("가족에게 오늘의 기록이 전달됐어요.");
      }
    }

    function handleOffline() {
      setIsOnline(false);
      setDeliveryMessage("아직 가족에게 전달 전이에요.");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function submitRecord() {
    const record: PendingRecord = {
      id: `record-${Date.now()}`,
      moment: selectedMoment,
      activity: selectedActivity,
      message: selectedMessage,
      createdAt: new Date().toISOString(),
      status: isOnline ? "delivered" : "pending",
      deliveredAt: isOnline ? new Date().toISOString() : undefined,
    };

    if (!isOnline) {
      const next = [...readPendingRecords(), record];
      window.localStorage.setItem(pendingRecordKey, JSON.stringify(next));
      setPendingCount(next.filter((item) => item.status === "pending").length);
      setDeliveryMessage("연결되면 오늘의 기록이 자동 전달돼요.");
      return;
    }

    setDeliveryMessage("오늘의 기록이 가족에게 전달됐어요.");
  }

  return (
    <section id="today-record" className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#F97316]">부모님 첫 화면</p>
      <h2 className="mt-3 text-3xl font-black leading-tight">
        안녕하세요 😊
        <br />
        오늘 하루는 어떠셨나요?
      </h2>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">가장 가까운 버튼 하나만 골라도 충분합니다.</p>
      <MomentChoiceGroup options={momentOptions} value={selectedMoment} onChange={setSelectedMoment} />
      <p className="mt-6 text-sm font-black text-[#6B7280]">오늘 남길 내용</p>
      <MomentChoiceGroup options={activityOptions} value={selectedActivity} onChange={setSelectedActivity} compact />
      <p className="mt-6 text-sm font-black text-[#6B7280]">가족에게 전할 말</p>
      <MomentChoiceGroup options={messageOptions} value={selectedMessage} onChange={setSelectedMessage} compact />
      <div className="mt-5 rounded-2xl bg-[#FFF7ED] p-4">
        <p className="text-sm font-black text-[#F97316]">오늘의 기록</p>
        <p className="mt-2 font-black leading-7">
          {selectedMoment} · {selectedActivity} · {selectedMessage}
        </p>
      </div>
      <div className={`mt-4 rounded-2xl p-4 ${isOnline ? "bg-[#F0FDF4]" : "bg-[#FEF3C7]"}`}>
        <p className={`text-sm font-black ${isOnline ? "text-[#15803D]" : "text-[#92400E]"}`}>
          {isOnline ? "바로 전달 가능" : "연결을 기다리고 있어요"}
        </p>
        <p className={`mt-2 font-bold leading-7 ${isOnline ? "text-[#166534]" : "text-[#92400E]"}`}>
          {deliveryMessage || (isOnline ? "작성하면 바로 가족에게 전달돼요." : "인터넷이 연결되면 자동 전달돼요.")}
        </p>
        {!isOnline || pendingCount > 0 ? (
          <p className="mt-2 text-sm font-black text-[#92400E]">
            {pendingCount > 0 ? `전달을 기다리는 오늘의 기록 ${pendingCount}건` : "연결되면 자동 전달돼요."}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={submitRecord}
        className="mt-4 min-h-14 w-full rounded-2xl bg-[#F97316] px-5 font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]"
      >
        오늘의 기록 완료
      </button>
    </section>
  );
}

function readPendingRecords(): PendingRecord[] {
  try {
    const raw = window.localStorage.getItem(pendingRecordKey);
    return raw ? (JSON.parse(raw) as PendingRecord[]) : [];
  } catch {
    return [];
  }
}

function deliverPendingRecords() {
  const items = readPendingRecords();
  const pending = items.filter((item) => item.status === "pending");

  if (pending.length === 0) {
    return 0;
  }

  const next = items.map((item) =>
    item.status === "pending"
      ? { ...item, status: "delivered" as const, deliveredAt: new Date().toISOString() }
      : item,
  );
  window.localStorage.setItem(pendingRecordKey, JSON.stringify(next));
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
            value === option ? "border-[#F97316] bg-[#FFF7ED] text-[#C2410C]" : "border-[#E5E7EB] bg-[#F9FAFB]"
          }`}
        >
          {option}
        </button>
      ))}
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

      <SectionCard title={`${reportPeriods.find((item) => item.id === period)?.label} 안심 리포트`}>
        <PeriodReportContent period={period} dailyTrend={dailyTrend} weeklyTrend={weeklyTrend} monthlyTrend={monthlyTrend} />
      </SectionCard>

      <SectionCard title="최근 30일 안심 점수">
        <TrendChart points={monthlyTrend} />
        <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
          <p className="text-sm font-black text-[#2563EB]">변화 감지</p>
          <p className="mt-2 font-black leading-7 text-[#1F2937]">
            최근 4주간 안심 점수는 안심권입니다. 다만 외부 활동 관련 표현이 소폭 줄었습니다.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="안심 리포트 히스토리">
        <div className="grid gap-3">
          {reportHistory.map((item, index) => (
            <div key={item.title} className={index > 0 ? "relative overflow-hidden rounded-2xl" : ""}>
              <MiniSummary title={item.title} value={item.value} />
              {index > 0 ? (
                <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-[1px]">
                  <span className="rounded-full bg-[#111827] px-4 py-2 text-sm font-black text-white">
                    안심 플랜에서 확인 가능
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </SectionCard>

      <PremiumLockCard title="최근 30일 변화 감지" description="월간 추이, 반복 공백, 가족 공유 리포트는 안심 플랜에서 확인할 수 있어요." />
    </div>
  );
}

function SignalsTab() {
  const noResponsePattern = useMemo(() => analyzeNoResponsePattern(), []);
  const familyAlert = useMemo(() => generateFamilyAlert(), []);

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#2563EB]">변화 감지</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">AI가 평소와 다른 신호를 살펴봅니다.</h2>
        <p className="mt-4 font-semibold leading-7 text-[#6B7280]">
          오늘의 기록 참여, 응답 시간, 활동 표현, 감정 표현을 함께 보고 안심·관찰로 나눕니다.
        </p>
      </section>

      <SectionCard title="오늘의 기록 공백">
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

      <FamilyAlertCard alert={familyAlert} />
      <PremiumLockCard title="변화 감지 알림" description="오늘의 기록 공백과 활동 표현 감소가 반복되면 가족에게 확인 권장 알림을 표시합니다." />
    </div>
  );
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
        <StatusLine label="안심 점수" value={`${dailyTrend.score}점`} />
        <StatusLine label="오늘의 기록" value={dailyTrend.recorded ? "완료" : "아직 전"} />
        <StatusLine label="표현" value={dailyTrend.mood} />
        <div className="grid gap-2 pt-2">
          {dailyTrend.notes.map((note) => (
            <MiniSummary key={note} title={note} value="안심 리포트에 반영되었습니다." />
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
        <StatusLine label="최근 7일 오늘의 기록" value={`${latest?.participationRate ?? 0}%`} />
        <StatusLine label="변화 감지" value="활동 표현 소폭 감소" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <TrendChart points={monthlyTrend} />
      <StatusLine label="안심 점수" value="안심권 유지" />
      <StatusLine label="오늘의 기록 공백" value="최근 2일 공백 후 회복" />
      <MiniSummary title="AI가 살펴본 변화" value="큰 변화 감지는 없지만 활동 표현 감소가 보여 가벼운 대화를 권장합니다." />
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

function NoResponsePatternCard({ pattern }: { pattern: ReturnType<typeof analyzeNoResponsePattern> }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniSummary title="평소 참여율" value={`${pattern.baselineParticipationRate}%`} />
        <MiniSummary title="최근 7일 참여율" value={`${pattern.recentParticipationRate}%`} />
        <MiniSummary title="오늘의 기록 공백" value={`${pattern.missedRecordDays}일`} />
      </div>
      <div className="rounded-2xl bg-[#FEF3C7] p-4">
        <p className="text-sm font-black text-[#92400E]">변화 감지</p>
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

function FamilyPreview() {
  return (
    <SectionCard title="가족이 함께 보는 안심 리포트">
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
  );
}

function SettingsTab({ profile, onReset }: { profile: ParentProfile; onReset: () => void }) {
  const reminderSchedule = useMemo(() => generateReminderSchedule(), []);

  return (
    <div className="grid gap-5">
      <SectionCard title="부모님께 보내기">
        <StatusLine label="기본 방식" value={methodLabel[profile.method]} />
        <StatusLine label="시작 방식" value="설치 없이 링크로 시작" />
      </SectionCard>

      <SectionCard title="리마인드 시간">
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
                {reminder.target === "parent" ? "부모님 알림" : "안심 리포트 반영"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <InstallGuide />
      <FamilyPreview />

      <PremiumLockCard title="안심 리포트 자동화" description="오늘의 기록 공백, 활동 표현 감소, 반복 변화가 보이면 가족에게 안심 리포트를 표시합니다." />

      <SectionCard title="요금제">
        <StatusLine label="무료" value="오늘의 기록, 기본 안심 점수" />
        <StatusLine label="안심 플랜" value="주간/월간 변화 감지, 안심 리포트, 가족 공유" />
      </SectionCard>

      <SectionCard title="개인정보">
        <StatusLine label="데이터 보관" value="안전하게 암호화" />
        <button className="mt-4 min-h-12 rounded-2xl border border-[#FCA5A5] px-5 font-black text-[#DC2626]" type="button" onClick={onReset}>
          등록 정보 초기화
        </button>
      </SectionCard>
    </div>
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

function SignalBadge({ status }: { status: string }) {
  const className =
    status === "위험"
      ? "bg-[#FEE2E2] text-[#DC2626]"
      : status === "주의" || status === "관찰"
        ? "bg-[#FEF3C7] text-[#92400E]"
        : "bg-[#DCFCE7] text-[#15803D]";

  return <span className={`rounded-full px-3 py-1 text-sm font-black ${className}`}>{status}</span>;
}

function MiniDark({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm font-black text-white/60">{title}</p>
      <p className="mt-2 font-black">{value}</p>
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
