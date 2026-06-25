"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bell, Copy, CreditCard, FileText, Home, LockKeyhole, MessageCircle, Settings, ShieldCheck } from "lucide-react";
import { InstallGuide } from "@/components/install-guide";
import {
  analyzeNoResponsePattern,
  generateFamilyAlert,
  generateLifePatternReport,
  generateReminderSchedule,
  getDailyTrend,
  getMonthlyTrend,
  getWeeklyTrend,
  type TrendPoint,
} from "@/lib/insights";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share?: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}

const registrationKey = "oneul-anbu-parent-registered";
const profileKey = "oneul-anbu-parent-profile";
const recordsKey = "oneul-anbu-records";
const encouragementKey = "oneul-anbu-encouragements";

type Tab = "home" | "record" | "report" | "signals" | "settings";
type ReportPeriod = "daily" | "weekly" | "monthly";

type ParentProfile = {
  userType: "family" | "self";
  parentName: string;
  relation: string;
  method: "kakao" | "sms" | "link";
  familyShare: boolean;
};

type TodayRecord = {
  id: string;
  moment: string;
  activity: string;
  message: string;
  createdAt: string;
};

type Encouragement = {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
};

const defaultProfile: ParentProfile = {
  userType: "family",
  parentName: "엄마",
  relation: "딸",
  method: "kakao",
  familyShare: true,
};

