import { audit,getHospitalSession } from "@/lib/demo-auth";
import {careDaySince,mergeTenantCareState,scopeCareState} from "@/lib/care-integrity";
import type {ActionType,ClinicalWorkflowDecision,ConcernStatus,DataSource,OutcomeCategory,PatientEpisode,ReasonCode,StaffDecision} from "@/domain/care-events";
export { evaluatePatientStatus } from "@/lib/status-rules";
export type StatusLevel = "stable" | "watch" | "needs_attention" | "no_response";
export type SurgeryType = "인공관절" | "척추" | "골절" | "기타";
export type Laterality = "왼쪽" | "오른쪽" | "양쪽" | "해당 없음";
export type DayComparison = "better" | "same" | "worse";
export type Hospital = { id:string; name:string; status:"active"|"pilot"|"inactive" };
export type Patient = { id:string; hospitalId:string; hospitalPatientId?:string; externalPatientId?:string; externalEncounterId?:string; externalSurgeryId?:string; name:string; phone:string; age:number; surgeryType:SurgeryType; bodyPart?:string; conditionCategory?:string; procedureCategory?:string; procedureDetail?:string; customProcedureName?:string; laterality?:Laterality; surgeryDate?:string; dischargeDate:string; department?:string; assignedNurse?:string; assignedDoctor?:string; nextAppointment?:string; careStatus?:"invited"|"active"|"follow_up"|"completion_due"|"completed"; workflowStatus?:"unreviewed"|"in_review"|"follow_up"|"completed"; createdAt:string; status:"invited"|"onboarded" };
export type CheckIn = { id:string; episodeId?:string; patientId:string; date:string; checkInDate?:string; pain:number; painScore?:number|null; painContext?:"rest"|"moving"|"walking"|"night"|"constant"|"unsure"; mobility:number; mobilityScore?:number|null; mobilityComparison?:DayComparison; movementDifficulty?:string; hasConcern:boolean; concernStatus?:ConcernStatus; concernText:string; concerns?:string[]; swellingChange?:"none"|"same"|"more"|"sudden"; warmth?:"none"|"some"|"clear"|"unsure"; woundChange?:"same"|"redder"|"fluid"|"blood"|"unsure"; sleep?:"well"|"once_or_twice"|"often"|"hardly"; dailyFunction?:"independent"|"some_help"|"much_help"; customConcern?:string; dayComparison?:DayComparison; source?:DataSource; submittedByType?:"patient"|"guardian";submittedById?:string; createdAt:string; updatedAt?:string };
export type PatientStatus = { patientId:string; level:StatusLevel; reason:string; reasonCodes?:ReasonCode[]; ruleVersion?:string; source?:"system"; updatedAt:string };
export type CareSignal = { id:string; patientId:string; type:"pain_rising"|"pain_jump"|"new_swelling"|"new_warmth"|"wound_change"|"function_decline"|"missed_checkin"|"sleep_decline"|"other"; severity:"change"|"check"|"priority"; reason:string; detectedAt:string; sourceCheckInIds:string[]; status:"open"|"reviewed"|"resolved" };
export type CareTask = { id:string; patientId:string; signalIds:string[]; priority:"high"|"normal"; status:"unassigned"|"assigned"|"in_progress"|"done"; assignedTo?:string; dueAt?:string; createdAt:string; firstReviewedAt?:string; assignedAt?:string };
export type CareAction = { id:string; patientId:string; hospitalId?:string; careTaskId?:string; actionType:string; status?:"completed"|"follow_up"|"cancelled"|"corrected"; contactResult?:"connected"|"guardian"|"unreachable"|"callback_needed"; patientStatus?:"improved"|"same"|"worse"|"needs_review"; result?:"monitor"|"daily_guidance"|"medication_check"|"clinician_handoff"|"outpatient_guidance"|"urgent_guidance"; assignedTo?:string;staffId?:string;staffName?:string;staffRole?:string; note?:string;followUpAt?:string; createdAt:string;updatedAt?:string;cancelledAt?:string; startedAt?:string; completedAt?:string };
export type SignalFeedback = { id:string; patientId:string; careSignalId:string; careTaskId?:string; careActionId?:string; signalType:CareSignal["type"]; ruleId?:string; feedback:"useful"|"not_useful"|"unsure"; submittedBy:string; submittedAt:string };
export type HospitalCareRule = { id:string; hospitalId:string; surgeryType?:SurgeryType; signalType:CareSignal["type"]; threshold?:number; consecutiveDays?:number; priority:"high"|"normal"; enabled:boolean };
export type Outcome = { id:string; patientId:string; careActionId:string; outcomeType:string; recordedAt:string };
export type CareCompletion = { id:string; patientId:string; completedAt:string; reason:"program_completed"|"after_outpatient"|"transferred"|"patient_request"|"hospital_decision"|"other"; finalStatus:string; careActionCount:number; followUpCount:number; checkInParticipationRate:number };
export type FollowUp = { id:string; episodeId?:string; patientId:string; hospitalId:string; triggeredFromCheckInId?:string; action:string; actionType?:ActionType; outcomeCategory?:OutcomeCategory; staffDecision?:StaffDecision; note:string; status:"scheduled"|"completed"; followUpDueDate?:string; followUpNote?:string; resultNote?:string; followUpCompletedAt?:string; followUpHandledBy?:string; handledBy:string; performedByRole?:string; performedAt?:string; source?:"hospital_staff"; createdAt:string; completedAt:string };
export type CareState = { hospitals:Hospital[]; patients:Patient[]; episodes:PatientEpisode[]; checkIns:CheckIn[]; statuses:PatientStatus[]; careSignals?:CareSignal[]; careTasks?:CareTask[]; careActions?:CareAction[]; signalFeedback?:SignalFeedback[]; careRules?:HospitalCareRule[]; followUps:FollowUp[]; outcomes?:Outcome[]; careCompletions?:CareCompletion[]; decisions:ClinicalWorkflowDecision[] };

