"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Link2, Smartphone } from "lucide-react";

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
    <section className={compact ? "rounded-[24px] bg-[#FFF5EE] p-5" : "rounded-[28px] border border-[#FFD7C3] bg-[#FFF8F3] p-6"}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#F45D18]">
          <Link2 size={22} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-black text-[#F45D18]">가장 쉬운 시작 방법</p>
          <h2 className={compact ? "mt-1 text-xl font-black" : "mt-2 text-2xl font-black"}>
            설치 없이도 바로 시작할 수 있어요.
          </h2>
          <p className="mt-2 font-semibold leading-7 text-[#4B5563]">
            처음 한 번만 연결해 주세요. 그다음부터는 평소처럼 지내시면 됩니다.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a href="/app?role=parent#today-record" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FF681F] px-5 font-black text-white shadow-[0_12px_26px_rgba(255,104,31,0.2)]">
          생활 연결하기
          <ArrowRight size={17} aria-hidden />
        </a>
        {!compact ? (
          <>
          {canInstall ? (
            <button
              type="button"
              onClick={promptInstall}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E4E7EC] bg-white px-5 font-black text-[#4B5563]"
            >
              <Smartphone size={18} aria-hidden />홈 화면에 추가하기
            </button>
          ) : (
            <a href="/guide#home-shortcut" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E4E7EC] bg-white px-5 font-black text-[#4B5563]">
              <Smartphone size={18} aria-hidden />홈 화면에 추가하기
            </a>
          )}
          </>
        ) : null}
      </div>
      {!compact ? <p id="home-shortcut" className="mt-3 text-center text-sm font-semibold leading-6 text-[#7A808C]">홈 화면 추가는 선택이에요. 매일 받는 링크만 눌러도 충분합니다.</p> : null}
    </section>
  );
}

export function AppInstallBanner() {
  return null;
}
