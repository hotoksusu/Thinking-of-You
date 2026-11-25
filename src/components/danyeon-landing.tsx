import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarClock, ClipboardCheck, Menu, Plus, ShieldCheck, Smartphone } from 'lucide-react';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { LandingMobileMenu } from '@/components/landing-mobile-menu';
import { PatientEntryRedirect } from '@/components/patient-entry-redirect';
import { careBrand, careDemo } from '@/lib/care-brand';
import { carePaths } from '@/lib/care-urls';

const demoHref = careDemo.available ? careDemo.entry : carePaths.inquiry + '?purpose=demo';
const demoLabel = careDemo.available ? '무료 데모 체험' : '데모 시연 문의';

const navItems = [
  { href: carePaths.overview, label: '서비스 소개' },
  { href: '#specialties', label: '활용 분야' },
  { href: '#get-started', label: '도입 안내' },
];

const values = [
  { icon: Smartphone, title: '설치 없이 시작하는 회복기록', description: '환자는 병원에서 받은 링크를 열어요.' },
  { icon: ClipboardCheck, title: '한 화면에서 처리하는 환자 업무', description: '응답과 조치, 후속 일정을 함께 확인해요.' },
  { icon: CalendarClock, title: '병원에 맞춘 회복관리 프로그램', description: '치료에 맞춰 질문과 기간을 설정해요.' },
];

const screens = {
  desk: { width: 1152, height: 560, alt: '합성 데이터를 사용한 다녀온 데스크의 회복관리 업무 목록' },
  checkin: { width: 780, height: 990, alt: '다녀온 체크에서 회복 상태를 기록하는 정형외과 예시 화면' },
  registration: { width: 1152, height: 300, alt: '다녀온 데스크 환자 등록 양식 일부' },
  response: { width: 1094, height: 405, alt: '담당자가 예시 환자의 원본 응답을 확인하는 화면' },
  followup: { width: 1152, height: 420, alt: '예시 환자의 후속 확인 일정 목록' },
  history: { width: 780, height: 1075, alt: '예시 환자의 날짜별 회복기록과 통증 추이 화면' },
  insights: { width: 1094, height: 460, alt: '합성 데이터의 관리 대상, 응답률과 확인율을 표시한 운영 리포트' },
};

type Screen = keyof typeof screens;

const workflow: {title:string;description:string;screen:Screen}[] = [
  { title: '환자 등록', description: '치료 유형과 회복관리 프로그램을 설정합니다.', screen: 'registration' },
  { title: '환자 회복기록', description: '환자는 병원에서 받은 링크로 상태를 기록합니다.', screen: 'checkin' },
  { title: '의료진 확인', description: '환자 응답과 필요한 후속 업무를 확인합니다.', screen: 'response' },
  { title: '후속관리', description: '조치 이력과 다음 확인 일정을 연결합니다.', screen: 'followup' },
];

const products: {label:string;title:string;description:string;screen:Screen;caption:string}[] = [
  { label: '환자관리 · 다녀온 체크', title: '환자별 회복 이력을 한눈에.', description: '환자가 남긴 오늘의 응답과 지난 기록을 확인하세요. 담당자는 시간순으로 회복기록을 살피고 확인과 조치 이력을 남길 수 있습니다.', screen: 'history', caption: '환자 회복기록 · 합성 데이터' },
  { label: '병원 업무관리 · 다녀온 데스크', title: '오늘 해야 할 병원 업무를 한곳에.', description: '미응답 환자와 확인할 응답을 업무 목록에서 살펴보고, 연락과 조치 결과를 기록하세요. 다음 확인 날짜도 같은 환자의 업무에 남길 수 있습니다.', screen: 'followup', caption: '후속 확인 일정 · 합성 데이터' },
  { label: '운영 분석 · 다녀온 인사이트', title: '관리 과정은 데이터로.', description: '기간별 응답, 담당자 확인과 후속관리 현황을 운영 리포트에서 확인하세요. 필요할 때 병원 범위의 리포트를 내려받을 수 있습니다.', screen: 'insights', caption: '운영 리포트 · 합성 데이터' },
];

const specialties = [
  { title: '정형외과', description: '관절·척추 수술 후 회복관리', status: '대표 데모' },
  { title: '안과', description: '백내장·시력교정 수술 후 관리', status: '확장 검토' },
  { title: '외과', description: '수술 후 회복관리', status: '도입 상담' },
  { title: '기타 수술·시술', description: '반복적인 확인이 필요한 사후관리', status: '수요 검토' },
];

