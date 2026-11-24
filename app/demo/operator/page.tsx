import Link from 'next/link';
import { CareBrandLogo } from '@/components/care-brand-logo';

export default function DemoOperator() {
  return <main className="danyeon-site min-h-screen">
    <header className="danyeon-wrap danyeon-header"><CareBrandLogo /><Link href="/demo">체험 선택</Link></header>
    <section className="danyeon-wrap danyeon-section">
      <p className="danyeon-kicker">합성 데이터 · 화면 예시</p>
      <h1>서비스 운영관리자 체험</h1>
      <div className="danyeon-product-grid">
        <article className="danyeon-product"><h2>병원 목록</h2><p>시연용 정형외과 A · 파일럿 검토 중</p></article>
        <article className="danyeon-product"><h2>도입 문의</h2><p>시연용 정형외과 B · 제품 시연 요청</p></article>
        <article className="danyeon-product"><h2>운영 및 감사</h2><p>등록된 병원, 상담 이력과 접근 거절 기록을 확인합니다.</p></article>
      </div>
    </section>
  </main>;
}
