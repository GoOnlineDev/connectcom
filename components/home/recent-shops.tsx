'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRecentShops } from '@/hooks/useData';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from "framer-motion";

export default function RecentShops() {
  const { data: recentShops, isLoading } = useRecentShops(4);

  if (isLoading || !recentShops) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_: unknown, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
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

  if (recentShops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-burgundy-700 text-lg font-medium mb-2">No Recent Shops</div>
        <p className="text-burgundy-600">New shops will appear here as they join the platform.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-x-0">
      {recentShops.map((shop: any, index: number) => (
        <motion.div
          key={shop._id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="min-w-[80%] md:min-w-[calc(50%-12px)] lg:min-w-0 lg:w-auto snap-center block"
        >
          <Link 
            href={`/shops/${shop._id}`} 
            className="block transform transition-transform hover:scale-105"
          >
            <div className="relative h-32 overflow-hidden">
              <Image
                src={shop.shopImageUrl || '/logo.png'}
                alt={shop.shopName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* New badge */}
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-medium">
                  New
                </span>
              </div>
              
              {/* Shop type badge */}
              <div className="absolute top-2 right-2">
                <span className="text-xs px-2 py-1 bg-white/90 text-burgundy rounded-full shadow-sm font-medium">
                  {shop.shopType === 'product_shop' ? 'Products' : 'Services'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-burgundy group-hover:text-burgundy-light transition-colors line-clamp-1 mb-1">
                {shop.shopName}
              </h3>
              
              <p className="text-burgundy/70 text-sm mb-3 line-clamp-2">
                {shop.description || `Explore amazing ${shop.shopType === 'product_shop' ? 'products' : 'services'} from ${shop.shopName}`}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-burgundy/60">
                  {shop.shopType === 'product_shop' 
                    ? `${shop.productIds?.length || 0} products`
                    : `${shop.serviceIds?.length || 0} services`
                  }
                </span>
                <span className="text-xs font-medium text-burgundy bg-beige-dark px-2 py-1 rounded-md inline-flex items-center group-hover:bg-burgundy/10 transition-colors">
                  Explore
                  <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

