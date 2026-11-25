import Link from 'next/link';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { carePaths } from '@/lib/care-urls';

export default function HospitalSupport() {
  return (
    <main className="care-ui min-h-screen px-5 py-6">
      <div className="mx-auto max-w-xl">
        <CareBrandLogo />
        <h1 className="my-6">병원 서비스 이용 안내</h1>
        <div className="care-surface space-y-6 p-5 sm:p-7">
          <section id="account" aria-labelledby="account-heading">
            <h2 id="account-heading">계정 이용 문의</h2>
            <p className="mt-2">이용 중인 의료기관의 담당자는 소속 병원의 다녀온 관리자에게 권한 등록이나 변경을 요청해 주세요.</p>
            <p className="mt-2">병원 관리자 계정의 최초 발급 절차는 도입 상담에서 안내합니다. 운영관리자 계정은 다녀온 운영 책임자에게 문의해 주세요.</p>
            <Link href="/hospital/dashboard" className="danyeon-text-link">이 기기의 기존 병원 화면</Link>
          </section>
          <section id="terms" aria-labelledby="terms-heading">
            <h2 id="terms-heading">이용약관 안내</h2>
            <p className="mt-2">기관에 적용되는 이용 조건과 약관은 소속 병원의 계약 담당자 또는 다녀온 도입 상담에서 확인해 주세요.</p>
            <Link href={carePaths.carePrivacy} className="danyeon-text-link">개인정보 처리 안내</Link>
          </section>
          <section id="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading">서비스 문의</h2>
            <p className="mt-2">제품 체험과 신규 도입은 병원 도입 문의에서 신청할 수 있습니다.</p>
            <Link href={carePaths.inquiry} className="danyeon-text-link">병원 도입 문의</Link>
          </section>
        </div>
        <Link href={carePaths.hospitalLogin} className="danyeon-text-link">병원 로그인으로 돌아가기</Link>
      </div>
    </main>
  );
}
