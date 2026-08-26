import { audit,getHospitalSession } from "@/lib/demo-auth";
import type {ActionType,ClinicalWorkflowDecision,ConcernStatus,DataSource,OutcomeCategory,PatientEpisode,ReasonCode,StaffDecision} from "@/domain/care-events";
export { evaluatePatientStatus } from "@/lib/status-rules";
export type StatusLevel = "stable" | "watch" | "needs_attention" | "no_response";
export type SurgeryType = "인공관절" | "척추" | "골절" | "기타";
export type Laterality = "왼쪽" | "오른쪽" | "양쪽" | "해당 없음";
export type DayComparison = "better" | "same" | "worse";
export type Hospital = { id:string; name:string; status:"active"|"pilot"|"inactive" };
export type Patient = { id:string; hospitalId:string; name:string; phone:string; age:number; surgeryType:SurgeryType; bodyPart?:string; conditionCategory?:string; procedureCategory?:string; procedureDetail?:string; customProcedureName?:string; laterality?:Laterality; surgeryDate?:string; dischargeDate:string; createdAt:string; status:"invited"|"onboarded" };
export type CheckIn = { id:string; episodeId?:string; patientId:string; date:string; checkInDate?:string; pain:number; painScore?:number|null; mobility:number; mobilityScore?:number|null; hasConcern:boolean; concernStatus?:ConcernStatus; concernText:string; concerns?:string[]; customConcern?:string; dayComparison?:DayComparison; source?:DataSource; createdAt:string; updatedAt?:string };
export type PatientStatus = { patientId:string; level:StatusLevel; reason:string; reasonCodes?:ReasonCode[]; ruleVersion?:string; source?:"system"; updatedAt:string };
export type FollowUp = { id:string; episodeId?:string; patientId:string; hospitalId:string; triggeredFromCheckInId?:string; action:string; actionType?:ActionType; outcomeCategory?:OutcomeCategory; staffDecision?:StaffDecision; note:string; status:"scheduled"|"completed"; followUpDueDate?:string; followUpNote?:string; resultNote?:string; followUpCompletedAt?:string; followUpHandledBy?:string; handledBy:string; performedByRole?:string; performedAt?:string; source?:"hospital_staff"; createdAt:string; completedAt:string };
export type CareState = { hospitals:Hospital[]; patients:Patient[]; episodes:PatientEpisode[]; checkIns:CheckIn[]; statuses:PatientStatus[]; followUps:FollowUp[]; decisions:ClinicalWorkflowDecision[] };

export const CARE_STORE_KEY = "oneul-anbu:care-mvp:v1";
export const PUBLIC_DEMO_CARE_STORE_KEY = "oneul-anbu:public-demo:care-mvp:v1";
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
];
export function createSeedState():CareState {
  const patients:Patient[]=raw.map(([id,name,age,surgeryType,dischargeDate],index)=>({id,hospitalId:index<9?hospital.id:hospitalB.id,name,phone:"010-0000-0000",age,surgeryType,bodyPart:surgeryType==="척추"?"척추":surgeryType==="골절"?"발목":"무릎",conditionCategory:surgeryType==="골절"?"fracture":"postoperative",procedureCategory:surgeryType,procedureDetail:surgeryType==="인공관절"?"인공관절 전치환":surgeryType==="척추"?"요추 수술":surgeryType==="골절"?"골절 수술":"기타",laterality:surgeryType==="척추"?"해당 없음" as const:index%2?"왼쪽" as const:"오른쪽" as const,surgeryDate:`2026-08-${String(Math.max(1,Number(dischargeDate.slice(-2))-4)).padStart(2,"0")}`,dischargeDate,createdAt:"2026-08-20T09:00:00+09:00",status:"onboarded" as const}));
  const episodes:PatientEpisode[]=patients.map(p=>({id:`episode_${p.id}`,patientId:p.id,hospitalId:p.hospitalId,bodyRegion:"musculoskeletal",bodyPart:p.bodyPart||"기타",laterality:p.laterality||"해당 없음",conditionCategory:p.conditionCategory||"postoperative",procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,customProcedureName:p.customProcedureName||"",surgeryDate:p.surgeryDate||p.dischargeDate,dischargeDate:p.dischargeDate,createdAt:p.createdAt,updatedAt:p.createdAt,source:"hospital_staff",dataScope:"demo"}));
  const statuses=raw.map(([patientId,,,,,level,reason])=>({patientId,level,reason,reasonCodes:level==="no_response"?["missed_checkin" as const]:["pain_change" as const,"new_concern" as const],ruleVersion:"demo-v1",source:"system" as const,updatedAt:"2026-08-24T09:32:00+09:00"}));
  const checkIns:CheckIn[]=patients.filter(p=>!statuses.find(s=>s.patientId===p.id&&s.level==="no_response")).flatMap((p,i)=>{
    const base=i===0?[3,3,4,5,5,6,7]:[7,7,6,6,5,4,4];return base.map((score,j)=>{const date=`2026-08-${String(18+j).padStart(2,"0")}`,concerns=j===6&&i<2?(i===0?["swelling","incision_discomfort"]:["swelling"]):[];return{id:`check_${i}_${j}`,episodeId:`episode_${p.id}`,patientId:p.id,date,checkInDate:date,pain:demoPainBucket(score),painScore:score,mobility:j<2?2:j<5?1:0,mobilityScore:j<2?2:j<5?1:0,hasConcern:concerns.length>0,concernStatus:concerns.length?"reported":"none",concernText:concerns.map(x=>concernLabels[x]).join(" · "),concerns,customConcern:"",dayComparison:j===0?"same":score<base[j-1]?"better":score>base[j-1]?"worse":"same",source:"patient",createdAt:`${date}T09:32:00+09:00`} as CheckIn})});
  return alignDemoDates({hospitals:[hospital,hospitalB],patients,episodes,checkIns,statuses,followUps:[],decisions:[]});
}

