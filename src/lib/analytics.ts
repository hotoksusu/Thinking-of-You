export type AnalyticsEvent = "landing_view"|"onboarding_start"|"onboarding_complete"|"activity_view"|"activity_save"|"activity_start"|"activity_complete"|"recommendation_start"|"recommendation_complete"|"login_start"|"login_complete"|"feedback_submit";
export function trackEvent(name: AnalyticsEvent, properties: Record<string, string|number|boolean|undefined> = {}) {
  if (process.env.NODE_ENV === "development") console.info("[analytics]", name, properties);
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("todayanbu:analytics", { detail: { name, ...properties } }));
}
