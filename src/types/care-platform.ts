export type DepartmentCode = "orthopedics" | "rehabilitation" | "neurosurgery" | "internal_medicine" | "other";
export type CareProgramCode = "orthopedic_discharge" | "rehabilitation_discharge" | "neurology_followup";
export type HospitalRole = "hospital_owner" | "medical_staff" | "desk";
export type PlatformRole = "platform_admin";
export type CareEventType = "discharged" | "program_started" | "response" | "activity_signal" | "hospital_contact" | "outpatient_scheduled" | "outpatient_visited";

export interface Patient { id:string; hospitalId:string; displayName:string; department:DepartmentCode; careProgram:CareProgramCode; dischargedAt:string; guardianId?:string; }
export interface RecoveryMetric { patientId:string; kind:"steps"|"activity"|"phone_use"|"sleep"; observedAt:string; value:number; baselineChangePercent?:number; interpretation:string; }
export interface PatientResponse { id:string; patientId:string; module:"core"|"orthopedic"; questionCode:string; answerCode:string; label:string; createdAt:string; }
export interface CareEvent { id:string; patientId:string; type:CareEventType; occurredAt:string; title:string; note?:string; actorRole?:HospitalRole|PlatformRole|"patient"|"guardian"; }
export interface HospitalContact extends CareEvent { type:"hospital_contact"; reason:"status_check"|"discomfort_check"|"rehabilitation_guide"|"outpatient_guide"|"other"; }

export const departments: {code:DepartmentCode; label:string; enabled:boolean}[] = [
  {code:"orthopedics",label:"정형외과",enabled:true},{code:"rehabilitation",label:"재활의학과",enabled:false},{code:"neurosurgery",label:"신경외과",enabled:false},{code:"internal_medicine",label:"내과",enabled:false},{code:"other",label:"기타",enabled:false},
];

export const carePrograms = [{code:"orthopedic_discharge" as const,label:"정형외과 퇴원 Care",department:"orthopedics" as const,modules:["core","orthopedic"] as const}];
