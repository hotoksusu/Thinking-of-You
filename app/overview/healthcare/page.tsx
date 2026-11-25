import type { Metadata } from 'next';
import { HealthcareProposal } from '@/components/healthcare-proposal';
import { OverviewHeader } from '@/components/overview-header';
import { carePaths } from '@/lib/care-urls';
import { proposalEdition } from '@/lib/overview-content';

export const metadata:Metadata = {
  title:'다녀온 의료기관용 상품소개서',
  description:'수술·시술 후 회복관리, 의료진 업무와 도입 과정을 소개하는 다녀온 제안서입니다.',
  alternates:{canonical:carePaths.healthcareOverview},
};

export default function HealthcareOverview() {
  return <div className="overview-site">
    <OverviewHeader current={carePaths.healthcareOverview}/>
    <main className="overview-main">
      <div className="overview-wrap proposal-page-title no-print">
        <div>
          <p className="overview-eyebrow">의료기관 도입 검토</p>
          <h1>다녀온 의료기관용 상품소개서</h1>
          <p className="overview-lead">환자 체크인부터 후속관리까지, 병원에서 사용하는 흐름을 실제 화면으로 확인하세요.</p>
        </div>
        <a className="overview-button overview-button-primary" href={proposalEdition.pdfPath} download>PDF 다운로드</a>
      </div>
      <HealthcareProposal/>
    </main>
  </div>;
}

