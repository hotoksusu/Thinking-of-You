import {evaluatePatientStatus,type StatusInput} from "@/lib/status-rules";
import type {ReasonCode} from "@/domain/care-events";
export type PriorityResult={patientId:string;level:"stable"|"watch"|"needs_attention";reasonCodes:ReasonCode[];explanation:string;ruleVersion:string;createdAt:string};
export type PrioritizationContext={current:StatusInput;previous?:StatusInput};
export interface PrioritizationProvider{evaluate(context:PrioritizationContext):PriorityResult}
export const DEMO_RULE_VERSION="demo-v1";
export class RuleBasedPrioritizationProvider implements PrioritizationProvider{evaluate({current,previous}:PrioritizationContext):PriorityResult{const result=evaluatePatientStatus(current,previous),codes:ReasonCode[]=[];if(typeof current.painScore==="number")codes.push(typeof previous?.painScore==="number"&&current.painScore!==previous.painScore?"pain_change":"pain_score");if(previous&&current.mobility!==previous.mobility)codes.push("mobility_change");else codes.push("mobility_level");if(current.hasConcern)codes.push("new_concern");return{patientId:result.patientId,level:result.level,reasonCodes:[...new Set(codes)],explanation:result.reason,ruleVersion:DEMO_RULE_VERSION,createdAt:result.updatedAt}}}
export const prioritizationProvider:PrioritizationProvider=new RuleBasedPrioritizationProvider();
