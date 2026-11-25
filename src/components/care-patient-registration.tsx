'use client';

import { useEffect, useState } from 'react';
import { careDemo } from '@/lib/care-brand';
import { type Hospital } from '@/lib/care-mvp';
import { fetchPrograms } from '@/components/care-program-manager';
import { type RecoveryProgram } from '@/lib/recovery-program';

const inputClass = 'mt-1 block min-h-12 w-full rounded-xl border bg-white p-3';
const fields = [
  ['name','환자 이름','text'],['phone','연락처','tel'],['age','연령','number'],
  ['surgeryDate','수술·시술일 (선택)','date'],['nextAppointment','다음 진료일 (선택)','date'],
];

export function CarePatientRegistration({ hospital, pending, onRegister }: {
  hospital:Hospital; pending:boolean;
  onRegister:(patient:Record<string, FormDataEntryValue>, program?:{id:string;version:number})=>void;
}) {
  const [programs,setPrograms] = useState<RecoveryProgram[]>([]);
  const [selected,setSelected] = useState('');
  const [loadError,setLoadError] = useState(false);
  const program = programs.find(item=>item.id+':'+item.version===selected);
  useEffect(()=>{
    let current = true;
    fetchPrograms(hospital.id).then(result=>{
      if (!current) return;
      setPrograms(result.assignmentEnabled ? result.programs.filter(p=>p.state==='active' && p.demo===result.demo) : []);
      setLoadError(false);
    }).catch(()=>{if(current) setLoadError(true);});
    return ()=>{current=false;};
  },[hospital.id]);
  const legacyAvailable = !hospital.departments?.length || hospital.departments.includes('정형외과');

  return <details className="care-surface mt-5 p-5">
    <summary className="min-h-11 cursor-pointer font-bold">{careDemo.local ? '가상 환자 등록' : '환자 등록'}</summary>
    <form className="mt-3 grid gap-3" onSubmit={event=>{
      event.preventDefault();
      const data=Object.fromEntries(new FormData(event.currentTarget));
      if (program) {
        data.department=program.department;
        data.dischargeDate=data.dischargeDate || data.careStartOn;
      } else if (legacyAvailable && hospital.departments?.length) data.department='정형외과';
      onRegister(data,program ? {id:program.id,version:program.version} : undefined);
    }}>
      {fields.map(([name,label,type],index)=><label key={name} className="text-sm font-bold">{label}
        <input name={name} type={type} required={index<3} min={type==='number'?0:undefined} max={type==='number'?130:undefined} className={inputClass}/>
      </label>)}
      {(programs.length>0 || !legacyAvailable) && <label className="text-sm font-bold">회복 프로그램
        <select className={inputClass} value={selected} onChange={event=>setSelected(event.target.value)} required={!legacyAvailable}>
          <option value="">{legacyAvailable ? '기존 정형외과 기본 흐름' : '프로그램 선택'}</option>
          {programs.map(p=><option key={p.id+':'+p.version} value={p.id+':'+p.version}>{p.department} · {p.name} · v{p.version}</option>)}
        </select>
      </label>}
      {loadError && <p role="status">프로그램을 불러오지 못했습니다. 프로그램을 배정하려면 페이지를 다시 열어주세요.</p>}
      {program ? <>
        <p className="text-sm">{program.department} · {program.treatment} · {program.careDays}일 관리 · {program.intervalDays}일마다 체크인</p>
        <label className="text-sm font-bold">관리 시작일<input type="date" name="careStartOn" className={inputClass} required/></label>
        <label className="text-sm font-bold">퇴원일 (선택)<input type="date" name="dischargeDate" className={inputClass}/></label>
      </> : <>
        {!legacyAvailable && <p className="text-sm">승인되어 사용 중인 프로그램을 배정해 주세요.</p>}
        <label className="text-sm font-bold">퇴원일<input type="date" name="dischargeDate" className={inputClass} required={legacyAvailable}/></label>
        {legacyAvailable && <label className="text-sm font-bold">치료 구분<select name="surgeryType" className={inputClass}>{['인공관절','척추','골절','기타'].map(type=><option key={type}>{type}</option>)}</select></label>}
      </>}
      <label className="text-sm font-bold">담당자 이메일 (선택)<input name="assignee" type="email" className={inputClass}/></label>
      <label className="flex min-h-12 items-start gap-3 text-sm leading-7">
        <input required type="checkbox" name="confirmed" className="mt-1 size-5"/>
        {careDemo.local ? '시연에 사용할 합성 정보만 입력했습니다.' : '병원에서 회복관리 대상과 개인정보 이용 근거를 확인했습니다.'}
      </label>
      <button disabled={pending || (!program && !legacyAvailable)} className="primary">서버에 환자 등록</button>
    </form>
  </details>;
}
