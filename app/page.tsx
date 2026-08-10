import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Footprints,
  Menu,
  MousePointer2,
  Phone,
  Smartphone,
} from "lucide-react";

const signals = [
  ["걷는 양", "평소와 비슷", Footprints],
  ["움직임", "평소와 비슷", MousePointer2],
  ["휴대전화 사용", "평소와 비슷", Smartphone],
] as const;

const states = [
  {
    label: "평소와 비슷",
    tone: "green",
    title: "오늘은 평소와 비슷해요.",
    text: "특별히 확인할 변화가 없습니다.",
  },
  {
    label: "변화 관찰",
    tone: "cream",
    title: "오늘 평소와 조금 다른 변화가 있어요.",
    text: "조금 더 지켜보고 있어요.",
  },
  {
    label: "확인 권장",
    tone: "orange",
    title: "평소와 다른 변화가 이어지고 있어요.",
    text: "부모님께 한번 연락해보세요.",
  },
] as const;

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF9F0] text-[#1D2D27]">
      <Header />

      <section className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:min-h-[690px] lg:grid-cols-[1.04fr_.96fr] lg:gap-14 lg:py-20">
        <div className="max-w-[650px]">
          <p className="inline-flex items-center rounded-full bg-[#E8F2E4] px-4 py-2 text-base font-black text-[#286143] sm:text-lg">
            부모님은 평소처럼, 가족은 필요한 날만
          </p>
          <h1 className="mt-6 text-[clamp(2.7rem,5vw,4.25rem)] font-black leading-[1.12] tracking-[-.045em]">
            매일 연락하지 못해도,<br />
            <span className="text-[#2F6B46]">평소와 다른 변화는</span><br />
            놓치지 않도록.
          </h1>
          <p className="mt-6 max-w-[620px] text-[clamp(1.12rem,1.45vw,1.32rem)] font-bold leading-[1.75] text-[#53645C]">
            부모님이 따로 기록하지 않아도 걷기와 휴대전화 사용 등 생활 패턴을 자동으로 살펴보고,
            평소와 다른 변화가 이어지면 가족에게 알려드립니다.
          </p>
          <ul className="mt-7 grid gap-3 text-lg font-extrabold text-[#344A40] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {["직접 기록 없이", "부모님의 평소와 비교", "변화가 있을 때 알림"].map((item) => (
              <li key={item} className="flex items-center gap-2"><Check size={22} className="shrink-0 text-[#2F6B46]" />{item}</li>
            ))}
          </ul>
          <Link id="landing-primary-cta" href="#family-result" className="mt-8 inline-flex min-h-[66px] w-full items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,.22)] transition hover:-translate-y-0.5 hover:bg-[#D95C24] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2F6B46] sm:w-auto">
            어떻게 알려주는지 보기 <ArrowDown size={23} />
          </Link>
        </div>

        <FamilyStatusCard />
      </section>

      <section id="family-result" className="scroll-mt-24 border-y border-[#DFE7DC] bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-7 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-lg font-black text-[#D95C24]">가족이 받는 안부</p>
              <h2 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-black leading-[1.18] tracking-[-.035em]">매일 들여다보지 않아도<br />한 문장으로 안심하세요.</h2>
            </div>
            <p className="max-w-[650px] text-lg font-bold leading-8 text-[#5B6B64] lg:justify-self-end lg:text-xl">오늘안부는 의료 진단이나 위험 경고가 아닙니다. 부모님의 평소 생활과 비교해 변화가 이어질 때, 가족이 한번 확인할 수 있도록 알려드립니다.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {states.map((state) => <StateCard key={state.label} {...state} />)}
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-center text-lg font-black text-[#D95C24]">세 단계면 충분합니다</p>
          <h2 className="mt-3 text-center text-[clamp(2.25rem,4vw,3.5rem)] font-black tracking-[-.035em]">평소처럼 지내면, 오늘안부가 살펴봐요.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <Step number="1" title="부모님은 평소처럼 생활하세요." text="매일 기록하거나 새로운 습관을 만들 필요가 없습니다.">
              <div className="grid grid-cols-3 gap-2">
                {["걷기", "움직임", "휴대전화"].map((item) => <span key={item} className="rounded-xl bg-[#EDF5E9] px-2 py-3 text-center text-sm font-black text-[#315B3D] sm:text-base">{item}</span>)}
              </div>
              <p className="mt-5 font-black text-[#2F6B46]">생활 패턴을 자동으로 살펴봅니다.</p>
            </Step>
            <Step number="2" title="평소 생활과 비교합니다." text="다른 사람의 기준이 아니라 부모님의 평소 패턴과 비교합니다.">
              <div className="flex items-end justify-between rounded-2xl bg-[#F5F1E8] p-5">
                <div><span className="text-sm font-black text-[#6D746E]">평소 걸음</span><strong className="mt-1 block text-2xl">4,800보</strong></div>
                <ArrowRight className="mb-1 text-[#A36A45]" />
                <div className="text-right"><span className="text-sm font-black text-[#6D746E]">오늘</span><strong className="mt-1 block text-2xl text-[#B94C24]">1,200보</strong></div>
              </div>
              <p className="mt-5 font-black text-[#72533F]">하나의 숫자가 아니라 여러 생활 변화를 함께 살펴봅니다.</p>
            </Step>
            <Step number="3" title="확인이 필요할 때 알려드려요." text="평소와 다른 변화가 함께 이어지면 가족에게 행동 하나를 제안합니다.">
              <div className="rounded-2xl bg-[#FFF0E7] p-5">
                <p className="font-black text-[#A94721]">평소와 다른 변화가 이어지고 있어요.</p>
                <p className="mt-2 font-bold text-[#5D514A]">부모님께 한번 연락해보세요.</p>
              </div>
              <p className="mt-5 font-black text-[#2F6B46]">매일 확인하지 않아도 변화가 있을 때 알 수 있습니다.</p>
            </Step>
          </div>
        </div>
      </section>

      <section className="bg-[#EAF3E5] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
          <RoleCard role="부모님 화면" title="평소처럼 생활하세요." text="복잡한 분석이나 입력 없이, 필요한 경우에도 큰 답 하나만 누를 수 있어요." href="/parent-start" cta="부모님 화면 보기" image="/brand/hero-ansimi-phone-v1.png" />
          <RoleCard role="가족 화면" title="매일 확인하지 않아도 괜찮아요." text="오늘 상태와 평소 대비 변화, 확인이 필요한 경우의 행동만 간단히 보여드려요." href="/family-intro" cta="가족 화면 보기" image="/illustrations/todayanbu-hero.png" />
        </div>
      </section>

      <section className="bg-[#173F35] px-5 py-16 text-center text-white sm:px-8 sm:py-24">
        <p className="text-lg font-black text-[#B9E1C0]">매일 확인하지 않아도 되는 안심</p>
        <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(2.25rem,4vw,3.5rem)] font-black leading-[1.2]">부모님은 평소처럼,<br />가족은 달라진 날만 확인하세요.</h2>
        <Link href="/start" className="mt-8 inline-flex min-h-[68px] items-center justify-center gap-2 rounded-2xl bg-white px-8 text-xl font-black text-[#173F35]">우리 부모님 연결해보기 <ArrowRight size={23} /></Link>
        <p className="mt-5 text-base font-bold text-white/70">현재 체험 화면의 생활 데이터는 이해를 돕기 위한 데모입니다.</p>
      </section>

      <footer className="border-t border-[#E2E7DF] bg-white px-5 py-9 text-center font-bold text-[#65736C]">오늘안부 · 의료 진단이 아닌 생활 변화 안내 서비스</footer>
    </main>
  );
}

