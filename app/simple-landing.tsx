import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Footprints,
  HeartHandshake,
  Smartphone,
  UserRound,
  UsersRound,
} from "lucide-react";

export default function SimpleLandingPage() {
  return (
    <main className="landing-typography min-h-screen overflow-x-hidden bg-[#FFF9F0] text-[#17251F]">
      <Header />

      <section className="mx-auto grid w-full max-w-[1240px] items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-12 lg:py-12 xl:gap-16 xl:py-14">
        <div className="text-center lg:text-left">
          <p className="typo-label font-semibold text-[#286141]">부모님을 위한 편안한 안부</p>
          <h1 className="typo-display mt-3">
            부모님은<br /><span className="whitespace-nowrap">평소처럼 지내세요.</span>
          </h1>
          <p className="typo-body-readable mx-auto mt-4 lg:mx-0">
            <strong className="font-semibold text-[#24382F]">생활의 변화를 자동으로 살펴봅니다.</strong><br />걷기와 휴대전화 사용 같은 평소 생활을 기준으로 확인해요.
          </p>
          <p className="mt-4 text-[1.25rem] font-semibold leading-8 text-[#C64F20] sm:text-[1.35rem]">매일 기록하지 않아도 됩니다.</p>
          <MainCta className="lg:mx-0" />
        </div>

        <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[28px] bg-[#EAF3E5] shadow-[0_18px_46px_rgba(48,76,58,.14)]">
          <Image
            src="/illustrations/oneul-anbu-ai-hero.png"
            alt="평소처럼 생활하는 부모님과 소식을 확인하는 가족"
            width={1728}
            height={910}
            priority
            className="block h-auto w-full object-contain"
          />
        </div>
      </section>

      <section className="border-y border-[#DFE7DE] bg-[#F1F7EE] px-5 py-14 sm:px-8 sm:py-[72px] lg:py-20">
        <div className="mx-auto max-w-[880px] text-center">
          <p className="typo-label font-semibold text-[#C64F20]">가족에게 보이는 내용</p>
          <h2 className="typo-section-title mt-3">평소와 다를 때 알려드려요.</h2>

          <article className="mx-auto mt-8 max-w-[680px] rounded-[28px] border-2 border-[#D4E1D5] bg-white p-6 text-left shadow-[0_14px_38px_rgba(50,79,60,.09)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-[#EAF4E9] px-4 py-2 text-lg font-semibold text-[#286141]">오늘 상태</span>
              <span className="typo-support-readable whitespace-nowrap">오전 9시 확인</span>
            </div>
            <div className="mt-7 flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4E9] text-[#2D6C48]">
                <Check size={30} strokeWidth={3} aria-hidden />
              </span>
              <div>
                <h3 className="typo-state">오늘은 평소와 비슷해요.</h3>
                <p className="typo-body-readable mt-2">특별히 확인할 변화가 없어요.</p>
              </div>
            </div>
            <details className="group mt-5 border-t border-[#DFE7DE] pt-3">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-lg font-semibold text-[#315B3D] [&::-webkit-details-marker]:hidden">생활 변화 자세히 보기 <ChevronDown className="transition-transform group-open:rotate-180" size={22} /></summary>
              <p className="typo-support-readable mt-2">걷기 · 움직임 · 휴대전화 사용이 평소 범위에 있어요.</p>
            </details>
          </article>

          <p className="typo-body-readable mx-auto mt-5">
            평소와 다른 변화가 이어지면 가족에게 알려드려요.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-[72px] lg:py-20">
        <div className="mx-auto max-w-[940px]">
          <div className="text-center">
            <p className="typo-label font-semibold text-[#C64F20]">사용 방법</p>
            <h2 className="typo-section-title mt-3">부모님도, 가족도 어렵지 않아요.</h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <RoleCard
              icon={<UserRound size={38} aria-hidden />}
              title="부모님"
              items={["평소처럼 생활하기", "매일 기록하지 않아도 됨"]}
              tone="border-[#F1CFB4] bg-[#FFF1E5] text-[#B84C1F]"
            />
            <RoleCard
              icon={<UsersRound size={38} aria-hidden />}
              title="가족"
              items={["평소와 다른 변화 확인", "매일 앱을 확인하지 않아도 됨"]}
              tone="border-[#C8DDCE] bg-[#EAF4EE] text-[#286141]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#184C36] px-5 py-14 text-center text-white sm:px-8 sm:py-[72px]">
        <div className="mx-auto max-w-[720px]">
          <HeartHandshake className="mx-auto text-[#BDE1C8]" size={48} aria-hidden />
          <h2 className="typo-section-title mt-5 text-white">
            부모님의 평소 생활,<br />오늘안부가 조용히 살펴봅니다.
          </h2>
          <MainCta light />

          <details className="group mx-auto mt-7 max-w-[560px] text-left">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-center gap-2 text-lg font-black text-[#D8E9DF] [&::-webkit-details-marker]:hidden">
              서비스를 조금 더 알아보기
              <ChevronDown className="transition-transform group-open:rotate-180" size={22} aria-hidden />
            </summary>
            <div className="mt-3 grid gap-3 rounded-2xl bg-white/10 p-5 text-lg font-bold leading-8 text-[#F1F7F3]">
              <p className="flex items-start gap-3"><Footprints className="mt-1 shrink-0" size={23} aria-hidden />부모님이 동의한 생활 정보만 연결합니다.</p>
              <p className="flex items-start gap-3"><Smartphone className="mt-1 shrink-0" size={23} aria-hidden />통화·문자·사진의 내용은 확인하지 않습니다.</p>
              <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-3 text-base underline underline-offset-4">
                <Link href="/about">서비스 소개</Link>
                <Link href="/privacy-simple">개인정보 안내</Link>
                <Link href="/help">자주 묻는 질문</Link>
              </div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-[#E4E8E2] bg-[#FFF9F0]/95">
      <div className="mx-auto flex min-h-[70px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex min-h-12 items-center gap-3 text-xl font-black" aria-label="오늘안부 홈">
          <Image src="/brand/oneul-anbu-icon.png" alt="" width={44} height={44} className="rounded-xl" />오늘안부
        </Link>
        <Link href="/about" className="flex min-h-12 items-center px-2 text-base font-black text-[#40554B] sm:text-lg">사용 방법</Link>
      </div>
    </header>
  );
}

function MainCta({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/start"
      className={`mx-auto mt-7 flex min-h-[70px] w-full max-w-[380px] items-center justify-center gap-2 rounded-2xl px-7 text-[1.3rem] font-bold shadow-[0_14px_30px_rgba(31,107,72,.18)] focus:outline-none focus:ring-4 focus:ring-[#F2A06B] ${light ? "bg-white text-[#184C36]" : "bg-[#1F6B48] text-white"} ${className}`}
    >
      가족과 시작하기 <ArrowRight size={24} aria-hidden />
    </Link>
  );
}

function RoleCard({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <article className={`rounded-[28px] border-2 p-6 sm:p-8 ${tone}`}>
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/70">{icon}</span>
        <h3 className="text-[1.65rem] font-bold text-[#17251F] sm:text-[1.85rem]">{title}</h3>
      </div>
      <ul className="mt-5 grid gap-3 text-[1.18rem] font-medium leading-8 text-[#33483E] sm:text-[1.25rem]">
        {items.map((item) => <li key={item} className="flex items-start gap-3"><Check className="mt-1 shrink-0 text-[#367153]" size={24} strokeWidth={3} aria-hidden />{item}</li>)}
      </ul>
    </article>
  );
}
