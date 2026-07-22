import Link from "next/link";
import { ArrowRight, Check, CircleDot, Footprints, HelpCircle, Layers3, MessageCircle, Phone, Radar, ShieldCheck, TrendingUp, UserRound } from "lucide-react";
import { PRODUCT_COPY } from "@/lib/product-copy";
import { ParentFirstLanding } from "@/components/parent-first-landing";

const supportStatus = [
  ["질문 응답", "현재 지원", "bg-[#E3F3E7] text-[#24613A]"],
  ["응답 시간대", "현재 지원", "bg-[#E3F3E7] text-[#24613A]"],
  ["걸음과 움직임", "준비 중", "bg-[#EEF1F0] text-[#58645E]"],
  ["생활 시간대", "테스트 중", "bg-[#FFF0D5] text-[#87571B]"],
  ["통화 활동", "준비 중", "bg-[#EEF1F0] text-[#58645E]"],
  ["수면", "지원 예정", "bg-[#EEF1F0] text-[#58645E]"],
] as const;

const engineSteps = [
  ["평소 생활 학습", "부모님만의 생활 기준을 알아갑니다.", UserRound],
  ["변화 추이 비교", "평소 흐름과 최근 흐름을 비교합니다.", TrendingUp],
  ["반복 변화 확인", "하루보다 이어지는 변화를 봅니다.", Layers3],
  ["질문 하나", "필요한 날에만 짧게 묻습니다.", HelpCircle],
  ["정보 함께 보기", "생활 변화와 답변을 함께 봅니다.", CircleDot],
  ["가족 행동 추천", "지금 필요한 행동 하나를 제안합니다.", Phone],
] as const;

const enginePrinciples = [
  "하루의 변화만 보지 않습니다.",
  "한 번의 미응답만으로 알리지 않습니다.",
  "반복되는 생활 변화를 함께 봅니다.",
  "부모님의 평소 생활과 비교합니다.",
  "생활 변화와 질문 응답을 함께 봅니다.",
] as const;

export default function LandingPage() { return <ParentFirstLanding />; }

