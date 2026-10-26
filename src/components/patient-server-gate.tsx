"use client";
import {useCareDay} from "@/hooks/use-care-day";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {PatientCareEnded,patientCareStage} from '@/components/patient-care-ended';
import { PatientHome } from '@/components/patient-home';
import { PatientHistory, RecordFacts } from '@/components/patient-history';
import { PatientHospitalGuide } from '@/components/patient-hospital-guide';
import { PatientError, type PatientErrorType } from '@/components/patient-error';
import { PatientPreviewLoading } from '@/components/patient-preview-loading';
import { PatientLink, usePatientNavigation } from '@/components/patient-navigation';
import { AdaptiveCheckin, PatientShell } from '@/components/patient-care-mvp';
import { careRequest, CareServerError, optionalServerState, saveServerCheck, serverSessionKnown } from '@/lib/care-server';
import { getPatientSession, inspectPatientInvitation } from '@/lib/demo-auth';
import { type CareState } from '@/lib/care-mvp';
type Mode = 'home' | 'onboarding' | 'checkin' | 'history' | 'hospital';
type Invitation = {
    patientName?: string;
    hospitalName: string;
    patientId: string;
    hospitalId: string;
};
export function PatientServerGate({ mode, demo, children }: {
    mode: Mode;
    demo: boolean;
    children: React.ReactNode;
}) {
    const TODAY=useCareDay();
    const params = useSearchParams(), nav = usePatientNavigation(), token = params.get('token'), routeKey = params.toString();
    const [view, setView] = useState<'loading' | 'legacy' | 'server' | 'invite'>(demo ? 'legacy' : 'loading'), [state, setState] = useState<CareState | null>(null), [invite, setInvite] = useState<Invitation | null>(null), [error, setError] = useState<PatientErrorType | null>(null), [retry, setRetry] = useState(0), [confirmed, setConfirmed] = useState(false), [saving, setSaving] = useState(false), [connectError, setConnectError] = useState('');
    useEffect(() => { let alive = true; if (demo) {
        setView('legacy');
        return;
    } setError(null); setView('loading'); (async () => { try {
        if (token?.startsWith('srv_')) {
            const i = await careRequest<Invitation>('invitation', 'POST', { token });
            const current = await optionalServerState();
            if (!alive)
                return;
            if (current?.patients[0]?.id === i.patientId && current.patients[0].hospitalId === i.hospitalId) {
                localStorage.setItem('oneul-anbu:care-auth-source', 'server');
                sessionStorage.setItem('oneul-anbu:server-connected', '1');
                location.replace('/app/patient');
                return;
            }
            setInvite(i);
            setView('invite');
            return;
        }
        if (mode === 'onboarding') {
            if(token&&inspectPatientInvitation(token).invitation){try{await careRequest('disconnect','POST',{});}catch(e){if(!(e instanceof CareServerError&&e.status===404))throw e;}const old=inspectPatientInvitation(token).invitation,current=getPatientSession();if(old&&current?.patientId===old.patientId&&current.hospitalId===old.hospitalId){localStorage.setItem('oneul-anbu:care-auth-source','legacy');sessionStorage.removeItem('oneul-anbu:server-connected');}}
            if (alive)
                setView('legacy');
            return;
        }
        if (localStorage.getItem('oneul-anbu:care-auth-source') === 'legacy' && getPatientSession()) {
            if (alive)
                setView('legacy');
            return;
        }
        const current = await optionalServerState();
        if (!alive)
            return;
        if (current) {
            setState(current);
            setView('server');
            sessionStorage.setItem('oneul-anbu:server-connected', '1');
        }
        else if (serverSessionKnown() || localStorage.getItem('oneul-anbu:care-auth-source')==='server') {
            setError('sessionExpired');
        }
        else
            setView('legacy');
    }
    catch (e) {
        if (!alive)
            return;
        setError(e instanceof CareServerError && e.code === 'CARE_COMPLETED' ? 'completedCare' : e instanceof CareServerError && e.code === 'EXPIRED_INVITATION' ? 'expiredInvite' : e instanceof CareServerError && e.code === 'INVALID_INVITATION' ? 'invalidInvite' : 'networkError');
    } })(); return () => { alive = false; }; }, [demo, mode, token, routeKey, retry, TODAY]);
    if (error)
        return <PatientError type={error} retry={() => setRetry(v => v + 1)}/>;
    if (view === 'loading')
        return <PatientPreviewLoading demo={demo}/>;
    if (view === 'legacy')
        return <>{children}</>;
    if (view === 'invite' && invite)
        return <PatientShell demo={false} hideNav><section className="care-surface my-6 p-6"><p className="care-kicker">{invite.hospitalName} · 회복 기록</p><h1 className="mt-4 text-3xl font-black">퇴원 후 회복 상태를<br />병원에 알려주세요.</h1><p className="care-subtext mt-4">본인의 안내 링크인지 확인해주세요. 기록은 연결된 병원 담당자가 회복 변화를 확인할 때 참고할 수 있습니다.</p><p className="care-subtext mt-3">실시간 응급 대응 서비스가 아닙니다. 급한 도움이 필요하면 병원 또는 119에 연락해주세요.</p><label className="mt-4 flex min-h-14 items-start gap-3 rounded-xl bg-[#F7F5EF] p-4 text-base leading-7"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 size-5 shrink-0"/>본인에게 발급된 링크임을 확인했고, 연결된 병원의 회복관리 기록 이용 안내를 확인했습니다.</label>{connectError ? <p role="alert" className="mt-3 text-[#803F2D]">{connectError}</p> : null}<button disabled={!confirmed || saving} className="primary" onClick={async () => { setSaving(true); setConnectError(''); try {
            await careRequest('connect', 'POST', { token, confirmed: true });
            sessionStorage.setItem('oneul-anbu:server-connected', '1');
            localStorage.setItem('oneul-anbu:care-auth-source', 'server');
            location.replace('/app/patient');
        }
        catch(e) {
            if(e instanceof CareServerError&&e.code==='CARE_COMPLETED')setError('completedCare');if(e instanceof CareServerError&&['EXPIRED_INVITATION','INVALID_INVITATION'].includes(e.code))setError(e.code==='EXPIRED_INVITATION'?'expiredInvite':'invalidInvite');
            setConnectError('연결하지 못했어요. 링크가 만료되지 않았는지 확인하고 다시 시도해주세요.');
            setSaving(false);
        } }}>{saving ? '연결 확인 중…' : '내 기록으로 연결하기'}</button><PatientLink href="/care/privacy" className="mt-3 inline-flex min-h-11 items-center text-sm underline">개인정보 안내</PatientLink></section></PatientShell>;
    if (!state?.patients[0])
        return <PatientError type="missingPatient" retry={() => setRetry(v => v + 1)}/>;
    const patient = state.patients[0], hospital = state.hospitals.find(h => h.id === patient.hospitalId), checks = state.checkIns.filter(c => c.patientId === patient.id).sort((a, b) => b.date.localeCompare(a.date));
    if((mode==='home'||mode==='checkin')&&patientCareStage(patient)==='completedCare')return <PatientShell demo={false} careStage="completedCare"><PatientCareEnded patient={patient} state={state}/></PatientShell>;
    if (mode === 'checkin')
        return <AdaptiveCheckin key={(params.get('edit') || 'new') + ':' + (checks.find(c => c.date === TODAY)?.updatedAt || 'pending')} patient={patient} todayCheck={checks.find(c => c.date === TODAY)} history={checks} guardianMode={params.get('proxy') === 'guardian'} demo={false} edit={params.get('edit') === '1'} serverState={state} serverSave={(check, edit, existing) => saveServerCheck(check, edit, existing)}/>;
    if (mode === 'hospital')
        return <PatientShell demo={false} active="hospital" backLabel="오늘"><PatientHospitalGuide patient={patient} hospital={hospital} records={checks}/></PatientShell>;
    if (mode === 'history') {
        const record = checks.find(c => c.id === params.get('recordId'));
        return <PatientShell demo={false} active="history" backLabel="오늘">{record ? <section className="care-surface my-5 p-5"><h1 className="mb-5 text-2xl font-black">{record.date} 기록</h1><RecordFacts record={record}/>{record.date === TODAY ? <PatientLink href={nav.href('checkin', { edit: '1' })} className="secondary">오늘 기록 수정하기</PatientLink> : null}</section> : <PatientHistory patient={patient} state={state}/>}</PatientShell>;
    }
    return <PatientShell demo={false}><p className="pt-4 text-sm text-[#58665E]">서버와 연결된 나의 회복 기록</p><p className="mt-2 text-sm leading-6">실시간 응급 모니터링이 아닙니다. 기록 저장은 의료진 확인 완료를 의미하지 않습니다.<br/>병원 확인 시간: {hospital?.openingHours || "병원에 확인해주세요"} · 급한 도움이 필요하면 병원 또는 119에 연락해주세요.</p><PatientHome patient={patient} state={state} today={TODAY} demo={false} server/><details className="my-5 border-t py-3"><summary className="min-h-12 cursor-pointer text-sm">이 기기 연결 관리</summary><button className="secondary" onClick={async()=>{try{await careRequest("disconnect","POST");sessionStorage.removeItem("oneul-anbu:server-connected");localStorage.removeItem("oneul-anbu:care-auth-source");location.assign("/patient");}catch{setError("networkError");}}}>이 기기의 환자 연결 종료</button><p className="mt-2 text-sm">서버의 회복 기록은 삭제하지 않습니다. 다시 이용하려면 병원 안내 링크를 열어주세요.</p></details></PatientShell>;
}
