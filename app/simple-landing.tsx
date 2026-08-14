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
    <main className="min-h-screen overflow-x-hidden bg-[#FFF9F0] text-[#17251F]">
      <Header />

      <section className="mx-auto grid min-h-[calc(100svh-76px)] w-full max-w-[1180px] items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-16 lg:py-16">
        <div className="text-center lg:text-left">
          <p className="text-lg font-black text-[#347052] sm:text-xl">부모님을 위한 편안한 안부</p>
          <h1 className="mt-5 text-[clamp(2.7rem,8.6vw,4.8rem)] font-black leading-[1.08] tracking-[-.045em]">
            부모님은<br />평소처럼 생활하세요.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[1.28rem] font-bold leading-[1.65] text-[#43564D] sm:text-[1.55rem] lg:mx-0">
            걷기와 휴대전화 사용 같은<br />생활 변화를 자동으로 살펴봅니다.
          </p>
          <p className="mt-5 text-[1.35rem] font-black text-[#D95823] sm:text-[1.6rem]">매일 기록하지 않아도 됩니다.</p>
          <MainCta className="lg:mx-0" />
        </div>

        <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#EAF3E5] shadow-[0_22px_58px_rgba(48,76,58,.15)]">
          <Image
            src="/illustrations/oneul-anbu-ai-hero.png"
            alt="평소처럼 생활하는 부모님과 소식을 확인하는 가족"
            width={1728}
            height={910}
            priority
            className="aspect-[1.08/1] h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-[#DFE7DE] bg-[#F1F7EE] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[880px] text-center">
          <p className="text-lg font-black text-[#D95823]">가족에게 보이는 내용</p>
          <h2 className="mt-3 text-[clamp(2.25rem,7vw,3.6rem)] font-black leading-[1.15] tracking-[-.035em]">평소와 다를 때 알려드려요.</h2>

          <article className="mx-auto mt-10 max-w-[680px] rounded-[30px] border-2 border-[#D4E1D5] bg-white p-6 text-left shadow-[0_18px_48px_rgba(50,79,60,.1)] sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-[#EAF4E9] px-4 py-2 text-base font-black text-[#286141]">오늘의 생활</span>
              <span className="text-base font-bold text-[#627269]">오전 9시 확인</span>
            </div>
            <div className="mt-7 flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4E9] text-[#2D6C48]">
                <Check size={30} strokeWidth={3} aria-hidden />
              </span>
              <div>
                <h3 className="text-[1.7rem] font-black leading-tight sm:text-[2rem]">오늘은 평소와 비슷해요.</h3>
                <p className="mt-3 text-[1.18rem] font-bold leading-8 text-[#52635B] sm:text-[1.3rem]">
                  걷기와 휴대전화 사용 등<br />평소 생활과 큰 차이가 없어요.
                </p>
              </div>
            </div>
          </article>

          <p className="mt-6 text-[1.15rem] font-bold leading-8 text-[#52635B] sm:text-xl">
            변화가 이어지면 가족에게<br className="sm:hidden" /> 한번 연락해보시도록 알려드려요.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[940px]">
          <div className="text-center">
            <p className="text-lg font-black text-[#D95823]">사용 방법</p>
            <h2 className="mt-3 text-[clamp(2.25rem,7vw,3.6rem)] font-black leading-[1.15] tracking-[-.035em]">부모님도, 가족도 어렵지 않아요.</h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
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

      <section className="bg-[#184C36] px-5 py-16 text-center text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[720px]">
          <HeartHandshake className="mx-auto text-[#BDE1C8]" size={48} aria-hidden />
          <h2 className="mt-5 text-[clamp(2rem,7vw,3.2rem)] font-black leading-[1.25]">
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
      <div className="mx-auto flex min-h-[76px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
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
      className={`mx-auto mt-8 flex min-h-[68px] w-full max-w-[360px] items-center justify-center gap-2 rounded-2xl px-7 text-[1.3rem] font-black shadow-[0_16px_34px_rgba(31,107,72,.2)] focus:outline-none focus:ring-4 focus:ring-[#F2A06B] ${light ? "bg-white text-[#184C36]" : "bg-[#1F6B48] text-white"} ${className}`}
    >
      우리 가족 시작하기 <ArrowRight size={24} aria-hidden />
    </Link>
  );
}

function RoleCard({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <article className={`rounded-[28px] border-2 p-6 sm:p-8 ${tone}`}>
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/70">{icon}</span>
        <h3 className="text-[1.8rem] font-black text-[#17251F] sm:text-[2rem]">{title}</h3>
      </div>
      <ul className="mt-7 grid gap-4 text-[1.2rem] font-black leading-8 text-[#33483E] sm:text-[1.35rem]">
        {items.map((item) => <li key={item} className="flex items-start gap-3"><Check className="mt-1 shrink-0 text-[#367153]" size={24} strokeWidth={3} aria-hidden />{item}</li>)}
      </ul>
    </article>
  );
}
