"use client";
import React from "react";
import ShopPage from "../page";

interface ShopSlugPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

// Client wrapper that forwards only the id to the underlying client ShopPage
export default function ShopSlugPage({ params }: ShopSlugPageProps) {
  const resolved = React.use(params);
  const passthrough = React.useMemo(() => Promise.resolve({ id: resolved.id }), [resolved.id]);
  return <ShopPage params={passthrough as any} />;
}


