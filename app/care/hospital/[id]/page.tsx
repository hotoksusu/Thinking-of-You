import PatientDetail from "@/components/hospital-patient-detail";
export function generateStaticParams(){return ["kim","lee","jung","park",...Array.from({length:12},(_,index)=>`patient_${String(index+1).padStart(3,"0")}`)].map(id=>({id}))}
export default function Page(){return <PatientDetail/>}
