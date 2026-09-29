"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PatientLink as Link, PatientNavigation, PatientBack, usePatientNavigation } from "@/components/patient-navigation";
import { PatientError, type PatientErrorType } from "@/components/patient-error";
import {
  Activity,
  ArrowLeft,
  Check,
  House,
  Hospital,
  ShieldCheck,
} from "lucide-react";
import {
  comparisonLabels,
  daysSince,
  demoPainBucket,
  loadCareState,
  loadPublicDemoCareState,
  painValue,
  saveCareState,
  savePublicDemoCareState,
  TODAY,
  type CareState,
  type CheckIn,
  type DayComparison,
  type Patient,
  type PatientStatus,
} from "@/lib/care-mvp";
import { prioritizationProvider } from "@/services/prioritization";
import { trackCareEvent } from "@/lib/care-analytics";
import {
  getPatientSession,
  inspectPatientSession,
  inspectPatientInvitation,
  verifyPatientIdentity,
} from "@/lib/demo-auth";
import { PatientHospitalGuide } from "@/components/patient-hospital-guide";
import { PatientHistory, RecordFacts } from "@/components/patient-history";
import { PatientHome } from "@/components/patient-home";

import { PatientPreviewLoading } from "@/components/patient-preview-loading";

import { PatientCareEnded, patientCareStage, type CareStage } from "@/components/patient-care-ended";

