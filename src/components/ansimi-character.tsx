"use client";

import { useEffect } from "react";
import type { AnsimiState } from "@/lib/ansimi-dialogue";
import { recordAnsimiEvent } from "@/lib/ansimi-dialogue";

export function AnsimiCharacter({ state, message, secondaryMessage, compact = false }: { state: AnsimiState; message: string; secondaryMessage?: string; compact?: boolean }) {
  useEffect(() => {
    recordAnsimiEvent("ansimi_viewed", { state });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) recordAnsimiEvent("ansimi_motion_reduced", { source: "system" });
  }, [state]);

  return (
    <div className={`ansimi-guide ${compact ? "ansimi-guide-compact" : ""}`}>
      <div className={`ansimi-character ansimi-state-${state}`} aria-hidden>
        <img src="/brand/farm-mascot.png?v=12" alt="" className="h-full w-full rounded-[30px] object-cover" />
        {state === "happy" || state === "celebrate" ? <span className="ansimi-effect" aria-hidden>☀️</span> : null}
      </div>
      <button type="button" className="ansimi-bubble" onClick={() => recordAnsimiEvent("ansimi_message_skipped", { state })} aria-label={`${message} ${secondaryMessage ?? ""}`}>
        <strong>{message}</strong>
        {secondaryMessage ? <span>{secondaryMessage}</span> : null}
      </button>
    </div>
  );
}
