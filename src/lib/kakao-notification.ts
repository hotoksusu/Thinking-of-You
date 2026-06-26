import type { CareRequestResult, DailyCareCheck, ParentProfile } from "@/types/onboarding";
import { createCareResponseSummary, sendKakaoMessage } from "@/lib/care-contact";

export type KakaoNotificationResult = CareRequestResult;

export function createKakaoNotificationMessage(
  parent: ParentProfile,
  check: DailyCareCheck,
) {
  return createCareResponseSummary(parent, check);
}

export async function sendKakaoNotification({
  lovedOne,
}: {
  lovedOne: ParentProfile;
  check: DailyCareCheck;
}): Promise<KakaoNotificationResult> {
  return sendKakaoMessage(lovedOne);
}
