import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Check, Footprints, HeartHandshake, Leaf, PencilLine, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const values = [
  { icon: PencilLine, title: "평소처럼 생활", text: "전화하고 산책하고, 하던 대로 지내세요." },
  { icon: BarChart3, title: "AI 안심 리포트", text: "생활 흐름의 변화를 가족에게 쉽게 전해요." },
  { icon: Leaf, title: "함께 키우는 농장", text: "안부가 쌓일수록 선택한 작물이 자라요." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] pb-24 text-[#20302C]">
      <header className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 rounded-2xl bg-white/95 p-2 pr-4 text-xl font-black text-[#52725B] shadow-sm"><Image src="/brand/brand-icon.png" alt="" width={38} height={38} className="rounded-xl" />오늘안부</Link>
        <Link href="/guide" className="inline-flex min-h-11 items-center rounded-full border border-[#D8E4D3] bg-white/90 px-5 text-sm font-black text-[#40534B]">서비스 소개</Link>
      </header>

      <section className="relative isolate mx-auto min-h-[760px] max-w-[1440px] overflow-hidden bg-[#F3E8D6] lg:min-h-[720px]">
        <Image src="/brand/hero-family.png" alt="오늘안부와 함께 편안한 하루를 보내는 부모님" fill priority className="object-cover object-[58%_center] lg:object-center" sizes="100vw" />
        <div className="absolute inset-y-0 left-0 w-full bg-[#FFF9F0] opacity-90 lg:w-[58%]" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1180px] items-start px-5 pb-28 pt-28 sm:px-8 lg:min-h-[720px] lg:items-center lg:pb-20 lg:pt-24">
          <div className="max-w-[620px]">
            <p className="mb-3 text-sm font-black text-[#52725B]">오늘안부 안내 친구, 안심이가 함께해요.</p>
            <div className="flex flex-wrap gap-2">
              {["별도 앱 설치 없이 시작", "매일 입력하지 않아도 괜찮아요", "AI가 안심을 전해요"].map((text) => <span key={text} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-black text-[#52725B] shadow-sm"><Check size={14} aria-hidden />{text}</span>)}
            </div>
            <h1 className="mt-7 text-[2.45rem] font-black leading-[1.13] sm:text-[4.1rem]">기록하지 않아도,<br /><span className="text-[#52725B]">오늘은 전해집니다.</span></h1>
            <p className="mt-6 max-w-[540px] text-lg font-bold leading-8 text-[#52635C] sm:text-xl">기록하지 않아도 됩니다.<br />평소의 생활 흐름을 살펴<br />가족이 이해하기 쉬운 안심 리포트로 전해요.</p>
            <Link href="/start" className="mt-8 inline-flex min-h-16 w-full max-w-[420px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white shadow-[0_16px_34px_rgba(233,101,43,0.24)]">오늘안부 시작하기<ArrowRight size={21} aria-hidden /></Link>
            <p className="mt-4 text-center text-sm font-bold text-[#68756F] sm:max-w-[420px]">이미 계정이 있으신가요? <Link href="/app" className="text-[#D95423] underline underline-offset-4">로그인</Link></p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8">
        <p className="text-sm font-black text-[#E9652B]">하루를 기록하면, 안심은 쌓이고, 작물은 자랍니다.</p>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">오늘안부는 세 가지를<br />한 번에 이어줍니다.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {values.map(({icon:Icon,title,text}) => <article key={title} className="rounded-[22px] border border-[#E2E8DE] bg-white p-5 shadow-[0_14px_34px_rgba(55,72,55,0.06)]"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#52725B]"><Icon size={25} aria-hidden /></span><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 font-semibold leading-7 text-[#67736D]">{text}</p></article>)}
        </div>
      </section>

      <section className="bg-[#203C2B] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div><p className="text-sm font-black text-[#A9D5B1]">오늘안부의 방식</p><h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">입력이 아니라 생활을 살펴보고,<br />달라진 점만 전합니다.</h2><p className="mt-5 font-semibold leading-8 text-white/70">전화하고 산책하고 평소처럼 생활하세요. 생활의 흐름은 조용히 쌓이고, 가족에게는 필요한 안심만 전해집니다.</p></div>
          <TodayReportPreview />
        </div>
        <div className="mx-auto mt-8 grid w-full max-w-[1180px] gap-3 md:grid-cols-3"><DarkFeature icon={<Footprints />} title="평소의 생활이 쌓여요" text="따로 적지 않아도 일상의 흐름을 살펴요." /><DarkFeature icon={<Sparkles />} title="달라진 점만 알려드려요" text="AI가 꼭 필요한 변화만 쉽게 정리해요." /><DarkFeature icon={<Sprout />} title="농장도 함께 자라요" text="안부와 가족 소식이 작물의 햇빛과 물이 돼요." /></div>
      </section>

      <section id="story" className="border-y border-[#E1E9DD] bg-[#F1F5EB]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
          <p className="text-sm font-black text-[#52725B]">3분이면 이해됩니다</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">왜 오늘안부가 필요할까요?</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <StoryPanel number="1" image="/brand/hero-family.png" title="부모님은 평소처럼 지냅니다" text="설치나 복잡한 입력 없이, 평소 생활을 이어가세요." />
            <StoryPanel number="2" image="/brand/family-report.png" title="가족은 변화를 쉽게 봅니다" text="생활 흐름을 AI 안심 리포트로 확인합니다." />
            <StoryPanel number="3" image="/brand/farm-mascot.png" title="안심이와 작물을 키웁니다" text="안심이가 농장 소식을 전하고, 수확 이벤트의 즐거움도 알려드려요." />
          </div>
          <div className="mt-9 text-center"><p className="text-xl font-black">이제 시작해볼까요?</p><p className="mt-2 font-bold text-[#68756F]">생활만 하시면 됩니다.</p><Link href="/start" className="mt-5 inline-flex min-h-16 w-full max-w-[420px] items-center justify-center gap-2 rounded-2xl bg-[#E9652B] px-7 text-xl font-black text-white">오늘안부 시작하기<ArrowRight size={21} aria-hidden /></Link></div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[900px] px-5 py-16 text-center sm:px-8"><ShieldCheck size={38} className="mx-auto text-[#52725B]" aria-hidden /><h2 className="mt-5 text-3xl font-black">앱 설치 없이,<br />오늘부터 편하게 시작하세요.</h2><p className="mt-4 font-semibold leading-8 text-[#68756F]">부모님은 평소처럼 생활하고<br />가족은 필요한 안심만 확인합니다.</p><Link href="/guide" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl border border-[#A9BEA6] bg-white px-6 font-black text-[#40534B]">연결 방법 보기<Sparkles size={18} aria-hidden /></Link></section>
      <BottomTabBar active="home" />
    </main>
  );
}

function StoryPanel({number,image,title,text}:{number:string;image:string;title:string;text:string}) { return <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_44px_rgba(55,72,55,0.08)]"><div className="relative aspect-[4/3]"><Image src={image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 33vw" /></div><div className="p-5"><span className="text-sm font-black text-[#E9652B]">이야기 {number}</span><h3 className="mt-2 text-xl font-black">{title}</h3><p className="mt-2 font-semibold leading-7 text-[#68756F]">{text}</p></div></article>; }

function TodayReportPreview(){ const signals=[[Footprints,"오늘도 몸을 움직였어요","평소만큼"],[Sparkles,"평소처럼 하루를 시작했어요","편안해요"],[HeartHandshake,"소중한 사람과 연락했어요","연락했어요"]] as const; return <article className="rounded-[26px] bg-white p-5 text-[#20302C] shadow-[0_24px_65px_rgba(0,0,0,.16)]"><div className="flex items-center justify-between gap-3"><p className="font-black text-[#52725B]">오늘도 안심이에요</p><span className="rounded-full bg-[#EDF5ED] px-3 py-1 text-xs font-black text-[#39704A]">편안한 하루</span></div><p className="mt-5 text-2xl font-black leading-9">오늘도 평소처럼<br />지내고 계세요 😊</p><p className="mt-2 text-sm font-bold text-[#778279]">오늘의 안심 92점</p><div className="mt-4 divide-y divide-[#EDF1ED]">{signals.map(([Icon,label,value])=><div key={label} className="flex items-center justify-between gap-3 py-3"><span className="flex items-center gap-2 text-sm font-bold"><span className="flex size-9 items-center justify-center rounded-xl bg-[#F0F5F0] text-[#3D6F4B]"><Icon size={17} aria-hidden /></span>{label}</span><strong className="shrink-0 text-sm">{value}</strong></div>)}</div></article> }
function DarkFeature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <article className="rounded-[22px] bg-white/10 p-5"><span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-[#B9E1C0]">{icon}</span><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 font-semibold leading-7 text-white/65">{text}</p></article>}
