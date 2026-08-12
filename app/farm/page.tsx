import Link from "next/link";
import { ArrowLeft, ChevronRight, Leaf, Sun } from "lucide-react";
import { getGardenView } from "@/lib/garden";

const garden=getGardenView({baselineActivityRatio:81,recentTrend:"up",rhythmStability:84});
export default function GardenPage(){return <main className="min-h-screen bg-[#F5F8F2] px-5 py-5 text-[#17221B]"><div className="mx-auto max-w-[620px]"><header className="flex items-center justify-between"><Link href="/app?role=parent" className="flex size-12 items-center justify-center rounded-full bg-white" aria-label="돌아가기"><ArrowLeft/></Link><div className="text-center"><p className="text-sm font-black text-[#64806A]">생활 흐름을 담는</p><h1 className="text-2xl font-black">오늘안부 정원</h1></div><span className="size-12"/></header>
  <section className="mt-6 overflow-hidden rounded-[32px] border border-[#CFE0CA] bg-gradient-to-b from-[#E9F6F2] to-[#E7F1DA] p-7 text-center shadow-[0_18px_42px_rgba(49,78,58,.1)]"><Sun className="ml-auto text-[#E9A94C]" size={42}/><div className="mt-3 flex min-h-56 items-end justify-center gap-2 rounded-[28px] bg-white/35 px-4 pb-8" aria-label={`정원 단계 ${garden.visualStage}`}><span className="text-7xl">🌳</span>{garden.symbols.map((s,i)=><span key={i} className={`${i%2?"text-5xl":"text-4xl"}`}>{s}</span>)}</div><p className="mt-7 text-sm font-black text-[#52725B]">오늘의 생활 흐름</p><h2 className="mt-2 text-3xl font-black leading-tight">{garden.title}</h2><p className="mt-4 text-xl font-bold leading-9 text-[#586A60]">{garden.message}</p></section>
  <section className="mt-5 rounded-[24px] bg-white p-6"><p className="flex items-center gap-2 text-xl font-black text-[#315B3D]"><Leaf/>부모님의 생활 흐름이<br/>작은 정원에 차곡차곡 담깁니다.</p><p className="mt-4 font-bold leading-7 text-[#68766F]">많이 걷거나 매일 앱을 열어야 자라는 정원이 아닙니다. 몸이 편하지 않은 날에도 정원은 시들거나 사라지지 않아요.</p></section>
  <Link href="/family/care/recovery" className="mt-5 flex min-h-16 items-center justify-between rounded-[20px] bg-[#1F6F7A] px-6 text-lg font-black text-white">생활 변화 자세히 보기 <ChevronRight/></Link>
  <p className="mt-5 text-center text-sm font-bold leading-6 text-[#748078]">정원은 의료적 회복 수준을 판단하지 않습니다.<br/>복잡한 생활 흐름을 편안하게 보여주는 보조 화면입니다.</p>
</div></main>}
