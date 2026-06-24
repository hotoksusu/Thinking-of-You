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
} from "lucide-react";
import {
  analyzeNoResponsePattern,
  generateFamilyAlert,
  generateReminderSchedule,
  getDailyTrend,
  getMonthlyTrend,
  getWeeklyTrend,
  type TrendPoint,
} from "@/lib/insights";

const registrationKey = "oneul-anbu-parent-registered";
const profileKey = "oneul-anbu-parent-profile";

type Tab = "home" | "parent" | "report" | "signals" | "settings";
type ReportPeriod = "daily" | "weekly" | "monthly";

type ParentProfile = {
  userType: "family" | "self" | "care";
  parentName: string;
  relation: string;
  method: "kakao" | "sms" | "call";
  familyShare: boolean;
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
  { title: "최신 AI 리포트", value: "큰 이상은 없지만 활동량이 소폭 감소했습니다." },
  { title: "주간 리포트", value: "7일 응답률 100%, 식사와 복약 흐름 안정" },
  { title: "월간 리포트", value: "월 평균 안심 점수 91점, 위험 신호 없음" },
  { title: "AI 리포트 히스토리", value: "최근 4주 동안 주의 알림 1회" },
];

const changeSignals = [
  { title: "응답 시간 변화", value: "09:05 → 10:40", status: "확인 권장" },
  { title: "활동량 변화", value: "평소보다 12% 감소", status: "주의 관찰" },
  { title: "컨디션 변화", value: "특이 응답 없음", status: "안정" },
  { title: "위험 신호", value: "감지되지 않음", status: "안심" },
];

const conditionOptions = ["😀 좋아요", "😐 보통이에요", "😞 별로예요"];
const quickCheckItems = ["식사했어요", "약 먹었어요", "가벼운 활동했어요"];

const reportPeriods = [
  { id: "daily", label: "일간" },
  { id: "weekly", label: "주간" },
  { id: "monthly", label: "월간" },
] satisfies Array<{ id: ReportPeriod; label: string }>;