export function loadCareState():CareState { if(typeof window==="undefined") return createSeedState(); try{const stored=localStorage.getItem(CARE_STORE_KEY);if(!stored)return createSeedState();const state=JSON.parse(stored) as Partial<CareState>&Pick<CareState,"hospitals"|"patients"|"checkIns"|"statuses"|"followUps">,patients=state.patients.map(p=>({...p,bodyPart:p.bodyPart||(p.surgeryType==="척추"?"척추":p.surgeryType==="골절"?"기타":"무릎"),procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,laterality:p.laterality||"해당 없음"})),episodes=state.episodes||patients.map(p=>({id:`episode_${p.id}`,patientId:p.id,hospitalId:p.hospitalId,bodyRegion:"musculoskeletal",bodyPart:p.bodyPart||"기타",laterality:p.laterality||"해당 없음",conditionCategory:p.conditionCategory||"postoperative",procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,customProcedureName:p.customProcedureName||"",surgeryDate:p.surgeryDate||p.dischargeDate,dischargeDate:p.dischargeDate,createdAt:p.createdAt,updatedAt:p.createdAt,source:"hospital_staff",dataScope:"demo"} as PatientEpisode));return alignDemoDates({hospitals:state.hospitals,patients,episodes,checkIns:state.checkIns.map(c=>({...c,episodeId:c.episodeId||`episode_${c.patientId}`,checkInDate:c.checkInDate||c.date,painScore:typeof c.painScore==="number"?c.painScore:null,mobilityScore:typeof c.mobilityScore==="number"?c.mobilityScore:c.mobility,concerns:c.concerns||(c.hasConcern?["other"]:[]),concernStatus:c.concernStatus||(c.hasConcern?"reported":"none"),customConcern:c.customConcern??c.concernText,dayComparison:c.dayComparison||"same",source:c.source||"patient"})),statuses:state.statuses.map(s=>({...s,reasonCodes:s.reasonCodes||[],ruleVersion:s.ruleVersion||"demo-v1",source:"system"})),followUps:state.followUps.map(f=>({...f,episodeId:f.episodeId||`episode_${f.patientId}`,triggeredFromCheckInId:f.triggeredFromCheckInId||state.checkIns.filter(c=>c.patientId===f.patientId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]?.id,actionType:f.actionType||actionTypeFromLabel(f.action),outcomeCategory:f.outcomeCategory||"other",performedByRole:f.performedByRole||"nurse",performedAt:f.performedAt||f.completedAt,source:"hospital_staff"})),decisions:state.decisions||[]})}catch{return createSeedState()} }

export function loadPublicDemoCareState():CareState {
  if(typeof window==="undefined") return createSeedState();
  try { const stored=localStorage.getItem(PUBLIC_DEMO_CARE_STORE_KEY); if(stored) return JSON.parse(stored) as CareState; } catch {}
  const state=createSeedState();
  state.checkIns=state.checkIns.filter(check=>check.patientId!=="patient_001"||(check.checkInDate||check.date)!==TODAY);
  localStorage.setItem(PUBLIC_DEMO_CARE_STORE_KEY,JSON.stringify(state));
  return state;
}
export function savePublicDemoCareState(state:CareState){localStorage.setItem(PUBLIC_DEMO_CARE_STORE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent("todayanbu:public-demo-care-updated"))}