export const CARE_STORE_KEY = "oneul-anbu:care-mvp:v1";
export const PUBLIC_DEMO_CARE_STORE_KEY = "oneul-anbu:public-demo:care-mvp:v5";
export const DEMO_ANCHOR_DATE = "2026-08-24";
export const TODAY = seoulDate();
export const statusLabels:Record<StatusLevel,string> = { needs_attention:"오늘 확인 필요", watch:"관찰 필요", no_response:"체크인 미응답", stable:"안정적으로 회복 중" };
export const painLabels = ["거의 없어요","조금 있어요","많이 아파요","매우 아파요"];
export const mobilityLabels = ["평소처럼 움직일 수 있었어요","조금 불편했지만 움직였어요","움직이기가 많이 힘들었어요","거의 움직이지 못했어요"];
export const concernLabels:Record<string,string>={swelling:"붓기",fever:"열감 또는 발열",incision_discomfort:"수술 부위 불편",numbness:"저림 또는 감각 이상",walking:"움직임/보행 문제",medication:"약 복용 관련 불편",dizziness:"어지러움",fall:"넘어짐",other:"기타",none:"없음"};
export const comparisonLabels:Record<DayComparison,string>={better:"좋아졌어요",same:"비슷해요",worse:"더 불편해졌어요"};
// DEMO RULE compatibility only. This display bucket is not a medical threshold or validated risk score.
export function demoPainBucket(score:number){return score<=2?0:score<=4?1:score<=6?2:3}
export function painValue(c:CheckIn){return typeof c.painScore==="number"?c.painScore:[0,3,6,9][c.pain]??0}

