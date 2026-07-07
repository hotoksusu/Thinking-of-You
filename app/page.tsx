import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Footprints,
  Heart,
  Leaf,
  MessageCircleHeart,
  PhoneCall,
  Sun,
} from "lucide-react";
import { MarketingHeader, MobileStartCta } from "@/components/marketing-navigation";

const lifeSignals = [
  { icon: Footprints, label: "걸음", value: "평소처럼 움직였어요" },
  { icon: Sun, label: "생활 리듬", value: "규칙적으로 이어지고 있어요" },
  { icon: PhoneCall, label: "통화 활동", value: "가족과 소식을 나눴어요" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF9F0] pb-24 text-[#20302C]">
      <MarketingHeader />

      <ExperienceSection className="bg-[#FFF9F0]" first>
        <div className="experience-copy">
          <p className="eyebrow">오늘의 안심</p>
          <h1 className="experience-title">오늘도 평소처럼<br />지내세요.</h1>
          <p className="experience-description">생활은 자연스럽게 기록되고,<br />가족은 안심만 확인합니다.</p>
          <Link id="landing-primary-cta" href="/start" className="primary-cta">
            오늘안부 시작하기 <ArrowRight size={24} aria-hidden />
          </Link>
        </div>
        <TodayPreview />
      </ExperienceSection>

      <ExperienceSection className="border-y border-[#DCE7DA] bg-[#EFF5EA]" reverse>
        <div className="experience-copy">
          <p className="eyebrow text-[#52725B]">따로 적지 않아도 괜찮아요</p>
          <h2 className="experience-title">복잡하게 기록하지<br />않아도 됩니다.</h2>
          <p className="experience-description">동의한 생활 흐름만<br />조용히 살펴봅니다.</p>
        </div>
        <LifePreview />
      </ExperienceSection>

      <ExperienceSection className="bg-[#FFF4E5]">
        <div className="experience-copy">
          <p className="eyebrow">나의 안심농장</p>
          <h2 className="experience-title">생활이 쌓이면<br />계절의 수확이 찾아옵니다.</h2>
          <p className="experience-description">매일의 생활이 작물을 키우고,<br />계절의 즐거움으로 이어집니다.</p>
        </div>
        <FarmPreview />
      </ExperienceSection>

      <ExperienceSection className="border-y border-[#E7E2D9] bg-[#F7F1EB]" reverse>
        <div className="experience-copy">
          <p className="eyebrow text-[#B35C45]">오늘 도착한 가족 소식</p>
          <h2 className="experience-title">가족의 작은 소식이<br />하루의 기쁨이 됩니다.</h2>
          <p className="experience-description">사진 한 장과 짧은 안부를<br />부담 없이 함께 나눠요.</p>
        </div>
        <FamilyNewsPreview />
      </ExperienceSection>

      <section className="flex min-h-[92svh] items-center bg-[#294636] px-5 py-20 text-center text-white sm:px-8">
        <div className="mx-auto w-full max-w-[760px]">
          <span className="mx-auto flex size-20 items-center justify-center rounded-[24px] bg-white/10 text-[#CDE4C4]">
            <Heart size={42} fill="currentColor" aria-hidden />
          </span>
          <h2 className="mt-8 text-[2.55rem] font-black leading-[1.25] sm:text-[4rem]">
            오늘부터<br />평소처럼 생활하세요.
          </h2>
          <p className="mx-auto mt-6 max-w-[620px] text-xl font-bold leading-9 text-white/80 sm:text-2xl sm:leading-10">
            오늘안부가 생활을 살펴보고<br />가족은 편안하게 안심합니다.
          </p>
          <div className="mx-auto mt-10 grid max-w-[520px] gap-4">
            <Link href="/start" className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#F06A2C] px-8 text-xl font-black text-white shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
              오늘안부 시작하기 <ArrowRight size={23} aria-hidden />
            </Link>
            <Link href="/onboarding/add-parent" className="inline-flex min-h-16 items-center justify-center rounded-2xl border-2 border-white/65 bg-white/10 px-8 text-xl font-black text-white">
              부모님 연결하기
            </Link>
          </div>
        </div>
      </section>

      <MobileStartCta />
    </main>
  );
}

