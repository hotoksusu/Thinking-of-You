"use client";

import { useEffect, useState } from "react";
import type { AnsimiState } from "@/lib/ansimi-dialogue";
import { recordAnsimiEvent } from "@/lib/ansimi-dialogue";

export function AnsimiCharacter({ state, message, secondaryMessage, compact = false }: { state: AnsimiState; message: string; secondaryMessage?: string; compact?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isQuestionGuide = state === "guide" || state === "thinking" || state === "greeting";

  useEffect(() => {
    recordAnsimiEvent("ansimi_viewed", { state });
    recordAnsimiEvent("ansimi_rendered", { state, compact });
    recordAnsimiEvent("ansimi_message_shown", { state });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      recordAnsimiEvent("ansimi_motion_reduced", { source: "system" });
      recordAnsimiEvent("ansimi_reduced_motion_used", { source: "system" });
      return;
    }
    recordAnsimiEvent("ansimi_animation_started", { state });
    const timer = window.setTimeout(() => recordAnsimiEvent("ansimi_animation_completed", { state }), 1100);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div className={`ansimi-guide ${compact ? "ansimi-guide-compact" : ""}`}>
      <div className={`ansimi-character ansimi-state-${state}`} aria-hidden>
        {imageFailed ? <span className="flex h-full w-full items-center justify-center rounded-[30px] bg-[#EAF3E5] text-6xl">🌿</span> : <img src={isQuestionGuide ? "/brand/hero-ansimi-phone-v1.png" : "/brand/farm-mascot.png?v=12"} alt="" onError={() => { setImageFailed(true); recordAnsimiEvent("ansimi_fallback_rendered", { state }); }} className="h-full w-full rounded-[30px] object-cover" />}
        {state === "happy" || state === "celebrate" ? <span className="ansimi-effect" aria-hidden>☀️</span> : null}
      </div>
      <button type="button" className="ansimi-bubble" onClick={() => recordAnsimiEvent("ansimi_message_skipped", { state })} aria-label={`${message} ${secondaryMessage ?? ""}`}>
        <strong>{message}</strong>
        {secondaryMessage ? <span>{secondaryMessage}</span> : null}
      </button>
    </div>
  );
}
