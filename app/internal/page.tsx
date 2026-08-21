import { InternalAdmin } from "@/components/platform-demo";
import Link from "next/link";
export default function Page(){return <><InternalAdmin/><Link href="/internal/activation" className="fixed bottom-5 left-5 z-[70] rounded-xl bg-[#1d6b5b] px-4 py-3 text-sm font-black text-white shadow-xl">병원 Activation 보기</Link></>}
