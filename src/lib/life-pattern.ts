export type LifeSignalType =
  | "steps"
  | "daily_rhythm"
  | "call_activity"
  | "app_activity"
  | "mobility";

export type LifeSignalSource =
  | "device"
  | "apple_health"
  | "health_connect"
  | "wearable"
  | "iot";

export type LifeSignal = {
  type: LifeSignalType;
  source: LifeSignalSource;
  label: string;
  value: number;
  unit: string;
  baseline: number;
  status: "usual" | "watch" | "changed";
  collectedAt: string;
};

export type FamilyTrace = {
  id: string;
  kind: "photo" | "meal" | "moment" | "pet" | "memo";
  sender: string;
  title: string;
  emoji: string;
  imageUrl?: string;
  createdAt: string;
};

export type ReassuranceReport = {
  score: number;
  level: "reassured" | "watch" | "check";
  summary: string;
  factors: string[];
  trend: number[];
  generatedAt: string;
};

export const todaySignals: LifeSignal[] = [
  { type: "steps", source: "device", label: "오늘의 움직임", value: 3542, unit: "걸음", baseline: 3320, status: "usual", collectedAt: "2026-07-04T20:20:00+09:00" },
  { type: "daily_rhythm", source: "device", label: "오늘의 하루", value: 91, unit: "%", baseline: 88, status: "usual", collectedAt: "2026-07-04T20:20:00+09:00" },
  { type: "call_activity", source: "device", label: "오늘의 연락", value: 2, unit: "회", baseline: 2, status: "usual", collectedAt: "2026-07-04T18:42:00+09:00" },
  { type: "app_activity", source: "device", label: "앱 활동", value: 86, unit: "%", baseline: 82, status: "usual", collectedAt: "2026-07-04T20:15:00+09:00" },
  { type: "mobility", source: "device", label: "이동 패턴", value: 1.8, unit: "km", baseline: 1.6, status: "usual", collectedAt: "2026-07-04T19:05:00+09:00" },
];

export const todayReport: ReassuranceReport = {
  score: 92,
  level: "reassured",
  summary: "오늘도 평소와 비슷한 생활을 하고 계십니다.",
  factors: ["오늘도 몸을 움직였어요", "평소처럼 하루를 시작했어요", "소중한 사람과 연락했어요"],
  trend: [86, 89, 91, 88, 93, 90, 92],
  generatedAt: "2026-07-04T20:20:00+09:00",
};

export const familyTraces: FamilyTrace[] = [
  { id: "trace-1", kind: "photo", sender: "지은", title: "손주가 오늘 그림을 그렸어요.", emoji: "🎨", imageUrl: "/brand/hero-family.png", createdAt: "2026-07-04T18:10:00+09:00" },
  { id: "trace-2", kind: "photo", sender: "민수", title: "주말에 다 같이 웃으며 사진을 찍었어요.", emoji: "💛", imageUrl: "/illustrations/family-guide.png", createdAt: "2026-07-03T20:32:00+09:00" },
];

export function getFarmGrowth(signals = todaySignals, traces = familyTraces) {
  const activeSignals = signals.filter((signal) => signal.status === "usual").length;
  const lifePoints = activeSignals * 8;
  const familyPoints = Math.min(traces.length * 6, 18);
  return {
    percent: Math.min(18 + lifePoints + familyPoints, 100),
    lifePoints,
    familyPoints,
    message: "오늘의 생활과 가족의 작은 흔적으로 토마토가 자랐어요.",
  };
}
