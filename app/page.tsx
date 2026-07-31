"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, LockKeyhole, Menu, ShieldCheck, Smartphone, X } from "lucide-react";

type Role = "family" | "parent";
type State = { currentStep:number; concernType?:string; dataCardIndex:number; parentAnswer?:string; role?:Role };
const initial:State = { currentStep:0, dataCardIndex:0 };
const concerns = ["혼자 계시는 시간이 길어 걱정돼요","연락은 하지만 상태를 알기 어려워요","평소와 다른 변화를 먼저 알고 싶어요","서비스가 어떻게 작동하는지 궁금해요"];
const dataCards = [
  {title:"응답의 변화",text:"평소보다 답변이 늦어지거나 다른 응답이 이어지는지 살펴봅니다.",now:["부모님의 질문 응답","응답 여부","반복되는 답변 변화"]},
  {title:"생활 시간의 변화",text:"평소에 답하던 시간대와 최근 생활 흐름을 비교합니다.",now:["응답 시간대","가족에게 필요한 행동 추천"]},
  {title:"생활 데이터 연결",text:"걸음과 움직임, 휴대폰 사용 패턴 등 자동 생활 데이터도 순차적으로 연결합니다.",soon:["걸음 수","움직임 변화","휴대폰 사용 패턴","추가 생활 데이터"]},
];

export default function LandingPage(){
  const [state,setState]=useState<State>(initial);
  const [details,setDetails]=useState(false);
  const [answered,setAnswered]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(location.search);
    const step=Number(params.get("step")||0);
    if(step>=0&&step<=6)setState(s=>({...s,currentStep:step}));
    const pop=()=>{const n=Number(new URLSearchParams(location.search).get("step")||0);setState(s=>({...s,currentStep:n>=0&&n<=6?n:0}))};
    addEventListener("popstate",pop);return()=>removeEventListener("popstate",pop);
  },[]);
  function move(step:number,replace=false){
    const url=step?`/?step=${step}`:"/";
    history[replace?"replaceState":"pushState"]({step},"",url);
    setState(s=>({...s,currentStep:step}));
    scrollTo({top:0,behavior:"smooth"});
  }
  function back(){
    if(state.currentStep===2&&state.dataCardIndex>0){setState(s=>({...s,dataCardIndex:s.dataCardIndex-1}));return}
    move(Math.max(0,state.currentStep-1));
  }
  function answer(value:string){setState(s=>({...s,parentAnswer:value}));setAnswered(false);setTimeout(()=>setAnswered(true),650)}

  return <main className="min-h-screen bg-[#F8FAF9] text-[#17211D]">
    <Header compact={state.currentStep>0}/>
    {state.currentStep===0
      ? <LandingHero start={()=>move(1)}/>
      : <OnboardingShell step={state.currentStep} back={back}>
          {state.currentStep===1&&<ConcernStep selected={state.concernType} select={v=>setState(s=>({...s,concernType:v}))} next={()=>move(2)}/>}
          {state.currentStep===2&&<DataChangeStep concern={state.concernType} index={state.dataCardIndex} next={()=>state.dataCardIndex<2?setState(s=>({...s,dataCardIndex:s.dataCardIndex+1})):move(3)}/>}
          {state.currentStep===3&&<FamilyReportStep next={()=>move(4)}/>}
          {state.currentStep===4&&<ParentExperienceStep selected={state.parentAnswer} answered={answered} answer={answer} next={()=>move(5)}/>}
          {state.currentStep===5&&<PrivacyStep next={()=>move(6)}/>}
          {state.currentStep===6&&<FinalStartStep state={state} selectRole={role=>setState(s=>({...s,role}))} restart={()=>{setState(initial);move(0,true)}} details={details} toggleDetails={()=>setDetails(v=>!v)}/>}
        </OnboardingShell>}
  </main>
}

function Header({compact}:{compact:boolean}){
  return <header className="border-b border-[#E5EAE7] bg-white/95"><div className={`mx-auto flex min-h-[70px] items-center justify-between px-5 ${compact?"max-w-[760px]":"max-w-[1180px]"}`}><Link href="/" className="flex items-center gap-3 text-xl font-black"><Image src="/brand/brand-icon.png" alt="" width={40} height={40} className="rounded-xl"/>오늘안부</Link><nav className="hidden items-center gap-7 text-sm font-black text-[#56645D] md:flex"><Link href="/about">서비스 소개</Link><Link href="/privacy-simple">개인정보</Link><Link href="/family">로그인</Link></nav><Link href="/family" className="text-sm font-black text-[#3F6553] md:hidden">가족 화면</Link><button className="hidden" aria-label="메뉴 열기"><Menu/></button></div></header>
}

