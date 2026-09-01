export type DepartmentCode = "orthopedics" | "rehabilitation" | "neurosurgery" | "internal_medicine" | "other";
export type CareProgramCode = "orthopedic_discharge" | "rehabilitation_discharge" | "neurology_followup";
export type HospitalRole = "nurse" | "care_coordinator" | "doctor" | "hospital_owner" | "hospital_admin" | "desk";
export type CareWorkflowState = "new"|"needs_review"|"nurse_reviewing"|"contact_required"|"doctor_review_requested"|"doctor_reviewing"|"follow_up_scheduled"|"ongoing"|"completed";
export interface HospitalUser { id:string; name:string; hospitalId:string; roles:HospitalRole[]; department?:string; title?:string; }
export interface PatientCareAssignment { patientId:string; primaryDoctorId:string; careCoordinatorId?:string; }
export interface CareTask { id:string; patientId:string; type:"check_in_review"|"no_response"|"phone_call"|"doctor_review"|"follow_up"; priority:"urgent"|"high"|"normal"; assigneeId?:string; status:"open"|"in_progress"|"completed"; dueAt:string; createdAt:string; completedAt?:string; }
export interface CareEscalation { id:string; patientId:string; requestedBy:string; requestedTo:string; reason:string; status:"requested"|"reviewing"|"resolved"; decision?:"monitor"|"phone_call"|"earlier_visit"|"visit_required"|"other"; createdAt:string; resolvedAt?:string; }
export interface CareActivity { id:string; patientId:string; actorId:string; actorRole:HospitalRole; action:string; previousState?:CareWorkflowState; nextState:CareWorkflowState; note?:string; timestamp:string; }
export type PlatformRole = "platform_admin";
export type CareEventType = "discharged" | "program_started" | "response" | "activity_signal" | "hospital_contact" | "outpatient_scheduled" | "outpatient_visited";

export interface Patient { id:string; hospitalId:string; displayName:string; department:DepartmentCode; careProgram:CareProgramCode; dischargedAt:string; guardianId?:string; }
export interface RecoveryMetric { patientId:string; kind:"steps"|"activity"|"phone_use"|"sleep"; observedAt:string; value:number; baselineChangePercent?:number; interpretation:string; }
export interface PatientResponse { id:string; patientId:string; module:"core"|"orthopedic"; questionCode:string; answerCode:string; label:string; createdAt:string; }
export interface CareEvent { id:string; patientId:string; type:CareEventType; occurredAt:string; title:string; note?:string; actorRole?:HospitalRole|PlatformRole|"patient"|"guardian"; }
export interface HospitalContact extends CareEvent { type:"hospital_contact"; reason:"status_check"|"discomfort_check"|"rehabilitation_guide"|"outpatient_guide"|"other"; }
export interface Guardian { id:string; patientId:string; displayName:string; relationship:string; canAssistResponse:boolean; receivesAlerts:boolean; }
export interface CareAlert { id:string; patientId:string; reasonCodes:("activity_down"|"discomfort_up"|"no_response"|"data_disconnected"|"outpatient_missed")[]; explanation:string; status:"open"|"contacted"|"completed"; createdAt:string; }
export interface Appointment { id:string; patientId:string; scheduledAt:string; status:"scheduled"|"confirmed"|"visited"|"missed"|"cancelled"; source:"hospital"|"care_followup"; }
export interface ProtocolStep { day:number; kind:"checkin"|"activity_review"|"question"|"reminder"|"hospital_review"|"outpatient_guide"; title:string; automated:boolean; }
export interface CareProtocol { id:string; hospitalId:string; name:string; department:DepartmentCode; careProgram:CareProgramCode; durationDays:number; steps:ProtocolStep[]; active:boolean; }
export interface PilotProgram { id:string; hospitalId:string; title:string; startsAt:string; endsAt:string; targetPatients:number; metrics:{registered:number;activeDay7:number;alerts:number;contacts:number;outpatientConnections:number}; }

export const departments: {code:DepartmentCode; label:string; enabled:boolean}[] = [
  {code:"orthopedics",label:"정형외과",enabled:true},{code:"rehabilitation",label:"재활의학과",enabled:false},{code:"neurosurgery",label:"신경외과",enabled:false},{code:"internal_medicine",label:"내과",enabled:false},{code:"other",label:"기타",enabled:false},
];

export const carePrograms = [{code:"orthopedic_discharge" as const,label:"정형외과 퇴원 Care",department:"orthopedics" as const,modules:["core","orthopedic"] as const}];
