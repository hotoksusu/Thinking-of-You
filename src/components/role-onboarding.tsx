"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, HelpCircle, Home, Phone, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";

type Role = "parent" | "family";
type Step = { title:string; text:string; scene:"rest"|"empty"|"question"|"family"|"done"; cta:string };
const content:Record<Role,Step[]> = {
  parent:[
    {title:"매일 하실 일은 없습니다.",text:"평소처럼 지내시면 됩니다.",scene:"rest",cta:"다음"},
    {title:"필요한 날에만 질문 하나가 옵니다.",text:"길게 쓰거나 말씀하지 않아도 됩니다.",scene:"empty",cta:"직접 해보기"},
    {title:"오늘 몸은 어떠세요?",text:"어느 답을 눌러도 괜찮습니다.",scene:"question",cta:""},
    {title:"이게 전부입니다.",text:"답 하나만 누르면 끝납니다.",scene:"done",cta:"오늘안부 사용하기"},
  ],
  family:[
    {title:"매일 전화하지 못해도 괜찮습니다.",text:"필요한 날만 오늘안부가 먼저 알려드립니다.",scene:"rest",cta:"다음"},
    {title:"부모님은 매일 기록하지 않습니다.",text:"확인이 필요한 날에만 질문 하나에 답합니다.",scene:"question",cta:"다음"},
    {title:"가족은 달라진 날만 확인합니다.",text:"변화의 이유와 지금 할 일을 한눈에 보여드립니다.",scene:"family",cta:"가족 화면 체험하기"},
    {title:"부모님도 부담 없고, 가족도 필요한 날만 확인합니다.",text:"필요한 순간에 할 일 하나를 확인하세요.",scene:"done",cta:"오늘안부 시작하기"},
  ]
};

