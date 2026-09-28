import type {CareState} from './care-mvp';

const dayMs = 86400000;
const dateOnly = (value: string) => value.slice(0, 10);
const pain = (c: CareState['checkIns'][number]) => c.painScore ?? [0, 3, 6, 9][c.pain] ?? 0;
export function previousMonth(month: string) {
  return new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 2, 1)).toISOString().slice(0, 7);
}

/** One expected check-in per patient/day from discharge through completion. */
export function monthlyCareReport(state: CareState, hospitalId: string, month: string, today: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month > today.slice(0, 7)) throw new Error('현재 월 또는 이전 월을 선택하세요.');
  function summarize(period: string) {
    const start = `${period}-01`;
    const monthEnd = new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 0)).toISOString().slice(0, 10);
    const end = monthEnd < today ? monthEnd : today;
    const completion = (id: string) => state.careCompletions?.find(c => c.patientId === id)?.completedAt.slice(0, 10) || end;
    const patients = state.patients.filter(p => p.hospitalId === hospitalId && dateOnly(p.dischargeDate) <= end && completion(p.id) >= start);
    const ids = new Set(patients.map(p => p.id));
    const inPeriod = (date: string) => dateOnly(date) >= start && dateOnly(date) <= end;
    const checks = state.checkIns.filter(c => ids.has(c.patientId) && inPeriod(c.checkInDate || c.date));
    let expected = 0, responses = 0, recoveryTotal = 0, recoveryPatients = 0;
    const priorityPatients: {id: string; name: string; reason: string}[] = [];
    for (const p of patients) {
      const first = dateOnly(p.dischargeDate) > start ? dateOnly(p.dischargeDate) : start;
      const last = completion(p.id) < end ? completion(p.id) : end;
      expected += Math.max(0, Math.round((Date.parse(last) - Date.parse(first)) / dayMs) + 1);
      const records = checks.filter(c => c.patientId === p.id && dateOnly(c.checkInDate || c.date) >= first && dateOnly(c.checkInDate || c.date) <= last).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
      responses += new Set(records.map(c => dateOnly(c.checkInDate || c.date))).size;
      if (records.length >= 2) {recoveryTotal += pain(records.at(-1)!) - pain(records[0]); recoveryPatients++;}
      if (records.some(c => c.pain === 3 || c.mobility === 3 || (c.pain >= 2 && c.mobility >= 2) || c.hasConcern)) priorityPatients.push({id: p.id, name: p.name, reason: '기간 중 통증·움직임·불편 응답 확인 필요'});
      else if (!records.length) priorityPatients.push({id: p.id, name: p.name, reason: '기간 중 체크인 미응답'});
    }
    const actions = (state.careActions || []).filter(a => ids.has(a.patientId) && (!a.hospitalId || a.hospitalId === hospitalId) && a.status !== 'cancelled' && inPeriod(a.createdAt)).length;
    const followUps = state.followUps.filter(f => ids.has(f.patientId) && f.hospitalId === hospitalId && Boolean(f.followUpDueDate) && inPeriod(f.followUpDueDate!)).length;
    return {start, end, patients: patients.length, expected, responses, responseRate: expected ? Math.round(responses / expected * 1000) / 10 : null, recoveryChange: recoveryPatients ? Math.round(recoveryTotal / recoveryPatients * 10) / 10 : null, recoveryPatients, priorityPatients, actions, followUps};
  }
  const current = summarize(month), previous = summarize(previousMonth(month));
  return {month, current, previous, generatedAt: new Date().toISOString()};
}

export type MonthlyCareReport = ReturnType<typeof monthlyCareReport>;
