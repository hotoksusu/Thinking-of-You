"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { recordRecommendationEvent, wasDismissedToday, type ActionRecommendation } from "@/lib/action-coordinator";

export function TodayRecommendation({ recommendation }: { recommendation: ActionRecommendation }) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (wasDismissedToday(recommendation.id)) { setHidden(true); return; }
    recordRecommendationEvent(recommendation, { shownAt: new Date().toISOString(), outcome: recommendation.recommendedAction === "no_action_needed" ? "no_action_needed" : undefined });
  }, [recommendation]);

  if (hidden) return null;
  const tone = recommendation.tone === "attention" ? "border-[#E7C793] bg-[#FFF9ED]" : recommendation.tone === "positive" ? "border-[#B9D7B7] bg-[#F1F8EE]" : "border-[#C9DADD] bg-[#F3F9F9]";

  function accept() {
    const now = new Date().toISOString();
    recordRecommendationEvent(recommendation, { openedAt: now, acceptedAt: now, completedAt: recommendation.recommendedAction === "view_farm" || recommendation.recommendedAction === "no_action_needed" ? now : undefined, outcome: recommendation.recommendedAction === "view_farm" ? "activity_viewed" : recommendation.recommendedAction === "no_action_needed" ? "no_action_needed" : recommendation.recommendedAction === "call_family" ? "phone_call_started" : undefined });
    router.push(recommendation.href);
  }

  function dismiss() {
    recordRecommendationEvent(recommendation, { dismissedAt: new Date().toISOString(), outcome: "dismissed" });
    setHidden(true);
  }

  return (
    <section className={`mt-5 rounded-[28px] border-2 p-6 shadow-[0_12px_34px_rgba(49,78,58,.07)] ${tone}`} aria-labelledby={`recommendation-${recommendation.id}`}>
      <p className="flex items-center gap-2 text-sm font-black text-[#53675C]"><Sparkles size={19} aria-hidden /> 오늘의 제안</p>
      <h2 id={`recommendation-${recommendation.id}`} className="mt-3 text-[1.45rem] font-black leading-8 text-[#17251F]">{recommendation.triggerSummary}</h2>
      <p className="mt-2 text-lg font-bold leading-7 text-[#53635B]">{recommendation.optional ? "지금 필요한 행동은 없어요. 원하시면 가볍게 이어가세요." : "지금 가장 도움이 될 행동 하나를 골랐어요."}</p>
      <button type="button" onClick={accept} className="mt-5 flex min-h-[68px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#2F6B46] px-5 text-xl font-black text-white">{recommendation.actionLabel}<ArrowRight size={24} /></button>
      {recommendation.secondaryHref ? <button type="button" onClick={() => router.push(recommendation.secondaryHref!)} className="mt-2 min-h-12 w-full rounded-xl text-base font-black text-[#55675D]">{recommendation.secondaryLabel}</button> : recommendation.secondaryLabel ? <button type="button" onClick={dismiss} className="mt-2 min-h-12 w-full rounded-xl text-base font-black text-[#55675D]">{recommendation.secondaryLabel}</button> : <button type="button" onClick={dismiss} className="mt-2 min-h-12 w-full rounded-xl text-base font-black text-[#65736B]">오늘은 보지 않기</button>}
    </section>
  );
}
