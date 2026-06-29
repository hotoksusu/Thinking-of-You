import Link from "next/link";
import { ArrowRight, Brain, Gift, Link as LinkIcon, MessageCircle, PackageOpen, Sprout, UserRoundPlus } from "lucide-react";

const guideSteps = [
  { number: "1", title: "자녀가 오늘안부를 시작합니다", description: "부모님 이름과 편한 연락 방식을 정하고 전용 링크를 준비합니다.", icon: UserRoundPlus, audience: "자녀" },
  { number: "2", title: "부모님과 연결합니다", description: "설치 설명 없이 카카오톡이나 문자로 부모님께 링크를 보냅니다.", icon: LinkIcon, audience: "자녀" },
  { number: "3", title: "AI의 환영을 받고 첫 씨앗을 심습니다", description: "농장의 의미를 천천히 읽고 키우고 싶은 작물을 고릅니다. 이 순간이 부모님의 첫 경험입니다.", icon: Sprout, audience: "부모님" },
  { number: "4", title: "20초 동안 오늘을 남깁니다", description: "큰 버튼으로 있었던 일과 느낌을 고릅니다. 추가 질문은 건너뛰어도 됩니다.", icon: MessageCircle, audience: "부모님" },
  { number: "5", title: "AI가 하루를 따뜻하게 정리합니다", description: "오늘의 한 줄과 생활 흐름을 보여주고 가족에게 안심 신호를 전합니다.", icon: Brain, audience: "함께" },
  { number: "6", title: "안부만큼 작물이 자랍니다", description: "하루 한 번 자동으로 자랍니다. 부모님께 매일 다시 돌아올 작은 이유가 생깁니다.", icon: Sprout, audience: "부모님" },
  { number: "7", title: "꾸준한 안부를 수확합니다", description: "다 자란 작물은 디지털 수확 창고에 차곡차곡 모입니다.", icon: PackageOpen, audience: "부모님" },
  { number: "8", title: "계절의 즐거움으로 이어집니다", description: "수확물은 브랜드 협업이 열릴 때 시즌 이벤트 참여에 활용할 수 있습니다.", icon: Gift, audience: "함께" },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <header className="mx-auto flex w-full max-w-[1040px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black text-[#2563EB]">오늘안부</Link>
        <nav className="flex items-center gap-5 text-sm font-bold text-[#6B7280]">
          <Link href="/">홈</Link>
          <Link href="/app" className="text-[#2563EB]">앱 체험</Link>
        </nav>
      </header>

      <section className="border-y border-[#BBF7D0] bg-[#F0FDF4]">
        <div className="mx-auto w-full max-w-[1040px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-black text-[#15803D]">오늘안부 제품 가이드</p>
          <h1 className="mt-4 max-w-[760px] text-4xl font-black leading-tight sm:text-5xl">
            첫 연결부터 첫 수확까지,
            <br />
            안심이 자라는 흐름
          </h1>
          <p className="mt-6 max-w-[700px] text-lg font-semibold leading-8 text-[#4B5563]">
            부모님께는 매일 돌아올 작은 즐거움을,
            <br />
            자녀에게는 쌓일수록 선명해지는 안심 흐름을 전합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1040px] px-5 py-16 sm:px-8">
        <p className="text-sm font-black text-[#2563EB]">전체 이용 흐름</p>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">기능보다 경험의 순서로 이해하세요.</h2>
        <div className="mt-10 border-t border-[#E5E7EB]">
          {guideSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="grid gap-4 border-b border-[#E5E7EB] py-7 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-lg font-black text-[#2563EB]">{step.number}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon size={21} className="text-[#15803D]" aria-hidden />
                    <h3 className="text-xl font-black leading-8">{step.title}</h3>
                  </div>
                  <p className="mt-2 font-semibold leading-7 text-[#6B7280]">{step.description}</p>
                </div>
                <span className="w-fit rounded-full bg-[#F9FAFB] px-3 py-1 text-sm font-black text-[#4B5563]">{step.audience}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto grid w-full max-w-[1040px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-black text-[#F97316]">부모님 경험</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">관리받는 느낌 없이<br />나의 하루를 가꿉니다.</h2>
            <p className="mt-5 font-semibold leading-8 text-[#6B7280]">작물을 키우기 위해 복잡한 행동을 하지 않습니다. 오늘의 안부만 남기면 AI가 하루를 기억하고 작물은 자동으로 자랍니다.</p>
          </div>
          <div>
            <p className="text-sm font-black text-[#2563EB]">자녀 경험</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">재촉하지 않아도<br />안심 흐름을 봅니다.</h2>
            <p className="mt-5 font-semibold leading-8 text-[#6B7280]">부모님이 스스로 꾸준히 남긴 기록을 바탕으로 생활 흐름과 변화 요약을 확인합니다. 농장은 기록 습관을 돕고, 안심 리포트는 그 기록의 의미를 전합니다.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[820px] px-5 py-16 text-center sm:px-8">
        <Sprout size={38} className="mx-auto text-[#15803D]" aria-hidden />
        <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">첫 씨앗부터 직접 경험해보세요.</h2>
        <p className="mt-4 font-semibold leading-8 text-[#6B7280]">AI의 환영을 받고 첫 씨앗을 심으면 오늘의 기록이 시작됩니다.</p>
        <Link href="/app?role=parent" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-7 font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.22)]">
          첫 씨앗 심어보기
          <ArrowRight size={18} aria-hidden />
        </Link>
      </section>
    </main>
  );
}
