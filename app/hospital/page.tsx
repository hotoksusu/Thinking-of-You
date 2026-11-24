import { DanyeonLanding } from '@/components/danyeon-landing';
import { isDanyeon } from '@/lib/care-brand';
import LegacyHospitalLanding from './legacy-hospital-landing';

export default function Page() {
  return isDanyeon ? <DanyeonLanding /> : <LegacyHospitalLanding />;
}
