export type StatusLevel = "stable" | "watch" | "needs_attention" | "no_response";
export type SurgeryType = "인공관절" | "척추" | "골절" | "기타";
export type Hospital = { id:string; name:string; status:"active"|"pilot"|"inactive" };
export type Patient = { id:string; hospitalId:string; name:string; phone:string; age:number; surgeryType:SurgeryType; dischargeDate:string; createdAt:string; status:"invited"|"onboarded" };
export type CheckIn = { id:string; patientId:string; date:string; pain:number; mobility:number; hasConcern:boolean; concernText:string; createdAt:string };
export type PatientStatus = { patientId:string; level:StatusLevel; reason:string; updatedAt:string };
export type FollowUp = { id:string; patientId:string; hospitalId:string; action:string; note:string; status:"completed"; handledBy:string; createdAt:string; completedAt:string };
export type CareState = { hospitals:Hospital[]; patients:Patient[]; checkIns:CheckIn[]; statuses:PatientStatus[]; followUps:FollowUp[] };

export const CARE_STORE_KEY = "oneul-anbu:care-mvp:v1";
export const TODAY = "2026-08-24";
export const statusLabels:Record<StatusLevel,string> = { needs_attention:"오늘 확인 필요", watch:"관찰 필요", no_response:"체크인 미응답", stable:"안정적으로 회복 중" };
export const painLabels = ["거의 없어요","조금 있어요","많이 아파요","매우 아파요"];
export const mobilityLabels = ["평소보다 잘 움직였어요","비슷했어요","조금 힘들었어요","많이 힘들었어요"];

export function evaluatePatientStatus(current:CheckIn, previous?:CheckIn):PatientStatus {
  const worse = previous && (current.pain > previous.pain || current.mobility > previous.mobility);
  if(current.pain===3 || current.mobility===3 || (current.pain>=2 && current.mobility>=2) || current.hasConcern){
    const reasons=[current.pain===3?"통증 응답 확인 필요":"",current.mobility===3?"움직임 응답 확인 필요":"",current.pain>=2&&current.mobility>=2?"통증과 움직임이 함께 불편함":"",current.hasConcern?`추가 불편 응답${current.concernText?`: ${current.concernText}`:""}`:""] .filter(Boolean);
    return {patientId:current.patientId,level:"needs_attention",reason:reasons.join(" · "),updatedAt:current.createdAt};
  }
  if(current.pain===2 || current.mobility===2 || worse) return {patientId:current.patientId,level:"watch",reason:worse?"이전 응답보다 한 단계 불편해짐":current.pain===2?"통증을 많이 느낀다고 응답함":"움직임이 조금 힘들다고 응답함",updatedAt:current.createdAt};
  return {patientId:current.patientId,level:"stable",reason:"오늘 응답에서 별도 확인이 필요한 변화 없음",updatedAt:current.createdAt};
}

const hospital:Hospital={id:"hospital_001",name:"서울온정형외과",status:"active"};
const hospitalB:Hospital={id:"hospital_002",name:"해온정형외과",status:"pilot"};
const raw:[string,string,number,SurgeryType,string,StatusLevel,string][] = [
  ["patient_001","김OO",68,"인공관절","2026-08-16","needs_attention","통증과 움직임이 함께 불편함"],
  ["patient_002","박OO",72,"척추","2026-08-14","needs_attention","추가 불편 응답: 붓기가 있어요"],
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
  const patients=raw.map(([id,name,age,surgeryType,dischargeDate],index)=>({id,hospitalId:index<9?hospital.id:hospitalB.id,name,phone:"010-0000-0000",age,surgeryType,dischargeDate,createdAt:"2026-08-20T09:00:00+09:00",status:"onboarded" as const}));
  const statuses=raw.map(([patientId,,,,,level,reason])=>({patientId,level,reason,updatedAt:"2026-08-24T09:32:00+09:00"}));
  const checkIns:CheckIn[]=patients.filter(p=>!statuses.find(s=>s.patientId===p.id&&s.level==="no_response")).flatMap((p,i)=>[
    {id:`check_prev_${i}`,patientId:p.id,date:"2026-08-23",pain:i<2?1:0,mobility:i<4?1:0,hasConcern:false,concernText:"",createdAt:"2026-08-23T09:20:00+09:00"},
    {id:`check_today_${i}`,patientId:p.id,date:TODAY,pain:i===0?3:i===1?2:i<5?2:1,mobility:i===0?2:i===1?1:i<4?2:1,hasConcern:i===1,concernText:i===1?"붓기가 있어요":"",createdAt:"2026-08-24T09:32:00+09:00"}
  ]);
  return {hospitals:[hospital,hospitalB],patients,checkIns,statuses,followUps:[]};
}

export function loadCareState():CareState { if(typeof window==="undefined") return createSeedState(); try{const raw=localStorage.getItem(CARE_STORE_KEY); return raw?JSON.parse(raw):createSeedState()}catch{return createSeedState()} }
export function saveCareState(state:CareState){localStorage.setItem(CARE_STORE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent("todayanbu:care-updated"));}
export function getInviteUrl(patientId:string){
  if(typeof window==="undefined") return "/i";
  const state=loadCareState(),patient=state.patients.find(p=>p.id===patientId);if(!patient)return "/i";
  const key="oneul-anbu:demo:invitations";const list=JSON.parse(localStorage.getItem(key)||"[]");const token=`demo_${crypto.randomUUID?.().replaceAll("-","")||Date.now()}`;const invitation={id:`invite_${Date.now()}`,patientId,hospitalId:patient.hospitalId,token,status:"pending",createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString()};localStorage.setItem(key,JSON.stringify([...list,invitation]));return `/i?token=${encodeURIComponent(token)}`;
}
export function daysSince(date:string){return Math.max(0,Math.floor((new Date(`${TODAY}T12:00:00+09:00`).getTime()-new Date(`${date}T12:00:00+09:00`).getTime())/86400000));}
