import React from 'react';
import CategoryPageClient from './category-page-client';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolved = React.use(params);
  // Decode the category from URL (convert dashes back to spaces and normalize casing for display)
  const categoryName = decodeURIComponent(resolved.category)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return <CategoryPageClient categoryName={categoryName} />;
}