const hospital:Hospital={id:"hospital_001",name:"서울온정형외과",status:"active"};
const hospitalB:Hospital={id:"hospital_002",name:"해온정형외과",status:"pilot"};
const raw:[string,string,number,SurgeryType,string,StatusLevel,string][] = [
  ["patient_001","김OO",68,"인공관절","2026-08-16","needs_attention","통증 6 → 7 · 붓기 · 수술 부위 불편"],
  ["patient_002","박OO",72,"척추","2026-08-14","needs_attention","오늘 통증 4 / 10 · 붓기"],
  ["patient_003","이OO",61,"골절","2026-08-18","watch","이전 응답보다 한 단계 불편해짐"],
  ["patient_004","최OO",57,"인공관절","2026-08-13","watch","움직임이 조금 힘들다고 응답함"],
  ["patient_005","정OO",74,"척추","2026-08-10","watch","통증을 많이 느낀다고 응답함"],
  ["patient_006","한OO",65,"골절","2026-08-20","no_response","오늘 체크인 응답이 없음"],
  ["patient_007","윤OO",69,"기타","2026-08-19","no_response","오늘 체크인 응답이 없음"],
  ["patient_008","서OO",63,"인공관절","2026-08-15","stable","오늘 응답에서 별도 확인이 필요한 변화 없음"],
  ["patient_009","조OO",71,"척추","2026-08-12","stable","오늘 응답에서 별도 확인이 필요한 변화 없음"],
  ["patient_010","오OO",54,"골절","2026-08-17","stable","오늘 응답에서 별도 확인이 필요한 변화 없음"],
  ["patient_011","권OO",67,"인공관절","2026-08-11","stable","오늘 응답에서 별도 확인이 필요한 변화 없음"],
  ["patient_012","장OO",60,"기타","2026-08-21","stable","오늘 응답에서 별도 확인이 필요한 변화 없음"],
  ["patient_013","강OO",66,"인공관절","2026-08-16","stable","통증과 움직임이 비슷하게 유지됨"],
  ["patient_014","문OO",70,"척추","2026-08-15","stable","최근 기록이 꾸준히 유지됨"],
  ["patient_015","배OO",59,"골절","2026-08-19","stable","통증이 전반적으로 낮아짐"],
  ["patient_016","신OO",73,"인공관절","2026-08-14","needs_attention","최근 3일 통증 4 → 5 → 7"],
  ["patient_017","안OO",64,"기타","2026-08-18","needs_attention","통증이 전일 대비 3점 높아짐"],
  ["patient_018","임OO",75,"척추","2026-08-13","needs_attention","오늘 열감이 새롭게 보고됨"],
  ["patient_019","홍OO",62,"골절","2026-08-20","watch","움직임이 어제보다 불편함"],
  ["patient_020","유OO",68,"인공관절","2026-08-17","no_response","2일 동안 체크인 기록 없음"],
  ["patient_021","고OO",71,"척추","2026-08-16","no_response","2일 동안 체크인 기록 없음"],
  ["patient_022","남OO",58,"골절","2026-08-21","stable","안정적으로 기록을 이어가는 중"],
  ["patient_023","서OO",76,"인공관절","2026-08-12","watch","수면 상태가 이틀 연속 불편함"],
  ["patient_024","노OO",63,"기타","2026-08-19","stable","오늘 별도 확인 변화 없음"],
  ["patient_025","하OO",69,"척추","2026-08-15","watch","외래 전 최근 상태 확인 필요"],
  ["patient_026","전OO",55,"골절","2026-08-20","stable","통증이 조금씩 낮아지는 중"],
  ["patient_027","송OO",72,"인공관절","2026-08-13","needs_attention","새로운 붓기와 움직임 변화"],
  ["patient_028","양OO",61,"척추","2026-08-18","stable","최근 기록에 큰 변화 없음"],
  ["patient_029","백OO",67,"골절","2026-08-17","watch","기본 생활에 조금 도움이 필요함"],
  ["patient_030","허OO",74,"인공관절","2026-08-11","stable","Care Action 후 경과 확인 중"],
];
export function createSeedState():CareState {
  const patients:Patient[]=raw.map(([id,name,age,surgeryType,dischargeDate],index)=>({id,hospitalId:hospital.id,name,phone:"010-0000-0000",age,surgeryType,bodyPart:surgeryType==="척추"?"척추":surgeryType==="골절"?"발목":"무릎",conditionCategory:surgeryType==="골절"?"fracture":"postoperative",procedureCategory:surgeryType,procedureDetail:surgeryType==="인공관절"?"인공관절 전치환":surgeryType==="척추"?"요추 수술":surgeryType==="골절"?"골절 수술":"기타",laterality:surgeryType==="척추"?"해당 없음" as const:index%2?"왼쪽" as const:"오른쪽" as const,surgeryDate:`2026-08-${String(Math.max(1,Number(dischargeDate.slice(-2))-4)).padStart(2,"0")}`,dischargeDate,department:"정형외과",assignedNurse:index===6||index===26?undefined:index%2?"김간호사":"박간호사",assignedDoctor:index%2?"이정형 원장":"최정형 원장",nextAppointment:index===5||index===24?"2026-08-30":`2026-09-${String(2+(index%20)).padStart(2,"0")}`,careStatus:"active",createdAt:"2026-08-20T09:00:00+09:00",status:"onboarded" as const}));
  const episodes:PatientEpisode[]=patients.map(p=>({id:`episode_${p.id}`,patientId:p.id,hospitalId:p.hospitalId,bodyRegion:"musculoskeletal",bodyPart:p.bodyPart||"기타",laterality:p.laterality||"해당 없음",conditionCategory:p.conditionCategory||"postoperative",procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,customProcedureName:p.customProcedureName||"",surgeryDate:p.surgeryDate||p.dischargeDate,dischargeDate:p.dischargeDate,createdAt:p.createdAt,updatedAt:p.createdAt,source:"hospital_staff",dataScope:"demo"}));
  const statuses=raw.map(([patientId,,,,,level,reason])=>({patientId,level,reason,reasonCodes:level==="no_response"?["missed_checkin" as const]:["pain_change" as const,"new_concern" as const],ruleVersion:"demo-v1",source:"system" as const,updatedAt:"2026-08-24T09:32:00+09:00"}));
  const checkIns:CheckIn[]=patients.filter(p=>!statuses.find(s=>s.patientId===p.id&&s.level==="no_response")).flatMap((p,i)=>{
    const base=i===0?[3,3,4,5,5,6,7]:[7,7,6,6,5,4,4];return base.map((score,j)=>{const date=`2026-08-${String(18+j).padStart(2,"0")}`,concerns=j===6&&i<2?(i===0?["swelling","incision_discomfort"]:["swelling"]):[];return{id:`check_${i}_${j}`,episodeId:`episode_${p.id}`,patientId:p.id,date,checkInDate:date,pain:demoPainBucket(score),painScore:score,mobility:j<2?2:j<5?1:0,mobilityScore:j<2?2:j<5?1:0,hasConcern:concerns.length>0,concernStatus:concerns.length?"reported":"none",concernText:concerns.map(x=>concernLabels[x]).join(" · "),concerns,customConcern:"",dayComparison:j===0?"same":score<base[j-1]?"better":score>base[j-1]?"worse":"same",source:"patient",createdAt:`${date}T09:32:00+09:00`} as CheckIn})});
  const followUps:FollowUp[]=[{id:"follow_demo_patient_005",episodeId:"episode_patient_005",patientId:"patient_005",hospitalId:hospital.id,triggeredFromCheckInId:"check_4_6",action:"전화 확인",actionType:"phone_call",outcomeCategory:"continue_monitoring",staffDecision:"monitor",note:"통증 증가 여부를 전화로 확인했습니다.",status:"scheduled",followUpDueDate:"2026-08-25",followUpNote:"오늘 상태를 한 번 더 확인",handledBy:"김간호사",performedByRole:"nurse",performedAt:"2026-08-24T15:20:00+09:00",source:"hospital_staff",createdAt:"2026-08-24T15:20:00+09:00",completedAt:"2026-08-24T15:20:00+09:00"}];
  const careSignals:CareSignal[]=statuses.filter(status=>status.level!=="stable").map((status,index)=>({id:`signal_seed_${index}`,patientId:status.patientId,type:status.level==="no_response"?"missed_checkin":index===0?"pain_rising":index===1?"new_swelling":"other",severity:status.level==="needs_attention"?"priority":"check",reason:status.reason,detectedAt:status.updatedAt,sourceCheckInIds:checkIns.filter(check=>check.patientId===status.patientId).slice(-3).map(check=>check.id),status:"open"}));
  const careTasks:CareTask[]=careSignals.map((signal,index)=>({id:`task_seed_${index}`,patientId:signal.patientId,signalIds:[signal.id],priority:signal.severity==="priority"?"high":"normal",status:index===6?"unassigned":index===4?"in_progress":"assigned",assignedTo:index===6?undefined:index%2?"김간호사":"박간호사",assignedAt:index===6?undefined:"2026-08-24T09:40:00+09:00",dueAt:"2026-08-25T18:00:00+09:00",createdAt:signal.detectedAt}));
  const careRules:HospitalCareRule[]=[{id:"rule_pain_jump",hospitalId:hospital.id,signalType:"pain_jump",threshold:3,priority:"high",enabled:true},{id:"rule_pain_rise",hospitalId:hospital.id,signalType:"pain_rising",consecutiveDays:3,priority:"high",enabled:true},{id:"rule_missed",hospitalId:hospital.id,signalType:"missed_checkin",consecutiveDays:2,priority:"normal",enabled:true}];
  return alignDemoDates({hospitals:[hospital,hospitalB],patients,episodes,checkIns,statuses,careSignals,careTasks,careActions:[],signalFeedback:[],careRules,followUps,outcomes:[],careCompletions:[],decisions:[]});
}

