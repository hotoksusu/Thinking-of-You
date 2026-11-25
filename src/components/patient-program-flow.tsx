'use client';

import { useRef, useState, type FormEvent } from 'react';
import { careRequest, CareServerError } from '@/lib/care-server';
import { emergencyNotice } from '@/lib/care-brand';
import { type Hospital, type Patient } from '@/lib/care-mvp';
import { careOffset, dateAfter, expectedCheckIn, formatProgramAnswer, type ProgramAnswers, type ProgramCheckIn, type ProgramEnrollment, type RecoveryQuestion } from '@/lib/recovery-program';
import { PatientLink, usePatientNavigation } from '@/components/patient-navigation';

export function ProgramRecordFacts({ record }: {record:ProgramCheckIn}) {
  return <div className="my-2">
    <p className="mb-2 text-sm">{record.program.name} · v{record.program.version}</p>
    <dl className="divide-y">
      {record.program.questions.map(q=><div key={q.id} className="grid gap-1 py-2">
        <dt className="font-bold">{q.label}</dt>
        <dd className="whitespace-pre-wrap break-words">{formatProgramAnswer(record.answers[q.id])}</dd>
      </div>)}
    </dl>
  </div>;
}

function ProgramHistory({records}: {records:ProgramCheckIn[]}) {
  const groups = new Map<string,ProgramCheckIn[]>();
  for (const record of records) {
    const key = record.program.id+':'+record.program.version;
    groups.set(key,[...(groups.get(key)||[]),record]);
  }
  return <section className="care-surface my-5 p-5">
    <h1>나의 회복기록</h1>
    {!records.length && <p className="mt-3">아직 제출한 회복기록이 없습니다.</p>}
    {[...groups.entries()].map(([key,items])=><section key={key} className="mt-5">
      <h2>{items[0].program.name} · v{items[0].program.version}</h2>
      {items[0].program.questions.filter(q=>q.kind==='number').map(q=>{
        const values = items.slice(0,7).reverse().flatMap(r=>typeof r.answers[q.id]==='number' ? [{day:r.date,value:r.answers[q.id] as number}] : []);
        return values.length>0 && <figure key={q.id} className="my-4 rounded-xl border p-3">
          <figcaption className="font-bold">{q.label} · 최근 기록 {values.length}건</figcaption>
          <ul className="my-2 grid gap-2">
            {values.map(v=><li key={v.day} className="grid grid-cols-[5rem_minmax(0,1fr)_2rem] items-center gap-2 text-sm">
              <time dateTime={v.day}>{v.day.slice(5)}</time>
              <meter className="w-full" aria-label={v.day+' '+q.label} min={q.min} max={q.max} value={v.value}>{v.value}</meter><span>{v.value}</span>
            </li>)}
          </ul>
          <p className="text-sm">질문 입력 범위 {q.min}~{q.max} · 기록이 있는 날만 표시합니다.</p>
        </figure>;
      })}
      {items.map(record=><details key={record.id} className="border-b py-2">
        <summary className="min-h-12 cursor-pointer font-bold">{record.date} 기록</summary>
        <ProgramRecordFacts record={record}/>
      </details>)}
    </section>)}
  </section>;
}

function ProgramQuestion({ question, value, onChange }: {question:RecoveryQuestion;value?:ProgramAnswers[string];onChange:(value:ProgramAnswers[string] | undefined)=>void}) {
  const { id, label, required, kind } = question;
  const input = 'mt-2 block min-h-12 w-full rounded-xl border p-3';
  if (kind === 'boolean' || kind === 'single') {
    const options = kind==='boolean' ? [true,false] : question.options;
    return <fieldset className="rounded-xl border p-3">
      <legend className="px-2 font-bold">{label}{required ? '' : ' (선택)'}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(option=><label key={String(option)} className="flex min-h-12 items-center gap-2 rounded-lg border px-3">
          <input type="radio" name={id} required={required} checked={value===option} onChange={()=>onChange(option)}/>{formatProgramAnswer(option)}
        </label>)}
        {!required && value !== undefined && <button type="button" className="secondary" onClick={()=>onChange(undefined)}>선택 해제</button>}
      </div>
    </fieldset>;
  }
  return <label className="block font-bold">{label}{required ? '' : ' (선택)'}
    {kind === 'number'
      ? <input className={input} type="number" inputMode="numeric" min={question.min} max={question.max} step={1} required={required} value={typeof value==='number' ? value : ''} onChange={e=>onChange(e.target.value==='' ? undefined : e.target.valueAsNumber)}/>
      : <input className={input} type="text" maxLength={120} required={required} value={typeof value==='string' ? value : ''} onChange={e=>onChange(e.target.value)}/>}
  </label>;
}

