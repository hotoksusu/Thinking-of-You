import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OverviewHeader } from '@/components/overview-header';
import { carePaths } from '@/lib/care-urls';
import { proposalEdition } from '@/lib/overview-content';

export const metadata:Metadata = {
  title:'다녀온 서비스 소개',
  description:'의료기관용 디지털 제안서와 투자·사업소개를 살펴보세요.',
  alternates:{canonical:carePaths.overview},
};

export default function OverviewPage() {
  return <div className="overview-site">
    <OverviewHeader current={carePaths.overview}/>
    <main className="overview-main">
      <section className="overview-intro">
        <div className="overview-wrap overview-intro-grid">
          <div>
            <p className="overview-eyebrow">다녀온 서비스 소개</p>
            <h1>회복기록을 병원의<br/>다음 업무로 연결합니다.</h1>
            <p className="overview-lead">수술·시술 이후 환자의 회복기록, 의료진의 확인, 조치와 후속 관리를 하나의 업무 흐름으로 살펴보세요.</p>
            <div className="overview-actions">
              <Link className="overview-button overview-button-primary" href={carePaths.healthcareOverview}>의료기관용 제안서 열기 <ArrowRight size={18} aria-hidden/></Link>
              <Link className="overview-button" href={carePaths.businessOverview}>투자·사업소개</Link>
            </div>
          </div>
          <figure className="overview-cover">
            <Image src="/brand/product/desk.webp" width={1152} height={560} alt="합성 데이터가 표시된 다녀온 데스크 업무 목록" priority/>
            <figcaption>다녀온 데스크 · 합성 데이터</figcaption>
          </figure>
        </div>
      </section>
      <section className="overview-wrap overview-index" aria-label="소개 자료">
        <article>
          <p className="overview-eyebrow">의료기관</p>
          <h2>도입 검토 자료</h2>
          <p>실제 제품 화면으로 현재 기능, 담당자 업무, 도입 과정을 확인할 수 있습니다.</p>
          <a className="overview-text-link" href={proposalEdition.pdfPath} download>의료기관용 PDF 다운로드</a>
        </article>
        <article>
          <p className="overview-eyebrow">투자 및 제휴</p>
          <h2>사업 검토 자료</h2>
          <p>초기 고객군, 시장 진입과 제품 확장 방향을 확인하고 필요하면 상세자료를 요청할 수 있습니다.</p>
          <Link className="overview-text-link" href={carePaths.investmentInquiry}>투자 및 상세자료 요청</Link>
        </article>
      </section>
    </main>
  </div>;
}