function Header() {
  return <header className="sticky top-0 z-50 border-b border-[#E1E7DE] bg-[#FFF9F0]/95 backdrop-blur">
    <div className="mx-auto flex min-h-[76px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:min-h-[88px]">
      <Link href="/" className="flex min-h-12 items-center gap-3 text-2xl font-black text-[#315B3D]"><Image src="/brand/brand-icon.png" alt="" width={44} height={44} className="rounded-xl" />오늘안부</Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
        <Link href="#how" className="flex min-h-12 items-center rounded-xl px-4 text-lg font-black text-[#46584F]">서비스 소개</Link>
        <Link href="/guide" className="flex min-h-12 items-center rounded-xl px-4 text-lg font-black text-[#46584F]">이용 안내</Link>
        <Link href="/app" className="flex min-h-12 items-center rounded-xl px-4 text-lg font-black text-[#46584F]">로그인</Link>
      </nav>
      <details className="relative lg:hidden"><summary className="flex size-12 cursor-pointer list-none items-center justify-center rounded-xl border-2 border-[#C8D6C4] bg-white [&::-webkit-details-marker]:hidden" aria-label="메뉴 열기"><Menu size={27} /></summary><nav className="absolute right-0 top-14 w-56 rounded-2xl border border-[#E1E6DE] bg-white p-3 shadow-xl"><Link href="#how" className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black">서비스 소개</Link><Link href="/guide" className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black">이용 안내</Link><Link href="/app" className="flex min-h-14 items-center rounded-xl px-4 text-lg font-black">로그인</Link></nav></details>
    </div>
  </header>;
}

