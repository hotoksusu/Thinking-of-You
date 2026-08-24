export type CaseDecision = "contact" | "no_contact" | "unsure";
export type CaseResponse = { caseId: string; displayOrder: number; decision: CaseDecision; reason: string };

export type ResearchResponse = {
  id: string; researchVersion: "orthopedics-v1"; startedAt: string; completedAt?: string; isDemo?: boolean;
  role?: string; organizationType?: string; experience?: string;
  currentWorkflow: string[]; contactFrequency?: string; contactCriteria?: string; criticalPeriod?: string;
  workflowPainPoints: string[]; patientUxScore?: number; checkinUsefulnessScore?: number;
  unnecessaryQuestions: string[]; missingQuestions?: string; caseResponses: CaseResponse[]; importantSignals: string[];
  dashboardFirstFocus?: string; dashboardPriorityScore?: number; dashboardReasonScore?: number; dashboardMissingInfo?: string;
  painDecisionPriority?: string; painScaleAppropriateness?: number; importantConcerns?: string[]; trendUsefulnessScore?: number;
  followupAdequacy?: string; followupMissing?: string; handlerVisibility?: string; doctorEscalation?: string;
  expectedOperator?: string; manageableAlerts?: string; acceptableHandlingTime?: string;
  adoptionReasons: string[]; nonAdoptionReason?: string; pilotInterest?: string;
};

export type ResearchLead = { id: string; researchResponseId: string; hospitalName: string; name: string; email: string; phone: string; consent: true; createdAt: string };

export const RESPONSE_KEY = "oneul-anbu:research:orthopedics:responses:v1";
export const DRAFT_KEY = "oneul-anbu:research:orthopedics:draft:v1";
export const LEAD_KEY = "oneul-anbu:research:orthopedics:leads:v1";

export const CASES = [
  {id:"A", title:"환자 A", meta:"인공관절 · 퇴원 8일차", facts:["통증: 조금 있어요","움직임: 비슷해요","추가 불편: 없어요"]},
  {id:"B", title:"환자 B", meta:"인공관절 · 퇴원 8일차", facts:["통증: 많이 아파요","움직임: 많이 힘들었어요","추가 불편: 붓기가 있어요"]},
  {id:"C", title:"환자 C", meta:"척추 수술 · 퇴원 6일차", facts:["최근: 3일 연속 체크인 없음"]},
  {id:"D", title:"환자 D", meta:"인공관절 · 퇴원 5일차", facts:["통증: 조금 있어요","움직임: 조금 힘들었어요","추가 불편: 없어요"]},
] as const;

export function emptyResponse(): ResearchResponse { return {id:crypto.randomUUID(),researchVersion:"orthopedics-v1",startedAt:new Date().toISOString(),currentWorkflow:[],workflowPainPoints:[],unnecessaryQuestions:[],caseResponses:[],importantSignals:[],adoptionReasons:[]}; }
export function readList<T>(key:string):T[]{try{return JSON.parse(localStorage.getItem(key)||"[]") as T[]}catch{return []}}
export function saveList<T>(key:string,value:T[]){localStorage.setItem(key,JSON.stringify(value))}

const roles=["정형외과 전문의","정형외과 전공의","간호사","진료/수술 코디네이터","원무/CS","병원 경영/관리"];
const orgs=["의원","병원","종합병원","상급종합병원"];
const decisions:CaseDecision[][]=[["no_contact","contact","contact","unsure"],["no_contact","contact","unsure","contact"],["unsure","contact","contact","contact"],["no_contact","contact","no_contact","unsure"]];
export const SEED_RESPONSES:ResearchResponse[]=Array.from({length:10},(_,i)=>({
  ...emptyResponse(),id:`demo-${i+1}`,isDemo:true,startedAt:new Date(Date.now()-(i+2)*3600000).toISOString(),completedAt:new Date(Date.now()-(i+1)*3600000).toISOString(),
  role:roles[i%roles.length],organizationType:orgs[i%orgs.length],experience:["1~3년","4~7년","8~15년","16년 이상"][i%4],
  currentWorkflow:["예정된 외래에서 확인","병원에서 전화"],contactFrequency:i%2?"가끔 있다":"거의 없다",criticalPeriod:"퇴원 후 1~3일",
  workflowPainPoints:["모든 환자에게 연락하기 어렵다","누가 먼저 확인이 필요한지 알기 어렵다"],patientUxScore:3+(i%3),checkinUsefulnessScore:4+(i%2),unnecessaryQuestions:i%4===0?["추가 불편"]:[],missingQuestions:i%3===0?"수술부위 상태":"",
  caseResponses:CASES.map((c,j)=>({caseId:c.id,displayOrder:j+1,decision:decisions[i%4][j],reason:j===1?"통증과 움직임 변화가 함께 보여 확인이 필요합니다.":"퇴원 경과와 변화 추이를 함께 봅니다."})),
  importantSignals:["통증 변화","수술부위 상태","부종"].slice(0,2+(i%2)),dashboardFirstFocus:i%2?"오늘 확인 필요 환자":"미응답 환자",dashboardPriorityScore:4+(i%2),dashboardReasonScore:3+(i%3),dashboardMissingInfo:i%3===0?"이전 기록과의 변화":"",painDecisionPriority:["통증 절대값","전일 대비 변화","최근 며칠간 추세"][i%3],painScaleAppropriateness:4+(i%2),importantConcerns:["붓기","수술부위","보행"],trendUsefulnessScore:4+(i%2),
  followupAdequacy:i%3===0?"일부 수정이 필요하다":"충분하다",followupMissing:i%3===0?"담당자와 다음 확인 예정일":"",handlerVisibility:"반드시 필요",doctorEscalation:i%2?"반드시 필요":"있으면 좋음",
  expectedOperator:["외래 간호사","코디네이터","별도 환자관리 담당자"][i%3],manageableAlerts:["1~5명","6~10명","11~15명"][i%3],acceptableHandlingTime:"1~3분",
  adoptionReasons:["확인이 필요한 환자 선별","전화업무 효율화"],nonAdoptionReason:i%2?"EMR과 별도 업무가 생길 수 있습니다.":"담당 인력을 정하기 어렵습니다.",pilotInterest:["관심 있음","조금 더 알아보고 싶음","현재는 관심 없음"][i%3]
}));
