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
