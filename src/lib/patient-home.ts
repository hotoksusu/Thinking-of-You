import type { CareSignal, CheckIn, Patient } from "./care-mvp";

export type PatientHomeState = "todayPending" | "todayCompleted" | "symptomAlert" | "appointmentSoon" | "normalRecovery";
const dayMs = 86400000;
function dayNumber(value: string) { return Date.parse(value.slice(0, 10) + "T00:00:00Z") / dayMs; }

// Pure view-model: the caller supplies dates and records, including future server data.
export function getPatientHome({ patient, checks, signals = [], today }: {
  patient: Patient; checks: CheckIn[]; signals?: CareSignal[]; today: string;
}) {
  const now = dayNumber(today);
  const records = checks.filter(c => c.patientId === patient.id && dayNumber(c.checkInDate || c.date) <= now)
    .sort((a, b) => (b.checkInDate || b.date).localeCompare(a.checkInDate || a.date) || b.createdAt.localeCompare(a.createdAt));
  const todayCheck = records.find(c => (c.checkInDate || c.date) === today);
  const monday = now - (new Date(now * dayMs).getUTCDay() + 6) % 7;
  const weeklyDays = new Set(records.filter(c => dayNumber(c.checkInDate || c.date) >= monday).map(c => c.checkInDate || c.date)).size;
  const recent = records.filter(c => dayNumber(c.checkInDate || c.date) >= now - 6);
  const symptomAlert = signals.some(s => s.patientId === patient.id && s.status === "open" && s.type !== "missed_checkin"
    && s.sourceCheckInIds.some(id => recent.some(c => c.id === id)));
  const appointmentDays = patient.nextAppointment ? dayNumber(patient.nextAppointment) - now : NaN;
  const appointmentSoon = appointmentDays >= 0 && appointmentDays <= 1;
  const recoveryDays = now - dayNumber(patient.surgeryDate || patient.dischargeDate);
  const states: PatientHomeState[] = [todayCheck ? "todayCompleted" : "todayPending"];
  if (symptomAlert) states.push("symptomAlert");
  if (appointmentSoon) states.push("appointmentSoon");
  if (!symptomAlert && !appointmentSoon) states.push("normalRecovery");
  const latest = recent[0];
  const recoverySummary = !latest ? "기록을 남기면 회복 변화를 함께 볼 수 있어요."
    : symptomAlert || latest.hasConcern || latest.dayComparison === "worse" ? "최근 기록에 달라진 상태가 있어요. 기록을 확인해주세요."
    : latest.dayComparison === "better" ? "최근 기록에서 전날보다 나아졌다고 알려주셨어요."
    : "최근 7일 동안 남긴 회복 상태를 확인해보세요.";
  return { states, todayCheck, weeklyDays, recoverySummary,
    recoveryDays: Number.isFinite(recoveryDays) && recoveryDays >= 0 ? recoveryDays : null,
    recoveryPoint: patient.surgeryDate ? "수술" : "퇴원",
    appointmentMessage: appointmentSoon ? (appointmentDays === 0 ? "오늘 진료가 있어요." : "내일 진료가 있어요.") : null,
    cardOrder: todayCheck ? ["recovery", "help"] as const : ["help", "recovery"] as const,
  };
}
