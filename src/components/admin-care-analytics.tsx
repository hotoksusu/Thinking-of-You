"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { loadCareState, TODAY, type CareState, type FollowUp } from "@/lib/care-mvp";

type Period = 1 | 7 | 30;
const actionLabels: Record<string, string> = { phone_call: "전화 확인", additional_monitoring: "추가 관찰", visit_recommended: "내원 안내", no_action_needed: "별도 조치 없음", other: "기타" };

export function AdminCareAnalytics() {
  const [state, setState] = useState<CareState | null>(null);
  const [period, setPeriod] = useState<Period>(7);
  useEffect(() => {
    const sync = () => setState(loadCareState());
    sync();
    window.addEventListener("todayanbu:care-updated", sync);
    return () => window.removeEventListener("todayanbu:care-updated", sync);
  }, []);

  const metrics = useMemo(() => state ? calculateMetrics(state, period) : null, [state, period]);
  if (!metrics) return <main className="p-10 text-center font-bold">운영 지표를 불러오고 있습니다.</main>;

  const periodLabel = period === 1 ? "오늘" : `최근 ${period}일`;
  return <main className="min-h-screen bg-[#F2F5F3] p-5 text-[#18231F] lg:p-10"><div className="mx-auto max-w-[1240px]">
    <Link href="/admin" className="inline-flex min-h-12 items-center gap-2 font-black text-[#315E50]"><ArrowLeft />Admin</Link>
    <header className="mt-4 rounded-[28px] bg-[#193D35] p-7 text-white lg:p-9"><p className="flex items-center gap-2 text-sm font-black text-[#9FCBBD]"><BarChart3 size={18} />CARE OPERATIONS · DEMO STATE</p><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="text-3xl font-black lg:text-4xl">병원 운영 Analytics</h1><p className="mt-3 max-w-3xl font-semibold leading-7 text-white/70">환자 체크인과 의료진 관리 기록을 기준으로 실제 제품 안에서 이루어진 업무만 보여줍니다. 임상성과를 의미하지 않습니다.</p></div><div className="flex rounded-xl bg-white/10 p-1">{([1, 7, 30] as Period[]).map(value => <button key={value} onClick={() => setPeriod(value)} aria-pressed={period === value} className={`min-h-11 rounded-lg px-4 font-black ${period === value ? "bg-white text-[#193D35]" : "text-white/75"}`}>{value === 1 ? "오늘" : `${value}일`}</button>)}</div></div></header>

    <section aria-label={`${periodLabel} 핵심 지표`} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="관리 중인 환자" value={`${metrics.managed}명`} note="현재 관리가 시작된 환자" />
      <Kpi label="오늘 Check-in 완료" value={`${metrics.todayChecked}명`} note={`${TODAY.replaceAll("-", ".")} 기준`} />
      <Kpi label={`${periodLabel} Check-in 참여율`} value={`${metrics.participationRate}%`} note={`${metrics.respondedPatientDays}/${metrics.eligiblePatientDays} 환자-일 응답`} />
      <Kpi label="확인 필요 환자" value={`${metrics.attention}명`} note="현재 오늘 확인 필요 상태" tone="attention" />
      <Kpi label={`${periodLabel} 의료진 조치`} value={`${metrics.actions.length}건`} note="저장된 Hospital Action" />
      <Kpi label="Follow-up 예정" value={`${metrics.followScheduled}건`} note="현재 완료되지 않은 재확인" tone="attention" />
      <Kpi label={`${periodLabel} Follow-up 완료`} value={`${metrics.followCompleted}건`} note="결과와 완료 시각이 기록된 건" />
      <Kpi label="오늘 미응답 환자" value={`${metrics.todayNoResponse}명`} note="오늘 응답 가능한 환자 기준" />
    </section>

    <section className="mt-6 rounded-[24px] border border-[#DCE5E0] bg-white p-6"><div className="flex flex-col justify-between gap-2 md:flex-row md:items-end"><div><p className="text-sm font-black text-[#315E50]">CARE WORKFLOW</p><h2 className="mt-1 text-2xl font-black">{periodLabel} 의료진 업무 흐름</h2></div><p className="text-sm font-semibold text-[#68766F]">중복 환자와 조치 건은 각 단계 정의에 맞게 집계합니다.</p></div><div className="mt-5 grid gap-3 md:grid-cols-5"><Flow label="관리 환자" value={`${metrics.managed}명`} /><Flow label="확인 필요" value={`${metrics.attention}명`} /><Flow label="의료진 조치" value={`${metrics.actions.length}건`} /><Flow label="Follow-up 완료" value={`${metrics.followCompleted}건`} /><Flow label="오늘 미응답" value={`${metrics.todayNoResponse}명`} /></div></section>

    <section className="mt-6 grid gap-5 lg:grid-cols-3"><Metric title="확인 필요 환자 비율" value={rate(metrics.attention, metrics.managed)} note={`${metrics.managed}명 중 ${metrics.attention}명`} /><Metric title="확인 필요 → 실제 조치" value={rate(metrics.actedAttentionPatients, metrics.attention)} note={`현재 확인 필요 환자 중 ${metrics.actedAttentionPatients}명에 조치 기록`} /><Metric title="Follow-up 완료율" value={rate(metrics.followCompleted, metrics.followLifecycle)} note={`예정 또는 완료 기록 ${metrics.followLifecycle}건 기준`} /></section>

    <section className="mt-6 grid gap-5 lg:grid-cols-2"><article className="rounded-[24px] border border-[#DCE5E0] bg-white p-6"><p className="text-sm font-black text-[#315E50]">PATIENT ENGAGEMENT</p><h2 className="mt-1 text-2xl font-black">환자 참여</h2><div className="mt-5 grid grid-cols-2 gap-3"><Small label={`${periodLabel} 참여율`} value={`${metrics.participationRate}%`} /><Small label="2일 이상 연속 참여" value={`${metrics.consecutivePatients}명`} /></div><p className="mt-4 text-sm font-semibold leading-6 text-[#68766F]">참여율은 환자의 퇴원일 이후 선택 기간에 응답 가능한 환자-일을 분모로 계산합니다. D+7·D+14 유지율은 표시하지 않습니다.</p></article><Distribution title={`${periodLabel} 조치 유형`} rows={metrics.actionCounts.map(([key, count]) => [actionLabels[key] || key, count])} /></section>

    <section className="mt-6 rounded-[24px] border border-dashed border-[#AFC2B9] bg-[#F8FAF8] p-6"><p className="text-sm font-black text-[#315E50]">PILOT VALIDATION</p><h2 className="mt-1 text-2xl font-black">파일럿에서 검증 중인 항목</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["의료진 사용시간", "Alert 실제 조치 전환율", "의료진 재사용 의향", "병원 WTP"].map(label => <article key={label} className="rounded-2xl border bg-white p-5"><h3 className="font-black">{label}</h3><p className="mt-3 text-sm font-bold text-[#68766F]">파일럿에서 측정 예정</p></article>)}</div></section>
  </div></main>;
}

