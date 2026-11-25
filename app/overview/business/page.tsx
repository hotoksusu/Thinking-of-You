import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OverviewHeader } from '@/components/overview-header';
import { carePaths } from '@/lib/care-urls';
import { businessContactOptions, publicBusinessTopics } from '@/lib/overview-content';

export const metadata:Metadata = {
  title:'다녀온 투자 및 사업소개',
  description:'다녀온의 사업 방향, 초기 고객군과 제휴 문의를 안내합니다.',
  alternates:{canonical:carePaths.businessOverview},
};

export default function BusinessOverview() {
  return <div className="overview-site">
    <OverviewHeader current={carePaths.businessOverview}/>
    <main className="overview-main">
      <section className="overview-intro">
        <div className="overview-wrap">
          <p className="overview-eyebrow">투자 및 사업소개</p>
          <h1>진료 이후의 환자관리를<br/>병원의 일상 업무로.</h1>
          <p className="overview-lead">다녀온은 반복적인 회복 확인이 필요한 의료기관에서 시작합니다. 병원 담당자와 환자가 연결되는 업무 흐름을 검증하고, 치료별 프로그램으로 확장합니다.</p>
        </div>
      </section>
      <section className="overview-wrap business-topics" aria-label="다녀온 사업 검토 항목">
        {publicBusinessTopics.map(({title,description,sources})=><article key={title}>
          <h2>{title}</h2>
          <p>{description}</p>
          {sources&&<p className="business-sources">{sources.map(source=><a key={source.href} href={source.href}>{source.name}</a>)}</p>}
        </article>)}
      </section>
      <section className="business-contact">
        <div className="overview-wrap">
          <h2>투자 검토와 사업 제휴</h2>
          <p>상세자료는 접수한 문의를 확인한 뒤 요청 범위에 맞춰 안내합니다.</p>
          <div className="overview-actions">{Object.values(businessContactOptions).map((option,i)=><Link key={option.path} className={'overview-button'+(i===1?' overview-button-primary':'')} href={option.path}>{option.title} <ArrowRight size={16} aria-hidden/></Link>)}</div>
        </div>
      </section>
    </main>
  </div>;
}

