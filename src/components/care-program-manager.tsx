'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { careRequest, CareServerError } from '@/lib/care-server';
import { departments, programStates, type Department, type RecoveryProgram, type RecoveryQuestion } from '@/lib/recovery-program';

const kinds = { single: '단일 선택', number: '숫자 범위', boolean: '예·아니오', text: '짧은 텍스트' };
const control = 'mt-1 block min-h-12 w-full rounded-lg border p-2';
type QuestionKind = RecoveryQuestion['kind'];
type ProgramState = RecoveryProgram['state'];
type QuestionRow = { key: number; question?: RecoveryQuestion };
type ProgramList = { programs: RecoveryProgram[]; demo: boolean; assignmentEnabled: boolean };

export function fetchPrograms(hospitalId: string) {
  return careRequest<ProgramList>('staff/programs?hospitalId=' + encodeURIComponent(hospitalId));
}

export function CareProgramManager({ hospitalId, role, specialties, onChanged }: {hospitalId:string; role:string; specialties?:Department[]; onChanged:()=>void}) {
  const [list, setList] = useState<ProgramList>();
  const [base, setBase] = useState<RecoveryProgram>();
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  function showError(error: unknown) {
    const code = error instanceof CareServerError ? error.code : '';
    setNotice(code === 'PROGRAM_NOT_ASSIGNABLE' ? '현재 환경에서는 프로그램을 활성화하거나 배정할 수 없습니다.'
      : code === 'RECORD_CHANGED' ? '다른 담당자가 저장했거나 사용 중인 버전이 있습니다. 현재 상태를 확인해 주세요.'
      : '프로그램을 저장하지 못했습니다. 입력값과 진료과별 권한을 확인해 주세요.');
  }

  useEffect(() => {
    let current = true;
    fetchPrograms(hospitalId).then(data => { if (current) setList(data); })
      .catch(() => { if (current) setNotice('프로그램을 불러오지 못했습니다. 병원 접근 권한을 확인해 주세요.'); });
    return () => { current = false; };
  }, [hospitalId]);

  async function transition(p: RecoveryProgram, state: ProgramState, approval?: FormData) {
    setBusy(true);
    setNotice('');
    try {
      await careRequest('staff/programs','PUT',{
        hospitalId,programId:p.id,version:p.version,state,
        approvalRef:approval?.get('approvalRef'),confirmed:approval?.get('confirmed')==='on',
      });
      setList(await fetchPrograms(hospitalId));
      onChanged();
      setNotice('프로그램 상태를 저장했습니다.');
    } catch (error) { showError(error); }
    finally { setBusy(false); }
  }

  async function create(event: FormEvent<HTMLFormElement>, rows: QuestionRow[]) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = Object.fromEntries(form);
    const questions = rows.map(({ key, question }) => {
      const value = (field: string) => String(form.get(key + '-' + field) || '');
      const kind = value('kind') as QuestionKind;
      return {
        id: question?.id || 'q-' + key, kind, label: value('label'), required: value('required') === 'on',
        ...(kind === 'single' ? { options: value('options').split('\n').map(option => option.trim()).filter(Boolean) } : {}),
        ...(kind === 'number' ? { min: Number(value('min')), max: Number(value('max')) } : {}),
      };
    });
    setBusy(true);
    setNotice('');
    try {
      await careRequest('staff/programs','POST',{
        ...fields, hospitalId, programId: base?.id,
        careDays:Number(fields.careDays),intervalDays:Number(fields.intervalDays),
        followupDays:fields.followupDays ? Number(fields.followupDays) : null,questions,
      });
      setList(await fetchPrograms(hospitalId));
      onChanged();
      setBase(undefined);
      setFormKey(value => value + 1);
      setNotice('새 작성 버전을 저장했습니다.');
    } catch (error) { showError(error); }
    finally { setBusy(false); }
  }

  return <section className="my-4" aria-label="회복 프로그램 설정">
    <h3>다녀온 프로그램</h3>
    <p className="mt-2 text-sm">치료별 체크인 항목과 일정을 설정합니다. 신규 항목의 응답은 담당자가 확인하며 자동으로 의료 상태를 판정하지 않습니다.</p>
    {list?.demo && <p className="mt-2 font-bold">구조 검증용 · 합성 데이터 전용</p>}
    {notice && <p role="status" className="my-3">{notice}</p>}
    {list?.programs.length === 0 && <p className="mt-2">작성한 프로그램이 없습니다. 기존 정형외과 흐름은 별도로 이용할 수 있습니다.</p>}
    <div className="divide-y">
      {list?.programs.map(p => <article key={p.id+':'+p.version} className="py-4">
        <h4 className="font-bold">{p.name} · v{p.version}</h4>
        <p className="mt-1 text-sm">{p.department} · {p.treatment} · {programStates[p.state]}{p.demo ? ' · 구조 검증용' : ''}</p>
        <p className="text-sm">{p.careDays}일 관리 · {p.intervalDays}일마다 입력 · 질문 {p.questions.length}개</p>
        <details className="mt-2"><summary className="min-h-11 cursor-pointer">검토할 질문과 안내</summary>
          <p>{p.description}</p>
          <ul className="list-disc pl-5">{p.questions.map(q => <li key={q.id}>{q.label} · {kinds[q.kind]}{q.required ? ' · 필수' : ''}{q.kind==='single' ? ' · '+q.options.join(', ') : q.kind==='number' ? ' · '+q.min+'~'+q.max : ''}</li>)}</ul>
          {p.reviewInstructions && <p className="mt-2">담당자 확인 기준 · {p.reviewInstructions}</p>}
          {p.instructions && <p className="mt-2 whitespace-pre-wrap">{p.instructions}</p>}
          {p.approvalRef && <p className="mt-2 text-sm">검토 근거 {p.approvalRef} · {p.approvedAt?.slice(0,10)}</p>}
        </details>
        {role === 'hospital_admin' && <div className="flex flex-wrap gap-2">
          {p.state === 'draft' && <button className="secondary px-3" disabled={busy} onClick={()=>void transition(p,'review')}>의료진 검토 요청</button>}
          {p.state === 'approved' && <button className="secondary px-3" disabled={busy || !list?.assignmentEnabled} onClick={()=>void transition(p,'active')}>사용 시작</button>}
          {p.state === 'active' && <button className="secondary px-3" disabled={busy} onClick={()=>void transition(p,'stopped')}>새 환자 배정 중지</button>}
          <button className="secondary px-3" disabled={busy} onClick={()=>{setBase(p);setFormKey(value=>value+1);}}>이 버전으로 새 초안 작성</button>
        </div>}
        {role === 'doctor' && p.state === 'review' && <form className="mt-3 grid gap-2" onSubmit={e=>{e.preventDefault();void transition(p,'approved',new FormData(e.currentTarget));}}>
          <label>검토 근거 또는 문서번호<input name="approvalRef" maxLength={150} required className={control}/></label>
          <label className="flex min-h-12 items-center gap-2"><input type="checkbox" name="confirmed" required/>담당 진료과의 질문, 일정 및 안내문을 검토했습니다.</label>
          <button className="secondary px-3" disabled={busy}>의료진 검토 승인</button>
        </form>}
      </article>)}
    </div>
    {role === 'hospital_admin' && <ProgramDraft key={formKey} base={base} specialties={specialties} busy={busy} onCreate={create}/>}
  </section>;
}