export function actionTypeFromLabel(label:string):ActionType{return label==="전화 확인"?"phone_call":label==="추가 관찰"?"additional_monitoring":label==="내원 안내"?"visit_recommended":label==="특이사항 없음"||label==="별도 조치 필요 없음"?"no_action_needed":"other"}
export function saveCareState(state:CareState){
  // DEMO ONLY: merge tenant-scoped writes so one hospital cannot erase another hospital's records.
  const current=loadCareState(),ids=new Set(state.hospitals.map(h=>h.id)),scoped=ids.size<current.hospitals.length,created=state.patients.filter(p=>!current.patients.some(x=>x.id===p.id));
  const merged=scoped?{...current,patients:[...current.patients.filter(p=>!ids.has(p.hospitalId)),...state.patients],episodes:[...current.episodes.filter(e=>!ids.has(e.hospitalId)),...state.episodes],checkIns:[...current.checkIns.filter(c=>!state.patients.some(p=>p.id===c.patientId)),...state.checkIns],statuses:[...current.statuses.filter(s=>!state.patients.some(p=>p.id===s.patientId)),...state.statuses],followUps:[...current.followUps.filter(f=>!ids.has(f.hospitalId)),...state.followUps],decisions:[...current.decisions.filter(d=>!state.episodes.some(e=>e.id===d.episodeId)),...state.decisions]}:state;
  localStorage.setItem(CARE_STORE_KEY,JSON.stringify(merged));const hs=getHospitalSession();if(hs)created.forEach(p=>audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_created",resourceType:"patient",resourceId:p.id}));window.dispatchEvent(new CustomEvent("todayanbu:care-updated"));
}
export function getInviteUrl(patientId:string){
  if(typeof window==="undefined") return "/i";
  const state=loadCareState(),patient=state.patients.find(p=>p.id===patientId);if(!patient)return "/i";
  const key="oneul-anbu:demo:invitations";const list=JSON.parse(localStorage.getItem(key)||"[]");const existing=list.find((i:{patientId:string;status:string;expiresAt:string})=>i.patientId===patientId&&i.status==="pending"&&Date.parse(i.expiresAt)>Date.now());if(existing)return `/i?token=${encodeURIComponent(existing.token)}`;const token=`demo_${crypto.randomUUID?.().replaceAll("-","")||Date.now()}`;const invitation={id:`invite_${Date.now()}`,patientId,hospitalId:patient.hospitalId,token,status:"pending",createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString()};localStorage.setItem(key,JSON.stringify([...list,invitation]));const hs=getHospitalSession();if(hs)audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_invitation_created",resourceType:"patient_invitation",resourceId:invitation.id});return `/i?token=${encodeURIComponent(token)}`;
}
export function daysSince(date:string){return Math.max(0,Math.floor((new Date(`${TODAY}T12:00:00+09:00`).getTime()-new Date(`${date}T12:00:00+09:00`).getTime())/86400000));}

export function shiftCareDate(date:string,days:number){const value=new Date(`${date.slice(0,10)}T12:00:00Z`);value.setUTCDate(value.getUTCDate()+days);return `${value.toISOString().slice(0,10)}${date.slice(10)}`}
function seoulDate(){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),read=(type:string)=>parts.find(part=>part.type===type)?.value||"";return `${read("year")}-${read("month")}-${read("day")}`}
function dayGap(from:string,to:string){return Math.round((Date.parse(`${to}T12:00:00Z`)-Date.parse(`${from}T12:00:00Z`))/86400000)}
function alignDemoDates(state:CareState):CareState{const demoEpisodes=new Set(state.episodes.filter(episode=>episode.dataScope==="demo").map(episode=>episode.id)),demoPatients=new Set(state.episodes.filter(episode=>episode.dataScope==="demo").map(episode=>episode.patientId)),latest=state.checkIns.filter(check=>demoPatients.has(check.patientId)).map(check=>check.checkInDate||check.date).sort().at(-1)||DEMO_ANCHOR_DATE,offset=dayGap(latest,TODAY);if(!offset)return state;const shift=(value?:string)=>value?shiftCareDate(value,offset):value;return{...state,patients:state.patients.map(patient=>demoPatients.has(patient.id)?{...patient,surgeryDate:shift(patient.surgeryDate),dischargeDate:shift(patient.dischargeDate)!,createdAt:shift(patient.createdAt)!}:patient),episodes:state.episodes.map(episode=>demoEpisodes.has(episode.id)?{...episode,surgeryDate:shift(episode.surgeryDate)!,dischargeDate:shift(episode.dischargeDate)!,createdAt:shift(episode.createdAt)!,updatedAt:shift(episode.updatedAt)!}:episode),checkIns:state.checkIns.map(check=>demoPatients.has(check.patientId)?{...check,date:shift(check.date)!,checkInDate:shift(check.checkInDate),createdAt:shift(check.createdAt)!,updatedAt:shift(check.updatedAt)}:check),statuses:state.statuses.map(status=>demoPatients.has(status.patientId)?{...status,updatedAt:shift(status.updatedAt)!}:status),followUps:state.followUps.map(follow=>demoPatients.has(follow.patientId)?{...follow,followUpDueDate:shift(follow.followUpDueDate),performedAt:shift(follow.performedAt),createdAt:shift(follow.createdAt)!,completedAt:shift(follow.completedAt)!,followUpCompletedAt:shift(follow.followUpCompletedAt)}:follow),decisions:state.decisions.map(decision=>demoEpisodes.has(decision.episodeId)?{...decision,createdAt:shift(decision.createdAt)!}:decision)}}