const methodLabel = {
  kakao: "카카오톡으로 보내기",
  sms: "문자로 보내기",
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

const momentOptions = ["😊 좋았어요", "🙂 평범했어요", "☕ 여유로웠어요", "🏠 집에서 쉬었어요", "🚶 바쁘게 보냈어요"];
const activityOptions = ["식사했어요", "약 먹었어요", "가볍게 움직였어요"];
const messageOptions = ["괜찮아요", "가족에게 전해주세요", "나중에 이야기할게요"];

const encouragementCategories = [
  {
    id: "daily",
    label: "오늘의 응원",
    templates: ["엄마 오늘도 좋은 하루 보내세요 ❤️", "오늘도 편안하고 좋은 하루 보내세요.", "무리하지 마시고 천천히 쉬어가세요."],
  },
  {
    id: "meal",
    label: "식사/건강 챙김",
    templates: ["아버지 식사 잘 챙기시고 편안한 하루 보내세요.", "물도 자주 드시고 오늘도 건강히 보내세요.", "약 잊지 마시고 맛있는 것도 드세요."],
  },
  {
    id: "season",
    label: "날씨/계절",
    templates: [
      "날씨가 따뜻해졌네요. 꽃 구경도 하시고 좋은 하루 보내세요 🌸",
      "더운 날씨에 물 자주 드시고 시원하게 보내세요 🍉",
      "산책하기 좋은 계절이에요. 오늘도 편안한 하루 보내세요 🍂",
      "날이 많이 추워요. 따뜻하게 입고 건강히 보내세요 ☃️",
      "명절 준비로 무리하지 마시고, 편안하게 보내세요.",
    ],
  },
  {
    id: "call",
    label: "전화 약속",
    templates: ["이번 주말에 전화드릴게요.", "저녁에 잠깐 목소리 들으러 전화할게요.", "이번 주에 시간 맞춰 통화해요."],
  },
  {
    id: "love",
    label: "사랑/감사",
    templates: ["사랑합니다. 오늘도 생각하고 있어요.", "늘 고맙고 사랑해요.", "오늘도 엄마 생각이 났어요 ❤️"],
  },
];

const allEncouragementTemplates = encouragementCategories.flatMap((category) => category.templates);

type ToneId = "warm" | "short" | "bright" | "plain" | "cute" | "formal";

const encouragementTones = [
  { id: "warm", label: "다정하게" },
  { id: "short", label: "간단하게" },
  { id: "bright", label: "밝게" },
  { id: "plain", label: "담백하게" },
  { id: "cute", label: "애교 있게" },
  { id: "formal", label: "존댓말로" },
] satisfies Array<{ id: ToneId; label: string }>;

function transformEncouragementTone(message: string, tone: ToneId, profile: ParentProfile) {
  const parentName = profile.parentName || "엄마";
  const formalName = parentName.includes("아빠") || parentName.includes("아버") ? "아버지" : "어머니";

  if (tone === "warm") {
    return `${parentName}, 오늘도 좋은 하루 보내요. 늘 생각하고 있어요 ❤️`;
  }

  if (tone === "short") {
    return `${parentName}, 오늘도 좋은 하루 보내세요.`;
  }

  if (tone === "bright") {
    return `${parentName} 오늘도 웃는 일 많은 하루 보내요 😊`;
  }

  if (tone === "plain") {
    return `${parentName}, 오늘 하루도 편안히 보내세요.`;
  }

  if (tone === "cute") {
    return `${parentName}아 오늘도 좋은 하루 보내요 💕 생각 많이 해요!`;
  }

  if (tone === "formal") {
    return `${formalName}, 오늘도 평안한 하루 보내세요.`;
  }

  return message;
}

const sampleWeek = ["😊", "🙂", "☕", "🏠", "🙂", "☕", "🚶"];

const reportHistory = [
  { title: "최신 안심 리포트", value: "최근 7일간 기록 참여도는 안정적입니다." },
  { title: "주간 안심 리포트", value: "집에서 쉬었다는 응답이 조금 늘었습니다." },
  { title: "월간 안심 리포트", value: "특별한 이상 신호는 없지만, 이번 주에는 짧은 통화를 권장합니다." },
];

const changeSignals = [
  { title: "오늘의 기록 참여", value: "최근 7일 참여율이 안정적입니다.", status: "안심" },
  { title: "응답 시간 변화", value: "오늘의 기록 시간이 평소보다 늦어진 날이 2회 있었습니다.", status: "관찰" },
  { title: "활동 표현 변화", value: "집에서 쉬었다는 응답이 조금 늘었습니다.", status: "관찰" },
  { title: "가족의 관심", value: "최근 응원 메시지 확인 후 오늘의 기록이 남겨졌습니다.", status: "안심" },
];

function getParentUrl() {
  if (typeof window === "undefined") {
    return "https://thinking-of-you-gold.vercel.app/app?registered=1#today-record";
  }
  return `${window.location.origin}/app?registered=1#today-record`;
}

function getShareMessage(profile: ParentProfile) {
  return `${profile.parentName}, 오늘 하루를 가볍게 남겨주세요 ❤️\n가족에게 안심이 전해져요.\n\n${getParentUrl()}`;
}

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
    window.localStorage.removeItem(recordsKey);
    window.localStorage.removeItem(encouragementKey);
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
            <h1 className="mt-1 text-2xl font-black tracking-normal">{navItems.find((item) => item.id === activeTab)?.label}</h1>
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
                <div className="h-2 rounded-full bg-[#2563EB] transition-all" style={{ width: `${(progress / 5) * 100}%` }} />
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
              <button type="button" onClick={back} className="min-h-14 flex-1 rounded-2xl border border-[#D1D5DB] bg-white px-5 font-black text-[#4B5563]">
                이전
              </button>
            ) : null}
            <button type="button" onClick={next} className="min-h-14 flex-[2] rounded-2xl bg-[#2563EB] px-5 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]">
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
      <p className="mt-5 text-lg font-semibold leading-8 text-[#6B7280]">오늘안부의 재방문 동기는 알림이 아니라 가족의 관심입니다.</p>
      <div className="mt-7 grid gap-3">
        <MiniSummary title="가족 응원 도착" value="부모님은 먼저 가족의 짧은 응원을 봅니다." />
        <MiniSummary title="오늘의 기록" value="읽고 난 뒤 큰 버튼 하나로 하루를 남깁니다." />
        <MiniSummary title="안심 리포트 반영" value="가족은 변화 감지와 안심 점수를 확인합니다." />
      </div>
    </div>
  );
}

