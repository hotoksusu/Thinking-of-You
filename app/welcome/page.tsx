"use client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone } from "lucide-react";

function WelcomeContent(){
  const invited=Boolean(useSearchParams().get("invite"));
  const sender=invited?"며느리 지은 님":"가족";
  return <main className="min-h-screen bg-[#FFF9F0] px-5 py-6 text-[#17251F]"><div className="mx-auto max-w-[680px]"><Link href="/" className="flex min-h-14 items-center gap-3 text-xl font-black text-[#315B3D]"><Image src="/brand/brand-icon.png" alt="" width={46} height={46} className="rounded-xl"/>오늘안부</Link><section className="mt-8 rounded-[30px] bg-white p-6 shadow-[0_16px_40px_rgba(49,78,58,.09)]"><Image src="/illustrations/family-guide.png" alt="오늘안부를 선물한 가족" width={1536} height={1024} className="aspect-[16/10] w-full rounded-[24px] object-cover"/><p className="mt-6 text-lg font-black text-[#C34D20]">가족이 보내드렸어요</p><h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">아버님,<br/>{sender}이 보내드렸어요.</h1><div className="mt-5 text-xl font-bold leading-9 text-[#40534A]"><p>매일 하실 일은 없습니다.</p><p>질문이 오는 날에만 답 하나를 눌러 주세요.</p></div><Link href="/parent-intro" className="mt-7 flex min-h-[68px] items-center justify-center rounded-2xl bg-[#E9652B] px-6 text-xl font-black text-white">30초만 해보기</Link><a href="tel:" className="mt-4 flex min-h-[60px] items-center justify-center gap-2 rounded-2xl border-2 border-[#2F6B46] text-xl font-black text-[#245C3B]"><Phone/>지은이에게 전화하기</a><p className="mt-5 text-center text-lg font-black text-[#52635A]">지금 가입되거나 결제되지 않습니다.</p></section></div></main>;
}
export default function WelcomePage(){return <Suspense fallback={<main className="min-h-screen bg-[#FFF9F0]"/>}><WelcomeContent/></Suspense>}
