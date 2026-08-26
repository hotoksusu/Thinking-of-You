"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { AccessGuard } from "@/components/access-guard";
import { RecoveryTrend } from "@/components/recovery-trend";
import { comparisonLabels, daysSince, loadCareState, loadPublicDemoCareState, mobilityLabels, painValue, saveCareState, savePublicDemoCareState, statusLabels, type CareState, type FollowUp } from "@/lib/care-mvp";
import type { HospitalSession } from "@/lib/demo-auth";
import type { ActionType, StaffDecision } from "@/domain/care-events";

const idMap: Record<string, string> = { kim: "patient_001", lee: "patient_002", jung: "patient_003", park: "patient_004" };
const actionTypes: Record<string, ActionType> = {
  "전화 확인": "phone_call", "복약 확인": "additional_monitoring", "생활/재활 안내": "additional_monitoring",
  "외래 방문 안내": "visit_recommended", "의료진 추가 확인": "additional_monitoring", "계속 관찰": "additional_monitoring", 기타: "other",
};

export default function PatientDetail({ demo = false }: { demo?: boolean }) {
  if (demo) return <Detail session={{kind:"hospital",sessionId:"public-demo",userId:"hu_a_nurse",hospitalId:"hospital_001",role:"nurse",expiresAt:"2999-12-31T00:00:00.000Z"}} demo />;
  return <AccessGuard area="hospital">{session => <Detail session={session as HospitalSession} />}</AccessGuard>;
}

