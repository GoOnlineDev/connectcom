"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFeaturedShops, useCategories, useSearchShops } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Phone, Store, ShoppingBag } from 'lucide-react';

export default function ShopsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch featured shops for the hero carousel
  const featuredShops = useFeaturedShops(6);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch all categories for the filter dropdown
  const allCategories = useCategories();

  // Carousel auto-loop effect
  useEffect(() => {
    if (!featuredShops.data || featuredShops.data.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredShops.data!.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredShops.data]);

  // Fetch shops with search filters
  const shops = useSearchShops(
    searchTerm || undefined,
    selectedCategory === 'all' ? undefined : selectedCategory || undefined,
    selectedType === 'all' ? undefined : selectedType || undefined,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is handled by the reactive query
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Carousel Section */}
      {featuredShops.data && featuredShops.data.length > 0 && (
        <div className="relative w-full h-72 md:h-96 bg-burgundy-900 overflow-hidden mb-8 md:mb-10 lg:mb-12">
          {/* Carousel Slide */}
          {featuredShops.data.map((shop: any, idx: number) => (
            <div
              key={shop._id}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {shop.shopImageUrl ? (
                <img
                  src={shop.shopImageUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover object-center"
                />
              ) : shop.shopLogoUrl ? (
                <img
                  src={shop.shopLogoUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-burgundy-900/30">
                  <Store className="w-24 h-24 text-white/40" />
                </div>
              )}
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Shop Info Overlay */}
              <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
                  {shop.shopName}
                </h2>
                {shop.categories && shop.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {shop.categories.map((category: string) => (
                      <Badge key={category} variant="outline" className="text-xs border-white/40 text-white bg-black/30">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                <Link href={`/shops/${shop._id}`}>
                  <Button className="bg-white text-burgundy-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-beige-100 hover:text-burgundy-800 transition text-sm">
                    View Shop
                  </Button>
                </Link>
              </div>
              
            </div>
          ))}
          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {featuredShops.data.map((_: unknown, idx: number) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full border-2 ${idx === carouselIndex ? 'bg-white border-white' : 'bg-burgundy-400 border-white/40'}`}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xl p-5 mb-6 border border-burgundy-200 sm:flex sm:flex-wrap sm:justify-between sm:items-end gap-3">
          <div className="flex-1 min-w-[180px] mb-3 sm:mb-0">
            <label className="block text-xs font-medium text-burgundy-900 mb-1">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500 bg-white shadow-sm h-9 text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.data?.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px] mb-3 sm:mb-0">
            <label className="block text-xs font-medium text-burgundy-900 mb-1">
              Shop Type
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500 bg-white shadow-sm h-9 text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product_shop">Product Shops</SelectItem>
                <SelectItem value="service_shop">Service Shops</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto flex gap-2 mt-2 sm:mt-0">
            <Button onClick={clearFilters} variant="outline" className="flex-1 sm:flex-none border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 hover:border-burgundy-400 shadow-sm h-9 text-sm">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {shops.isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-burgundy-600 mx-auto"></div>
            <p className="mt-3 text-burgundy-700 text-sm">Loading shops...</p>
          </div>
        )}

        {/* Empty State */}
        {!shops.isLoading && shops.data && shops.data.length === 0 && (
          <div className="text-center py-10">
            <Store className="mx-auto h-14 w-14 text-burgundy-400 mb-3" />
            <h3 className="text-lg font-semibold text-burgundy-900 mb-2">No shops found</h3>
            <p className="text-burgundy-700 text-sm mb-3">
              Try adjusting your search criteria or browse all available shops.
            </p>
            <Button onClick={clearFilters} className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 text-sm">
              View All Shops
            </Button>
          </div>
        )}

        {/* Shops Grid */}
        {shops.data && shops.data.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-burgundy-900">
                {shops.data.length} Shop{shops.data.length !== 1 ? 's' : ''} Found
              </h2>
              {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
                <p className="text-burgundy-700 text-xs">
                  Filtered results
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {shops.data.map((shop: any) => (
                <Link 
                  key={shop._id} 
                  href={`/shops/${shop._id}`}
                  className="block transform transition-transform hover:scale-105"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-beige-200">
                    {/* Shop Logo */}
                    <div className="relative h-40 bg-gradient-to-br from-beige-100 to-beige-200 rounded-t-lg overflow-hidden">
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
                          <Store className="w-14 h-14 text-burgundy-400" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      {/* Shop Type Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant={shop.shopType === 'product_shop' ? 'default' : 'secondary'} className="bg-burgundy-600 text-white text-xs">
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
                          {shop.categories.slice(0, 2).map((category: string) => (
                            <Badge key={category} variant="outline" className="text-xs border-burgundy-300 text-burgundy-700">
                              {category}
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
                            <Phone className="w-4 h-4" />
                            <span className="truncate">{shop.contactInfo.phone}</span>
                          </div>
                        )}
                        {shop.physicalLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">
                              {typeof shop.physicalLocation === 'string' 
                                ? shop.physicalLocation 
                                : 'Physical Location Available'
                              }
                            </span>
                          </div>
                        )}
                        {shop.operatingHours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="truncate">
                              {typeof shop.operatingHours === 'string' 
                                ? shop.operatingHours 
                                : 'View Hours'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}