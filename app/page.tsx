import type { Metadata } from 'next';
import { carePaths } from '@/lib/care-urls';
import { DanyeonLanding } from '@/components/danyeon-landing';
import { isDanyeon } from '@/lib/care-brand';
import LegacyCareGateway from './legacy-care-gateway';

export const metadata: Metadata = { alternates: { canonical: carePaths.home } };

export default function Page() {
  return isDanyeon ? <DanyeonLanding /> : <LegacyCareGateway />;
}
