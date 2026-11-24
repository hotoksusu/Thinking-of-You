import type { Metadata } from 'next';
import { carePaths } from '@/lib/care-urls';
import { CompanyV2 } from '@/components/company-v2';
import { careBrand, isDanyeon } from '@/lib/care-brand';

export const metadata: Metadata = {
  title: careBrand.name + ' | 서비스 소개',
  description: careBrand.description,
  alternates: { canonical: carePaths.company },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return isDanyeon ? children : <CompanyV2 />;
}
