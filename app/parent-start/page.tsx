"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Footprints, Home, Phone, ShieldCheck, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { storageKeys } from "@/lib/storage-keys";

export default function ParentStartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState({ activity: false, phone: false });

  function finish() {
    try {
      localStorage.setItem("selectedRole", "parent");
      localStorage.setItem("parentIntroCompleted", "true");
      localStorage.setItem("parentOnboardingCompleted", "true");
      localStorage.setItem(storageKeys.stepsPermission, checked.activity ? "guide_confirmed" : "later");
      localStorage.setItem(storageKeys.usagePermission, checked.phone ? "guide_confirmed" : "later");
      localStorage.setItem("today-anbu:parent-permission-guide", "confirmed");
    } catch {}
    router.push("/app?role=parent&answered=1");
  }

  return <main className="min-h-[100dvh] bg-[#FFF9F0] text-[#1D2D27]">
    <header className="border-b border-[#DFE6DC] bg-white">
      <div className="mx-auto flex min-h-[72px] max-w-[680px] items-center gap-3 px-4">
        <Link href="/" className="flex min-h-12 items-center gap-2 text-xl font-black text-[#315B3D]"><Home size={22} /> 오늘안부</Link>
        <span className="ml-auto text-lg font-black text-[#52635C]">{step} / 3</span>
        <Link href="/" aria-label="안내 닫기" className="flex size-12 items-center justify-center rounded-xl border-2 border-[#C5D1C2] bg-white"><X size={24} /></Link>
      </div>
    </header>

    <div className="mx-auto flex min-h-[calc(100dvh-73px)] w-full max-w-[680px] flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
      <div className="flex gap-2" aria-label={`3단계 중 ${step}단계`}>{[1,2,3].map((item) => <span key={item} className={`h-3 flex-1 rounded-full ${item <= step ? "bg-[#4D825B]" : "bg-[#DDE5DA]"}`} />)}</div>

      {step === 1 ? <section className="fade-in flex flex-1 flex-col justify-center py-7">
        <div className="mx-auto w-full text-center">
          <Image src="/brand/oneul-anbu-icon.png" alt="오늘안부" width={88} height={88} priority className="mx-auto object-contain" />
          <h1 className="mt-7 text-[clamp(2.25rem,10vw,3.35rem)] font-black leading-[1.16] tracking-[-.035em]">평소처럼<br />생활하세요.</h1>
          <p className="mt-6 text-[1.35rem] font-black leading-9 text-[#40534A]">매일 적거나 확인할 것은<br />거의 없습니다.</p>
          <p className="mt-5 text-lg font-bold leading-8 text-[#65736C]">평소와 다른 생활 변화가 있을 때만<br />가족이 확인할 수 있도록 도와드립니다.</p>
        </div>
      </section> : null}

      {step === 2 ? <PrivacyStep /> : null}

      {step === 3 ? <section className="fade-in flex flex-1 flex-col py-7">
        <p className="text-lg font-black text-[#2F6B46]">마지막 안내</p>
        <h1 className="mt-3 text-[clamp(2rem,8vw,2.85rem)] font-black leading-[1.2]">필요한 정보만<br />알기 쉽게 확인하세요.</h1>
        <p className="mt-4 text-lg font-bold leading-8 text-[#596A60]">아래 설명을 확인해도 휴대전화의 실제 권한이 바로 켜지지는 않습니다.</p>
        <div className="mt-7 grid gap-4">
          <GuideCheck checked={checked.activity} icon={Footprints} title="걷는 양" text="걷는 양의 큰 변화를 살펴보기 위한 안내입니다." onClick={() => setChecked((value) => ({ ...value, activity: !value.activity }))} />
          <GuideCheck checked={checked.phone} icon={Smartphone} title="휴대전화 사용 변화" text="사용 시간의 큰 변화만 살펴보기 위한 안내입니다." onClick={() => setChecked((value) => ({ ...value, phone: !value.phone }))} />
        </div>
        <div className="mt-6 rounded-[24px] bg-[#EAF3E5] p-5"><p className="text-xl font-black text-[#245C3B]">준비가 끝났습니다.</p><p className="mt-2 text-lg font-bold leading-8 text-[#43574D]">이제 평소처럼 지내시면 됩니다. 따로 매일 입력할 것은 없습니다.</p></div>
      </section> : null}

      <nav className="mt-auto border-t border-[#D7E0D4] bg-[#FFF9F0]/95 pt-4 backdrop-blur">
        {step === 1 ? <>
          <button type="button" onClick={() => setStep(2)} className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-6 text-[1.3rem] font-black text-white">오늘안부 시작하기 <ChevronRight size={25} /></button>
          <button type="button" onClick={() => setStep(2)} className="mt-2 min-h-14 w-full text-lg font-black text-[#52635C] underline underline-offset-4">어떤 정보를 보는지 알려주세요</button>
        </> : step === 2 ? <button type="button" onClick={() => setStep(3)} className="flex min-h-[72px] w-full items-center justify-center rounded-[22px] bg-[#2F6B46] px-6 text-[1.3rem] font-black text-white">확인했어요</button> : <button type="button" onClick={finish} className="flex min-h-[72px] w-full items-center justify-center rounded-[22px] bg-[#E9652B] px-6 text-[1.3rem] font-black text-white">오늘안부 시작하기</button>}
        {step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="mt-2 min-h-14 w-full text-lg font-black text-[#52635C]">이전으로</button> : null}
      </nav>
    </div>
  </main>;
}

