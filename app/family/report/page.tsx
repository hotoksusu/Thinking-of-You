"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Download, Footprints, Phone, Share2 } from "lucide-react";
import type { FamilyCheck } from "@/types/care";

const metrics = [
  ["활동", "평소 평균 4,200보", "최근 평균 3,350보", "평소 대비 20% 감소"],
  ["외출", "평소 주 5일", "최근 주 4일", "최근 외출 횟수 감소"],
  ["휴대전화 활동", "개인 평소 사용 흐름", "최근 2주 사용 감소", "짧아진 흐름이 이어짐"],
  ["생활 리듬", "평소 활동 시작 시간", "최근 5일 시작이 늦음", "평소보다 늦어진 흐름"],
] as const;

export default function FamilyReportPage(){
  const [checks,setChecks]=useState<FamilyCheck[]>([]);
  useEffect(()=>{try{setChecks(JSON.parse(localStorage.getItem("oneul-anbu-family-checks")??"[]"))}catch{setChecks([])}},[]);
  async function share(){
    const data={title:"김정희님 최근 30일 생활 변화",text:"병원 방문 전 참고할 오늘안부 생활 변화 리포트입니다.",url:window.location.href};
    if(navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(window.location.href);
  }
  return <main className="min-h-screen bg-[#EEF2ED] px-4 py-5 text-[#17221B] print:bg-white print:p-0"><div className="mx-auto max-w-[794px]">
    <div className="mb-4 flex items-center justify-between print:hidden"><Link href="/family/care" className="inline-flex min-h-12 items-center gap-2 font-black text-[#52635C]"><ArrowLeft size={21}/>Care</Link><span className="rounded-full bg-[#FFF0E6] px-3 py-2 text-sm font-black text-[#B95327]">체험용 데이터</span></div>
    <article className="min-h-[1040px] rounded-[8px] bg-white p-6 shadow-xl print:min-h-0 print:rounded-none print:p-8 print:shadow-none sm:p-10">
      <header className="border-b-2 border-[#173F46] pb-6"><p className="text-sm font-black text-[#1F6F7A]">오늘안부 Care · 병원 방문 참고자료</p><h1 className="mt-2 text-3xl font-black">김정희님 퇴원 후 생활변화 리포트</h1><div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold sm:grid-cols-3"><p><span className="block text-[#78827C]">대상</span>김정희님</p><p><span className="block text-[#78827C]">관찰기간</span>2026.08.01 ~ 2026.08.30</p><p><span className="block text-[#78827C]">비교 기준</span>개인의 평소 생활</p></div></header>
      <section className="mt-6 grid gap-3 sm:grid-cols-2">{metrics.map(([title,baseline,recent,signal])=><article key={title} className="rounded-[18px] border border-[#DDE5DD] p-5"><div className="flex items-center gap-2"><Footprints size={19} className="text-[#1F6F7A]"/><h2 className="font-black">{title}</h2></div><p className="mt-4 text-sm font-bold text-[#78827C]">평소</p><p className="font-black">{baseline}</p><p className="mt-3 text-sm font-bold text-[#78827C]">최근</p><p className="font-black">{recent}</p><p className="mt-4 rounded-xl bg-[#FFF0E6] p-3 font-black text-[#A54824]">{signal}</p></article>)}</section>
      <section className="mt-6"><h2 className="text-xl font-black">가족 확인 기록</h2><div className="mt-3 divide-y divide-[#E4E9E3] rounded-[18px] border border-[#DDE5DD] px-5">{(checks.length?checks:[{date:"2026-08-12",method:"call",status:"normal"},{date:"2026-08-19",method:"visit",status:"tired"}] as FamilyCheck[]).slice(0,4).map((c,i)=><p key={`${c.date}-${i}`} className="flex gap-4 py-4 font-bold"><span className="shrink-0 text-[#1F6F7A]">{formatDate(c.date)}</span>{methodLabel[c.method]} · {statusLabel[c.status]}{c.memo?` · ${c.memo}`:""}</p>)}</div></section>
      <section className="mt-6 rounded-[18px] bg-[#EAF6F7] p-5"><h2 className="text-xl font-black">전체 변화</h2><p className="mt-3 font-bold leading-7 text-[#49666A]">퇴원 직후 감소했던 활동량이 점차 평소 수준으로 회복되고 있습니다.</p></section>
      <section className="mt-6 rounded-[18px] bg-[#F1F5F0] p-5"><p className="flex gap-2 font-black"><CheckCircle2 className="shrink-0 text-[#2F6B46]"/>확인 원칙</p><p className="mt-3 font-bold leading-7 text-[#657069]">본 자료는 생활 변화 참고 정보이며 의료진의 진단을 대신하지 않습니다. 질병명, 위험 확률 또는 응급 여부를 판단하지 않습니다.</p></section>
    </article>
    <div className="mt-4 grid grid-cols-2 gap-3 print:hidden"><button onClick={()=>window.print()} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#173F46] font-black text-white"><Download size={20}/>PDF로 저장</button><button onClick={share} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#9AB5B7] bg-white font-black text-[#173F46]"><Share2 size={20}/>가족에게 공유</button></div>
    <p className="mt-3 text-center text-sm font-bold text-[#6C766E] print:hidden"><Phone size={16} className="mr-1 inline"/>브라우저 인쇄 화면에서 ‘PDF로 저장’을 선택하세요.</p>
  </div></main>
}

const methodLabel={call:"전화 확인",visit:"직접 방문",video:"영상통화",family:"다른 가족 확인"} as const;
const statusLabel={normal:"평소와 같음",tired:"조금 피곤해 보임",uncomfortable:"몸이 불편하다고 함",hospital_visit:"병원에 다녀옴",unknown:"잘 모르겠음"} as const;
function formatDate(value:string){const d=new Date(value);return `${d.getMonth()+1}월 ${d.getDate()}일`}
