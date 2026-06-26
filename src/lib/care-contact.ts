import type {
  AlertSignal,
  CareSummaryStatus,
  CareRequestResult,
  ContactMethod,
  DailyCareCheck,
  ParentProfile,
  ResponsePattern,
  SafetyStatusSnapshot,
} from "@/types/onboarding";

const methodLabel: Record<ContactMethod, string> = {
  kakao: "카카오톡",
  sms: "문자/SMS",
  phone: "전화 확인",
};

export function createCareRequestMessage(parent: ParentProfile) {
  return `오늘안부 요청: ${parent.name}님의 안심 상태를 확인합니다. 식사, 약 복용, 컨디션과 연락 상태에 간단히 응답해주세요.`;
}

export function createCareResponseSummary(parent: ParentProfile, check: DailyCareCheck) {
  const meal = {
    done: "했어요",
    not_done: "안 했어요",
    unknown: "모르겠어요",
  }[check.meal];
  const medication = {
    taken: "복용함",
    missed: "미복용",
    unknown: "모르겠어요",
  }[check.medication];
  const condition = {
    good: "좋아요",
    normal: "보통이에요",
    bad: "안 좋아요",
  }[check.condition];
  const contact = {
    call: "통화함",
    message: "문자함",
    no_contact: "연락 안 됨",
  }[check.contact];
  const status = {
    good: "안심 양호",
    warning: "주의 필요",
    needs_check: "확인 필요",
  }[check.status];

  return `오늘안부 안심 확인: ${parent.name}님 상태는 ${status}입니다. 식사: ${meal}, 약 복용: ${medication}, 컨디션: ${condition}, 연락: ${contact}`;
}

export function getCareRiskItems(check: DailyCareCheck) {
  const items: string[] = [];

  if (check.meal === "not_done") items.push("식사 안 함");
  if (check.medication === "missed") items.push("약 미복용");
  if (check.condition === "bad") items.push("컨디션 나쁨");
  if (check.contact === "no_contact") items.push("연락 안 됨");
  if (check.activity === "home_only") items.push("집에만 있었음");

  return items;
}

export function getCareSummaryStatus(check: DailyCareCheck): CareSummaryStatus {
  return calculateSafetyStatus(check).status;
}

export function calculateSafetyStatus(check: DailyCareCheck): SafetyStatusSnapshot {
  const riskItems = getCareRiskItems(check);
  const reasons = [...riskItems];

  if (check.responseStatus === "no_response") {
    reasons.unshift("오늘 응답 없음");
  }

  const hasRepeatedNoResponse = check.responseStatus === "no_response";
  const riskCount = reasons.length;
  const status: CareSummaryStatus =
    hasRepeatedNoResponse || riskCount >= 2
      ? "needs_check"
      : riskCount === 1
        ? "warning"
        : "good";

  const label = {
    good: "안심 양호",
    warning: "주의 필요",
    needs_check: "확인 필요",
  } as const;

  const headline = {
    good: "오늘 응답 완료",
    warning: reasons[0] ?? "추가 확인이 필요해요",
    needs_check:
      check.responseStatus === "no_response" ? "2일 연속 미응답" : reasons[0] ?? "확인 필요",
  }[status];

  return {
    status,
    label: label[status],
    headline,
    reasons: reasons.length > 0 ? reasons : ["오늘 응답 완료", "식사 확인", "약 복용 확인"],
    completedResponsesIn7Days: status === "needs_check" ? 4 : status === "warning" ? 5 : 6,
    totalDays: 7,
  };
}

export function getMockSafetySnapshot(status: CareSummaryStatus = "good") {
  const base: DailyCareCheck = {
    date: new Date().toISOString().slice(0, 10),
    meal: "done",
    medication: status === "warning" ? "unknown" : "taken",
    condition: "normal",
    contact: status === "needs_check" ? "no_contact" : "message",
    activity: "active",
    note: "",
    status,
    responseStatus: status === "needs_check" ? "no_response" : "completed",
  };

  return calculateSafetyStatus(base);
}

export function getMockResponsePattern(): ResponsePattern {
  return {
    days: 7,
    responseRate: 86,
    completedResponses: 6,
    mealConfirmed: 7,
    medicationConfirmed: 6,
    goodConditionDays: 5,
  };
}

export function buildAlertSignals(check: DailyCareCheck): AlertSignal[] {
  const signals: AlertSignal[] = [];

  if (check.responseStatus === "no_response") {
    signals.push({
      id: "no-response",
      title: "오늘 응답 없음",
      description: "오늘 안심 요청에 아직 응답이 없습니다.",
      tone: "danger",
    });
    signals.push({
      id: "two-day-no-response",
      title: "2일 연속 미응답",
      description: "반복 미응답을 보여주는 mock 상태입니다.",
      tone: "warning",
    });
    signals.push({
      id: "three-day-no-response",
      title: "3일 연속 미응답",
      description: "향후 긴급 연락처 알림으로 확장할 수 있는 mock 상태입니다.",
      tone: "danger",
    });
  }

  if (
    (check.medication === "missed" || check.medication === "unknown") &&
    check.responseStatus === "completed"
  ) {
    signals.push({
      id: "medicine-unchecked",
      title: "약 복용 미확인",
      description: "응답은 도착했지만 약 복용이 확인되지 않았습니다.",
      tone: "warning",
    });
  }

  if (check.condition === "bad") {
    signals.push({
      id: "bad-condition",
      title: "컨디션 나쁨",
      description: "평소와 다른 컨디션 응답이 기록되었습니다.",
      tone: "danger",
    });
  }

  if (check.contact === "no_contact") {
    signals.push({
      id: "no-contact",
      title: "연락 안 됨",
      description: "통화나 문자 확인이 되지 않았습니다.",
      tone: "danger",
    });
  }

  if (check.activity === "home_only") {
    signals.push({
      id: "home-only",
      title: "활동 적음",
      description: "오늘은 집에만 있었다고 기록되었습니다.",
      tone: "warning",
    });
  }

  return signals;
}

function mockResult(
  provider: ContactMethod,
  message: string,
  status: CareRequestResult["status"] = "sent",
): CareRequestResult {
  return {
    ok: true,
    provider,
    mode: "mock",
    status,
    message,
    sentAt: new Date().toISOString(),
  };
}

export async function sendKakaoRequest(parent: ParentProfile) {
  return mockResult(
    "kakao",
    `${methodLabel.kakao} mock 요청 발송: ${createCareRequestMessage(parent)}`,
  );
}

export async function sendSmsRequest(parent: ParentProfile) {
  return mockResult(
    "sms",
    `${methodLabel.sms} mock 요청 발송: ${createCareRequestMessage(parent)}`,
  );
}

export async function startPhoneCheck(parent: ParentProfile) {
  return mockResult(
    "phone",
    `${methodLabel.phone} mock 요청 발송: ${parent.name}님께 전화 확인을 예약합니다.`,
  );
}

export async function sendCareRequest(parent: ParentProfile) {
  const method = parent.responseMethod ?? parent.contactMethod;

  if (method === "sms") return sendSmsRequest(parent);
  if (method === "phone") return startPhoneCheck(parent);
  return sendKakaoRequest(parent);
}

export const sendKakaoMessage = sendKakaoRequest;
export const sendSmsMessage = sendSmsRequest;

export { methodLabel };