function calculateMetrics(state: CareState, period: Period) {
  const managedPatients = state.patients.filter(patient => patient.status === "onboarded");
  const managedIds = new Set(managedPatients.map(patient => patient.id));
  const start = shiftDate(TODAY, -(period - 1));
  const inPeriod = (value: string) => value.slice(0, 10) >= start && value.slice(0, 10) <= TODAY;
  const scopedChecks = state.checkIns.filter(check => managedIds.has(check.patientId) && inPeriod(check.checkInDate || check.date));
  const respondedPatientDays = new Set(scopedChecks.map(check => `${check.patientId}:${check.checkInDate || check.date}`)).size;
  const eligiblePatientDays = managedPatients.reduce((sum, patient) => sum + countDays(maxDate(start, patient.dischargeDate), TODAY), 0);
  const todayCheckedIds = new Set(state.checkIns.filter(check => managedIds.has(check.patientId) && (check.checkInDate || check.date) === TODAY).map(check => check.patientId));
  const todayEligible = managedPatients.filter(patient => patient.dischargeDate <= TODAY);
  const attentionIds = new Set(state.statuses.filter(status => managedIds.has(status.patientId) && status.level === "needs_attention").map(status => status.patientId));
  const actions = state.followUps.filter(follow => managedIds.has(follow.patientId) && inPeriod(follow.performedAt || follow.createdAt));
  const actedAttentionPatients = new Set(actions.filter(action => attentionIds.has(action.patientId)).map(action => action.patientId)).size;
  const followScheduled = state.followUps.filter(follow => managedIds.has(follow.patientId) && follow.status === "scheduled").length;
  const followCompleted = state.followUps.filter(follow => managedIds.has(follow.patientId) && Boolean(follow.followUpCompletedAt) && inPeriod(follow.followUpCompletedAt!)).length;
  const followLifecycle = state.followUps.filter(follow => managedIds.has(follow.patientId) && (Boolean(follow.followUpDueDate) || Boolean(follow.followUpCompletedAt)) && lifecycleInPeriod(follow, inPeriod)).length;
  const actionCounts = Object.entries(actions.reduce<Record<string, number>>((counts, follow) => { const key = follow.actionType || "other"; counts[key] = (counts[key] || 0) + 1; return counts; }, {}));
  return { managed: managedPatients.length, todayChecked: todayCheckedIds.size, participationRate: eligiblePatientDays ? Math.round(respondedPatientDays / eligiblePatientDays * 100) : 0, respondedPatientDays, eligiblePatientDays, attention: attentionIds.size, actions, followScheduled, followCompleted, followLifecycle, todayNoResponse: Math.max(0, todayEligible.length - todayCheckedIds.size), actedAttentionPatients, consecutivePatients: managedPatients.filter(patient => hasConsecutiveDays(state.checkIns.filter(check => check.patientId === patient.id && inPeriod(check.checkInDate || check.date)).map(check => check.checkInDate || check.date))).length, actionCounts };
}

