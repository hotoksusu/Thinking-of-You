import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Check,
  Clock3,
  EyeOff,
  Gift,
  HeartHandshake,
  Leaf,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRoundCheck,
} from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const steps = [
  { icon: MessageCircle, title: "부모님이 기록해요", text: "오늘 하루를 몇 번의 선택으로 남겨요." },
  { icon: Sparkles, title: "변화를 살펴봐요", text: "어제와 다른 점이 있는지 차분히 살펴요." },
  { icon: HeartHandshake, title: "가족에게 전해요", text: "가족이 이해하기 쉬운 말로 알려드려요." },
];

const privacyNotes = [
  "위치나 통화 내용을 보지 않아요.",
  "부모님이 직접 남긴 내용만 나눠요.",
  "공유 범위는 언제든 바꿀 수 있어요.",
];

const childView = ["오늘 기록 여부", "이번 주 안심 상태", "생활 변화 흐름", "쉬운 한 줄 요약"];

const weeklyBars = [42, 55, 48, 64, 58, 72, 78];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-28 text-[#20302C]">
      <MarketingHeader />

      <section className="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden border-b border-[#E7E5DE] bg-[#F6EDDF]">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
          <Image src="/brand/hero-family.png" alt="오늘을 기록하는 부모님 곁의 안심이" fill priority className="object-cover" sizes="48vw" />
        </div>
        <div className="absolute inset-y-0 left-0 w-full bg-[#FFF9F0] lg:w-[58%]" aria-hidden />
        <div className="relative z-10 mx-auto grid min-h-[720px] w-full max-w-[1200px] items-center px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-[680px]">
            <p className="text-xl font-black leading-8 text-[#E9652B]">오늘을 남기면<br className="sm:hidden" /> 가족에게 안심이 전해져요</p>
            <h1 className="mt-6 text-[3rem] font-black leading-[1.16] sm:text-[4rem]">매일 20초,<br /><span className="text-[#52725B]">오늘을 남겨주세요.</span></h1>
            <p className="mt-7 max-w-[650px] text-[1.35rem] font-bold leading-10 text-[#43564E]">부모님은 하루를 간단히 기록하고,<br />자녀는 생활의 변화를 보며 안심해요.</p>

            <div className="mt-7 flex max-w-[640px] flex-wrap gap-3" aria-label="오늘안부 핵심 안내">
              {["앱 설치 필요 없음", "하루 20초", "변화만 살펴보기", "가족과 연결"].map((label) => (
                <span key={label} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D8E3D5] bg-white px-4 text-base font-black text-[#40534B]"><Check size={18} aria-hidden />{label}</span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link id="landing-primary-cta" href="/start" className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-8 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.22)]">오늘안부 시작하기 <ArrowRight size={22} aria-hidden /></Link>
              <Link href="/guide" className="inline-flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#8FA98D] bg-white px-8 text-xl font-black text-[#31473D]">이용 방법 보기</Link>
            </div>

            <div className="relative mt-9 aspect-[4/3] overflow-hidden rounded-[24px] lg:hidden">
              <Image src="/brand/hero-family.png" alt="부모님과 오늘안부 안심이" fill priority className="object-cover" sizes="100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="rounded-[24px] border-2 border-[#B8CDB5] bg-[#EEF5E9] p-7 sm:p-9">
          <div className="grid gap-7 md:grid-cols-[auto_1fr] md:items-start">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#52725B]"><ShieldCheck size={34} aria-hidden /></span>
            <div>
              <p className="text-lg font-black text-[#52725B]">먼저 안심하세요</p>
              <h2 className="mt-2 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">휴대폰을 감시하지 않아요.</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {privacyNotes.map((note) => <p key={note} className="flex items-start gap-2 text-lg font-bold leading-8 text-[#43564E]"><Check size={21} className="mt-1 shrink-0 text-[#52725B]" aria-hidden />{note}</p>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#DFE7DC] bg-[#F1F5EB] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="text-lg font-black text-[#52725B]">어떻게 사용하나요?</p>
          <h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">부모님이 할 일은<br />하루를 남기는 것뿐이에요.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-[24px] bg-white p-7">
                <span className="text-lg font-black text-[#E9652B]">{index + 1}단계</span>
                <Icon size={32} className="mt-6 text-[#52725B]" aria-hidden />
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-lg font-semibold leading-8 text-[#596861]">{text}</p>
              </article>
            ))}
          </div>
          <Link href="/guide" className="mt-10 inline-flex min-h-[60px] items-center gap-2 rounded-2xl border-2 border-[#8FA98D] bg-white px-7 text-lg font-black text-[#31473D]">이용 방법 자세히 보기 <ArrowRight size={20} aria-hidden /></Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-lg font-black text-[#E9652B]">왜 매일 남기나요?</p>
          <h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">작은 기록이 모이면<br />생활의 변화가 보여요.</h2>
          <p className="mt-5 max-w-[560px] text-xl font-semibold leading-9 text-[#52635C]">하루만 보지 않아요.<br />일주일과 한 달의 흐름을 함께 살펴드려요.</p>
        </div>
        <article className="rounded-[24px] border border-[#DCE4D9] bg-white p-7">
          <div className="flex items-center justify-between gap-4"><div><p className="text-lg font-black text-[#52725B]">최근 7일의 흐름</p><p className="mt-1 text-base font-bold text-[#68756F]">꾸준히 잘 이어지고 있어요.</p></div><Leaf size={32} className="text-[#6F8D72]" aria-hidden /></div>
          <div className="mt-8 flex h-48 items-end gap-3" aria-label="최근 7일 생활 기록 예시 그래프">
            {weeklyBars.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2"><span className="w-full rounded-t-xl bg-[#9DBA91]" style={{ height: `${height}%` }} /><span className="text-center text-sm font-black text-[#68756F]">{index + 1}일</span></div>)}
          </div>
        </article>
      </section>

      <section className="bg-[#203C2B] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="text-lg font-black text-[#B9E1C0]">꾸준히 이어가는 즐거움</p>
            <h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">오늘을 남길 때마다<br />안심이의 작물도 자라요.</h2>
            <p className="mt-5 max-w-[580px] text-lg font-semibold leading-8 text-white/80">7일 연속 기록과 작물 성장을 보며<br />작은 성취감을 느낄 수 있어요.</p>
            <p className="mt-5 rounded-2xl bg-white/10 px-5 py-4 text-base font-bold leading-7 text-white/75">시즌 수확 이벤트가 열리면 제철 농산물을 실제로 만날 수도 있어요.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Reward icon={Sprout} title="작물이 자랐어요" text="오늘도 한 단계 성장" />
            <Reward icon={Sparkles} title="7일 연속 성공" text="안부가 꾸준히 이어져요" />
            <Reward icon={Gift} title="수확을 기다려요" text="시즌 이벤트로 만나요" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-lg font-black text-[#E9652B]">자녀에게 무엇이 보이나요?</p>
          <h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">모든 내용이 아니라<br />필요한 안심만 보여요.</h2>
          <p className="mt-5 max-w-[560px] text-xl font-semibold leading-9 text-[#52635C]">위치나 통화 내용은 보이지 않아요.<br />부모님이 남긴 기록의 흐름만 전해져요.</p>
        </div>
        <article className="rounded-[24px] border border-[#DCE4D9] bg-white p-7">
          <div className="flex items-center gap-4"><span className="flex size-14 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><UserRoundCheck size={29} aria-hidden /></span><div><p className="text-lg font-black text-[#52725B]">가족에게 보이는 내용</p><p className="mt-1 font-bold text-[#68756F]">알기 쉬운 네 가지만 전해요.</p></div></div>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">{childView.map((item) => <li key={item} className="flex min-h-14 items-center gap-3 rounded-2xl bg-[#F5F7F3] px-5 text-lg font-black"><Check size={21} className="text-[#52725B]" aria-hidden />{item}</li>)}</ul>
          <p className="mt-6 flex items-start gap-3 text-base font-bold leading-7 text-[#68756F]"><EyeOff size={21} className="mt-1 shrink-0" aria-hidden />불필요한 사생활은 가족에게 보이지 않아요.</p>
        </article>
      </section>

      <section className="border-y border-[#DFE7DC] bg-[#F1F5EB] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1fr_1fr]">
          <div><p className="text-lg font-black text-[#52725B]">깜빡한 날도 괜찮아요</p><h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">기록하지 않은 날에는<br />부드럽게 알려드려요.</h2></div>
          <div className="grid gap-5">
            <InfoLine icon={BellRing} title="먼저 부모님께 알려드려요" text="입력을 잊지 않도록 편한 말로 안내해요." />
            <InfoLine icon={ShieldCheck} title="오래 쉬면 가족도 확인해요" text="걱정을 키우지 않고 안부가 필요한 때만 알려요." />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-lg font-black text-[#E9652B]">전화하면 되지 않나요?</p>
        <h2 className="mt-4 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">전화와 오늘안부는<br />서로 다른 장점이 있어요.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <CompareCard icon={PhoneCall} title="전화 안부" items={["서로 시간을 맞춰야 해요.", "그날의 상태를 대화로 확인해요.", "지난 변화를 기억하기 어려워요."]} />
          <CompareCard icon={Clock3} title="오늘안부" highlighted items={["원하는 시간에 20초만 남겨요.", "하루하루의 변화가 차곡차곡 쌓여요.", "가족이 달라진 점을 쉽게 확인해요."]} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 pb-24 text-center sm:px-8 sm:pb-28">
        <div className="rounded-[24px] bg-[#FFF0E4] px-6 py-8">
          <p className="text-xl font-black text-[#D95423]">지금은 기본 기능을 무료로 체험할 수 있어요.</p>
          <p className="mt-3 text-lg font-bold leading-8 text-[#596861]">결제 없이 부모님과 연결하고<br className="sm:hidden" /> 오늘안부를 시작해보세요.</p>
        </div>
        <h2 className="mt-16 text-[2.15rem] font-black leading-[1.35] sm:text-[2.6rem]">생각보다 어렵지 않아요.<br />오늘부터 가볍게 시작해보세요.</h2>
        <Link href="/start" className="mt-8 inline-flex min-h-16 w-full max-w-[480px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-8 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.22)]">부모님과 연결 시작하기 <ArrowRight size={22} aria-hidden /></Link>
      </section>

      <MobileStartCta />
    </main>
  );
}

function Reward({ icon: Icon, title, text }: { icon: typeof Sprout; title: string; text: string }) {
  return <article className="rounded-[22px] bg-white/10 p-6"><Icon size={31} className="text-[#B9E1C0]" aria-hidden /><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-2 font-semibold leading-7 text-white/70">{text}</p></article>;
}

function InfoLine({ icon: Icon, title, text }: { icon: typeof BellRing; title: string; text: string }) {
  return <article className="flex gap-4 rounded-[22px] bg-white p-6"><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={27} aria-hidden /></span><div><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-lg font-semibold leading-8 text-[#596861]">{text}</p></div></article>;
}

function CompareCard({ icon: Icon, title, items, highlighted = false }: { icon: typeof PhoneCall; title: string; items: string[]; highlighted?: boolean }) {
  return <article className={`rounded-[24px] border-2 p-7 ${highlighted ? "border-[#91AC8D] bg-[#EEF5E9]" : "border-[#E0E4DE] bg-white"}`}><Icon size={31} className="text-[#52725B]" aria-hidden /><h3 className="mt-5 text-2xl font-black">{title}</h3><ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex items-start gap-3 text-lg font-semibold leading-8 text-[#52635C]"><Check size={21} className="mt-1 shrink-0 text-[#52725B]" aria-hidden />{item}</li>)}</ul></article>;
}
