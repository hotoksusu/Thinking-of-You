import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  Info,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { SampleStartButton } from "@/components/sample-start-button";

const alertTags = ["오늘 응답 없음", "약 복용 미확인", "컨디션 나쁨", "2일 연속 미응답"];
const brand = {
  primary: "#2563EB",
  dark: "#1D4ED8",
  soft: "#EFF6FF",
  border: "#BFDBFE",
  text: "#111827",
  subText: "#6B7280",
  kakao: "#FEE500",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8ed]" style={{ color: brand.text }}>
      <section className="mx-auto min-h-screen w-full max-w-[390px] px-4 pb-8 pt-3">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-extrabold">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-sm">
              <Heart size={16} fill="currentColor" aria-hidden />
            </span>
            오늘안부
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-[11px] font-bold text-[#2563EB]">
            <CalendarDays size={13} aria-hidden />
            하루 1분 안부
          </span>
        </header>

        <div className="mt-7 px-6">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-[#f5eee4] shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <Image
              src="/hero-care.png"
              alt="가족의 안부와 건강 루틴을 챙기는 모습"
              width={640}
              height={400}
              priority
              className="h-[152px] w-full object-cover object-center"
            />
            <div className="absolute right-3 top-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-[10px] text-[#6B7280] shadow-[0_16px_34px_rgba(15,23,42,0.16)] backdrop-blur-md">
              <p className="mb-2 inline-flex items-center gap-1 font-extrabold text-[#111827]">
                <ShieldCheck size={12} className="text-[#2563EB]" aria-hidden />
                오늘 안부 요청 준비
              </p>
              {["식사 확인", "약 복용 확인", "컨디션 확인"].map((item) => (
                <div key={item} className="mt-1.5 flex items-center justify-between gap-5">
                  <span>{item}</span>
                  <span className="h-1.5 w-7 rounded-full bg-[#2563EB]" />
                </div>
              ))}
            </div>
            <div className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE]/80 bg-[#EFF6FF]/90 px-3 py-2 text-xs font-extrabold text-[#2563EB] shadow-sm backdrop-blur">
              <CheckCircle2 size={14} aria-hidden />
              응답 대기
            </div>
          </div>
        </div>

        <section className="mt-5">
          <p className="text-sm font-extrabold text-[#2563EB]">
            자녀가 챙기는 부모님 안부 루틴
          </p>
          <h1 className="mt-2 text-[2.08rem] font-black leading-[1.2] tracking-[-0.01em] text-brand-ink">
            오늘, 안부를
            <br />
            놓치지 않도록
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#6B7280]">
            부모님과 매일 통화하지 못해도, 식사·약·컨디션을 하루 1분으로
            확인해요.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="text-base font-black">무엇을 먼저 하시겠어요?</h2>
          <div className="mt-3 space-y-3">
            <ActionCard
              href="/setup?mode=family&fresh=1"
              icon={<Heart size={19} aria-hidden />}
              tone="coral"
              title="부모님 등록하기"
              badge="추천"
              description="부모님의 이름과 연락 방법을 먼저 설정해요."
            />
            <ActionCard
              href="/home"
              icon={<ClipboardCheck size={19} aria-hidden />}
              tone="mint"
              title="오늘 안심 상태 확인하기"
              description="부모님의 안부와 이상 신호를 빠르게 확인해요."
            />
          </div>
        </section>

        <Link
          href="/setup?mode=family&fresh=1"
          className="mt-4 flex min-h-[3.35rem] w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-5 text-sm font-black text-[#191919] shadow-[0_14px_30px_rgba(17,24,39,0.13)] transition hover:brightness-[0.98] active:scale-[0.98]"
        >
          <MessageCircle size={18} aria-hidden />
          카카오로 간편 시작하기
          <ArrowRight size={16} aria-hidden />
        </Link>
        <p className="mt-2 text-center text-[11px] font-semibold text-[#6B7280]">
          보호자 계정으로 빠르게 시작해요
        </p>

        <div className="my-6 flex items-center gap-3 text-[11px] font-bold text-stone-400">
          <span className="h-px flex-1 bg-brand-line" />
          또는
          <span className="h-px flex-1 bg-brand-line" />
        </div>

        <SampleStartButton className="w-full bg-white" />

        <section className="mt-5 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-4 shadow-[0_12px_28px_rgba(37,99,235,0.07)]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm">
              <Info size={17} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-[#111827]">
                응답이 없거나 평소와 다른 상태가 반복되면 알려드려요.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {alertTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white bg-white px-2.5 py-1 text-[10px] font-bold text-[#1D4ED8] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-6 border-t border-brand-line pt-5 text-center text-xs leading-6 text-stone-500">
          부모님이 카카오톡을 안 써도 문자·전화로 이어갈 수 있어요.
        </footer>
      </section>
    </main>
  );
}

function ActionCard({
  href,
  icon,
  tone,
  title,
  badge,
  description,
}: {
  href: string;
  icon: ReactNode;
  tone: "coral" | "mint";
  title: string;
  badge?: string;
  description: string;
}) {
  const isCoral = tone === "coral";

  return (
    <Link
      href={href}
      className={[
        "group flex min-h-[92px] items-center gap-3 rounded-2xl border p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-4 focus:ring-[#BFDBFE]/70 active:scale-[0.99]",
        isCoral
          ? "border-[#FFC8BA] bg-[#FFF3EF]"
          : "border-[#BFDBFE] bg-[#EFF6FF]",
      ].join(" ")}
    >
      <span
        className={[
          "flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
          isCoral ? "bg-[#F9735B]" : "bg-[#2563EB]",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-black">{title}</span>
          {badge ? (
            <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-black text-white">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[#6B7280]">
          {description}
        </span>
      </span>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_28px_rgba(15,23,42,0.13)] transition group-hover:text-[#2563EB]">
        <ArrowRight size={19} aria-hidden />
      </span>
    </Link>
  );
}
