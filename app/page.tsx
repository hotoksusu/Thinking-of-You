import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

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
          <p className="senior-summary">부모님은 평소처럼 생활하세요.<br />가족은 달라진 날만 확인하면 됩니다.</p>
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

      <section className="senior-how" aria-labelledby="how-title">
        <p className="senior-section-label">이렇게 이용해요</p>
        <h2 id="how-title">달라진 날에만 함께합니다</h2>
        <div className="senior-steps">
          <article><span className="senior-step-number">1</span><h3>조용히 확인</h3><p>동의한 생활 흐름을 살펴봅니다.</p></article>
          <article><span className="senior-step-number">2</span><h3>질문 하나</h3><p>필요한 날에만 짧게 여쭤봅니다.</p></article>
          <article><span className="senior-step-number">3</span><h3>행동 연결</h3><p>달라진 날에는 할 일 하나를 알려드립니다.</p></article>
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
      <footer className="senior-footer">오늘안부는 의료 진단 서비스가 아닙니다.</footer>
    </main>
  );
}
