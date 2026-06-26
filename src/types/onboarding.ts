export type LovedOneRelation = "부모님" | "배우자" | "가족" | "지인" | "기타";

export type ContactMethod = "kakao" | "sms" | "phone";

export type ContactStatus =
  | "ready"
  | "sent"
  | "waiting"
  | "completed"
  | "no_response";

export type MealStatus = "done" | "not_done" | "unknown";
export type MedicationStatus = "taken" | "missed" | "unknown";
export type ConditionStatus = "good" | "normal" | "bad";
export type ContactCheckStatus = "call" | "message" | "no_contact";
export type ActivityStatus = "active" | "home_only" | "unknown";
export type CareSummaryStatus = "good" | "warning" | "needs_check";
export type DailyMood = "comfortable" | "normal" | "hard";
export type DailyActivity =
  | "rest_home"
  | "walk"
  | "shopping"
  | "hospital"
  | "family_contact"
  | "tea_rest";

export type DailyCheckIn = {
  date: string;
  mood: DailyMood;
  activities: DailyActivity[];
  note?: string;
};

export type EmergencyContact = {
  name: string;
  relation: string;
  phone: string;
};

export type ParentProfile = {
  name: string;
  relation: LovedOneRelation;
  phone: string;
  contactMethod: ContactMethod;
  responseMethod?: ContactMethod;
  emergencyContact?: EmergencyContact;
};

export type LovedOneProfile = ParentProfile;

export type DailyCareCheck = {
  date: string;
  meal: MealStatus;
  medication: MedicationStatus;
  condition: ConditionStatus;
  contact: ContactCheckStatus;
  activity: ActivityStatus;
  note?: string;
  status: CareSummaryStatus;
  responseStatus: ContactStatus;
  responseMethod?: ContactMethod;
  requestSentAt?: string;
  responseReceivedAt?: string;
};

export type SafetyStatusSnapshot = {
  status: CareSummaryStatus;
  label: "안심 양호" | "주의 필요" | "확인 필요";
  headline: string;
  reasons: string[];
  completedResponsesIn7Days: number;
  totalDays: number;
};

export type ResponsePattern = {
  days: number;
  responseRate: number;
  completedResponses: number;
  mealConfirmed: number;
  medicationConfirmed: number;
  goodConditionDays: number;
};

export type CareAutomationSchedule = {
  id: string;
  enabled: boolean;
  time: string;
  responseMethod: ContactMethod;
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

export type CareRequestResult = {
  ok: boolean;
  provider: ContactMethod;
  mode: "mock";
  status: ContactStatus;
  message: string;
  sentAt: string;
};

export type AlertSignal = {
  id: string;
  title: string;
  description: string;
  tone: "warning" | "danger" | "info";
};

export type KakaoSession = {
  provider: "kakao";
  status: "mock" | "connected";
  connectedAt: string;
};
