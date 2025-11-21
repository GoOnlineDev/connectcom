"use client";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, ShoppingBag } from 'lucide-react';

export default function CategoriesPageClient() {
  const categories = useQuery(api.shops.getAllShopCategories);

  if (categories === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-burgundy-900">Shop Categories</h1>
            <p className="text-lg max-w-3xl mx-auto text-burgundy-700">
              Browse shops organized by category on ConnectCom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-burgundy-200 hover:border-burgundy-300">
                  <CardHeader>
                    <CardTitle className="text-burgundy-900 flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      {category}
                    </CardTitle>
                    <CardDescription>Explore shops in this category</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
