"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Smartphone, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

type StoryGuide = {
  image: string;
  alt: string;
  width: number;
  height: number;
};

const storyGuide: StoryGuide = {
  image: "/stories/ansimi-story-01.png",
  alt: "안심이가 오늘안부의 시작 방법과 가족 안심 흐름을 설명하는 그림 가이드",
  width: 1024,
  height: 1536,
};

const summaries = [
  {
    icon: Smartphone,
    title: "별도 앱 설치 없이",
    text: <>받은 링크에서 바로 시작하고<br />홈 화면 추가는 선택할 수 있어요.</>,
    tone: "bg-[#FFF0E4] text-[#D85D28]",
  },
  {
    icon: Sparkles,
    title: "필요할 때만 질문",
    text: <>평소에는 기록하지 않고<br />알림이 온 날만 짧게 답해요.</>,
    tone: "bg-[#EEF5E9] text-[#52725B]",
  },
  {
    icon: Heart,
    title: "가족은 안심",
    text: <>다른 흐름이 이어지면<br />이유와 행동 하나를 알려드립니다.</>,
    tone: "bg-[#FFF1ED] text-[#DC5E52]",
  },
];

export function AnsimiStory() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isExpanded]);

  return (
    <section id="ansimi-story" className="border-y border-[#E7E0D5] bg-[#FFF5E9] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-sm font-black text-[#E9652B]">안심이 이야기</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#20302C] sm:text-4xl">
            오늘안부,<br className="sm:hidden" /> 이렇게 시작됩니다 😊
          </h2>
          <p className="mt-5 text-lg font-bold leading-8 text-[#52635C]">
            앱스토어 설치 없이 받은 링크에서 바로 시작합니다.<br />
            평소에는 앱을 매일 열지 않아도 괜찮습니다.<br />
            질문 알림이 온 날만 짧게 답하고,<br className="sm:hidden" /> 어려운 날은 건너뛰어도 괜찮습니다.
          </p>
        </div>

        <div className="mx-auto mt-9 max-w-[720px]">
          <StoryImage story={storyGuide} onOpen={() => setIsExpanded(true)} />
          <p className="mt-4 text-center text-sm font-bold text-[#7A746C]">그림을 누르면 크게 볼 수 있어요.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {summaries.map(({ icon: Icon, title, text, tone }, index) => (
            <article key={title} className="rounded-[22px] border border-[#E8E2D8] bg-white p-6 shadow-[0_14px_34px_rgba(55,72,55,0.06)]">
              <span className={`flex size-14 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={28} aria-hidden />
              </span>
              <p className="mt-5 text-sm font-black text-[#E9652B]">{index + 1}</p>
              <h3 className="mt-1 text-2xl font-black text-[#20302C]">{title}</h3>
              <p className="mt-3 text-lg font-semibold leading-8 text-[#596861]">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/start" className="inline-flex min-h-16 w-full max-w-[440px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.22)]">
            오늘안부 시작하기 <ArrowRight size={22} aria-hidden />
          </Link>
        </div>
      </div>

      {isExpanded ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#1D2823]/90 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="오늘안부 그림 가이드 크게 보기" onClick={() => setIsExpanded(false)}>
          <button type="button" onClick={() => setIsExpanded(false)} className="fixed right-4 top-4 z-10 flex size-14 items-center justify-center rounded-full bg-white text-[#20302C] shadow-lg" aria-label="크게 보기 닫기">
            <X size={28} aria-hidden />
          </button>
          <div className="mx-auto w-full max-w-[1024px] touch-pan-x touch-pan-y" onClick={(event) => event.stopPropagation()}>
            <Image src={storyGuide.image} alt={storyGuide.alt} width={storyGuide.width} height={storyGuide.height} className="h-auto w-full rounded-[20px] bg-white object-contain" sizes="100vw" priority />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StoryImage({ story, onOpen }: { story: StoryGuide; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article>
      <button type="button" onClick={onOpen} className="relative block w-full overflow-hidden rounded-[24px] bg-[#F1E9DC] text-left shadow-[0_22px_60px_rgba(80,62,45,0.14)]" aria-label="오늘안부 그림 가이드 크게 보기">
        {!loaded ? <span className="absolute inset-0 animate-pulse bg-gradient-to-b from-[#F4EBDD] via-[#FFF8EE] to-[#EFE3D3]" aria-hidden /> : null}
        <Image
          src={story.image}
          alt={story.alt}
          width={story.width}
          height={story.height}
          className={`h-auto w-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 720px) 100vw, 720px"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </button>
    </article>
  );
}