export function loadCareState():CareState { if(typeof window==="undefined") return createSeedState(); try{const stored=localStorage.getItem(CARE_STORE_KEY);if(!stored)return createSeedState();const state=JSON.parse(stored) as Partial<CareState>&Pick<CareState,"hospitals"|"patients"|"checkIns"|"statuses"|"followUps">,patients=state.patients.map(p=>({...p,bodyPart:p.bodyPart||(p.surgeryType==="척추"?"척추":p.surgeryType==="골절"?"기타":"무릎"),procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,laterality:p.laterality||"해당 없음"})),episodes=state.episodes||patients.map(p=>({id:`episode_${p.id}`,patientId:p.id,hospitalId:p.hospitalId,bodyRegion:"musculoskeletal",bodyPart:p.bodyPart||"기타",laterality:p.laterality||"해당 없음",conditionCategory:p.conditionCategory||"postoperative",procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,customProcedureName:p.customProcedureName||"",surgeryDate:p.surgeryDate||p.dischargeDate,dischargeDate:p.dischargeDate,createdAt:p.createdAt,updatedAt:p.createdAt,source:"hospital_staff",dataScope:"demo"} as PatientEpisode));return alignDemoDates({hospitals:state.hospitals,patients,episodes,checkIns:state.checkIns.map(c=>({...c,episodeId:c.episodeId||`episode_${c.patientId}`,checkInDate:c.checkInDate||c.date,painScore:typeof c.painScore==="number"?c.painScore:null,mobilityScore:typeof c.mobilityScore==="number"?c.mobilityScore:c.mobility,concerns:c.concerns||(c.hasConcern?["other"]:[]),concernStatus:c.concernStatus||(c.hasConcern?"reported":"none"),customConcern:c.customConcern??c.concernText,dayComparison:c.dayComparison||"same",source:c.source||"patient"})),statuses:state.statuses.map(s=>({...s,reasonCodes:s.reasonCodes||[],ruleVersion:s.ruleVersion||"demo-v1",source:"system"})),followUps:state.followUps.map(f=>({...f,episodeId:f.episodeId||`episode_${f.patientId}`,triggeredFromCheckInId:f.triggeredFromCheckInId||state.checkIns.filter(c=>c.patientId===f.patientId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]?.id,actionType:f.actionType||actionTypeFromLabel(f.action),outcomeCategory:f.outcomeCategory||"other",performedByRole:f.performedByRole||"nurse",performedAt:f.performedAt||f.completedAt,source:"hospital_staff"})),decisions:state.decisions||[]})}catch{return createSeedState()} }

