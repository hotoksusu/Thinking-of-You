import type {
  CareAutomationSchedule,
  CareRequestResult,
  ParentProfile,
} from "@/types/onboarding";
import { sendCareRequest } from "@/lib/care-contact";

export const defaultCareAutomationSchedule: CareAutomationSchedule = {
  id: "daily-10am-safety-check",
  enabled: true,
  time: "10:00",
  responseMethod: "sms",
  steps: [
    {
      id: "send-request",
      title: "안부 요청 발송",
      description: "매일 오전 10시에 선택한 연락 방식으로 안심 요청을 보냅니다.",
    },
    {
      id: "collect-response",
      title: "응답 수집",
      description: "문자 링크, 카카오톡, 전화 확인 결과를 같은 구조로 저장합니다.",
    },
    {
      id: "update-safety",
      title: "안심 상태 업데이트",
      description: "응답 없음과 이상 신호를 기준으로 안심 상태를 계산합니다.",
    },
    {
      id: "notify-guardian",
      title: "보호자 알림",
      description: "확인 필요 상태가 반복되면 보호자와 긴급 연락처로 확장합니다.",
    },
  ],
};

export async function runMockDailySafetyRequest(
  parent: ParentProfile,
  schedule: CareAutomationSchedule = defaultCareAutomationSchedule,
): Promise<CareRequestResult> {
  return sendCareRequest({
    ...parent,
    responseMethod: schedule.responseMethod,
  });
}
