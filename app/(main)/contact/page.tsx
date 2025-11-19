import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = constructMetadata({
  title: "Contact Us - ConnectCom Uganda",
  description: "Get in touch with ConnectCom. Have questions or need support? Contact our team in Kampala, Uganda. We're here to help.",
  canonical: '/contact',
  keywords: ['contact ConnectCom', 'support Uganda', 'customer service Kampala'],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
