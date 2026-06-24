import { MessageCircle } from "lucide-react";

const reassuranceBadges = ["AI 안심 분석", "변화 감지", "가족 공유", "개인정보 보호"];
const trustItems = ["개인정보 암호화", "가족만 공유 가능", "언제든 삭제 가능", "안전한 데이터 관리"];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#EFF6FF] text-[#1F2937]">
      <section className="relative mx-auto flex min-h-[92svh] w-full max-w-[1180px] flex-col px-5 pb-8 pt-5 sm:px-8 lg:min-h-[88svh]">
        <header className="z-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-lg font-black text-[#2563EB]">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]">
              안
            </span>
            오늘안부
          </a>
          <a
            href="/guide"
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-[#2563EB] shadow-[0_10px_30px_rgba(37,99,235,0.10)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            둘러보기
          </a>
        </header>

        <div className="fade-in relative z-10 grid flex-1 content-center gap-7 pb-6 pt-8 text-center">
          <div className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[32px] bg-white/70 p-3 shadow-[0_24px_70px_rgba(37,99,235,0.16)] ring-1 ring-white/80">
            <img
              src="/landing-hero-polished.svg"
              alt="부모님과 자녀가 안심 상태를 확인하는 따뜻한 일러스트"
              className="h-auto w-full rounded-[24px] object-cover"
            />
            <div className="absolute bottom-5 left-5 rounded-[22px] bg-white/95 px-4 py-3 text-left shadow-[0_14px_34px_rgba(37,99,235,0.18)] backdrop-blur">
              <p className="text-xs font-black text-[#2563EB]">오늘 안심 상태</p>
              <p className="mt-1 text-xl font-black text-[#1F2937]">92점 · 양호</p>
              <p className="mt-1 text-xs font-bold text-[#22C55E]">최근 이상 신호 없음</p>
            </div>
          </div>

          <div>
            <p className="text-base font-black text-[#2563EB]">오늘안부</p>
            <h1 className="mx-auto mt-3 max-w-[760px] text-[2.65rem] font-black leading-tight tracking-normal sm:text-[4.5rem]">
              부모님의 작은 변화를
              <br />
              <span className="text-[#2563EB]">AI가 먼저 알려드립니다</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-lg font-semibold leading-8 text-[#4B5563]">
              매일의 안부를 기록하는 것이 아니라 평소와 다른 신호를 발견해 부모님의 안심 상태를
              알려드립니다.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-[520px] gap-3">
            <a
              href="/app"
              className="flex min-h-16 w-full items-center justify-center rounded-[24px] bg-[#2563EB] px-6 text-lg font-black text-white shadow-[0_18px_42px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              오늘안부 시작하기
            </a>
            <a
              href="/app"
              className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-[24px] bg-[#FDE047] px-6 text-base font-black text-[#1F2937] shadow-[0_16px_34px_rgba(253,224,71,0.30)] transition hover:-translate-y-0.5 hover:bg-[#FACC15] focus:outline-none focus:ring-4 focus:ring-yellow-200"
            >
              <MessageCircle size={19} aria-hidden />
              카카오톡으로 시작하기
            </a>
            <a
              href="/guide"
              className="flex min-h-14 w-full items-center justify-center rounded-[24px] border border-[#BFDBFE] bg-white/75 px-6 text-base font-black text-[#2563EB] shadow-[0_12px_30px_rgba(37,99,235,0.10)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              서비스 둘러보기
            </a>
          </div>

          <a
            href="/app"
            className="mx-auto inline-flex text-sm font-black text-[#2563EB] underline-offset-4 hover:underline"
          >
            이미 등록하셨나요? 안심 상태 확인하기
          </a>
        </div>

        <div className="z-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {reassuranceBadges.map((badge) => (
            <div
              key={badge}
              className="rounded-[20px] bg-white/80 px-3 py-3 text-center text-sm font-black text-[#2563EB] shadow-[0_12px_30px_rgba(37,99,235,0.10)] backdrop-blur"
            >
              <span className="text-[#22C55E]">✓</span> {badge}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-[#FDE047]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-24 size-80 rounded-full bg-[#93C5FD]/55 blur-3xl" />
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 pb-14 sm:px-8">
        <div className="warm-card fade-in rounded-[24px] bg-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.12)] sm:p-8">
          <h2 className="text-2xl font-black tracking-normal">안심하고 이용하세요</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="rounded-[20px] bg-[#EFF6FF] px-4 py-4 font-black text-[#1F2937]">
                <span className="text-[#22C55E]">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
