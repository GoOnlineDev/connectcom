'use client';

import Link from 'next/link';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-beige-200">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
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
    <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0">
      {featuredShops.map((shop: any, index: number) => (
        <motion.div
          key={shop._id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="min-w-[80%] md:min-w-[calc(50%-8px)] lg:min-w-0 lg:w-auto snap-center block"
        >
          <Link 
            href={`/shops/${shop._id}`} 
            className="block transform transition-transform hover:scale-105"
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-beige-200">
            {/* Shop Image */}
            <div className="relative h-48 bg-gradient-to-br from-beige-100 to-beige-200 rounded-t-lg">
              {shop.shopImageUrl ? (
                <img
                  src={shop.shopImageUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : shop.shopLogoUrl ? (
                <img
                  src={shop.shopLogoUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Store className="w-16 h-16 text-burgundy-400" />
                </div>
              )}
              {/* Shop Type Badge */}
              <div className="absolute top-3 right-3">
                <Badge variant={shop.shopType === 'product_shop' ? 'default' : 'secondary'} className="bg-burgundy-600 text-white">
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
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-burgundy-900 line-clamp-1">
                {shop.shopName}
              </CardTitle>
              {shop.description && (
                <CardDescription className="line-clamp-2 text-burgundy-700">
                  {shop.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {/* Categories */}
              {shop.categories && shop.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {shop.categories.slice(0, 2).map((cat: string) => (
                    <Badge key={cat} variant="outline" className="text-xs border-burgundy-300 text-burgundy-700">
                      {cat}
                    </Badge>
                  ))}
                  {shop.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs border-burgundy-300 text-burgundy-700">
                      +{shop.categories.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-burgundy-700">
                {shop.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <span className="truncate">{shop.contactInfo.phone}</span>
                  </div>
                )}
                {shop.physicalLocation && (
                  <div className="flex items-center gap-2">
                    <span className="truncate">
                      {typeof shop.physicalLocation === 'string' 
                        ? shop.physicalLocation 
                        : 'Physical Location Available'
                      }
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      ))}
    </div>
  );
} 