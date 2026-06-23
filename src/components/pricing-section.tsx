"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { pricingPlans, type PricingPlanId } from "@/lib/pricing";

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId | null>(null);
  const selected = pricingPlans.find((plan) => plan.id === selectedPlan);

  return (
    <section className="mt-7 rounded-[1.75rem] border border-brand-line bg-white/82 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
          <Sparkles size={18} aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#2563EB]">
            Pricing
          </p>
          <h2 className="mt-1 text-xl font-black leading-snug text-[#111827]">
            부모님 안심 확인,
            <br />
            부담 없이 시작하세요
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            지금은 결제 없이 요금제 구조만 미리 확인할 수 있어요.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.id}
            className={[
              "relative rounded-2xl border p-4 transition",
              plan.highlighted
                ? "border-[#2563EB] bg-[#EFF6FF] shadow-[0_14px_34px_rgba(37,99,235,0.16)]"
                : "border-brand-line bg-white",
            ].join(" ")}
          >
            {plan.highlighted ? (
              <span className="absolute right-4 top-4 rounded-full bg-[#2563EB] px-2.5 py-1 text-[10px] font-black text-white">
                추천
              </span>
            ) : null}
            <div className="pr-14">
              <h3 className="text-base font-black text-[#111827]">{plan.name}</h3>
              <p className="mt-1 text-2xl font-black text-[#111827]">{plan.price}</p>
              <p className="mt-2 text-xs leading-5 text-[#6B7280]">{plan.description}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm font-semibold text-[#374151]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#2563EB]" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={[
                "mt-4 flex min-h-11 w-full items-center justify-center rounded-full px-4 text-sm font-black transition active:scale-[0.98]",
                plan.highlighted
                  ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                  : "border border-[#BFDBFE] bg-white text-[#1D4ED8] hover:bg-[#EFF6FF]",
              ].join(" ")}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </div>

      {selected ? (
        <div className="mt-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm leading-6 text-[#1D4ED8]">
          <p className="font-black">{selected.name}을 선택했어요.</p>
          <p className="mt-1 text-xs font-semibold">
            실제 결제는 아직 연결하지 않았고, 이후 토스페이먼츠/카카오페이/Stripe 연동을 붙일 수 있게 준비해두었습니다.
          </p>
        </div>
      ) : null}
    </section>
  );
}
