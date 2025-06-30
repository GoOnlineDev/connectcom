"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Store, 
  ShoppingBag, 
  Shirt, 
  Utensils, 
  Laptop, 
  Heart, 
  Home, 
  Dumbbell, 
  GraduationCap, 
  Briefcase,
  Package
} from 'lucide-react';

const SHOP_CATEGORIES = [
  { name: 'Fashion', icon: Shirt, description: 'Clothing, accessories, and style', color: 'from-pink-500 to-rose-600' },
  { name: 'Food & Beverage', icon: Utensils, description: 'Restaurants, cafes, and food shops', color: 'from-orange-500 to-red-600' },
  { name: 'Technology', icon: Laptop, description: 'Electronics, gadgets, and tech services', color: 'from-blue-500 to-indigo-600' },
  { name: 'Health & Beauty', icon: Heart, description: 'Healthcare, wellness, and beauty', color: 'from-emerald-500 to-teal-600' },
  { name: 'Home & Garden', icon: Home, description: 'Home decor, furniture, and gardening', color: 'from-green-500 to-emerald-600' },
  { name: 'Sports & Recreation', icon: Dumbbell, description: 'Sports equipment and recreation', color: 'from-purple-500 to-violet-600' },
  { name: 'Education', icon: GraduationCap, description: 'Learning, tutoring, and courses', color: 'from-yellow-500 to-orange-600' },
  { name: 'Professional Services', icon: Briefcase, description: 'Business and professional services', color: 'from-gray-500 to-slate-600' },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch shops to get category statistics
  const allShops = useQuery(api.shops.getAllApprovedShops);

  // Filter categories based on search term
  const filteredCategories = SHOP_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate shop counts per category
  const getCategoryShopCount = (categoryName: string) => {
    if (!allShops) return 0;
    return allShops.filter(shop => 
      shop.categories?.includes(categoryName)
    ).length;
  };

  const getTotalShopsCount = () => {
    return allShops?.length || 0;
  };

  return (
    <div className="min-h-screen bg-beige">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-burgundy to-burgundy-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover shops organized by categories that match your interests and needs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy/60 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-full border-0 bg-white text-burgundy placeholder:text-burgundy/60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-burgundy">{filteredCategories.length}</div>
              <div className="text-burgundy/70">Categories Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-burgundy">{getTotalShopsCount()}</div>
              <div className="text-burgundy/70">Total Shops</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-burgundy">
                {filteredCategories.reduce((sum, cat) => sum + getCategoryShopCount(cat.name), 0)}
              </div>
              <div className="text-burgundy/70">Shops in Selected Categories</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-burgundy/40 mb-4" />
            <h3 className="text-xl font-semibold text-burgundy mb-2">No categories found</h3>
            <p className="text-burgundy/80">
              Try adjusting your search to find the categories you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const shopCount = getCategoryShopCount(category.name);
              const Icon = category.icon;
              
              return (
                <Link 
                  key={category.name} 
                  href={`/shops?category=${encodeURIComponent(category.name)}`}
                  className="block transform transition-transform hover:scale-105"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-burgundy/20 overflow-hidden">
                    {/* Category Header with Gradient */}
                    <div className={`relative h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="w-12 h-12 text-white" />
                      
                      {/* Shop Count Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                          {shopCount} shops
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-burgundy">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-burgundy/70">
                        {category.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-burgundy/80">
                          <Store className="w-4 h-4" />
                          <span>{shopCount} {shopCount === 1 ? 'shop' : 'shops'}</span>
                        </div>
                        
                        {shopCount > 0 && (
                          <Badge 
                            variant="outline" 
                            className="border-burgundy/30 text-burgundy hover:bg-burgundy/10"
                          >
                            Browse →
                          </Badge>
                        )}
                      </div>

                      {shopCount === 0 && (
                        <div className="mt-3 text-xs text-burgundy/60 bg-burgundy/5 rounded-lg p-2">
                          No shops available in this category yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="border-burgundy/20 bg-gradient-to-r from-burgundy/5 to-burgundy/10 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-burgundy">Can't find what you're looking for?</CardTitle>
              <CardDescription>
                Browse all available shops or search for specific products and services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/shops" className="block">
                <div className="w-full bg-burgundy hover:bg-burgundy-dark text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Browse All Shops
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
