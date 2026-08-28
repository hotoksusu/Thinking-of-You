export type ValidationRole="nurse"|"coordinator"|"doctor"|"hospital_admin";
export type ValidationTaskId="priority_patient"|"signal_reason"|"recovery_trend"|"care_action"|"followup"|"outpatient_summary";
export type ValidationTaskResult={taskId:ValidationTaskId;status:"pending"|"in_progress"|"completed"|"abandoned";startedAt?:string;completedAt?:string;timeSeconds?:number;clickCount:number;wrongNavigationCount:number;understood?:boolean};
export type ValidationSurvey={scores:{queue:number;signal:number;efficiency:number;workflow:number};mostUseful:string;friction:string[];workToReduce:string;pilotIntent:"yes"|"conditional"|"no";concerns:string[];note?:string};
export type ValidationSession={id:string;participantRole:ValidationRole;hospitalType?:string;experienceYears?:number;startedAt:string;completedAt?:string;taskResults:ValidationTaskResult[];survey?:ValidationSurvey;dataScope:"validation"};
export type PilotConfig={hospitalId:string;startDate:string;endDate?:string;targetPatientCount:number;surgeryTypes:string[];defaultCareDays:number;targets:{registration:number;day3:number;day7:number;completion:number;signalValidity:number;signalToAction:number;followUp:number;firstReviewMinutes:number};status:"preparing"|"ready"|"active"|"completed";checklist:Record<string,boolean>;baseline?:{monthlyDischarges?:number;staffCount?:number;weeklyCareHours?:number;weeklyCalls?:number;methods:string[];preVisitMethod?:string};updatedAt:string};
export type AdoptionStatus="lead"|"demo"|"validation"|"pilot_preparing"|"pilot_active"|"pilot_completed"|"contract_review"|"active_customer"|"inactive";
export type HospitalAdoption={hospitalId:string;status:AdoptionStatus;nextAction?:string;dueDate?:string;owner?:string;note?:string;barriers:string[]};
export type ValidationIssue={id:string;category:"UX"|"Workflow"|"Patient Compliance"|"Clinical Relevance"|"Alert Fatigue"|"EMR"|"Privacy"|"Responsibility"|"Pricing"|"Other";severity:"critical"|"high"|"medium"|"low";role:ValidationRole;relatedScreen:string;feedback:string;status:"new"|"reviewing"|"planned"|"done"|"dismissed";createdAt:string};
const SESSION_KEY="oneul-anbu:validation:sessions:v1",ACTIVE_KEY="oneul-anbu:validation:active:v1",PILOT_KEY="oneul-anbu:pilot:configs:v1",ADOPTION_KEY="oneul-anbu:pilot:adoption:v1",ISSUE_KEY="oneul-anbu:validation:issues:v1";
const read=<T,>(key:string,fallback:T):T=>{if(typeof window==="undefined")return fallback;try{return JSON.parse(localStorage.getItem(key)||"") as T}catch{return fallback}};
const write=(key:string,value:unknown)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent("todayanbu:pilot-readiness-updated"))};
export const validationTasks:ValidationTaskId[]=["priority_patient","signal_reason","recovery_trend","care_action","followup","outpatient_summary"];
export function loadValidationSessions(){return read<ValidationSession[]>(SESSION_KEY,[])}
export function getActiveValidationSession(){return read<ValidationSession|null>(ACTIVE_KEY,null)}
export function startValidationSession(input:{participantRole:ValidationRole;hospitalType?:string;experienceYears?:number}){const session:ValidationSession={id:`validation_${Date.now()}`,participantRole:input.participantRole,hospitalType:input.hospitalType,experienceYears:input.experienceYears,startedAt:new Date().toISOString(),taskResults:validationTasks.map(taskId=>({taskId,status:"pending",clickCount:0,wrongNavigationCount:0})),dataScope:"validation"};write(ACTIVE_KEY,session);write(SESSION_KEY,[...loadValidationSessions(),session]);return session}
export function saveValidationSession(session:ValidationSession){write(ACTIVE_KEY,session.completedAt?null:session);write(SESSION_KEY,[...loadValidationSessions().filter(item=>item.id!==session.id),session])}
export function loadPilotConfigs(){return read<PilotConfig[]>(PILOT_KEY,[])}
export function savePilotConfig(config:PilotConfig){write(PILOT_KEY,[...loadPilotConfigs().filter(item=>item.hospitalId!==config.hospitalId),config])}
export function loadAdoptions(){return read<HospitalAdoption[]>(ADOPTION_KEY,[])}
export function saveAdoption(value:HospitalAdoption){write(ADOPTION_KEY,[...loadAdoptions().filter(item=>item.hospitalId!==value.hospitalId),value])}
export function loadValidationIssues(){return read<ValidationIssue[]>(ISSUE_KEY,[])}
export function saveValidationIssue(issue:ValidationIssue){write(ISSUE_KEY,[...loadValidationIssues(),issue])}
