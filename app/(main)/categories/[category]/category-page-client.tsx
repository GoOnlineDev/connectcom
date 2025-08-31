"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Phone, Store, ShoppingBag, ArrowLeft, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryPageClientProps {
  categoryName: string;
}

export default function CategoryPageClient({ categoryName }: CategoryPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch shops by category
  const categoryShops = useQuery(api.shops.getShopsByCategory, { 
    category: categoryName,
    limit: 50 
  });

  // Fetch all categories for navigation
  const allCategories = useQuery(api.shops.getAllShopCategories);

  // Filter and sort shops
  const filteredShops = categoryShops?.filter(shop => {
    const matchesSearch = !searchTerm || 
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || shop.shopType === selectedType;
    
    return matchesSearch && matchesType;
  }) || [];

  // Sort shops
  const sortedShops = [...filteredShops].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'oldest':
        return a.createdAt - b.createdAt;
      case 'name':
        return a.shopName.localeCompare(b.shopName);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSortBy('newest');
  };

  if (categoryShops === undefined) {
    return (
      <div className="min-h-screen bg-beige-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-beige-200">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/categories" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryName}</h1>
          <p className="text-white/80 text-lg">
            Discover amazing shops in the {categoryName.toLowerCase()} category
          </p>
          {categoryShops && (
            <p className="text-white/60 mt-2">
              {categoryShops.length} shop{categoryShops.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-beige-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-burgundy-900 mb-2">
                Search Shops
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy-600 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search shops by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-beige-300 focus:border-burgundy-500 focus:ring-burgundy-500"
                />
              </div>
            </div>

            {/* Shop Type Filter */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-burgundy-900 mb-2">
                Shop Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="border-beige-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product_shop">Product Shops</SelectItem>
                  <SelectItem value="service_shop">Service Shops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-burgundy-900 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-beige-300 focus:border-burgundy-500 focus:ring-burgundy-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 hover:border-burgundy-400">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Related Categories */}
        {allCategories && allCategories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-burgundy-900 mb-4">Explore Other Categories</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.slice(0, 8).map((cat) => (
                <Link key={cat} href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Badge 
                    variant={cat === categoryName ? "default" : "outline"} 
                    className={`cursor-pointer hover:bg-burgundy-50 ${
                      cat === categoryName 
                        ? 'bg-burgundy-600 text-white' 
                        : 'border-burgundy-300 text-burgundy-700'
                    }`}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-burgundy-900">
            {sortedShops.length} Shop{sortedShops.length !== 1 ? 's' : ''} Found
          </h2>
          {(searchTerm || selectedType !== 'all') && (
            <p className="text-burgundy-700 text-sm">
              Filtered results
            </p>
          )}
        </div>

        {/* Empty State */}
        {sortedShops.length === 0 && (
          <div className="text-center py-12">
            <Store className="mx-auto h-16 w-16 text-burgundy-400 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy-900 mb-2">No shops found</h3>
            <p className="text-burgundy-700 mb-4">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search criteria or clear the filters.'
                : `No shops available in the ${categoryName} category yet.`
              }
            </p>
            <Button onClick={clearFilters} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Shops Grid */}
        {sortedShops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedShops.map((shop) => (
              <Link 
                key={shop._id} 
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
                        {shop.categories.slice(0, 2).map((cat) => (
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
        )}
      </div>
    </div>
  );
}

