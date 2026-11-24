import Link from 'next/link';
import { ArrowRight, Building2, CalendarClock, Check, ClipboardList, Clock3, FileBarChart2, ShieldCheck, Smartphone } from 'lucide-react';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { PatientEntryRedirect } from '@/components/patient-entry-redirect';
import { careBrand, careDemo, careProducts } from '@/lib/care-brand';

const workflow = ['퇴원환자 등록', '환자 링크 안내', '회복 체크인', '응답 확인', '조치와 후속 일정', '관리 종료'];
const faqs = [
  ['환자가 앱을 설치해야 하나요?', '병원에서 받은 전용 링크를 브라우저에서 열고 안내된 확인 절차를 거치면 됩니다.'],
  ['어느 진료과부터 사용할 수 있나요?', '초기 검증 대상은 인공관절·척추·골절 등 정형외과 수술 후 퇴원환자 관리입니다. 대상과 관리기간은 병원과 협의합니다.'],
  ['기존 EMR과 연동해야 하나요?', '파일럿에서는 담당자가 환자를 등록하고 브라우저에서 회복관리 업무를 처리합니다. EMR 연동은 초기 범위에 포함되지 않습니다.'],
  ['환자 기록은 언제 확인하나요?', '병원이 안내한 확인 시간과 절차에 따릅니다. 긴급한 증상은 의료기관 또는 119에 연락해야 합니다.'],
];

export function DanyeonLanding() {
  return <main className="danyeon-site">
    <PatientEntryRedirect redirectSession={false} />
    <header className="danyeon-wrap danyeon-header">
      <CareBrandLogo />
      <nav aria-label="주요 메뉴"><a href="#products">제품 기능</a><a href="#how-it-works">도입 방식</a><a href="#faq">자주 묻는 질문</a></nav>
      <Link className="danyeon-staff" href="/care/server">병원 로그인 <ArrowRight size={16} aria-hidden /></Link>
    </header>
    <div className="danyeon-hero">
      <div className="danyeon-wrap danyeon-hero-grid">
        <div>
          <p className="danyeon-kicker">의료기관을 위한 회복관리 솔루션</p>
          <h1>{careBrand.slogan}</h1>
          <p className="danyeon-hero-subtitle">{careBrand.subtitle}</p>
          <p className="danyeon-hero-copy">환자의 회복 기록부터 의료진의 확인과 후속 조치까지. 복잡한 사후관리 업무를 한 곳에서 관리하세요.</p>
          <div className="danyeon-actions">
            <Link className="danyeon-button danyeon-button-primary" href={careBrand.contact.inquiry}>병원 도입 문의 <ArrowRight size={18} aria-hidden /></Link>
            {careDemo.available
              ? <Link className="danyeon-button danyeon-button-outline" href={careDemo.entry}>서비스 체험하기</Link>
              : <a className="danyeon-button danyeon-button-outline" href="#demo">서비스 체험하기</a>}
          </div>
          <Link className="danyeon-patient-link" href="/patient">병원에서 안내받으셨나요? <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <ProductPreview />
      </div>
    </div>
    <section className="danyeon-wrap danyeon-section danyeon-split">
      <div><p className="danyeon-kicker">정형외과 수술·퇴원환자 관리</p><h2>퇴원 이후, 다음 진료 전까지<br className="hidden sm:block" /> 생기는 관리 공백</h2></div>
      <div><p>환자는 집에서 통증과 움직임의 변화를 겪고, 병원은 전화와 메모를 오가며 이전 응답과 후속 일정을 확인합니다.</p>
        <p className="mt-4">환자가 직접 상태를 기록하면 담당자는 오늘 확인할 응답, 미응답 환자, 남은 후속 업무를 한 화면에서 살펴볼 수 있습니다.</p></div>
    </section>
    <section id="products" className="danyeon-band">
      <div className="danyeon-wrap danyeon-section">
        <h2>하나의 회복관리 흐름</h2>
        <div className="danyeon-product-grid">
          <Product icon={<Smartphone />} product={careProducts.check} description="환자가 병원 링크에서 통증, 움직임, 전일 대비 변화를 기록하고 지난 기록과 병원 문의 방법을 확인합니다." />
          <Product icon={<ClipboardList />} product={careProducts.desk} description="담당자가 응답과 미응답을 확인하고, 연락과 조치 이력을 남기고, 다음 확인 일정을 정합니다." />
          <Product icon={<FileBarChart2 />} product={careProducts.insights} description="환자별 회복 기록과 월간 응답률, 후속관리 처리 현황, 실측 업무시간을 확인합니다." />
        </div>
      </div>
    </section>
    <section className="danyeon-wrap danyeon-section">
      <h2>환자 등록부터 관리 종료까지</h2>
      <ol className="danyeon-flow">{workflow.map(step => <li key={step}><Check size={17} aria-hidden />{step}</li>)}</ol>
    </section>
    <section id="how-it-works" className="danyeon-band">
      <div className="danyeon-wrap danyeon-section danyeon-split">
        <div><Building2 className="danyeon-feature-icon" aria-hidden /><h2>병원 업무에 맞춰 시작합니다</h2><p>초기 미팅에서 대상 환자, 관리기간, 담당자와 확인 시간을 정합니다. {careProducts.program.name}에는 병원이 승인한 관리기간과 안내를 반영합니다.</p></div>
        <div><ShieldCheck className="danyeon-feature-icon" aria-hidden /><h2>소속과 역할에 따른 접근</h2><p>병원 직원은 승인된 소속과 역할에 따라 기록에 접근합니다. 환자는 병원 연결 링크로 자기 회복 기록을 이용합니다.</p><Link className="danyeon-text-link" href={careBrand.contact.privacy}>개인정보 안내 <ArrowRight size={16} aria-hidden /></Link></div>
      </div>
    </section>
    <section id="demo" className="danyeon-wrap danyeon-section danyeon-split">
      <div><CalendarClock className="danyeon-feature-icon" aria-hidden /><h2>4주 파일럿 프로그램</h2></div>
      <div><p>정형외과 퇴원환자 관리 흐름을 소규모로 검증합니다. 체크인 참여와 미처리 업무, 도입 전후에 실제 측정한 업무시간을 함께 살펴봅니다.</p>{careDemo.available && <Link className="danyeon-text-link" href={careDemo.entry}>예시 데이터로 체험하기 <ArrowRight size={16} aria-hidden /></Link>}</div>
    </section>
    <section id="faq" className="danyeon-wrap danyeon-section danyeon-split">
      <h2>자주 묻는 질문</h2>
      <div className="danyeon-faq">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <section className="danyeon-adoption">
      <div className="danyeon-wrap danyeon-section danyeon-split"><div><h2>우리 병원의 회복관리부터</h2><p>환자 규모와 현재 사후관리 방식을 알려주시면 도입 범위를 함께 검토합니다.</p></div>
        <Link className="danyeon-button" href={careBrand.contact.inquiry}>병원 도입 문의 <ArrowRight size={18} aria-hidden /></Link></div>
    </section>
    <footer className="danyeon-wrap danyeon-footer"><CareBrandLogo /><nav aria-label="서비스 정보"><Link href="/company">서비스 소개</Link><Link href={careBrand.contact.privacy}>개인정보 안내</Link><Link href={careBrand.contact.help}>도움말</Link></nav></footer>
  </main>;
}

