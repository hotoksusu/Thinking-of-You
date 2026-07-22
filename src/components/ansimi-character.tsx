"use client";

import { useEffect, useState } from "react";
import type { AnsimiMotion, AnsimiState } from "@/lib/ansimi-dialogue";
import { ANSIMI_MOTION_KEY, recordAnsimiEvent } from "@/lib/ansimi-dialogue";

type AnsimiSize = "small" | "medium" | "large";

export function AnsimiCharacter({ state, message, secondaryMessage, compact = false, motion = "subtle", size = "medium", ariaLabel }: { state: AnsimiState; message?: string; secondaryMessage?: string; compact?: boolean; motion?: AnsimiMotion | "once"; size?: AnsimiSize; ariaLabel?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [motionMode, setMotionMode] = useState<AnsimiMotion>(motion === "once" ? "subtle" : motion);
  const isQuestionGuide = state === "guide" || state === "thinking" || state === "greeting" || state === "question" || state === "listening";
  const isFamilyContent = state === "familyMessage" || state === "familyPhoto" || state === "familyVoice";
  const asset = isQuestionGuide || isFamilyContent ? "/brand/hero-ansimi-phone-v1.png" : "/brand/farm-mascot.png?v=12";

  useEffect(() => {
    const syncMotion = () => {
      const saved = window.localStorage.getItem(ANSIMI_MOTION_KEY) as AnsimiMotion | null;
      setMotionMode(saved ?? (motion === "once" ? "subtle" : motion));
    };
    syncMotion();
    window.addEventListener("ansimi-motion-change", syncMotion);
    recordAnsimiEvent("ansimi_viewed", { state });
    recordAnsimiEvent("ansimi_rendered", { state, compact });
    recordAnsimiEvent("ansimi_state_entered", { state, size, motion });
    if (message) recordAnsimiEvent("ansimi_message_shown", { state });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || motionMode === "static") {
      recordAnsimiEvent("ansimi_motion_reduced", { source: "system" });
      recordAnsimiEvent("ansimi_reduced_motion_used", { source: "system" });
      return () => window.removeEventListener("ansimi-motion-change", syncMotion);
    }
    recordAnsimiEvent("ansimi_animation_started", { state });
    const timer = window.setTimeout(() => recordAnsimiEvent("ansimi_animation_completed", { state }), 1100);
    return () => { window.clearTimeout(timer); window.removeEventListener("ansimi-motion-change", syncMotion); };
  }, [state, compact, message, motion, motionMode, size]);

  return (
    <div className={`ansimi-guide ${compact ? "ansimi-guide-compact" : ""} ansimi-size-${size} ansimi-motion-${motionMode}`} data-ansimi-state={state}>
      <div className={`ansimi-character ansimi-state-${state}`} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}>
        {imageFailed ? <span className="flex h-full w-full items-center justify-center rounded-[30px] bg-[#EAF3E5] text-6xl">🌿</span> : <img src={asset} alt="" loading={size === "large" ? "eager" : "lazy"} onError={() => { setImageFailed(true); recordAnsimiEvent("ansimi_fallback_rendered", { state }); }} className="h-full w-full rounded-[30px] object-cover" />}
        {state === "happy" || state === "celebrate" || state === "completed" ? <span className="ansimi-effect" aria-hidden>🌸</span> : null}
        {state === "connected" ? <span className="ansimi-effect" aria-hidden>✓</span> : null}
      </div>
      {message ? <div className="ansimi-bubble" aria-live={state === "completed" || state === "connected" ? "polite" : undefined}>
        <strong>{message}</strong>
        {secondaryMessage ? <span>{secondaryMessage}</span> : null}
      </div> : null}
    </div>
  );
}
