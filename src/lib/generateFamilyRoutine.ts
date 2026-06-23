import type { GeneratedRoutineItem, ParentProfile } from "@/types/care";

export function generateFamilyRoutine(
  parentProfile: ParentProfile,
): GeneratedRoutineItem[] {
  const nickname = parentProfile.nickname || "부모님";
  const healthNotes = parentProfile.healthNotes || "컨디션";
  const firstHealthNote =
    healthNotes
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)[0] ?? "컨디션";

  const items: GeneratedRoutineItem[] = [
    {
      title: `${nickname}께 안부 메시지 보내기`,
      type: "안부",
    },
    {
      title: `${firstHealthNote}이 괜찮은지 물어보기`,
      type: "건강",
    },
  ];

  if (healthNotes.includes("혈압") || healthNotes.includes("약")) {
    items.push({
      title: "혈압약이 남아 있는지 확인하기",
      type: "약",
    });
  }

  items.push({
    title: "다음 병원 일정 확인하기",
    type: "병원",
  });

  if (parentProfile.interests.length > 0) {
    items.push({
      title: `${parentProfile.interests[0]} 이야기로 가볍게 말 걸기`,
      type: "안부",
    });
  }

  return items;
}
