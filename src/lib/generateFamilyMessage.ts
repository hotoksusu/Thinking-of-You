import type { FamilyMessageTone, ParentProfile } from "@/types/care";

type GenerateFamilyMessageOptions = {
  parentProfile: ParentProfile;
  tone: FamilyMessageTone;
  situation?: string;
  variant?: "default" | "shorter" | "warmer";
};

export function generateFamilyMessage({
  parentProfile,
  tone,
  situation,
  variant = "default",
}: GenerateFamilyMessageOptions) {
  const nickname = parentProfile.nickname || "엄마";
  const healthTopic =
    parentProfile.healthNotes
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)[0] || "컨디션";
  const interest = parentProfile.interests[0] || "요즘 지내시는 이야기";
  const topic = situation?.trim() || `${healthTopic}, ${interest}`;

  if (variant === "shorter") {
    return `${nickname}, 오늘 ${healthTopic}은 괜찮으세요? 식사 잘 챙기시고 편하실 때 답 주세요.`;
  }

  const warmSuffix =
    variant === "warmer"
      ? " 무리하지 마시고, 오늘도 편안한 하루 보내셨으면 좋겠어요."
      : "";

  const messages: Record<FamilyMessageTone, string> = {
    다정하게: `${nickname}, 오늘 비 온다는데 ${healthTopic}은 좀 괜찮으세요? 외출하시면 미끄럽지 않게 조심하시고, 따뜻하게 입고 다녀오세요.${warmSuffix}`,
    짧게: `${nickname}, 오늘 ${healthTopic} 괜찮으세요? 식사랑 약도 챙기셨는지 궁금해요.`,
    유쾌하게: `${nickname}, 오늘 ${interest} 소식 있으면 들려주세요. 그리고 ${healthTopic}도 괜찮은지 살짝 확인합니다.`,
    "무뚝뚝하지만 따뜻하게": `${nickname}, 별일 없으시죠? ${healthTopic} 괜찮은지만 알려주세요. 필요한 거 있으면 말씀하시고요.`,
    "걱정스럽지 않게": `${nickname}, 오늘 ${topic} 생각나서 연락드려요. 바쁘시면 나중에 편하실 때 짧게 답 주세요.`,
  };

  return messages[tone];
}
