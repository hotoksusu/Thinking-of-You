export type ReminderStep = {
  step: string;
  time: string;
  message: string;
  target: "parent" | "family";
};

export type TrendPoint = {
  label: string;
  score: number;
  responseRate?: number;
  condition?: string;
};

export function analyzeNoResponsePattern() {
  return {
    baselineResponseRate: 95,
    recentResponseRate: 60,
    consecutiveNoResponseDays: 3,
    summary: "최근 응답 빈도가 평소보다 줄었습니다.",
    interpretation: "생활 패턴 변화 가능성이 있어 가족 확인을 권장합니다.",
  };
}

export function generateReminderSchedule(): ReminderStep[] {
  return [
    {
      step: "1차 알림",
      time: "19:30",
      message: "오늘 안부를 남겨주세요",
      target: "parent",
    },
    {
      step: "2차 알림",
      time: "20:30",
      message: "아직 안부가 확인되지 않았어요",
      target: "parent",
    },
    {
      step: "3차 알림",
      time: "21:30",
      message: "가족에게 확인 권장 알림 표시",
      target: "family",
    },
  ];
}

export function getDailyTrend() {
  return {
    title: "오늘의 안심 상태",
    score: 92,
    responded: true,
    condition: "보통이에요",
    notes: ["오늘 응답 완료", "컨디션 특이 변화 없음", "가벼운 활동 확인"],
  };
}

export function getWeeklyTrend(): TrendPoint[] {
  return [
    { label: "월", score: 92, responseRate: 100 },
    { label: "화", score: 91, responseRate: 100 },
    { label: "수", score: 90, responseRate: 85 },
    { label: "목", score: 88, responseRate: 70 },
    { label: "금", score: 87, responseRate: 65 },
    { label: "토", score: 86, responseRate: 60 },
    { label: "일", score: 85, responseRate: 60 },
  ];
}

export function getMonthlyTrend(): TrendPoint[] {
  return [
    { label: "1주", score: 92 },
    { label: "2주", score: 89 },
    { label: "3주", score: 87 },
    { label: "4주", score: 85 },
    { label: "이번 주", score: 82 },
  ];
}

export function generateFamilyAlert() {
  return {
    title: "최근 변화가 감지되었습니다.",
    description: "엄마의 응답 빈도가 평소보다 줄었습니다.",
    recommendation: "이번 주 짧은 통화를 권장합니다.",
    reasons: ["3일 연속 미응답", "안심 점수 완만한 하락", "활동량 지속 감소"],
  };
}
