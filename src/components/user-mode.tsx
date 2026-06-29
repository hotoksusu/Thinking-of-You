"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Bell, Check, Copy, CreditCard, FileText, Home, LockKeyhole, MessageCircle, PackageOpen, Settings, ShieldCheck, Sprout } from "lucide-react";
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
const farmKey = "oneul-anbu-farm";
const harvestStorageKey = "oneul-anbu-harvest-storage";

type Tab = "home" | "record" | "report" | "signals" | "settings";
type ReportPeriod = "daily" | "weekly" | "monthly";
type ExperienceRole = "parent" | "family";

type ParentProfile = {
  userType: "family" | "self";
  parentName: string;
  relation: string;
  method: "kakao" | "sms" | "link";
  familyShare: boolean;
};

type ConnectionTag = "family_contact" | "friend_meet" | "neighbor_meet" | "quiet_alone" | "support_message_viewed";

type DailyQuestionCategory = "life" | "emotion" | "connection" | "memory" | "season";

type DailyQuestion = {
  id: string;
  category: DailyQuestionCategory;
  question: string;
  options?: string[];
};

type CropDifficulty = "쉬움" | "보통" | "천천히";
type CropStage = "seed" | "sprout" | "growing" | "flower" | "harvest";

type CropType = {
  id: string;
  name: string;
  emoji: string;
  requiredDays: number;
  difficulty: CropDifficulty;
  season: string;
  imageStages: Record<CropStage, string>;
};

type UserFarm = {
  currentCropId: string | null;
  recordedDays: number;
  growthPercent: number;
  startedAt?: string;
  lastGrowthDate?: string;
  harvestable: boolean;
  totalHarvests: number;
  familySupportEnabled: false;
};

type HarvestStorageItem = {
  cropId: string;
  count: number;
  harvestedAt: string;
};

type SeasonEvent = {
  eventId: string;
  season: string;
  cropIds: string[];
  title: string;
  description: string;
  status: "upcoming" | "open" | "closed";
  brandPartner?: string;
  rewardDescription?: string;
  requiredHarvestCount: number;
};

type DailyRecord = {
  date: string;
  activityTags: SeniorActivity[];
  moodTag: SeniorMood | null;
  connectionTags: ConnectionTag[];
  note?: string;
  completedAt?: string;
  viewedSupportMessage?: boolean;
  dailyQuestionId?: string;
  dailyQuestionAnswer?: string;
};

type TodayRecord = DailyRecord & {
  id: string;
  moment: string;
  activity: string;
  message: string;
  completedTodayRecord?: boolean;
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
  kakao: "카카오톡으로 공유",
  sms: "문자로 공유",
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

type SeniorMood = "happy" | "normal" | "comfortable" | "tired" | "worried";
type SeniorActivity =
  | "rest_home"
  | "walk"
  | "shopping"
  | "clinic"
  | "family_contact"
  | "relax_time"
  | "watch_tv"
  | "meal_good"
  | "nap"
  | "reading"
  | "fresh_air"
  | "neighbor_meet";

const seniorMoodOptions: Array<{ value: SeniorMood; emoji: string; label: string }> = [
  { value: "happy", emoji: "😊", label: "기분 좋았어요" },
  { value: "normal", emoji: "🙂", label: "평범했어요" },
  { value: "comfortable", emoji: "😌", label: "편안했어요" },
  { value: "tired", emoji: "😴", label: "조금 피곤했어요" },
  { value: "worried", emoji: "😟", label: "걱정되는 일이 있었어요" },
];

const seniorActivityOptions: Array<{ value: SeniorActivity; emoji: string; label: string }> = [
  { value: "rest_home", emoji: "🏠", label: "집에서 쉬었어요" },
  { value: "walk", emoji: "🚶", label: "산책했어요" },
  { value: "shopping", emoji: "🛒", label: "장을 봤어요" },
  { value: "clinic", emoji: "🩺", label: "진료를 다녀왔어요" },
  { value: "family_contact", emoji: "👨‍👩‍👧", label: "가족과 연락했어요" },
  { value: "relax_time", emoji: "☕", label: "여유로운 시간을 보냈어요" },
  { value: "watch_tv", emoji: "📺", label: "TV를 봤어요" },
  { value: "meal_good", emoji: "🍚", label: "식사를 잘 했어요" },
  { value: "nap", emoji: "🛏", label: "낮잠을 잤어요" },
  { value: "reading", emoji: "📖", label: "책을 읽었어요" },
  { value: "fresh_air", emoji: "🌳", label: "바람을 쐬었어요" },
  { value: "neighbor_meet", emoji: "👥", label: "이웃을 만났어요" },
];

const dailyQuestions: DailyQuestion[] = [
  { id: "life-best-moment", category: "life", question: "오늘 가장 좋았던 순간은 무엇인가요?", options: ["맛있는 식사", "산책", "가족 연락", "편안한 휴식", "TV나 취미 시간"] },
  { id: "life-tasty-food", category: "life", question: "오늘 가장 맛있었던 것은 무엇인가요?", options: ["집밥", "과일", "간식", "따뜻한 차", "외식"] },
  { id: "emotion-smile", category: "emotion", question: "오늘 웃었던 일이 있었나요?", options: ["많이 웃었어요", "조금 웃었어요", "편안히 보냈어요"] },
  { id: "connection-talk", category: "connection", question: "오늘 누구와 이야기하셨나요?", options: ["가족", "친구", "이웃", "혼자 편히 쉬었어요"] },
  { id: "memory-thanks", category: "memory", question: "오늘 고마웠던 일이 있었나요?", options: ["가족의 연락", "맛있는 식사", "좋은 날씨", "편안한 휴식"] },
  { id: "spring-nature", category: "season", question: "꽃이나 나무를 보셨나요?", options: ["꽃을 봤어요", "나무를 봤어요", "바람을 쐬었어요", "집에서 쉬었어요"] },
  { id: "summer-rest", category: "season", question: "더운 날씨에 잘 쉬셨나요?", options: ["시원하게 쉬었어요", "찬 음식을 먹었어요", "물을 잘 마셨어요"] },
  { id: "autumn-walk", category: "season", question: "산책하기 좋은 날씨였나요?", options: ["산책했어요", "바람을 쐬었어요", "창밖을 바라봤어요"] },
  { id: "winter-warm", category: "season", question: "따뜻하게 보내셨나요?", options: ["따뜻한 차를 마셨어요", "따뜻한 음식을 먹었어요", "집에서 포근히 쉬었어요"] },
];

const cropTypes: CropType[] = [
  { id: "mushroom", name: "버섯", emoji: "🍄", requiredDays: 7, difficulty: "쉬움", season: "봄·가을", imageStages: { seed: "•", sprout: "🌱", growing: "🍄", flower: "🍄", harvest: "🍄" } },
  { id: "lettuce", name: "상추", emoji: "🥬", requiredDays: 14, difficulty: "쉬움", season: "봄·가을", imageStages: { seed: "•", sprout: "🌱", growing: "🥬", flower: "🥬", harvest: "🥬" } },
  { id: "cherry-tomato", name: "방울토마토", emoji: "🍅", requiredDays: 30, difficulty: "보통", season: "여름", imageStages: { seed: "•", sprout: "🌱", growing: "🌿", flower: "🌼", harvest: "🍅" } },
  { id: "strawberry", name: "딸기", emoji: "🍓", requiredDays: 45, difficulty: "보통", season: "봄", imageStages: { seed: "•", sprout: "🌱", growing: "🌿", flower: "🌼", harvest: "🍓" } },
  { id: "corn", name: "옥수수", emoji: "🌽", requiredDays: 60, difficulty: "보통", season: "여름", imageStages: { seed: "•", sprout: "🌱", growing: "🌿", flower: "🌾", harvest: "🌽" } },
  { id: "tangerine", name: "귤", emoji: "🍊", requiredDays: 90, difficulty: "천천히", season: "겨울", imageStages: { seed: "•", sprout: "🌱", growing: "🌳", flower: "🌼", harvest: "🍊" } },
  { id: "apple", name: "사과", emoji: "🍎", requiredDays: 180, difficulty: "천천히", season: "가을", imageStages: { seed: "•", sprout: "🌱", growing: "🌳", flower: "🌼", harvest: "🍎" } },
];

const seasonEvents: SeasonEvent[] = [
  { eventId: "spring-harvest", season: "봄", cropIds: ["lettuce", "strawberry"], title: "봄 수확 이벤트", description: "수확한 디지털 작물로 참여하는 계절 행사입니다.", status: "upcoming", requiredHarvestCount: 1 },
  { eventId: "summer-harvest", season: "여름", cropIds: ["cherry-tomato", "corn"], title: "여름 제철 수확제", description: "브랜드 협업이 열리면 참여할 수 있어요.", status: "upcoming", requiredHarvestCount: 1 },
  { eventId: "autumn-apple", season: "가을", cropIds: ["mushroom", "apple"], title: "가을 사과 수확제", description: "수확한 작물은 시즌 이벤트 참여에 사용할 수 있어요.", status: "upcoming", requiredHarvestCount: 1 },
  { eventId: "winter-tangerine", season: "겨울", cropIds: ["tangerine"], title: "겨울 귤 수확제", description: "실물 수확 이벤트는 브랜드 협업 시 열릴 예정이에요.", status: "upcoming", requiredHarvestCount: 1 },
];

function getCropById(cropId?: string | null) {
  return cropTypes.find((crop) => crop.id === cropId);
}

function getCropStage(growthPercent: number): CropStage {
  if (growthPercent >= 100) return "harvest";
  if (growthPercent >= 70) return "flower";
  if (growthPercent >= 35) return "growing";
  if (growthPercent > 0) return "sprout";
  return "seed";
}

function createFarm(crop: CropType, growthDate?: string): UserFarm {
  const recordedDays = growthDate ? 1 : 0;
  return {
    currentCropId: crop.id,
    recordedDays,
    growthPercent: Math.min((recordedDays / crop.requiredDays) * 100, 100),
    startedAt: new Date().toISOString(),
    lastGrowthDate: growthDate,
    harvestable: recordedDays >= crop.requiredDays,
    totalHarvests: 0,
    familySupportEnabled: false,
  };
}

function growFarm(farm: UserFarm, growthDate: string) {
  const crop = getCropById(farm.currentCropId);
  if (!crop || farm.lastGrowthDate === growthDate || farm.harvestable) return farm;
  const recordedDays = Math.min(farm.recordedDays + 1, crop.requiredDays);
  return {
    ...farm,
    recordedDays,
    growthPercent: Math.min((recordedDays / crop.requiredDays) * 100, 100),
    lastGrowthDate: growthDate,
    harvestable: recordedDays >= crop.requiredDays,
  };
}

function withObjectParticle(word: string) {
  const lastCode = word.charCodeAt(word.length - 1);
  const hasFinalConsonant = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;
  return `${word}${hasFinalConsonant ? "을" : "를"}`;
}

function getCropGrowthMessage(crop: CropType, farm: UserFarm) {
  if (farm.harvestable) return `${withObjectParticle(crop.name)} 수확할 수 있어요.`;
  return {
    mushroom: "오늘 안부 덕분에 버섯이 쑥 자랐어요.",
    lettuce: "상추가 오늘도 싱그럽게 자라고 있어요.",
    "cherry-tomato": "방울토마토가 따뜻한 햇빛을 받았어요.",
    strawberry: "딸기에 작은 꽃이 피려고 해요.",
    corn: "옥수수가 조금 더 키가 컸어요.",
    tangerine: "귤나무가 천천히 열매를 준비하고 있어요.",
    apple: "사과나무가 오늘도 든든하게 자라고 있어요.",
  }[crop.id] ?? `${crop.name}이 오늘도 잘 자라고 있어요.`;
}

function getTodayQuestion() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const seasonalQuestionId = month >= 3 && month <= 5
    ? "spring-nature"
    : month >= 6 && month <= 8
      ? "summer-rest"
      : month >= 9 && month <= 11
        ? "autumn-walk"
        : "winter-warm";
  const regularQuestions = dailyQuestions.filter((question) => question.category !== "season");
  const rotation = [...regularQuestions, dailyQuestions.find((question) => question.id === seasonalQuestionId)!];
  const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000);
  return rotation[dayIndex % rotation.length];
}