function LandingHero({start}:{start:()=>void}){
  return <section className="mx-auto flex min-h-[calc(100dvh-70px)] max-w-[720px] flex-col justify-center px-6 py-16 text-center"><p className="text-sm font-black text-[#47745F]">생활 변화 안심 서비스</p><h1 className="mt-6 text-[clamp(2.45rem,10vw,4.7rem)] font-black leading-[1.1] tracking-[-.055em]">부모님의 평소와 다른 날을<br/>먼저 알려드립니다.</h1><p className="mx-auto mt-7 max-w-[610px] text-[17px] font-semibold leading-8 text-[#5F6D66] sm:text-xl">매일 기록하거나 전화하지 않아도 괜찮습니다.<br/>오늘안부가 생활 흐름의 변화를 살펴보고<br/>필요한 날만 가족에게 알려드립니다.</p><button onClick={start} className="mx-auto mt-10 flex min-h-[60px] w-full max-w-[340px] items-center justify-center rounded-full bg-[#17372B] px-7 text-[18px] font-black text-white shadow-[0_12px_30px_rgba(23,55,43,.14)] focus:outline-none focus:ring-4 focus:ring-[#9EC4B1]">1분 만에 알아보기 <ArrowRight className="ml-2" size={20}/></button><Link href="/family" className="mt-6 text-[15px] font-bold text-[#536A5F] underline underline-offset-4">이미 사용 중이신가요? 가족 화면 열기</Link></section>
}

