import { HeartPulse } from "lucide-react";
export function PatientPreviewLoading({demo=true}:{demo?:boolean}) {
 return <main aria-busy="true" aria-label="환자 화면 준비 중" className="min-h-[100dvh] bg-[#F1F0E9] px-5 pb-28 text-[#202923] [font-size:18px]"><div className="mx-auto max-w-[640px]">
 {demo ? <div className="pt-4 text-center"><span className="inline-flex rounded-full bg-white px-3 py-1 text-base font-black text-[#587066]">오늘안부 데모</span></div> : null}
 <header className="flex items-center gap-2 py-5 text-xl font-black text-[#315E50]"><HeartPulse aria-hidden/>오늘안부 Care</header>
 <section className="rounded-[28px] bg-white p-6 sm:p-8"><div className="h-7 rounded-lg bg-[#E8F1EA]"/><div className="mt-3 h-8 w-4/5 rounded-lg bg-[#E8F1EA]"/><div className="mt-6 border-t border-[#DDE5DF] pt-6"><div className="h-20 rounded-lg bg-[#E8F1EA]"/><div className="mt-3 h-16 rounded-lg bg-[#F1F0E9]"/><div className="mt-2 h-7 w-1/2 rounded-lg bg-[#E8F1EA]"/><div className="mt-6 h-16 rounded-2xl bg-[#E8F1EA]"/></div><div className="mt-5 h-7 rounded-lg bg-[#F1F0E9]"/><div className="mt-1 h-14 rounded-lg bg-[#F1F0E9]"/></section>
 </div></main>;
}
