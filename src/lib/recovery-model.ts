export type Patient = {
  patientId: string;
  displayName: string;
  ageGroup: "60대" | "70대" | "80대 이상";
  dischargeDate: string;
  dischargeDay: number;
  hospitalId: string;
  department: string;
  monitoringStartDate: string;
  monitoringEndDate: string;
  monitoringPeriodDays: 7 | 14 | 30 | 90;
  familyConnection: "connected" | "not_connected";
};

export type Baseline = {
  patientId: string;
  activityBaseline: number;
  phoneUsageBaseline: number;
  activeHoursBaseline: string;
  measurementPeriod: string;
  baselineCreatedAt: string;
};

export type Change = {
  patientId: string;
  changeType: "activity" | "phone_usage" | "daily_rhythm";
  deviationLevel: "none" | "slight" | "continued";
  detectedAt: string;
  duration: number;
  currentStatus: "check" | "observe" | "recovering" | "stable";
};

export type FamilyAction = {
  patientId: string;
  notificationSent: boolean;
  notificationSeen: boolean;
  contactAttempted: boolean;
  reaction?: string;
  actionAt?: string;
};

export type HospitalReview = {
  patientId: string;
  reviewStatus: "pending" | "completed";
  reviewedAt?: string;
  followUpType?: "observation" | "phone" | "consultation" | "outpatient";
};

export type RecoveryStatus = "recovering" | "stable" | "persistentChange" | "monitoringCompleted";

export type RecoveryPatient = Patient & {
  baseline: Baseline;
  changes: Change[];
  familyAction: FamilyAction;
  hospitalReview: HospitalReview;
  recovery: RecoveryStatus;
};

export const recoveryPatients: RecoveryPatient[] = [
  {
    patientId: "patient-001", displayName: "김○○", ageGroup: "70대", dischargeDate: "2026-08-06", dischargeDay: 8, hospitalId: "hospital-demo", department: "재활의학과", monitoringStartDate: "2026-08-06", monitoringEndDate: "2026-09-04", monitoringPeriodDays: 30, familyConnection: "connected",
    baseline: { patientId: "patient-001", activityBaseline: 3400, phoneUsageBaseline: 92, activeHoursBaseline: "오전 7시~오후 9시", measurementPeriod: "퇴원 후 7일", baselineCreatedAt: "2026-08-12" },
    changes: [{ patientId: "patient-001", changeType: "activity", deviationLevel: "continued", detectedAt: "2026-08-10", duration: 4, currentStatus: "check" }],
    familyAction: { patientId: "patient-001", notificationSent: true, notificationSeen: false, contactAttempted: false },
    hospitalReview: { patientId: "patient-001", reviewStatus: "pending" }, recovery: "persistentChange",
  },
  {
    patientId: "patient-002", displayName: "박○○", ageGroup: "60대", dischargeDate: "2026-08-02", dischargeDay: 12, hospitalId: "hospital-demo", department: "정형외과", monitoringStartDate: "2026-08-02", monitoringEndDate: "2026-08-31", monitoringPeriodDays: 30, familyConnection: "connected",
    baseline: { patientId: "patient-002", activityBaseline: 4100, phoneUsageBaseline: 105, activeHoursBaseline: "오전 6시~오후 10시", measurementPeriod: "퇴원 후 7일", baselineCreatedAt: "2026-08-08" },
    changes: [{ patientId: "patient-002", changeType: "daily_rhythm", deviationLevel: "slight", detectedAt: "2026-08-12", duration: 2, currentStatus: "observe" }],
    familyAction: { patientId: "patient-002", notificationSent: true, notificationSeen: true, contactAttempted: true, reaction: "전화 완료", actionAt: "2026-08-13" },
    hospitalReview: { patientId: "patient-002", reviewStatus: "pending" }, recovery: "recovering",
  },
  {
    patientId: "patient-003", displayName: "이○○", ageGroup: "80대 이상", dischargeDate: "2026-07-30", dischargeDay: 15, hospitalId: "hospital-demo", department: "순환기내과", monitoringStartDate: "2026-07-30", monitoringEndDate: "2026-08-28", monitoringPeriodDays: 30, familyConnection: "not_connected",
    baseline: { patientId: "patient-003", activityBaseline: 2200, phoneUsageBaseline: 70, activeHoursBaseline: "오전 8시~오후 8시", measurementPeriod: "퇴원 후 7일", baselineCreatedAt: "2026-08-05" },
    changes: [{ patientId: "patient-003", changeType: "activity", deviationLevel: "none", detectedAt: "2026-08-14", duration: 0, currentStatus: "stable" }],
    familyAction: { patientId: "patient-003", notificationSent: false, notificationSeen: false, contactAttempted: false },
    hospitalReview: { patientId: "patient-003", reviewStatus: "completed", reviewedAt: "2026-08-14", followUpType: "observation" }, recovery: "stable",
  },
];

export function recoveryCopy(patient: RecoveryPatient) {
  const change = patient.changes[0];
  if (change.currentStatus === "check") return { patient: "요즘 생활이 평소와 조금 달라졌어요.", family: `활동 감소가 ${change.duration}일째 이어지고 있어요.`, hospital: `개인 기준 대비 활동 감소 ${change.duration}일 지속` };
  if (change.currentStatus === "observe") return { patient: "생활 흐름을 조금 더 살펴보고 있어요.", family: `생활 리듬 변화가 ${change.duration}일째 이어지고 있어요.`, hospital: `개인 기준 대비 생활 리듬 변화 ${change.duration}일 지속` };
  return { patient: "오늘도 평소와 비슷해요.", family: "생활은 오늘 평소와 비슷합니다.", hospital: "개인 기준선 대비 주요 생활 변화 없음" };
}