function getConnectionTags(activities: SeniorActivity[], viewedSupportMessage: boolean): ConnectionTag[] {
  const tags: ConnectionTag[] = [];
  if (activities.includes("family_contact")) tags.push("family_contact");
  if (activities.includes("neighbor_meet")) tags.push("neighbor_meet");
  if (activities.length > 0 && activities.every((activity) => ["rest_home", "watch_tv", "nap", "reading", "relax_time"].includes(activity))) {
    tags.push("quiet_alone");
  }
  if (viewedSupportMessage) tags.push("support_message_viewed");
  return tags;
}

function getConnectionLabel(value: ConnectionTag) {
  return {
    family_contact: "가족과 연락했어요",
    friend_meet: "친구를 만났어요",
    neighbor_meet: "이웃을 만났어요",
    quiet_alone: "혼자 조용히 보냈어요",
    support_message_viewed: "가족의 응원을 읽었어요",
  }[value];
}

function getSeniorMoodLabel(value: SeniorMood) {
  return seniorMoodOptions.find((option) => option.value === value)?.label ?? "평범했어요";
}

function getSeniorActivityLabel(value: SeniorActivity) {
  return seniorActivityOptions.find((option) => option.value === value)?.label ?? "오늘 있었던 일";
}

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
    return "https://thinking-of-you-gold.vercel.app/app?role=parent#today-record";
  }
  return `${window.location.origin}/app?role=parent#today-record`;
}

function getShareMessage(profile: ParentProfile) {
  return `${profile.parentName}, 오늘 하루를 가볍게 남겨주세요 ❤️\n가족에게 안심이 전해져요.\n\n${getParentUrl()}`;
}

export function UserMode({ initialRegistered, initialRole }: { initialRegistered: boolean; initialRole?: ExperienceRole }) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [experienceRole, setExperienceRole] = useState<ExperienceRole | null>(initialRole ?? null);
  const [profile, setProfile] = useState<ParentProfile>(defaultProfile);
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);
  const [records, setRecords] = useState<TodayRecord[]>([]);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(profileKey);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile) as ParentProfile);
    }
    setEncouragements(readEncouragements());
    setRecords(readRecords());

    if (initialRegistered) {
      window.localStorage.setItem(registrationKey, "true");
      return;
    }

    setRegistered(window.localStorage.getItem(registrationKey) === "true");
  }, [initialRegistered]);

  useEffect(() => {
    if (initialRole) {
      setExperienceRole(initialRole);
    }
  }, [initialRole]);

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
    window.localStorage.removeItem(farmKey);
    window.localStorage.removeItem(harvestStorageKey);
    setProfile(defaultProfile);
    setRegistered(false);
    setActiveTab("home");
    setExperienceRole(null);
    setEncouragements([]);
    setRecords([]);
  }

  function handleSent(message: Encouragement) {
    setEncouragements((current) => [message, ...current]);
  }

  function handleSaved(record: TodayRecord) {
    setRecords((current) => [record, ...current]);
  }

  if (!experienceRole) {
    return <ExperienceRoleSelect onSelect={setExperienceRole} />;
  }

  if (experienceRole === "parent") {
    return <ParentExperience records={records} encouragements={encouragements} onSaved={handleSaved} onBack={() => setExperienceRole(null)} onViewFamily={() => setExperienceRole("family")} />;
  }

  return <FamilyExperience profile={profile} records={records} onSent={handleSent} onReset={resetService} onBack={() => setExperienceRole(null)} />;

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