function UserTypeStep({ profile, onChange }: { profile: ParentProfile; onChange: (profile: ParentProfile) => void }) {
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

function ParentInfoStep({ profile, onChange }: { profile: ParentProfile; onChange: (profile: ParentProfile) => void }) {
  return (
    <StepFrame label="부모님 등록" title="부모님 정보를 간단히 등록합니다.">
      <div className="grid gap-4">
        <label className="grid gap-2 font-black">
          이름
          <input value={profile.parentName} onChange={(event) => onChange({ ...profile, parentName: event.target.value })} className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-bold outline-none focus:border-[#2563EB]" />
        </label>
        <label className="grid gap-2 font-black">
          가족 관계
          <input value={profile.relation} onChange={(event) => onChange({ ...profile, relation: event.target.value })} className="min-h-14 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-bold outline-none focus:border-[#2563EB]" />
        </label>
      </div>
    </StepFrame>
  );
}

function SendLinkStep({ profile, onChange }: { profile: ParentProfile; onChange: (profile: ParentProfile) => void }) {
  return (
    <StepFrame label="부모님께 보내기" title="부모님이 바로 열 수 있는 링크를 공유합니다.">
      <ChoiceGrid
        value={profile.method}
        options={[
          { value: "kakao", title: "카카오톡으로 보내기", description: "사용자가 직접 카카오톡 공유창에서 대화방을 선택합니다." },
          { value: "sms", title: "문자로 보내기", description: "SMS 앱을 열어 직접 보낼 수 있습니다." },
          { value: "link", title: "링크 복사", description: "부모님께 보낼 전용 링크를 복사합니다." },
        ]}
        onChange={(method) => onChange({ ...profile, method })}
      />
      <ShareLinkCard profile={profile} />
    </StepFrame>
  );
}

function FirstRecordStep({ profile }: { profile: ParentProfile }) {
  return (
    <StepFrame label="부모님 첫 기록" title="부모님은 읽고 누르기만 하면 됩니다.">
      <TodayEncouragementCard encouragement={{ id: "demo", sender: profile.relation, message: `${profile.parentName} 오늘도 좋은 하루 보내세요 ❤️`, createdAt: "방금" }} />
      <article className="mt-4 rounded-[28px] bg-[#FFF7ED] p-5">
        <p className="text-sm font-black text-[#F97316]">부모님 화면 예시</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">
          오늘 하루는
          <br />
          어떠셨나요?
        </h2>
        <div className="mt-5 grid gap-3">
          {momentOptions.map((option) => (
            <button key={option} type="button" className="min-h-14 rounded-2xl bg-white px-5 text-left text-lg font-black">
              {option}
            </button>
          ))}
        </div>
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
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);

  useEffect(() => {
    setEncouragements(readEncouragements());
  }, []);

  function handleSent(message: Encouragement) {
    setEncouragements((current) => [message, ...current]);
  }

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
          <MiniDark title="가족의 관심" value={`${Math.max(encouragements.length, 2)}개의 응원이 기록되었습니다.`} />
        </div>
        <div className="mt-5 rounded-2xl bg-white p-4 text-[#1F2937]">
          <p className="text-sm font-black text-[#2563EB]">변화 감지</p>
          <p className="mt-2 font-black leading-7">최근 7일간 기록 참여도는 안정적입니다. 집에서 쉬었다는 응답이 조금 늘었습니다.</p>
          <p className="mt-2 font-semibold leading-7 text-[#6B7280]">특별한 이상 신호는 없지만, 이번 주에는 짧은 통화를 권장합니다.</p>
        </div>
        <button type="button" onClick={onOpenReport} className="mt-5 min-h-12 rounded-2xl bg-white px-5 font-black text-[#111827]">
          안심 리포트 자세히 보기
        </button>
      </section>

      <EncouragementComposer profile={profile} onSent={handleSent} />
      <WeeklyMemoryCard />
      <SendLinkCard profile={profile} />
    </div>
  );
}

function SendLinkCard({ profile }: { profile: ParentProfile }) {
  return (
    <SectionCard title="부모님께 보내기">
      <p className="font-semibold leading-7 text-[#6B7280]">자동 발송이 아니라 사용자가 직접 공유합니다. 부모님께 보낼 링크를 공유하세요.</p>
      <ShareLinkCard profile={profile} />
    </SectionCard>
  );
}

function ShareLinkCard({ profile }: { profile: ParentProfile }) {
  const [notice, setNotice] = useState("");
  const parentUrl = getParentUrl();
  const shareMessage = getShareMessage(profile);
  const smsMessage = `${profile.parentName}, 오늘안부에서 오늘 하루를 가볍게 남겨주세요.\n아래 링크를 누르면 바로 시작할 수 있어요.\n${parentUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(parentUrl);
      setNotice("부모님께 보낼 링크가 복사되었습니다.");
    } catch {
      setNotice(`복사가 어려우면 이 링크를 직접 선택해 보내주세요. ${parentUrl}`);
    }
  }

  async function openSms() {
    setNotice("SMS 앱이 열립니다. 부모님께 보낼 링크를 확인하고 직접 보내주세요.");
    window.location.href = `sms:?&body=${encodeURIComponent(smsMessage)}`;
  }

  async function openKakaoShare() {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

    if (window.Kakao && kakaoKey) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }
      window.Kakao.Share?.sendDefault({
        objectType: "feed",
        content: {
          title: `${profile.parentName}, 오늘 하루를 가볍게 남겨주세요 ❤️`,
          description: "가족에게 안심이 전해져요.",
          imageUrl: "https://thinking-of-you-gold.vercel.app/icons/icon-512.png",
          link: {
            mobileWebUrl: parentUrl,
            webUrl: parentUrl,
          },
        },
        buttons: [
          {
            title: "오늘안부 시작하기",
            link: {
              mobileWebUrl: parentUrl,
              webUrl: parentUrl,
            },
          },
        ],
      });
      setNotice("카카오톡 공유창이 열립니다. 부모님 채팅방을 선택해 공유하세요.");
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "오늘안부 시작하기",
        text: shareMessage,
        url: parentUrl,
      });
      setNotice("공유창이 열립니다. 카카오톡을 선택해 부모님께 공유하세요.");
      return;
    }

    await navigator.clipboard.writeText(shareMessage);
    setNotice("카카오톡 공유를 바로 열 수 없어 공유 문구를 복사했습니다. 카카오톡에 붙여넣어 보내주세요.");
  }

  return (
    <div className="mt-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <ActionButton title="카카오톡으로 보내기" onClick={openKakaoShare} primary />
        <ActionButton title="문자로 보내기" onClick={openSms} />
        <ActionButton title="링크 복사" onClick={copyLink} icon={<Copy size={18} aria-hidden />} />
      </div>
      <div className="mt-4 rounded-2xl bg-[#F9FAFB] p-4">
        <p className="text-sm font-black text-[#2563EB]">공유 메시지</p>
        <p className="mt-2 whitespace-pre-line font-semibold leading-7 text-[#4B5563]">{shareMessage}</p>
      </div>
      {notice ? <p className="mt-4 rounded-2xl bg-[#EFF6FF] p-4 text-sm font-black leading-6 text-[#2563EB]">{notice}</p> : null}
    </div>
  );
}

function ActionButton({ title, onClick, primary = false, icon }: { title: string; onClick: () => void; primary?: boolean; icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 font-black ${
        primary ? "bg-[#2563EB] text-white" : "border border-[#D1D5DB] bg-white text-[#4B5563]"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function EncouragementComposer({ profile, onSent }: { profile: ParentProfile; onSent: (message: Encouragement) => void }) {
  const [activeCategory, setActiveCategory] = useState(encouragementCategories[0].id);
  const [activeTone, setActiveTone] = useState<ToneId>("warm");
  const [draft, setDraft] = useState(encouragementCategories[0].templates[0]);
  const [sentMessage, setSentMessage] = useState("");
  const [recentMessages, setRecentMessages] = useState<string[]>([]);

  useEffect(() => {
    setRecentMessages(readEncouragements().slice(0, 5).map((item) => item.message));
  }, []);

  const activeTemplates = encouragementCategories.find((category) => category.id === activeCategory)?.templates ?? [];
  const recommendedTemplate = allEncouragementTemplates.find((template) => !recentMessages.includes(template)) ?? allEncouragementTemplates[0];

  function sendEncouragement() {
    const message = draft.trim();

    if (!message) {
      setSentMessage("부모님께 전하고 싶은 말을 먼저 적어주세요.");
      return;
    }

    const next: Encouragement = {
      id: `encouragement-${Date.now()}`,
      sender: profile.relation,
      message,
      createdAt: "방금",
    };
    const items = [next, ...readEncouragements()];
    window.localStorage.setItem(encouragementKey, JSON.stringify(items));
    setSentMessage("응원이 저장되었습니다. 부모님 화면의 오늘의 응원 카드에 표시됩니다.");
    setRecentMessages(items.slice(0, 5).map((item) => item.message));
    onSent(next);
  }

  return (
    <SectionCard title="가족의 관심">
      <p className="font-semibold leading-7 text-[#6B7280]">부모님이 다시 찾아오게 만드는 건 기능이 아니라 가족의 관심입니다.</p>
      <p className="mt-2 font-semibold leading-7 text-[#6B7280]">선택한 문구를 그대로 보내거나, 가족의 말투로 살짝 바꿔보세요.</p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {encouragementCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${activeCategory === category.id ? "bg-[#2563EB] text-white" : "bg-[#F3F4F6] text-[#4B5563]"}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-sm font-black text-[#6B7280]">말투</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {encouragementTones.map((tone) => (
            <button
              key={tone.id}
              type="button"
              onClick={() => {
                setActiveTone(tone.id);
                setDraft((current) => transformEncouragementTone(current, tone.id, profile));
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${activeTone === tone.id ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#4B5563]"}`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#EFF6FF] p-4">
        <p className="text-sm font-black text-[#2563EB]">랜덤 추천 문구</p>
        <button type="button" onClick={() => setDraft(recommendedTemplate)} className="mt-2 text-left font-black leading-7 text-[#1F2937]">
          {recommendedTemplate}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {activeTemplates.map((template) => {
          const recent = recentMessages.includes(template);
          return (
            <button
              key={template}
              type="button"
              onClick={() => setDraft(template)}
              className={`rounded-2xl border p-4 text-left font-black leading-7 ${
                draft === template ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-[#F9FAFB]"
              }`}
            >
              <span>{template}</span>
              {recent ? <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs font-black text-[#9CA3AF]">최근 사용</span> : null}
            </button>
          );
        })}
      </div>

      <label className="mt-5 grid gap-2 font-black">
        직접 작성 또는 수정
        <span className="text-sm font-semibold leading-6 text-[#6B7280]">말투를 고른 뒤 가족의 말로 한 번 더 바꿔보세요.</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="부모님께 전하고 싶은 말을 적어보세요. 예: 엄마 오늘도 생각하고 있어요 ❤️"
          className="min-h-32 resize-none rounded-2xl border border-[#E5E7EB] bg-white p-4 font-semibold leading-7 outline-none focus:border-[#2563EB]"
        />
      </label>

      <button type="button" onClick={sendEncouragement} className="mt-4 min-h-12 rounded-2xl bg-[#2563EB] px-5 font-black text-white">
        응원 보내기
      </button>
      {sentMessage ? <p className="mt-4 rounded-2xl bg-[#F0FDF4] p-4 text-sm font-black text-[#15803D]">{sentMessage}</p> : null}
    </SectionCard>
  );
}

function RecordTab({ profile }: { profile: ParentProfile }) {
  const [records, setRecords] = useState<TodayRecord[]>([]);
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);

  useEffect(() => {
    setRecords(readRecords());
    setEncouragements(readEncouragements());
  }, []);

  function handleSaved(record: TodayRecord) {
    setRecords((current) => [record, ...current]);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#2563EB]">{profile.parentName}님의 공간</p>
        <h2 className="mt-3 text-3xl font-black leading-tight">오늘의 기록</h2>
        <p className="mt-3 font-semibold leading-7 text-[#6B7280]">가족의 응원을 읽고, 큰 버튼 하나로 하루를 남깁니다.</p>
      </section>
      <TodayEncouragementCard encouragement={encouragements[0] ?? defaultEncouragement(profile)} />
      <TodayRecordCard onSaved={handleSaved} />
      <RecordCompleteCard record={records[0]} />
      <WeeklyMemoryCard />
    </div>
  );
}

function TodayEncouragementCard({ encouragement }: { encouragement: Encouragement }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">오늘의 응원</p>
      <h2 className="mt-3 text-2xl font-black leading-tight">❤️ {encouragement.sender}이 보낸 응원</h2>
      <p className="mt-4 text-xl font-black leading-8 text-[#1F2937]">{encouragement.message}</p>
      <p className="mt-3 font-semibold leading-7 text-[#6B7280]">답장을 요구하지 않습니다. 읽기만 해도 괜찮아요.</p>
    </section>
  );
}