function ProgramDraft({ base, specialties, busy, onCreate }: {
  base?:RecoveryProgram; specialties?:Department[]; busy:boolean;
  onCreate:(event:FormEvent<HTMLFormElement>,rows:QuestionRow[])=>Promise<void>;
}) {
  const [rows,setRows] = useState<QuestionRow[]>(base?.questions.map((question,index)=>({key:index+1,question})) || [{key:1}]);
  const [nextKey,setNextKey] = useState(rows.length+1);
  const choices = specialties?.length ? specialties : departments;
  return <details className="mt-4 border-t pt-3" open={base ? true : undefined}>
    <summary className="min-h-12 cursor-pointer font-bold">{base ? base.name + ' 새 버전 작성' : '새 회복 프로그램 작성'}</summary>
    <form className="grid gap-3" onSubmit={event=>void onCreate(event,rows)}>
      <label>프로그램명<input className={control} name="name" defaultValue={base?.name} required maxLength={100}/></label>
      <label>진료과<select className={control} name="department" defaultValue={base?.department || choices[0]}>{choices.map(d=><option key={d}>{d}</option>)}</select></label>
      <label>치료 유형<input className={control} name="treatment" defaultValue={base?.treatment} required maxLength={100}/></label>
      <label>설명<textarea className={control} name="description" defaultValue={base?.description} maxLength={400}/></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>관리기간 (일)<input type="number" className={control} name="careDays" min={1} max={365} required defaultValue={base?.careDays}/></label>
        <label>체크인 주기 (일)<input type="number" className={control} name="intervalDays" min={1} max={365} required defaultValue={base?.intervalDays || 1}/></label>
        <label>후속 확인 권장 간격 (일, 선택)<input type="number" className={control} name="followupDays" min={1} max={365} defaultValue={base?.followupDays ?? ''}/></label>
        <label>관리 종료 방식<select className={control} name="completion" defaultValue={base?.completion || 'end_on'}><option value="end_on">관리기간 종료</option><option value="staff">담당자 종료 처리</option></select></label>
      </div>
      <label>담당자 확인 기준 (수동 확인 안내)<textarea className={control} name="reviewInstructions" defaultValue={base?.reviewInstructions} maxLength={400}/></label>
      <label>병원 안내문<textarea className={control} name="instructions" defaultValue={base?.instructions} maxLength={800}/></label>
      {rows.map((row,index)=><QuestionEditor key={row.key} row={row} index={index} remove={rows.length>1 ? ()=>setRows(current=>current.filter(item=>item.key!==row.key)) : undefined}/>)}
      {rows.length<8 && <button type="button" className="secondary" onClick={()=>{setRows(current=>[...current,{key:nextKey}]);setNextKey(nextKey+1);}}>질문 추가</button>}
      <button className="primary" disabled={busy}>작성 버전 저장</button>
    </form>
  </details>;
}