function Product({ icon, product, description }: { icon: React.ReactNode; product: { name: string; english: string }; description: string }) {
  return <article className="danyeon-product"><span className="danyeon-feature-icon">{icon}</span><h3>{product.name}</h3><p>{description}</p></article>;
}

function ProductPreview() {
  const rows = [
    ['예시 환자 A', '인공관절 · 퇴원 3일째', '전일 대비 움직임 불편', '확인 필요', 'attention'],
    ['예시 환자 B', '척추 · 퇴원 7일째', '오늘 예정된 응답 없음', '미응답', 'unanswered'],
    ['예시 환자 C', '골절 · 퇴원 11일째', '다음 확인 일정 등록', '후속 확인 예정', 'scheduled'],
  ];
  return <figure className="danyeon-preview" aria-label="예시 데이터로 보는 병원 업무 목록과 환자 체크인">
    <div className="danyeon-preview-board">
      <div className="danyeon-preview-top"><span><ClipboardList size={18} aria-hidden /> {careProducts.desk.name}</span><span>예시 데이터</span></div>
      <h2>오늘 확인할 환자</h2>
      <ul>{rows.map(([name, treatment, reason, status, tone]) => <li key={name}>
        <div><strong>{name}</strong><small>{treatment}</small></div>
        <div><span className="danyeon-status" data-tone={tone}>{status}</span><small>{reason}</small></div>
      </li>)}</ul>
    </div>
    <div className="danyeon-preview-check">
      <div><Smartphone size={18} aria-hidden /> <strong>{careProducts.check.name}</strong></div>
      <p>지금 통증은 어느 정도인가요?</p>
      <div className="danyeon-preview-scores" aria-hidden>{[0, 1, 2, 3, 4].map(value => <span key={value} data-picked={value === 2}>{value}</span>)}</div>
      <small><Clock3 size={14} aria-hidden /> 환자가 직접 선택하는 회복 기록</small>
    </div>
  </figure>;
}
