export const DEFAULT_REMINDER_TIME = "20:00";

export const reminderTimeOptions = [
  { value: "19:00", label: "저녁 7시" },
  { value: "20:00", label: "저녁 8시", recommended: true },
  { value: "21:00", label: "저녁 9시" },
] as const;

export const eveningReminderMessages = [
  "🌙 오늘을 남기는 시간이에요. 20초만 함께할까요?",
  "오늘 하루는 어떠셨어요? 가볍게 남겨보세요.",
  "🌱 작물이 기다리고 있어요. 오늘의 안부를 남겨볼까요?",
  "가족에게 전할 오늘의 안심을 남겨주세요.",
  "오늘도 잘 보내셨나요? 저녁 8시 루틴을 이어가요.",
  "작은 기록이 가족에게 큰 안심이 됩니다.",
  "오늘 하루도 차곡차곡 남겨볼까요?",
] as const;

export type EveningRoutinePreference = {
  reminderTime: string;
  enabled: boolean;
  updatedAt: string;
};

export function getEveningReminderMessage(date = new Date()) {
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  return eveningReminderMessages[daySeed % eveningReminderMessages.length];
}

export function getFarmReminderMessage(cropName: string, date = new Date()) {
  const messages = [
    `오늘 저녁 8시, ${cropName}가 오늘의 기록을 기다리고 있어요.`,
    "오늘도 우리 가족의 농장을 키울 시간이에요.",
    `20초만 함께하면 ${cropName}가 한 뼘 자라요.`,
  ];
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  return messages[daySeed % messages.length];
}
