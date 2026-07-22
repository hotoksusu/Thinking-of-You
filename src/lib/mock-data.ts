import type {
  CareSchedule,
  CareTask,
  ParentProfile,
  ResponseMethod,
  TrustedContact,
} from "@/types/care";
import { getTodayISO } from "./dates";

export type ConsumerMode = "family-care" | "self-care";

export type ConsumerSettings = {
  mode: ConsumerMode;
  name: string;
  relation: string;
  phone: string;
  responseMethod: ResponseMethod;
  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;
  checkFrequency: string;
  careItems: string[];
  reminderTime: string;
};

export type RoutineState = {
  medicine: boolean;
  meal: boolean;
  sleep: boolean;
  exercise: boolean;
  condition: "좋아요" | "보통이에요" | "조금 불편해요";
  memo: string;
  shareMemo: string;
  completedToday: boolean;
};

export type NotificationSettings = {
  checkinTime: string;
  medicine: boolean;
  hospital: boolean;
  familyShare: boolean;
};

export const defaultConsumerSettings: ConsumerSettings = {
  mode: "family-care",
  name: "엄마",
  relation: "어머니",
  phone: "010-1111-2222",
  responseMethod: "sms",
  emergencyName: "김서연",
  emergencyRelation: "동생",
  emergencyContact: "010-2222-8899",
  checkFrequency: "주 2회",
  careItems: ["약 복용", "병원 일정", "건강검진", "정서 안부"],
  reminderTime: "19:30",
};

export const defaultRoutineState: RoutineState = {
  medicine: false,
  meal: false,
  sleep: false,
  exercise: false,
  condition: "보통이에요",
  memo: "",
  shareMemo: "오늘 컨디션은 괜찮고, 저녁 약 챙길 예정이에요.",
  completedToday: false,
};

export const defaultNotificationSettings: NotificationSettings = {
  checkinTime: "19:30",
  medicine: true,
  hospital: true,
  familyShare: false,
};