function QuestionEditor({row,index,remove}:{row:QuestionRow;index:number;remove?:()=>void}) {
  const {key,question} = row;
  const [kind,setKind] = useState<QuestionKind>(question?.kind || 'single');
  return <fieldset className="grid gap-2 rounded-xl border p-3">
    <legend className="px-2 font-bold">질문 {index+1}</legend>
    <label>질문 문구<input className={control} name={key+'-label'} defaultValue={question?.label} required maxLength={180}/></label>
    <label>응답 형식<select className={control} name={key+'-kind'} value={kind} onChange={e=>setKind(e.target.value as QuestionKind)}>{Object.entries(kinds).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    {kind==='single' && <label>선택지 (한 줄에 하나)<textarea className={control} name={key+'-options'} required defaultValue={question?.kind==='single' ? question.options.join('\n') : ''}/></label>}
    {kind==='number' && <div className="grid grid-cols-2 gap-2">
      <label>입력 최솟값<input className={control} type="number" name={key+'-min'} required defaultValue={question?.kind==='number' ? question.min : ''}/></label>
      <label>입력 최댓값<input className={control} type="number" name={key+'-max'} required defaultValue={question?.kind==='number' ? question.max : ''}/></label>
    </div>}
    <label className="flex min-h-12 items-center gap-2"><input type="checkbox" name={key+'-required'} defaultChecked={question?.required ?? true}/>필수 응답</label>
    {remove && <button type="button" className="secondary" onClick={remove}>질문 삭제</button>}
  </fieldset>;
}