const onboarding = [
  { title: '병원 업무 확인', description: '현재 환자관리 절차와 담당자, 확인 시간을 함께 살펴봅니다.' },
  { title: '관리 프로그램 설정', description: '대상 환자와 체크인 질문, 관리 주기를 정합니다.' },
  { title: '환자관리 시작', description: '승인된 범위에서 안내 링크를 발급하고 후속관리 절차를 확인합니다.' },
];

const faqs = [
  ['환자가 앱을 설치해야 하나요?', '병원에서 받은 전용 링크를 브라우저에서 열고 안내된 확인 절차를 거치면 됩니다.'],
  ['기존 EMR과 연동이 필요한가요?', '담당자가 브라우저에서 환자를 등록하는 방식으로 도입 범위를 검토합니다. EMR 자동 연동은 현재 제공 범위에 포함되지 않습니다.'],
  ['환자 기록은 누가 확인할 수 있나요?', '승인된 병원 담당자는 소속과 역할 범위의 기록을 확인합니다. 환자는 병원 링크로 연결된 본인의 회복기록을 이용합니다.'],
  ['환자 응답은 언제 확인하나요?', '병원이 안내한 확인 시간과 절차를 따릅니다. 긴급한 증상은 의료기관이나 119에 연락해 주세요.'],
  ['제품을 먼저 체험할 수 있나요?', careDemo.available ? '데모에서 합성 데이터로 환자 체크인과 병원 업무를 체험할 수 있습니다.' : '도입 문의에서 제품 시연을 선택하면 합성 데이터로 사용 흐름을 안내합니다.'],
];

function ProductImage({ screen, priority = false, className }: {screen:Screen;priority?:boolean;className?:string}) {
  const {width,height,alt} = screens[screen];
  return <Image src={'/brand/product/'+screen+'.webp'} width={width} height={height} alt={alt} className={className} priority={priority}/>;
}

function CallsToAction({ final = false }: {final?:boolean}) {
  return <div className="landing-actions">
    <Link className="landing-button landing-button-primary" href={demoHref}>{final && careDemo.available ? '서비스 체험하기' : demoLabel}<ArrowRight size={18} aria-hidden /></Link>
    <Link className="landing-button landing-button-outline" href={carePaths.inquiry}>병원 도입 문의</Link>
  </div>;
}

