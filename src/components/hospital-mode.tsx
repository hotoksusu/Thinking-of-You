"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, ClipboardCheck, Clock3, Phone, Search, Stethoscope, UsersRound } from "lucide-react";
import { recoveryCopy, recoveryPatients, type HospitalReview, type RecoveryPatient } from "@/lib/recovery-model";

const statusMeta = {
  check: { label: "확인 필요", tone: "bg-[#FFF0E8] text-[#A7441E] border-[#F0C3AA]" },
  observe: { label: "관찰", tone: "bg-[#FFF8DF] text-[#80611A] border-[#E9D898]" },
  recovering: { label: "회복 중", tone: "bg-[#EAF5F3] text-[#17665D] border-[#B9DCD7]" },
  stable: { label: "안정", tone: "bg-[#EDF4EB] text-[#356641] border-[#C8DDCA]" },
} as const;

export function HospitalMode({ view = "dashboard", patientId }: { view?: "dashboard" | "patient"; patientId?: string }) {
  if (view === "patient") return <PatientDetail patient={recoveryPatients.find((item) => item.patientId === patientId) ?? recoveryPatients[0]} />;
  return <HospitalDashboard />;
}

function HospitalDashboard() {
  const [filter, setFilter] = useState<"all" | "check" | "observe" | "stable">("all");
  const [query, setQuery] = useState("");
  const patients = useMemo(() => recoveryPatients.filter((patient) => {
    const status = patient.changes[0].currentStatus;
    return (filter === "all" || status === filter) && patient.displayName.includes(query.trim());
  }), [filter, query]);

  return <main className="min-h-screen bg-[#F3F6F5] text-[#18251F]">
    <header className="border-b border-[#DDE5E1] bg-white"><div className="mx-auto flex min-h-[72px] max-w-[1180px] items-center justify-between px-5"><Link href="/" className="font-bold text-[#245C45]">오늘안부 Hospital</Link><span className="text-sm font-semibold text-[#647169]">퇴원 후 생활 회복 관리 · 체험용</span></div></header>
    <div className="mx-auto max-w-[1180px] px-5 py-8 lg:py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold text-[#39705A]">퇴원환자 관리</p><h1 className="mt-2 text-3xl font-bold tracking-[-.02em] sm:text-4xl">오늘 누구를 먼저 확인해야 할까요?</h1><p className="mt-3 text-lg text-[#56645D]">확인이 필요한 환자를 생활 변화 지속기간 순으로 보여드립니다.</p></div><button className="min-h-12 rounded-xl bg-[#245C45] px-5 font-bold text-white">퇴원환자 등록</button></div>
      <section className="mt-7 grid gap-3 sm:grid-cols-4" aria-label="관리 현황">{[["관리 중","128명"],["확인 필요","7명"],["회복 중","34명"],["안정","87명"]].map(([label,value])=><article key={label} className="rounded-2xl border border-[#DDE5E1] bg-white p-4"><p className="text-sm font-semibold text-[#637068]">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></article>)}</section>
      <section className="mt-7 rounded-[24px] border border-[#DDE5E1] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-bold">환자 우선 확인 목록</h2><p className="mt-1 text-[#637068]">의료적 진단이 아닌 생활 변화 확인 순서입니다.</p></div><label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#CFDAD4] px-3"><Search size={18}/><span className="sr-only">환자 검색</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="환자 검색" className="w-full bg-transparent outline-none"/></label></div>
        <div className="mt-5 flex flex-wrap gap-2">{[["all","전체"],["check","확인 필요"],["observe","관찰"],["stable","안정"]].map(([value,label])=><button key={value} onClick={()=>setFilter(value as typeof filter)} className={`min-h-10 rounded-full px-4 text-sm font-bold ${filter===value?"bg-[#245C45] text-white":"bg-[#EEF3F0] text-[#4E5E56]"}`}>{label}</button>)}</div>
        <div className="mt-5 divide-y divide-[#E5EBE7]">{patients.map((patient)=><PatientRow key={patient.patientId} patient={patient}/>)}</div>
      </section>
      <p className="mt-5 text-sm text-[#68756E]">오늘안부는 질병을 진단하거나 응급 상황을 판별하지 않습니다. 개인 기준선과 생활 변화 추이를 후속 확인을 위한 참고 정보로 제공합니다.</p>
    </div>
  </main>;
}

