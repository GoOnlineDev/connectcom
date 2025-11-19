import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ShopsPageClient from './ShopsPageClient';

export const metadata: Metadata = constructMetadata({
  title: "Browse All Shops - ConnectCom Uganda",
  description: "Discover and explore all shops on ConnectCom. Find products and services from trusted local businesses across Uganda. Search by category, location, and shop type.",
  canonical: '/shops',
  keywords: [
    'all shops Uganda',
    'browse shops Kampala',
    'Uganda shops directory',
    'local businesses directory',
    'find shops Uganda',
    'shop directory',
  ],
});

export default function ShopsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
        </div>
      </div>
    }>
      <ShopsPageClient />
    </Suspense>
  );
}
