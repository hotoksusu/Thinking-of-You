export type AnsimiState = "idle" | "greeting" | "listening" | "happy" | "calm" | "tired_empathy" | "comfort" | "thinking" | "celebrate" | "guide" | "rest";

export type DialogueChoice = { id: string; label: string; nextStepId: string };
export type DialogueStep = {
  id: string;
  characterState: AnsimiState;
  message: string;
  secondaryMessage?: string;
  choices?: DialogueChoice[];
  primaryAction?: { label: string; target: string };
  secondaryAction?: { label: string; target: string };
  effect?: "sunshine" | "leaf" | "rest" | "comfort" | "water";
};

export const moodDialogue: Record<string, DialogueStep> = {
  start: {
    id: "start",
    characterState: "listening",
    message: "정희님, 오늘 하루는 어떠셨어요?",
    secondaryMessage: "가장 가까운 기분 하나를 눌러주세요.",
    choices: [
      { id: "good", label: "좋았어요", nextStepId: "good-response" },
      { id: "okay", label: "괜찮았어요", nextStepId: "okay-response" },
      { id: "tired", label: "피곤했어요", nextStepId: "tired-response" },
      { id: "difficult", label: "조금 힘들었어요", nextStepId: "difficult-response" },
    ],
  },
  "good-response": { id: "good-response", characterState: "happy", message: "오늘 기분이 좋으셨군요.", secondaryMessage: "좋은 하루를 알려주셔서 고마워요.", primaryAction: { label: "오늘 자란 농장 보기", target: "/farm" }, effect: "sunshine" },
  "okay-response": { id: "okay-response", characterState: "calm", message: "오늘도 무난하게 보내셨군요.", secondaryMessage: "평소처럼 편안하게 지내시면 됩니다.", primaryAction: { label: "홈으로 가기", target: "/app?role=parent" }, effect: "leaf" },
  "tired-response": { id: "tired-response", characterState: "rest", message: "오늘은 조금 피곤하셨군요.", secondaryMessage: "오늘은 편하게 쉬어도 괜찮아요.", primaryAction: { label: "편하게 쉬기", target: "/app?role=parent" }, secondaryAction: { label: "가족 소식 보기", target: "/app?role=parent&view=photos" }, effect: "rest" },
  "difficult-response": { id: "difficult-response", characterState: "comfort", message: "알려주셔서 고마워요.", secondaryMessage: "오늘은 혼자 참지 않으셔도 괜찮아요.", effect: "comfort" },
};

export type AnsimiEventName = "ansimi_viewed" | "ansimi_message_completed" | "ansimi_message_skipped" | "ansimi_choice_selected" | "ansimi_primary_action_clicked" | "ansimi_secondary_action_clicked" | "ansimi_voice_played" | "ansimi_motion_reduced" | "dialogue_completed" | "dialogue_abandoned" | "mood_selected" | "farm_viewed_after_dialogue" | "family_contact_accepted" | "family_contact_declined";

export function recordAnsimiEvent(name: AnsimiEventName, detail: Record<string, unknown> = {}) {
  try {
    const key = "oneul-anbu-ansimi-events";
    const events = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
    window.localStorage.setItem(key, JSON.stringify([...events, { name, detail, occurredAt: new Date().toISOString() }].slice(-100)));
  } catch {
    // Analytics must never interrupt the senior experience.
  }
}
