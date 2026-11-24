import { CareBrandLogo } from '@/components/care-brand-logo';
import { careDemo, careProducts } from '@/lib/care-brand';

const demos = [
  { href:'/demo/patient', title:'환자 체험', description:'체크인에 답하고 저장한 회복 기록을 확인합니다.' },
  { href:'/demo/hospital', title:'병원 담당자 체험', description:'업무 목록에서 응답을 확인하고 조치와 후속 일정을 기록합니다.' },
  { href:'/demo/operator', title:'서비스 운영관리자 체험', description:'합성 데이터로 병원과 도입 문의 관리를 살펴봅니다.' },
];

export default function DemoPage() {
  return <main className="danyeon-site min-h-screen">
    <header className="danyeon-wrap danyeon-header"><CareBrandLogo /></header>
    <section className="danyeon-wrap danyeon-section">
      <p className="danyeon-kicker">예시 데이터 · 개발 환경</p>
      <h1>서비스 체험하기</h1>
      <p className="mt-3">{careProducts.check.name}와 {careProducts.desk.name}의 회복관리 흐름을 살펴보세요.</p>
      <div className="danyeon-product-grid">{demos.map(demo => <article className="danyeon-product" key={demo.href}>
        <h2 className="text-lg">{demo.title}</h2><p className="mt-2">{demo.description}</p>
        <a className="danyeon-text-link" href={careDemo.local ? '/__demo' + demo.href.slice(5) : demo.href}>{demo.title} 시작</a>
      </article>)}</div>
      <p className="mt-5">체험에서는 실제 환자 기록을 조회하거나 문자를 보내지 않습니다.</p>
    </section>
  </main>;
}