function OnboardingShell({step,back,children}:{step:number;back:()=>void;children:React.ReactNode}){
  return <div className="mx-auto max-w-[720px] px-5 pb-16 pt-6"><div className="flex items-center gap-4"><button onClick={back} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#D7DFDB] bg-white" aria-label="이전 단계"><ArrowLeft size={20}/></button><ProgressIndicator step={step}/></div><div key={step} className="onboarding-step mt-9">{children}</div></div>
}
function ProgressIndicator({step}:{step:number}){return <div className="flex-1" aria-label={`${step} / 6 단계`}><div className="flex justify-between text-sm font-black"><span>{step} / 6</span><span className="text-[#748079]">약 1분</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E1E7E4]"><i className="block h-full rounded-full bg-[#3D745A] transition-all" style={{width:`${step/6*100}%`}}/></div></div>}
function StepTitle({eyebrow,title,desc}:{eyebrow:string;title:string;desc?:string}){return <div><p className="text-sm font-black text-[#47745F]">{eyebrow}</p><h1 className="mt-4 text-[clamp(1.9rem,8vw,3.1rem)] font-black leading-[1.18] tracking-[-.04em]">{title}</h1>{desc&&<p className="mt-4 text-[17px] font-semibold leading-7 text-[#65716B]">{desc}</p>}</div>}
function Primary({children,onClick,disabled=false}:{children:React.ReactNode;onClick:()=>void;disabled?:boolean}){return <button onClick={onClick} disabled={disabled} className="mt-8 flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#17372B] px-5 text-[17px] font-black text-white disabled:cursor-not-allowed disabled:bg-[#C8D0CC] focus:outline-none focus:ring-4 focus:ring-[#9EC4B1]">{children}<ArrowRight className="ml-2" size={19}/></button>}

function ConcernStep({selected,select,next}:{selected?:string;select:(v:string)=>void;next:()=>void}){
  return <section><StepTitle eyebrow="먼저 알려주세요" title={"부모님이 걱정되는 순간은\n언제인가요?"} desc="가장 가까운 상황을 선택해 주세요."/><div className="mt-8 grid gap-3">{concerns.map(item=><button key={item} aria-pressed={selected===item} onClick={()=>select(item)} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left text-[17px] font-black ${selected===item?"border-[#397057] bg-[#EDF5F0]":"border-[#DDE4E0] bg-white"}`}><span className="flex items-center justify-between">{item}{selected===item&&<Check size={20}/>}</span></button>)}</div><Primary disabled={!selected} onClick={next}>오늘안부가 확인하는 변화 보기</Primary></section>
}

function DataChangeStep({concern,index,next}:{concern?:string;index:number;next:()=>void}){
  const card=dataCards[index];return <section><StepTitle eyebrow="생활 변화 확인" title={"오늘안부는\n이런 변화를 살펴봅니다."} desc={concern?.startsWith("혼자")?"혼자 계시는 부모님의 생활 흐름을 살펴봅니다.":undefined}/><article className="mt-9 rounded-[28px] border border-[#DDE5E1] bg-white p-6 shadow-[0_16px_45px_rgba(29,55,44,.07)]"><div className="flex items-center justify-between"><span className="text-sm font-black text-[#49745F]">{index+1} / 3</span><span className={`rounded-full px-3 py-1 text-xs font-black ${index===2?"bg-[#F4EEE3] text-[#84643F]":"bg-[#E8F3EC] text-[#35664F]"}`}>{index===2?"순차 연결 예정":"현재 확인 중"}</span></div><h2 className="mt-8 text-3xl font-black">{card.title}</h2><p className="mt-4 text-[18px] font-semibold leading-8 text-[#5D6B64]">{card.text}</p><div className="mt-8 grid gap-2">{(card.now||card.soon||[]).map(item=><p key={item} className="flex items-center gap-2 rounded-xl bg-[#F5F7F6] px-4 py-3 font-bold"><Check size={17} className="text-[#4B775F]"/>{item}</p>)}</div></article><Primary onClick={next}>{index===2?"가족에게 어떻게 알려주는지 보기":"다음 변화 보기"}</Primary></section>
}

function FamilyReportStep({next}:{next:()=>void}){
  return <section><StepTitle eyebrow="가족에게 보이는 내용" title={"가족에게는\n필요한 변화만 알려드립니다."}/><article className="mt-9 overflow-hidden rounded-[28px] bg-[#142C23] p-6 text-white shadow-[0_20px_55px_rgba(20,44,35,.16)]"><div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-sm font-black text-[#B3C7BD]">어머니의 최근 흐름</span><span className="rounded-full bg-[#F4E9D5] px-3 py-1 text-xs font-black text-[#76582F]">확인 권장</span></div><h2 className="mt-6 text-2xl font-black leading-9">평소와 조금 다릅니다.</h2><dl className="mt-6 grid gap-3">{[["응답 시간","평소보다 늦음"],["최근 답변","피곤하다는 응답"],["변화 지속","2일"]].map(([a,b])=><div key={a} className="flex justify-between rounded-xl bg-white/8 p-4"><dt className="text-[#B7C8C0]">{a}</dt><dd className="font-black">{b}</dd></div>)}</dl><div className="mt-4 rounded-xl bg-white p-5 text-[#17211D]"><p className="text-xs font-black text-[#4A755F]">추천 행동</p><p className="mt-2 text-lg font-black">오늘 짧게 안부 전화를 해보세요.</p></div></article><p className="mt-5 text-center text-sm font-semibold leading-6 text-[#69766F]">단순한 숫자보다 가족이 무엇을 하면 좋을지 함께 안내합니다.</p><Primary onClick={next}>부모님은 무엇을 하는지 보기</Primary></section>
}

function ParentExperienceStep({selected,answered,answer,next}:{selected?:string;answered:boolean;answer:(v:string)=>void;next:()=>void}){
  return <section><StepTitle eyebrow="부모님 화면 체험" title={"부모님은 질문이 온 날에만\n한 번 누르면 됩니다."} desc="매일 긴 내용을 기록하지 않아도 됩니다. 답하지 않는 날이 있어도 괜찮습니다."/><article className="mt-8 rounded-[28px] border border-[#DDE5E1] bg-white p-6"><p className="text-xl font-black leading-8">오늘은 평소보다 조금 피곤하신가요?</p><div className="mt-6 grid gap-3">{["괜찮아요","조금 피곤해요","오늘은 답하지 않을래요"].map(item=><button key={item} onClick={()=>answer(item)} aria-pressed={selected===item} className={`min-h-[60px] rounded-2xl border-2 text-[18px] font-black ${selected===item?"border-[#397057] bg-[#EDF5F0]":"border-[#DDE4E0]"}`}>{item}</button>)}</div>{answered&&<div role="status" className="mt-6 rounded-2xl bg-[#EDF5F0] p-5 text-center"><Check className="mx-auto text-[#397057]"/><p className="mt-2 text-xl font-black">끝났습니다.</p><p className="mt-1 font-semibold text-[#5F6D66]">오늘도 평소처럼 지내시면 됩니다.</p></div>}</article><Primary disabled={!answered} onClick={next}>개인정보 보호 방식 보기</Primary></section>
}

function PrivacyStep({next}:{next:()=>void}){
  return <section><StepTitle eyebrow="개인정보 보호" title={"부모님이 동의한 정보만\n확인합니다."}/><div className="mt-8 grid gap-4 sm:grid-cols-2"><InfoList title="확인하는 정보" good items={["부모님이 직접 답한 내용","응답 여부와 시간대","부모님이 동의한 연결 정보"]}/><InfoList title="확인하지 않는 정보" items={["통화·문자 내용","사진·음성 내용","연락처 내용","실시간 위치 추적"]}/></div><div className="mt-5 rounded-2xl bg-[#17372B] p-5 text-white"><ShieldCheck/><p className="mt-3 text-lg font-black leading-7">가족에게는 원문 전체가 아니라 필요한 변화와 확인할 내용만 보여줍니다.</p></div><p className="mt-4 text-sm font-semibold leading-6 text-[#68756F]">연결 정보는 부모님이 직접 확인하고 언제든 해제할 수 있습니다.</p><Primary onClick={next}>오늘안부 시작하기</Primary><Link href="/family-intro" className="mt-4 block text-center text-sm font-black text-[#466856] underline underline-offset-4">가족 화면 먼저 체험하기</Link></section>
}
function InfoList({title,items,good=false}:{title:string;items:string[];good?:boolean}){return <article className="rounded-2xl border border-[#DDE4E0] bg-white p-5"><h2 className="font-black">{title}</h2><ul className="mt-4 grid gap-3">{items.map(item=><li key={item} className="flex gap-2 font-semibold text-[#56645D]">{good?<Check size={18} className="text-[#397057]"/>:<X size={18} className="text-[#8A938E]"/>}{item}</li>)}</ul></article>}

function FinalStartStep({state,selectRole,restart,details,toggleDetails}:{state:State;selectRole:(r:Role)=>void;restart:()=>void;details:boolean;toggleDetails:()=>void}){
  const href=state.role==="family"?"/family-intro":"/parent-intro";
  return <section><StepTitle eyebrow="준비됐습니다" title={"부모님의 생활을\n바꾸지 않아도 됩니다."} desc="오늘안부가 평소와 다른 흐름을 살펴보고 가족에게 필요한 순간을 알려드립니다."/><div className="mt-9 rounded-[28px] border border-[#DDE5E1] bg-white p-6"><h2 className="text-xl font-black">어떤 화면으로 시작할까요?</h2><div className="mt-5 grid gap-3"><button aria-pressed={state.role==="family"} onClick={()=>selectRole("family")} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left font-black ${state.role==="family"?"border-[#397057] bg-[#EDF5F0]":"border-[#DDE4E0]"}`}>부모님을 위해 알아보는 가족</button><button aria-pressed={state.role==="parent"} onClick={()=>selectRole("parent")} className={`min-h-[64px] rounded-2xl border-2 px-5 text-left font-black ${state.role==="parent"?"border-[#397057] bg-[#EDF5F0]":"border-[#DDE4E0]"}`}>직접 사용하실 부모님</button></div>{state.role&&<Link href={href} className="mt-6 flex min-h-[56px] items-center justify-center rounded-2xl bg-[#17372B] px-5 text-[17px] font-black text-white">{state.role==="family"?"부모님과 연결 시작하기":"부모님 화면 시작하기"}<ArrowRight className="ml-2" size={19}/></Link>}</div><button onClick={restart} className="mt-5 w-full text-center text-sm font-black text-[#5C6C64] underline underline-offset-4">처음부터 다시 보기</button><ExpandableDetails open={details} toggle={toggleDetails}/></section>
}
function ExpandableDetails({open,toggle}:{open:boolean;toggle:()=>void}){return <div className="mt-10 border-t border-[#DEE5E1] pt-5"><button onClick={toggle} aria-expanded={open} className="flex min-h-[52px] w-full items-center justify-between text-left font-black">서비스를 더 자세히 알아보기<ChevronDown className={open?"rotate-180":""}/></button>{open&&<div className="onboarding-step mt-4 grid gap-3 text-sm font-semibold leading-6 text-[#5E6C65]"><p>오늘안부는 응답 여부와 시간대, 반복되는 답변의 변화를 바탕으로 생활 흐름을 안내합니다.</p><p>걸음 수, 움직임 변화, 휴대폰 사용 패턴 등은 동의 기반으로 순차 연결할 예정입니다.</p><p>부모님은 질문이 있는 날에만 짧게 답하고, 가족은 필요한 변화와 권장 행동을 확인합니다.</p><p>연결 정보는 부모님이 직접 확인하고 언제든 해제할 수 있습니다.</p><p className="rounded-xl bg-[#EEF2F0] p-4 font-black">오늘안부는 의료 진단이나 응급 구조 서비스가 아닙니다. 생활 흐름의 변화를 참고 정보로 안내합니다.</p><div className="flex flex-wrap gap-4"><Link href="/privacy-simple" className="underline">개인정보 상세 설명</Link><Link href="/help" className="underline">자주 묻는 질문</Link><Link href="/technology" className="underline">기술 설명</Link></div></div>}</div>}
