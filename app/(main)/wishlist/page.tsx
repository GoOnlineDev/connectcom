"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Store, 
  ShoppingBag,
  Package,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { slugify } from '@/lib/utils';

export default function WishlistPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'product' | 'service'>('all');

  // Fetch wishlist data
  const allWishlistItems = useQuery(api.wishlists.getUserWishlist, {});
  const wishlistCount = useQuery(api.wishlists.getWishlistCount, {});

  // Mutations
  const removeFromWishlist = useMutation(api.wishlists.removeFromWishlist);
  const clearWishlist = useMutation(api.wishlists.clearWishlist);
  const addToCart = useMutation(api.carts.addToCart);

  // Filter wishlist items based on active filter
  const wishlistItems = allWishlistItems?.filter(item => {
    if (activeFilter === 'all') return true;
    return item.itemType === activeFilter;
  }) || [];

  const handleRemoveFromWishlist = async (itemId: Id<"products"> | Id<"services">) => {
    try {
      const result = await removeFromWishlist({ itemId });
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      const result = await addToCart({
        itemType: item.itemType,
        itemId: item.itemId,
        shopId: item.shopId,
        quantity: 1,
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Remove from wishlist after successful addition to cart
        await removeFromWishlist({ itemId: item.itemId });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart or remove from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      const result = await clearWishlist();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    // Format as Ugandan Shillings (UG)
    // Price is already in shillings, no conversion needed
    return `UG ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Loading state
  if (allWishlistItems === undefined || wishlistCount === undefined) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto"></div>
          <p className="mt-4 text-burgundy-700">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (!allWishlistItems || allWishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-beige-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-burgundy-100 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-1.5 text-burgundy-700 hover:text-burgundy-800 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Browse Shops</span>
              <span className="inline sm:hidden">Shop</span>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 sm:py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm border border-beige-200">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-burgundy-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-burgundy-900 mb-3 sm:mb-4">Your Wishlist is Empty</h1>
            <p className="text-sm sm:text-base text-burgundy-700 mb-6 sm:mb-8">
              Save items you love to your wishlist and come back to them later.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white h-10 sm:h-11 text-sm sm:text-base">
                <Link href="/shops">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Shops
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 h-10 sm:h-11 text-sm sm:text-base"
              >
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Count items by type
  const productCount = allWishlistItems.filter(item => item.itemType === 'product').length;
  const serviceCount = allWishlistItems.filter(item => item.itemType === 'service').length;

  return (
    <div className="min-h-screen bg-beige-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-burgundy-100 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/shops" 
              className="inline-flex items-center gap-1.5 text-burgundy-700 hover:text-burgundy-800 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Browse Shops</span>
              <span className="inline sm:hidden">Shop</span>
            </Link>
            
            {allWishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearWishlist}
                className="border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Clear Wishlist</span>
                <span className="inline sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-700" />
            <h1 className="text-xl sm:text-2xl font-bold text-burgundy-900">My Wishlist</h1>
            <Badge className="bg-burgundy-600 text-white text-xs sm:text-sm">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-burgundy-600 hover:bg-burgundy-700 text-white w-9 h-9' : 'border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 w-9 h-9'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-burgundy-600 hover:bg-burgundy-700 text-white w-9 h-9' : 'border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 w-9 h-9'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-3 w-full sm:max-w-md mx-auto h-10 sm:h-auto">
            <TabsTrigger value="all" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              All ({allWishlistItems.length})
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Products ({productCount})
            </TabsTrigger>
            <TabsTrigger value="service" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Services ({serviceCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm border border-beige-200">
              {activeFilter === 'product' ? (
                <Package className="w-10 h-10 text-burgundy-400" />
              ) : activeFilter === 'service' ? (
                <Store className="w-10 h-10 text-burgundy-400" />
              ) : (
                <Heart className="w-10 h-10 text-burgundy-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-burgundy-900 mb-2">
              No {activeFilter === 'all' ? '' : activeFilter + 's'} in your wishlist
            </h3>
            <p className="text-burgundy-700 text-sm mb-4">
              {activeFilter === 'all' 
                ? 'Your filtered wishlist is empty'
                : `You haven't saved any ${activeFilter}s to your wishlist yet`
              }
            </p>
            <Button asChild className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 text-sm h-10">
              <Link href="/shops">
                Browse {activeFilter === 'all' ? 'Shops' : activeFilter === 'product' ? 'Products' : 'Services'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "space-y-4"
          }>
            {wishlistItems.map((item) => (
              <Card 
                key={item._id} 
                className={`border border-burgundy-200 hover:shadow-lg hover:border-burgundy-300 transition-all bg-white ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {/* Item Image */}
                    <div className="relative h-48 sm:h-56 bg-gradient-to-br from-beige-100 to-beige-200 rounded-t-lg overflow-hidden">
                      {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                        <img
                          src={item.itemDetails.imageUrls[0]}
                          alt={item.itemDetails.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          {item.itemType === "product" ? (
                            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-burgundy-400" />
                          ) : (
                            <Store className="w-12 h-12 sm:w-16 sm:h-16 text-burgundy-400" />
                          )}
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Price Badge */}
                      {item.itemType === "product" && item.itemDetails.price && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-burgundy-600 text-white text-sm font-semibold px-3 py-1">
                            {formatPrice(item.itemDetails.price)}
                          </Badge>
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(item.itemId)}
                        className="absolute top-3 left-3 w-9 h-9 p-0 bg-white/95 hover:bg-white border-red-200 text-red-600 hover:bg-red-50 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg font-bold text-burgundy-900 line-clamp-2 mb-2">
                        {item.itemDetails.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-burgundy-700 text-sm min-h-[2.5rem]">
                        {item.itemDetails.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 pb-4 space-y-3">
                      {/* Shop Info */}
                      <div className="flex items-center gap-2 pb-2 border-b border-beige-200">
                        <div className="w-6 h-6 bg-gradient-to-br from-beige-100 to-beige-200 rounded flex items-center justify-center border border-beige-300 shrink-0">
                          {item.shopDetails.shopLogoUrl ? (
                            <img
                              src={item.shopDetails.shopLogoUrl}
                              alt={item.shopDetails.shopName}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Store className="w-3.5 h-3.5 text-burgundy-400" />
                          )}
                        </div>
                        <span className="text-sm text-burgundy-700 truncate flex-1">
                          {item.shopDetails.shopName}
                        </span>
                      </div>

                      {/* Service Pricing */}
                      {item.itemType === "service" && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-burgundy-900">
                            {item.itemDetails.pricing || "Contact for pricing"}
                          </p>
                          {item.itemDetails.duration && (
                            <p className="text-xs text-burgundy-600">
                              Duration: {item.itemDetails.duration}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white h-10 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 h-10 px-3"
                        >
                          <Link href={`/shops/${item.shopId}/${slugify(item.shopDetails.shopName)}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <>
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-beige-100 to-beige-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-beige-300 overflow-hidden">
                      {item.itemType === "product" && item.itemDetails.imageUrls && item.itemDetails.imageUrls.length > 0 ? (
                        <img
                          src={item.itemDetails.imageUrls[0]}
                          alt={item.itemDetails.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-burgundy-400">
                          {item.itemType === "product" ? (
                            <Package className="w-10 h-10 sm:w-12 sm:h-12" />
                          ) : (
                            <Store className="w-10 h-10 sm:w-12 sm:h-12" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-burgundy-900 text-base sm:text-lg leading-tight">
                            {item.itemDetails.name}
                          </h3>
                          <Badge variant="outline" className="border-burgundy-300 text-burgundy-700 text-xs shrink-0">
                            {item.itemType === "product" ? "Product" : "Service"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-burgundy-700 line-clamp-2 mb-2">
                          {item.itemDetails.description || 'No description available'}
                        </p>

                        {/* Shop Info */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-gradient-to-br from-beige-100 to-beige-200 rounded flex items-center justify-center border border-beige-300 shrink-0">
                            {item.shopDetails.shopLogoUrl ? (
                              <img
                                src={item.shopDetails.shopLogoUrl}
                                alt={item.shopDetails.shopName}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <Store className="w-3 h-3 text-burgundy-400" />
                            )}
                          </div>
                          <span className="text-sm text-burgundy-600 truncate">
                            {item.shopDetails.shopName}
                          </span>
                        </div>

                        {/* Price/Pricing */}
                        <div>
                          {item.itemType === "product" && item.itemDetails.price ? (
                            <div className="text-lg font-bold text-burgundy-900">
                              {formatPrice(item.itemDetails.price)}
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-burgundy-700">
                              {item.itemDetails.pricing || "Contact for pricing"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 sm:ml-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRemoveFromWishlist(item.itemId)}
                            className="w-9 h-9 p-0 border-red-200 text-red-600 hover:bg-red-50"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleAddToCart(item)}
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white w-9 h-9"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 h-9 text-sm"
                          size="sm"
                        >
                          <Link href={`/shops/${item.shopId}/${slugify(item.shopDetails.shopName)}`}>
                            View Shop
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <Card className="border border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-burgundy-100 max-w-sm sm:max-w-md mx-auto">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl text-burgundy-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button asChild variant="primary" className="w-full" size="lg">
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <Link href="/shops">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
