import { DanyeonLanding } from '@/components/danyeon-landing';
import { isDanyeon } from '@/lib/care-brand';
import LegacyCareGateway from './legacy-care-gateway';

export default function Page() {
  return isDanyeon ? <DanyeonLanding /> : <LegacyCareGateway />;
}