export const consumerSchedules: CareSchedule[] = [
  {
    id: "consumer-schedule-today-1",
    profileId: "sample-mom",
    title: "안부 연락하기",
    type: "안부",
    date: getTodayISO(),
    time: "19:30",
    repeat: "weekly",
    memo: "짧게 컨디션만 물어봐도 좋아요",
    status: "pending",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "consumer-schedule-today-2",
    profileId: "sample-mom",
    title: "혈압약 복용 확인",
    type: "약",
    date: getTodayISO(),
    time: "21:00",
    repeat: "daily",
    memo: "저녁 식사 후 확인",
    status: "pending",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "consumer-schedule-1",
    profileId: "sample-mom",
    title: "정형외과 진료",
    type: "병원",
    date: "2026-06-25",
    time: "10:30",
    repeat: "none",
    memo: "무릎 통증이 심했던 날 메모 가져가기",
    status: "pending",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "consumer-schedule-2",
    profileId: "sample-mom",
    title: "혈압약 처방 확인",
    type: "약",
    date: "2026-06-29",
    repeat: "monthly",
    memo: "남은 약 개수 확인",
    status: "pending",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "consumer-schedule-3",
    profileId: "sample-mom",
    title: "건강검진 예약",
    type: "건강검진",
    date: "2026-07-10",
    repeat: "yearly",
    memo: "검진 전 안내 사항 확인",
    status: "pending",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
];

export const sampleCareTasks: CareTask[] = [
  {
    id: "care-task-1",
    profileId: "sample-mom",
    title: "엄마께 안부 메시지 보내기",
    type: "안부",
    dueDate: "2026-06-22",
    status: "pending",
    memo: "",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "care-task-2",
    profileId: "sample-mom",
    title: "무릎 통증이 괜찮은지 물어보기",
    type: "건강",
    dueDate: "2026-06-22",
    status: "pending",
    memo: "",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "care-task-3",
    profileId: "sample-mom",
    title: "혈압약이 남아 있는지 확인하기",
    type: "약",
    dueDate: "2026-06-22",
    status: "pending",
    memo: "",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
];

export const managedParents: ParentProfile[] = [
  {
    id: "mom",
    nickname: "엄마",
    relationship: "어머니",
    phone: "010-1111-2222",
    responseMethod: "sms",
    emergencyContact: {
      name: "김서연",
      relationship: "동생",
      contact: "010-2222-8899",
    },
    ageRange: "60대 후반",
    region: "부산",
    interests: ["등산", "트로트", "손주 이야기"],
    healthNotes: "무릎 통증, 혈압",
    contactFrequency: "주 2회",
    memo: "비 오는 날 무릎이 불편하다고 자주 말씀하심",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "dad",
    nickname: "아빠",
    relationship: "아버지",
    phone: "010-3333-4444",
    responseMethod: "phone",
    emergencyContact: {
      name: "박지훈",
      relationship: "조카",
      contact: "010-5555-7777",
    },
    ageRange: "70대 초반",
    region: "대전",
    interests: ["바둑", "산책", "야구"],
    healthNotes: "혈당, 수면",
    contactFrequency: "주 3회",
    memo: "아침 산책 여부를 자주 확인하면 좋음",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
];

export const familyMembers: TrustedContact[] = [
  {
    id: "family-1",
    name: "김민준",
    relationship: "child",
    contact: "010-1234-5678",
    shareLevel: "weekly_summary",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "family-2",
    name: "김서연",
    relationship: "sibling",
    contact: "010-2222-8899",
    shareLevel: "medical_schedule",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
  {
    id: "family-3",
    name: "박지훈",
    relationship: "relative",
    contact: "초대 대기",
    shareLevel: "selected_only",
    createdAt: "2026-06-22T00:00:00.000Z",
  },
];

export const familyHistory = [
  { date: "월", status: "완료", medicine: "확인", memo: "무릎 통증 보통" },
  { date: "화", status: "미확인", medicine: "대기", memo: "연락 예정" },
  { date: "수", status: "완료", medicine: "확인", memo: "식사 잘 하심" },
  { date: "목", status: "완료", medicine: "확인", memo: "병원 일정 확인" },
  { date: "금", status: "주의", medicine: "미확인", memo: "비 오는 날 무릎 불편" },
  { date: "토", status: "완료", medicine: "확인", memo: "손주 이야기" },
  { date: "일", status: "대기", medicine: "대기", memo: "저녁 확인" },
];

export const adminStats = [
  { label: "전체 사용자 수", value: "12,480", delta: "+8.4%" },
  { label: "오늘 안부 체크 수", value: "3,214", delta: "+12.1%" },
  { label: "미확인 안부 수", value: "428", delta: "-3.2%" },
  { label: "알림 발송 수", value: "18,902", delta: "+5.7%" },
  { label: "신규 가입자 수", value: "186", delta: "+9.8%" },
];

export const adminUsers = [
  {
    name: "이하늘",
    type: "부모님 챙기기",
    joined: "2026-06-01",
    recent: "오늘 09:12",
    status: "활성",
  },
  {
    name: "박선영",
    type: "본인용",
    joined: "2026-06-03",
    recent: "어제 21:04",
    status: "활성",
  },
  {
    name: "김민준",
    type: "가족 관리자",
    joined: "2026-06-10",
    recent: "오늘 11:30",
    status: "확인 필요",
  },
  {
    name: "정유진",
    type: "부모님 챙기기",
    joined: "2026-06-12",
    recent: "3일 전",
    status: "장기 미사용",
  },
];

export const adminGroups = [
  { name: "부산 김가족", members: 4, parents: 1, status: "안부 완료" },
  { name: "대전 박가족", members: 3, parents: 2, status: "약 미확인" },
  { name: "서울 이가족", members: 2, parents: 1, status: "일정 대기" },
];

export const adminNotifications = [
  { type: "안부", target: "엄마 안부 확인", time: "오늘 19:30", status: "발송 예정" },
  { type: "약", target: "혈압약 복용", time: "오늘 21:00", status: "발송 완료" },
  { type: "병원", target: "정형외과 진료", time: "내일 09:00", status: "발송 예정" },
  { type: "안부 공유", target: "주간 요약", time: "금요일 18:00", status: "실패" },
];

export const supportTickets = [
  { title: "가족 초대 링크가 열리지 않아요", user: "김민준", status: "답변 대기" },
  { title: "알림 시간을 바꾸고 싶어요", user: "박선영", status: "처리 중" },
  { title: "일정 반복 설정 문의", user: "이하늘", status: "완료" },
];

export const contentTemplates = [
  { name: "온보딩 문구", value: "오늘, 안부를 놓치지 않도록" },
  { name: "안부 알림", value: "오늘 안부를 가볍게 확인해볼까요?" },
  { name: "약 복용 질문", value: "오늘 약은 드셨나요?" },
  { name: "건강 루틴 템플릿", value: "식사, 수면, 운동, 컨디션을 확인해요." },
];
