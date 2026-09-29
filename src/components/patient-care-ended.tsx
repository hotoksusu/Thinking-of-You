"use client";
import { Check } from "lucide-react";
import { PatientLink, usePatientNavigation } from "@/components/patient-navigation";
import { painValue, type CareState, type Patient } from "@/lib/care-mvp";

export type CareStage = "activeCare" | "completedCare" | "expiredCare" | "followUpNeeded";
export function patientCareStage(patient?: Patient | null): CareStage {
  return patient?.careStatus === "completed" ? "completedCare" : patient?.careStatus === "follow_up" ? "followUpNeeded" : "activeCare";
}

export function PatientCareEnded({ patient, state }: { patient: Patient; state: CareState }) {
  const nav = usePatientNavigation();
  if (patientCareStage(patient) !== "completedCare") return null;
  const records = state.checkIns.filter(record => record.patientId === patient.id).sort((a,b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const first = records[0], last = records.at(-1);
  const completion = state.careCompletions?.filter(item => item.patientId === patient.id).sort((a,b)=>b.completedAt.localeCompare(a.completedAt))[0];
  // Freeze duration at the recorded end date; never keep counting after care ended.
  const start = Date.parse(patient.dischargeDate.slice(0,10)), end = Date.parse(completion?.completedAt.slice(0,10) || "");
  const days = Number.isFinite(start) && Number.isFinite(end) && end >= start ? Math.floor((end-start)/86400000)+1 : null;
  const firstPain = first ? painValue(first) : null, lastPain = last ? painValue(last) : null;
  return <div className="space-y-5 py-6 sm:py-8">
    <header>
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]"><Check aria-hidden size={28}/></span>
      <h1 className="text-[clamp(1.75rem,5vw,2rem)] font-black leading-snug">오늘안부 관리기간이 종료되었어요</h1>
      <p className="mt-3 text-lg leading-8 text-[#40554A]">{days ? `지난 ${days}일 동안 남긴 회복 기록을 확인해보세요.` : "관리기간 동안 남긴 회복 기록을 확인해보세요."}</p>
    </header>
    <section className="rounded-3xl bg-white p-6" aria-labelledby="care-summary-title">
      <h2 id="care-summary-title" className="text-2xl font-black">나의 회복 기록</h2>
      <dl className="mt-5 space-y-5">
        <div><dt className="text-lg text-[#40554A]">남긴 회복 기록</dt><dd className="mt-1 text-2xl font-black">{records.length}회</dd></div>
        <div className="border-t border-[#D5DED7] pt-4"><dt className="text-lg font-bold">통증</dt><dd className="mt-2 text-xl font-black leading-8">{records.length > 1 ? `첫 기록 ${firstPain}점 → 최근 기록 ${lastPain}점` : last ? `최근 기록 ${lastPain}점` : "남긴 통증 기록이 없어요."}</dd></div>
      </dl>
      {last ? <p className="mt-2 text-base leading-7 text-[#40554A]">0~10점 중 높을수록 통증이 심한 점수예요.</p> : null}
      {records.length > 1 && firstPain !== null && lastPain !== null ? <p className="mt-3 text-lg leading-8">최근 기록의 통증 점수가 첫 기록보다 {lastPain > firstPain ? "높아요." : lastPain < firstPain ? "낮아요." : "같아요."}</p> : null}
    </section>
    <PatientLink href={nav.href("history")} className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315E50] px-5 text-xl font-black text-white">지난 회복 기록 보기</PatientLink>
    <section className="rounded-3xl border border-[#CDDAD2] bg-white p-6">
      <h2 className="text-xl font-black">불편한 증상이 계속되나요?</h2>
      <p className="mt-2 text-lg leading-8 text-[#40554A]">불편감이 계속되거나 심해진다면 병원 안내를 확인해주세요. 병원 연락 방법과 진료 안내를 볼 수 있어요.</p>
      <PatientLink href={nav.href("hospital")} className="mt-3 inline-flex min-h-12 items-center text-lg font-black text-[#315E50]">병원 안내 보기 →</PatientLink>
    </section>
    <aside className="rounded-2xl bg-[#E5EBE5] p-5 text-[#344B3E]">
      <h2 className="text-lg font-black">관리기간 종료 ≠ 치료 종료</h2>
      <p className="mt-2 text-base leading-7">오늘안부 이용기간이 끝난 것이며, 의료적인 완치나 정상 판정을 의미하지 않습니다.</p>
    </aside>
  </div>;
}