function PatientRow({ patient }: { patient: RecoveryPatient }) {
  const status = patient.changes[0].currentStatus;
  const meta = statusMeta[status === "recovering" ? "recovering" : status];
  return <article className="grid gap-4 py-5 md:grid-cols-[150px_1fr_180px_120px] md:items-center"><div><span className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${meta.tone}`}>{meta.label}</span><h3 className="mt-2 text-lg font-bold">{patient.displayName} · 퇴원 {patient.dischargeDay}일차</h3><p className="mt-1 text-sm text-[#67736C]">{patient.department}</p></div><div><p className="font-semibold">{recoveryCopy(patient).hospital}</p><p className="mt-2 text-sm text-[#66736B]">{patient.familyAction.contactAttempted ? "가족 연락 완료" : patient.familyAction.notificationSent ? "가족 확인 없음" : "가족 연결 없음"}</p></div><p className="text-sm font-semibold text-[#56645D]">모니터링 {patient.monitoringPeriodDays}일</p><Link href={`/app?role=hospital&view=patient&patient=${patient.patientId}`} className="flex min-h-11 items-center justify-center rounded-xl border border-[#9DB7AA] font-bold text-[#245C45]">환자 확인 <ChevronRight size={18}/></Link></article>;
}

function PatientDetail({ patient }: { patient: RecoveryPatient }) {
  const [review, setReview] = useState<HospitalReview>(patient.hospitalReview);
  const change = patient.changes[0];
  const copy = recoveryCopy(patient);
  const updateReview = (followUpType: NonNullable<HospitalReview["followUpType"]>) => setReview({ patientId: patient.patientId, reviewStatus: "completed", reviewedAt: new Date().toISOString(), followUpType });
  return <main className="min-h-screen bg-[#F3F6F5] text-[#18251F]"><header className="border-b border-[#DDE5E1] bg-white"><div className="mx-auto flex min-h-[72px] max-w-[1040px] items-center gap-4 px-5"><Link href="/app?role=hospital" className="flex size-11 items-center justify-center rounded-xl border border-[#D5DFDA]" aria-label="환자 목록으로"><ArrowLeft/></Link><div><p className="text-sm font-semibold text-[#657168]">퇴원환자 관리</p><h1 className="text-xl font-bold">{patient.displayName} · 퇴원 {patient.dischargeDay}일차</h1></div></div></header>
    <div className="mx-auto max-w-[1040px] px-5 py-8"><section className="rounded-[24px] bg-[#244D3C] p-6 text-white"><p className="text-sm font-bold text-white/75">현재 상태</p><h2 className="mt-2 text-3xl font-bold">{copy.hospital}</h2><p className="mt-3 text-white/80">개인 기준선과 최근 생활 흐름을 비교한 참고 정보입니다.</p></section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="rounded-[22px] bg-white p-6"><h2 className="text-xl font-bold">퇴원 후 경과</h2><ol className="mt-5 grid gap-4">{["퇴원","생활 기준 형성",change.duration?"생활 변화 시작":"생활 변화 없음",change.duration?`변화 ${change.duration}일 지속`:"평소 수준 유지","오늘"].map((item,index)=><li key={item} className="flex items-center gap-3"><span className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${index===4?"bg-[#245C45] text-white":"bg-[#EAF1ED] text-[#245C45]"}`}>{index+1}</span><span className="font-semibold">{item}</span></li>)}</ol></section>
        <section className="rounded-[22px] bg-white p-6"><h2 className="text-xl font-bold">생활 변화</h2><dl className="mt-5 grid gap-3">{[["활동",change.changeType==="activity"?"평소보다 감소":"평소와 비슷"],["휴대전화 사용","평소와 비슷"],["생활 리듬",change.changeType==="daily_rhythm"?"조금 변화":"평소와 비슷"]].map(([term,value])=><div key={term} className="flex justify-between rounded-xl bg-[#F3F6F5] p-4"><dt className="text-[#627068]">{term}</dt><dd className="font-bold">{value}</dd></div>)}</dl></section>
        <section className="rounded-[22px] bg-white p-6"><h2 className="text-xl font-bold">가족 확인</h2><p className="mt-4 font-semibold">{patient.familyAction.notificationSent?"가족에게 알림 전달":"알림 미전달"}</p><p className="mt-2 text-[#627068]">{patient.familyAction.contactAttempted?"가족 연락 완료":"아직 연락하지 않음"}</p><p className="mt-5 rounded-xl bg-[#F5F7F6] p-4 text-sm text-[#637068]">가족 사진과 사적인 메시지는 병원 화면에 표시하지 않습니다.</p></section>
        <section className="rounded-[22px] bg-white p-6"><h2 className="text-xl font-bold">병원 확인</h2>{review.reviewStatus==="completed"?<div role="status" className="mt-4 rounded-xl bg-[#EAF5F0] p-4 font-bold text-[#245C45]"><Check className="mr-2 inline"/>확인 완료 · {followUpLabel(review.followUpType)}</div>:<div className="mt-4 grid grid-cols-2 gap-2">{[["observation","계속 관찰",Clock3],["phone","전화 확인",Phone],["consultation","상담 안내",ClipboardCheck],["outpatient","외래 안내",Stethoscope]].map(([value,label,Icon])=><button key={String(value)} onClick={()=>updateReview(value as NonNullable<HospitalReview["followUpType"]>)} className="min-h-14 rounded-xl border border-[#B8CBC1] font-bold text-[#245C45]"><Icon className="mr-2 inline" size={18}/>{String(label)}</button>)}</div>}</section></div>
      <section className="mt-6 rounded-[22px] border border-[#DDE5E1] bg-white p-5"><p className="flex items-center gap-2 font-bold"><UsersRound size={20}/> 관리 정보</p><p className="mt-2 text-sm text-[#637068]">{patient.department} · 모니터링 {patient.monitoringPeriodDays}일 · {patient.monitoringStartDate} 시작</p></section>
    </div></main>;
}

function followUpLabel(type?: HospitalReview["followUpType"]) { return ({ observation: "계속 관찰", phone: "전화 확인", consultation: "상담 안내", outpatient: "외래 안내" } as const)[type ?? "observation"]; }
