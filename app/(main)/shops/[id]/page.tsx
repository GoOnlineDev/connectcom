import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/seo';
import ShopPageClient from './ShopPageClient';

interface ShopPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO (simplified to avoid fetch issues)
export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Basic metadata without server-side fetch to avoid timeout issues
  // Client-side component will handle data fetching and rendering
  return constructMetadata({
    title: 'Shop | ConnectCom',
    description: 'View shop details on ConnectCom',
  });
}

// Server component wrapper - simplified to avoid fetch issues
// Just render the client component which handles all data fetching
export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params;
  
  // Validate ID format
  if (!id || id.length < 20) {
    notFound();
  }

  // Render client component directly - it will handle data fetching client-side
  // Slug validation removed from server-side to avoid fetch failures
  return <ShopPageClient shopId={id} />;
}
