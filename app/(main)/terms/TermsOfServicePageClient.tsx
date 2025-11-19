import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import TermsOfServicePageClient from './TermsOfServicePageClient';

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service - ConnectCom Uganda",
  description: "Read ConnectCom's Terms of Service. Understand the rules and guidelines for using our marketplace platform in Uganda.",
  canonical: '/terms',
  keywords: ['terms of service', 'ConnectCom terms', 'marketplace terms', 'user agreement Uganda'],
});

export default function TermsPage() {
  return <TermsOfServicePageClient />;
}
