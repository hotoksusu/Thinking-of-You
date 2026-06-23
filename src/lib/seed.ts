import type { CareSchedule, CareTask, ParentProfile, TrustedContact } from "@/types/care";
import { getTodayISO } from "./dates";
import { generateFamilyRoutine } from "./generateFamilyRoutine";
import { createId } from "./id";

export const sampleParentProfile: ParentProfile = {
  id: "sample-mom",
  nickname: "엄마",
  ageRange: "60대 후반",
  region: "부산",
  interests: ["등산", "트로트", "손주 이야기"],
  healthNotes: "무릎 통증, 혈압",
  contactFrequency: "주 2회",
  memo: "비 오는 날 무릎이 불편하다고 자주 말씀하심",
  createdAt: new Date().toISOString(),
  isSample: true,
};

export const defaultProfile = sampleParentProfile;

export function createSampleTasks(
  profile: ParentProfile = sampleParentProfile,
  date = getTodayISO(),
): CareTask[] {
  return [
    {
      id: createId("task"),
      profileId: profile.id,
      title: "엄마께 안부 메시지 보내기",
      type: "안부",
      dueDate: date,
      status: "pending",
      memo: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: createId("task"),
      profileId: profile.id,
      title: "무릎 통증이 괜찮은지 물어보기",
      type: "건강",
      dueDate: date,
      status: "pending",
      memo: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: createId("task"),
      profileId: profile.id,
      title: "혈압약이 남아 있는지 확인하기",
      type: "약",
      dueDate: date,
      status: "pending",
      memo: "",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createDefaultTasks(
  profile: ParentProfile = defaultProfile,
  date = getTodayISO(),
): CareTask[] {
  return generateFamilyRoutine(profile).map((item) => ({
    id: createId("task"),
    profileId: profile.id,
    title: item.title,
    type: item.type,
    dueDate: date,
    status: "pending",
    memo: "",
    createdAt: new Date().toISOString(),
  }));
}

export function createSampleSchedules(
  profile: ParentProfile = sampleParentProfile,
): CareSchedule[] {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const thisMonth = new Date();
  thisMonth.setDate(Math.min(thisMonth.getDate() + 14, 28));

  return [
    {
      id: createId("schedule"),
      profileId: profile.id,
      type: "병원",
      title: "다음 주 정형외과 진료",
      date: toInputDate(nextWeek),
      repeat: "none",
      memo: "무릎 통증이 심했던 날을 메모해두기",
      createdAt: new Date().toISOString(),
    },
    {
      id: createId("schedule"),
      profileId: profile.id,
      type: "약",
      title: "이번 달 혈압약 처방 확인",
      date: toInputDate(thisMonth),
      repeat: "monthly",
      memo: "약이 얼마나 남았는지 함께 확인",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createDefaultSchedules(
  profile: ParentProfile = defaultProfile,
): CareSchedule[] {
  return createSampleSchedules(profile);
}

export const defaultTrustedContacts: TrustedContact[] = [
  {
    id: "trusted-contact-sample",
    name: "첫째",
    relationship: "child",
    contact: "",
    shareLevel: "weekly_summary",
    createdAt: new Date().toISOString(),
  },
];

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
