'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCategories, useShops, useShopsByCategory } from '@/hooks/useData';
import { Skeleton } from '@/components/ui/skeleton';

// Category icons mapping
const categoryIcons = {
  "Electronics": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  "Fashion": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "Home & Garden": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "Beauty & Health": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  "Toys & Games": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "Sports & Outdoors": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "Food & Beverages": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "Books & Media": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "default": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
};

export default function ShopCategories() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allShops, isLoading: shopsLoading } = useShops();

  if (!categories || !allShops || categoriesLoading || shopsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            <Skeleton className="h-28 sm:h-32 w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-burgundy-700 text-lg font-medium mb-2">No Categories Available</div>
        <p className="text-burgundy-600">Categories will appear as shops are added to the platform.</p>
      </div>
    );
  }

  // Calculate shop count for each category
  const categoryStats = categories.map((category: string) => {
    const shopCount = allShops.filter((shop: any) => 
      shop.categories?.includes(category)
    ).length;
    
    return {
      name: category,
      shopCount,
      icon: categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default
    };
  }).filter((cat: any) => cat.shopCount > 0); // Only show categories with shops

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {categoryStats.map((category: any, index: number) => (
        <CategoryCard 
          key={category.name} 
          category={category} 
          index={index}
        />
      ))}
    </div>
  );
}

// Individual category card component with slideshow
function CategoryCard({ category, index }: { category: any; index: number }) {
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
    <Link 
      href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
      className="group bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col h-full">
        {/* Slideshow or Fallback */}
        <div className="relative h-28 sm:h-32 overflow-hidden bg-gradient-to-br from-beige-100 to-beige-200">
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
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : shop.shopLogoUrl ? (
                    <Image
                      src={shop.shopLogoUrl}
                      alt={shop.shopName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/40 via-burgundy-900/20 to-transparent"></div>
                </div>
              ))}
              
              {/* Navigation Dots - only show if more than 1 shop */}
              {shopsWithImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                  {shopsWithImages.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentIndex(idx);
                      }}
                      className={`rounded-full border-2 transition-all ${
                        idx === currentIndex 
                          ? 'bg-white border-white w-1.5 h-1.5' 
                          : 'bg-white/40 border-white/60 hover:bg-white/60 w-1.5 h-1.5'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Fallback - Category icon centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy-700 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/30 via-transparent to-transparent"></div>
            </>
          )}
          
          {/* Category icon overlay in top-right corner */}
          {showSlideshow && (
            <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-burgundy-700 shadow-sm z-20 transform transition-transform group-hover:rotate-12">
              <div className="w-3 h-3 sm:w-4 sm:h-4">
                {category.icon}
              </div>
            </div>
          )}
        </div>
        
        {/* Category Info */}
        <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-b from-white to-beige/30">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-burgundy-900 group-hover:text-burgundy-800 transition-colors line-clamp-1">
              {category.name}
            </h3>
            <p className="text-xs text-burgundy-700 mt-0.5">{category.shopCount} shop{category.shopCount !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="mt-2 pt-2 border-t border-burgundy-200">
            <span className="text-xs font-medium text-burgundy-800 flex items-center">
              Browse Category
              <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 