const navItems = [
  { id: "home", label: "홈", icon: Home },
  { id: "parent", label: "부모님", icon: UserRound },
  { id: "report", label: "리포트", icon: FileText },
  { id: "signals", label: "변화감지", icon: ShieldCheck },
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
        {activeTab === "parent" ? <ParentTab profile={profile} /> : null}
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
        부모님의 안심 상태를
        <br />
        한 화면에서 확인합니다
      </h1>
      <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">
        몇 가지 기본 정보만 설정하면 안심 점수, 변화 감지, AI 리포트를 바로 볼 수 있습니다.
      </p>
      <div className="mt-7 grid gap-3">
        <MiniSummary title="입력은 최소화" value="필수 정보만 먼저 설정" />
        <MiniSummary title="홈은 단순하게" value="부모님이 괜찮은지만 확인" />
        <MiniSummary title="세부 기능은 분리" value="리포트, 가족, 설정에서 관리" />
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
    <StepFrame label="사용자 유형 선택" title="어떤 안심 상태를 확인할까요?">
      <ChoiceGrid
        value={profile.userType}
        options={[
          { value: "family", title: "부모님 안심 확인", description: "부모님의 변화 신호와 안심 상태를 가족이 확인합니다." },
          { value: "self", title: "내 안심 상태 관리", description: "내 변화 신호를 가족과 공유할 수 있습니다." },
          { value: "care", title: "기관 안심 모니터링", description: "향후 기관 도입 흐름에 맞춥니다." },
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
    <StepFrame label="부모님 정보 입력" title="누구의 상태를 확인할까요?">
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
    <StepFrame label="안부 방식 선택" title="어떤 방식으로 확인할까요?">
      <ChoiceGrid
        value={profile.method}
        options={[
          { value: "kakao", title: "카카오톡", description: "가장 익숙한 방식으로 안부를 확인합니다." },
          { value: "sms", title: "문자", description: "카카오톡이 어려울 때 사용합니다." },
          { value: "call", title: "전화", description: "AI 전화 확인 흐름을 준비합니다." },
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
          <span className="mt-2 block font-semibold text-[#6B7280]">형제자매와 안심 상태를 같이 확인합니다.</span>
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
        이제 {profile.parentName}의
        <br />
        안심 상태를 볼 수 있어요
      </h1>
      <div className="mt-7 rounded-[24px] bg-[#F9FAFB] p-5">
        <StatusLine label="안부 방식" value={methodLabel[profile.method]} />
        <StatusLine label="가족 공유" value={profile.familyShare ? "사용" : "나중에 설정"} />
        <StatusLine label="첫 화면" value="안심 상태 중심 홈" />
      </div>
    </div>
  );
}

function HomeTab({ profile }: { profile: ParentProfile }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-[#6B7280]">{profile.parentName}</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">현재 괜찮습니다</h2>
            <p className="mt-4 text-lg font-bold text-[#6B7280]">최근 이상 신호 없음</p>
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

      <section className="rounded-[24px] bg-[#EFF6FF] p-5">
        <p className="text-sm font-black text-[#2563EB]">AI 한 줄 의견</p>
        <p className="mt-3 text-xl font-black leading-8">
          큰 이상은 없지만 활동량이 소폭 줄어 이번 주 통화를 권장합니다.
        </p>
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-black text-[#6B7280]">확인 필요한 변화</p>
        <div className="mt-4 rounded-2xl bg-[#FEF3C7] px-4 py-4">
          <p className="font-black text-[#92400E]">응답시간 09:05 → 10:40</p>
          <p className="mt-2 font-semibold text-[#92400E]">생활 패턴 변화가 감지되었습니다.</p>
        </div>
      </section>
    </div>
  );
}

function ParentTab({ profile }: { profile: ParentProfile }) {
  const [condition, setCondition] = useState("😐 보통이에요");
  const [checkedItems, setCheckedItems] = useState<string[]>(["식사했어요"]);

  function toggleCheckedItem(item: string) {
    setCheckedItems((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <div className="grid gap-5">
      <SectionCard title="프로필">
        <StatusLine label="호칭" value={profile.parentName} />
        <StatusLine label="관계" value={profile.relation} />
        <StatusLine label="안부 방식" value={methodLabel[profile.method]} />
      </SectionCard>

      <SectionCard title="오늘 어떠셨어요?">
        <div className="grid gap-3">
          {conditionOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCondition(option)}
              className={`min-h-16 rounded-2xl border px-5 text-left text-xl font-black transition ${
                condition === option ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {quickCheckItems.map((item) => {
            const selected = checkedItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleCheckedItem(item)}
                className={`min-h-14 rounded-2xl border px-4 text-left font-black transition ${
                  selected ? "border-[#22C55E] bg-[#DCFCE7] text-[#15803D]" : "border-[#E5E7EB] bg-[#F9FAFB]"
                }`}
              >
                {selected ? "✓ " : ""}
                {item}
              </button>
            );
          })}
        </div>
        <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4">
          <p className="text-sm font-black text-[#6B7280]">오늘 상태 기록</p>
          <p className="mt-2 text-lg font-black">{condition}</p>
          <p className="mt-1 font-semibold leading-7 text-[#6B7280]">
            {checkedItems.length ? checkedItems.join(" · ") : "추가 선택 없음"}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="최근 응답 여부">
        <div className="grid gap-3">
          <StatusLine label="오늘 08:42" value="안부 응답 완료" />
          <StatusLine label="어제 09:10" value="응답 완료" />
          <StatusLine label="2일 전" value="특이 신호 없음" />
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
            최근 4주간 안심 점수가 완만하게 하락하고 있습니다. 활동량 감소와 미응답 증가가 함께 나타났습니다.
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

      <PremiumLockCard title="최근 30일 변화 분석" description="월간 추이, 위험 시그널, 가족 알림 상세는 안심 플랜에서 확인할 수 있어요." />
    </div>
  );
}

function SignalsTab() {
  const noResponsePattern = useMemo(() => analyzeNoResponsePattern(), []);
  const familyAlert = useMemo(() => generateFamilyAlert(), []);

  return (
    <div className="grid gap-5">
      <SectionCard title="미응답 분석">
        <NoResponsePatternCard pattern={noResponsePattern} />
      </SectionCard>

      <SectionCard title="활동량 변화">
        <div className="grid gap-3">
          <StatusLine label="최근 활동량" value="평소보다 12% 감소" />
          <StatusLine label="응답 시간" value="09:05 → 10:40" />
          <StatusLine label="컨디션 표현" value="특이 응답 없음" />
        </div>
      </SectionCard>

      <SectionCard title="위험 시그널">
        <div className="grid gap-3">
          {changeSignals.map((signal) => (
            <StatusLine key={signal.title} label={signal.title} value={`${signal.value} · ${signal.status}`} />
          ))}
        </div>
      </SectionCard>

      <FamilyAlertCard alert={familyAlert} />

      <PremiumLockCard title="위험 시그널 알림" description="반복 미응답, 점수 급락, 활동량 감소가 겹치면 가족에게 확인 권장 알림을 표시합니다." />
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
        <StatusLine label="오늘의 안심 상태" value={`${dailyTrend.score}점`} />
        <StatusLine label="오늘의 응답 여부" value={dailyTrend.responded ? "응답 완료" : "미응답"} />
        <StatusLine label="오늘의 컨디션" value={dailyTrend.condition} />
        <div className="grid gap-2 pt-2">
          {dailyTrend.notes.map((note) => (
            <MiniSummary key={note} title={note} value="오늘 상태에 반영되었습니다." />
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
        <StatusLine label="최근 7일 응답률" value={`${latest?.responseRate ?? 0}%`} />
        <StatusLine label="식사/약/활동 패턴" value="활동량 감소 관찰" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <TrendChart points={monthlyTrend} />
      <StatusLine label="활동량 변화" value="4주간 완만한 감소" />
      <StatusLine label="미응답 패턴" value="최근 3일 연속 미응답" />
      <MiniSummary title="AI 종합 의견" value="안심 점수 하락과 미응답 증가가 함께 보여 가족 확인을 권장합니다." />
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
        <MiniSummary title="평소 응답률" value={`${pattern.baselineResponseRate}%`} />
        <MiniSummary title="최근 7일 응답률" value={`${pattern.recentResponseRate}%`} />
        <MiniSummary title="연속 미응답" value={`${pattern.consecutiveNoResponseDays}일`} />
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

function SettingsTab({ profile, onReset }: { profile: ParentProfile; onReset: () => void }) {
  const reminderSchedule = useMemo(() => generateReminderSchedule(), []);

  return (
    <div className="grid gap-5">
      <SectionCard title="안부 방식">
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
                {reminder.target === "parent" ? "부모님 알림" : "가족 알림"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="알림 설정">
        <StatusLine label="미응답 감지" value="켜짐" />
        <StatusLine label="가족 확인 권장" value="3일 연속 미응답 시" />
        <StatusLine label="주간 리포트" value="매주 월요일" />
      </SectionCard>

      <PremiumLockCard title="가족 알림 자동화" description="미응답, 안심 점수 급락, 활동량 감소가 반복되면 가족에게 확인 권장 알림을 표시합니다." />

      <SectionCard title="요금제">
        <StatusLine label="무료" value="오늘 상태, 기본 안심 점수" />
        <StatusLine label="안심 플랜" value="주간/월간 추이, AI 리포트, 가족 알림" />
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