function PrivacyStep() {
  const sees = ["평소보다 걷는 양이 크게 달라졌는지", "평소와 다른 움직임이 있는지", "휴대전화 사용 시간이 크게 달라졌는지"];
  const doesNotSee = ["누구에게 전화했는지", "문자나 카카오톡 내용", "어떤 영상을 봤는지", "통화 내용"];
  return <section className="fade-in flex flex-1 flex-col py-7"><span className="flex size-16 items-center justify-center rounded-[22px] bg-[#EAF3E5] text-[#2F6B46]"><ShieldCheck size={34} /></span><h1 className="mt-5 text-[clamp(2rem,8vw,2.85rem)] font-black leading-[1.2]">사생활은<br />들여다보지 않습니다.</h1><div className="mt-7 grid gap-4 sm:grid-cols-2"><InfoList title="살펴보는 것" items={sees} positive /><InfoList title="보지 않는 것" items={doesNotSee} /></div><p className="mt-6 rounded-[22px] bg-[#FFF0E6] p-5 text-xl font-black leading-8 text-[#754323]">생활 내용이 아니라<br />평소와 다른 변화만 살펴봅니다.</p></section>;
}

function InfoList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return <article className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(49,78,58,.07)]"><h2 className={`text-xl font-black ${positive ? "text-[#2F6B46]" : "text-[#72584A]"}`}>{title}</h2><ul className="mt-4 grid gap-4">{items.map((item) => <li key={item} className="flex items-start gap-3 text-lg font-bold leading-7">{positive ? <Check className="mt-0.5 shrink-0 text-[#2F6B46]" /> : <X className="mt-0.5 shrink-0 text-[#A55B3E]" />}{item}</li>)}</ul></article>;
}

function GuideCheck({ checked, icon: Icon, title, text, onClick }: { checked: boolean; icon: typeof Phone; title: string; text: string; onClick: () => void }) {
  return <button type="button" aria-pressed={checked} onClick={onClick} className={`flex min-h-[112px] w-full items-center gap-4 rounded-[24px] border-2 p-5 text-left ${checked ? "border-[#2F6B46] bg-[#EAF3E5]" : "border-[#C7D3C4] bg-white"}`}><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2F6B46]"><Icon size={29} /></span><span className="flex-1"><strong className="block text-xl font-black">{title}</strong><span className="mt-1 block text-base font-bold leading-6 text-[#5C6C64]">{text}</span></span><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${checked ? "bg-[#2F6B46] text-white" : "bg-[#EEF2EC] text-[#65736C]"}`}>{checked ? <Check size={23} /> : <ChevronRight size={23} />}</span></button>;
}
