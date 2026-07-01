import type {
  AiInsight,
  AiReport,
  CareRequest,
  CareRequestStatus,
  CareResponseRecord,
  MockSchedulerRule,
  PatternChange,
  PeaceScore,
  RiskSignal,
  ResponseMethod,
  ResponsePattern,
  SafetySignal,
  SafetyStatus,
} from "@/types/care";

export const mockCareRequests: CareRequest[] = [
  {
    id: "request-mom-today",
    profileId: "mom",
    scheduledAt: "2026-06-23T10:00:00.000Z",
    sentAt: "2026-06-23T10:00:12.000Z",
    status: "completed",
    responseMethod: "sms",
  },
  {
    id: "request-dad-today",
    profileId: "dad",
    scheduledAt: "2026-06-23T10:00:00.000Z",
    sentAt: "2026-06-23T10:00:09.000Z",
    status: "waiting",
    responseMethod: "phone",
  },
];

export const mockCareResponses: CareResponseRecord[] = [
  {
    id: "response-mom-1",
    profileId: "mom",
    date: "2026-06-23",
    meal: "했어요",
    medicine: "복용함",
    condition: "좋아요",
    contact: "문자함",
    activity: "활동함",
    note: "아침 산책을 다녀오셨고 컨디션이 좋다고 답하셨어요.",
    responseMethod: "sms",
    respondedAt: "2026-06-23T10:18:00.000Z",
  },
  {
    id: "response-mom-2",
    profileId: "mom",
    date: "2026-06-22",
    meal: "했어요",
    medicine: "복용함",
    condition: "보통이에요",
    contact: "통화함",
    activity: "집에만 있었음",
    responseMethod: "kakao",
    respondedAt: "2026-06-22T10:24:00.000Z",
  },
  {
    id: "response-mom-3",
    profileId: "mom",
    date: "2026-06-21",
    meal: "했어요",
    medicine: "모르겠어요",
    condition: "보통이에요",
    contact: "문자함",
    activity: "활동함",
    responseMethod: "sms",
    respondedAt: "2026-06-21T11:02:00.000Z",
  },
  {
    id: "response-mom-4",
    profileId: "mom",
    date: "2026-06-20",
    meal: "했어요",
    medicine: "복용함",
    condition: "좋아요",
    contact: "문자함",
    activity: "활동함",
    responseMethod: "sms",
    respondedAt: "2026-06-20T10:13:00.000Z",
  },
  {
    id: "response-mom-5",
    profileId: "mom",
    date: "2026-06-19",
    meal: "했어요",
    medicine: "복용함",
    condition: "좋아요",
    contact: "통화함",
    activity: "활동함",
    responseMethod: "phone",
    respondedAt: "2026-06-19T10:37:00.000Z",
  },
  {
    id: "response-mom-6",
    profileId: "mom",
    date: "2026-06-18",
    meal: "했어요",
    medicine: "복용함",
    condition: "좋아요",
    contact: "문자함",
    activity: "집에만 있었음",
    responseMethod: "sms",
    respondedAt: "2026-06-18T10:22:00.000Z",
  },
  {
    id: "response-mom-7",
    profileId: "mom",
    date: "2026-06-17",
    meal: "모르겠어요",
    medicine: "모르겠어요",
    condition: "보통이에요",
    contact: "연락 안됨",
    activity: "모르겠어요",
    responseMethod: "sms",
  },
  {
    id: "response-dad-1",
    profileId: "dad",
    date: "2026-06-21",
    meal: "모르겠어요",
    medicine: "모르겠어요",
    condition: "안 좋아요",
    contact: "연락 안됨",
    activity: "모르겠어요",
    responseMethod: "phone",
  },
  {
    id: "response-dad-2",
    profileId: "dad",
    date: "2026-06-20",
    meal: "모르겠어요",
    medicine: "모르겠어요",
    condition: "보통이에요",
    contact: "연락 안됨",
    activity: "모르겠어요",
    responseMethod: "phone",
  },
];

export const mockSchedulerRules: MockSchedulerRule[] = [
  {
    id: "scheduler-mom-daily",
    profileId: "mom",
    time: "10:00",
    enabled: true,
    nextRunLabel: "내일 오전 10시",
    flow: ["안부 요청 발송", "응답 수집", "안심 상태 업데이트", "자녀 알림"],
  },
  {
    id: "scheduler-dad-daily",
    profileId: "dad",
    time: "10:00",
    enabled: true,
    nextRunLabel: "내일 오전 10시",
    flow: ["전화 확인 예약", "응답 수집", "안심 상태 업데이트", "자녀 알림"],
  },
];

