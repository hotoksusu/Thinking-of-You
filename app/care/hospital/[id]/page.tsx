import PatientDetail from "@/components/hospital-patient-detail";
export function generateStaticParams(){return [{id:"kim"},{id:"lee"},{id:"jung"},{id:"park"}]}
export default function Page(){return <PatientDetail/>}
