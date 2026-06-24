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

export type DailyMomentRecord = {
  date: string;
  moment: string;
  memory: string;
  mood: string;
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
  "😊 기분 좋았어요",
  "🙂 평범했어요",
  "☕ 여유롭게 보냈어요",
  "🏠 집에서 쉬었어요",
  "🚶 바쁘게 보냈어요",
];

export const memoryMomentOptions = ["☕ 커피 한 잔", "🌳 산책", "👨‍👩‍👧 가족", "📺 TV", "📚 책"];

export const weatherMoodOptions = ["🌞 맑음", "⛅ 보통", "🌧 조금 지침"];

export const familyEncouragements: FamilyEncouragement[] = [
  {
    id: "encourage-daughter",
    sender: "딸",
    icon: "❤️",
    message: "엄마 오늘도 좋은 하루 보내세요.",
    sentAt: "오늘 오전",
    requiresReply: false,
  },
  {
    id: "encourage-son",
    sender: "아들",
    icon: "☀️",
    message: "오늘 날씨가 좋네요. 산책도 하시고 맛있는 것도 드세요.",
    sentAt: "어제 오후",
    requiresReply: false,
  },
  {
    id: "encourage-family",
    sender: "가족",
    icon: "😊",
    message: "이번 주말에 전화드릴게요. 사랑합니다.",
    sentAt: "이번 주",
    requiresReply: false,
  },
];

export function analyzeNoResponsePattern() {
  return {
    baselineParticipationRate: 95,
    recentParticipationRate: 78,
    missedRecordDays: 2,
    summary: "최근 기록 참여 빈도가 평소보다 조금 줄었습니다.",
    interpretation: "생활 리듬 변화 가능성이 있어 가볍게 근황을 나눠보는 것을 권장합니다.",
  };
}

export function generateReminderSchedule(): ReminderStep[] {
  return [
    {
      step: "1차 알림",
      time: "19:30",
      message: "오늘의 한 순간을 남겨주세요",
      target: "parent",
    },
    {
      step: "2차 알림",
      time: "20:30",
      message: "오늘 하루를 한 번만 남겨볼까요?",
      target: "parent",
    },
    {
      step: "3차 알림",
      time: "21:30",
      message: "기록 리듬 변화가 가족 리포트에 반영됩니다",
      target: "family",
    },
  ];
}

export function getDailyTrend() {
  return {
    title: "오늘의 일상 기록",
    score: 89,
    recorded: true,
    mood: "평범했어요",
    notes: ["오늘의 한 순간 기록 완료", "긍정 표현 유지", "생활 리듬 특이 변화 없음"],
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
    title: "생활 리듬 변화가 감지되었습니다.",
    description: "엄마의 기록 참여 빈도와 외부 활동 관련 표현이 평소보다 줄었습니다.",
    recommendation: "이번 주에는 부담 없는 근황 대화를 권장합니다.",
    reasons: ["기록 빈도 소폭 감소", "집에서 쉼 응답 증가", "긍정 표현 완만한 감소"],
  };
}

export function generateLifePatternReport(): LifePatternReport {
  return {
    period: "최근 30일",
    participation: "꾸준히 하루 기록을 남기고 있습니다.",
    vitality: "생활 활력은 안정적으로 유지되고 있습니다.",
    activityPattern: "외부 활동 관련 표현이 최근 2주간 소폭 줄었습니다.",
    positiveTrend: "긍정 응답은 큰 변화 없이 유지되고 있습니다.",
    interestChange: "커피, 산책, TV 관련 기록이 반복적으로 나타납니다.",
    aiInsight: "특별한 이상 신호는 없지만 외부 활동 표현이 줄어 가벼운 대화를 권장합니다.",
  };
}