const statusLabel: Record<CareRequestStatus, string> = {
  ready: "발송 준비",
  sent: "요청 발송",
  waiting: "응답 대기",
  completed: "응답 완료",
  no_response: "미응답",
};

const methodLabel: Record<ResponseMethod, string> = {
  kakao: "카카오톡",
  sms: "문자(SMS)",
  phone: "전화 확인",
};

export function getCareRequestStatusLabel(status: CareRequestStatus) {
  return statusLabel[status];
}

export function getResponseMethodLabel(method: ResponseMethod) {
  return methodLabel[method];
}

export function sendKakaoRequest(profileId: string): CareRequest {
  return createMockRequest(profileId, "kakao", "sent");
}

export function sendSmsRequest(profileId: string): CareRequest {
  return createMockRequest(profileId, "sms", "sent");
}

export function startPhoneCheck(profileId: string): CareRequest {
  return createMockRequest(profileId, "phone", "waiting");
}

export function calculateSafetyStatus(
  responses: CareResponseRecord[],
  request?: CareRequest,
): SafetyStatus {
  const recent = responses.slice(0, 7);
  const latest = recent[0];
  const responseDays = recent.filter((item) => Boolean(item.respondedAt)).length;
  const signals = detectSafetySignals(responses, request);

  if (signals.includes("2일 연속 미응답") || signals.includes("3일 연속 미응답")) {
    return {
      level: "needs_check",
      label: "확인 필요",
      summary: signals.includes("3일 연속 미응답") ? "3일 연속 미응답" : "2일 연속 미응답",
      signals,
      responseDays,
      totalDays: 7,
    };
  }

  if (signals.length > 0) {
    return {
      level: "caution",
      label: "주의 필요",
      summary: signals[0],
      signals,
      responseDays,
      totalDays: 7,
    };
  }

  return {
    level: "safe",
    label: "안심 양호",
    summary: latest ? "오늘 응답 완료 · 식사 확인 · 약 복용 확인" : "최근 응답을 기다리는 중",
    signals,
    responseDays,
    totalDays: 7,
  };
}

export function calculatePeaceScore(responses: CareResponseRecord[]): PeaceScore {
  const recent = responses.slice(0, 7);
  const responseDays = recent.filter((item) => Boolean(item.respondedAt)).length;
  const medicineConfirmed = recent.filter((item) => item.medicine === "복용함").length;
  const goodOrNormalCondition = recent.filter((item) => item.condition !== "안 좋아요").length;
  const activityConfirmed = recent.filter((item) => item.activity === "활동함").length;

  const responseRate = Math.round((responseDays / 7) * 100);
  const score = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        responseDays * 8 +
          medicineConfirmed * 4 +
          goodOrNormalCondition * 2 +
          activityConfirmed * 2 +
          2,
      ),
    ),
  );

  if (score >= 90) {
    return {
      score,
      level: "good",
      label: "양호",
      summary: "식사·약 복용이 안정적이고 최근 활동도 유지되고 있어요.",
      responseRate,
      factors: [`최근 7일 응답률 ${responseRate}%`, "식사·약 복용 정상", "최근 활동 안정적"],
    };
  }

  if (score >= 70) {
    return {
      score,
      level: "caution",
      label: "주의 필요",
      summary: "큰 이상은 없지만 일부 항목에서 평소와 다른 신호가 보여요.",
      responseRate,
      factors: ["응답 흐름 일부 변화", "약 복용 확인 필요", "활동량 관찰 권장"],
    };
  }

  return {
    score,
    level: "needs_check",
    label: "확인 필요",
    summary: "미응답 또는 컨디션 변화가 이어져 직접 확인이 필요해요.",
    responseRate,
    factors: ["연속 미응답 가능성", "컨디션 확인 필요", "가족 연락 권장"],
  };
}

export function generateAiReport(): AiReport {
  return {
    period: "최근 2주 동안",
    highlights: [
      "응답 시간 변화 없음",
      "식사 패턴 안정적",
      "약 복용 안정적",
      "활동량 소폭 감소",
    ],
    opinion:
      "현재 큰 이상은 없지만 활동량이 조금 줄어드는 흐름이 보입니다.",
    recommendation: "이번 주에 한 번 짧게 통화해보는 것을 권장합니다.",
  };
}

