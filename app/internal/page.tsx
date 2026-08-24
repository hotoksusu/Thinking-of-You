import { InternalAdmin } from "@/components/platform-demo";
import Link from "next/link";
export default function Page(){return <><InternalAdmin/><div className="fixed bottom-5 left-5 z-[70] flex gap-2"><Link href="/internal/activation" className="rounded-xl bg-white px-4 py-3 text-sm font-black text-[#1d6b5b] shadow-xl">병원 Activation</Link><Link href="/internal/retention" className="rounded-xl bg-[#1d6b5b] px-4 py-3 text-sm font-black text-white shadow-xl">환자 이탈 Funnel</Link></div></>}