export function RoleOnboarding({role,initialStep=1}:{role:Role;initialStep?:number}){
  const router=useRouter(); const steps=content[role]; const [step,setStep]=useState(Math.min(Math.max(initialStep,1),steps.length));
  useEffect(()=>{try{localStorage.setItem("selectedRole",role);localStorage.setItem("onboardingVersion","2")}catch{};window.dispatchEvent(new CustomEvent("todayanbu:analytics",{detail:{name:"onboarding_view",role,step}}))},[role,step]);
  const go=(next:number)=>{setStep(next);router.push(`/for-${role}/${next}`,{scroll:false})};
  const finish=()=>{try{localStorage.setItem(`${role}OnboardingCompleted`,"true");if(role==="parent"){localStorage.setItem("parentIntroCompleted","true");localStorage.setItem("parentDemoCompleted","true")}localStorage.setItem("lastVisitedExperience",role)}catch{};window.dispatchEvent(new CustomEvent("todayanbu:analytics",{detail:{name:"onboarding_complete",role}}));router.push(`/app?role=${role}${role==="parent"?"&answered=1":""}`)};
  const current=steps[step-1];
  return <main className="flex min-h-screen flex-col bg-[#FFF9F0] text-[#20302C]">
    <header className="border-b border-[#E1E6DE] bg-white"><div className="mx-auto flex min-h-16 w-full max-w-[860px] items-center gap-3 px-4"><Link href="/" className="flex min-h-12 items-center gap-2 text-lg font-black text-[#315B3D]"><Home size={22}/> 오늘안부</Link><span className="ml-auto text-lg font-black text-[#4A5D53]">{step} / {steps.length}</span><Link href="/" aria-label="안내 닫고 홈으로" className="flex min-h-12 items-center justify-center gap-1 rounded-xl border-2 border-[#BFCBBE] bg-white px-3 text-lg font-black"><X size={22}/>닫기</Link></div></header>
    <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col px-5 py-5 sm:py-7"><div className="flex gap-2" aria-label={`${steps.length}단계 중 ${step}단계`}>{steps.map((_,i)=><span key={i} className={`h-2 flex-1 rounded-full ${i<step?"bg-[#6F9471]":"bg-[#DDE5DA]"}`}/>)}</div>
      <section key={step} className="fade-in flex flex-1 flex-col py-5 sm:py-7"><h1 className="max-w-[780px] text-[clamp(2rem,5.5vw,3.6rem)] font-black leading-[1.18] tracking-[-.03em]">{current.title}</h1><p className="mt-3 text-xl font-bold leading-8 text-[#43574D]">{current.text}</p><Scene scene={current.scene} role={role} onAnswer={()=>go(4)}/></section>
      {!(role==="parent"&&step===3)?<nav className="sticky bottom-0 -mx-5 mt-auto flex gap-3 border-t border-[#D5DED2] bg-[#FFF9F0]/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">{step>1?<button onClick={()=>go(step-1)} className="flex min-h-16 min-w-24 items-center justify-center gap-2 rounded-2xl border-2 border-[#8FA58D] bg-white px-5 text-xl font-black"><ArrowLeft/> 이전</button>:<Link href="/" className="flex min-h-16 min-w-24 items-center justify-center rounded-2xl border-2 border-[#8FA58D] bg-white px-5 text-xl font-black">홈</Link>}<button onClick={()=>step===steps.length?finish():go(step+1)} className="flex min-h-16 flex-1 items-center justify-center rounded-2xl bg-[#E9652B] px-6 text-xl font-black text-white">{current.cta}</button></nav>:<button onClick={()=>go(2)} className="mb-5 flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 border-[#8FA58D] bg-white px-5 text-xl font-black"><ArrowLeft/> 이전</button>}
    </div>
  </main>
}

function Scene({scene,role,onAnswer}:{scene:Step["scene"];role:Role;onAnswer:()=>void}){
  const [answer,setAnswer]=useState("");
  if(scene==="rest"){
    const isParent=role==="parent";
    return <div className="relative mt-6 min-h-[250px] overflow-hidden rounded-[28px] bg-[#EAF3E5] sm:min-h-[310px]"><Image src={isParent?"/brand/hero-ansimi-phone-v1.png":"/illustrations/family-guide.png"} alt={isParent?"편안히 쉬며 휴대폰으로 가족 소식을 확인하는 안심이":"부모님과 가족이 함께 안심하는 모습"} fill sizes="(max-width: 980px) 100vw, 980px" className="object-cover object-center"/><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 text-center text-xl font-black text-[#315B3D] shadow-lg">{isParent?"평소처럼 지내시면 됩니다.":"필요한 날만 확인하면 됩니다."}</div></div>;
  }
  if(scene==="empty")return <div className="relative mt-6 min-h-[250px] overflow-hidden rounded-[28px] bg-[#EAF3E5]"><Image src="/brand/hero-ansimi-phone-v1.png" alt="휴대폰으로 질문 하나를 확인하는 안심이" fill sizes="(max-width: 980px) 100vw, 980px" className="object-cover object-center"/><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 text-left text-xl font-black text-[#315B3D] shadow-lg">질문이 오면 답 하나만 누릅니다.</div></div>;
  if(scene==="question")return <div className="mt-6 rounded-[28px] bg-white p-5 shadow-[0_16px_36px_rgba(55,72,55,.08)]"><div className="grid gap-3">{["괜찮아요","조금 불편해요","오늘은 답하지 않을게요"].map(x=><button key={x} onClick={()=>{setAnswer(x);try{localStorage.setItem("parentDemoAnswer",x)}catch{};window.dispatchEvent(new CustomEvent("todayanbu:analytics",{detail:{name:"parent_demo_completed"}}));onAnswer()}} className={`min-h-[68px] rounded-2xl border-2 px-5 text-left text-xl font-black ${answer===x?"border-[#2F6B46] bg-[#EAF3E5]":"border-[#AFC0AC] bg-white"}`}>{answer===x?<Check className="mr-2 inline"/>:null}{x}</button>)}</div><p className="mt-5 text-lg font-black text-[#4A5D53]">잘못된 답은 없습니다.</p></div>;
  if(scene==="family")return <div className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_16px_36px_rgba(55,72,55,.08)]"><p className="text-xs font-black text-[#D95C24]">가족 화면</p><p className="mt-3 text-2xl font-black">오늘은 확인이 필요해요.</p><div className="mt-5 space-y-3"><Line icon={HelpCircle} label="이유" value="최근 움직임이 줄었어요"/><Line icon={Phone} label="지금 할 일" value="오늘 저녁에 전화해 보세요"/></div></div>;
  return <div className="mt-6"><div className="relative min-h-[230px] overflow-hidden rounded-[28px] bg-[#EAF3E5]"><Image src="/illustrations/family-guide.png" alt="부모님과 가족이 오늘안부로 연결된 모습" fill sizes="(max-width: 980px) 100vw, 980px" className="object-cover object-center"/></div>{role==="parent"?<div className="mt-4 grid gap-3"><Link href="/help" className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#2F6B46] bg-white px-5 text-xl font-black text-[#245C3B]">가족에게 도와달라고 하기</Link><Link href="/for-family" className="min-h-12 text-center text-lg font-black text-[#315B3D] underline underline-offset-4">가족은 무엇을 보나요?</Link></div>:<div className="mt-4 flex gap-4"><Link href="/how-it-works" className="font-black underline underline-offset-4">작동 방식</Link><Link href="/pricing" className="font-black underline underline-offset-4">요금</Link></div>}</div>;
}
function Line({icon:Icon,label,value}:{icon:typeof UsersRound;label:string;value:string}){return <div className="flex items-center gap-3 rounded-2xl bg-[#F3F7F1] p-4"><Icon className="shrink-0 text-[#52725B]"/><span className="flex-1"><small className="block font-black text-[#68756F]">{label}</small><strong className="block text-lg">{value}</strong></span></div>}
