import type { ChangeSignal, DailyLifeData, FamilyCheck, PersonalBaseline } from "@/types/care";

export type RecoveryPoint={day:number;label:string;percent:number};
export type CarePatient={id:string;name:string;age:number;dischargeDate:string;day:number;recovery:number;status:"recovering"|"changed"|"near_baseline";summary:string;baseline:PersonalBaseline;recent:DailyLifeData;signals:ChangeSignal[];timeline:RecoveryPoint[];familyChecks:FamilyCheck[]};

export const carePatients:CarePatient[]=[
 {id:"park",name:"박OO",age:72,dischargeDate:"2026.07.29",day:14,recovery:62,status:"changed",summary:"최근 5일 활동 감소",baseline:{avgSteps:3800,avgPhoneUsage:74,avgOutingDaysPerWeek:4,avgFirstActivityTime:"07:40"},recent:{date:"2026.08.12",steps:2450,phoneUsageMinutes:51,outingDetected:false,firstActivityTime:"09:05"},signals:[{type:"activity",changePercent:-36,level:"check",durationDays:5},{type:"daily_rhythm",level:"changed",durationDays:4}],timeline:[{day:1,label:"퇴원 직후",percent:31},{day:7,label:"1주 후",percent:49},{day:14,label:"현재",percent:62}],familyChecks:[{date:"2026-08-10",method:"call",status:"tired",memo:"평소보다 피곤하다고 말씀하심"}]},
 {id:"kim",name:"김OO",age:76,dischargeDate:"2026.07.22",day:21,recovery:81,status:"recovering",summary:"조금씩 회복 중",baseline:{avgSteps:4200,avgPhoneUsage:82,avgOutingDaysPerWeek:5,avgFirstActivityTime:"07:20"},recent:{date:"2026.08.12",steps:3350,phoneUsageMinutes:70,outingDetected:true,firstActivityTime:"07:45"},signals:[{type:"activity",changePercent:-20,level:"changed",durationDays:7}],timeline:[{day:1,label:"퇴원 직후",percent:35},{day:7,label:"1주 후",percent:52},{day:14,label:"2주 후",percent:68},{day:21,label:"현재",percent:81}],familyChecks:[{date:"2026-08-12",method:"call",status:"normal"},{date:"2026-08-19",method:"visit",status:"tired"}]},
 {id:"lee",name:"이OO",age:69,dischargeDate:"2026.07.15",day:28,recovery:93,status:"near_baseline",summary:"평소 수준에 가까워짐",baseline:{avgSteps:5100,avgPhoneUsage:65,avgOutingDaysPerWeek:6,avgFirstActivityTime:"06:55"},recent:{date:"2026.08.12",steps:4740,phoneUsageMinutes:63,outingDetected:true,firstActivityTime:"07:05"},signals:[{type:"activity",changePercent:-7,level:"normal",durationDays:7}],timeline:[{day:1,label:"퇴원 직후",percent:42},{day:7,label:"1주 후",percent:64},{day:14,label:"2주 후",percent:79},{day:28,label:"현재",percent:93}],familyChecks:[{date:"2026-08-08",method:"video",status:"normal"}]},
];

export const statusLabel={changed:"확인할 변화",recovering:"회복 중",near_baseline:"평소 수준 근접"} as const;
export function getPatient(id:string){return carePatients.find(p=>p.id===id)}