export function loadPublicDemoCareState():CareState {
  if(typeof window==="undefined") return createSeedState();
  try { const stored=localStorage.getItem(PUBLIC_DEMO_CARE_STORE_KEY); if(stored) return JSON.parse(stored) as CareState; } catch {}
  const state=createSeedState();
  state.checkIns=state.checkIns.filter(check=>check.patientId!=="patient_001"||(check.checkInDate||check.date)!==TODAY);
  const patientChecks=state.checkIns.filter(check=>check.patientId==="patient_001").sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),latest=patientChecks[0],previous=patientChecks[1];
  if(latest&&previous){const reason=`최근 통증 ${patientChecks.slice(0,3).reverse().map(painValue).join(" → ")} · 전일 대비 ${painValue(previous)} → ${painValue(latest)}`;state.statuses=state.statuses.map(status=>status.patientId==="patient_001"?{...status,reason}:status);state.careSignals=state.careSignals?.map(signal=>signal.patientId==="patient_001"?{...signal,reason,sourceCheckInIds:patientChecks.slice(0,3).map(check=>check.id)}:signal)}
  localStorage.setItem(PUBLIC_DEMO_CARE_STORE_KEY,JSON.stringify(state));
  return state;
}
export function savePublicDemoCareState(state:CareState){localStorage.setItem(PUBLIC_DEMO_CARE_STORE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent("todayanbu:public-demo-care-updated"))}
export function resetPublicDemoCareState(){if(typeof window==="undefined")return createSeedState();localStorage.removeItem(PUBLIC_DEMO_CARE_STORE_KEY);const state=loadPublicDemoCareState();window.dispatchEvent(new CustomEvent("todayanbu:public-demo-care-updated"));return state}