function ExperienceRoleSelect({ onSelect }: { onSelect: (role: ExperienceRole) => void }) {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-5 py-8 text-[#1F2937] sm:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[880px] content-center">
        <div>
          <p className="text-sm font-black text-[#2563EB]">앱 체험</p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
            부모님과 가족은
            <br />
            이렇게 연결됩니다
          </h1>
          <p className="mt-5 max-w-[620px] text-lg font-semibold leading-8 text-[#6B7280]">
            부모님은 하루를 남기고,
            <br />
            가족은 안심 리포트를 봅니다.
            <br />
            <br />
            두 화면으로
            <br />
            오늘안부의 흐름을 체험해 보세요.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <RoleSelectCard
            label="부모님 화면"
            title={
              <>
                오늘의 기록과
                <br />
                가족의 응원
              </>
            }
            description={
              <>
                복잡한 입력 없이
                <br />
                오늘의 기록을 남깁니다.
                <br />
                <br />
                가족이 보낸 응원도
                <br />
                함께 확인합니다.
              </>
            }
            button="부모님 화면 보기"
            accent="warm"
            onClick={() => onSelect("parent")}
          />
          <RoleSelectCard
            label="가족 화면"
            title={
              <>
                안심 리포트와
                <br />
                변화 감지
              </>
            }
            description={
              <>
                부모님의 기록 흐름을
                <br />
                안심 점수로 봅니다.
                <br />
                <br />
                변화가 있으면
                <br />
                리포트로 알려줍니다.
              </>
            }
            button="가족 화면 보기"
            accent="blue"
            onClick={() => onSelect("family")}
          />
        </div>
      </section>
    </main>
  );
}

