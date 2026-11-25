import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { careBrand, careProducts } from '@/lib/care-brand';
import { carePaths, careUrls } from '@/lib/care-urls';

export type StaffAccessStatus = 'checking' | 'sign-in' | 'denied' | 'unavailable';

type CareSignInProps = {
  operator?: boolean;
  status?: StaffAccessStatus;
  onRetry?: () => void;
};

export function CareSignIn({ operator = false, status = 'sign-in', onRetry }: CareSignInProps) {
  return (
    <main className="danyeon-sign-in">
      <section className="danyeon-sign-in-card" aria-labelledby="staff-sign-in-title">
        <header className="danyeon-sign-in-header">
          <CareBrandLogo />
          <p>{operator ? '서비스 운영자 전용' : '병원 전용 서비스'}</p>
        </header>

        <h1 id="staff-sign-in-title">{operator ? careBrand.name + ' 운영관리' : careProducts.desk.name}</h1>
        <p className="danyeon-sign-in-subtitle">
          {operator ? '의료기관 등록과 서비스 운영을 관리합니다.' : '의료기관을 위한 회복관리 솔루션'}
        </p>

        <div className="danyeon-sign-in-action">
          {status === 'checking' && <p role="status">로그인 상태를 확인하고 있습니다.</p>}
          {status === 'sign-in' && <>
            <a href={careUrls.signIn} target="_top" aria-describedby="staff-sign-in-provider" className="danyeon-button danyeon-button-primary">
              {operator ? '운영관리자 로그인' : '병원 담당자 로그인'} <ArrowRight size={18} aria-hidden />
            </a>
            <p id="staff-sign-in-provider">현재 ChatGPT 계정으로 본인을 확인합니다.</p>
          </>}
          {status === 'denied' && <>
            <p role="alert">이 계정에는 이용 권한이 없습니다. 권한이 등록된 계정으로 다시 로그인하거나 계정 이용 문의를 확인해 주세요.</p>
            <a href={careUrls.signOut} target="_top" className="danyeon-button danyeon-button-outline">현재 계정 로그아웃</a>
          </>}
          {status === 'unavailable' && <>
            <p role="alert">로그인 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
            <button type="button" onClick={onRetry} className="danyeon-button danyeon-button-outline">다시 확인</button>
          </>}
        </div>

        <div className="danyeon-sign-in-support">
          <p>{operator ? '승인된 운영관리자만 이용할 수 있습니다.' : '승인된 의료기관 담당자만 이용할 수 있습니다.'}</p>
          <nav aria-label="계정 및 도입 문의">
            <Link href={carePaths.hospitalSupport + '#account'}>계정 이용 문의</Link>
            {!operator && <Link href={carePaths.inquiry}>병원 도입 문의</Link>}
          </nav>
        </div>

        <footer>
          <nav aria-label="서비스 정보">
            <Link href={carePaths.carePrivacy}>개인정보 처리 안내</Link>
            <Link href={carePaths.hospitalSupport + '#terms'}>이용약관 안내</Link>
            <Link href={carePaths.hospitalSupport + '#contact'}>서비스 문의</Link>
          </nav>
        </footer>
      </section>
    </main>
  );
}