export function DanyeonLanding() {
  return <div className="danyeon-landing">
    <PatientEntryRedirect redirectSession={false} />
    <a href="#landing-content" className="landing-skip">본문으로 건너뛰기</a>
    <header className="landing-wrap landing-header">
      <CareBrandLogo />
      <nav className="landing-nav" aria-label="주요 메뉴">
        {navItems.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <div className="landing-header-actions">
        <Link href={carePaths.desk}>병원 로그인</Link>
        <Link className="landing-button landing-button-outline" href={carePaths.inquiry}>도입 문의</Link>
      </div>
      <LandingMobileMenu links={[...navItems,{href:carePaths.desk,label:'병원 로그인'},{href:carePaths.inquiry,label:'도입 문의'}]} icon={<Menu size={21} aria-hidden/>}/>
    </header>

    <main id="landing-content" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="landing-heading">
        <div className="landing-wrap landing-hero-grid">
          <div className="landing-intro">
            <p className="landing-eyebrow">의료기관용 환자관리 솔루션</p>
            <h1 id="landing-heading"><span>환자관리는 더 체계적으로.</span><span>병원 업무는 더 간편하게.</span></h1>
            <p className="landing-lead">회복기록부터 환자별 관리 이력, 후속 확인 일정까지. 환자관리 업무를 하나로 연결합니다.</p>
            <CallsToAction />
            <Link className="landing-patient-link" href={carePaths.patient}>병원에서 안내받은 환자이신가요?<ArrowRight size={16} aria-hidden/></Link>
          </div>
          <figure className="landing-hero-preview">
            <div className="landing-hero-stage">
              <div className="landing-desktop-preview">
                <div className="landing-preview-heading"><span>다녀온 데스크</span><span>오늘의 업무</span></div>
                <ProductImage screen="desk" priority/>
              </div>
              <div className="landing-phone-preview"><ProductImage screen="checkin" priority/></div>
            </div>
            <figcaption>다녀온 데스크와 환자용 체크인 · 합성 데이터</figcaption>
          </figure>
        </div>
      </section>

      <section className="landing-wrap landing-values" aria-label="다녀온의 핵심 가치">
        {values.map(({icon:Icon,title,description})=><div key={title}>
          <span className="landing-value-icon"><Icon size={22} aria-hidden/></span>
          <div><h2>{title}</h2><p>{description}</p></div>
        </div>)}
      </section>

      <section id="how-it-works" className="landing-tinted landing-section" aria-labelledby="workflow-title">
        <div className="landing-wrap">
          <div className="landing-section-intro">
            <p className="landing-eyebrow">사용 흐름</p>
            <h2 id="workflow-title">환자 등록부터 후속관리까지,<br className="landing-break"/> 하나의 흐름으로.</h2>
          </div>
          <ol className="landing-workflow">
            {workflow.map(({title,description,screen},index)=><li key={title}>
              <p className="landing-step">STEP {String(index+1).padStart(2,'0')}</p>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className={'landing-step-image landing-step-'+screen}><ProductImage screen={screen}/></div>
            </li>)}
          </ol>
          <p className="landing-caption">실제 제품 화면 · 합성 데이터</p>
        </div>
      </section>

      <section id="products" className="landing-wrap landing-section" aria-labelledby="products-title">
        <div className="landing-section-intro">
          <p className="landing-eyebrow">서비스 소개</p>
          <h2 id="products-title">회복기록이 병원의 다음 업무로 이어집니다.</h2>
        </div>
        <div className="landing-products">
          {products.map(({label,title,description,screen,caption},index)=><article className="landing-product" data-reverse={index%2===1} key={label}>
            <div><p className="landing-eyebrow">{label}</p><h3>{title}</h3><p className="landing-product-copy">{description}</p></div>
            <figure>
              <div className={'landing-product-image landing-product-'+screen}><ProductImage screen={screen}/></div>
              <figcaption>{caption}</figcaption>
            </figure>
          </article>)}
        </div>
        <p className="landing-roadmap">확장 검토 · 통합 CRM, 예약 연동, 반복 업무 자동화</p>
      </section>

      <section id="specialties" className="landing-tinted landing-section" aria-labelledby="specialty-title">
        <div className="landing-wrap">
          <div className="landing-section-intro">
            <p className="landing-eyebrow">활용 분야</p>
            <h2 id="specialty-title">치료에 맞는 회복관리부터</h2>
            <p>수술·시술을 하는 의원과 중소형 병원부터 시작합니다. 종합병원은 개별 진료과나 치료 프로그램 단위로 상담합니다.</p>
          </div>
          <ul className="landing-specialties">
            {specialties.map(({title,description,status})=><li key={title}>
              <h3>{title}</h3><p>{description}</p><p className="landing-specialty-status">{status}</p>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="get-started" className="landing-wrap landing-section landing-onboarding" aria-labelledby="get-started-title">
        <div className="landing-section-intro">
          <p className="landing-eyebrow">도입 안내</p>
          <h2 id="get-started-title">병원은 그대로.<br/>환자관리는 새롭게.</h2>
          <p>기존 진료 환경을 유지하면서 필요한 환자관리 업무부터 시작하세요.</p>
          <Link className="landing-button landing-button-primary" href={carePaths.inquiry}>우리 병원 도입 상담하기<ArrowRight size={18} aria-hidden/></Link>
        </div>
        <ol className="landing-onboarding-list">
          {onboarding.map(({title,description},index)=><li key={title}>
            <span aria-hidden>{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <section id="faq" className="landing-tinted landing-section" aria-labelledby="faq-title">
        <div className="landing-wrap landing-faq">
          <div className="landing-section-intro">
            <p className="landing-eyebrow">보안과 이용 안내</p>
            <h2 id="faq-title">자주 묻는 질문</h2>
            <p>병원과 환자별로 접근 범위를 구분하고, 확인과 조치 이력을 기록합니다. 데모에는 합성 데이터만 사용합니다.</p>
            <Link className="landing-inline-link" href={carePaths.carePrivacy}><ShieldCheck size={18} aria-hidden/>개인정보 처리 안내</Link>
          </div>
          <div className="landing-faq-list">{faqs.map(([question,answer])=><details key={question}>
            <summary>{question}<Plus size={20} aria-hidden/></summary>
            <p>{answer}</p>
          </details>)}</div>
        </div>
      </section>

      <section id="demo" className="landing-section landing-final" aria-labelledby="landing-final-title">
        <div className="landing-wrap">
          <h2 id="landing-final-title">{careBrand.slogan.slice(0,-1)},<br className="landing-break"/> 환자관리는 이어집니다.</h2>
          <p>우리 병원의 환자관리 업무에 다녀온을 적용해 보세요.</p>
          <CallsToAction final/>
        </div>
      </section>
    </main>
    <footer className="landing-wrap landing-footer">
      <div><CareBrandLogo /><p className="landing-footer-slogan">{careBrand.slogan}</p></div>
      <nav aria-label="서비스 정보">
        <Link href={carePaths.company}>다녀온 소개</Link>
        <Link href={carePaths.carePrivacy}>개인정보 처리 안내</Link>
        <Link href={carePaths.help}>환자 도움말</Link>
      </nav>
    </footer>
  </div>;
}
