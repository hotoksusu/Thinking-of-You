import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const points = [{label:"퇴원 직후",value:35},{label:"1주 후",value:52},{label:"2주 후",value:68},{label:"현재",value:81}];

export default function RecoveryPage(){return <main className="min-h-screen bg-[#F7F9F6] px-5 py-5 text-[#17221B]"><div className="mx-auto max-w-[620px]">
  <Link href="/family/care" className="inline-flex min-h-12 items-center gap-2 font-black text-[#52635C]"><ArrowLeft size={21}/>Care</Link>
  <header className="mt-5"><p className="text-sm font-black text-[#1F6F7A]">퇴원 후 생활 확인</p><h1 className="mt-2 text-3xl font-black leading-tight">집으로 돌아오신 뒤의<br/>생활 변화를 봅니다.</h1><p className="mt-3 font-bold leading-7 text-[#657069]">퇴원일 2026.07.20 · 관찰기간 30일</p></header>
  <section className="mt-7 rounded-[28px] bg-white p-6 shadow-sm"><h2 className="text-xl font-black">평소 활동으로 돌아오는 흐름</h2><div className="mt-7 space-y-5">{points.map((p,i)=><div key={p.label}><div className="mb-2 flex justify-between font-black"><span>{p.label}</span><span className="text-[#1F6F7A]">평소의 {p.value}%</span></div><div className="h-4 overflow-hidden rounded-full bg-[#E6ECE6]"><div className="h-full rounded-full bg-[#65A59B]" style={{width:`${p.value}%`}}/></div>{i<points.length-1?<span className="ml-5 block h-4 w-0.5 bg-[#D8E5DD]"/>:null}</div>)}</div></section>
  <section className="mt-5 rounded-[24px] bg-[#EAF3E5] p-6"><p className="flex items-center gap-2 text-xl font-black text-[#315B3D]"><CheckCircle2/>조금씩 평소 생활로 돌아오고 있어요.</p><p className="mt-3 font-bold leading-7 text-[#58705D]">최근 일주일 동안 회복 속도가 빨라졌습니다.</p></section>
  <p className="mt-5 rounded-[20px] bg-[#FFF4EA] p-5 font-bold leading-7 text-[#694A38]">회복 속도는 개인마다 다릅니다. 불편하거나 걱정되는 증상이 있다면 의료진과 상담해 주세요.</p>
</div></main>}
