import { PatientCareMvp } from "@/components/patient-care-mvp";
export default function Page(){return <div className="relative"><p className="pointer-events-none fixed left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-sm font-black text-[#587066] shadow-sm">오늘안부 데모</p><PatientCareMvp mode="checkin" demo/></div>}
