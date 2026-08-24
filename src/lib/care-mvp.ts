import { audit,getHospitalSession } from "@/lib/demo-auth";
export { evaluatePatientStatus } from "@/lib/status-rules";
export type StatusLevel = "stable" | "watch" | "needs_attention" | "no_response";
export type SurgeryType = "인공관절" | "척추" | "골절" | "기타";
export type Laterality = "왼쪽" | "오른쪽" | "양쪽" | "해당 없음";
export type DayComparison = "better" | "same" | "worse";
export type Hospital = { id:string; name:string; status:"active"|"pilot"|"inactive" };
export type Patient = { id:string; hospitalId:string; name:string; phone:string; age:number; surgeryType:SurgeryType; bodyPart?:string; conditionCategory?:string; procedureCategory?:string; procedureDetail?:string; customProcedureName?:string; laterality?:Laterality; surgeryDate?:string; dischargeDate:string; createdAt:string; status:"invited"|"onboarded" };
export type CheckIn = { id:string; patientId:string; date:string; pain:number; painScore?:number; mobility:number; mobilityScore?:number; hasConcern:boolean; concernText:string; concerns?:string[]; customConcern?:string; dayComparison?:DayComparison; createdAt:string };
export type PatientStatus = { patientId:string; level:StatusLevel; reason:string; updatedAt:string };
export type FollowUp = { id:string; patientId:string; hospitalId:string; action:string; note:string; status:"completed"; handledBy:string; createdAt:string; completedAt:string };
export type CareState = { hospitals:Hospital[]; patients:Patient[]; checkIns:CheckIn[]; statuses:PatientStatus[]; followUps:FollowUp[] };

export const CARE_STORE_KEY = "oneul-anbu:care-mvp:v1";
export const TODAY = "2026-08-24";
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
  const patients=raw.map(([id,name,age,surgeryType,dischargeDate],index)=>({id,hospitalId:index<9?hospital.id:hospitalB.id,name,phone:"010-0000-0000",age,surgeryType,bodyPart:surgeryType==="척추"?"척추":surgeryType==="골절"?"발목":"무릎",conditionCategory:surgeryType==="골절"?"fracture":"postoperative",procedureCategory:surgeryType,procedureDetail:surgeryType==="인공관절"?"인공관절 전치환":surgeryType==="척추"?"요추 수술":surgeryType==="골절"?"골절 수술":"기타",laterality:surgeryType==="척추"?"해당 없음" as const:index%2?"왼쪽" as const:"오른쪽" as const,surgeryDate:`2026-08-${String(Math.max(1,Number(dischargeDate.slice(-2))-4)).padStart(2,"0")}`,dischargeDate,createdAt:"2026-08-20T09:00:00+09:00",status:"onboarded" as const}));
  const statuses=raw.map(([patientId,,,,,level,reason])=>({patientId,level,reason,updatedAt:"2026-08-24T09:32:00+09:00"}));
  const checkIns:CheckIn[]=patients.filter(p=>!statuses.find(s=>s.patientId===p.id&&s.level==="no_response")).flatMap((p,i)=>{
    const base=i===0?[3,3,4,5,5,6,7]:[7,7,6,6,5,4,4];return base.map((score,j)=>{const date=`2026-08-${String(18+j).padStart(2,"0")}`,concerns=j===6&&i<2?(i===0?["swelling","incision_discomfort"]:["swelling"]):["none"];return{id:`check_${i}_${j}`,patientId:p.id,date,pain:demoPainBucket(score),painScore:score,mobility:j<2?2:j<5?1:0,mobilityScore:j<2?2:j<5?1:0,hasConcern:!concerns.includes("none"),concernText:concerns.includes("none")?"":concerns.map(x=>concernLabels[x]).join(" · "),concerns,customConcern:"",dayComparison:j===0?"same":score<base[j-1]?"better":score>base[j-1]?"worse":"same",createdAt:`${date}T09:32:00+09:00`} as CheckIn})});
  return {hospitals:[hospital,hospitalB],patients,checkIns,statuses,followUps:[]};
}

export function loadCareState():CareState { if(typeof window==="undefined") return createSeedState(); try{const stored=localStorage.getItem(CARE_STORE_KEY);if(!stored)return createSeedState();const state=JSON.parse(stored) as CareState;return{...state,patients:state.patients.map(p=>({...p,bodyPart:p.bodyPart||(p.surgeryType==="척추"?"척추":p.surgeryType==="골절"?"기타":"무릎"),procedureCategory:p.procedureCategory||p.surgeryType,procedureDetail:p.procedureDetail||p.surgeryType,laterality:p.laterality||(p.surgeryType==="척추"?"해당 없음":"해당 없음")})),checkIns:state.checkIns.map(c=>({...c,painScore:typeof c.painScore==="number"?c.painScore:undefined,mobilityScore:c.mobilityScore??c.mobility,concerns:c.concerns||(c.hasConcern?["other"]:["none"]),customConcern:c.customConcern??c.concernText,dayComparison:c.dayComparison||"same"}))}}catch{return createSeedState()} }
export function saveCareState(state:CareState){
  // DEMO ONLY: merge tenant-scoped writes so one hospital cannot erase another hospital's records.
  const current=loadCareState(),ids=new Set(state.hospitals.map(h=>h.id)),scoped=ids.size<current.hospitals.length,created=state.patients.filter(p=>!current.patients.some(x=>x.id===p.id));
  const merged=scoped?{...current,patients:[...current.patients.filter(p=>!ids.has(p.hospitalId)),...state.patients],checkIns:[...current.checkIns.filter(c=>!state.patients.some(p=>p.id===c.patientId)),...state.checkIns],statuses:[...current.statuses.filter(s=>!state.patients.some(p=>p.id===s.patientId)),...state.statuses],followUps:[...current.followUps.filter(f=>!ids.has(f.hospitalId)),...state.followUps]}:state;
  localStorage.setItem(CARE_STORE_KEY,JSON.stringify(merged));const hs=getHospitalSession();if(hs)created.forEach(p=>audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_created",resourceType:"patient",resourceId:p.id}));window.dispatchEvent(new CustomEvent("todayanbu:care-updated"));
}
export function getInviteUrl(patientId:string){
  if(typeof window==="undefined") return "/i";
  const state=loadCareState(),patient=state.patients.find(p=>p.id===patientId);if(!patient)return "/i";
  const key="oneul-anbu:demo:invitations";const list=JSON.parse(localStorage.getItem(key)||"[]");const existing=list.find((i:{patientId:string;status:string;expiresAt:string})=>i.patientId===patientId&&i.status==="pending"&&Date.parse(i.expiresAt)>Date.now());if(existing)return `/i?token=${encodeURIComponent(existing.token)}`;const token=`demo_${crypto.randomUUID?.().replaceAll("-","")||Date.now()}`;const invitation={id:`invite_${Date.now()}`,patientId,hospitalId:patient.hospitalId,token,status:"pending",createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString()};localStorage.setItem(key,JSON.stringify([...list,invitation]));const hs=getHospitalSession();if(hs)audit({actorType:"hospital_user",actorId:hs.userId,hospitalId:hs.hospitalId,action:"patient_invitation_created",resourceType:"patient_invitation",resourceId:invitation.id});return `/i?token=${encodeURIComponent(token)}`;
}
export function daysSince(date:string){return Math.max(0,Math.floor((new Date(`${TODAY}T12:00:00+09:00`).getTime()-new Date(`${date}T12:00:00+09:00`).getTime())/86400000));}
