import Link from 'next/link';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { carePaths } from '@/lib/care-urls';

const sections = [
  {href:carePaths.overview,label:'서비스 소개'},
  {href:carePaths.healthcareOverview,label:'의료기관 제안서'},
  {href:carePaths.businessOverview,label:'투자·사업소개'},
];

export function OverviewHeader({ current }: {current:string}) {
  return <header className="overview-wrap overview-header no-print">
    <CareBrandLogo/>
    <nav aria-label="서비스 소개 메뉴">
      {sections.map(({href,label})=><Link key={href} href={href} aria-current={href===current?'page':undefined}>{label}</Link>)}
    </nav>
  </header>;
}