function LandingPageLegacy() {
  return (
    <main className="senior-landing">
      <header className="senior-header">
        <div className="senior-header-inner">
          <Link href="/" className="senior-brand" aria-label="오늘안부 처음 화면">
            <img src="/brand/brand-icon.png?v=6" alt="" width="52" height="52" />
            <span>오늘안부</span>
          </Link>
          <Link href="/plans" className="senior-guide-link">이용 안내</Link>
        </div>
      </header>

      <section className="senior-hero">
        <div className="senior-hero-copy">
          <p className="senior-kicker"><Radar aria-hidden="true" /> {PRODUCT_COPY.radarName}</p>
          <h1>{PRODUCT_COPY.corePromise.split(", ").map((line, index) => <span key={line}>{index ? <br /> : null}{line}</span>)}</h1>
          <p className="senior-summary">부모님은 평소처럼 생활하세요.<br />확인이 필요한 날에만 질문 하나를 드립니다.<br />가족은 달라진 날만 확인하면 됩니다.</p>
          <div className="senior-actions" aria-label="사용자 선택">
            <Link href="/onboarding?role=family" className="senior-button senior-button-primary">부모님과 시작하기 <ArrowRight aria-hidden="true" /></Link>
            <Link href="/start" className="senior-button senior-button-secondary">먼저 체험해보기</Link>
          </div>
          <p className="senior-demo-note">지금은 체험용 화면입니다.</p>
        </div>
        <div className="senior-hero-image">
          <img src="/illustrations/todayanbu-hero.png?v=6" alt="평소 생활을 이어가는 부모님과 안부를 확인하는 가족" width="760" height="680" />
        </div>
      </section>

      <section className="bg-[#EAF3E5] px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="senior-section-label">{PRODUCT_COPY.radarName}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">하루가 아니라,<br />생활 흐름을 봅니다.</h2>
            <div className="readable-sentences mt-5 text-xl font-bold leading-9 text-[#52635C]"><p>부모님의 평소 생활을 알아갑니다.</p><p>다른 흐름이 이어지는지 살펴봅니다.</p><p>가족이 먼저 확인할 이유를 알려드립니다.</p></div>
          </div>
          <div className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(49,78,58,.10)] sm:p-8">
            <div className="flex items-center gap-4"><span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#EAF3E5] text-[#2F6B46]"><Radar size={34} /></span><div><p className="font-black text-[#2F6B46]">최근 생활 흐름</p><h3 className="mt-1 text-2xl font-black">평소와 조금 다른 흐름이 이어져요.</h3></div></div>
            <div className="mt-7 flex h-28 items-end gap-3" aria-label="최근 생활 흐름 예시">{[62,64,61,60,49,47,45].map((height,index)=><span key={index} className={`flex-1 rounded-t-xl ${index > 3 ? "bg-[#E9652B]" : "bg-[#78A76E]"}`} style={{height:`${height}%`}} />)}</div>
            <p className="mt-5 text-lg font-black text-[#40534B]">오늘 짧게 전화해보세요.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="senior-section-label">{PRODUCT_COPY.engineName}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">오늘안부는 어떻게 판단할까요?</h2>
          <div className="readable-sentences mt-5 max-w-[800px] text-xl font-bold leading-9 text-[#56675E]"><p>부모님의 평소 생활을 먼저 알아갑니다.</p><p>작은 변화가 여러 날 이어지는지 봅니다.</p><p>질문과 생활 변화를 함께 확인합니다.</p><p>가족에게 행동 하나를 알려드립니다.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{engineSteps.map(([title,text,Icon],index)=><article key={title} className="rounded-[24px] border-2 border-[#DCE6D9] bg-[#FAFCF9] p-6"><div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-full bg-[#2F6B46] text-lg font-black text-white">{index+1}</span><Icon className="text-[#52725B]" /></div><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-lg font-bold leading-8 text-[#586960]">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#173F35] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="font-black text-[#B9E1C0]">판단 원칙</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">다른 사람의 평균과<br />비교하지 않습니다.</h2>
          <p className="mt-5 max-w-[760px] text-xl font-bold leading-9 text-white/75">{PRODUCT_COPY.engineDescription}</p>
          <div className="mt-9 grid gap-3 md:grid-cols-2">{enginePrinciples.map((item)=><div key={item} className="flex items-center gap-3 rounded-[20px] bg-white/10 p-5 text-lg font-black"><Check className="shrink-0 text-[#B9E1C0]" />{item}</div>)}</div>
        </div>
      </section>

      <section className="bg-[#FFF5E8] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="senior-section-label">왜 Engine이 필요할까요?</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">가족을 대신하지 않습니다.</h2>
          <div className="readable-sentences mt-5 text-xl font-bold leading-9 text-[#56675E]"><p>긴 생활 흐름을 대신 기억합니다.</p><p>먼저 확인하면 좋은 날을 알려드립니다.</p><p>가족이 놓치지 않도록 돕습니다.</p></div>
          <div className="mt-9 overflow-hidden rounded-[26px] border border-[#E5D9C8] bg-white">{[["최근 생활 기억하기","흐름으로 정리"],["부모님의 평소와 비교하기","개인 기준으로 비교"],["반복되는 변화 확인하기","여러 날을 함께 확인"],["질문할 시점 정하기","필요한 날에만 질문"],["지금 할 일 정하기","행동 하나를 제안"]].map(([family,engine])=><div key={family} className="grid gap-2 border-b border-[#EAE5DC] p-5 last:border-0 sm:grid-cols-2 sm:items-center"><span className="font-bold text-[#6A746F]">가족이 매일 하기 어려운 일 · {family}</span><strong className="text-lg text-[#2F6B46]">오늘안부 · {engine}</strong></div>)}</div>
        </div>
      </section>

      <section className="border-y border-[#DFE5DC] bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px] text-left">
          <p className="senior-section-label">왜 필요한가요?</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">매일 전화하기는 어렵고,<br />매일 상태를 보고하는 것도 부담스럽습니다.</h2>
          <p className="mt-5 max-w-[760px] text-xl font-bold leading-9 text-[#56675E]">괜찮은 날에는 서로 안심하고, 평소와 다른 날에는 먼저 행동할 수 있어야 합니다.</p>
        </div>
      </section>

      <section className="senior-how" aria-labelledby="how-title">
        <p className="senior-section-label">이렇게 이용해요</p>
        <h2 id="how-title">달라진 날에만 함께합니다</h2>
        <div className="senior-steps">
          <article><span className="senior-step-number">1</span><h3>조용히 확인</h3><p>동의한 생활 흐름을 살펴봅니다.</p></article>
          <article><span className="senior-step-number">2</span><h3>질문 하나</h3><p>필요한 날에만 짧게 여쭤봅니다.</p></article>
          <article><span className="senior-step-number">3</span><h3>행동 연결</h3><p>달라진 날에는 할 일 하나를 알려드립니다.</p></article>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="senior-section-label">실제 작동 예시</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">평소와 다른 날을 이렇게 확인합니다</h2>
          <p className="mt-4 font-bold text-[#68756E]">체험용 예시 · 의료적 판단이 아닌 생활 변화 안내입니다.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            <FlowCard number="1" icon={<Footprints />} label="자동 확인" text={<>최근 3일간 움직임이<br />평소보다 줄었어요.</>} />
            <FlowCard number="2" icon={<ShieldCheck />} label="변화 감지" text={<>개인의 평소 범위와<br />차이가 이어졌어요.</>} />
            <FlowCard number="3" icon={<HelpCircle />} label="질문 하나" text={<>몸이 조금<br />불편하신가요?</>} />
            <FlowCard number="4" icon={<MessageCircle />} label="부모 답변" text={<>조금<br />피곤해요.</>} />
            <FlowCard number="5" icon={<Phone />} label="가족 행동" text={<>오늘 짧게<br />전화해보세요.</>} action />
          </div>
        </div>
      </section>

      <section className="bg-[#F2F7EF] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="senior-section-label">하루 한 질문</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">부모님께 매일 묻지 않습니다</h2>
          <p className="mt-5 max-w-[760px] text-xl font-bold leading-9 text-[#56675E]">현재 지원하는 질문 응답과 응답 시간대를 바탕으로 평소 흐름을 알아갑니다. 확인이 필요한 날에만 질문 하나를 드리며, 질문은 건너뛰어도 괜찮습니다.</p>
          <div className="mt-9 grid gap-4 md:grid-cols-3">{[["1","자동 확인","동의한 생활 흐름을 조용히 살펴봅니다."],["2","질문 하나","확인이 필요한 날에만 짧게 묻습니다."],["3","변화 해석","단일 답보다 반복되는 변화를 함께 봅니다."]].map(([number,title,text]) => <article key={number} className="rounded-[26px] border-2 border-[#DCE6D9] bg-white p-6"><span className="flex size-12 items-center justify-center rounded-full bg-[#2F6B46] text-xl font-black text-white">{number}</span><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-lg font-bold leading-8 text-[#586960]">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#FFF5E8] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1040px]">
          <p className="senior-section-label">실제 지원 범위</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">현재 확인할 수 있는 정보</h2>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E4DED3] bg-white">{supportStatus.map(([name,status,tone]) => <div key={name} className="flex min-h-[72px] items-center justify-between gap-4 border-b border-[#E8ECE5] px-5 last:border-0 sm:px-7"><strong className="text-lg">{name}</strong><span className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${tone}`}>{status}</span></div>)}</div>
          <div className="mt-6 rounded-[22px] bg-[#EAF3E5] p-5 text-lg font-black leading-8 text-[#315B3D]">통화 내용, 문자 내용, 사진 내용은 확인하지 않습니다.</div>
        </div>
      </section>

      <section className="senior-trust">
        <div>
          <h2>많이 묻지 않고, 불안하게 만들지 않습니다.</h2>
          <ul>
            <li><Check aria-hidden="true" /> 단일 답변보다 반복되는 변화 확인</li>
            <li><Check aria-hidden="true" /> 통화·문자 내용은 확인하지 않음</li>
            <li><Check aria-hidden="true" /> 변화가 없으면 행동을 요구하지 않음</li>
          </ul>
        </div>
        <Link href="/app?role=parent" className="senior-button senior-button-light">체험 시작하기</Link>
      </section>
      <section className="mx-auto mb-16 w-[calc(100%-40px)] max-w-[1040px] rounded-[28px] bg-white p-7 sm:p-10"><p className="font-black text-[#2F6B46]">{PRODUCT_COPY.engineName}</p><h2 className="mt-3 text-3xl font-black">가족이 조금 더 일찍<br />확인하고 행동하도록 돕습니다.</h2><div className="readable-sentences mt-4 text-lg font-bold leading-8 text-[#56675E]"><p>하루의 작은 변화마다 알리지 않습니다.</p><p>부모님 본인의 평소 생활과 비교합니다.</p><p>생활 변화의 추이를 가족에게 설명합니다.</p></div></section>
      <footer className="senior-footer">오늘안부는 생활 변화를 살펴보는 {PRODUCT_COPY.engineName}입니다.</footer>
    </main>
  );
}

function FlowCard({ number, icon, label, text, action = false }: { number: string; icon: React.ReactNode; label: string; text: React.ReactNode; action?: boolean }) {
  return <article className={`rounded-[24px] border-2 p-5 ${action ? "border-[#D95C24] bg-[#FFF3E9]" : "border-[#DCE6D9] bg-[#FAFCF9]"}`}><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-full bg-[#2F6B46] font-black text-white">{number}</span><span className="text-[#2F6B46]">{icon}</span></div><p className="mt-5 text-sm font-black text-[#52705A]">{label}</p><h3 className="mt-2 text-xl font-black leading-8">{text}</h3>{action ? <span className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#D95C24] font-black text-white">전화하기</span> : null}</article>;
}
