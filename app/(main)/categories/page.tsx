"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Store, ShoppingBag, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useShopsByCategory } from '@/hooks/useData';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter categories by search term
  const filteredCategories = categoryStats.filter(cat => {
    if (!searchTerm) return true;
    return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort by shop count (most popular first)
  const sortedCategories = [...filteredCategories].sort((a, b) => b.shopCount - a.shopCount);

  // Category Card Component with Slideshow
  const CategoryCardWithSlideshow = ({ 
    category, 
    index, 
    isPopular = false,
    popularRank 
  }: { 
    category: { name: string; shopCount: number; slug: string }; 
    index: number;
    isPopular?: boolean;
    popularRank?: number;
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Fetch shops for this category
    const { data: categoryShops, isLoading } = useShopsByCategory(category.name, 10);
    
    // Filter shops that have images
    const shopsWithImages = categoryShops?.filter((shop: any) => 
      shop.shopImageUrl || shop.shopLogoUrl
    ) || [];

    // Auto-loop slideshow
    useEffect(() => {
      if (shopsWithImages.length === 0) return;
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % shopsWithImages.length);
      }, 3500); // Change every 3.5 seconds
      
      return () => clearInterval(interval);
    }, [shopsWithImages.length]);

    const hasShopsWithImages = shopsWithImages.length > 0;
    const showSlideshow = !isLoading && hasShopsWithImages;

    return (
      <Link href={`/categories/${category.slug}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-beige-200 overflow-hidden">
          {/* Slideshow or Fallback */}
          <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-beige-100 to-beige-200">
            {showSlideshow ? (
              <>
                {/* Shop Images Slideshow */}
                {shopsWithImages.map((shop: any, idx: number) => (
                  <div
                    key={shop._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    {shop.shopImageUrl ? (
                      <Image
                        src={shop.shopImageUrl}
                        alt={shop.shopName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : shop.shopLogoUrl ? (
                      <Image
                        src={shop.shopLogoUrl}
                        alt={shop.shopName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/50 via-burgundy-900/20 to-transparent"></div>
                  </div>
                ))}
                
                {/* Navigation Dots - only show if more than 1 shop */}
                {shopsWithImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                    {shopsWithImages.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentIndex(idx);
                        }}
                        className={`rounded-full border-2 transition-all ${
                          idx === currentIndex 
                            ? 'bg-white border-white w-2 h-2' 
                            : 'bg-white/40 border-white/60 hover:bg-white/60 w-2 h-2'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Fallback - Store icon centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy-700 group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/30 via-transparent to-transparent"></div>
              </>
            )}
            
            {/* Popular Badge */}
            {isPopular && popularRank && (
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-burgundy-600 text-white">
                  #{popularRank} Popular
                </Badge>
              </div>
            )}
          </div>
          
          {/* Category Info */}
          <CardHeader className="pb-3">
            <CardTitle className={`${isPopular ? 'text-lg' : 'text-base'} font-bold text-burgundy-900 group-hover:text-burgundy-800 transition-colors line-clamp-1`}>
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-burgundy-700">
                {category.shopCount} shop{category.shopCount !== 1 ? 's' : ''}
              </span>
              <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 group-hover:bg-burgundy-50 transition-colors">
                {isPopular ? 'Explore' : 'Browse'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

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
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-600 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 border-beige-300 focus:border-burgundy-500 focus:ring-burgundy-500 h-11 text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-burgundy-600 hover:text-burgundy-800"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-burgundy-700 mt-2 text-center">
              Found {sortedCategories.length} categor{sortedCategories.length !== 1 ? 'ies' : 'y'} matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-burgundy-600" />
            <h2 className="text-2xl font-bold text-burgundy-900">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedCategories.slice(0, 6).map((category, index) => (
              <CategoryCardWithSlideshow 
                key={category.name} 
                category={category} 
                index={index}
                isPopular={true}
                popularRank={index + 1}
              />
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-burgundy-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCategories.map((category, index) => (
              <CategoryCardWithSlideshow 
                key={category.name} 
                category={category} 
                index={index}
                isPopular={false}
              />
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
