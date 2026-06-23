export type UserMode = "family" | "self";

export type CareTaskType =
  | "안부"
  | "건강"
  | "약"
  | "병원"
  | "검진"
  | "생신"
  | "기타";

export type CareTaskStatus = "pending" | "done" | "later";

export type CareScheduleType =
  | "안부"
  | "병원"
  | "약"
  | "건강검진"
  | "생신"
  | "가족모임"
  | "기타";

export type ScheduleRepeat = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type FamilyMessageTone =
  | "다정하게"
  | "짧게"
  | "유쾌하게"
  | "무뚝뚝하지만 따뜻하게"
  | "걱정스럽지 않게";

export type Relationship =
  | "child"
  | "parent"
  | "spouse"
  | "sibling"
  | "relative"
  | "friend"
  | "acquaintance"
  | "partner"
  | "neighbor"
  | "care_worker"
  | "welfare_center"
  | "other";

export type ShareLevel =
  | "weekly_summary"
  | "medical_schedule"
  | "checkin_result"
  | "selected_only";

export type ParentProfile = {
  id: string;
  nickname: string;
  relationship?: string;
  phone?: string;
  responseMethod?: ResponseMethod;
  emergencyContact?: EmergencyContact;
  ageRange: string;
  region: string;
  interests: string[];
  healthNotes: string;
  contactFrequency: string;
  memo?: string;
  createdAt: string;
  updatedAt?: string;
  isSample?: boolean;
};

export type ResponseMethod = "kakao" | "sms" | "phone";

export type EmergencyContact = {
  name: string;
  relationship: string;
  contact: string;
};

export type SafetyStatusLevel = "safe" | "caution" | "needs_check";

export type MealStatus = "했어요" | "안 했어요" | "모르겠어요";

export type MedicineCheckStatus = "복용함" | "미복용" | "모르겠어요";

export type ConditionStatus = "좋아요" | "보통이에요" | "안 좋아요";

export type ContactCheckStatus = "통화함" | "문자함" | "연락 안됨";

export type ActivityStatus = "활동함" | "집에만 있었음" | "모르겠어요";

export type CareRequestStatus =
  | "ready"
  | "sent"
  | "waiting"
  | "completed"
  | "no_response";

export type CareResponseRecord = {
  id: string;
  profileId: string;
  date: string;
  meal: MealStatus;
  medicine: MedicineCheckStatus;
  condition: ConditionStatus;
  contact: ContactCheckStatus;
  activity: ActivityStatus;
  note?: string;
  responseMethod: ResponseMethod;
  respondedAt?: string;
};

export type CareRequest = {
  id: string;
  profileId: string;
  sentAt?: string;
  scheduledAt?: string;
  status: CareRequestStatus;
  responseMethod: ResponseMethod;
};

export type SafetySignal =
  | "오늘 응답 없음"
  | "약 복용 미확인"
  | "컨디션 나쁨"
  | "2일 연속 미응답"
  | "3일 연속 미응답";

export type SafetyStatus = {
  level: SafetyStatusLevel;
  label: "안심 양호" | "주의 필요" | "확인 필요";
  summary: string;
  signals: SafetySignal[];
  responseDays: number;
  totalDays: number;
};

export type PeaceScoreLevel = "good" | "caution" | "needs_check";

export type PeaceScore = {
  score: number;
  level: PeaceScoreLevel;
  label: "양호" | "주의 필요" | "확인 필요";
  summary: string;
  responseRate: number;
  factors: string[];
};

export type AiReport = {
  period: string;
  highlights: string[];
  opinion: string;
  recommendation: string;
};

export type PatternChange = {
  label: string;
  before: string;
  after: string;
  analysis: string;
  tone: "stable" | "caution" | "attention";
};

export type AiInsight = {
  period: string;
  signals: string[];
  opinion: string;
  recommendation: string;
};

export type RiskSignal = {
  level: "info" | "caution" | "urgent";
  message: string;
};

export type ResponsePattern = {
  days: number;
  responseRate: number;
  mealConfirmed: string;
  medicineConfirmed: string;
  goodConditionDays: number;
};

export type MockSchedulerRule = {
  id: string;
  profileId: string;
  time: string;
  enabled: boolean;
  nextRunLabel: string;
  flow: string[];
};

export type CareTask = {
  id: string;
  profileId: string;
  title: string;
  type: CareTaskType;
  dueDate?: string;
  status: CareTaskStatus;
  memo?: string;
  createdAt: string;
};

export type CareSchedule = {
  id: string;
  profileId: string;
  title: string;
  type: CareScheduleType;
  date: string;
  time?: string;
  repeat: ScheduleRepeat;
  memo?: string;
  status?: "pending" | "done";
  createdAt: string;
};

export type CheckinRecord = {
  id: string;
  mode: UserMode;
  value: string;
  memo?: string;
  createdAt: string;
};

export type TrustedContact = {
  id: string;
  name: string;
  relationship: Relationship;
  contact: string;
  shareLevel: ShareLevel;
  createdAt: string;
};

export type MessageHistory = {
  id: string;
  tone: FamilyMessageTone;
  body: string;
  createdAt: string;
};

export type GeneratedRoutineItem = Pick<CareTask, "title" | "type">;

export type SelfMedicineStatus = "먹었어요" | "아직이에요" | "해당 없어요";
