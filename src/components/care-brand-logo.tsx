/* eslint-disable @next/next/no-img-element -- Fixed-size local logo in the static export. */
import Link from 'next/link';
import { careBrand, isDanyeon } from '@/lib/care-brand';

export function CareBrandLogo({ href = '/' }: { href?: string }) {
  return <Link href={href} className="danyeon-wordmark">
    <img width={38} height={38} src={careBrand.logo} alt="" />
    <span className="danyeon-wordmark-name">{isDanyeon
      ? <>{careBrand.name.slice(0, -1)}<strong>{careBrand.name.slice(-1)}</strong></>
      : careBrand.name}<small>{careBrand.englishName}</small></span>
  </Link>;
}