export function actionTypeFromLabel(label:string):ActionType{return label==="전화 확인"?"phone_call":label==="추가 관찰"?"additional_monitoring":label==="내원 안내"?"visit_recommended":label==="특이사항 없음"||label==="별도 조치 필요 없음"?"no_action_needed":"other"}
export function saveCareState(state:CareState){
  const current=loadCareState(),session=getHospitalSession(),hospitalId=session?.hospitalId,created=state.patients.filter(p=>!current.patients.some(x=>x.id===p.id));
  if(hospitalId&&state.patients.some(p=>p.hospitalId!==hospitalId))throw new Error("TENANT_SCOPE_VIOLATION");
  const merged=hospitalId?mergeTenantCareState(current,scopeCareState(state,hospitalId),hospitalId):state;
  localStorage.setItem(CARE_STORE_KEY,JSON.stringify(merged));const hs=getHospitalSession();if(hs)created.forEach(p=>audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_created",resourceType:"patient",resourceId:p.id}));window.dispatchEvent(new CustomEvent("todayanbu:care-updated"));
}
export function getInviteUrl(patientId:string){
  if(typeof window==="undefined") return "/i";
  const state=loadCareState(),patient=state.patients.find(p=>p.id===patientId);if(!patient)return "/i";
  const key="oneul-anbu:demo:invitations";const list=JSON.parse(localStorage.getItem(key)||"[]");const existing=list.find((i:{patientId:string;status:string;expiresAt:string})=>i.patientId===patientId&&i.status==="pending"&&Date.parse(i.expiresAt)>Date.now());if(existing)return `/i?token=${encodeURIComponent(existing.token)}`;const token=`demo_${crypto.randomUUID?.().replaceAll("-","")||Date.now()}`;const invitation={id:`invite_${Date.now()}`,patientId,hospitalId:patient.hospitalId,token,status:"pending",createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString()};localStorage.setItem(key,JSON.stringify([...list,invitation]));const hs=getHospitalSession();if(hs)audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_invitation_created",resourceType:"patient_invitation",resourceId:invitation.id});return `/i?token=${encodeURIComponent(token)}`;
}
export function daysSince(date:string){return careDaySince(date,TODAY)}

export function shiftCareDate(date:string,days:number){const value=new Date(`${date.slice(0,10)}T12:00:00Z`);value.setUTCDate(value.getUTCDate()+days);return `${value.toISOString().slice(0,10)}${date.slice(10)}`}
function seoulDate(){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),read=(type:string)=>parts.find(part=>part.type===type)?.value||"";return `${read("year")}-${read("month")}-${read("day")}`}
function dayGap(from:string,to:string){return Math.round((Date.parse(`${to}T12:00:00Z`)-Date.parse(`${from}T12:00:00Z`))/86400000)}
function alignDemoDates(state:CareState):CareState{const demoEpisodes=new Set(state.episodes.filter(episode=>episode.dataScope==="demo").map(episode=>episode.id)),demoPatients=new Set(state.episodes.filter(episode=>episode.dataScope==="demo").map(episode=>episode.patientId)),latest=state.checkIns.filter(check=>demoPatients.has(check.patientId)).map(check=>check.checkInDate||check.date).sort().at(-1)||DEMO_ANCHOR_DATE,offset=dayGap(latest,TODAY);if(!offset)return state;const shift=(value?:string)=>value?shiftCareDate(value,offset):value;return{...state,patients:state.patients.map(patient=>demoPatients.has(patient.id)?{...patient,surgeryDate:shift(patient.surgeryDate),dischargeDate:shift(patient.dischargeDate)!,createdAt:shift(patient.createdAt)!}:patient),episodes:state.episodes.map(episode=>demoEpisodes.has(episode.id)?{...episode,surgeryDate:shift(episode.surgeryDate)!,dischargeDate:shift(episode.dischargeDate)!,createdAt:shift(episode.createdAt)!,updatedAt:shift(episode.updatedAt)!}:episode),checkIns:state.checkIns.map(check=>demoPatients.has(check.patientId)?{...check,date:shift(check.date)!,checkInDate:shift(check.checkInDate),createdAt:shift(check.createdAt)!,updatedAt:shift(check.updatedAt)}:check),statuses:state.statuses.map(status=>demoPatients.has(status.patientId)?{...status,updatedAt:shift(status.updatedAt)!}:status),followUps:state.followUps.map(follow=>demoPatients.has(follow.patientId)?{...follow,followUpDueDate:shift(follow.followUpDueDate),performedAt:shift(follow.performedAt),createdAt:shift(follow.createdAt)!,completedAt:shift(follow.completedAt)!,followUpCompletedAt:shift(follow.followUpCompletedAt)}:follow),decisions:state.decisions.map(decision=>demoEpisodes.has(decision.episodeId)?{...decision,createdAt:shift(decision.createdAt)!}:decision)}}
