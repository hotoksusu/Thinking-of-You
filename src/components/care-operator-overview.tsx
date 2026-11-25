'use client';

import { useEffect, useState } from 'react';
import { careRequest } from '@/lib/care-server';
import { adoptionStates, departments, organizationTypes, programStates, type OrganizationFields } from '@/lib/recovery-program';

type Security = {
  usage: { tenant_id: string; operation_count: number }[];
  programUsage: {tenant_id:string;status:keyof typeof programStates;total:number}[];
  events: { action: string; outcome: string; created_at: number }[];
};

export function CareOperatorOverview({ hospitals, onChanged }: { hospitals: ({id:string;name:string}&OrganizationFields)[]; onChanged:()=>void }) {
  const [data, setData] = useState<Security>();
  const [error, setError] = useState(false);
  const [type,setType] = useState(''), [specialty,setSpecialty] = useState(''), [notice,setNotice] = useState('');
  const filtered = hospitals.filter(h=>(!type||type===h.organizationType)&&(!specialty||specialty===h.primaryDepartment||h.departments?.some(d=>d===specialty)));
  useEffect(() => {
    const controller = { active:true };
    careRequest<Security>('staff/security').then(result => {
      if (controller.active) setData(result);
    }).catch(() => { if (controller.active) setError(true); });
    return () => { controller.active = false; };
  }, []);

  return <section className="care-surface mt-5 p-5" aria-label="서비스 운영 및 감사">
    <h2>운영 현황</h2>
    {error && <p role="alert" className="mt-2">운영 현황을 불러오지 못했습니다. 운영자 권한과 연결을 확인해주세요.</p>}
    {!data && !error && <p role="status" className="mt-2">운영 현황을 불러오는 중입니다.</p>}
    {data && <>
      <h3 className="mt-4">등록 의료기관 · {filtered.length}곳</h3>
      <div className="my-3 flex flex-wrap gap-3">
        <label>유형별 보기<select value={type} className="ml-2 min-h-12 rounded border p-2" onChange={e=>setType(e.target.value)}><option value="">전체</option>{organizationTypes.map(t=><option key={t}>{t}</option>)}</select></label>
        <label>진료과별 보기<select value={specialty} className="ml-2 min-h-12 rounded border p-2" onChange={e=>setSpecialty(e.target.value)}><option value="">전체</option>{departments.map(d=><option key={d}>{d}</option>)}</select></label>
      </div>
      {notice && <p role="status">{notice}</p>}
      <ul className="mt-2 divide-y">{filtered.map(hospital => <li key={hospital.id} className="py-2">
        <p className="font-bold">{hospital.name}</p>
        <p className="text-sm">{[hospital.organizationType,hospital.departments?.join(', ') || hospital.primaryDepartment,hospital.monthlyPatients!==undefined?'월 '+hospital.monthlyPatients+'명':null].filter(Boolean).join(' · ')}</p>
        <p className="text-sm">감사 이벤트 {data.usage.find(item => item.tenant_id === hospital.id)?.operation_count ?? 0}건</p>
        <p className="text-sm">프로그램 · {data.programUsage.filter(item=>item.tenant_id===hospital.id).map(p=>programStates[p.status]+' '+p.total+'건').join(' · ') || '등록 전'}</p>
        <form className="mt-2 flex flex-wrap items-center gap-2" onSubmit={async event=>{
          event.preventDefault();
          const adoptionStatus = new FormData(event.currentTarget).get('adoptionStatus');
          try { await careRequest('staff/hospitals','PUT',{hospitalId:hospital.id,adoptionStatus}); onChanged(); setNotice('도입 상태를 저장했습니다.'); }
          catch { setNotice('도입 상태를 저장하지 못했습니다. 다시 시도해 주세요.'); }
        }}>
          <label>도입 상태<select className="ml-2 min-h-12 rounded border p-2" name="adoptionStatus" defaultValue={hospital.adoptionStatus || '도입 검토'}>{adoptionStates.map(state=><option key={state}>{state}</option>)}</select></label>
          <button className="secondary px-3">저장</button>
        </form>
      </li>)}</ul>
      <details className="mt-4">
        <summary className="min-h-12 cursor-pointer font-bold">최근 접근 거부 감사 기록</summary>
        {data.events.length === 0 ? <p>표시할 접근 거부 기록이 없습니다.</p> :
          <ul className="divide-y">{data.events.map((event, index) => <li key={event.created_at + ':' + index} className="py-2">
            {new Date(event.created_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} · {event.action} · 접근 거부
          </li>)}</ul>}
      </details>
    </>}
  </section>;
}