type Mode = "home" | "onboarding" | "checkin" | "history" | "hospital";
export function PatientCareMvp({ mode, demo = false }: { mode: Mode; demo?: boolean }) {
  return <Suspense fallback={<PatientPreviewLoading demo={demo}/>}><PatientNavigation><PatientCareContent mode={mode} demo={demo}/></PatientNavigation></Suspense>;
}
function PatientCareContent({ mode, demo }: { mode: Mode; demo: boolean }) {
  const params = useSearchParams(), nav = usePatientNavigation();
  const token = params.get("token"), demoPatientId = demo ? params.get("patientId") || "patient_001" : null;
  const [error, setError] = useState<PatientErrorType | null>(null), [retry, setRetry] = useState(0);
  const [state, setState] = useState<CareState | null>(null),
    [patient, setPatient] = useState<Patient | null>(null),
    [onboardStep, setOnboardStep] = useState(0),
    [guardianMode, setGuardianMode] = useState(false);
  useEffect(() => {
    setError(null); setState(null); setPatient(null);
    try {
    // Demo never reads or changes actual patient authentication.
    const access = demo ? null : inspectPatientSession();
    const invite = !demo && token ? inspectPatientInvitation(token) : null;
    if (!demo && token && !invite?.invitation) {setError(invite?.error || "invalidInvite");return;}
    if (!demo && mode !== "onboarding" && (!access?.session || (invite?.invitation && (invite.invitation.patientId!==access.session.patientId || invite.invitation.hospitalId!==access.session.hospitalId)))) {
      if (invite?.invitation) {location.replace(`/i?token=${encodeURIComponent(token!)}`);return;}
      setError(access?.error || "missingSession");return;
    }
    if (!demo && mode === "onboarding" && !invite?.invitation) {setError("invalidInvite");return;}
    const raw = localStorage.getItem(demo ? "oneul-anbu:public-demo:care-mvp:v5" : "oneul-anbu:care-mvp:v1");
    if(raw){const parsed=JSON.parse(raw);if(!parsed || !["patients","hospitals","checkIns","statuses","followUps"].every(key=>Array.isArray(parsed[key]))) {setError("storageError");return;}}
    const next = demo ? loadPublicDemoCareState() : loadCareState(),
      invitation = invite?.invitation,
      session = access?.session;
    if (!demo && mode === "onboarding" && invitation && session?.patientId === invitation.patientId && session.hospitalId === invitation.hospitalId) {
      location.replace("/app/patient");
      return;
    }
    setGuardianMode(mode === "checkin" && params.get("proxy") === "guardian");
    const id = demo ? demoPatientId : mode === "onboarding" ? invitation?.patientId : session?.patientId;
    const found = next.patients.find(
      (p) =>
        p.id === id &&
        (demo || (mode === "onboarding" && p.hospitalId === invitation?.hospitalId) ||
          (mode !== "onboarding" && p.hospitalId === session?.hospitalId)),
    );
    setState(next);
    setPatient(found || null);
    if (!found) setError("missingPatient");
    if (mode === "onboarding" && found){
      trackCareEvent("invite_opened", { patientId: found.id, hospitalId: found.hospitalId });trackCareEvent("registration_started", { patientId: found.id, hospitalId: found.hospitalId });trackCareEvent("patient_onboarding_started", { patientId: found.id });
    }
    if (mode === "checkin" && found)
      trackCareEvent("checkin_started", { patientId: found.id, hospitalId: found.hospitalId, demo });
    } catch { setError("storageError"); }
  }, [mode, demo, token, demoPatientId, params, retry]);
  useEffect(() => {
    if(demo || mode==="onboarding")return;
    const revalidate=()=>{const access=inspectPatientSession();if(access.error)setError(access.error);};
    const access=inspectPatientSession();
    const timer=access.session?window.setTimeout(revalidate,Math.min(2147483647,Math.max(0,Date.parse(access.session.expiresAt)-Date.now()+10))):undefined;
    const storage=(event:StorageEvent)=>{if(event.key===null||event.key==="oneul-anbu:demo:patient-session")setRetry(v=>v+1);};
    window.addEventListener("focus",revalidate);window.addEventListener("storage",storage);
    return ()=>{window.clearTimeout(timer);window.removeEventListener("focus",revalidate);window.removeEventListener("storage",storage);};
  },[demo,mode,retry]);
  const hospital = state?.hospitals.find((h) => h.id === patient?.hospitalId);
  const todayCheck = state?.checkIns.find(
    (c) => c.patientId === patient?.id && c.date === TODAY,
  );
  const history = useMemo(
    () =>
      state?.checkIns
        .filter((c) => c.patientId === patient?.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) || [],
    [state, patient],
  );

  if (error) return <PatientError type={error} retry={()=>setRetry(v=>v+1)}/>;
  if ((!state || !patient) && mode === "home") return <PatientPreviewLoading demo={demo}/>;
  if (!state || !patient)
    return (
      <PatientShell demo={demo} careStage={patientCareStage(patient)} active={mode === "history" ? "history" : mode === "hospital" ? "hospital" : "home"} backLabel={mode === "home" ? undefined : "이전 화면"} hideNav>
        <p className="py-24 text-center text-lg font-bold">
          정보를 불러오고 있어요.
        </p>
      </PatientShell>
    );
  if (mode === "home" && patientCareStage(patient) === "completedCare") return <PatientShell demo={demo} careStage={patientCareStage(patient)}><PatientCareEnded patient={patient} state={state}/></PatientShell>;
  if (mode === "onboarding") {
    if (onboardStep === 0)
      return (
        <PatientShell demo={demo} careStage={patientCareStage(patient)} hideNav backLabel="이전 화면" backFallback="/patient">
          <div className="py-10">
            <Hospital className="text-[#315E50]" size={42} />
            <p className="mt-5 text-lg font-black text-[#315E50]">
              {hospital?.name}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight">
              {hospital?.name}에서 보내드린 회복관리입니다.
            </h1>
            <div className="mt-8 rounded-3xl bg-white p-6">
              <p className="text-xl font-black">{patient.name}님 맞으신가요?</p>
              <p className="mt-2 text-lg text-[#617069]">
                수술 후 회복 상태를 매일 간단하게 알려주세요. 입력한 내용은 병원에서 확인합니다.
              </p>
            </div>
            <button onClick={() => setOnboardStep(1)} className="primary">
              오늘 상태 알려주기 →
            </button>
            <p className="mt-3 text-base font-bold text-[#617069]">약 1분 정도 걸려요 · 병원 의료진이 확인합니다.</p>
          </div>
        </PatientShell>
      );
    return (
      <PatientShell demo={demo} careStage={patientCareStage(patient)} hideNav backLabel="이전 화면" onBack={()=>setOnboardStep(0)}>
        <div className="py-10">
          <ShieldCheck className="text-[#315E50]" size={44} />
          <h1 className="mt-5 text-3xl font-black">
            매일 오래 입력하지 않아도 됩니다.
          </h1>
          <ul className="mt-7 space-y-4 text-lg font-bold leading-8">
            <li>✓ 하루 한 번 간단히 확인합니다.</li>
            <li>✓ 회복 상태를 병원과 함께 확인할 수 있습니다.</li>
            <li>✓ 전화·문자 내용이나 개인 사진을 확인하지 않습니다.</li>
          </ul>
          <p className="mt-6 rounded-2xl bg-white p-4 text-base font-bold leading-7 text-[#596A62]">오늘안부 Care는 회복 기록을 병원과 공유하는 데 도움을 주는 서비스이며 실시간 응급 대응 서비스는 아닙니다. 갑작스러운 심한 증상은 병원 또는 응급의료기관에 직접 연락해주세요.</p>
          <button
            onClick={() => {
              try {
              const token = new URLSearchParams(location.search).get("token");
              if (!token || !verifyPatientIdentity(token)) {
                setError("invalidInvite");
                return;
              }
              const next = {
                ...state,
                patients: state.patients.map((p) =>
                  p.id === patient.id
                    ? { ...p, status: "onboarded" as const }
                    : p,
                ),
              };
              saveCareState(next);
              trackCareEvent("patient_onboarding_completed", {
                patientId: patient.id,
              });
              trackCareEvent("registration_completed", {patientId:patient.id,hospitalId:patient.hospitalId});
              location.replace("/app/patient");
              } catch { setError("storageError"); }
            }}
            className="primary"
          >
            오늘 상태 입력하기
          </button>
        </div>
      </PatientShell>
    );
  }
  if ((mode as Mode) === "checkin") {
    return <AdaptiveCheckin key={`${patient.id}:${params.get("edit")}:${params.get("revision")}`} patient={patient} todayCheck={todayCheck} history={history} guardianMode={guardianMode} demo={demo} edit={params.get("edit")==="1"} />;
  }
  if (mode === "hospital") return <PatientShell demo={demo} careStage={patientCareStage(patient)} active="hospital" backLabel="오늘"><PatientHospitalGuide hospital={hospital} patient={patient}/></PatientShell>;
  if (mode === "history" && params.get("recordId")) {
    const record = history.find(c=>c.id===params.get("recordId"));
    return <PatientShell demo={demo} careStage={patientCareStage(patient)} active="history" backLabel="회복 기록" backFallback={nav.href("history")}>
      <section className="mt-6 rounded-3xl bg-white p-6"><h1 className="text-3xl font-black">{record ? record.date.replaceAll("-",".")+" 기록" : "기록을 찾을 수 없어요."}</h1>
      {record ? <><div className="mt-5"><RecordFacts record={record}/><p className="mt-4 text-base leading-7 text-[#40554A]">통증은 0~10점 중 높을수록 심한 점수예요.</p></div><p className="mt-4 text-lg font-bold text-[#315E50]">✓ 기록 저장 완료</p>{record.date===TODAY ? <Link href={nav.href("checkin",{edit:"1"})} className="secondary">오늘 기록 수정하기</Link> : null}</> : <Link href={nav.href("history")} className="primary">회복 기록으로 돌아가기</Link>}
      </section></PatientShell>;
  }
  if (mode === "history") return <PatientShell demo={demo} careStage={patientCareStage(patient)} active="history" backLabel="오늘"><PatientHistory key={patient.id} patient={patient} state={state}/></PatientShell>;
  return <PatientShell demo={demo} careStage={patientCareStage(patient)}><PatientHome patient={patient} state={state} today={TODAY} demo={demo}/></PatientShell>;
}