function Detail({ session, demo = false }: { session: HospitalSession; demo?: boolean }) {
  const slug = usePathname().split("/").at(-1) || "kim";
  const [state, setState] = useState<CareState | null>(null);
  const [routePatientId, setRoutePatientId] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [recordStatus, setRecordStatus] = useState<"completed" | "scheduled">("completed");
  const [handler, setHandler] = useState(session.role === "doctor" ? "담당의" : "간호사");
  const [note, setNote] = useState("");
  const [followUpDueDate, setFollowUpDueDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [resultNotes, setResultNotes] = useState<Record<string, string>>({});
  const [resultHandlers, setResultHandlers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { setRoutePatientId(new URLSearchParams(location.search).get("patientId")); setState(demo ? loadPublicDemoCareState() : loadCareState()); }, [demo]);
  if (!state) return <main className="p-10 text-center font-bold">환자 정보를 불러오고 있습니다.</main>;
  const current = state;

  const requestedPatientId = routePatientId || idMap[slug] || slug;
  const patient = state.patients.find(p => p.id === requestedPatientId && p.hospitalId === session.hospitalId) || state.patients.find(p => p.hospitalId === session.hospitalId)!;
  const checks = state.checkIns.filter(c => c.patientId === patient.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const follows = state.followUps.filter(f => f.patientId === patient.id).sort((a, b) => eventTime(b).localeCompare(eventTime(a)));
  const status = state.statuses.find(s => s.patientId === patient.id);
  const latest = checks[0], previous = checks[1], episode = state.episodes.find(e => e.patientId === patient.id);

  function saveAction() {
    if (!action || !handler.trim() || !episode || (recordStatus === "scheduled" && !followUpDueDate)) return;
    const now = new Date().toISOString();
    const staffDecision: StaffDecision = recordStatus === "scheduled" ? "monitor" : "needs_contact";
    const follow: FollowUp = {
      id: `follow_${Date.now()}`, episodeId: episode.id, patientId: patient.id, hospitalId: patient.hospitalId,
      triggeredFromCheckInId: latest?.id, action, actionType: actionTypes[action] || "other",
      outcomeCategory: recordStatus === "scheduled" ? "continue_monitoring" : "other", staffDecision, note,
      status: recordStatus, followUpDueDate: recordStatus === "scheduled" ? followUpDueDate : undefined,
      followUpNote: recordStatus === "scheduled" ? followUpNote : undefined, handledBy: handler.trim(),
      performedByRole: session.role, performedAt: now, source: "hospital_staff", createdAt: now, completedAt: now,
    };
    const decision = latest ? { id: `decision_${Date.now()}`, episodeId: episode.id, checkInId: latest.id, displayedPriority: status?.level || "stable", displayedReasons: status?.reasonCodes || [], staffDecision, ruleVersion: status?.ruleVersion || "demo-v1", createdAt: now, source: "hospital_staff" as const } : null;
    const next = { ...current, followUps: [...current.followUps, follow], decisions: decision ? [...current.decisions, decision] : current.decisions };
    (demo ? savePublicDemoCareState : saveCareState)(next); setState(next); setSaved(true); setAction(""); setNote(""); setFollowUpDueDate(""); setFollowUpNote("");
  }

  function completeFollowUp(follow: FollowUp) {
    const resultNote = (resultNotes[follow.id] || "").trim();
    const resultHandler = (resultHandlers[follow.id] || handler).trim();
    if (!resultNote || !resultHandler) return;
    const now = new Date().toISOString();
    const next = { ...current, followUps: current.followUps.map(f => f.id === follow.id ? { ...f, status: "completed" as const, resultNote, followUpCompletedAt: now, followUpHandledBy: resultHandler, outcomeCategory: "other" as const, staffDecision: "needs_contact" as const } : f) };
    (demo ? savePublicDemoCareState : saveCareState)(next); setState(next); setResultNotes(v => ({ ...v, [follow.id]: "" })); setSaved(true);
  }

  return <main className="min-h-screen bg-[#F3F5F3] p-5 text-[#1E2923] lg:p-9"><div className="mx-auto max-w-[1180px]">
    <Link href={demo ? "/demo/hospital" : "/hospital/dashboard"} className="flex min-h-12 items-center gap-2 font-black text-[#596A62]"><ArrowLeft />오늘 할 일</Link>
    <section className="mt-5 rounded-[24px] border bg-white p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="text-xs font-black text-[#596A62]">{demo ? "병원 데모 · 환자 기본정보" : "환자 기본정보"}</p><h1 className="mt-2 text-3xl font-black">{patient.name}</h1><p className="mt-2 font-bold text-slate-600">연령대 {Math.floor(patient.age / 10) * 10}대 · 담당 박간호사</p></div><span className="h-fit rounded-full bg-[#FFF0E9] px-4 py-2 font-black text-[#A74A2D]">{statusLabels[status?.level || "stable"]}</span></div><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3"><Info label="수술명/유형" value={patient.customProcedureName || patient.procedureDetail || patient.surgeryType} /><Info label="수술 부위" value={`${patient.laterality} ${patient.bodyPart}`} /><Info label="수술일" value={patient.surgeryDate || "-"} /><Info label="퇴원일" value={patient.dischargeDate} /><Info label="회복 경과" value={`수술 후 D+${daysSince(patient.surgeryDate || patient.dischargeDate)}`} /></dl><div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-[#F3F6F3] p-4 text-sm font-black text-[#315E50]"><span>수술 {patient.surgeryDate || "-"}</span><span aria-hidden="true">→</span><span>퇴원 {patient.dischargeDate}</span><span aria-hidden="true">→</span><span>오늘 D+{daysSince(patient.surgeryDate || patient.dischargeDate)}</span></div></section>
    <section className="mt-4 rounded-[26px] border border-[#315E50]/25 bg-[#E8F1EA] p-7"><p className="text-sm font-black text-[#315E50]">현재 상태</p>{latest ? <div className="mt-4 grid gap-4 lg:grid-cols-2"><Current label="최근 통증" value={`${painValue(latest)} / 10`} /><Current label="움직임" value={mobilityLabels[latest.mobilityScore ?? latest.mobility]} /><Current label="주요 불편 증상" value={latest.hasConcern ? latest.concernText : "없음"} /><Current label="전일 대비 변화" value={comparisonLabels[latest.dayComparison || "same"]} /></div> : <p className="mt-3 font-bold">최근 체크인 응답이 없습니다.</p>}</section>
    <section className="mt-4 rounded-[24px] border border-[#E7C7BA] bg-[#FFF8F4] p-6"><p className="text-sm font-black text-[#A74A2D]">확인이 필요한 이유</p><p className="mt-3 font-bold text-[#6E584F]">{status?.reason || (previous && latest && painValue(latest) > painValue(previous) ? "통증 증가" : "현재 상태 확인")}</p><p className="mt-4 text-xs font-semibold text-[#6E584F]">환자 응답 변화를 기준으로 정리한 정보이며, 최종 판단은 의료진이 합니다.</p></section>
    <RecoveryTrend checks={checks} followUps={follows} audience="hospital" />
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.9fr]">
      <section className="rounded-[24px] border bg-white p-6"><h2 className="text-xl font-black">최근 체크인</h2><div className="mt-4 space-y-3">{checks.slice(0, 7).map(c => <div key={c.id} className="rounded-xl bg-[#F3F5F3] p-4"><div className="flex flex-wrap items-center gap-2"><strong>{c.date}</strong>{c.source === "guardian" ? <span className="rounded-full bg-[#E8F1EA] px-2 py-1 text-xs font-black text-[#315E50]">보호자 대리 입력</span> : null}</div><p className="mt-1">통증 {painValue(c)} / 10 · {mobilityLabels[c.mobilityScore ?? c.mobility]}</p>{c.hasConcern ? <p className="font-bold">{c.concernText}</p> : null}</div>)}</div></section>
      <section id="hospital-action" className="rounded-[24px] border bg-white p-6"><h2 className="text-xl font-black">의료진 조치 기록</h2><p className="mt-1 text-sm font-semibold text-slate-500">실제 수행한 조치와 재확인 업무를 기록합니다. 전화·예약·처방을 실행하지 않습니다.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">{Object.keys(actionTypes).map(x => <Choice key={x} selected={action === x} onClick={() => setAction(x)}>{x}</Choice>)}</div>
        <p className="mt-5 font-black">처리 상태</p><div className="mt-2 grid grid-cols-2 gap-2"><Choice selected={recordStatus === "completed"} onClick={() => setRecordStatus("completed")}>처리 완료</Choice><Choice selected={recordStatus === "scheduled"} warning onClick={() => setRecordStatus("scheduled")}>Follow-up 필요</Choice></div>
        <label className="mt-5 block font-black">간단 메모<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="예: 통증 증가 관련 복약 여부 확인" className="mt-2 min-h-16 w-full rounded-xl border-2 border-[#DCE4DF] p-3 font-normal" /></label>
        <label className="mt-4 block font-black">담당자<input value={handler} onChange={e => setHandler(e.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-[#DCE4DF] px-3" /></label>
        {recordStatus === "scheduled" ? <div className="mt-4 rounded-2xl bg-[#FFF8F4] p-4"><label className="block font-black">재확인 예정일<input type="date" value={followUpDueDate} onChange={e => setFollowUpDueDate(e.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-[#E7C7BA] bg-white px-3" /></label><label className="mt-4 block font-black">Follow-up 메모<textarea value={followUpNote} onChange={e => setFollowUpNote(e.target.value)} placeholder="재확인할 내용을 짧게 입력" className="mt-2 min-h-16 w-full rounded-xl border-2 border-[#E7C7BA] bg-white p-3 font-normal" /></label></div> : null}
        <p className="mt-4 text-sm font-bold text-slate-500">처리 시각은 저장 시점으로 자동 기록됩니다.</p><button disabled={!action || !handler.trim() || (recordStatus === "scheduled" && !followUpDueDate)} onClick={saveAction} className="mt-3 h-14 w-full rounded-xl bg-[#315E50] text-lg font-black text-white disabled:bg-[#BCC7C1]">조치 기록 저장</button>{saved ? <p className="mt-4 rounded-xl bg-[#E8F1EA] p-4 font-black text-[#315E50]"><Check className="mr-2 inline" />관리 기록에 반영했습니다.</p> : null}
        <div className="mt-6 border-t pt-5"><h3 className="font-black">관리 기록</h3><p className="mt-1 text-xs font-semibold text-slate-500">최근 기록이 먼저 표시됩니다.</p>{follows.length ? follows.map(f => <article key={f.id} className="mt-3 rounded-xl bg-slate-50 p-4 text-sm"><div className="flex flex-wrap items-center gap-2"><strong>{formatTime(f.performedAt || f.completedAt)} · {f.action}</strong><Status status={f.status} /></div>{f.note ? <p className="mt-2">{f.note}</p> : null}<p className="mt-1">담당: {f.handledBy}</p>{f.followUpDueDate ? <div className="mt-3 border-l-2 border-[#D28A65] pl-3"><strong className="text-[#A74A2D]">Follow-up 예정 · {formatDate(f.followUpDueDate)}</strong>{f.followUpNote ? <p>{f.followUpNote}</p> : null}</div> : null}{f.status === "scheduled" ? <div className="mt-4 rounded-xl border bg-white p-3"><label className="font-black">결과 메모<textarea value={resultNotes[f.id] || ""} onChange={e => setResultNotes(v => ({ ...v, [f.id]: e.target.value }))} placeholder="예: 통증 7 → 5로 감소 확인" className="mt-2 min-h-16 w-full rounded-lg border p-2 font-normal" /></label><label className="mt-3 block font-black">담당자<input value={resultHandlers[f.id] ?? handler} onChange={e => setResultHandlers(v => ({ ...v, [f.id]: e.target.value }))} className="mt-2 h-11 w-full rounded-lg border px-3" /></label><button onClick={() => completeFollowUp(f)} disabled={!(resultNotes[f.id] || "").trim() || !(resultHandlers[f.id] ?? handler).trim()} className="mt-3 h-11 w-full rounded-lg bg-[#315E50] font-black text-white disabled:bg-[#BCC7C1]">Follow-up 완료 기록</button></div> : null}{f.followUpCompletedAt ? <div className="mt-3 border-l-2 border-[#315E50] pl-3"><strong className="text-[#315E50]">{formatTime(f.followUpCompletedAt)} · Follow-up 완료</strong><p>{f.resultNote}</p><p>담당: {f.followUpHandledBy}</p></div> : null}</article>) : <p className="mt-3 text-sm font-bold text-slate-500">아직 관리 기록이 없습니다.</p>}</div>
      </section>
    </div>
  </div></main>;
}

function eventTime(f: FollowUp) { return f.followUpCompletedAt || f.performedAt || f.completedAt; }
function formatTime(value: string) { return new Date(value).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
function formatDate(value: string) { return new Date(`${value}T12:00:00`).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }); }
function Info({ label, value }: { label: string; value: string }) { return <div><dt className="font-bold text-slate-500">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>; }
function Current({ label, value }: { label: string; value: string }) { return <article className="rounded-xl bg-white p-4"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 font-black">{value}</p></article>; }
function Choice({ selected, warning, onClick, children }: { selected: boolean; warning?: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-12 rounded-xl border-2 px-2 font-black ${selected ? warning ? "border-[#A74A2D] bg-[#FFF0E9]" : "border-[#315E50] bg-[#E8F1EA]" : "border-[#DCE4DF]"}`}>{children}</button>; }
function Status({ status }: { status: FollowUp["status"] }) { return <span className={`rounded-full px-2 py-0.5 text-xs font-black ${status === "scheduled" ? "bg-[#FFF0E9] text-[#A74A2D]" : "bg-[#E8F1EA] text-[#315E50]"}`}>{status === "scheduled" ? "Follow-up 예정" : "처리 완료"}</span>; }
