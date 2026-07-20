import type { FamilyTrace, LifeSignal, ReassuranceReport } from "@/lib/life-pattern";

export type CoordinatorRole = "parent" | "family";
export type TriggerType = "no_change" | "steps_down" | "calls_down" | "family_news_absent" | "positive_change" | "learning";
export type RecommendedAction = "view_farm" | "light_movement" | "view_changes" | "call_family" | "share_photo" | "no_action_needed";
export type RecommendationOutcome = "activity_viewed" | "phone_call_started" | "family_photo_shared" | "no_action_needed" | "dismissed";

export type ActionRecommendation = {
  id: string;
  userRole: CoordinatorRole;
  triggerType: TriggerType;
  triggerSummary: string;
  actionLabel: string;
  recommendedAction: RecommendedAction;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone: "calm" | "attention" | "positive";
  optional?: boolean;
};

export type RecommendationEvent = {
  recommendationId: string;
  userRole: CoordinatorRole;
  triggerType: TriggerType;
  triggerSummary: string;
  recommendedAction: RecommendedAction;
  shownAt?: string;
  openedAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  snoozedUntil?: string;
  outcome?: RecommendationOutcome;
  feedback?: "helpful" | "not_next_time";
};

const EVENT_KEY = "todayanbu.recommendation-events.v1";

export function chooseRecommendation(role: CoordinatorRole, signals: LifeSignal[], report: ReassuranceReport, traces: FamilyTrace[]): ActionRecommendation {
  const steps = signals.find((signal) => signal.type === "steps");
  const calls = signals.find((signal) => signal.type === "call_activity");
  const hasEnoughData = signals.length >= 3 && signals.every((signal) => Boolean(signal.baseline));

  if (!hasEnoughData) {
    return {
      id: `${role}-learning`, userRole: role, triggerType: "learning",
      triggerSummary: "생활 흐름을 알아가는 중이에요. 며칠 더 지켜볼게요.",
      actionLabel: role === "parent" ? "안부농장 보기" : "연결 상태 보기",
      recommendedAction: role === "parent" ? "view_farm" : "no_action_needed",
      href: role === "parent" ? "/app?role=parent&view=farm" : "/app?role=family&view=profile",
      tone: "calm", optional: true,
    };
  }

  if (steps?.status === "changed" && steps.value < steps.baseline) {
    return role === "parent"
      ? { id: "parent-steps-down", userRole: role, triggerType: "steps_down", triggerSummary: "최근 평소보다 덜 움직이셨어요.", actionLabel: "가볍게 움직이기", recommendedAction: "light_movement", href: "/app?role=parent&view=guide&action=move", secondaryLabel: "오늘은 쉬기", secondaryHref: "/app?role=parent", tone: "attention" }
      : { id: "family-steps-down", userRole: role, triggerType: "steps_down", triggerSummary: "최근 걸음이 평소보다 줄었어요.", actionLabel: "변화 보기", recommendedAction: "view_changes", href: "/app?role=family&view=changes&focus=steps", secondaryLabel: "나중에", tone: "attention" };
  }

  if (calls?.status === "changed" && calls.value < calls.baseline && role === "family") {
    return { id: "family-calls-down", userRole: role, triggerType: "calls_down", triggerSummary: "최근 연락 활동이 평소보다 줄었어요.", actionLabel: "전화하기", recommendedAction: "call_family", href: "/app?role=family&action=call", secondaryLabel: "변화 먼저 보기", secondaryHref: "/app?role=family&view=changes&focus=calls", tone: "attention" };
  }

  if (role === "family" && traces.length === 0) {
    return { id: "family-news-absent", userRole: role, triggerType: "family_news_absent", triggerSummary: "최근 가족 소식이 없었어요.", actionLabel: "사진 한 장 남기기", recommendedAction: "share_photo", href: "/app?role=family&view=compose&source=recommendation", secondaryLabel: "나중에", tone: "calm" };
  }

  if (role === "parent") {
    return { id: "parent-positive-farm", userRole: role, triggerType: "positive_change", triggerSummary: "오늘도 평소처럼 생활하고 계세요.", actionLabel: "안부농장 보기", recommendedAction: "view_farm", href: "/app?role=parent&view=farm&source=recommendation", tone: "positive", optional: true };
  }

  return { id: "family-no-action", userRole: role, triggerType: "no_change", triggerSummary: report.summary.replace("하고 계십니다", "하고 계세요"), actionLabel: "사진 한 장 남기기", recommendedAction: "share_photo", href: "/app?role=family&view=compose&source=recommendation", tone: "calm", optional: true };
}

export function recordRecommendationEvent(recommendation: ActionRecommendation, update: Partial<RecommendationEvent>) {
  if (typeof window === "undefined") return;
  const events = readRecommendationEvents();
  const current = events.find((event) => event.recommendationId === recommendation.id && sameDay(event.shownAt ?? event.acceptedAt));
  const base: RecommendationEvent = current ?? {
    recommendationId: recommendation.id,
    userRole: recommendation.userRole,
    triggerType: recommendation.triggerType,
    triggerSummary: recommendation.triggerSummary,
    recommendedAction: recommendation.recommendedAction,
  };
  const next = current ? events.map((event) => event === current ? { ...event, ...update } : event) : [...events, { ...base, ...update }];
  window.localStorage.setItem(EVENT_KEY, JSON.stringify(next.slice(-200)));
}

export function readRecommendationEvents(): RecommendationEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(EVENT_KEY) ?? "[]") as RecommendationEvent[]; } catch { return []; }
}

export function wasDismissedToday(id: string) {
  return readRecommendationEvents().some((event) => event.recommendationId === id && Boolean(event.dismissedAt) && sameDay(event.dismissedAt));
}

function sameDay(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
