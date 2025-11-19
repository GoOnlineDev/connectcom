import { notFound } from 'next/navigation';
import ShopPageClient from "../ShopPageClient";

interface ShopSlugPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

// Server component that renders shop page (slug validation removed to avoid fetch issues)
// Slug is kept in URL for SEO purposes but validated client-side if needed
export default async function ShopSlugPage({ params }: ShopSlugPageProps) {
  const { id } = await params;
  
  // Validate ID format
  if (!id || id.length < 20) {
    notFound();
  }

  // Render the client component directly - it will handle data fetching client-side
  // This avoids server-side fetch issues and still provides a good user experience
  return <ShopPageClient shopId={id} />;
}
