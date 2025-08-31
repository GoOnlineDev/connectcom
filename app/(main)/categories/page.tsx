"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Store, ShoppingBag, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const categories = useQuery(api.shops.getAllShopCategories);
  const allShops = useQuery(api.shops.getAllApprovedShops);

  if (categories === undefined || allShops === undefined) {
    return (
      <div className="min-h-screen bg-beige-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-beige-200">
                <Skeleton className="h-32 w-full rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate shop count for each category
  const categoryStats = categories.map(category => {
    const shopCount = allShops.filter(shop => 
      shop.categories?.includes(category)
    ).length;
    
    return {
      name: category,
      shopCount,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    };
  }).filter(cat => cat.shopCount > 0); // Only show categories with shops

  // Sort by shop count (most popular first)
  const sortedCategories = [...categoryStats].sort((a, b) => b.shopCount - a.shopCount);

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-950 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Categories</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our diverse collection of shops organized by category. Find exactly what you're looking for.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <span>{allShops.length} Total Shops</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{categories.length} Categories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Categories */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-600 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10 border-beige-300 focus:border-burgundy-500 focus:ring-burgundy-500"
            />
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-burgundy-600" />
            <h2 className="text-2xl font-bold text-burgundy-900">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.slice(0, 6).map((category, index) => (
              <Link key={category.name} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-beige-200">
                  <div className="relative h-32 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-burgundy-600 text-white">
                        #{index + 1} Popular
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Store className="w-8 h-8 text-burgundy-600" />
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-burgundy-700">
                        {category.shopCount} shop{category.shopCount !== 1 ? 's' : ''}
                      </span>
                      <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 group-hover:bg-burgundy-50 transition-colors">
                        Explore
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-burgundy-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCategories.map((category) => (
              <Link key={category.name} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-md transition-all duration-300 border-beige-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-burgundy-700">
                        {category.shopCount} shop{category.shopCount !== 1 ? 's' : ''}
                      </span>
                      <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 group-hover:bg-burgundy-50 transition-colors">
                        Browse
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sortedCategories.length === 0 && (
          <div className="text-center py-12">
            <Store className="mx-auto h-16 w-16 text-burgundy-400 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy-900 mb-2">No Categories Available</h3>
            <p className="text-burgundy-700 mb-4">
              Categories will appear as shops are added to the platform.
            </p>
            <Link href="/shops">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                Browse All Shops
              </Button>
            </Link>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-beige-200">
            <h3 className="text-2xl font-bold text-burgundy-900 mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-burgundy-700 mb-6 max-w-2xl mx-auto">
              Browse all shops or use our search feature to find exactly what you need. Our platform is constantly growing with new shops and categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shops">
                <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  Browse All Shops
                </Button>
              </Link>
              <Link href="/onboarding/shop">
                <Button variant="outline" className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50">
                  Register Your Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
