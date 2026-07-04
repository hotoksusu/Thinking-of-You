export type ReminderStep = {
  step: string;
  time: string;
  message: string;
  target: "parent" | "family";
};

export type TrendPoint = {
  label: string;
  score: number;
  participationRate?: number;
  mood?: string;
};

export type LifePatternReport = {
  period: string;
  participation: string;
  vitality: string;
  activityPattern: string;
  positiveTrend: string;
  interestChange: string;
  aiInsight: string;
};

export type FamilyEncouragement = {
  id: string;
  sender: string;
  icon: string;
  message: string;
  sentAt: string;
  requiresReply: false;
};

export const dailyMomentOptions = [
  "좋아요",
  "평범했어요",
  "조금 지쳤어요",
  "집에서 쉬었어요",
  "가볍게 움직였어요",
];

export const memoryMomentOptions = ["커피 한 잔", "식사 완료", "가족 생각", "TV 시청", "책 읽기"];

export const weatherMoodOptions = ["맑음", "보통", "조금 흐림"];

export const familyEncouragements: FamilyEncouragement[] = [
  {
    id: "encourage-daughter",
    sender: "딸",
    icon: "👩",
    message: "엄마, 오늘도 편안한 하루 보내세요.",
    sentAt: "오늘 오전",
    requiresReply: false,
  },
  {
    id: "encourage-son",
    sender: "아들",
    icon: "👨",
    message: "식사 잘 챙기시고 저녁에 잠깐 전화드릴게요.",
    sentAt: "어제 오후",
    requiresReply: false,
  },
  {
    id: "encourage-family",
    sender: "가족",
    icon: "💬",
    message: "이번 주말에 함께 이야기 나눠요.",
    sentAt: "이번 주",
    requiresReply: false,
  },
];

export function analyzeNoResponsePattern() {
  return {
    baselineParticipationRate: 95,
    recentParticipationRate: 78,
    missedRecordDays: 2,
    summary: "최근 생활의 움직임이 평소보다 조금 줄었어요.",
    interpretation: "평소와 다른 하루가 이어졌어요. 가볍게 안부를 물어보세요.",
  };
}

export function generateReminderSchedule(): ReminderStep[] {
  return [
    {
      step: "1차 알림",
      time: "19:30",
      message: "오늘도 평소처럼 지내세요.",
      target: "parent",
    },
    {
      step: "2차 알림",
      time: "20:30",
      message: "아직 오늘의 생활이 충분히 모이지 않았어요.",
      target: "parent",
    },
    {
      step: "가족 알림",
      time: "21:30",
      message: "오늘의 생활이 더 모이면 변화를 알려드릴게요.",
      target: "family",
    },
  ];
}

export function getDailyTrend() {
  return {
    title: "오늘의 생활",
    score: 89,
    recorded: true,
    mood: "평범했어요",
    notes: ["오늘도 자연스럽게 기록됐어요", "평소와 비슷하게 지냈어요", "크게 달라진 점은 없어요"],
  };
}

export function getWeeklyTrend(): TrendPoint[] {
  return [
    { label: "월", score: 92, participationRate: 100 },
    { label: "화", score: 91, participationRate: 100 },
    { label: "수", score: 90, participationRate: 90 },
    { label: "목", score: 89, participationRate: 85 },
    { label: "금", score: 88, participationRate: 85 },
    { label: "토", score: 88, participationRate: 80 },
    { label: "일", score: 89, participationRate: 78 },
  ];
}

export function getMonthlyTrend(): TrendPoint[] {
  return [
    { label: "1주", score: 92 },
    { label: "2주", score: 91 },
    { label: "3주", score: 90 },
    { label: "4주", score: 88 },
    { label: "이번 주", score: 89 },
  ];
}

export function generateFamilyAlert() {
  return {
    title: "변화 감지가 필요합니다.",
    description: "엄마의 움직임과 외출이 평소보다 조금 줄었어요.",
    recommendation: "이번 주에는 짧은 통화를 권장합니다.",
    reasons: ["움직임이 조금 줄었어요", "집에서 쉬는 시간이 늘었어요", "외출이 조금 줄었어요"],
  };
}

export function generateLifePatternReport(): LifePatternReport {
  return {
    period: "최근 30일",
    participation: "오늘도 생활이 자연스럽게 기록되고 있어요.",
    vitality: "생활 활력은 안심권으로 유지되고 있습니다.",
    activityPattern: "외부 활동 관련 표현은 최근 2주간 소폭 줄었습니다.",
    positiveTrend: "긍정 표현은 큰 변화 없이 유지되고 있습니다.",
    interestChange: "커피, 식사, TV를 즐기는 모습이 자주 보여요.",
    aiInsight: "급격한 변화 감지는 없지만 활동 표현이 줄어 이번 주 짧은 통화를 권장합니다.",
  };
}
