import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import { PatientEntryRedirect } from "@/components/patient-entry-redirect";
export default function Gateway() {
 return <main className="min-h-[100dvh] overflow-x-hidden bg-[#F4F2EB] px-5 text-[#202923]">
 <PatientEntryRedirect />
 <link rel="preload" as="image" href="/assets/characters/care-companion.webp" />
 <div className="mx-auto flex min-h-[100dvh] max-w-[1080px] flex-col">
 <header className="flex min-h-16 items-center justify-between border-b border-[#DDE2DC]"><Link href="/" className="flex items-center gap-3 text-xl font-black text-[#29483D]"><span className="grid size-10 place-items-center rounded-xl bg-[#315E50] text-white"><HeartPulse size={21}/></span>오늘안부</Link><Link href="/company" className="font-bold text-[#52645B]">오늘안부 소개</Link></header>
 <section className="flex flex-1 flex-col items-center justify-center py-10 text-center sm:py-16">
 <div className="max-w-[760px]"><p className="text-lg font-black text-[#315E50]">퇴원 후 회복을 잇는 오늘안부</p><h1 className="mt-4 text-[2.35rem] font-black leading-[1.18] tracking-[-.035em] sm:text-[3.6rem]">정형외과 수술 후,<br/>퇴원 뒤 회복까지 함께 확인합니다.</h1><p className="mt-5 text-lg font-semibold leading-8 text-[#52645B] sm:text-xl sm:leading-9">환자는 하루 1분 상태를 기록하고,<br/>병원은 회복 변화를 확인합니다.</p></div>
 <div className="mt-9 max-w-[520px]"><p className="text-lg font-bold leading-8 text-[#52645B]">환자 화면을 미리 확인해보세요.<br/>오늘 상태를 어떻게 기록하는지 볼 수 있습니다.</p><Link href="/demo/patient" prefetch className="mt-4 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#315E50] px-7 text-xl font-black text-white transition hover:bg-[#29483D] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#D6A278]">환자 화면 미리보기 <ArrowRight size={22}/></Link></div>
 <Link href="/hospital" className="mt-6 inline-flex min-h-12 flex-wrap items-center justify-center gap-1 text-base font-bold text-[#52645B] underline-offset-4 hover:underline">병원 관계자이신가요? 병원용 서비스 보기 <ArrowRight size={18}/></Link>
 </section></div></main>;
}
