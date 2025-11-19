import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import PrivacyPolicyPageClient from './PrivacyPolicyPageClient';

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy - ConnectCom Uganda",
  description: "Read ConnectCom's Privacy Policy. Learn how we collect, use, and protect your personal information on our marketplace platform.",
  canonical: '/policy',
  keywords: ['privacy policy', 'ConnectCom privacy', 'data protection Uganda', 'privacy statement'],
});

export default function PolicyPage() {
  return <PrivacyPolicyPageClient />;
}