function FamilyStatusCard() {
  return <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
    <div className="absolute -inset-6 -z-10 rounded-full bg-[#E6F1E1] blur-2xl" />
    <div className="rounded-[34px] border border-[#DCE7D9] bg-white p-5 shadow-[0_26px_70px_rgba(49,78,58,.15)] sm:p-7">
      <div className="flex items-center justify-between border-b border-[#E8ECE5] pb-5"><div><p className="text-sm font-black text-[#77827C]">오늘안부</p><p className="mt-1 text-lg font-black">어머니의 오늘</p></div><Image src="/brand/brand-icon.png" alt="" width={46} height={46} className="rounded-xl" /></div>
      <div className="py-7"><span className="rounded-full bg-[#E8F3E5] px-3 py-2 text-sm font-black text-[#2F6B46]">오늘 상태</span><h2 className="mt-5 text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">오늘은 평소와<br />비슷해요.</h2><p className="mt-3 text-lg font-bold text-[#65736C]">특별히 확인할 변화가 없습니다.</p></div>
      <div className="grid gap-3">{signals.map(([name,status,Icon]) => <div key={name} className="flex min-h-16 items-center gap-4 rounded-2xl bg-[#F4F8F1] px-4"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2F6B46]"><Icon size={21} /></span><strong className="flex-1 text-lg">{name}</strong><span className="font-black text-[#2F6B46]">{status}</span></div>)}</div>
      <p className="mt-5 rounded-2xl bg-[#FFF4E9] p-4 text-center font-black text-[#795338]">가족이 매일 앱을 확인할 필요가 없어요.</p>
    </div>
  </div>;
}

function StateCard({ label, tone, title, text }: { label: string; tone: "green" | "cream" | "orange"; title: string; text: string }) {
  const tones = { green: "bg-[#EDF6E9] text-[#2F6B46]", cream: "bg-[#FFF5E7] text-[#8A5D31]", orange: "bg-[#FFF0E9] text-[#A94721]" };
  return <article className="rounded-[28px] border border-[#E1E7DE] bg-[#FCFDFB] p-6 sm:p-7"><span className={`inline-flex rounded-full px-3 py-2 text-sm font-black ${tones[tone]}`}>{label}</span><h3 className="mt-6 text-2xl font-black leading-9">{title}</h3><p className="mt-3 text-lg font-bold leading-8 text-[#607067]">{text}</p>{tone === "orange" && <div className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2F6B46] px-4 text-lg font-black text-white"><Phone size={21} /> 부모님께 전화하기</div>}</article>;
}

function Step({ number, title, text, children }: { number: string; title: string; text: string; children: React.ReactNode }) {
  return <article className="rounded-[30px] border-2 border-[#DDE6DA] bg-white p-6 shadow-[0_15px_40px_rgba(49,78,58,.06)] sm:p-8"><span className="flex size-12 items-center justify-center rounded-full bg-[#2F6B46] text-xl font-black text-white">{number}</span><h3 className="mt-6 text-2xl font-black leading-9">{title}</h3><p className="mt-3 min-h-[88px] text-lg font-bold leading-8 text-[#5A6A62]">{text}</p><div className="mt-6 border-t border-[#E4E9E1] pt-6">{children}</div></article>;
}

function RoleCard({ role, title, text, href, cta, image }: { role: string; title: string; text: string; href: string; cta: string; image: string }) {
  return <article className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_18px_45px_rgba(49,78,58,.08)] sm:grid-cols-[1.12fr_.88fr]"><div className="p-7 sm:p-9"><p className="text-lg font-black text-[#D95C24]">{role}</p><h3 className="mt-3 text-3xl font-black leading-tight">{title}</h3><p className="mt-4 text-lg font-bold leading-8 text-[#5C6C64]">{text}</p><Link href={href} className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#2F6B46] px-6 text-lg font-black text-white">{cta} <ArrowRight size={21} /></Link></div><div className="min-h-[230px] bg-[#F1E8D8]"><Image src={image} alt="" width={520} height={500} className="h-full w-full object-cover" /></div></article>;
}
