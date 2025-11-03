"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Store, ShoppingBag, X } from 'lucide-react';
import { useFeaturedShops, useCategories, useShops } from '@/hooks/useData';
import { slugify } from '@/lib/utils';

export default function HeroSection() {
  const router = useRouter();
  const { data: featuredShops, isLoading } = useFeaturedShops(8);
  const { data: allCategories } = useCategories();
  const { data: allShops } = useShops();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter shops that have images
  const shopsWithImages = featuredShops?.filter((shop: any) => 
    shop.shopImageUrl || shop.shopLogoUrl
  ) || [];

  // Auto-loop slideshow
  useEffect(() => {
    if (shopsWithImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shopsWithImages.length);
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(interval);
  }, [shopsWithImages.length]);

  // Determine if we should show slideshow or fallback
  const hasShopsWithImages = shopsWithImages.length > 0;
  const showSlideshow = !isLoading && hasShopsWithImages;

  // Search functionality
  const searchResults = searchTerm.trim() ? {
    shops: allShops?.filter((shop: any) => 
      shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5) || [],
    categories: allCategories?.filter((cat: string) => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5) || []
  } : { shops: [], categories: [] };

  const hasResults = searchResults.shops.length > 0 || searchResults.categories.length > 0;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shops?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <section className="relative py-12 md:py-16 lg:py-20 px-4 overflow-hidden">
      {/* Simple background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-beige-50/40 via-white to-beige-100/20 z-0"></div>
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-burgundy-900">
              Connect and Create with the best online shops
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-burgundy-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover products and services from independent stores all in one place. Shop with confidence and support small businesses.
            </p>
            
            {/* Unified Search Bar */}
            <div className="pt-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-burgundy-600 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Search shops or categories..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="pl-12 pr-12 h-12 text-base border-2 border-burgundy-200 focus:border-burgundy-500 focus:ring-burgundy-500 rounded-lg shadow-sm bg-white"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setShowResults(false);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-burgundy-600 hover:text-burgundy-800 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchTerm.trim() && hasResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-burgundy-200 max-h-96 overflow-y-auto z-50">
                    {/* Categories Results */}
                    {searchResults.categories.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-burgundy-600 uppercase tracking-wide">
                          Categories
                        </div>
                        {searchResults.categories.map((category: string) => (
                          <Link
                            key={category}
                            href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 rounded-md transition-colors group"
                          >
                            <ShoppingBag className="w-4 h-4 text-burgundy-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-burgundy-900 group-hover:text-burgundy-800 flex-1">
                              {category}
                            </span>
                            <ArrowRight className="w-4 h-4 text-burgundy-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Shops Results */}
                    {searchResults.shops.length > 0 && (
                      <div className="p-2 border-t border-beige-200">
                        <div className="px-3 py-2 text-xs font-semibold text-burgundy-600 uppercase tracking-wide">
                          Shops
                        </div>
                        {searchResults.shops.map((shop: any) => (
                          <Link
                            key={shop._id}
                            href={`/shops/${shop._id}/${slugify(shop.shopName)}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 rounded-md transition-colors group"
                          >
                            <Store className="w-4 h-4 text-burgundy-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-burgundy-900 group-hover:text-burgundy-800 truncate">
                                {shop.shopName}
                              </p>
                              {shop.description && (
                                <p className="text-xs text-burgundy-600 line-clamp-1 mt-0.5">
                                  {shop.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-burgundy-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* View All Results */}
                    {hasResults && (
                      <div className="p-2 border-t border-beige-200">
                        <button
                          type="submit"
                          className="w-full text-center px-4 py-2 text-sm font-medium text-burgundy-700 hover:bg-burgundy-50 rounded-md transition-colors"
                        >
                          View all results for "{searchTerm}"
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* No Results */}
                {showResults && searchTerm.trim() && !hasResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-burgundy-200 p-6 text-center z-50">
                    <p className="text-sm text-burgundy-700">
                      No shops or categories found matching "{searchTerm}"
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Slideshow or Fallback */}
          <div className="relative h-[300px] sm:h-[380px] lg:h-[420px]">
            <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg">
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
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={idx === 0}
                        />
                      ) : shop.shopLogoUrl ? (
                        <Image
                          src={shop.shopLogoUrl}
                          alt={shop.shopName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={idx === 0}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/30 to-transparent"></div>
                      
                      {/* Shop Name Overlay (optional) */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link href={`/shops/${shop._id}/${slugify(shop.shopName)}`}>
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white transition-colors">
                            <p className="text-sm font-semibold text-burgundy-900 line-clamp-1">
                              {shop.shopName}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation Dots */}
                  {shopsWithImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                      {shopsWithImages.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full border-2 transition-all ${
                            idx === currentIndex 
                              ? 'bg-white border-white w-6' 
                              : 'bg-white/40 border-white/60 hover:bg-white/60'
                          }`}
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Fallback PNG */}
                  <Image
                    src="/connectcom.png"
                    alt="ConnectCom Marketplace"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/20 to-transparent"></div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* CTA Buttons - Below slideshow */}
        <div className="flex flex-row gap-4 pt-8 justify-center lg:justify-start">
          <Link href="/shops" className="group">
            <Button 
              variant="default"
              size="lg" 
              className="px-6 py-6 text-base font-semibold rounded-lg !bg-burgundy-900 !text-white hover:!bg-burgundy-800 hover:!shadow-lg transition-all duration-300"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/onboarding/shop">
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 py-6 text-base font-semibold rounded-lg !border-2 !border-burgundy-900 !text-burgundy-900 hover:!bg-burgundy-50 hover:!text-burgundy-800 hover:!border-burgundy-800 transition-all duration-300"
            >
              Register Your Shop
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 