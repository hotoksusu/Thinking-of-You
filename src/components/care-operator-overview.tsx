'use client';

import { useEffect, useState } from 'react';
import { careRequest } from '@/lib/care-server';

type Security = {
  usage: { tenant_id: string; operation_count: number }[];
  events: { action: string; outcome: string; created_at: number }[];
};

export function CareOperatorOverview({ hospitals }: { hospitals: {id:string;name:string}[] }) {
  const [data, setData] = useState<Security>();
  const [error, setError] = useState(false);
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
      <h3 className="mt-4">등록 병원 · {hospitals.length}곳</h3>
      <ul className="mt-2 divide-y">{hospitals.map(hospital => <li key={hospital.id} className="py-2">
        {hospital.name} · 감사 이벤트 {data.usage.find(item => item.tenant_id === hospital.id)?.operation_count ?? 0}건
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
