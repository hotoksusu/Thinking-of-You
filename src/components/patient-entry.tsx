"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inspectPatientSession } from "@/lib/demo-auth";

export function PatientEntry() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "visitor" | "sessionExpired" | "storageError">("checking");

  useEffect(() => {
    const check = () => {
      const query = new URLSearchParams(window.location.search);
      if (query.has("token")) {
        router.replace("/i?token=" + encodeURIComponent(query.get("token") || ""));
        return;
      }
      const access = inspectPatientSession();
      if (access.session) {
        router.replace("/app/patient");
        return;
      }
      setStatus(access.error === "sessionExpired" || access.error === "storageError" ? access.error : "visitor");
    };
    check();
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      window.removeEventListener("storage", check);
    };
  }, [router]);

  return <main className="min-h-[100dvh] bg-[#F1F0E9] px-5 py-5 text-[#202923]">
    <div className="mx-auto max-w-[560px]">
      <header className="flex min-h-12 items-center justify-between gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center font-bold text-[#315E50]">← 처음으로</Link>
        <span className="font-black text-[#315E50]">오늘안부</span>
      </header>
      {status === "checking" ? <p role="status" className="py-12 text-lg">이용 경로를 확인하고 있어요.</p> : <>
        <h1 className="mt-6 text-3xl font-black leading-tight">어떻게 이용하시겠어요?</h1>
        <p className="mt-3 text-lg leading-7 text-[#52635C]">환자 전용 기록은 병원에서 받은 링크로 연결해요.</p>
        {status === "sessionExpired" ? <p role="status" className="mt-4 rounded-xl border border-[#D6A086] bg-[#FFF5EE] p-4 leading-7">기존 환자 연결의 이용 시간이 지났어요. 받은 링크를 다시 열어주세요. 링크도 만료됐다면 병원에 새 링크를 요청해주세요.</p> : null}
        {status === "storageError" ? <p role="alert" className="mt-4 rounded-xl border border-[#D6A086] bg-[#FFF5EE] p-4 leading-7">이 기기의 연결 정보를 읽지 못했어요. 브라우저의 사이트 데이터 저장 설정을 확인한 뒤 받은 링크를 다시 열어주세요. 기존 기록은 삭제하지 않았어요.</p> : null}
        <section aria-labelledby="received-link" className="mt-5 rounded-2xl bg-white p-5">
          <h2 id="received-link" className="text-xl font-black">병원에서 링크를 받았어요</h2>
          <p className="mt-3 leading-7">문자나 카카오톡에서 ‘오늘안부’ 또는 진료받은 병원 이름을 찾아 가장 최근의 회복관리 링크를 눌러주세요.</p>
          <p className="mt-2 text-base leading-7 text-[#52635C]">연결 안내와 본인 확인을 마치면 오늘 상태를 기록할 수 있어요.</p>
        </section>
        <details className="mt-3 rounded-2xl bg-white px-5 py-3">
          <summary className="flex min-h-12 cursor-pointer items-center text-lg font-bold text-[#315E50]">링크를 받지 못했거나 찾을 수 없어요</summary>
          <div className="pb-2 leading-7">
            <p>퇴원 안내문이나 병원에서 받은 문자에 적힌 연락처로 오늘안부 이용 대상인지 문의해주세요.</p>
            <p className="mt-2">이용 대상이라면 회복관리 링크 발급 또는 재발급을 요청해주세요. 이 화면에서는 링크를 직접 발급하지 않아요.</p>
          </div>
        </details>
        <section aria-labelledby="sample-preview" className="mt-3 rounded-2xl border border-[#D9E1DC] p-5">
          <h2 id="sample-preview" className="text-xl font-black">먼저 살펴보고 싶어요</h2>
          <p className="mt-2 text-base leading-7 text-[#52635C]">샘플 데이터로 화면과 기록 과정을 체험해보세요. 체험 기록은 이 기기의 샘플 데이터에만 저장되며, 실제 환자 기록이나 병원에 반영되지 않아요.</p>
          <Link href="/demo/patient" className="mt-3 flex min-h-14 items-center justify-center rounded-xl bg-[#315E50] px-4 text-lg font-bold text-white">샘플로 체험하기 →</Link>
        </section>
        <Link href="/" className="mt-3 flex min-h-12 items-center justify-center font-bold text-[#315E50] underline underline-offset-4">랜딩페이지로 돌아가기</Link>
      </>}
    </div>
  </main>;
}
