import type { Relationship, ShareLevel } from "@/types/care";

export const relationshipOptions: Array<{ value: Relationship; label: string }> = [
  { value: "child", label: "자녀" },
  { value: "parent", label: "부모님" },
  { value: "spouse", label: "배우자" },
  { value: "sibling", label: "형제자매" },
  { value: "relative", label: "친척" },
  { value: "friend", label: "친구" },
  { value: "acquaintance", label: "지인" },
  { value: "partner", label: "애인" },
  { value: "neighbor", label: "이웃" },
  { value: "care_worker", label: "돌봄 담당자" },
  { value: "welfare_center", label: "복지기관" },
  { value: "other", label: "기타" },
];

export const relationshipLabels: Record<Relationship, string> =
  Object.fromEntries(
    relationshipOptions.map((option) => [option.value, option.label]),
  ) as Record<Relationship, string>;

export const shareLevelOptions: Array<{ value: ShareLevel; label: string }> = [
  { value: "weekly_summary", label: "주간 요약만 공유" },
  { value: "medical_schedule", label: "병원·약 일정만 공유" },
  { value: "checkin_result", label: "안부 체크 결과만 공유" },
  { value: "selected_only", label: "내가 선택한 내용만 공유" },
];

export const shareLevelLabels: Record<ShareLevel, string> =
  Object.fromEntries(
    shareLevelOptions.map((option) => [option.value, option.label]),
  ) as Record<ShareLevel, string>;

export function getRelationshipLabel(value: Relationship | string) {
  return relationshipLabels[value as Relationship] ?? value;
}

export function getShareLevelLabel(value: ShareLevel | string) {
  if (value === "schedule_only") return "병원·약 일정만 공유";
  if (value === "manual_only") return "내가 선택한 내용만 공유";
  return shareLevelLabels[value as ShareLevel] ?? value;
}
