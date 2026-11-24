import Link from 'next/link';
import { CareBrandLogo } from '@/components/care-brand-logo';
import { careBrand } from '@/lib/care-brand';

export function DanyeonCompany() {
  return <main className="danyeon-site">
    <div className="danyeon-wrap danyeon-header"><CareBrandLogo /><Link href={careBrand.contact.inquiry}>병원 도입 문의</Link></div>
    <article className="danyeon-wrap danyeon-section max-w-3xl">
      <p className="danyeon-kicker">{careBrand.englishDescription}</p>
      <h1>{careBrand.slogan}</h1>
      <p className="mt-5">{careBrand.name}은 정형외과 수술·퇴원환자의 회복 기록과 병원의 확인, 조치, 후속 일정을 연결합니다.</p>
      <h2 className="mt-10">이름에 담긴 뜻</h2>
      <dl className="mt-4 grid gap-5">
        <div><dt className="font-bold">병원을 다녀온 환자</dt><dd>진료와 치료, 수술 이후 일상으로 돌아오는 사람을 뜻합니다.</dd></div>
        <div><dt className="font-bold">따뜻할 온(溫)</dt><dd>진료가 끝난 뒤에도 이어지는 관심과 돌봄을 담았습니다.</dd></div>
        <div><dt className="font-bold">켜짐의 ON</dt><dd>병원에서 시작한 회복관리가 환자의 일상에서도 이어진다는 뜻입니다.</dd></div>
      </dl>
      <p className="mt-7">병원은 안내한 확인 시간과 업무 절차에 따라 기록을 살펴봅니다.</p>
      <Link className="danyeon-button danyeon-button-primary mt-6" href="/">제품 살펴보기</Link>
    </article>
  </main>;
}
