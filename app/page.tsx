import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  HeartHandshake,
  MessageCircle,
  UserRoundCheck,
} from "lucide-react";
import { SampleStartButton } from "@/components/sample-start-button";

const modeCards = [
  {
    href: "/setup?mode=family&fresh=1",
    title: "가족의 안부를 챙기고 싶어요",
    description:
      "부모님·가족의 안부와 병원, 약, 검진 일정을 함께 기억해요.",
    button: "가족용으로 시작하기",
    preview: true,
    helperText: "내 정보를 입력하지 않고 오늘안부의 주요 화면을 먼저 확인할 수 있어요.",
    icon: HeartHandshake,
  },
  {
    href: "/setup?mode=self",
    title: "내 일상을 직접 챙기고 싶어요",
    description:
      "오늘의 컨디션, 약, 병원 일정, 안부 공유를 쉽게 확인해요.",
    button: "본인용 둘러보기",
    preview: false,
    helperText: "큰 글씨 화면으로 주요 기능을 가볍게 확인해보세요.",
    icon: UserRoundCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-brand-cream px-4 py-6 text-brand-ink sm:px-6 md:flex md:items-center md:justify-center md:py-10">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-[480px] flex-col rounded-2xl border border-brand-line bg-white/88 p-5 shadow-soft sm:p-7 md:min-h-0 md:p-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-base font-bold" aria-label="오늘안부 홈">
            오늘안부
          </Link>
          <span className="rounded-full bg-brand-mint px-3 py-1.5 text-xs font-semibold text-brand-ink">
            안부·건강 루틴
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-10">
          <CareIllustration />

          <p className="text-sm font-semibold text-brand-coral">
            가족과 나를 위한 안부 루틴
          </p>
          <h1 className="brand-title landing-title mt-3">
            <span className="block">오늘, 안부를</span>
            <span className="block">놓치지 않도록</span>
          </h1>
          <p className="soft-copy mt-5 text-base text-stone-600 sm:text-lg">
            오늘안부는 나와 가족의 안부, 건강 일정, 생활 루틴을 함께 기억하고
            챙길 수 있도록 돕는 서비스입니다.
          </p>

          <div className="mt-8 space-y-3">
            {modeCards.map((mode) => {
              const Icon = mode.icon;
              return (
                <article
                  key={mode.href}
                  className="rounded-xl border border-brand-line bg-brand-cream/70 p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-mint text-brand-ink">
                      <Icon size={22} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold">{mode.title}</h2>
                      <p className="soft-copy mt-2 text-sm text-stone-600">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={mode.href}
                    className="cta-label mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-5 text-sm text-white transition hover:bg-[#2b423d]"
                  >
                    {mode.button}
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                  {mode.preview ? (
                    <div className="mt-3 space-y-2">
                      <SampleStartButton className="w-full" />
                      <p className="text-center text-xs leading-5 text-stone-500">
                        {mode.helperText}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                      {mode.helperText}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <footer className="border-t border-brand-line pt-5 text-center text-sm font-semibold text-stone-500">
          오늘의 안부가, 내일의 안심이 되도록
        </footer>
      </section>
    </main>
  );
}

function CareIllustration() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="w-full max-w-[280px] rounded-2xl border border-brand-line bg-gradient-to-br from-white to-brand-mint/55 p-4 shadow-sm sm:max-w-[320px]">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-ink shadow-sm">
            <Heart size={14} className="text-brand-coral" aria-hidden />
            오늘 안부
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-sky text-brand-ink">
            <CalendarDays size={18} aria-hidden />
          </span>
        </div>

        <div className="mt-4 flex items-end justify-center gap-3">
          <div className="relative rounded-[1.75rem] border-[7px] border-brand-ink bg-brand-ink p-1 shadow-soft">
            <div className="h-[158px] w-[104px] rounded-[1.15rem] bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-brand-mint">
                  <MessageCircle size={15} aria-hidden />
                </span>
                <div className="h-2 w-10 rounded-full bg-stone-200" />
              </div>
              <div className="mt-4 rounded-xl bg-brand-apricot px-3 py-2">
                <p className="text-[11px] font-bold leading-4 text-brand-ink">
                  오늘 안부
                  <br />
                  보내기
                </p>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-brand-mint" />
                <div className="h-2 w-3/4 rounded-full bg-stone-200" />
                <div className="flex items-center gap-2 rounded-lg bg-[#f7fbf7] px-2 py-1.5">
                  <Check size={14} className="text-brand-sage" aria-hidden />
                  <span className="text-[10px] font-bold text-stone-600">
                    약 확인
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex size-11 items-center justify-center rounded-full bg-white text-brand-coral shadow-sm">
              <Heart size={20} fill="currentColor" aria-hidden />
            </div>
            <div className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold leading-4 text-brand-ink shadow-sm">
              병원 일정
              <br />
              함께 기억
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
