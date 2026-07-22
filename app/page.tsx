import Link from "next/link";
import { ArrowRight, Check, Footprints, HelpCircle, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const supportStatus = [
  ["질문 응답", "현재 지원", "bg-[#E3F3E7] text-[#24613A]"],
  ["응답 시간대", "현재 지원", "bg-[#E3F3E7] text-[#24613A]"],
  ["걸음과 움직임", "준비 중", "bg-[#EEF1F0] text-[#58645E]"],
  ["생활 시간대", "테스트 중", "bg-[#FFF0D5] text-[#87571B]"],
  ["통화 활동", "준비 중", "bg-[#EEF1F0] text-[#58645E]"],
  ["수면", "지원 예정", "bg-[#EEF1F0] text-[#58645E]"],
] as const;

export default function LandingPage() {
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
          <p className="senior-kicker"><ShieldCheck aria-hidden="true" /> 생활 변화 안심 서비스</p>
          <h1>매일 묻지 않아도,<br />평소와 다른 날을 알려드립니다.</h1>
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
      <section className="mx-auto mb-16 w-[calc(100%-40px)] max-w-[1040px] rounded-[28px] bg-white p-7 sm:p-10"><h2 className="text-3xl font-black">하루의 작은 변화마다 알리지 않습니다.</h2><p className="mt-4 text-lg font-bold leading-8 text-[#56675E]">평소와 다른 흐름이 이어지거나 확인이 필요할 때만 안내합니다. 단일 미응답이나 한 번의 부정 응답만으로 위험하게 표현하지 않습니다.</p></section>
      <footer className="senior-footer">오늘안부는 의료 진단 서비스가 아닙니다.</footer>
    </main>
  );
}

function FlowCard({ number, icon, label, text, action = false }: { number: string; icon: React.ReactNode; label: string; text: React.ReactNode; action?: boolean }) {
  return <article className={`rounded-[24px] border-2 p-5 ${action ? "border-[#D95C24] bg-[#FFF3E9]" : "border-[#DCE6D9] bg-[#FAFCF9]"}`}><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-full bg-[#2F6B46] font-black text-white">{number}</span><span className="text-[#2F6B46]">{icon}</span></div><p className="mt-5 text-sm font-black text-[#52705A]">{label}</p><h3 className="mt-2 text-xl font-black leading-8">{text}</h3>{action ? <span className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-[#D95C24] font-black text-white">전화하기</span> : null}</article>;
}
