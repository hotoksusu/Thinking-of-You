"use client";
import Link from 'next/link';
import {useState} from 'react';
import {monthlyCareReport, type MonthlyCareReport} from '@/lib/monthly-care-report';
import {TODAY, type CareState} from '@/lib/care-mvp';

export function CareReports({state, hospitalId, demo, returnTo}: {state: CareState; hospitalId: string; demo: boolean; returnTo: string}) {
  const [month, setMonth] = useState(TODAY.slice(0, 7));
  const [report, setReport] = useState<MonthlyCareReport | null>(null);
  const [loading, setLoading] = useState(false), [error, setError] = useState('');
  async function generate() {
    setLoading(true); setError(''); setReport(null);
    try {
      // Yield a frame so the loading status is rendered before local aggregation.
      await new Promise(resolve => setTimeout(resolve, 150));
      setReport(monthlyCareReport(state, hospitalId, month, TODAY));
    } catch (e) {setError(e instanceof Error ? e.message : '리포트를 생성하지 못했습니다. 다시 시도해주세요.');}
    finally {setLoading(false);}
  }
  const metrics = report ? [
    ['관리 환자 수', report.current.patients, report.previous.patients, '명'],
    ['응답률', report.current.responseRate, report.previous.responseRate, '%'],
    ['회복 변화 (평균 통증 변화)', report.current.recoveryChange, report.previous.recoveryChange, '점'],
    ['우선관리 / 위험 응답 환자', report.current.priorityPatients.length, report.previous.priorityPatients.length, '명'],
    ['의료진 조치 건수', report.current.actions, report.previous.actions, '건'],
    ['Follow-up 건수', report.current.followUps, report.previous.followUps, '건'],
  ] as const : [];
  return <section aria-label="월간 Care Report" className="care-report">
    <header className="border-b pb-6"><p className="font-black text-[#315E50]">CARE REPORT{demo ? ' · DEMO' : ''}</p><h1 className="mt-2 text-3xl font-black">회복 리포트</h1><p className="mt-2 text-[#607068]">관리기간, 참여율, 회복 변화, 의료진 조치와 Follow-up을 정리합니다.</p></header>
    <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl bg-white p-6 print:hidden">
      <label className="font-bold">리포트 기간<input type="month" aria-label="리포트 기간" max={TODAY.slice(0, 7)} value={month} disabled={loading} onChange={e => {setMonth(e.target.value); setReport(null); setError('');}} className="mt-2 block min-h-12 rounded-xl border px-3"/></label>
      <button onClick={generate} disabled={loading || !month} aria-busy={loading} className="min-h-12 rounded-xl bg-[#315E50] px-5 font-black text-white">{loading ? '리포트 생성 중…' : '월간 리포트 생성'}</button>
      <p role="status">{loading ? '선택한 기간의 Care 기록을 집계하고 있습니다.' : report ? '리포트 생성 완료' : '기간을 선택하고 리포트를 생성하세요.'}</p>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    {report && <article className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-[#DDE5E0]" aria-label="리포트 결과">
      <h2 className="text-2xl font-black">{report.month} 월간 Care Report</h2><p className="mt-2">집계 기간: {report.current.start} ~ {report.current.end}</p>
      {!report.current.patients && <p className="mt-4 rounded-xl bg-[#F4F6F4] p-4">선택한 기간에 관리한 환자가 없습니다.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value, previous, unit]) => <section key={label} className="rounded-xl bg-[#F4F6F4] p-5"><h3 className="font-bold">{label}</h3><strong className="mt-2 block text-2xl">{value === null ? '데이터 없음' : `${value}${unit}`}</strong><p className="mt-2 text-sm text-[#607068]">전월 대비 {value === null || previous === null || !report.previous.patients ? '비교 데이터 없음' : `${value - previous > 0 ? '+' : ''}${Math.round((value - previous) * 10) / 10}${unit === '%' ? '%p' : unit}`}</p></section>)}</div>
      <p className="mt-5 text-sm text-[#607068]">응답률: 퇴원일부터 관리 종료일(진행 중이면 집계 종료일)까지 1일 1회 기준, 중복 응답 제외 ({report.current.responses}/{report.current.expected}일). 회복 변화: 기간 내 2회 이상 응답한 {report.current.recoveryPatients}명의 마지막 통증 − 첫 통증 평균으로, 음수는 통증 감소입니다. Follow-up은 예정일 기준입니다. 우선관리 표시는 응답 확인을 위한 업무 기준입니다.</p>
      <h3 className="mt-6 text-xl font-black">우선관리 환자</h3>{report.current.priorityPatients.length ? <ul className="mt-3 divide-y">{report.current.priorityPatients.map(p => <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span><b>{p.name}</b> · {p.reason}</span><Link className="rounded-lg border px-3 py-2 font-bold text-[#315E50] print:hidden" href={`${demo ? '/demo/hospital/patient' : '/care/hospital/kim'}?patientId=${p.id}&returnTo=${returnTo}`}>환자 상세</Link></li>)}</ul> : <p className="mt-3">해당 기간의 우선관리 대상이 없습니다.</p>}
      <footer aria-label="PDF 다운로드 및 인쇄" className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5 print:hidden"><button onClick={() => window.print()} className="min-h-12 rounded-xl border border-[#315E50] px-5 font-bold">인쇄 / PDF로 저장</button><button disabled className="min-h-12 rounded-xl border px-5">PDF 파일 다운로드 · 준비 중</button><p className="text-sm text-[#607068]">브라우저 인쇄에서 PDF로 저장할 수 있습니다.</p></footer>
    </article>}
  </section>;
}
