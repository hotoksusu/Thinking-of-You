import type { Metadata } from 'next';
import { BusinessInquiry } from '@/components/business-inquiry';
import { businessContactOptions } from '@/lib/overview-content';

export const metadata:Metadata = {title:'다녀온 투자 및 상세자료 요청',alternates:{canonical:businessContactOptions.investment.path}};

export default function InvestmentPage() {
  return <BusinessInquiry purpose="investment"/>;
}

