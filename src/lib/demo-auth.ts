"use client";
export type HospitalRole="owner"|"doctor"|"nurse"|"staff";
export type HospitalUser={id:string;hospitalId:string;name:string;email:string;phone:string;role:HospitalRole;status:"active"|"invited"|"disabled";createdAt:string;updatedAt:string;lastLoginAt?:string};
export type OperatorUser={id:string;name:string;email:string;role:"super_admin"|"operator"|"support";status:"active"|"disabled";createdAt:string;lastLoginAt?:string};
export type HospitalSession={kind:"hospital";sessionId:string;userId:string;hospitalId:string;role:HospitalRole;expiresAt:string};
export type PatientSession={kind:"patient";sessionId:string;patientId:string;hospitalId:string;expiresAt:string};
export type OperatorSession={kind:"operator";sessionId:string;userId:string;role:OperatorUser["role"];expiresAt:string;mfaVerified:boolean};
export type PatientInvitation={id:string;patientId:string;hospitalId:string;token:string;status:"pending"|"used"|"expired"|"revoked";createdAt:string;expiresAt:string;usedAt?:string};
export type AuditAction="hospital_login"|"operator_login"|"patient_created"|"patient_invitation_created"|"patient_record_viewed"|"followup_started"|"followup_completed"|"hospital_user_created"|"patient_session_created"|"checkin_completed"|"patient_status_changed";
export type AuditLog={id:string;actorType:"hospital_user"|"operator"|"patient";actorId:string;hospitalId?:string;action:AuditAction;resourceType:string;resourceId:string;createdAt:string};
const keys={hospital:"oneul-anbu:demo:hospital-session",patient:"oneul-anbu:demo:patient-session",operator:"oneul-anbu:demo:operator-session",invites:"oneul-anbu:demo:invitations",audit:"oneul-anbu:demo:audit"};
export const demoHospitalUsers:HospitalUser[]=[
 {id:"hu_a_owner",hospitalId:"hospital_001",name:"김현정",email:"owner@seoulon.demo",phone:"010-****-1001",role:"owner",status:"active",createdAt:"2026-08-01",updatedAt:"2026-08-01"},
 {id:"hu_a_nurse",hospitalId:"hospital_001",name:"박간호",email:"nurse@seoulon.demo",phone:"010-****-1002",role:"nurse",status:"active",createdAt:"2026-08-01",updatedAt:"2026-08-01"},
 {id:"hu_a_staff",hospitalId:"hospital_001",name:"이원무",email:"staff@seoulon.demo",phone:"010-****-1003",role:"staff",status:"active",createdAt:"2026-08-01",updatedAt:"2026-08-01"},
 {id:"hu_b_owner",hospitalId:"hospital_002",name:"최원장",email:"owner@haeon.demo",phone:"010-****-2001",role:"owner",status:"active",createdAt:"2026-08-01",updatedAt:"2026-08-01"},
 {id:"hu_b_nurse",hospitalId:"hospital_002",name:"정간호",email:"nurse@haeon.demo",phone:"010-****-2002",role:"nurse",status:"active",createdAt:"2026-08-01",updatedAt:"2026-08-01"},
];
export const demoOperator:OperatorUser={id:"op_001",name:"오늘안부 운영자",email:"operator@oneulanbu.demo",role:"super_admin",status:"active",createdAt:"2026-08-01"};
function read<T>(key:string):T|null{try{const v=localStorage.getItem(key);if(!v)return null;const parsed=JSON.parse(v);if(parsed.expiresAt&&Date.parse(parsed.expiresAt)<Date.now()){localStorage.removeItem(key);return null}return parsed}catch{return null}}
function sessionId(){return `session_${crypto.randomUUID?.()||Date.now()}`}
function expiry(hours:number){return new Date(Date.now()+hours*3600000).toISOString()}
export function getHospitalSession(){return typeof window==="undefined"?null:read<HospitalSession>(keys.hospital)}
export function getPatientSession(){return typeof window==="undefined"?null:read<PatientSession>(keys.patient)}
export function getOperatorSession(){return typeof window==="undefined"?null:read<OperatorSession>(keys.operator)}
export function loginHospital(email:string,password:string){const user=demoHospitalUsers.find(u=>u.email===email&&u.status==="active");if(!user||password!=="demo1234")return null;const s:HospitalSession={kind:"hospital",sessionId:sessionId(),userId:user.id,hospitalId:user.hospitalId,role:user.role,expiresAt:expiry(8)};localStorage.setItem(keys.hospital,JSON.stringify(s));audit({actorType:"hospital_user",actorId:user.id,hospitalId:user.hospitalId,action:"hospital_login",resourceType:"session",resourceId:s.sessionId});return s}
export function loginOperator(email:string,password:string){if(email!==demoOperator.email||password!=="admin1234")return null;const s:OperatorSession={kind:"operator",sessionId:sessionId(),userId:demoOperator.id,role:demoOperator.role,expiresAt:expiry(2),mfaVerified:false};localStorage.setItem(keys.operator,JSON.stringify(s));audit({actorType:"operator",actorId:demoOperator.id,action:"operator_login",resourceType:"session",resourceId:s.sessionId});return s}
export function logout(kind:"hospital"|"patient"|"operator"){localStorage.removeItem(keys[kind])}
export function createInvitation(patientId:string,hospitalId:string){const list=read<PatientInvitation[]>(keys.invites)||[];const inv:PatientInvitation={id:`invite_${Date.now()}`,patientId,hospitalId,token:`demo_${crypto.randomUUID?.().replaceAll("-","")||Date.now()}`,status:"pending",createdAt:new Date().toISOString(),expiresAt:expiry(24*7)};localStorage.setItem(keys.invites,JSON.stringify([...list,inv]));return inv}
export function findInvitation(token:string){return (read<PatientInvitation[]>(keys.invites)||[]).find(i=>i.token===token&&i.status!=="revoked"&&Date.parse(i.expiresAt)>Date.now())||null}
export function verifyPatientIdentity(token:string){const list=read<PatientInvitation[]>(keys.invites)||[];const inv=list.find(i=>i.token===token&&i.status!=="revoked"&&Date.parse(i.expiresAt)>Date.now());if(!inv)return null;const now=new Date().toISOString();localStorage.setItem(keys.invites,JSON.stringify(list.map(i=>i.id===inv.id?{...i,status:"used",usedAt:now}:i)));const s:PatientSession={kind:"patient",sessionId:sessionId(),patientId:inv.patientId,hospitalId:inv.hospitalId,expiresAt:expiry(24*30)};localStorage.setItem(keys.patient,JSON.stringify(s));audit({actorType:"patient",actorId:inv.patientId,hospitalId:inv.hospitalId,action:"patient_session_created",resourceType:"session",resourceId:s.sessionId});return s}
export function canAccessPatient(session:HospitalSession,patient:{id:string;hospitalId:string}){return session.hospitalId===patient.hospitalId}
export function canManagePatient(role:HospitalRole){return role==="owner"||role==="nurse"}
export function canFollowUp(role:HospitalRole){return role!=="staff"}
export function canManageHospitalUsers(role:HospitalRole){return role==="owner"}
export function audit(entry:Omit<AuditLog,"id"|"createdAt">){const list=read<AuditLog[]>(keys.audit)||[];localStorage.setItem(keys.audit,JSON.stringify([...list,{...entry,id:`audit_${Date.now()}_${list.length}`,createdAt:new Date().toISOString()}]))}