function TodayRecordCard({ onSaved }: { onSaved: (record: TodayRecord) => void }) {
  const [selectedMoment, setSelectedMoment] = useState(momentOptions[0]);
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [selectedMessage, setSelectedMessage] = useState(messageOptions[0]);
  const [saved, setSaved] = useState(false);

  function submitRecord() {
    const record: TodayRecord = {
      id: `record-${Date.now()}`,
      moment: selectedMoment,
      activity: selectedActivity,
      message: selectedMessage,
      createdAt: new Date().toISOString(),
    };
    const items = [record, ...readRecords()];
    window.localStorage.setItem(recordsKey, JSON.stringify(items));
    setSaved(true);
    onSaved(record);
  }

  return (
    <section id="today-record" className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#F97316]">오늘의 기록</p>
      <h2 className="mt-3 text-3xl font-black leading-tight">오늘 하루는 어떠셨나요?</h2>
      <MomentChoiceGroup options={momentOptions} value={selectedMoment} onChange={setSelectedMoment} />
      <p className="mt-6 text-sm font-black text-[#6B7280]">오늘 남길 내용</p>
      <MomentChoiceGroup options={activityOptions} value={selectedActivity} onChange={setSelectedActivity} compact />
      <p className="mt-6 text-sm font-black text-[#6B7280]">가족에게 전할 말</p>
      <MomentChoiceGroup options={messageOptions} value={selectedMessage} onChange={setSelectedMessage} compact />
      <button type="button" onClick={submitRecord} className="mt-5 min-h-14 w-full rounded-2xl bg-[#F97316] px-5 font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
        오늘의 기록 남기기
      </button>
      {saved ? (
        <div className="mt-4 rounded-2xl bg-[#F0FDF4] p-4">
          <p className="text-lg font-black text-[#15803D]">오늘의 기록이 남겨졌습니다.</p>
          <p className="mt-2 font-semibold text-[#166534]">가족에게 안심이 전해졌어요.</p>
        </div>
      ) : null}
    </section>
  );
}

