import type {CareAnalyticsEvent} from "@/lib/care-analytics";
import type {CareState} from "@/lib/care-mvp";

export type PilotHealth="healthy"|"needs_attention"|"inactive";
export type IssueCategory="Patient UX"|"Hospital UX"|"Workflow"|"Care Signal"|"Data Quality"|"Technical"|"Permission"|"Privacy"|"Clinical Relevance"|"Staff Adoption"|"Patient Adoption"|"Other";
export type IssueSeverity="critical"|"high"|"medium"|"low";
export type IssueStatus="new"|"reviewing"|"planned"|"in_progress"|"resolved"|"dismissed";
export type PilotIssue={id:string;hospitalId?:string;pilotId?:string;patientId?:string;staffRole?:string;category:IssueCategory;severity:IssueSeverity;status:IssueStatus;relatedScreen?:string;relatedSignalType?:string;message:string;note?:string;source:"clinician"|"operator"|"analytics_review";createdAt:string;resolvedAt?:string};
export type PilotNote={id:string;hospitalId:string;pilotId:string;message:string;actor:string;createdAt:string};
export type PilotRecommendation="proceed"|"proceed_with_improvements"|"extend"|"do_not_proceed";
export type PilotDecision={pilotId:string;recommendation?:PilotRecommendation;reasons:string[];closingChecklist:Record<string,boolean>;updatedAt:string};
export type PilotHistory={id:string;hospitalId:string;name:string;period:string;pilotStatus:"preparing"|"active"|"completed";hospitalAdoptionStatus:string;createdAt:string};
export type PilotAudit={id:string;actor:string;action:string;target:string;previousValue?:unknown;newValue?:unknown;timestamp:string};

const keys={issues:"oneul-anbu:pilot:issues:v1",notes:"oneul-anbu:pilot:notes:v1",decisions:"oneul-anbu:pilot:decisions:v1",history:"oneul-anbu:pilot:history:v1",audit:"oneul-anbu:pilot:audit:v1"};
const read=<T,>(key:string,fallback:T):T=>{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}};
const write=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("todayanbu:pilot-operations-updated"))};
export const loadPilotIssues=()=>read<PilotIssue[]>(keys.issues,[]);
export function savePilotIssue(issue:PilotIssue){const previous=loadPilotIssues().find(item=>item.id===issue.id);write(keys.issues,[...loadPilotIssues().filter(item=>item.id!==issue.id),issue]);recordPilotAudit({actor:"operator",action:previous?"issue_status_changed":"issue_created",target:issue.id,previousValue:previous,newValue:issue})}
export const loadPilotNotes=()=>read<PilotNote[]>(keys.notes,[]);
export function savePilotNote(note:PilotNote){write(keys.notes,[...loadPilotNotes(),note]);recordPilotAudit({actor:note.actor,action:"pilot_note_created",target:note.pilotId,newValue:note.message})}
export const loadPilotDecisions=()=>read<PilotDecision[]>(keys.decisions,[]);
export function savePilotDecision(value:PilotDecision){const previous=loadPilotDecisions().find(item=>item.pilotId===value.pilotId);write(keys.decisions,[...loadPilotDecisions().filter(item=>item.pilotId!==value.pilotId),value]);recordPilotAudit({actor:"operator",action:"pilot_decision_changed",target:value.pilotId,previousValue:previous,newValue:value})}
export const loadPilotHistory=()=>read<PilotHistory[]>(keys.history,[{id:"pilot_2026q3",hospitalId:"hospital_001",name:"무릎 수술환자 Pilot",period:"2026 Q3",pilotStatus:"active",hospitalAdoptionStatus:"pilot_active",createdAt:"2026-08-01"}]);
export function savePilotHistory(value:PilotHistory){write(keys.history,[...loadPilotHistory().filter(item=>item.id!==value.id),value])}
export const loadPilotAudit=()=>read<PilotAudit[]>(keys.audit,[]);
export function recordPilotAudit(entry:Omit<PilotAudit,"id"|"timestamp">){write(keys.audit,[...loadPilotAudit(),{...entry,id:`pa_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,timestamp:new Date().toISOString()}].slice(-2000))}

const day=(date:string)=>date.slice(0,10);
export function hospitalOperations(state:CareState,events:CareAnalyticsEvent[],hospitalId:string){
 const patients=state.patients.filter(item=>item.hospitalId===hospitalId),ids=new Set(patients.map(item=>item.id)),now=Date.now(),today=new Date().toISOString().slice(0,10),last7=new Date(now-6*86400000).toISOString().slice(0,10),previous7=new Date(now-13*86400000).toISOString().slice(0,10);
 const active=patients.filter(item=>item.careStatus!=="completed"),checks=state.checkIns.filter(item=>ids.has(item.patientId)),recentPatients=new Set(checks.filter(item=>item.date>=last7).map(item=>item.patientId)),previousPatients=new Set(checks.filter(item=>item.date>=previous7&&item.date<last7).map(item=>item.patientId)),rate=Math.round(recentPatients.size/Math.max(1,active.length)*100),previousRate=Math.round(previousPatients.size/Math.max(1,active.length)*100);
 const signals=(state.careSignals||[]).filter(item=>ids.has(item.patientId)&&item.status!=="resolved"),tasks=(state.careTasks||[]).filter(item=>ids.has(item.patientId)&&item.status!=="done"),followups=state.followUps.filter(item=>item.hospitalId===hospitalId&&item.status!=="completed"),staffEvents=events.filter(item=>item.hospitalId===hospitalId&&item.staffId),lastActivity=staffEvents.sort((a,b)=>b.timestamp.localeCompare(a.timestamp))[0]?.timestamp,staff7=new Set(staffEvents.filter(item=>item.timestamp>=new Date(now-7*86400000).toISOString()).map(item=>item.staffId)).size;
 const reasons:string[]=[];if(rate<55)reasons.push(`최근 7일 체크인율 ${previousRate}% → ${rate}%`);if(tasks.length>=3)reasons.push(`미처리 Care ${tasks.length}건`);if(followups.length>=3)reasons.push(`Follow-up 미완료 ${followups.length}건`);if(!lastActivity||now-Date.parse(lastActivity)>7*86400000)reasons.push("최근 7일 직원 활동 없음");
 const inactive=(!lastActivity||now-Date.parse(lastActivity)>14*86400000)&&rate<20,health:PilotHealth=inactive?"inactive":reasons.length?"needs_attention":"healthy";
 return{hospitalId,target:patients.length,active:active.length,checkinRate:rate,previousRate,noResponse:Math.max(0,active.length-recentPatients.size),signals:signals.length,openTasks:tasks.length,incompleteFollowups:followups.length,lastActivity,activeStaff7:staff7,todayCheckins:new Set(checks.filter(item=>day(item.date)===today).map(item=>item.patientId)).size,health,reasons};
}