function RoleSelectCard({ label, title, description, button, accent, onClick }: { label: string; title: ReactNode; description: ReactNode; button: string; accent: "warm" | "blue"; onClick: () => void }) {
  const warm = accent === "warm";
  return (
    <article className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-black ${warm ? "bg-[#FFF7ED] text-[#F97316]" : "bg-[#EFF6FF] text-[#2563EB]"}`}>{label}</span>
      <h2 className="mt-5 text-[1.625rem] font-black leading-[1.28] sm:text-[2rem]">{title}</h2>
      <p className="mt-4 text-[1.05rem] font-semibold leading-[1.6] text-[#6B7280]">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className={`mt-8 min-h-14 w-full rounded-2xl px-5 text-lg font-black text-white shadow-[0_16px_34px_rgba(15,23,42,0.12)] ${warm ? "bg-[#F97316]" : "bg-[#2563EB]"}`}
      >
        {button}
      </button>
    </article>
  );
}

function ExperienceHeader({ eyebrow, title, onBack }: { eyebrow: string; title: string; onBack: () => void }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-black text-[#2563EB]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-black tracking-normal">{title}</h1>
      </div>
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 text-sm font-black text-[#4B5563]">
        <ArrowLeft size={17} aria-hidden />
        선택
      </button>
    </header>
  );
}

function ParentExperience({ records, encouragements, onSaved, onBack, onViewFamily }: { records: TodayRecord[]; encouragements: Encouragement[]; onSaved: (record: TodayRecord) => void; onBack: () => void; onViewFamily: () => void }) {
  const encouragement = encouragements[0] ?? defaultEncouragement(defaultProfile);

  return (
    <main className="min-h-screen bg-[#FFF7ED] px-5 py-7 text-[#1F2937] sm:px-8">
      <div className="mx-auto w-full max-w-[760px]">
        <ExperienceHeader eyebrow="부모님 화면" title="오늘의 기록" onBack={onBack} />
        <ParentSteppedRecordExperience records={records} encouragement={encouragement} onSaved={onSaved} onViewFamily={onViewFamily} />
      </div>
    </main>
  );
}

function FamilyExperience({ profile, records, onSent, onReset, onBack }: { profile: ParentProfile; records: TodayRecord[]; onSent: (message: Encouragement) => void; onReset: () => void; onBack: () => void }) {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-5 py-7 text-[#1F2937] sm:px-8">
      <div className="mx-auto w-full max-w-[920px]">
        <ExperienceHeader eyebrow="가족 화면" title="안심 리포트" onBack={onBack} />
        <div className="grid gap-5">
          <FamilyScoreCard profile={profile} records={records} />
          <FamilyChangeCard records={records} />
          <EncouragementComposer profile={profile} onSent={onSent} />
          <FamilyReportCard records={records} />
          <WeeklyMemoryCard audience="family" />
          <SendLinkCard profile={profile} />
          <SectionCard title="설정">
            <p className="font-semibold leading-7 text-[#6B7280]">체험 데이터를 다시 보고 싶다면 초기화할 수 있습니다.</p>
            <button className="mt-4 min-h-12 rounded-2xl border border-[#FCA5A5] px-5 font-black text-[#DC2626]" type="button" onClick={onReset}>
              체험 초기화
            </button>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

function FamilyScoreCard({ profile, records }: { profile: ParentProfile; records: TodayRecord[] }) {
  const latest = records[0];
  const score = latest ? getParentAiFeedback(latest).score : 89;

  return (
    <section className="rounded-[30px] bg-[#111827] p-6 text-white shadow-[0_24px_70px_rgba(17,24,39,0.18)]">
      <p className="text-sm font-black text-[#93C5FD]">오늘 부모님의 안심 신호가 도착했어요.</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h2 className="text-6xl font-black leading-none">{score}점</h2>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-black text-[#15803D]">안심</span>
      </div>
      <p className="mt-5 text-lg font-black leading-8">{profile.parentName}의 오늘은 평소와 비슷한 편안한 생활 흐름으로 보여요.</p>
    </section>
  );
}

function FamilyChangeCard({ records }: { records: TodayRecord[] }) {
  const latest = records[0];
  const latestMood = latest?.moodTag ? getSeniorMoodLabel(latest.moodTag) : latest?.moment;
  const latestActivities = latest?.activityTags?.length
    ? latest.activityTags.map(getSeniorActivityLabel).join(", ")
    : latest?.activity;
  const latestConnections = latest?.connectionTags?.length
    ? latest.connectionTags.map(getConnectionLabel).join(", ")
    : "가족과의 연결 기록이 쌓이면 흐름을 함께 볼 수 있습니다.";

  return (
    <SectionCard title="오늘의 안심 신호">
      <div className="grid gap-3">
        <MiniSummary title="오늘 있었던 일" value={latestActivities || "아직 오늘 기록이 없습니다."} />
        <MiniSummary title="오늘의 느낌" value={latestMood || "기록이 쌓이면 느낌 변화를 함께 볼 수 있습니다."} />
        <MiniSummary title="가족과의 연결" value={latestConnections} />
        <MiniSummary title="기록 참여 빈도" value="최근 기록 참여도는 안정적으로 유지되고 있습니다." />
        <div className="rounded-2xl bg-[#EFF6FF] p-4">
          <p className="text-sm font-black text-[#2563EB]">AI가 생활 흐름을 정리했어요.</p>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            {latest?.moodTag === "tired" || latest?.moodTag === "worried"
              ? "오늘은 조금 천천히 쉬어간 흐름이 보여요. 내일 짧게 안부를 여쭤보면 좋아요."
              : "오늘은 평소와 비슷한 안정적인 하루로 보여요. 특별히 걱정할 변화는 보이지 않습니다."}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function FamilyReportCard({ records }: { records: TodayRecord[] }) {
  const latest = records[0];
  const weeklyLetter = getAiWeeklyLetter(records);
  const latestSummary = latest
    ? [
        latest.activityTags?.length ? `오늘 있었던 일: ${latest.activityTags.map(getSeniorActivityLabel).join(", ")}` : null,
        latest.moodTag ? `오늘의 느낌: ${getSeniorMoodLabel(latest.moodTag)}` : `오늘의 느낌: ${latest.moment}`,
        latest.connectionTags?.length ? `가족과의 연결: ${latest.connectionTags.map(getConnectionLabel).join(", ")}` : null,
        latest.note ? `남긴 말: ${latest.note}` : null,
      ]
        .filter(Boolean)
        .join(" / ")
    : null;

  return (
    <SectionCard title="이번 주 안심 리포트">
      <div className="grid gap-3">
        <p className="font-black leading-7">최근 7일간 기록 참여도는 안정적입니다.</p>
        <p className="font-semibold leading-7 text-[#6B7280]">오늘 있었던 일, 하루의 느낌, 가족과의 연결, 기록 참여 흐름을 함께 살펴봅니다.</p>
        <MiniSummary title="이번 주 흐름" value="편안한 하루가 많았고 가족 연락 기록도 꾸준히 유지되었습니다." />
        <MiniSummary title="권장 안부" value="이번 주에는 짧은 통화로 마음을 나눠보세요." />
        {weeklyLetter ? <MiniSummary title="AI가 정리한 이번 주" value={weeklyLetter.familySummary} /> : null}
        {latestSummary ? <MiniSummary title="가장 최근 오늘의 기록" value={latestSummary} /> : null}
      </div>
    </SectionCard>
  );
}

type ParentAiFeedback = {
  line: string;
  score: number;
  praise: string;
  suggestion: string;
};

type AiWeeklyLetter = {
  title: string;
  body: string;
  familySummary: string;
};

function getUniqueRecordDates(records: TodayRecord[]) {
  return [...new Set(records.map((record) => record.date || record.createdAt.slice(0, 10)))].sort().reverse();
}

function getRecordStreak(records: TodayRecord[]) {
  const dates = getUniqueRecordDates(records);
  if (dates.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const previous = new Date(`${dates[index - 1]}T00:00:00`);
    const current = new Date(`${dates[index]}T00:00:00`);
    if ((previous.getTime() - current.getTime()) / 86_400_000 !== 1) break;
    streak += 1;
  }
  return streak;
}

function getSmallMission(record: TodayRecord) {
  const activities = record.activityTags ?? [];
  const connections = record.connectionTags ?? [];
  if (!activities.includes("meal_good")) return "물 한 잔 천천히 마시기";
  if (!activities.some((activity) => ["walk", "fresh_air"].includes(activity))) return "창문 열고 바람 느끼기";
  if (!connections.some((tag) => ["family_contact", "neighbor_meet"].includes(tag))) return "가족에게 짧게 안부 보내기";
  return "좋아하는 음악 한 곡 듣기";
}

function getParentAiFeedback(record: TodayRecord): ParentAiFeedback {
  const activities = record.activityTags ?? [];
  const suggestion = getSmallMission(record);

  if (record.moodTag === "tired" || record.moodTag === "worried") {
    return {
      line: "오늘 하루도 잘 지나왔습니다. 수고 많으셨어요.",
      score: record.moodTag === "worried" ? 82 : 85,
      praise: "마음이 어떤지 남겨주신 것만으로도 충분히 잘하셨어요.",
      suggestion,
    };
  }

  if (activities.includes("family_contact")) {
    return {
      line: "가족과 나눈 마음이 오늘을 더 따뜻하게 했어요.",
      score: 93,
      praise: "오늘도 나를 위한 소중한 기록을 잘 남기셨어요.",
      suggestion,
    };
  }

  if (activities.some((activity) => ["walk", "fresh_air"].includes(activity))) {
    return {
      line: "바깥 공기와 함께 기분 좋은 흐름이 남았어요.",
      score: 92,
      praise: "가볍게 움직인 오늘의 시간을 잘 기억해둘게요.",
      suggestion,
    };
  }

  if (activities.includes("meal_good")) {
    return {
      line: "잘 챙겨 드신 하루가 편안하게 남았어요.",
      score: 91,
      praise: "오늘의 식사까지 다정하게 챙기셨어요.",
      suggestion,
    };
  }

  const calmLines = [
    "오늘도 평범하지만 소중한 하루였어요.",
    "작은 기록이 모여 좋은 흐름을 만들고 있어요.",
    "오늘 하루도 따뜻한 기록으로 잘 남았어요.",
  ];
  const recordDate = record.date || record.createdAt.slice(0, 10);
  const lineIndex = Number(recordDate.replaceAll("-", "")) % calmLines.length;
  return {
    line: calmLines[lineIndex],
    score: record.moodTag === "happy" ? 94 : 89,
    praise: "꾸준히 하루를 들려주셔서 고마워요.",
    suggestion,
  };
}

function getRememberedMessage(records: TodayRecord[]) {
  const dayCount = getUniqueRecordDates(records).length;
  if (dayCount < 3) return "기록이 3일 이상 쌓이면 AI가 생활 흐름을 더 잘 기억할 수 있어요.";

  const recent = records.slice(0, 7);
  const familyDays = recent.filter((record) => record.connectionTags?.includes("family_contact")).length;
  const walkDays = recent.filter((record) => record.activityTags?.some((activity) => ["walk", "fresh_air"].includes(activity))).length;
  const mealDays = recent.filter((record) => record.activityTags?.includes("meal_good")).length;

  if (familyDays >= 2) return "최근에는 가족과 이야기한 날이 자주 남아 있어요.";
  if (walkDays >= 2) return "지난 기록에서도 바깥 공기를 느낀 날이 있었어요.";
  if (mealDays >= 2) return "최근에는 식사를 잘 챙긴 날이 이어지고 있어요.";
  return "최근 3일의 하루가 차곡차곡 이어지고 있어요.";
}

function getWeeklyInsight(records: TodayRecord[]) {
  const dayCount = getUniqueRecordDates(records).length;
  if (dayCount < 7) return "7일의 기록이 쌓이면 이번 주 생활 흐름을 따뜻하게 정리해드려요.";

  const recent = records.slice(0, 7);
  const activeDays = recent.filter((record) => record.activityTags?.some((activity) => ["walk", "shopping", "clinic", "fresh_air", "neighbor_meet"].includes(activity))).length;
  const connectedDays = recent.filter((record) => record.connectionTags?.some((tag) => ["family_contact", "neighbor_meet"].includes(tag))).length;
  if (connectedDays >= 3) return "이번 주는 가족이나 이웃과 마음을 나눈 날이 꾸준히 이어졌어요.";
  if (activeDays >= 3) return "이번 주는 집 밖의 시간을 남긴 날이 여러 번 있었어요.";
  return "이번 주도 평소와 비슷한 편안한 생활 흐름이 이어졌어요.";
}

function getAiWeeklyLetter(records: TodayRecord[]): AiWeeklyLetter | null {
  const dayCount = getUniqueRecordDates(records).length;
  if (dayCount < 5) return null;

  const recent = records.slice(0, 7);
  const walked = recent.some((record) => record.activityTags?.some((activity) => ["walk", "fresh_air"].includes(activity)));
  const connected = recent.some((record) => record.connectionTags?.some((tag) => ["family_contact", "neighbor_meet"].includes(tag)));
  const moments = [walked ? "바깥 공기를 느낀 날도 있었고" : "편안히 쉬어간 날도 있었고", connected ? "가족이나 이웃과 마음을 나눈 날도 있었어요" : "조용히 나를 돌본 시간도 있었어요"].join(", ");

  return {
    title: "이번 주 AI 편지",
    body: `이번 주도 꾸준히 하루를 남겨주셔서 감사합니다. ${moments}. 다음 주도 지금처럼 천천히 하루를 들려주세요.`,
    familySummary: "이번 주 기록은 전반적으로 평소와 비슷한 안심 흐름을 보여요.",
  };
}

function ParentSteppedRecordExperience({ records, encouragement, onSaved, onViewFamily }: { records: TodayRecord[]; encouragement: Encouragement; onSaved: (record: TodayRecord) => void; onViewFamily: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<SeniorActivity[]>([]);
  const [selectedMood, setSelectedMood] = useState<SeniorMood | null>(null);
  const [dailyQuestionAnswer, setDailyQuestionAnswer] = useState("");
  const [dailyQuestionNote, setDailyQuestionNote] = useState("");
  const [completed, setCompleted] = useState(false);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [savedRecord, setSavedRecord] = useState<TodayRecord | null>(null);
  const [farm, setFarm] = useState<UserFarm | null>(null);
  const [harvestStorage, setHarvestStorage] = useState<HarvestStorageItem[]>([]);
  const [farmExpanded, setFarmExpanded] = useState(false);
  const [harvestMessage, setHarvestMessage] = useState("");
  const dailyQuestion = useMemo(() => getTodayQuestion(), []);

  useEffect(() => {
    setFarm(readUserFarm());
    setHarvestStorage(readHarvestStorage());
  }, []);

  function toggleActivity(activity: SeniorActivity) {
    setSelectedActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  }

  function completeRecord() {
    const moodTag = selectedMood ?? "normal";
    const completedAt = new Date().toISOString();
    const answer = dailyQuestionNote.trim() || dailyQuestionAnswer;
    const record: TodayRecord = {
      id: `record-${Date.now()}`,
      date: completedAt.slice(0, 10),
      moment: getSeniorMoodLabel(moodTag),
      activity: selectedActivities.map(getSeniorActivityLabel).join(", "),
      message: encouragement.message,
      activityTags: selectedActivities,
      moodTag,
      connectionTags: getConnectionTags(selectedActivities, true),
      note: dailyQuestionNote.trim() || undefined,
      completedAt,
      viewedSupportMessage: true,
      completedTodayRecord: true,
      dailyQuestionId: dailyQuestion.id,
      dailyQuestionAnswer: answer || undefined,
      createdAt: completedAt,
    };
    const items = [record, ...readRecords()];
    window.localStorage.setItem(recordsKey, JSON.stringify(items));
    if (farm?.currentCropId) {
      const nextFarm = growFarm(farm, record.date);
      setFarm(nextFarm);
      saveUserFarm(nextFarm);
    }
    setSavedRecord(record);
    setCompleted(true);
    onSaved(record);
  }

  function selectCrop(crop: CropType) {
    const growthDate = savedRecord?.date && farm?.lastGrowthDate !== savedRecord.date ? savedRecord.date : undefined;
    const nextFarm = {
      ...createFarm(crop, growthDate),
      totalHarvests: farm?.totalHarvests ?? 0,
    };
    setFarm(nextFarm);
    saveUserFarm(nextFarm);
    setFarmExpanded(false);
    setHarvestMessage(`${crop.name} 키우기를 시작했어요.`);
  }

  function harvestCrop() {
    const crop = getCropById(farm?.currentCropId);
    if (!farm || !crop || !farm.harvestable) return;

    const harvestedAt = new Date().toISOString();
    const existing = harvestStorage.find((item) => item.cropId === crop.id);
    const nextStorage = existing
      ? harvestStorage.map((item) => item.cropId === crop.id ? { ...item, count: item.count + 1, harvestedAt } : item)
      : [...harvestStorage, { cropId: crop.id, count: 1, harvestedAt }];
    const nextFarm: UserFarm = {
      ...farm,
      currentCropId: null,
      recordedDays: 0,
      growthPercent: 0,
      startedAt: undefined,
      lastGrowthDate: farm.lastGrowthDate,
      harvestable: false,
      totalHarvests: farm.totalHarvests + 1,
    };
    setHarvestStorage(nextStorage);
    setFarm(nextFarm);
    saveHarvestStorage(nextStorage);
    saveUserFarm(nextFarm);
    setFarmExpanded(true);
    setHarvestMessage(`${crop.emoji} ${crop.name} 1개를 수확했어요.`);
  }

  if (completed) {
    const completedRecord = savedRecord ?? records[0];
    if (!completedRecord) return null;
    const feedback = getParentAiFeedback(completedRecord);
    const completedRecords = records.some((record) => record.id === completedRecord.id) ? records : [completedRecord, ...records];
    const recordedDays = getUniqueRecordDates(completedRecords).length;
    const streak = getRecordStreak(completedRecords);
    const weeklyLetter = getAiWeeklyLetter(completedRecords);

    return (
      <StepShell step={5}>
        <section className="rounded-[30px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#F0FDF4] text-[#15803D]">
            <Check size={32} aria-hidden />
          </div>
          <div className="text-center">
            <h2 className="mt-6 text-[2rem] font-black leading-tight">
              오늘도 기록해주셔서
              <br />
              감사합니다
            </h2>
            <p className="mt-3 text-lg font-bold leading-8 text-[#6B7280]">AI가 오늘 하루를 따뜻하게 정리했어요.</p>
          </div>

          <div className="mt-7 rounded-[24px] bg-[#FFF7ED] p-5 sm:p-6">
            <p className="text-sm font-black text-[#F97316]">오늘의 AI 한 줄</p>
            <p className="mt-3 text-[1.45rem] font-black leading-9 text-[#1F2937]">{feedback.line}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-black text-[#6B7280]">오늘의 안심 점수</p>
                <p className="mt-2 text-3xl font-black text-[#15803D]">{feedback.score}점</p>
                <p className="mt-1 font-semibold leading-7 text-[#6B7280]">
                  {completedRecord.moodTag === "tired" || completedRecord.moodTag === "worried"
                    ? "오늘은 천천히 쉬어간 흐름이에요."
                    : "평소와 비슷한 편안한 흐름이에요."}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-black text-[#6B7280]">오늘의 작은 칭찬</p>
                <p className="mt-2 text-lg font-black leading-7 text-[#1F2937]">{feedback.praise}</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4">
              <p className="text-sm font-black text-[#6B7280]">내일을 위한 작은 제안</p>
              <p className="mt-2 text-lg font-black leading-7 text-[#1F2937]">{feedback.suggestion}</p>
            </div>
            <div className="mt-4 border-t border-[#FED7AA] pt-4">
              <p className="font-black leading-7 text-[#C2410C]">오늘 기록 완료 · 안심포인트 +5</p>
              <p className="mt-1 font-semibold leading-7 text-[#7C2D12]">
                {streak >= 3 ? `${streak}일 연속 안부가 이어지고 있어요.` : "오늘도 가족에게 안심을 전했어요."}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-[#EFF6FF] p-5 sm:p-6">
            <p className="text-sm font-black text-[#2563EB]">AI가 기억하고 있어요</p>
            <p className="mt-3 text-xl font-black leading-8 text-[#1F2937]">{getRememberedMessage(completedRecords)}</p>
            <div className="mt-5 border-t border-[#BFDBFE] pt-5">
              <p className="text-sm font-black text-[#2563EB]">이번 주 AI 인사이트</p>
              <p className="mt-2 font-semibold leading-7 text-[#4B5563]">{getWeeklyInsight(completedRecords)}</p>
            </div>
            <div className="mt-5 border-t border-[#BFDBFE] pt-5">
              <p className="text-sm font-black text-[#2563EB]">이번 주 AI 편지</p>
              {weeklyLetter ? (
                <p className="mt-2 font-semibold leading-8 text-[#4B5563]">{weeklyLetter.body}</p>
              ) : (
                <p className="mt-2 font-semibold leading-7 text-[#4B5563]">이번 주 기록이 조금 더 쌓이면 AI가 따뜻한 편지를 써드려요. 지금 {recordedDays}일의 하루가 남아 있어요.</p>
              )}
            </div>
          </div>

          <FarmRewardCard
            farm={farm}
            storage={harvestStorage}
            expanded={farmExpanded}
            harvestMessage={harvestMessage}
            onToggle={() => setFarmExpanded((current) => !current)}
            onSelectCrop={selectCrop}
            onHarvest={harvestCrop}
          />

          <div className="mt-4 rounded-[24px] border border-[#E5E7EB] bg-[#F9FAFB] p-5 sm:p-6">
            <p className="text-sm font-black text-[#6B7280]">오늘의 작은 미션</p>
            <p className="mt-2 text-xl font-black leading-8 text-[#1F2937]">{feedback.suggestion}</p>
            <p className="mt-2 font-semibold leading-7 text-[#6B7280]">하고 싶을 때 가볍게 해보세요.</p>
            <button
              type="button"
              onClick={() => setMissionCompleted(true)}
              disabled={missionCompleted}
              className={`mt-4 min-h-14 w-full rounded-2xl px-5 text-lg font-black transition ${missionCompleted ? "bg-[#DCFCE7] text-[#15803D]" : "bg-white text-[#2563EB] shadow-[0_8px_24px_rgba(15,23,42,0.08)]"}`}
            >
              {missionCompleted ? "좋아요. 오늘도 작은 실천을 해내셨어요." : "해봤어요"}
            </button>
          </div>

          <div className="mt-8 grid gap-3">
            <button type="button" onClick={onViewFamily} className="min-h-16 w-full rounded-2xl bg-[#2563EB] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]">
              가족 화면 살펴보기
            </button>
            <button
              type="button"
              onClick={() => {
                setCompleted(false);
                setStep(1);
                setSelectedActivities([]);
                setSelectedMood(null);
                setDailyQuestionAnswer("");
                setDailyQuestionNote("");
                setMissionCompleted(false);
                setSavedRecord(null);
                setFarmExpanded(false);
                setHarvestMessage("");
              }}
              className="min-h-16 w-full rounded-2xl border border-[#E5E7EB] bg-white px-5 text-[1.375rem] font-black text-[#4B5563]"
            >
              홈으로 돌아가기
            </button>
          </div>
        </section>
      </StepShell>
    );
  }

  return (
    <StepShell step={step}>
      {step === 1 ? (
        <StepCard
          title="오늘은 어떤 하루였나요?"
          description={
            <>
              기억나는 것만 골라도 충분해요.
              <br />
              여러 개를 선택할 수 있어요.
            </>
          }
          footer={
            <>
              <button type="button" onClick={() => setStep(2)} className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
                다음
              </button>
              <p className="mt-3 text-center text-sm font-bold text-[#9CA3AF]">생각나는 것이 없어도 괜찮아요.</p>
            </>
          }
        >
          <div className="grid gap-3">
            {seniorActivityOptions.map((option) => (
              <SeniorChoiceButton
                key={option.value}
                selected={selectedActivities.includes(option.value)}
                emoji={option.emoji}
                label={option.label}
                onClick={() => toggleActivity(option.value)}
              />
            ))}
          </div>
        </StepCard>
      ) : null}

      {step === 2 ? (
        <StepCard
          title="오늘 하루 느낌은 어땠나요?"
          description="가장 가까운 하나만 골라주세요."
          footer={
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!selectedMood}
              className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)] disabled:bg-[#FDBA74] disabled:shadow-none"
            >
              다음
            </button>
          }
        >
          <div className="grid gap-3">
            {seniorMoodOptions.map((option) => (
              <SeniorChoiceButton
                key={option.value}
                selected={selectedMood === option.value}
                emoji={option.emoji}
                label={option.label}
                onClick={() => setSelectedMood(option.value)}
              />
            ))}
          </div>
        </StepCard>
      ) : null}

      {step === 3 ? (
        <StepCard
          title={
            <>
              오늘의 응원이
              <br />
              도착했어요 ❤️
            </>
          }
          description={
            <>
              답장은 하지 않아도 괜찮아요.
              <br />
              읽기만 해도
              <br />
              가족에게 마음이 전해집니다.
            </>
          }
          footer={
            <button type="button" onClick={() => setStep(4)} className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
              읽었어요
            </button>
          }
        >
          <div className="rounded-[28px] bg-[#FFF7ED] p-7 sm:p-8">
            <p className="text-[1.55rem] font-black leading-tight text-[#C2410C]">{encouragement.sender}이 보낸 응원</p>
            <p className="mt-6 text-[1.375rem] font-black leading-9 text-[#1F2937]">
              {formatSupportMessage(encouragement.message)}
            </p>
          </div>
        </StepCard>
      ) : null}

      {step === 4 ? (
        <StepCard
          title="이번 주의 하루들"
          description="하루하루가 잘 남겨지고 있어요."
          footer={
            <button type="button" onClick={() => setStep(5)} className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
              다음
            </button>
          }
        >
          <WeeklySummaryContent audience="parent" />
        </StepCard>
      ) : null}

      {step === 5 ? (
        <StepCard
          title={dailyQuestion.question}
          description={
            <>
              오늘의 질문
              <br />
              짧게 골라도 괜찮아요.
            </>
          }
          footer={
            <>
              <button type="button" onClick={completeRecord} className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-[1.375rem] font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
                오늘의 기록 완료
              </button>
              <p className="mt-3 text-center text-sm font-bold text-[#9CA3AF]">건너뛰어도 괜찮아요.</p>
            </>
          }
        >
          <div className="grid gap-3">
            {dailyQuestion.options?.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={dailyQuestionAnswer === option}
                onClick={() => {
                  setDailyQuestionAnswer(option);
                  setDailyQuestionNote("");
                }}
                className={`min-h-16 w-full rounded-2xl border px-5 text-left text-xl font-black transition ${dailyQuestionAnswer === option ? "border-[#F97316] bg-[#FFF7ED] text-[#C2410C]" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"}`}
              >
                {option}
              </button>
            ))}
            <label className="mt-2 block">
              <span className="text-lg font-black">한 줄로 남기기 <span className="text-[#6B7280]">선택</span></span>
              <input
                value={dailyQuestionNote}
                onChange={(event) => {
                  setDailyQuestionNote(event.target.value);
                  setDailyQuestionAnswer("");
                }}
                placeholder="짧게 적어도 좋아요."
                className="mt-3 min-h-16 w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 text-lg font-semibold outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#FFEDD5]"
              />
            </label>
          </div>
        </StepCard>
      ) : null}
    </StepShell>
  );
}

