import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import CategoriesPageClient from './CategoriesPageClient';

export const metadata: Metadata = constructMetadata({
  title: "Shop Categories - ConnectCom Uganda",
  description: "Browse shops by category on ConnectCom. Find products and services organized by category - from electronics to fashion, food to services in Uganda.",
  canonical: '/categories',
  keywords: [
    'shop categories Uganda',
    'browse by category',
    'Uganda shop categories',
    'products by category',
    'services by category',
    'Kampala shop categories',
  ],
});

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