export function ProgramPatientFlow({ mode, patient, hospital, enrollment, records, today, edit, onDisconnect }: {
  mode:string;patient:Patient;hospital?:Hospital;enrollment:ProgramEnrollment;records:ProgramCheckIn[];
  today:string;edit:boolean;onDisconnect:()=>Promise<void>;
}) {
  const nav = usePatientNavigation();
  const prior = records.find(record=>record.date===today);
  const [answers,setAnswers] = useState<ProgramAnswers>(prior?.answers || {});
  const [confirm,setConfirm] = useState(false);
  const [saved,setSaved] = useState<ProgramCheckIn>();
  const [saving,setSaving] = useState(false);
  const [fault,setFault] = useState('');
  const lock=useRef(false);
  const offset = careOffset(patient,today);
  const active = patient.careStatus!=='completed' && offset>=0 && offset<enrollment.careDays;
  const scheduled = active && expectedCheckIn(patient,today,enrollment.careDays);
  const canEdit = scheduled && Boolean(prior);
  const completionDate = dateAfter(enrollment.startOn,enrollment.careDays-1);
  const status = patient.careStatus==='completed' ? '회복관리 기간이 끝났습니다.'
    : offset<0 ? '아직 회복관리 시작 전입니다.'
    : !active ? '체크인 기간이 끝났습니다. 관리 종료에 대해서는 병원에 문의해 주세요.'
    : !scheduled ? '오늘은 예정된 체크인이 없습니다.'
    : '오늘의 회복 상태를 남겨주세요.';
  const phone = hospital?.phone?.replace(/[^0-9+]/g,'');

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current=true;
    setSaving(true);
    setFault('');
    try {
      const response=await careRequest<{record:ProgramCheckIn}>('checkins',edit && prior ? 'PUT' : 'POST',{
        patientId:patient.id,date:today,programId:enrollment.id,programVersion:enrollment.version,
        answers,expectedUpdatedAt:edit ? prior?.updatedAt : undefined,
      });
      setSaved(response.record);
    } catch (error) {
      const code=error instanceof CareServerError ? error.code : '';
      setFault(code==='RECORD_CHANGED' ? '이미 기록이 변경됐습니다. 화면을 다시 열어 최신 기록을 확인해 주세요.'
        : code==='PATIENT_SESSION_EXPIRED' || code==='PATIENT_SESSION_REQUIRED' ? '연결이 만료됐습니다. 병원에서 받은 링크를 다시 열어주세요.'
        : '저장하지 못했습니다. 입력한 답변을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      lock.current=false;
      setSaving(false);
    }
  }

  if (mode==='history') return <ProgramHistory records={records}/>;
  return <section className="care-surface my-5 p-5 sm:p-7">
    <p className="care-kicker">{hospital?.name} · {enrollment.department}</p>
    <h1 className="mt-3">{mode==='hospital' ? '병원 문의 및 회복관리 안내' : enrollment.name}</h1>
    <p className="mt-2 text-sm">{enrollment.treatment} · v{enrollment.version} · {enrollment.startOn} ~ {completionDate}</p>
    {enrollment.demo && <p className="mt-2 font-bold">구조 검증용 · 합성 데이터 전용</p>}
    {mode==='checkin' && (saved || prior && !edit) ? <>
      <h2 className="mt-5" role="status">오늘 회복기록을 저장했어요</h2>
      <ProgramRecordFacts record={saved || prior!}/>
      {canEdit && !saved && <PatientLink href={nav.href('checkin',{edit:'1'})} className="secondary flex items-center justify-center">오늘 기록 수정하기</PatientLink>}
    </> : mode==='checkin' && scheduled && (!edit || prior) ?
      <div className="mt-5">
        <h2>{confirm ? '답변 확인 및 제출' : '오늘의 체크인'}</h2>
        {confirm ? <form onSubmit={save}>
          <dl className="my-3 divide-y">{enrollment.questions.map(q=><div className="py-2" key={q.id}><dt className="font-bold">{q.label}</dt><dd>{formatProgramAnswer(answers[q.id])}</dd></div>)}</dl>
          {fault && <p role="alert" className="my-3">{fault}</p>}
          <button className="primary" disabled={saving}>{saving ? '저장 중…' : '회복 체크인 제출'}</button>
          <button type="button" className="secondary mt-2 w-full" disabled={saving} onClick={()=>setConfirm(false)}>답변 수정</button>
        </form> : <form className="mt-3 grid gap-3" onSubmit={event=>{
          event.preventDefault();
          if(Object.values(answers).some(value=>typeof value!=='string'||value.trim())){setFault('');setConfirm(true);}
          else setFault('한 항목 이상 답변을 선택해 주세요.');
        }}>
          {enrollment.questions.map(q=><ProgramQuestion key={q.id} question={q} value={answers[q.id]} onChange={value=>setAnswers(current=>{
            const next={...current};
            if(value===undefined) delete next[q.id]; else next[q.id]=value;
            return next;
          })}/>)}
          {fault && <p role="alert">{fault}</p>}
          <button className="primary">답변 확인</button>
        </form>}
      </div> : <p className="my-4">{mode==='hospital' ? '기록 확인이나 관리 일정이 궁금하면 안내받은 병원으로 문의해 주세요.' : status}</p>}
    {mode==='home' && scheduled && <PatientLink className="primary" href={nav.href('checkin')}>{prior ? '오늘 기록 확인하기' : '오늘 체크인 시작'}</PatientLink>}
    {mode!=='history' && <PatientLink className="secondary mt-3 flex items-center justify-center" href={nav.href('history')}>지난 회복기록</PatientLink>}
    <aside className="mt-5 border-t pt-4">
      <p>{emergencyNotice}</p>
      <p className="mt-3">병원 확인 시간 · {hospital?.openingHours || '병원에 문의해주세요'}</p>
      {phone && <a className="mt-2 inline-flex min-h-12 items-center underline" href={'tel:'+phone}>병원 문의 · {hospital?.phone}</a>}
      {enrollment.instructions && <p className="mt-3 whitespace-pre-wrap">{enrollment.instructions}</p>}
    </aside>
    {mode==='home' && <details className="mt-4"><summary className="min-h-12 cursor-pointer">이 기기 연결 관리</summary><button className="secondary" onClick={()=>void onDisconnect()}>이 기기의 환자 연결 종료</button></details>}
  </section>;
}
