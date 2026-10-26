"use client";

import Link from "next/link";
import { optionalServerState } from "@/lib/care-server";
import { ConnectionSteps } from "@/components/care-design";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inspectPatientSession } from "@/lib/demo-auth";

export function PatientEntry() {
  const router = useRouter();
  const [linkHelp, setLinkHelp] = useState(false);
  const [missingHelp, setMissingHelp] = useState(false);
  const [status, setStatus] = useState<"checking" | "visitor" | "sessionExpired" | "storageError">("checking");

  useEffect(() => {
    const check = async () => {
      const query = new URLSearchParams(window.location.search);
      if (query.has("token")) {
        router.replace("/i?token=" + encodeURIComponent(query.get("token") || ""));
        return;
      }
      if(localStorage.getItem("oneul-anbu:care-auth-source")==="server"){router.replace("/app/patient");return;}
      try { if (localStorage.getItem("oneul-anbu:care-auth-source")!=="legacy" && await optionalServerState()) { router.replace("/app/patient"); return; } } catch { /* Existing links retain their local authentication path. */ }
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

  return <main className="care-ui min-h-[100dvh] bg-[#F7F5EF] px-5 py-5 text-[#202923]">
    <div className="mx-auto max-w-[560px]">
      <header className="flex min-h-12 items-center justify-between gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center font-bold text-[#315E50]">← 처음으로</Link>
        <span className="font-black text-[#315E50]">오늘안부</span>
      </header>
      {status === "checking" ? <p role="status" className="py-12 text-lg">이용 경로를 확인하고 있어요.</p> : <>
        <p className="care-kicker mt-6">병원 연계 환자 전용</p>
        <h1 className="mt-3 text-[2rem] font-black leading-tight">병원에서 오늘안부를 안내받으셨나요?</h1>
        <p className="care-subtext mt-4">문자나 카카오톡으로 받은 안내 링크를 열면 회복 기록을 시작할 수 있어요.</p>
        <ConnectionSteps/>
        {status === "sessionExpired" ? <p role="status" className="mt-4 rounded-xl border border-[#D6A086] bg-[#FFF5EE] p-4 leading-7">기존 환자 연결의 이용 시간이 지났어요. 병원에서 받은 원본 링크로 다시 연결해주세요. 링크도 만료됐다면 병원에 재안내를 요청해주세요.</p> : null}
        {status === "storageError" ? <p role="alert" className="mt-4 rounded-xl border border-[#D6A086] bg-[#FFF5EE] p-4 leading-7">이 기기의 연결 정보를 읽지 못했어요. 사이트 데이터 저장 설정을 확인한 뒤 받은 링크를 다시 열어주세요. 기존 기록은 삭제하지 않았어요.</p> : null}
        <section aria-labelledby="received-link" className="mt-5">
          <h2 id="received-link" className="sr-only">병원 링크 이용 방법</h2>
          <button type="button" aria-expanded={linkHelp} aria-controls="link-opening-help" onClick={() => setLinkHelp(v => !v)} className="mt-4 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#315E50] px-4 text-lg font-bold text-white">링크 여는 방법 확인</button>
          {linkHelp ? <ol id="link-opening-help" className="mt-3 list-decimal space-y-2 rounded-xl bg-white py-4 pl-9 pr-4 text-base leading-7"><li>문자나 카카오톡에서 ‘오늘안부’ 또는 진료받은 병원 이름을 찾아주세요.</li><li>가장 최근에 받은 회복관리 링크를 열어주세요.</li><li>화면의 본인 확인을 마치면 오늘 상태를 기록할 수 있어요.</li></ol> : null}
        </section>
        <div className="mt-3 text-base text-[#52635C]">
          <div className="flex flex-wrap items-center gap-x-3"><span>링크를 찾을 수 없나요?</span><button type="button" aria-expanded={missingHelp} aria-controls="missing-link-help" onClick={() => setMissingHelp(v => !v)} className="inline-flex min-h-11 items-center font-bold text-[#315E50] underline underline-offset-4">도움말 보기</button></div>
          {missingHelp ? <div id="missing-link-help" className="border-l-2 border-[#CAD8CF] pl-4 leading-7"><p>문자나 카카오톡에서 ‘오늘안부’ 또는 진료받은 병원 이름으로 메시지를 확인해주세요.</p><p className="mt-2">메시지가 없거나 링크가 만료됐다면 퇴원 안내문 또는 병원에서 받은 문자에 적힌 연락처로 재안내를 요청해주세요.</p><p className="mt-2">이 화면에서는 링크를 발급하거나 병원에 자동으로 요청하지 않아요.</p></div> : null}
        </div>
        <Link href="/" className="mt-3 flex min-h-12 items-center justify-center font-bold text-[#315E50] underline underline-offset-4">랜딩페이지로 돌아가기</Link>
      </>}
    </div>
  </main>;
}