function RecordCompleteCard({ record }: { record?: TodayRecord }) {
  if (!record) return null;
  return (
    <SectionCard title="가족에게 전해진 안심">
      <StatusLine label="오늘의 기록" value={record.moment} />
      <StatusLine label="가족의 관심" value="응원 확인 후 기록 완료" />
      <StatusLine label="안심 리포트" value="반영됨" />
    </SectionCard>
  );
}

function WeeklyMemoryCard() {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">이번 주의 하루들</p>
      <h2 className="mt-3 text-2xl font-black leading-tight">이번 주는 평범하고 여유로운 하루가 많았어요.</h2>
      <div className="mt-5 flex flex-wrap gap-2 text-3xl">
        {sampleWeek.map((item, index) => (
          <span key={`${item}-${index}`} className="rounded-2xl bg-[#F9FAFB] px-3 py-2">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-4 font-semibold leading-7 text-[#6B7280]">부모님의 이번 주 기록 흐름을 확인해보세요.</p>
    </section>
  );
}

function readRecords(): TodayRecord[] {
  try {
    const raw = window.localStorage.getItem(recordsKey);
    return raw ? (JSON.parse(raw) as TodayRecord[]) : [];
  } catch {
    return [];
  }
}

function readEncouragements(): Encouragement[] {
  try {
    const raw = window.localStorage.getItem(encouragementKey);
    return raw ? (JSON.parse(raw) as Encouragement[]) : [];
  } catch {
    return [];
  }
}

function defaultEncouragement(profile: ParentProfile): Encouragement {
  return { id: "default-encouragement", sender: profile.relation, message: "엄마 오늘도 좋은 하루 보내세요 ❤️", createdAt: "오늘" };
}

function MomentChoiceGroup({ options, value, onChange, compact = false }: { options: string[]; value: string; onChange: (value: string) => void; compact?: boolean }) {
  return (
    <div className={`mt-4 grid gap-3 ${compact ? "sm:grid-cols-3" : ""}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`min-h-14 rounded-2xl border px-4 text-left text-base font-black transition ${value === option ? "border-[#F97316] bg-[#FFF7ED] text-[#C2410C]" : "border-[#E5E7EB] bg-[#F9FAFB]"}`}
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
          <button key={item.id} type="button" onClick={() => setPeriod(item.id)} className={`min-h-12 rounded-2xl text-sm font-black transition ${period === item.id ? "bg-[#2563EB] text-white" : "text-[#6B7280]"}`}>
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
          <p className="mt-2 font-black leading-7 text-[#1F2937]">최근 7일간 기록 참여도는 안정적입니다. 집에서 쉬었다는 응답이 조금 늘었습니다.</p>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">특별한 이상 신호는 없지만, 이번 주에는 짧은 통화를 권장합니다.</p>
        </div>
      </SectionCard>
      <SectionCard title="안심 리포트 히스토리">
        <div className="grid gap-3">
          {reportHistory.map((item, index) => (
            <div key={item.title} className={index > 0 ? "relative overflow-hidden rounded-2xl" : ""}>
              <MiniSummary title={item.title} value={item.value} />
              {index > 0 ? (
                <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-[1px]">
                  <span className="rounded-full bg-[#111827] px-4 py-2 text-sm font-black text-white">안심 플랜에서 확인 가능</span>
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
        <p className="mt-4 font-semibold leading-7 text-[#6B7280]">오늘의 기록, 가족의 관심, 응답 시간, 활동 표현을 함께 봅니다.</p>
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

function PeriodReportContent({ period, dailyTrend, weeklyTrend, monthlyTrend }: { period: ReportPeriod; dailyTrend: ReturnType<typeof getDailyTrend>; weeklyTrend: TrendPoint[]; monthlyTrend: TrendPoint[] }) {
  if (period === "daily") {
    return (
      <div className="grid gap-3">
        <StatusLine label="안심 점수" value={`${dailyTrend.score}점`} />
        <StatusLine label="오늘의 기록" value={dailyTrend.recorded ? "완료" : "아직 전"} />
        <StatusLine label="가족의 관심" value="응원 확인" />
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
        <StatusLine label="변화 감지" value="집에서 쉼 응답 소폭 증가" />
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      <TrendChart points={monthlyTrend} />
      <StatusLine label="안심 점수" value="안심권 유지" />
      <StatusLine label="오늘의 기록 공백" value="최근 2일 공백 후 회복" />
      <MiniSummary title="AI가 살펴본 변화" value="특별한 이상 신호는 없지만, 이번 주에는 짧은 통화를 권장합니다." />
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
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#2563EB]">{reminder.time}</span>
              </div>
              <p className="mt-2 font-semibold leading-7 text-[#6B7280]">{reminder.message}</p>
              <p className="mt-2 text-sm font-black text-[#9CA3AF]">{reminder.target === "parent" ? "부모님 알림" : "안심 리포트 반영"}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <InstallGuide />
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
          <button type="button" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#2563EB] px-5 font-black text-white">
            <CreditCard size={18} aria-hidden />
            안심 플랜 보기
          </button>
        </div>
      </div>
    </section>
  );
}

function SignalBadge({ status }: { status: string }) {
  const className = status === "위험" ? "bg-[#FEE2E2] text-[#DC2626]" : status === "주의" || status === "관찰" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#DCFCE7] text-[#15803D]";
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
            <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-black ${active ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#6B7280]"}`}>
              <Icon size={20} aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function StepFrame({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-black text-[#2563EB]">{label}</p>
      <h1 className="mt-4 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h1>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ChoiceGrid<T extends string>({ value, options, onChange }: { value: T; options: Array<{ value: T; title: string; description: string }>; onChange: (value: T) => void }) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`rounded-2xl border p-5 text-left ${value === option.value ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"}`}>
          <strong className="block text-lg">{option.title}</strong>
          <span className="mt-2 block font-semibold text-[#6B7280]">{option.description}</span>
        </button>
      ))}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
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