export function detectPatternChanges(): PatternChange[] {
  return [
    {
      label: "응답 시간",
      before: "09:05",
      after: "10:40",
      analysis: "응답이 평소보다 늦어졌어요.",
      tone: "caution",
    },
    {
      label: "활동",
      before: "정상",
      after: "감소",
      analysis: "외출·활동 응답이 줄었어요.",
      tone: "attention",
    },
    {
      label: "컨디션",
      before: "좋음",
      after: "보통",
      analysis: "컨디션 표현이 한 단계 낮아졌어요.",
      tone: "caution",
    },
  ];
}

export function generateAiInsight(): AiInsight {
  return {
    period: "최근 14일간",
    signals: ["응답 빈도 감소", "활동 감소", "통화 감소"],
    opinion: "평소보다 생활 패턴이 위축되고 있습니다.",
    recommendation: "짧은 안부 전화가 도움이 될 수 있습니다.",
  };
}

export function generateWeeklyReport(profileId: string) {
  return {
    profileId,
    title: "주간 AI 안심 리포트",
    summary: "응답과 복약은 안정적이며 활동량은 소폭 감소했습니다.",
  };
}

export function generateMonthlyReport(profileId: string) {
  return {
    profileId,
    title: "월간 AI 안심 리포트",
    summary: "월간 패턴을 비교해 변화 신호와 가족 공유 내용을 정리합니다.",
  };
}

export function detectRiskSignal(responses: CareResponseRecord[]): RiskSignal {
  const signals = detectSafetySignals(responses);
  if (signals.includes("3일 연속 미응답")) {
    return { level: "urgent", message: "3일 연속 미응답이 감지되었습니다." };
  }
  if (signals.length > 0) {
    return { level: "caution", message: signals[0] };
  }
  return { level: "info", message: "현재 큰 이상 신호는 없습니다." };
}

export function sendEmergencyAlert(profileId: string) {
  return {
    profileId,
    sent: false,
    reason: "mock-only",
    message: "긴급 연락망 알림 인터페이스가 준비되었습니다.",
  };
}

export function getResponsePattern(responses: CareResponseRecord[]): ResponsePattern {
  const recent = responses.slice(0, 7);
  const responseCount = recent.filter((item) => Boolean(item.respondedAt)).length;
  const mealCount = recent.filter((item) => item.meal === "했어요").length;
  const medicineCount = recent.filter((item) => item.medicine === "복용함").length;
  const goodConditionDays = recent.filter((item) => item.condition === "좋아요").length;

  return {
    days: 7,
    responseRate: Math.round((responseCount / 7) * 100),
    mealConfirmed: `${mealCount}/7`,
    medicineConfirmed: `${medicineCount}/7`,
    goodConditionDays,
  };
}

export function getProfileResponses(profileId: string) {
  return mockCareResponses.filter((item) => item.profileId === profileId);
}

export function getProfileRequest(profileId: string) {
  return mockCareRequests.find((item) => item.profileId === profileId);
}

export function getProfileScheduler(profileId: string) {
  return mockSchedulerRules.find((item) => item.profileId === profileId);
}

function createMockRequest(
  profileId: string,
  responseMethod: ResponseMethod,
  status: CareRequestStatus,
): CareRequest {
  return {
    id: `request-${profileId}-${Date.now()}`,
    profileId,
    sentAt: new Date().toISOString(),
    status,
    responseMethod,
  };
}

function detectSafetySignals(
  responses: CareResponseRecord[],
  request?: CareRequest,
): SafetySignal[] {
  const latest = responses[0];
  const signals: SafetySignal[] = [];
  const noResponseCount = responses.filter((item) => !item.respondedAt).length;

  if (request?.status === "waiting" || request?.status === "no_response") {
    signals.push("오늘 응답 없음");
  }
  if (!latest || latest.medicine !== "복용함") {
    signals.push("약 복용 미확인");
  }
  if (latest?.condition === "안 좋아요") {
    signals.push("컨디션 나쁨");
  }
  if (noResponseCount >= 2) {
    signals.push("2일 연속 미응답");
  }
  if (noResponseCount >= 3) {
    signals.push("3일 연속 미응답");
  }

  return [...new Set(signals)];
}
