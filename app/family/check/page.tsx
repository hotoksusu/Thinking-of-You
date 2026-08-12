"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { FamilyCheck } from "@/types/care";

const methods = [["call","전화했어요"],["visit","직접 만났어요"],["video","영상통화했어요"],["family","다른 가족이 확인했어요"]] as const;
const statuses = [["normal","평소와 같아요"],["tired","조금 피곤해 보여요"],["uncomfortable","몸이 불편하다고 해요"],["hospital_visit","병원에 다녀왔어요"],["unknown","잘 모르겠어요"]] as const;
const key="oneul-anbu-family-checks";

export default function FamilyCheckPage(){
  const [step,setStep]=useState<1|2|3>(1); const [method,setMethod]=useState<FamilyCheck["method"]>(); const [status,setStatus]=useState<FamilyCheck["status"]>(); const [memo,setMemo]=useState(""); const [records,setRecords]=useState<FamilyCheck[]>([]);
  useEffect(()=>{try{setRecords(JSON.parse(localStorage.getItem(key)??"[]"))}catch{setRecords([])}},[]);
  function save(){if(!method||!status)return;const next=[{date:new Date().toISOString(),method,status,memo:memo.trim()||undefined},...records];localStorage.setItem(key,JSON.stringify(next));setRecords(next);setStep(3)}
  return <main className="min-h-screen bg-[#F7F9F6] px-5 py-5 text-[#17221B]"><div className="mx-auto max-w-[620px]">
    <Link href="/family/care" className="inline-flex min-h-12 items-center gap-2 font-black text-[#52635C]"><ArrowLeft size={21}/>Care</Link>
    {step===3?<section className="mt-16 rounded-[28px] bg-white p-7 text-center shadow-sm"><CheckCircle2 className="mx-auto text-[#2F6B46]" size={58}/><h1 className="mt-5 text-3xl font-black">가족 확인을 기록했어요.</h1><p className="mt-3 font-bold leading-7 text-[#657069]">병원 방문용 리포트의 가족 확인 기록에 반영할 수 있습니다.</p><Link href="/family/report" className="mt-6 flex min-h-14 items-center justify-center rounded-2xl bg-[#1F6F7A] font-black text-white">리포트 보기</Link><button onClick={()=>{setMethod(undefined);setStatus(undefined);setMemo("");setStep(1)}} className="mt-2 min-h-12 w-full font-black text-[#52635C]">하나 더 기록하기</button></section>:
    <><header className="mt-5"><p className="text-sm font-black text-[#1F6F7A]">가족 확인 · {step}/2</p><h1 className="mt-2 text-3xl font-black">{step===1?"어떻게 확인하셨어요?":"부모님 상태는 어땠나요?"}</h1></header>
    {step===1?<div className="mt-6 grid gap-3">{methods.map(([value,label])=><button key={value} onClick={()=>{setMethod(value);setStep(2)}} className="min-h-16 rounded-[20px] border-2 border-[#D8E4DC] bg-white px-5 text-left text-lg font-black">{label}</button>)}</div>:<div className="mt-6"><div className="grid gap-3">{statuses.map(([value,label])=><button key={value} onClick={()=>setStatus(value)} className={`min-h-16 rounded-[20px] border-2 px-5 text-left text-lg font-black ${status===value?"border-[#1F6F7A] bg-[#EAF6F7] text-[#174E54]":"border-[#D8E4DC] bg-white"}`}>{label}</button>)}</div><textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="메모 (선택)" className="mt-4 min-h-24 w-full rounded-[18px] border-2 border-[#D8E4DC] bg-white p-4 font-bold"/><button disabled={!status} onClick={save} className="mt-4 min-h-16 w-full rounded-[20px] bg-[#D95423] text-xl font-black text-white disabled:bg-[#BBC6BD]">기록 완료</button></div>}</>}
  </div></main>
}