type AdaptiveStep = "pain" | "painContext" | "mobility" | "movement" | "comparison" | "concern" | "complete";
const adaptiveConcerns = [
  ["none", "새롭게 불편해진 점은 없어요"],
  ["swelling", "붓기가 어제보다 더 생겼어요"],
  ["fever", "수술 부위가 평소보다 뜨거워요"],
  ["incision_discomfort", "상처가 더 빨갛거나 진물이 보여요"],
  ["sleep", "통증 때문에 잠을 자주 깼어요"],
  ["other", "기타"],
] as const;
const recoveryMobilityLabels = ["어제보다 편해요", "어제와 비슷해요", "어제보다 불편해요"];
const painContextLabels = [["rest","가만히 있을 때"],["moving","움직일 때"],["walking","걸을 때"],["night","밤에 잘 때"],["constant","계속 아픔"],["unsure","잘 모르겠어요"]] as const;
function pathwayMovementLabels(patient: Patient) {
  const part = `${patient.bodyPart || ""} ${patient.procedureDetail || ""}`;
  if (part.includes("어깨")) return ["팔 올리기", "옷 입기", "밤에 자세 바꾸기", "보조기 착용", "기타"];
  if (part.includes("고관절")) return ["걷기", "앉았다 일어나기", "체중 싣기", "넘어질 뻔함", "기타"];
  if (part.includes("척추")) return ["일어나기", "걷기", "앉아 있기", "자세 바꾸기", "기타"];
  return ["일어나기", "걷기", "계단", "무릎 굽히기", "앉았다 일어나기", "기타"];
}