function lifecycleInPeriod(follow: FollowUp, inPeriod: (value: string) => boolean) { return inPeriod(follow.followUpCompletedAt || follow.followUpDueDate || follow.performedAt || follow.createdAt); }
function shiftDate(date: string, days: number) { const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
function maxDate(a: string, b: string) { return a > b ? a : b; }
function countDays(start: string, end: string) { if (start > end) return 0; return Math.floor((Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / 86400000) + 1; }
function hasConsecutiveDays(dates: string[]) { const unique = [...new Set(dates)].sort(); return unique.some((date, index) => index > 0 && shiftDate(unique[index - 1], 1) === date); }
function rate(value: number, total: number) { return total ? `${Math.round(value / total * 100)}%` : "계산할 기록 없음"; }
function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "attention" }) { return <article className={`rounded-[22px] border p-5 ${tone ? "border-[#E4C4B7] bg-[#FFF8F4]" : "border-[#DCE5E0] bg-white"}`}><p className="text-sm font-bold text-[#68766F]">{label}</p><p className={`mt-2 text-3xl font-black ${tone ? "text-[#A74A2D]" : "text-[#193D35]"}`}>{value}</p><p className="mt-2 text-xs font-semibold text-[#74817B]">{note}</p></article>; }
function Flow({ label, value }: { label: string; value: string }) { return <article className="rounded-2xl bg-[#F2F6F3] p-4"><p className="text-sm font-bold text-[#68766F]">{label}</p><p className="mt-2 text-2xl font-black text-[#193D35]">{value}</p></article>; }
function Metric({ title, value, note }: { title: string; value: string; note: string }) { return <article className="rounded-[22px] border border-[#DCE5E0] bg-white p-5"><p className="font-bold text-[#68766F]">{title}</p><p className="mt-2 text-3xl font-black text-[#315E50]">{value}</p><p className="mt-2 text-sm font-semibold text-[#74817B]">{note}</p></article>; }
function Small({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-[#F2F6F3] p-4"><p className="text-sm font-bold text-[#68766F]">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>; }
function Distribution({ title, rows }: { title: string; rows: [string, number][] }) { return <article className="rounded-[24px] border border-[#DCE5E0] bg-white p-6"><h2 className="text-2xl font-black">{title}</h2>{rows.length ? <div className="mt-5 space-y-3">{rows.map(([label, count]) => <div key={label} className="flex justify-between rounded-xl bg-[#F2F6F3] p-3"><strong>{label}</strong><span className="font-black">{count}건</span></div>)}</div> : <p className="mt-5 font-semibold text-[#68766F]">해당 기간의 기록이 없습니다.</p>}</article>; }
