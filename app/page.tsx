import Link from "next/link";
import { ArrowRight, Check, Database, Footprints, HeartHandshake, ShieldCheck, Sparkles, Sprout } from "lucide-react";

const signals = [
  { icon: Footprints, label: "오늘도 몸을 움직였어요", value: "평소만큼" },
  { icon: Sparkles, label: "평소처럼 하루를 시작했어요", value: "편안해요" },
  { icon: HeartHandshake, label: "소중한 사람과 연락했어요", value: "연락했어요" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F8F4] text-[#17221B]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-black"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#2F6B46] text-white"><ShieldCheck size={20} /></span>오늘안부</Link>
        <Link href="/app" className="rounded-full border border-[#D9E4D9] bg-white px-5 py-2.5 text-sm font-black">서비스 시작</Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E7F1E6] px-4 py-2 text-sm font-black text-[#396849]"><span className="size-2 rounded-full bg-[#58A36B]" />생활이 안부가 되는 서비스</span>
          <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-[-.045em] sm:text-7xl">기록하지 않아도,<br /><span className="text-[#2F6B46]">오늘은 전해집니다.</span></h1>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-[#657069]">평소처럼 지내세요. 오늘의 생활을 조용히 살펴 가족에게 편안한 안심을 전해드려요.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app?role=family" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#2F6B46] px-6 text-lg font-black text-white shadow-[0_18px_45px_rgba(47,107,70,.22)]">오늘의 안심 보기 <ArrowRight size={19} /></Link>
            <Link href="/app?role=parent" className="inline-flex min-h-14 items-center rounded-2xl border border-[#D9E4D9] bg-white px-6 font-black">부모님 화면 보기</Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#79837C]"><Check size={16} className="text-[#4D8A5D]" />매일 입력할 필요가 없어요</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-12 rounded-full bg-[#DDEBDD] blur-3xl" />
          <div className="relative rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_35px_90px_rgba(43,70,50,.16)] sm:p-8">
            <div className="flex items-center justify-between"><p className="font-black text-[#497055]">오늘도 안심이에요</p><span className="rounded-full bg-[#EAF5EA] px-3 py-1 text-xs font-black text-[#39704A]">편안한 하루</span></div>
            <p className="mt-7 text-2xl font-black leading-9">오늘도 평소처럼<br />지내고 계세요 😊</p>
            <p className="mt-3 text-sm font-bold text-[#778279]">오늘의 안심 92점</p>
            <div className="mt-7 divide-y divide-[#EDF1ED]">
              {signals.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center justify-between py-4"><span className="flex items-center gap-3 font-bold"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#F0F5F0] text-[#3D6F4B]"><Icon size={19} /></span>{label}</span><strong>{value}</strong></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#203C2B] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black text-[#A9D5B1]">오늘안부의 방식</p>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">입력이 아니라 생활을 분석하고,<br />생활 자체를 보상합니다.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Feature icon={<Database />} title="오늘도 자연스럽게 기록돼요" copy="따로 적지 않아도 평소의 하루가 차곡차곡 쌓여요." />
            <Feature icon={<Sparkles />} title="달라진 점만 알려드려요" copy="최근 생활을 AI가 조용히 살펴보고 꼭 필요한 변화만 전해요." />
            <Feature icon={<Sprout />} title="오늘도 농장이 자라요" copy="평소의 하루와 가족 소식이 작물의 햇빛과 물이 돼요." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return <article className="rounded-[28px] bg-white/8 p-6"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#B9E1C0]">{icon}</span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-3 font-semibold leading-7 text-white/65">{copy}</p></article>;
}
