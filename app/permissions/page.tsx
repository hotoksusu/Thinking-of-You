"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Footprints, Phone, ShieldCheck } from "lucide-react";
import { storageKeys } from "@/lib/storage-keys";

const supportStatus = [["질문 응답", "현재 지원"], ["응답 시간대", "현재 지원"], ["생활 시간대 비교", "테스트 중"], ["걸음과 움직임", "준비 중"], ["통화 활동", "준비 중"], ["수면", "향후 지원"]] as const;

const permissions = [
  {
    key: storageKeys.stepsPermission,
    icon: Footprints,
    title: "질문 응답을 저장할까요?",
    purpose: "한 번의 답보다 반복되는 응답 흐름을 살펴보기 위해 사용합니다.",
    shared: "가족에게는 단일 답변보다 반복되는 변화와 맥락을 중심으로 안내합니다.",
    excluded: "답하기 어려운 날에는 건너뛸 수 있습니다.",
    action: "질문 응답 저장에 동의하기",
  },
  {
    key: storageKeys.usagePermission,
    icon: Phone,
    title: "응답 시간대를 확인할까요?",
    purpose: "질문에 답한 시간대가 평소와 달라지는지 테스트하기 위해 사용합니다.",
    shared: "가족에게는 원본 시간이 아닌 반복되는 변화만 요약합니다.",
    excluded: "통화 내용, 문자 내용, 사진 내용, 개인 대화 내용은 확인하지 않습니다.",
    action: "응답 시간대 확인에 동의하기",
  },
] as const;

export default function PermissionGuidePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = permissions[step];
  const Icon = current.icon;

  function choose(value: "granted" | "later") {
    window.localStorage.setItem(current.key, value);
    if (step < permissions.length - 1) setStep(step + 1);
    else router.push("/app?role=parent");
  }

  return (
    <main className="min-h-[100dvh] bg-[#F7F9F6] px-5 py-6 text-[#17221B]">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[560px] flex-col">
        <p className="text-lg font-black text-[#477052]">생활 정보 연결 {step + 1} / 2</p>
        <div className="flex flex-1 flex-col justify-center py-6">
          <span className="flex size-20 items-center justify-center rounded-[26px] bg-[#EAF3E5] text-[#2F6B46]"><Icon size={39} /></span>
          <h1 className="mt-6 text-[2.15rem] font-black leading-tight">{current.title}</h1>
          <div className="mt-7 grid gap-3 text-lg font-bold leading-8">
            <p className="rounded-2xl bg-white p-5"><strong className="block text-[#2F6B46]">왜 필요한가요?</strong>{current.purpose}</p>
            <p className="rounded-2xl bg-white p-5"><strong className="block text-[#2F6B46]">가족에게는</strong>{current.shared}</p>
            <p className="flex items-start gap-3 rounded-2xl bg-[#EEF4EE] p-5"><ShieldCheck className="mt-1 shrink-0 text-[#2F6B46]" />{current.excluded}</p>
          </div>
          <p className="mt-4 text-base font-bold leading-7 text-[#5F6D65]">동의는 나중에 언제든 철회할 수 있습니다. 현재 체험에서는 실제 정보 대신 연결 선택 상태만 저장됩니다.</p>
          <details className="mt-5 rounded-[22px] bg-white p-5">
            <summary className="cursor-pointer text-lg font-black text-[#2F6B46]">현재 지원 상태 보기</summary>
            <div className="mt-4 grid gap-2">{supportStatus.map(([name, status]) => <div key={name} className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F8F3] px-4 py-3 font-bold"><span>{name}</span><span className="text-sm text-[#52705A]">{status}</span></div>)}</div>
            <p className="mt-4 font-bold leading-7 text-[#52635C]">통화 내용, 문자 내용, 사진 내용, 개인 대화 내용은 확인하지 않습니다.</p>
            <p className="mt-3 text-sm font-bold leading-6 text-[#68756F]">질문 건너뛰기, 정보 공유 변경, 연결 해제, 권한 변경, 데이터 삭제 요청이 가능합니다.</p>
          </details>
        </div>
        <button type="button" onClick={() => choose("granted")} className="flex min-h-[72px] items-center justify-center gap-2 rounded-[22px] bg-[#2F6B46] px-5 text-xl font-black text-white">{current.action}<ArrowRight size={23} /></button>
        <button type="button" onClick={() => choose("later")} className="mt-2 min-h-14 text-lg font-black text-[#52635C]">나중에 하기</button>
      </section>
    </main>
  );
}
