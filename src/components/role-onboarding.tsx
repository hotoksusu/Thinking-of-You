"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, BellOff, Check, HelpCircle, Home, Phone, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";

type Role = "parent" | "family";
type Step = { title:string; text:string; scene:"rest"|"empty"|"question"|"family"|"done"; cta:string };
const content:Record<Role,Step[]> = {
  parent:[
    {title:"매일 기록하지 않아도 됩니다.",text:"평소처럼 생활하시면 됩니다.",scene:"rest",cta:"다음"},
    {title:"오늘 하실 일이 없으면 아무것도 누르지 않아도 됩니다.",text:"필요한 날에만 오늘안부가 먼저 알려드립니다.",scene:"empty",cta:"다음"},
    {title:"질문이 오면 답 하나만 눌러 주세요.",text:"길게 쓰거나 말하지 않아도 됩니다.",scene:"question",cta:"질문 체험하기"},
    {title:"답변해 주셔서 고맙습니다.",text:"이제 평소처럼 하루를 보내세요.",scene:"done",cta:"오늘안부 시작하기"},
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
  const finish=()=>{try{localStorage.setItem(`${role}OnboardingCompleted`,"true");localStorage.setItem("lastVisitedExperience",role)}catch{};window.dispatchEvent(new CustomEvent("todayanbu:analytics",{detail:{name:"onboarding_complete",role}}));router.push(`/app?role=${role}`)};
  const current=steps[step-1];
  return <main className="flex min-h-screen flex-col bg-[#FFF9F0] text-[#20302C]">
    <header className="border-b border-[#E1E6DE] bg-white"><div className="mx-auto flex min-h-16 w-full max-w-[860px] items-center gap-3 px-4"><Link href="/" className="flex min-h-11 items-center gap-2 font-black text-[#315B3D]"><Home size={20}/> 오늘안부</Link><span className="ml-auto text-sm font-black text-[#68756F]">{role==="parent"?"부모님 사용법":"가족 사용법"} · {step} / {steps.length}</span><Link href="/" aria-label="안내 닫고 홈으로" className="flex size-11 items-center justify-center rounded-xl border border-[#D7DED4] bg-white"><X/></Link></div></header>
    <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col px-5 py-5 sm:py-7"><div className="flex gap-2" aria-label={`${steps.length}단계 중 ${step}단계`}>{steps.map((_,i)=><span key={i} className={`h-2 flex-1 rounded-full ${i<step?"bg-[#6F9471]":"bg-[#DDE5DA]"}`}/>)}</div>
      <section key={step} className="fade-in flex flex-1 flex-col py-6 sm:py-8"><p className="text-sm font-black text-[#D95C24]">{step}단계</p><h1 className="mt-3 max-w-[780px] text-[clamp(2rem,5.5vw,3.6rem)] font-black leading-[1.16] tracking-[-.035em]">{current.title}</h1><p className="mt-3 text-lg font-bold leading-8 text-[#5E6C66] sm:text-xl">{current.text}</p><Scene scene={current.scene} role={role}/></section>
      <nav className="sticky bottom-0 -mx-5 mt-auto flex gap-3 border-t border-[#E1E6DE] bg-[#FFF9F0]/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">{step>1?<button onClick={()=>go(step-1)} className="flex min-h-16 min-w-24 items-center justify-center gap-2 rounded-2xl border-2 border-[#AFC0AC] bg-white px-5 text-lg font-black"><ArrowLeft/> 이전</button>:<Link href="/" className="flex min-h-16 min-w-24 items-center justify-center rounded-2xl border-2 border-[#AFC0AC] bg-white px-5 text-lg font-black">홈으로</Link>}<button onClick={()=>step===steps.length?finish():go(step+1)} className="flex min-h-16 flex-1 items-center justify-center rounded-2xl bg-[#E9652B] px-6 text-xl font-black text-white">{current.cta}</button></nav>
    </div>
  </main>
}

function Scene({scene,role}:{scene:Step["scene"];role:Role}){
  const [answer,setAnswer]=useState("");
  if(scene==="rest"){
    const isParent=role==="parent";
    return <div className="relative mt-6 min-h-[250px] overflow-hidden rounded-[28px] bg-[#EAF3E5] sm:min-h-[310px]"><Image src={isParent?"/brand/hero-ansimi-phone-v1.png":"/illustrations/family-guide.png"} alt={isParent?"편안히 쉬며 휴대폰으로 가족 소식을 확인하는 안심이":"부모님과 가족이 함께 안심하는 모습"} fill sizes="(max-width: 980px) 100vw, 980px" className="object-cover object-center"/><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 text-center text-xl font-black text-[#315B3D] shadow-lg">{isParent?"평소처럼 지내시면 됩니다.":"필요한 날만 확인하면 됩니다."}</div></div>;
  }
  if(scene==="empty")return <div className="mt-6 flex min-h-[230px] flex-col items-center justify-center rounded-[28px] bg-[#EAF3E5] p-7 text-center"><span className="flex size-20 items-center justify-center rounded-full bg-white text-[#315B3D] shadow-sm"><BellOff size={42}/></span><p className="mt-5 text-2xl font-black">오늘은 하실 일이 없어요.</p><p className="mt-2 text-lg font-bold text-[#68756F]">편안한 하루 보내세요.</p></div>;
  if(scene==="question")return <div className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_16px_36px_rgba(55,72,55,.08)]"><p className="text-xs font-black text-[#D95C24]">질문 하나</p><p className="mt-3 text-2xl font-black">오늘은 평소보다 조금 피곤하신가요?</p><div className="mt-5 grid gap-3">{["괜찮아요","조금 피곤해요","오늘은 답하지 않을게요"].map(x=><button key={x} onClick={()=>setAnswer(x)} className={`min-h-16 rounded-2xl border-2 px-5 text-left text-lg font-black ${answer===x?"border-[#2F6B46] bg-[#EAF3E5]":"border-[#DDE4DA] bg-white"}`}>{answer===x?<Check className="mr-2 inline"/>:null}{x}</button>)}</div>{answer?<p role="status" className="mt-4 font-black text-[#2F6B46]">답변이 저장됐어요.</p>:null}</div>;
  if(scene==="family")return <div className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_16px_36px_rgba(55,72,55,.08)]"><p className="text-xs font-black text-[#D95C24]">가족 화면</p><p className="mt-3 text-2xl font-black">오늘은 확인이 필요해요.</p><div className="mt-5 space-y-3"><Line icon={HelpCircle} label="이유" value="최근 움직임이 줄었어요"/><Line icon={Phone} label="지금 할 일" value="오늘 저녁에 전화해 보세요"/></div></div>;
  return <div className="relative mt-6 min-h-[250px] overflow-hidden rounded-[28px] bg-[#EAF3E5] sm:min-h-[300px]"><Image src="/illustrations/family-guide.png" alt="부모님과 가족이 오늘안부로 연결된 모습" fill sizes="(max-width: 980px) 100vw, 980px" className="object-cover object-center"/><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 text-center shadow-lg"><p className="text-2xl font-black text-[#315B3D]">안내가 끝났어요.</p>{role==="parent"?<Link href="/for-family" className="mt-2 inline-block font-black text-[#315B3D] underline underline-offset-4">가족 화면 알아보기</Link>:<div className="mt-2 flex justify-center gap-5"><Link href="/how-it-works" className="font-black underline underline-offset-4">작동 방식</Link><Link href="/pricing" className="font-black underline underline-offset-4">요금</Link></div>}</div></div>;
}
function Line({icon:Icon,label,value}:{icon:typeof UsersRound;label:string;value:string}){return <div className="flex items-center gap-3 rounded-2xl bg-[#F3F7F1] p-4"><Icon className="shrink-0 text-[#52725B]"/><span className="flex-1"><small className="block font-black text-[#68756F]">{label}</small><strong className="block text-lg">{value}</strong></span></div>}
