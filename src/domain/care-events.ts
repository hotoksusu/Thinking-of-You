export type DataSource="patient"|"guardian"|"hospital_staff"|"system"|"wearable"|"emr";
export type ConcernStatus="none"|"reported"|"unanswered";
export type ActionType="phone_call"|"additional_monitoring"|"visit_recommended"|"no_action_needed"|"other";
export type OutcomeCategory="no_issue"|"continue_monitoring"|"visit_guidance"|"escalated_to_clinician"|"unreachable"|"other";
export type StaffDecision="needs_contact"|"monitor"|"no_action";
export type ReasonCode="pain_score"|"pain_change"|"mobility_level"|"mobility_change"|"new_concern"|"repeated_concern"|"day_comparison"|"missed_checkin";

export interface PatientEpisode {id:string;patientId:string;hospitalId:string;bodyRegion:string;bodyPart:string;laterality:string;conditionCategory:string;procedureCategory:string;procedureDetail:string;customProcedureName:string;surgeryDate:string;dischargeDate:string;createdAt:string;updatedAt:string;source:DataSource;dataScope:"operational"|"demo"}
export interface ClinicalWorkflowDecision {id:string;episodeId:string;checkInId:string;displayedPriority:string;displayedReasons:ReasonCode[];staffDecision:StaffDecision;ruleVersion:string;createdAt:string;source:"hospital_staff"}

