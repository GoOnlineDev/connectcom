import React from 'react';
import CategoryPageClient from './category-page-client';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  
  // Decode the category from URL (convert dashes back to spaces and capitalize)
  const categoryName = decodeURIComponent(resolvedParams.category)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return <CategoryPageClient categoryName={categoryName} />;
}
