"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Phone, Store, ShoppingBag } from 'lucide-react';

const SHOP_CATEGORIES = [
  'Fashion', 'Food & Beverage', 'Technology', 'Health & Beauty', 
  'Home & Garden', 'Sports & Recreation', 'Education', 'Professional Services'
];

export default function ShopsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch featured shops for the hero carousel
  const featuredShops = useQuery(api.shops.getFeaturedShops, { limit: 6 });
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Carousel auto-loop effect
  useEffect(() => {
    if (!featuredShops || featuredShops.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredShops.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredShops]);

  // Fetch shops with search filters
  const shops = useQuery(api.shops.searchShops, {
    searchTerm: searchTerm || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory || undefined,
    shopType: selectedType === 'all' ? undefined : selectedType || undefined,
  });

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
    <div className="min-h-screen bg-beige">
      {/* Hero Carousel Section */}
      {featuredShops && featuredShops.length > 0 && (
        <div className="relative w-full h-72 md:h-96 bg-gradient-to-br from-burgundy/80 to-burgundy-dark overflow-hidden mb-10">
          {/* Carousel Slide */}
          {featuredShops.map((shop, idx) => (
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
                <div className="flex items-center justify-center w-full h-full bg-burgundy/30">
                  <Store className="w-24 h-24 text-white/40" />
                </div>
              )}
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Shop Info Overlay */}
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">{shop.shopName}</h2>
                {shop.categories && shop.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {shop.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs border-white/40 text-white bg-black/30">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                <Link href={`/shops/${shop._id}`}>
                  <Button className="bg-white text-burgundy font-semibold px-6 py-2 rounded-full shadow hover:bg-burgundy hover:text-white transition">
                    View Shop
                  </Button>
                </Link>
              </div>
              {/* Search Bar Overlay */}
              <form onSubmit={handleSearch} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy/60 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search shops, products, or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg rounded-full border-0 bg-white/90 text-burgundy placeholder:text-burgundy/60 shadow"
                  />
                </div>
              </form>
            </div>
          ))}
          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {featuredShops.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 ${idx === carouselIndex ? 'bg-white border-white' : 'bg-burgundy/40 border-white/40'}`}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SHOP_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product_shop">Product Shops</SelectItem>
                  <SelectItem value="service_shop">Service Shops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {shops === undefined && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
            <p className="mt-4 text-burgundy/80">Loading shops...</p>
          </div>
        )}

        {/* Empty State */}
        {shops && shops.length === 0 && (
          <div className="text-center py-12">
            <Store className="mx-auto h-16 w-16 text-burgundy/40 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy mb-2">No shops found</h3>
            <p className="text-burgundy/80 mb-4">
              Try adjusting your search criteria or browse all available shops.
            </p>
            <Button onClick={clearFilters} className="bg-burgundy hover:bg-burgundy-dark">
              View All Shops
            </Button>
          </div>
        )}

        {/* Shops Grid */}
        {shops && shops.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-burgundy">
                {shops.length} Shop{shops.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => (
                <Link 
                  key={shop._id} 
                  href={`/shops/${shop._id}`}
                  className="block transform transition-transform hover:scale-105"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {/* Shop Logo */}
                    <div className="relative h-48 bg-gradient-to-br from-beige to-beige-dark rounded-t-lg">
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
                          <Store className="w-16 h-16 text-burgundy/40" />
                        </div>
                      )}
                      {/* Shop Type Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant={shop.shopType === 'product_shop' ? 'default' : 'secondary'}>
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
                      <CardTitle className="text-lg font-bold text-burgundy line-clamp-1">
                        {shop.shopName}
                      </CardTitle>
                      {shop.description && (
                        <CardDescription className="line-clamp-2">
                          {shop.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Categories */}
                      {shop.categories && shop.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {shop.categories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {shop.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{shop.categories.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                      {/* Contact Info */}
                      <div className="space-y-2 text-sm text-burgundy/80">
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