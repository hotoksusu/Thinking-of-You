export type ProductArea="patient"|"hospital"|"platform_admin";
export type HospitalUserRole="hospital_owner"|"doctor"|"nurse"|"staff";
export type PlatformAdminRole="platform_admin"|"platform_support";
export const roleHome:{[K in ProductArea]:string}={patient:"/app/patient",hospital:"/hospital/dashboard",platform_admin:"/admin"};
export const hospitalPermissions:Record<HospitalUserRole,string[]>={hospital_owner:["patients:read","patients:write","staff:manage","operations:read","settings:write"],doctor:["patients:read","care_events:write"],nurse:["patients:read","patients:write","care_events:write","contacts:write"],staff:["patients:read","patients:write","contacts:write"]};
