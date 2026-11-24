import type { Metadata } from 'next';
import { carePaths } from '@/lib/care-urls';
import { DanyeonLanding } from '@/components/danyeon-landing';
import { isDanyeon } from '@/lib/care-brand';
import LegacyHospitalLanding from './legacy-hospital-landing';

export const metadata: Metadata = { alternates: { canonical: isDanyeon ? carePaths.home : '/hospital' } };

export default function Page() {
  return isDanyeon ? <DanyeonLanding /> : <LegacyHospitalLanding />;
}
