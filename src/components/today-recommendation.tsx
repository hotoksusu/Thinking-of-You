"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { recordRecommendationEvent, wasDismissedToday, type ActionRecommendation } from "@/lib/action-coordinator";
import { AnsimiCharacter } from "@/components/ansimi-character";

export function TodayRecommendation({ recommendation }: { recommendation: ActionRecommendation }) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (wasDismissedToday(recommendation.id)) { setHidden(true); return; }
    recordRecommendationEvent(recommendation, { shownAt: new Date().toISOString(), outcome: recommendation.recommendedAction === "no_action_needed" ? "no_action_needed" : undefined });
  }, [recommendation]);

  if (hidden) return null;
  const tone = recommendation.tone === "attention" ? "bg-[#FFF9ED]" : recommendation.tone === "positive" ? "bg-[#F1F8EE]" : "bg-[#F3F9F9]";
  const characterState = recommendation.tone === "attention" ? "guide" : recommendation.tone === "positive" ? "happy" : "calm";
  const shortMessage = recommendation.triggerType === "no_change" || recommendation.triggerType === "positive_change" ? "오늘도 평소와 비슷해요." : recommendation.triggerSummary;
  const secondaryMessage = recommendation.optional ? "지금은 하실 일이 없어요." : "필요한 행동 하나를 알려드릴게요.";

  function accept() {
    const now = new Date().toISOString();
    recordRecommendationEvent(recommendation, { openedAt: now, acceptedAt: now, completedAt: recommendation.recommendedAction === "view_farm" || recommendation.recommendedAction === "no_action_needed" ? now : undefined, outcome: recommendation.recommendedAction === "view_farm" ? "activity_viewed" : recommendation.recommendedAction === "no_action_needed" ? "no_action_needed" : recommendation.recommendedAction === "call_family" ? "phone_call_started" : undefined });
    if (recommendation.recommendedAction === "no_action_needed") { setHidden(true); return; }
    router.push(recommendation.href);
  }

  function dismiss() {
    recordRecommendationEvent(recommendation, { dismissedAt: new Date().toISOString(), outcome: "dismissed" });
    setHidden(true);
  }

  return (
    <section className={`mt-5 rounded-[28px] p-5 shadow-[0_12px_34px_rgba(49,78,58,.07)] ${tone}`} aria-label="오늘의 안심이 안내">
      <AnsimiCharacter compact state={characterState} message={shortMessage} secondaryMessage={secondaryMessage} />
      <button type="button" onClick={accept} className="mt-5 flex min-h-[68px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#2F6B46] px-5 text-xl font-black text-white">{recommendation.actionLabel}<ArrowRight size={24} /></button>
      {recommendation.secondaryLabel ? <button type="button" onClick={() => recommendation.secondaryHref ? router.push(recommendation.secondaryHref) : dismiss()} className="mt-2 min-h-12 w-full rounded-xl text-lg font-black text-[#55675D]">{recommendation.secondaryLabel}</button> : null}
    </section>
  );
}
