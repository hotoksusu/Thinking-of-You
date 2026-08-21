import { PatientStatus } from "@/components/patient-status";
export function generateStaticParams(){return ["invalid-link","expired","connected","completed"].map(state=>({state}))}
export default async function Page({params}:{params:Promise<{state:string}>}){return <PatientStatus state={(await params).state}/>}
