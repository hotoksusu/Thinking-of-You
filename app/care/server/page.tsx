"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { careRequest, CareServerError } from '@/lib/care-server';
import { type CareState, type Patient, type CheckIn } from '@/lib/care-mvp';
import { RecordFacts,painSummary } from '@/components/patient-history';
import { ServerOperations,PilotManagement } from '@/components/server-operations';
type StaffState = {
    state: CareState;
    admin: boolean;
    email: string;
    roles: Record<string,string>;
    catalog: {id:string;name:string}[];
};
export default function ServerCare() {
    const [data, setData] = useState<StaffState | null>(null), [message, setMessage] = useState(''), [pending, setPending] = useState(false), [hospitalId, setHospitalId] = useState(''), [selected, setSelected] = useState(''), [invite, setInvite] = useState<{
        id: string;
        url: string;
        expiresAt: string;
    } | null>(null), [confirmed, setConfirmed] = useState(false), [imports, setImports] = useState<{
        patient: Patient;
        records: CheckIn[];
    }[]>([]), [report, setReport] = useState(false), [loginNeeded, setLoginNeeded] = useState(false);
    async function refresh() { try {
        const next = await careRequest<StaffState>('staff/state');
        setData(next);
        setLoginNeeded(false);
        setHospitalId(current => current || next.state.hospitals[0]?.id || next.catalog?.[0]?.id || '');
        setMessage('');
    }
    catch (e) {
        setLoginNeeded(e instanceof CareServerError && e.status === 401);
        setMessage(e instanceof CareServerError && e.status === 401 ? 'ChatGPT로 로그인한 뒤 등록된 병원 권한을 확인합니다.' : e instanceof CareServerError && e.status === 403 ? '이 계정에는 서버 병원 관리 권한이 없습니다. 사이트 운영자에게 권한 등록을 요청해주세요.' : '서버 연결 또는 초기 설정을 확인해주세요. 아직 서버 저장을 사용할 수 없습니다.');
    } }
    useEffect(() => { void refresh(); }, []);
    async function perform(action: () => Promise<unknown>, success: string) { if (pending)
        return; setPending(true); try {
        await action();
        await refresh();
        setMessage(success);
    }
    catch (e) {
        const code=e instanceof CareServerError?e.code:'';
            if(e instanceof CareServerError&&e.status===401){setData(null);setLoginNeeded(true);}
            const messages:Record<string,string>={INVALID_PATIENT:'환자 이름·연락처·연령·날짜를 확인해주세요.',INVALID_IMPORTED_RECORD:'기존 자료의 날짜나 점수 형식을 확인해주세요. 원본은 변경하지 않았습니다.',INVALID_EMAIL:'담당자의 로그인 이메일을 확인해주세요.',REAL_DATA_CONFIRMATION_REQUIRED:'실제 운영 자료와 등록 권한을 먼저 확인해주세요.',HOSPITAL_ACCESS_DENIED:'이 병원에 접근할 권한이 없습니다.',STAFF_ACCESS_DENIED:'담당자 접근 권한을 확인해주세요.',STAFF_SIGN_IN_REQUIRED:'로그인 연결이 만료됐어요. 다시 로그인해주세요.',SERVER_NOT_CONFIGURED:'서버 초기 설정이 아직 완료되지 않았어요.'};
            setMessage(messages[code]||'처리하지 못했어요. 연결 상태와 입력 내용을 확인한 뒤 다시 시도해주세요.');
    }
    finally {
        setPending(false);
    } }
    const state = data?.state, patients = state?.patients.filter(p => p.hospitalId === hospitalId) || [], patient = patients.find(p => p.id === selected);
    return <main className="care-ui min-h-screen p-5"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-center justify-between gap-3"><Link href="/hospital/dashboard" className="inline-flex min-h-12 items-center font-bold text-[#315D50]">← 기존 병원 화면</Link><p className="care-kicker">서버 연계 회복관리</p></header><h1 className="mt-4 text-3xl font-black">병원과 환자 연결</h1><p className="care-subtext mt-3">서버에서 검증한 계정만 등록·발급·조회할 수 있어요. 테스트 데이터는 자동으로 생성하지 않습니다.</p>{message ? <p role="status" className="mt-4 rounded-xl bg-white p-4 leading-7">{message}</p> : null}{!data ? loginNeeded ? <a target="_top" href="/signin-with-chatgpt?return_to=%2Fcare%2Fserver" className="primary">ChatGPT로 병원 담당자 로그인</a> : <button onClick={() => void refresh()} className="secondary w-full">서버 연결 다시 확인</button> : <><p className="mt-4 text-sm text-[#58665E]">연결된 계정 · {data.email}</p><a target="_top" href="/signout-with-chatgpt?return_to=%2Fcare%2Fserver" className="inline-flex min-h-12 items-center underline">병원 계정 로그아웃</a>
 {data.admin ? <details className="care-surface mt-5 p-5"><summary className="min-h-11 cursor-pointer font-bold">실제 병원 등록</summary><form onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void perform(() => careRequest('staff/hospitals', 'POST', Object.fromEntries(form)), '병원을 서버에 등록했어요.'); }} className="mt-3 grid gap-3">{[['name', '병원명'], ['phone', '대표전화'], ['openingHours', '진료시간'], ['address', '주소']].map(([name, label]) => <label key={name} className="text-sm font-bold">{label}<input required={name === 'name'} name={name} maxLength={name === 'openingHours' ? 300 : 200} className="mt-1 min-h-12 w-full rounded-xl border p-3"/></label>)}<button disabled={pending} className="primary">병원 정보 저장</button></form></details> : null}
 <label className="mt-5 block font-bold">관리할 병원<select value={hospitalId} onChange={e => { setHospitalId(e.target.value); setSelected(''); setInvite(null); }} className="mt-2 min-h-12 w-full rounded-xl border bg-white p-3"><option value="">병원을 선택해주세요</option>{[...(state?.hospitals||[]),...(data.catalog||[]).filter(h=>!state?.hospitals.some(x=>x.id===h.id))].map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
 {data.admin?<><p className="mt-3 text-sm">플랫폼 운영자에게 환자 열람권한은 기본 부여되지 않습니다. 병원 관리자가 별도로 승인한 역할만 적용됩니다.</p><PilotManagement/></>:null}{hospitalId ? <>{data.roles?.[hospitalId]?<ServerOperations key={hospitalId} hospitalId={hospitalId} role={data.roles[hospitalId]} onChanged={()=>void refresh()}/>:null}{data.roles?.[hospitalId]==='hospital_admin'?<><details className="care-surface mt-5 p-5"><summary className="min-h-11 cursor-pointer font-bold">실제 환자 등록</summary><form onSubmit={e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); void perform(() => careRequest('staff/patients', 'POST', { hospitalId, patient: f, confirmed: f.confirmed === 'on' }), '환자를 서버에 등록했어요.'); }} className="mt-3 grid gap-3">{[['name', '환자 이름', 'text'], ['phone', '연락처', 'tel'], ['age', '연령', 'number'], ['dischargeDate', '퇴원일', 'date'], ['surgeryDate', '수술일 (선택)', 'date'], ['nextAppointment', '다음 진료일 (선택)', 'date']].map(([name, label, type]) => <label key={name} className="text-sm font-bold">{label}<input required={['name', 'phone', 'age', 'dischargeDate'].includes(name)} name={name} type={type} min={type === 'number' ? 0 : undefined} max={type === 'number' ? 130 : undefined} className="mt-1 min-h-12 w-full rounded-xl border p-3"/></label>)}<label className="text-sm font-bold">치료 구분<select name="surgeryType" className="mt-1 min-h-12 w-full rounded-xl border bg-white p-3">{['인공관절', '척추', '골절', '기타'].map(v => <option key={v}>{v}</option>)}</select></label><label className="flex min-h-12 items-start gap-3 text-sm leading-7"><input required type="checkbox" name="confirmed" className="mt-1 size-5"/>실제 운영 환자이며, 병원에서 회복관리 대상과 개인정보 이용 근거를 확인했습니다.</label><button disabled={pending} className="primary">서버에 환자 등록</button></form></details>
 <details className="mt-4 border-b pb-4"><summary className="min-h-11 cursor-pointer font-bold">이 기기의 기존 기록을 선택해 가져오기</summary><p className="care-subtext mt-2">원본은 그대로 보존합니다. 실제 운영 데이터인지 직접 확인한 환자만 서버로 복사해주세요.</p><button className="secondary w-full" onClick={() => { try {
                const raw = localStorage.getItem('oneul-anbu:care-mvp:v1');
                if (!raw) {
                    setMessage('이 기기에 저장된 운영 기록이 없어요.');
                    return;
                }
                const local = JSON.parse(raw) as CareState;
                setImports(local.patients.map(p => ({ patient: p, records: local.checkIns.filter(c => c.patientId === p.id) })));
            }
            catch {
                setMessage('기존 기록을 읽지 못했어요. 원본은 변경하지 않았습니다.');
            } }}>기존 기기 기록 확인</button>{imports.map(item => <div key={item.patient.id} className="mt-3 border-t pt-3"><p className="font-bold">{item.patient.name} · {item.records.length}개 기록</p><details className="mt-2"><summary className="min-h-11 cursor-pointer text-sm">가져올 기록 확인</summary><pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(item, null, 2)}</pre></details><button disabled={!confirmed || pending} className="secondary w-full" onClick={() => void perform(() => careRequest('staff/patients', 'POST', { hospitalId, ...item, sourceRef: `legacy:${item.patient.hospitalId}:${item.patient.id}`, confirmed: true }), '선택한 환자와 기록을 서버로 복사했어요. 원본은 유지했습니다.')}>이 환자 기록 복사</button></div>)}{imports.length ? <label className="mt-3 flex min-h-12 items-start gap-3 text-sm leading-7"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 size-5"/>실제 운영 데이터와 가져올 기록 내용을 확인했고, 이 병원으로 복사할 권한이 있습니다.</label> : null}</details>
 </>:null}{data.admin ? <details className="mt-4 border-b pb-4"><summary className="min-h-11 cursor-pointer font-bold">병원 담당자 접근 권한 등록</summary><form onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void perform(() => careRequest('staff/members', 'POST', { hospitalId, email: form.get('email'),role:form.get('role') }), '담당자 권한을 등록했어요.'); }}><label className="mt-2 block text-sm">담당자의 ChatGPT 로그인 이메일<input required type="email" name="email" className="mt-1 min-h-12 w-full rounded-xl border p-3"/></label><label>역할<select name="role" className="ml-2 min-h-12 rounded border p-2"><option value="hospital_admin">병원 관리자</option><option value="doctor">의사</option><option value="nurse">담당 직원</option></select></label><button disabled={pending} className="secondary w-full">이 병원 접근 허용</button><p className="mt-2 text-sm">운영자 본인에게 최초 병원 권한을 직접 부여할 수 없습니다. 승인된 병원 관리자가 별도로 등록해야 합니다.</p></form></details> : null}
 <section className="mt-6"><h2 className="text-xl font-bold">서버 연계 환자 · {patients.length}명</h2><div className="mt-3 flex flex-wrap gap-2">{patients.map(p => <button key={p.id} aria-pressed={selected === p.id} onClick={() => { setSelected(p.id); setInvite(null); }} className="min-h-12 rounded-xl border bg-white px-4 font-bold">{p.name}</button>)}</div>{patient ? <><button disabled={pending} className="primary" onClick={() => void perform(async () => { setInvite(await careRequest('staff/invitations', 'POST', { hospitalId, patientId: patient.id })); }, '새 링크를 발급했어요. 환자에게 보낼 내용을 직접 확인해주세요.')}>이 환자의 서버 안내 링크 발급</button>{invite ? <div className="mt-3 rounded-xl bg-white p-4"><p className="break-all text-sm">{invite.url}</p><p className="mt-2 text-xs">만료: {invite.expiresAt} · 자동으로 문자나 메시지를 전송하지 않습니다.</p><button className="secondary w-full" onClick={async () => { try {
                await navigator.clipboard.writeText(invite.url);
                setMessage('안내 링크를 복사했어요.');
            }
            catch {
                setMessage('복사하지 못했어요. 위 링크를 직접 선택해주세요.');
            } }}>확인한 링크 복사</button><button disabled={pending} className="mt-2 min-h-12 text-sm font-bold text-[#803F2D]" onClick={() => void perform(async () => { await careRequest('staff/invitations', 'DELETE', { id: invite.id }); setInvite(null); }, '이 링크와 연결된 서버 세션의 접근을 취소했어요.')}>이 링크 접근 취소</button></div> : null}<section className="care-surface mt-5 p-5"><h3 className="text-lg font-bold">이 환자의 서버 기록</h3>{state!.checkIns.some(c=>c.patientId===patient.id)?<div className="mt-3">{state!.checkIns.filter(c=>c.patientId===patient.id).sort((a,b)=>b.date.localeCompare(a.date)).map(c=><details key={c.id} className="border-b py-2"><summary className="flex min-h-12 cursor-pointer flex-wrap items-center justify-between gap-2 font-bold"><span>{c.date}</span><span className="text-sm text-[#58665E]">{painSummary(c)}</span></summary><div className="py-3"><RecordFacts record={c}/></div></details>)}</div>:<p className="care-subtext mt-3">아직 환자가 서버에 남긴 기록이 없어요. 발급한 안내 링크로 환자가 직접 기록할 수 있습니다.</p>}</section></> : null}</section></> : <p className="care-subtext mt-4">아직 등록된 병원이 없어요. 사이트 운영자가 실제 병원을 먼저 등록해주세요.</p>}</>}
 </div></main>;
}