function ExperienceSection({ children, className, reverse = false, first = false }: { children: React.ReactNode; className: string; reverse?: boolean; first?: boolean }) {
  return (
    <section className={`flex min-h-[92svh] snap-start items-center px-5 py-12 sm:px-8 sm:py-16 ${className}`}>
      <div className={`mx-auto grid w-full max-w-[1180px] items-center gap-8 max-lg:[&>*:first-child]:order-2 lg:grid-cols-2 lg:gap-20 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {children}
      </div>
      {first ? <span className="sr-only">오늘안부 서비스 미리보기</span> : null}
    </section>
  );
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[30px] border-[6px] border-[#25352F] bg-white p-2.5 shadow-[0_28px_70px_rgba(42,55,48,0.16)] sm:max-w-[410px]" aria-label={label}>
      <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-[#D6DCD8]" aria-hidden />
      <div className="min-h-[450px] overflow-hidden rounded-[20px] bg-[#FFFDF8] sm:min-h-[540px]">{children}</div>
    </div>
  );
}

function TodayPreview() {
  return (
    <PhoneFrame label="오늘의 안심 화면 미리보기">
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div><p className="text-base font-black text-[#52725B]">7월 7일 화요일</p><p className="mt-1 text-lg font-black">좋은 아침이에요</p></div>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF5E9] text-[#52725B]"><Leaf size={25} aria-hidden /></span>
        </div>
        <div className="mt-5 rounded-[20px] bg-[#EAF3E5] p-5 sm:mt-7 sm:p-6">
          <div className="flex items-center gap-3 text-[#52725B]"><Check size={25} strokeWidth={3} aria-hidden /><span className="text-lg font-black">오늘의 안심</span></div>
          <p className="mt-4 text-[1.55rem] font-black leading-[1.35] sm:mt-5 sm:text-[1.75rem]">오늘도 평소처럼<br />생활하고 계세요.</p>
          <p className="mt-3 text-base font-bold leading-7 text-[#5B6B63]">생활이 자연스럽게 기록되고 있어요.</p>
        </div>
        <div className="mt-4 rounded-[20px] border border-[#E5E8E1] bg-white p-4 sm:mt-5 sm:p-5">
          <div className="flex items-center justify-between"><p className="text-lg font-black">최근 생활 변화</p><span className="text-sm font-black text-[#52725B]">편안해요</span></div>
          <div className="mt-4 flex h-14 items-end gap-2 sm:mt-5 sm:h-20" aria-hidden>{[48, 56, 52, 66, 62, 72, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-lg bg-[#93B48C]" style={{ height: `${height}%` }} />)}</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function LifePreview() {
  return (
    <PhoneFrame label="생활 흐름 화면 미리보기">
      <div className="p-5 sm:p-7">
        <p className="text-base font-black text-[#52725B]">오늘의 생활</p>
        <h3 className="mt-2 text-[1.55rem] font-black leading-[1.35] sm:mt-3 sm:text-[1.8rem]">오늘도 생활이<br />자연스럽게 기록되고 있어요.</h3>
        <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4">
          {lifeSignals.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-h-[74px] items-center gap-3 rounded-[18px] border border-[#DCE5D9] bg-white p-3 sm:min-h-[92px] sm:gap-4 sm:p-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B] sm:size-14"><Icon size={27} aria-hidden /></span>
              <div><p className="text-lg font-black">{label}</p><p className="mt-1 text-base font-bold text-[#617069]">{value}</p></div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-sm font-bold leading-6 text-[#617069] sm:mt-7 sm:text-base sm:leading-7">동의한 내용만 살펴봐요.<br />통화 내용이나 위치는 보지 않아요.</p>
      </div>
    </PhoneFrame>
  );
}

function FarmPreview() {
  return (
    <PhoneFrame label="안심농장 화면 미리보기">
      <div className="relative min-h-[450px] bg-[#F4EEDC] sm:min-h-[540px]">
        <div className="p-5 sm:p-7"><p className="text-base font-black text-[#52725B]">나의 안심농장</p><h3 className="mt-2 text-[1.55rem] font-black sm:text-[1.8rem]">방울토마토가<br />잘 자라고 있어요.</h3></div>
        <div className="relative mx-4 h-[230px] overflow-hidden rounded-[20px] bg-[#FFF8E9] sm:mx-5 sm:h-[290px]">
          <Image src="/brand/farm-mascot.png" alt="수확한 채소를 안고 있는 안심이" fill className="object-cover object-center" sizes="400px" />
        </div>
        <div className="mx-4 mt-4 rounded-[18px] bg-white p-4 sm:mx-5 sm:mt-5 sm:p-5">
          <div className="flex items-center justify-between text-lg font-black"><span>성장 중</span><span className="text-[#52725B]">72%</span></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E5E9DF]"><div className="h-full w-[72%] rounded-full bg-[#75A46E]" /></div>
          <p className="mt-3 text-base font-bold text-[#617069]">수확까지 8일 남았어요.</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function FamilyNewsPreview() {
  return (
    <PhoneFrame label="가족 소식 화면 미리보기">
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#C65C3C]"><MessageCircleHeart size={25} aria-hidden /></span><div><p className="text-base font-black text-[#B35C45]">오늘 도착한 가족 소식</p><p className="text-sm font-bold text-[#6A756F]">딸이 사진을 보냈어요</p></div></div>
        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[20px] sm:mt-6 sm:aspect-[4/3]">
          <Image src="/brand/hero-family.png" alt="가족이 함께 보낸 따뜻한 사진" fill className="object-cover" sizes="400px" />
        </div>
        <div className="mt-4 rounded-[18px] bg-[#FFF3EC] p-4 sm:mt-5 sm:p-5">
          <p className="text-lg font-black leading-8 sm:text-xl">엄마, 오늘 저녁에는<br />다 같이 산책했어요.</p>
          <p className="mt-3 text-base font-bold text-[#7B6258]">사진만 편하게 보셔도 괜찮아요.</p>
        </div>
        <button type="button" className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#E9652B] text-lg font-black text-white sm:mt-5 sm:min-h-16 sm:text-xl">
          잘 봤어요 <Heart size={22} aria-hidden />
        </button>
      </div>
    </PhoneFrame>
  );
}
