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
          <p className="senior-kicker"><ShieldCheck aria-hidden="true" /> 가족 안심 서비스</p>
          <h1>부모님의 오늘을 가볍게 확인하세요</h1>
          <p className="senior-summary">매일 전화하지 않아도 필요한 순간을 알려드려요.</p>
          <div className="senior-actions" aria-label="사용자 선택">
            <Link href="/app?role=parent" className="senior-button senior-button-primary">부모님으로 시작 <ArrowRight aria-hidden="true" /></Link>
            <Link href="/app?role=family" className="senior-button senior-button-secondary">가족으로 시작</Link>
          </div>
          <p className="senior-demo-note">지금은 체험용 화면입니다.</p>
        </div>
        <div className="senior-hero-image">
          <img src="/illustrations/todayanbu-hero.png?v=6" alt="밝은 방에서 오늘의 안부를 기록하는 캐릭터" width="760" height="680" />
        </div>
      </section>

      <section className="senior-how" aria-labelledby="how-title">
        <p className="senior-section-label">이렇게 이용해요</p>
        <h2 id="how-title">세 가지만 기억하세요</h2>
        <div className="senior-steps">
          <article><span className="senior-step-number">1</span><h3>오늘 상태 선택</h3><p>기분과 생활을 간단히 눌러요.</p></article>
          <article><span className="senior-step-number">2</span><h3>변화 확인</h3><p>평소와 다른 날만 알려드려요.</p></article>
          <article><span className="senior-step-number">3</span><h3>가족과 연결</h3><p>필요할 때 가족이 확인해요.</p></article>
        </div>
      </section>

      <section className="senior-trust">
        <div>
          <h2>복잡한 설정 없이 바로 시작할 수 있어요.</h2>
          <ul>
            <li><Check aria-hidden="true" /> 큰 글씨와 큰 버튼</li>
            <li><Check aria-hidden="true" /> 필요한 내용만 표시</li>
            <li><Check aria-hidden="true" /> 가족과 간편하게 연결</li>
          </ul>
        </div>
        <Link href="/app?role=parent" className="senior-button senior-button-light">체험 시작하기</Link>
      </section>
      <footer className="senior-footer">오늘안부는 의료 진단 서비스가 아닙니다.</footer>
    </main>
  );
}
