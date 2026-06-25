"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Smartphone } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function promptInstall() {
    if (!promptEvent) {
      return;
    }

    await promptEvent.prompt();
    setPromptEvent(null);
  }

  return { canInstall: Boolean(promptEvent), promptInstall };
}

export function InstallGuide({ compact = false }: { compact?: boolean }) {
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <section className={compact ? "rounded-[24px] bg-[#EFF6FF] p-5" : "rounded-[28px] bg-[#EFF6FF] p-6"}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB]">
          <Smartphone size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-black text-[#2563EB]">더 편하게 사용하기</p>
          <h2 className={compact ? "mt-1 text-xl font-black" : "mt-2 text-2xl font-black"}>
            오늘안부를 홈화면에 추가하면 더 빠르게 열 수 있어요.
          </h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            설치는 선택사항입니다. 링크만 열어도 오늘의 기록을 남길 수 있고, 익숙해진 뒤 필요할 때 추가하면 됩니다.
          </p>
        </div>
      </div>

      <details className="mt-5 rounded-2xl bg-white p-4">
        <summary className="cursor-pointer list-none font-black text-[#2563EB]">홈화면 추가 방법 보기</summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-sm font-black text-[#2563EB]">iPhone</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">Safari에서 공유 버튼을 누른 뒤 홈 화면에 추가를 선택합니다.</p>
          </div>
          <div className="rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-sm font-black text-[#2563EB]">Android</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4B5563]">Chrome 메뉴에서 홈 화면에 추가를 선택합니다.</p>
          </div>
        </div>
      </details>

      {!compact ? (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {canInstall ? (
            <button
              type="button"
              onClick={promptInstall}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#2563EB] px-5 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]"
            >
              홈화면에 추가하기
            </button>
          ) : null}
          <a
            href="/app"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white px-5 font-black text-[#4B5563]"
          >
            앱 체험 계속하기
            <ArrowRight size={17} aria-hidden />
          </a>
        </div>
      ) : null}
    </section>
  );
}

export function AppInstallBanner() {
  return null;
}
