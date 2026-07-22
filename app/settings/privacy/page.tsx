"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, ShieldCheck, Unplug } from "lucide-react";
import { useState } from "react";
import { storageKeys } from "@/lib/storage-keys";

export default function PrivacySettingsPage(){
  const [confirming,setConfirming]=useState<"info"|"family"|null>(null);
  const [message,setMessage]=useState("");
  function disconnect(){
    if(confirming==="info"){
      window.localStorage.removeItem(storageKeys.stepsPermission);
      window.localStorage.removeItem(storageKeys.usagePermission);
      setMessage("생활 정보 연결을 끊었습니다.");
    }else{
      window.localStorage.removeItem(storageKeys.trustedContacts);
      setMessage("가족 연결을 해제했습니다.");
    }
    setConfirming(null);
  }
  return <main className="min-h-[100dvh] bg-[#F7F9F6] px-5 py-5 text-[#17221B]"><div className="mx-auto max-w-[560px]"><header className="flex min-h-14 items-center gap-3"><Link href="/app?role=parent&view=profile" className="flex min-h-12 items-center gap-2 rounded-xl px-2 text-lg font-black"><ArrowLeft size={24}/>설정으로</Link></header><section className="py-6"><ShieldCheck size={44} className="text-[#2F6B46]"/><h1 className="mt-5 text-[2rem] font-black">내 정보는 내가 정할 수 있어요.</h1><p className="mt-4 text-lg font-bold leading-8 text-[#596A60]">연결할 정보와 가족에게 보이는 내용을 확인할 수 있습니다.</p><div className="mt-7 grid gap-4"><Info title="현재 연결된 정보" text="질문 답변과 답한 시간만 저장합니다."/><Info title="가족에게 보이는 내용" text="평소와 다른 흐름과 답변한 내용만 보입니다."/><Info title="가족에게 보이지 않는 내용" text="통화 내용, 문자 내용, 사진 내용은 보이지 않습니다."/></div>{message?<p className="mt-5 rounded-2xl bg-[#EAF3E5] p-5 text-lg font-black text-[#2F6B46]">{message}</p>:null}<div className="mt-7 grid gap-3"><button onClick={()=>setConfirming("info")} className="flex min-h-16 items-center justify-between rounded-2xl border-2 border-[#C8D8C5] bg-white px-5 text-left text-lg font-black"><span>정보 연결 끊기</span><Unplug size={24}/></button><button onClick={()=>setConfirming("family")} className="flex min-h-16 items-center justify-between rounded-2xl border-2 border-[#E1D6CF] bg-white px-5 text-left text-lg font-black"><span>가족 연결 해제</span><ChevronRight size={24}/></button><Link href="mailto:hello@oneulanbu.kr" className="flex min-h-16 items-center justify-center rounded-2xl bg-[#2F6B46] text-lg font-black text-white">오늘안부에 문의하기</Link></div></section></div>{confirming?<div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center"><section role="dialog" aria-modal="true" className="mx-auto w-full max-w-[520px] rounded-[28px] bg-white p-7"><h2 className="text-2xl font-black">정말 연결을 끊을까요?</h2><p className="mt-4 text-lg font-bold leading-8 text-[#596A60]">바로 처리하지 않고 한 번 더 확인합니다.</p><button onClick={disconnect} className="mt-6 min-h-16 w-full rounded-2xl bg-[#B84931] text-lg font-black text-white">네, 연결을 끊을게요</button><button onClick={()=>setConfirming(null)} className="mt-3 min-h-14 w-full text-lg font-black">계속 사용할게요</button></section></div>:null}</main>
}

function Info({title,text}:{title:string;text:string}){return <section className="rounded-[22px] bg-white p-5"><h2 className="text-xl font-black">{title}</h2><p className="mt-2 text-lg font-bold leading-8 text-[#596A60]">{text}</p></section>}