function AdaptiveCheckin({ patient, todayCheck, history, guardianMode, demo, edit = false }: { patient: Patient; todayCheck?: CheckIn; history: CheckIn[]; guardianMode: boolean; demo: boolean; edit?: boolean }) {
  const nav = usePatientNavigation();
  const [saveError, setSaveError] = useState("");
  const [startedAt] = useState(() => new Date().toISOString());
  const [step, setStep] = useState<AdaptiveStep>("pain");
  const [dayComparison, setDayComparison] = useState<DayComparison | null>(edit ? todayCheck?.dayComparison || null : null);
  const [concern, setConcern] = useState<(typeof adaptiveConcerns)[number][0] | null>(edit && todayCheck ? adaptiveConcerns.find(([id])=>id===todayCheck.concerns?.[0])?.[0] || (todayCheck.hasConcern ? "other" : "none") : null);
  const [customConcern, setCustomConcern] = useState(edit ? todayCheck?.customConcern || todayCheck?.concernText || "" : "");
  const [painScore, setPainScore] = useState<number | null>(edit && todayCheck ? painValue(todayCheck) : null);
  const [painContext, setPainContext] = useState<CheckIn["painContext"]>(edit ? todayCheck?.painContext : undefined);
  const [mobility, setMobility] = useState<number | null>(edit && todayCheck ? todayCheck.mobilityScore ?? todayCheck.mobility : null);
  const [movementDifficulty, setMovementDifficulty] = useState(edit ? todayCheck?.movementDifficulty || "" : "");
  const [savedCheck, setSavedCheck] = useState<CheckIn | null>(edit ? null : todayCheck || null);
  const [isSaving,setIsSaving]=useState(false),submitLock=useRef(false);

  const currentCheck = savedCheck || (!edit ? todayCheck : null);
  if (currentCheck || step === "complete") {
    const comparison = currentCheck?.dayComparison || dayComparison || "same", previous = history.find(item => item.id !== currentCheck?.id), currentPain = currentCheck ? painValue(currentCheck) : painScore, streak = Math.min(7, history.length + (todayCheck ? 0 : 1));
    return <PatientShell demo={demo} careStage={patientCareStage(patient)}><div className="py-10 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#DDEDE3] text-[#315E50]"><Check size={42} /></span><h1 className="mt-6 text-[2rem] font-black leading-tight">오늘 회복 기록을 남겼어요</h1>{currentCheck?.source === "guardian" ? <p className="mt-3 text-lg font-black text-[#315E50]">보호자 대리 입력으로 저장했습니다.</p> : null}<div className="mt-5 rounded-3xl bg-white p-5 text-left"><p className="text-lg font-black text-[#315E50]">어제와 비교</p><p className="mt-2 text-xl font-bold leading-8">통증 {previous ? `${painValue(previous)} → ` : ""}{currentPain ?? "-"}점<br/>움직임은 {recoveryMobilityLabels[currentCheck?.mobilityScore ?? mobility ?? 1]}.</p><p className="mt-4 rounded-2xl bg-[#F1F0E9] p-4 font-black">수술 후 {daysSince(patient.surgeryDate || patient.dischargeDate)}일째 · {streak}일 연속 기록</p></div><p className="mt-4 rounded-2xl bg-white p-5 text-left text-lg font-bold leading-8 text-[#46574F]">전반적으로 어제보다 {comparisonLabels[comparison]}.</p>{currentCheck?.hasConcern ? <p className="mt-3 rounded-2xl bg-white p-5 text-left text-lg font-bold leading-8 text-[#46574F]">오늘 남긴 변화: {currentCheck.concernText}</p> : null}<div className="mt-4 rounded-2xl border border-[#CFE0D5] bg-[#E8F1EA] p-5 text-left"><p className="font-black text-[#315E50]">병원과 함께 보는 회복 기록</p><p className="mt-2 font-semibold leading-7 text-[#596A62]">매일 남긴 기록은 회복 변화를 확인하는 데 활용됩니다. 필요한 경우 의료진이 최근 변화와 체크인 기록을 확인할 수 있습니다.</p></div><Link href={nav.href("checkin",{edit:"1",revision:currentCheck?.updatedAt || currentCheck?.id || "new"})} className="secondary">오늘 기록 수정하기</Link>{demo ? <><Link href="/demo/patient?mode=history" className="primary">회복 추이 보기</Link><Link href="/demo/patient" className="secondary">오늘 화면으로</Link><Link href="/demo/hospital" className="mt-4 inline-flex min-h-12 items-center font-bold text-[#315E50]">병원 데모 보기</Link></> : <Link href={guardianMode ? "/care/guardian" : "/app/patient/history"} className="primary">{guardianMode ? "보호자 화면으로" : "회복 추이 보기"}</Link>}</div></PatientShell>;
  }

  function goBack() {
    if (step === "painContext") setStep("pain");
    else if (step === "mobility") setStep(painScore !== null && (painScore >= 6 || (history.find(check => check.date < TODAY) && painScore - painValue(history.find(check => check.date < TODAY)!) >= 2)) ? "painContext" : "pain");
    else if (step === "movement") setStep("mobility");
    else if (step === "comparison") setStep(mobility === 2 ? "movement" : "mobility");
    else if (step === "concern") setStep("comparison");
  }

  function finish(selectedMobility: number) {
    if (painScore === null || !dayComparison) return;
    if(!demo){const access=getPatientSession();if(!access||access.patientId!==patient.id||access.hospitalId!==patient.hospitalId){setSaveError("환자 연결이 만료되었어요. 병원에서 받은 링크를 다시 열어주세요. 입력한 내용은 이 화면에 남아 있어요.");return;}}
    if(submitLock.current)return;submitLock.current=true;setIsSaving(true);
    setSaveError("");
    try {
    const currentState = demo ? loadPublicDemoCareState() : loadCareState();
    const existingToday = currentState.checkIns.find(check => check.patientId === patient.id && (check.checkInDate || check.date) === TODAY);
    if (existingToday && !edit) { setSavedCheck(existingToday); setStep("complete"); setIsSaving(false); return; }
    const hasConcern = concern !== null && concern !== "none";
    const storedConcerns = hasConcern ? [concern] : [];
    const concernText = !hasConcern ? "" : concern === "other" ? customConcern.trim() || "기타" : adaptiveConcerns.find(item => item[0] === concern)?.[1] || "변화 있음";
    const createdAt = new Date().toISOString();
    const episode = currentState.episodes.find(e => e.patientId === patient.id);
    const check: CheckIn = { id: `check_${Date.now()}`, episodeId: episode?.id, patientId: patient.id, date: TODAY, checkInDate: TODAY, pain: demoPainBucket(painScore), painScore, painContext, mobility: selectedMobility, mobilityScore: selectedMobility, mobilityComparison: selectedMobility === 0 ? "better" : selectedMobility === 2 ? "worse" : "same", movementDifficulty: movementDifficulty || undefined, hasConcern, concernStatus: hasConcern ? "reported" : "none", concernText, concerns: storedConcerns, swellingChange: concern === "swelling" ? "more" : undefined, warmth: concern === "fever" ? "clear" : undefined, woundChange: concern === "incision_discomfort" ? "redder" : undefined, sleep: concern === "sleep" ? "often" : undefined, customConcern: concern === "other" ? customConcern.trim() : "", dayComparison, source: guardianMode ? "guardian" : "patient",submittedByType:guardianMode?"guardian":"patient",submittedById:patient.id, createdAt, updatedAt: createdAt };
    if(edit && existingToday){check.id=existingToday.id;check.createdAt=existingToday.createdAt;}
    const previous = currentState.checkIns.filter(item => item.patientId === patient.id && item.date < TODAY).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const priority = prioritizationProvider.evaluate({ current: { ...check, painScore }, previous: previous ? { ...previous, painScore: previous.painScore ?? undefined } : undefined });
    const status: PatientStatus = { patientId: patient.id, level: priority.level, reason: priority.explanation, reasonCodes: priority.reasonCodes, ruleVersion: priority.ruleVersion, source: "system", updatedAt: priority.createdAt };
    const signal = status.level === "stable" ? null : { id: `signal_${Date.now()}`, patientId: patient.id, type: concern === "swelling" ? "new_swelling" as const : concern === "fever" ? "new_warmth" as const : concern === "incision_discomfort" ? "wound_change" as const : previous && painScore - painValue(previous) >= 3 ? "pain_jump" as const : "other" as const, severity: status.level === "needs_attention" ? "priority" as const : "check" as const, reason: status.reason, detectedAt: createdAt, sourceCheckInIds: [check.id, ...(previous ? [previous.id] : [])], status: "open" as const };
    const task = signal ? { id: `task_${Date.now()}`, patientId: patient.id, signalIds: [signal.id], priority: signal.severity === "priority" ? "high" as const : "normal" as const, status: patient.assignedNurse ? "assigned" as const : "unassigned" as const, assignedTo: patient.assignedNurse, assignedAt: patient.assignedNurse ? createdAt : undefined, dueAt: `${TODAY}T18:00:00+09:00`, createdAt } : null;
    // A patient edit must never mark a clinician's outstanding work completed.
    const signals = currentState.careSignals || [];
    const tasks = currentState.careTasks || [];
    const next = { ...currentState, checkIns: [...currentState.checkIns.filter(c=>c.id!==check.id), check], statuses: [...currentState.statuses.filter(s => s.patientId !== patient.id), status], careSignals: signal ? [...signals,signal] : signals, careTasks: task ? [...tasks,task] : tasks };
    (demo ? savePublicDemoCareState : saveCareState)(next); setMobility(selectedMobility); setSavedCheck(check); setStep("complete"); setIsSaving(false);
    const durationSeconds=Math.max(1,Math.round((Date.now()-Date.parse(startedAt))/1000));trackCareEvent("checkin_completed", { patientId: patient.id, hospitalId: patient.hospitalId, source: check.source, startedAt, completedAt: createdAt, durationSeconds, demo, edited:edit, checkInActor:guardianMode?"guardian_assisted":"patient", adaptiveQuestion:Boolean(painContext||movementDifficulty), unsureSelected:painContext==="unsure" });
    if(!previous&&!edit)trackCareEvent("first_checkin_completed",{patientId:patient.id,hospitalId:patient.hospitalId,demo});
    trackCareEvent("patient_status_changed",{patientId:patient.id,level:status.level,demo});
    if(signal)trackCareEvent("care_signal_created",{patientId:patient.id,hospitalId:patient.hospitalId,careSignalId:signal.id,careTaskId:task?.id,signalType:signal.type,ruleVersion:status.ruleVersion,demo});
    } catch { submitLock.current=false;setIsSaving(false);setSaveError("저장하지 못했어요. 입력한 내용은 이 화면에 남아 있어요. 다시 눌러 저장해주세요."); }
  }

    const previousPain = history.find(c=>c.date<TODAY) ? painValue(history.find(c=>c.date<TODAY)!) : null;
  const needsPainContext = painScore !== null && (painScore >= 6 || (previousPain !== null && painScore - previousPain >= 2));
  const steps = ["pain", ...(needsPainContext ? ["painContext"] : []), "mobility", ...(mobility === 2 ? ["movement"] : []), "comparison", "concern"] as AdaptiveStep[];
  const stepNumber = Math.max(1, steps.indexOf(step) + 1), totalSteps = steps.length;
  const ready = step === "pain" ? painScore !== null : step === "painContext" ? Boolean(painContext) : step === "mobility" ? mobility !== null : step === "movement" ? Boolean(movementDifficulty) : step === "comparison" ? dayComparison !== null : Boolean(concern) && (concern !== "other" || Boolean(customConcern.trim()));
  function nextStep() { trackCareEvent("checkin_question_answered",{patientId:patient.id,hospitalId:patient.hospitalId,question:step,elapsedSeconds:Math.max(1,Math.round((Date.now()-Date.parse(startedAt))/1000)),adaptive:["painContext","movement"].includes(step),unsureSelected:step==="painContext"&&painContext==="unsure",demo});if (step === "pain") setStep(needsPainContext ? "painContext" : "mobility"); else if (step === "painContext") setStep("mobility"); else if (step === "mobility") setStep(mobility === 2 ? "movement" : "comparison"); else if (step === "movement") setStep("comparison"); else if (step === "comparison") setStep("concern"); else if (mobility !== null) finish(mobility); }
  const stepLabel=step==="pain"?"통증":step==="painContext"?"통증 확인":step==="mobility"?"움직임":step==="movement"?"불편한 움직임":step==="comparison"?"오늘 상태":"증상";
  const painMeaning=painScore===null?"숫자를 눌러 알려주세요":painScore===0?"통증이 없어요":painScore<=3?"조금 불편해요":painScore<=6?"움직일 때 꽤 불편해요":painScore<10?"많이 아파요":"견디기 어려워요";
  return <PatientShell demo={demo} careStage={patientCareStage(patient)} backLabel="이전 화면" backFallback={nav.href()} onBack={step!=="pain" ? goBack : undefined}><div className="py-6 sm:py-10">{edit ? <p className="mb-3 text-lg font-black text-[#315E50]">오늘 기록 수정</p> : null}{saveError ? <div role="alert" className="mb-4 rounded-2xl border border-[#D6A086] bg-white p-5 text-lg leading-8"><p>{saveError}</p>{!demo&&!getPatientSession()?<Link href="/patient" className="secondary">다시 연결하는 방법</Link>:null}</div> : null}{guardianMode ? <p className="mb-3 rounded-xl bg-white p-3 text-lg font-black text-[#315E50]">보호자 대리 입력 · {patient.name}님</p> : null}<p className="text-base font-black text-[#315E50]">오늘 회복 체크 · 약 1분</p><div className="mt-3 flex items-center justify-between gap-3"><p className="text-lg font-black">{stepNumber}/{totalSteps} · {stepLabel}</p><p className="hidden text-base font-bold text-[#5B6D64] sm:block">통증 · 움직임 · 증상 · 오늘 상태</p></div><div className="mt-3 h-2 rounded-full bg-[#DDE5E0]"><div className="h-full rounded-full bg-[#315E50] transition-all" style={{ width: `${stepNumber / totalSteps * 100}%` }} /></div>
    <h1 className="mt-7 text-[clamp(1.75rem,6vw,2.15rem)] font-black leading-tight">{step === "pain" ? "지금 통증은 어느 정도인가요?" : step === "painContext" ? "어떤 때 가장 아픈가요?" : step === "mobility" ? "오늘 움직이는 것은 어땠나요?" : step === "movement" ? "어떤 움직임이 가장 불편했나요?" : step === "comparison" ? "어제와 비교하면 전반적으로 어떠세요?" : "오늘 새롭게 달라진 점이 있나요?"}</h1>
    {step === "pain" ? <><div className="mt-7 grid grid-cols-6 gap-2">{Array.from({ length: 11 }, (_, i) => <button aria-label={`통증 ${i}점`} aria-pressed={painScore===i} key={i} onClick={() => setPainScore(i)} className={`min-h-[60px] rounded-xl border-2 text-xl font-black ${painScore === i ? "border-[#315E50] bg-[#315E50] text-white" : "border-[#C8D3CD] bg-white"}`}>{i}</button>)}</div><div className="mt-4 grid grid-cols-5 gap-1 text-center text-[13px] font-bold leading-5 text-[#526159]"><span>0<br/>통증 없음</span><span>1~3<br/>조금 불편</span><span>4~6<br/>움직일 때 힘듦</span><span>7~9<br/>많이 아픔</span><span>10<br/>견디기 어려움</span></div><div aria-live="polite" className="mt-5 rounded-2xl bg-white p-5 text-lg font-bold leading-8 text-[#46574F]"><p className="text-xl font-black text-[#315E50]">{painScore===null?painMeaning:`${painScore}점 · ${painMeaning}`}</p>{previousPain !== null&&painScore!==null ? <p className="mt-2">어제 {previousPain}점 → 오늘 {painScore}점 {painScore<previousPain?"↓":painScore>previousPain?"↑":"→"}<br/><span className="text-[#315E50]">{painScore<previousPain?"어제보다 통증이 줄었어요.":painScore>previousPain?"어제보다 조금 더 불편하시군요. 몇 가지만 더 확인할게요.":"어제와 비슷해요."}</span></p> : null}</div></> : null}
    {step === "painContext" ? <div className="mt-8 grid gap-3">{painContextLabels.map(([id,label]) => <button key={id} onClick={() => setPainContext(id)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-xl font-black ${painContext === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "mobility" ? <div className="mt-8 grid gap-3">{recoveryMobilityLabels.map((label, i) => <button key={label} onClick={() => setMobility(i)} className={`min-h-[72px] rounded-2xl border-2 px-5 text-left text-xl font-black ${mobility === i ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "movement" ? <div className="mt-8 grid grid-cols-2 gap-3">{pathwayMovementLabels(patient).map(label => <button key={label} onClick={() => setMovementDifficulty(label)} className={`min-h-[68px] rounded-2xl border-2 px-4 text-left text-lg font-black ${movementDifficulty === label ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div> : null}
    {step === "comparison" ? <div className="mt-8 grid gap-4">{Object.entries(comparisonLabels).map(([id, label]) => <button key={id} onClick={() => setDayComparison(id as DayComparison)} className={`min-h-[72px] rounded-2xl border-2 bg-white px-5 text-left text-xl font-black ${dayComparison === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD]"}`}>{label}</button>)}</div> : null}
    {step === "concern" ? <><div className="mt-8 grid gap-3">{adaptiveConcerns.map(([id, label]) => <button key={id} onClick={() => setConcern(id)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-lg font-black ${concern === id ? "border-[#315E50] bg-[#E8F1EA]" : "border-[#C8D3CD] bg-white"}`}>{label}</button>)}</div>{concern === "other" ? <textarea value={customConcern} onChange={e => setCustomConcern(e.target.value)} maxLength={100} placeholder="불편한 점을 짧게 알려주세요." className="mt-4 min-h-24 w-full rounded-2xl border-2 border-[#C8D3CD] bg-white p-4 text-lg" /> : null}</> : null}
    <div className={`mt-7 grid ${step === "pain" ? "grid-cols-1" : "grid-cols-[auto_1fr]"} gap-3`}>{step !== "pain" ? <button onClick={goBack} className="min-h-[60px] rounded-2xl border-2 border-[#315E50] px-5 text-lg font-black text-[#315E50]"><ArrowLeft className="mr-2 inline" />이전</button> : null}<button disabled={!ready||isSaving} onClick={nextStep} className="min-h-[60px] rounded-2xl bg-[#315E50] px-5 text-xl font-black text-white disabled:bg-[#B7C2BC]">{isSaving?"저장 중...":step === "concern" ? "오늘 기록 마치기" : "다음"}</button></div>
  </div></PatientShell>;
}

function PatientShell({ children, demo, active = "home", backLabel, backFallback, onBack, hideNav = false, careStage = "activeCare" }: { children: React.ReactNode; demo: boolean; active?: "home" | "history" | "hospital"; backLabel?: string; backFallback?: string; onBack?:()=>void; hideNav?:boolean; careStage?:CareStage }) {
  return (
    <main className="min-h-[100dvh] bg-[#F1F0E9] px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] text-[#202923] [font-size:18px]">
      <div className="mx-auto max-w-[640px]">{demo ? <div className="pt-4 text-center"><span className="inline-flex rounded-full bg-white px-3 py-1 text-base font-black text-[#587066]">오늘안부 데모</span></div> : null}{backLabel ? <header className="flex items-center justify-between border-b border-[#D5DED7] py-3"><PatientBack label={backLabel === "오늘" && careStage === "completedCare" ? "홈" : backLabel} fallback={backFallback} onBack={onBack}/><span className="text-lg font-black text-[#315E50]">오늘안부 Care</span></header> : null}{children}</div>{!hideNav ? <PatientBottomNav demo={demo} current={active} careStage={careStage}/> : null}
    </main>
  );
}
function PatientBottomNav({demo,current,careStage}:{demo:boolean;current:"home"|"history"|"hospital";careStage:CareStage}){
 const base=demo?"/demo/patient":"/app/patient";
 return <nav aria-label="환자 메뉴" className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto grid max-w-[610px] grid-cols-3 rounded-2xl border border-[#D2DDD7] bg-white/95 p-2 shadow-xl backdrop-blur">{[["home",careStage === "completedCare" ? "홈" : "오늘",House,base],["history","회복 기록",Activity,base+(demo?"?mode=history":"/history")],["hospital","병원 안내",Hospital,base+(demo?"?mode=hospital":"/hospital")]].map(([id,label,Icon,href])=><Link key={String(id)} href={String(href)} prefetch onClick={()=>window.scrollTo({top:0,behavior:"auto"})} aria-current={current===id?"page":undefined} className={"flex min-h-14 flex-col items-center justify-center rounded-xl text-base font-black "+(current===id?"bg-[#315E50] text-white shadow-sm":"text-[#40554A]")}><Icon size={21} aria-hidden/><span>{String(label)}</span></Link>)}</nav>;
}
