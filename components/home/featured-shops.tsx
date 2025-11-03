'use client';

import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, ShoppingBag } from 'lucide-react';
import { useFeaturedShops } from '@/hooks/useData';
import { motion } from "framer-motion";

export default function FeaturedShops() {
  const { data: featuredShops, isLoading } = useFeaturedShops(6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:flex md:space-x-4 md:gap-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-beige-200">
            <Skeleton className="h-32 md:h-40 lg:h-48 w-full rounded-t-lg" />
            <div className="p-3 md:p-4">
              <Skeleton className="h-4 md:h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!featuredShops || featuredShops.length === 0) {
    return (
      <div className="text-center py-12">
        <Store className="mx-auto h-16 w-16 text-burgundy-400 mb-4" />
        <h3 className="text-xl font-semibold text-burgundy-900 mb-2">No featured shops yet</h3>
        <p className="text-burgundy-700">
          Check back soon for featured shops and services!
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0 lg:overflow-x-visible"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {featuredShops.map((shop: any, index: number) => (
        <motion.div
          key={shop._id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="min-w-[calc(50%-8px)] md:min-w-[calc(50%-8px)] lg:min-w-0 snap-center block"
        >
          <Link 
            href={`/shops/${shop._id}/${slugify(shop.shopName)}`} 
            className="block transform transition-transform hover:scale-105"
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-beige-200">
            {/* Shop Image */}
            <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-beige-100 to-beige-200 rounded-t-lg overflow-hidden">
              {shop.shopImageUrl ? (
                <img
                  src={shop.shopImageUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover"
                />
              ) : shop.shopLogoUrl ? (
                <img
                  src={shop.shopLogoUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Store className="w-12 h-12 md:w-16 md:h-16 text-burgundy-400" />
                </div>
              )}
              {/* Shop Type Badge */}
              <div className="absolute top-2 right-2">
                <Badge variant={shop.shopType === 'product_shop' ? 'default' : 'secondary'} className="bg-burgundy-600 text-white text-xs px-2 py-0.5">
                  {shop.shopType === 'product_shop' ? (
                    <>
                      <ShoppingBag className="w-3 h-3 mr-1" /> Products
                    </>
                  ) : (
                    <>
                      <Store className="w-3 h-3 mr-1" /> Services
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2 px-4 pt-3">
              <CardTitle className="text-base md:text-lg font-bold text-burgundy-900 line-clamp-1">
                {shop.shopName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              {/* Categories - Only show if exists */}
              {shop.categories && shop.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {shop.categories.slice(0, 1).map((cat: string) => (
                    <Badge key={cat} variant="outline" className="text-xs border-burgundy-300 text-burgundy-700 px-2 py-0.5">
                      {cat}
                    </Badge>
                  ))}
                  {shop.categories.length > 1 && (
                    <Badge variant="outline" className="text-xs border-burgundy-300 text-burgundy-700 px-2 py-0.5">
                      +{shop.categories.length - 1}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      ))}
    </div>
  );
} 