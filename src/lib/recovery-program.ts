export const organizationTypes = ['의원', '병원', '종합병원', '상급종합병원', '기타 의료기관'] as const;
export const departments = ['정형외과', '안과', '외과', '대장항문', '성형외과', '피부과', '산부인과', '치과', '이비인후과', '재활의학과', '신경외과', '기타'] as const;
export const adoptionStates = ['도입 검토', '파일럿', '이용 중', '보류'] as const;

export type Department = typeof departments[number];
export type OrganizationType = typeof organizationTypes[number];
export type OrganizationFields = {
  organizationType?: OrganizationType;
  primaryDepartment?: Department;
  departments?: Department[];
  contactName?: string;
  contactEmail?: string;
  monthlyPatients?: number;
  adoptionStatus?: typeof adoptionStates[number];
};

export const programStates = {
  draft: '작성 중', review: '검토 필요', approved: '승인 완료', active: '사용 중', stopped: '사용 중지',
};
type QuestionBase = { id: string; label: string; required: boolean };
export type RecoveryQuestion = QuestionBase & (
  { kind: 'single'; options: string[] }
  | { kind: 'number'; min: number; max: number }
  | { kind: 'boolean' }
  | { kind: 'text' }
);
export type ProgramAnswers = Record<string, string | number | boolean>;
export type RecoveryProgram = {
  id: string;
  version: number;
  state: keyof typeof programStates;
  name: string;
  department: Department;
  treatment: string;
  description: string;
  careDays: number;
  intervalDays: number;
  questions: RecoveryQuestion[];
  instructions: string;
  reviewInstructions: string;
  followupDays: number | null;
  completion: 'end_on' | 'staff';
  demo: boolean;
  approvalRef?: string;
  approvedAt?: string;
};
export type ProgramEnrollment = {
  id: string;
  version: number;
  name: string;
  department: Department;
  treatment: string;
  careDays: number;
  intervalDays: number;
  questions: RecoveryQuestion[];
  instructions: string;
  reviewInstructions: string;
  followupDays: number | null;
  completion: RecoveryProgram['completion'];
  startOn: string;
  demo: boolean;
};

export type ProgramCheckIn = {
  id: string;
  patientId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  program: Pick<ProgramEnrollment, 'id' | 'version' | 'name' | 'department' | 'questions'>;
  answers: ProgramAnswers;
};

const programDayMs = 86400000;
export function careStart(patient: { dischargeDate: string; enrollment?: ProgramEnrollment }) {
  return patient.enrollment?.startOn || patient.dischargeDate;
}
export function dateAfter(start: string, offset: number) {
  return new Date(Date.parse(start + 'T00:00:00Z') + offset * programDayMs).toISOString().slice(0, 10);
}
export function careOffset(patient: { dischargeDate: string; enrollment?: ProgramEnrollment }, day: string) {
  return (Date.parse(day) - Date.parse(careStart(patient))) / programDayMs;
}
export function expectedCheckIn(patient: { dischargeDate: string; enrollment?: ProgramEnrollment }, day: string, legacyDays: number) {
  const offset = careOffset(patient, day);
  return offset >= 0 && offset < (patient.enrollment?.careDays ?? legacyDays) && offset % (patient.enrollment?.intervalDays ?? 1) === 0;
}
export function formatProgramAnswer(answer: ProgramAnswers[string] | undefined) {
  return typeof answer === 'boolean' ? (answer ? '예' : '아니오') : (answer ?? '응답 없음');
}