function StepShell({ step, children }: { step: number; children: ReactNode }) {
  const stepDescription = {
    1: "오늘 있었던 일을 고르는 단계입니다.",
    2: "오늘의 느낌을 고르는 단계입니다.",
    3: "가족의 응원을 확인하는 단계입니다.",
    4: "이번 주의 하루를 돌아보는 단계입니다.",
    5: "오늘의 질문에 가볍게 답하는 단계입니다.",
  }[step];

  return (
    <div>
      <div className="mb-4 rounded-[24px] bg-white/80 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-black text-[#F97316]">오늘의 기록 {step}단계</p>
          <p className="text-base font-black text-[#6B7280]">{step} / 5</p>
        </div>
        <p className="mt-2 text-[1.05rem] font-bold leading-7 text-[#6B7280]">{stepDescription}</p>
        <div className="mt-3 grid grid-cols-5 gap-2" aria-hidden>
          {[1, 2, 3, 4, 5].map((item) => (
            <span key={item} className={`h-3 rounded-full ${item <= step ? "bg-[#F97316]" : "bg-[#FED7AA]"}`} />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

function StepCard({ title, description, children, footer }: { title: ReactNode; description: ReactNode; children: ReactNode; footer: ReactNode }) {
  return (
    <section className="grid min-h-[68vh] rounded-[30px] bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <div>
        <h2 className="text-[2.125rem] font-black leading-tight sm:text-[2.35rem]">{title}</h2>
        <p className="mt-4 text-[1.125rem] font-semibold leading-8 text-[#6B7280]">{description}</p>
      </div>
      <div className="mt-7">{children}</div>
      <div className="mt-8 self-end">{footer}</div>
    </section>
  );
}

function FarmRewardCard({
  farm,
  storage,
  expanded,
  harvestMessage,
  onToggle,
  onSelectCrop,
  onHarvest,
}: {
  farm: UserFarm | null;
  storage: HarvestStorageItem[];
  expanded: boolean;
  harvestMessage: string;
  onToggle: () => void;
  onSelectCrop: (crop: CropType) => void;
  onHarvest: () => void;
}) {
  const crop = getCropById(farm?.currentCropId);
  const stage = getCropStage(farm?.growthPercent ?? 0);
  const remainingDays = crop && farm ? Math.max(crop.requiredDays - farm.recordedDays, 0) : 0;
  const month = new Date().getMonth() + 1;
  const currentSeason = month >= 3 && month <= 5 ? "봄" : month >= 6 && month <= 8 ? "여름" : month >= 9 && month <= 11 ? "가을" : "겨울";
  const seasonEvent = seasonEvents.find((event) => event.season === currentSeason);

  return (
    <section className="mt-4 rounded-[24px] border border-[#BBF7D0] bg-[#F0FDF4] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#15803D] shadow-[0_8px_22px_rgba(21,128,61,0.10)]">
          <Sprout size={30} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-[#15803D]">나의 안심농장</p>
          <h3 className="mt-2 text-xl font-black leading-8 text-[#1F2937]">
            {crop ? `${crop.emoji} ${crop.name}이 자라고 있어요.` : "오늘의 안부로 작물을 키워보세요."}
          </h3>
          <p className="mt-1 font-semibold leading-7 text-[#4B5563]">
            {crop && farm
              ? farm.harvestable
                ? "축하합니다. 작물이 잘 자랐어요."
                : `수확까지 ${remainingDays}일 남았어요.`
              : "오늘 하루를 기록하면 작물이 조금씩 자라요."}
          </p>
        </div>
      </div>

      {crop && farm ? (
        <div className="mt-5">
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 px-4 py-4">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] text-5xl" aria-label={`${crop.name} ${stage} 단계`}>
              {crop.imageStages[stage]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 text-sm font-black text-[#166534]">
                <span>{crop.name} · {crop.requiredDays}일</span>
                <span>{Math.round(farm.growthPercent)}%</span>
              </div>
              <div className="mt-2 h-4 overflow-hidden rounded-full bg-[#DCFCE7]" role="progressbar" aria-label={`${crop.name} 성장률`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(farm.growthPercent)}>
                <div className="h-full rounded-full bg-[#22C55E] transition-all" style={{ width: `${farm.growthPercent}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">{getCropGrowthMessage(crop, farm)}</p>
            </div>
          </div>
          {farm.harvestable ? (
            <button type="button" onClick={onHarvest} className="mt-4 min-h-14 w-full rounded-2xl bg-[#15803D] px-5 text-lg font-black text-white shadow-[0_12px_28px_rgba(21,128,61,0.20)]">
              수확하기
            </button>
          ) : null}
        </div>
      ) : null}

      {harvestMessage ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 font-black leading-7 text-[#166534]">{harvestMessage}</p> : null}

      <button type="button" onClick={onToggle} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-lg font-black text-[#15803D] shadow-[0_8px_22px_rgba(21,128,61,0.10)]">
        {expanded ? "농장 내용 닫기" : crop ? "농장 보기" : "작물 고르기"}
        <Sprout size={20} aria-hidden />
      </button>

      {expanded ? (
        <div className="mt-6 border-t border-[#BBF7D0] pt-6">
          {!crop ? (
            <CropSelection onSelect={onSelectCrop} />
          ) : (
            <>
              <h4 className="text-xl font-black leading-8 text-[#1F2937]">하루를 남길 때마다 자동으로 자라요.</h4>
              <p className="mt-2 font-semibold leading-7 text-[#4B5563]">같은 날 여러 번 기록해도 성장은 하루 한 번만 이어집니다.</p>
            </>
          )}

          <div className="mt-7 border-t border-[#BBF7D0] pt-6">
            <div className="flex items-center gap-2 text-[#166534]">
              <PackageOpen size={22} aria-hidden />
              <h4 className="text-xl font-black">수확 창고</h4>
            </div>
            {storage.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {storage.map((item) => {
                  const storedCrop = getCropById(item.cropId);
                  return storedCrop ? (
                    <div key={item.cropId} className="flex min-h-12 items-center justify-between border-b border-[#DCFCE7] py-2 font-black text-[#1F2937]">
                      <span>{storedCrop.emoji} {storedCrop.name}</span>
                      <span>{item.count}개</span>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="mt-3 font-semibold leading-7 text-[#4B5563]">첫 수확을 기다리고 있어요. 키운 작물이 차곡차곡 모일 거예요.</p>
            )}
          </div>

          {seasonEvent ? (
            <div className="mt-6 border-t border-[#BBF7D0] pt-6">
              <p className="text-sm font-black text-[#15803D]">시즌 이벤트 예고</p>
              <p className="mt-2 text-lg font-black text-[#1F2937]">{seasonEvent.title}</p>
              <p className="mt-2 font-semibold leading-7 text-[#4B5563]">수확한 작물은 시즌 이벤트 참여에 사용할 수 있어요. 실물 수확 이벤트는 브랜드 협업 시에만 열립니다.</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function CropSelection({ onSelect }: { onSelect: (crop: CropType) => void }) {
  return (
    <div>
      <h4 className="text-[1.6rem] font-black leading-tight text-[#1F2937]">어떤 작물을 키워보고 싶으세요?</h4>
      <p className="mt-3 text-lg font-semibold leading-8 text-[#4B5563]">오늘의 안부를 남기면 작물이 조금씩 자라요.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {cropTypes.map((crop) => (
          <button
            key={crop.id}
            type="button"
            onClick={() => onSelect(crop)}
            className="flex min-h-28 items-center gap-4 rounded-2xl border border-[#BBF7D0] bg-white px-4 py-4 text-left transition hover:border-[#22C55E] active:scale-[0.99]"
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0FDF4] text-4xl" aria-hidden>{crop.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xl font-black text-[#1F2937]">{crop.name} · {crop.requiredDays}일</span>
              <span className="mt-1 block font-bold text-[#6B7280]">{crop.difficulty} · {crop.season}</span>
              <span className="mt-2 block font-black text-[#15803D]">이 작물 키우기</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatSupportMessage(message: string) {
  if (message.includes("엄마 오늘도 좋은 하루 보내세요")) {
    return (
      <>
        엄마,
        <br />
        오늘도 좋은 하루
        <br />
        보내세요 ❤️
      </>
    );
  }

  const [firstWord, ...rest] = message.split(" ");
  if (rest.length >= 3) {
    return (
      <>
        {firstWord},
        <br />
        {rest.slice(0, 3).join(" ")}
        <br />
        {rest.slice(3).join(" ")}
      </>
    );
  }

  return message;
}

function ParentTodayRecordCard({ onSaved }: { onSaved: (record: TodayRecord) => void }) {
  const [selectedMood, setSelectedMood] = useState<SeniorMood>("normal");
  const [selectedActivities, setSelectedActivities] = useState<SeniorActivity[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function toggleActivity(activity: SeniorActivity) {
    setSelectedActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  }

  function submitRecord() {
    const moodLabel = seniorMoodOptions.find((option) => option.value === selectedMood)?.label ?? "평범했어요";
    const activityLabels = selectedActivities
      .map((activity) => seniorActivityOptions.find((option) => option.value === activity)?.label)
      .filter(Boolean)
      .join(", ");
    const completedAt = new Date().toISOString();
    const record: TodayRecord = {
      id: `record-${Date.now()}`,
      date: completedAt.slice(0, 10),
      moment: moodLabel,
      activity: activityLabels,
      message: note.trim(),
      activityTags: selectedActivities,
      moodTag: selectedMood,
      connectionTags: getConnectionTags(selectedActivities, false),
      note: note.trim(),
      completedAt,
      viewedSupportMessage: false,
      createdAt: completedAt,
    };
    const items = [record, ...readRecords()];
    window.localStorage.setItem(recordsKey, JSON.stringify(items));
    setSaved(true);
    onSaved(record);
  }

  return (
    <section id="today-record" className="rounded-[30px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <p className="text-sm font-black text-[#F97316]">오늘의 기록</p>
      <h2 className="mt-3 text-4xl font-black leading-tight">오늘 하루는 어떠셨나요?</h2>
      <p className="mt-4 text-lg font-semibold leading-8 text-[#6B7280]">
        기억나는 것만 가볍게 남겨도 충분해요.
      </p>

      <div className="mt-7 grid gap-7">
        <section>
          <h3 className="text-2xl font-black leading-tight">오늘 있었던 일을 골라보세요.</h3>
          <p className="mt-2 font-semibold leading-7 text-[#6B7280]">여러 개를 선택할 수 있어요.</p>
          <div className="mt-4 grid gap-3">
            {seniorActivityOptions.map((option) => (
              <SeniorChoiceButton
                key={option.value}
                selected={selectedActivities.includes(option.value)}
                emoji={option.emoji}
                label={option.label}
                onClick={() => toggleActivity(option.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-black leading-tight">오늘 하루 느낌은 어땠나요?</h3>
          <p className="mt-2 font-semibold leading-7 text-[#6B7280]">하나만 선택해 주세요.</p>
          <div className="mt-4 grid gap-3">
            {seniorMoodOptions.map((option) => (
              <SeniorChoiceButton
                key={option.value}
                selected={selectedMood === option.value}
                emoji={option.emoji}
                label={option.label}
                onClick={() => setSelectedMood(option.value)}
              />
            ))}
          </div>
        </section>

        <label className="block">
          <span className="text-lg font-black">남기고 싶은 말이 있나요? <span className="text-[#6B7280]">선택</span></span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="예: 오늘은 집에서 편하게 쉬었어요."
            className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-lg font-semibold outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#FFEDD5]"
          />
        </label>

        <button type="button" onClick={submitRecord} className="min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-lg font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
          오늘의 기록 남기기
        </button>
      </div>

      {saved ? (
        <div className="mt-4 rounded-2xl bg-[#F0FDF4] p-4">
          <p className="text-lg font-black text-[#15803D]">오늘의 기록이 남겨졌습니다.</p>
          <p className="mt-2 font-semibold leading-7 text-[#166534]">가족에게 안심이 전해졌어요.</p>
        </div>
      ) : null}
    </section>
  );
}

function SeniorChoiceButton({ selected, emoji, label, onClick }: { selected: boolean; emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border px-4 text-left text-xl font-black transition active:scale-[0.99] ${selected ? "border-[#F97316] bg-[#FFF7ED] text-[#C2410C]" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"}`}
    >
      <span className="text-2xl" aria-hidden>{emoji}</span>
      <span className="flex-1">{label}</span>
      {selected ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white">
          <Check size={18} aria-hidden />
        </span>
      ) : null}
    </button>
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
      <p className="font-semibold leading-7 text-[#6B7280]">부모님께 보낼 링크를 복사해 카카오톡이나 문자에 붙여넣어 보내주세요.</p>
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
        <ActionButton title="카카오톡으로 공유" onClick={openKakaoShare} primary />
        <ActionButton title="문자로 공유" onClick={openSms} />
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
      <div className="mt-4 rounded-2xl bg-[#EFF6FF] p-4">
        <p className="text-sm font-black text-[#2563EB]">왜 응원 메시지를 보내나요?</p>
        <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
          부모님을 확인하기 위해서가 아닙니다. 가족의 관심은 기록으로 남고, 그 기록은 시간이 지나며 안심과 변화의 흐름이 됩니다.
        </p>
      </div>

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
    const completedAt = new Date().toISOString();
    const record: TodayRecord = {
      id: `record-${Date.now()}`,
      date: completedAt.slice(0, 10),
      moment: selectedMoment,
      activity: selectedActivity,
      message: selectedMessage,
      activityTags: [],
      moodTag: null,
      connectionTags: [],
      completedAt,
      viewedSupportMessage: false,
      createdAt: completedAt,
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
        오늘 안부 전하기
      </button>
      {saved ? (
        <div className="mt-4 rounded-2xl bg-[#F0FDF4] p-4">
          <p className="text-lg font-black text-[#15803D]">오늘의 안부가 가족에게 전해졌어요.</p>
          <p className="mt-2 font-semibold text-[#166534]">답장을 기다리지 않아도 괜찮아요. 기록만으로도 가족은 안심할 수 있어요.</p>
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

function WeeklyMemoryCard({ audience = "parent" }: { audience?: "parent" | "family" }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-black text-[#2563EB]">최근 7일 기준</p>
      <h2 className="mt-3 text-2xl font-black leading-tight">{audience === "parent" ? "이번 주의 하루들" : "이번 주 안심 패턴"}</h2>
      <WeeklySummaryContent audience={audience} />
    </section>
  );
}

function WeeklySummaryContent({ audience = "parent" }: { audience?: "parent" | "family" }) {
  const patternRows = [
    ["😊", "편안한 날 3일"],
    ["🏠", "집에서 쉰 날 4일"],
    ["🚶", "산책한 날 1일"],
    ["☕", "여유로운 시간 2회"],
  ];

  return (
    <>
      <p className="mt-3 text-lg font-black leading-8 text-[#1F2937]">
        {audience === "parent"
          ? "평범하고 편안한 하루가 많았어요. 산책한 날도 잘 남겨졌어요."
          : "부모님은 이번 주에 편안한 하루가 많았습니다."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {patternRows.map(([emoji, label]) => (
          <div key={label} className="flex min-h-14 items-center gap-3 rounded-2xl bg-[#F9FAFB] px-4 text-base font-black text-[#1F2937]">
            <span className="text-2xl" aria-hidden>{emoji}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4">
        <p className="text-sm font-black text-[#2563EB]">
          {audience === "parent" ? "이번 주 한마디" : "AI 안심 인사이트"}
        </p>
        <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
          {audience === "parent"
            ? "딸의 응원도 함께 쌓였어요. 이번 주도 하루하루가 잘 남겨지고 있어요."
            : "가족 연락 기록이 꾸준히 유지되었습니다. 특별한 변화는 감지되지 않았습니다."}
        </p>
      </div>
    </>
  );
}

function readUserFarm(): UserFarm | null {
  try {
    const raw = window.localStorage.getItem(farmKey);
    return raw ? (JSON.parse(raw) as UserFarm) : null;
  } catch {
    return null;
  }
}

function saveUserFarm(farm: UserFarm) {
  window.localStorage.setItem(farmKey, JSON.stringify(farm));
}

function readHarvestStorage(): HarvestStorageItem[] {
  try {
    const raw = window.localStorage.getItem(harvestStorageKey);
    return raw ? (JSON.parse(raw) as HarvestStorageItem[]) : [];
  } catch {
    return [];
  }
}

function saveHarvestStorage(storage: HarvestStorageItem[]) {
  window.localStorage.setItem(harvestStorageKey, JSON.stringify(storage));
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
