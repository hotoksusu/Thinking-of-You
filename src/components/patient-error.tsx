"use client";
import { useState } from "react";
import { HeartPulse, Link2Off } from "lucide-react";
import { PatientBack, PatientLink, usePatientNavigation } from "@/components/patient-navigation";
export type PatientErrorType = "sessionExpired" | "missingSession" | "invalidInvite" | "expiredInvite" | "missingPatient" | "storageError" | "networkError" | "unknownError";
const messages: Record<PatientErrorType, [string, string]> = {
  sessionExpired: ["다시 연결이 필요해요.", "이용 시간이 지나 환자 연결이 종료되었어요. 병원에서 받은 링크를 다시 열어주세요."],
  missingSession: ["환자 연결이 필요해요.", "이 기기에서 환자 연결 정보를 찾지 못했어요. 병원에서 받은 문자나 카카오톡의 링크를 열어주세요."],
  invalidInvite: ["초대 링크를 확인할 수 없어요", "올바르지 않거나 사용이 취소된 링크예요. 병원에서 받은 최신 링크를 확인해주세요."],
  expiredInvite: ["초대 링크의 이용 시간이 지났어요.", "병원에 새 회복관리 링크를 요청해주세요."],
  missingPatient: ["회복관리 정보를 찾을 수 없어요.", "연결된 환자의 기록을 확인하지 못했어요. 다시 시도한 뒤에도 같다면 병원에 문의해주세요."],
  storageError: ["이 기기의 저장 정보를 읽지 못했어요.", "브라우저의 사이트 데이터 저장 설정을 확인하고 다시 시도해주세요. 기존 기록은 지우지 않았어요."],
  networkError: ["인터넷 연결을 확인해주세요.", "연결 상태를 확인한 뒤 다시 시도해주세요."],
  unknownError: ["화면을 불러오지 못했어요.", "잠시 후 다시 시도해주세요. 계속된다면 병원에서 받은 링크를 다시 열어주세요."],
};
export function PatientError({ type, retry }: { type: PatientErrorType; retry: () => void }) {
  const nav = usePatientNavigation(), [help, setHelp] = useState(false), [attempted, setAttempted] = useState(false);
  const [title, description] = messages[type];
  return <main className="min-h-[100dvh] bg-[#F1F0E9] px-5 pb-10 text-[#202923]">
    <div className="mx-auto max-w-[640px]">
      <header className="flex min-h-20 flex-wrap items-center justify-between gap-2 border-b border-[#D5DED7]"><PatientBack fallback={nav.demo ? "/demo/patient" : "/patient"}/><span className="flex items-center gap-2 text-lg font-black text-[#315E50]"><HeartPulse size={21}/>오늘안부 Care</span></header>
      {nav.demo ? <p className="mt-4 font-bold text-[#315E50]">오늘안부 데모</p> : null}
      <section aria-labelledby="patient-error-title" className="mt-[clamp(1.5rem,8vh,5rem)] rounded-[28px] bg-white p-6 sm:p-8">
        <Link2Off aria-hidden className="text-[#315E50]" size={36}/><h1 id="patient-error-title" className="mt-5 text-3xl font-black leading-tight">{title}</h1>
        <p className="mt-4 text-xl leading-8 text-[#40554A]">{description}</p>
        <button className="mt-7 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#315E50] text-xl font-black text-white" onClick={() => { setAttempted(true); retry(); }}>다시 시도하기</button>
        {attempted ? <p role="status" className="mt-3 text-lg leading-7">연결이 되지 않으면 아래 안내에서 받은 링크를 찾는 방법을 확인해주세요.</p> : null}
        <button aria-expanded={help} className="mt-3 min-h-14 w-full rounded-2xl border-2 border-[#315E50] text-xl font-black text-[#315E50]" onClick={() => setHelp(v => !v)}>병원 안내 보기</button>
        {help ? <div className="mt-5 rounded-2xl bg-[#F1F0E9] p-5 text-lg leading-8"><h2 className="text-xl font-black">병원에서 받은 링크 찾기</h2><p className="mt-3">문자나 카카오톡에서 ‘오늘안부’ 또는 진료받은 병원 이름을 검색해주세요. 가장 최근에 받은 회복관리 링크를 눌러주세요.</p><p className="mt-3">링크가 없거나 만료되었다면 퇴원 안내문 또는 병원에서 받은 문자에 적힌 연락처로 새 링크를 요청해주세요.</p></div> : null}
        {nav.demo ? <PatientLink href="/demo/patient" className="mt-4 flex min-h-12 items-center justify-center font-bold text-[#315E50]">데모 홈으로 돌아가기</PatientLink> : null}
      </section>
    </div>
  </main>;
}
