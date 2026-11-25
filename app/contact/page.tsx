import type { Metadata } from 'next';
import Pilot from '../pilot/page';
import { carePaths } from '@/lib/care-urls';

export const metadata:Metadata = {
  title:'다녀온 병원 도입 문의',
  alternates:{canonical:carePaths.contact},
};

export default Pilot;

