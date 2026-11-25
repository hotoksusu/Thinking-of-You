import type { Metadata } from 'next';
import { BusinessInquiry } from '@/components/business-inquiry';
import { businessContactOptions } from '@/lib/overview-content';

export const metadata:Metadata = {title:'다녀온 사업 제휴 문의',alternates:{canonical:businessContactOptions.partnership.path}};

export default function PartnershipPage() {
  return <BusinessInquiry purpose="partnership"/>;
}

